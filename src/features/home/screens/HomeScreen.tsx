import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { HomeHeader } from '../components/HomeHeader';
import { CaloriesSummaryCard } from '../components/CaloriesSummaryCard';
import { WeekDaysRow } from '../components/WeekDaysRow';
import { MealsPanel } from '../components/MealsPanel';
import { HomeTopBar } from '../components/HomeTopBar';
import { DateNavigator } from '../components/DateNavigator';

import type { TabParamList } from '@/app/navigation/types';
import { useTheme } from '@/shared/hooks/useTheme';
import { useProfileContext } from '@/features/profile/context/ProfileContext';
import { useConsumedCalories } from '../hooks/useConsumedCalories';
import { useSummaryLayout } from '../hooks/useSummaryLayout';
import { useHomeScrollAnimation } from '../hooks/useHomeScrollAnimation';
import { useWeekDays } from '../hooks/useWeekDays';
import { getConsumedProgress } from '../utils';
import { toApiDate } from '@/shared/util/date';
import { styles } from '../styles';

type Props = BottomTabScreenProps<TabParamList, 'Home'>;
type GoalType = 'lose' | 'maintain' | 'gain';

const MEAL_META: { key: 'breakfast' | 'lunch' | 'dinner' | 'snack'; title: string; icon: string; id: number }[] = [
  { key: 'breakfast', id: 1, title: 'صبحانه', icon: 'food-apple-outline' },
  { key: 'lunch', id: 2, title: 'ناهار', icon: 'silverware-fork-knife' },
  { key: 'dinner', id: 3, title: 'شام', icon: 'food-variant' },
  { key: 'snack', id: 4, title: 'میان‌وعده', icon: 'cookie-outline' },
];

export function HomeScreen(_: Props) {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const { profile, calorieTargets, isLoading: profileLoading } = useProfileContext();

  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [goalType, setGoalType] = useState<GoalType>('maintain');

  // 👇 تاریخ انتخابی (پیش‌فرض: امروز)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const compact = width < 360;
  const pagePadding = compact ? t.spacing.lg : t.spacing.xl;
  const ringSize = compact ? 160 : 190;
  const fontFamily = t.typography.family;

  const { today, weekDays } = useWeekDays();

  const { summaryLayout, onSummaryLayout } = useSummaryLayout({
    y: 80,
    height: 270,
  });

  const {
    isHeaderVisible,
    handleScroll,
    summaryOpacity,
    summaryScale,
    topBarOpacity,
    topBarTranslateY,
  } = useHomeScrollAnimation({ summaryLayout });

  // 👇 تاریخ انتخابی به هوک پاس داده می‌شود
  const { consumedCalories, mealsRaw, isLoading: mealsLoading } =
    useConsumedCalories(selectedDate);

  // 👇 رشته تاریخ برای API و MealsPanel (YYYY-MM-DD)
  const dateParam = useMemo(() => toApiDate(selectedDate), [selectedDate]);

  const mealsForPanel = useMemo(() => {
    return MEAL_META.map((meta) => {
      const items = mealsRaw[meta.key] ?? [];
      return {
        id: meta.id,
        title: meta.title,
        icon: meta.icon,
        items: items.map((m: any) => ({
          id: String(m.id),
          name: m.food_name,
          calories: Number(m.calories) || 0,
          amount: Number(m.amount) || 1,
          unit: m.unit,
        })),
        calories: items.reduce(
          (s: number, m: any) =>
            s + (Number(m.calories) || 0) * (Number(m.amount) || 1),
          0
        ),
      };
    });
  }, [mealsRaw]);

  const dailyGoal = useMemo(() => {
    if (!calorieTargets) return null;
    if (goalType === 'lose') return calorieTargets.lose;
    if (goalType === 'gain') return calorieTargets.gain;
    return calorieTargets.maintain;
  }, [calorieTargets, goalType]);

  const progress = getConsumedProgress(consumedCalories, dailyGoal ?? undefined);

  // 👇 dateLabel از تاریخ انتخابی ساخته می‌شود
  const dateLabel = selectedDate.toLocaleDateString('fa-IR', {
    day: 'numeric',
    month: 'long',
  });

  if (profileLoading || !calorieTargets || dailyGoal == null) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[styles.safeArea, { backgroundColor: t.colors.greenSurface }]}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={t.colors.orange} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: t.colors.greenSurface }]}
    >
      <View style={styles.appFrame}>
        <Animated.ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View
            style={[
              styles.hero,
              {
                paddingHorizontal: pagePadding,
                paddingTop: compact ? 16 : 24,
              },
            ]}
          >
            <HomeHeader compact={compact} />

            <View
              onLayout={onSummaryLayout}
              style={[styles.summaryArea, { minHeight: compact ? 230 : 270 }]}
            >
              <Animated.View
                pointerEvents={isHeaderVisible ? 'none' : 'auto'}
                accessibilityElementsHidden={isHeaderVisible}
                importantForAccessibility={
                  isHeaderVisible ? 'no-hide-descendants' : 'auto'
                }
                style={[
                  styles.summaryContent,
                  {
                    opacity: summaryOpacity,
                    transform: [{ scale: summaryScale }],
                  },
                ]}
              >
                <CaloriesSummaryCard
                  compact={compact}
                  ringSize={ringSize}
                  consumed={consumedCalories}
                  goal={dailyGoal}
                  maintain={calorieTargets.maintain}
                  lose={calorieTargets.lose}
                  gain={calorieTargets.gain}
                  goalType={goalType}
                />
              </Animated.View>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontFamily,
                  fontSize: 12,
                  color: t.colors.muted,
                  textAlign: 'right',
                  writingDirection: 'rtl',
                  marginBottom: 6,
                }}
              >
                هدف من
              </Text>
              <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
                {(
                  [
                    { key: 'lose', label: 'کاهش وزن' },
                    { key: 'maintain', label: 'ثبات' },
                    { key: 'gain', label: 'افزایش وزن' },
                  ] as { key: GoalType; label: string }[]
                ).map((opt) => {
                  const active = goalType === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      onPress={() => setGoalType(opt.key)}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: active ? t.colors.orange : t.colors.greenTrack,
                        backgroundColor: active ? t.colors.peachSoft : t.colors.white,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily,
                          fontSize: 12,
                          color: active ? t.colors.orange : t.colors.muted,
                        }}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 👇 انتخاب تاریخ */}
            <DateNavigator
              date={selectedDate}
              onChange={setSelectedDate}
              theme={t}
              fontFamily={fontFamily}
            />

            {/* <WeekDaysRow weekDays={weekDays} theme={t} /> */}
          </View>

          <MealsPanel
            meals={mealsForPanel as any}
            dateLabel={dateLabel}
            date={dateParam}
            compact={compact}
            pagePadding={pagePadding}
            selectedMeal={selectedMeal}
            onSelectMeal={setSelectedMeal}
            onDismissNotice={() => setSelectedMeal(null)}
            theme={t}
          />
        </Animated.ScrollView>

        <HomeTopBar
          consumedCalories={consumedCalories}
          dailyGoal={dailyGoal}
          progress={progress}
          compact={compact}
          pagePadding={pagePadding}
          opacity={topBarOpacity}
          translateY={topBarTranslateY}
          isHeaderVisible={isHeaderVisible}
          theme={t}
        />
      </View>
    </SafeAreaView>
  );
}