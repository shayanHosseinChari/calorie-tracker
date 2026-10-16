import React, { useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { HomeHeader } from '../components/HomeHeader';
import { CaloriesSummaryCard } from '../components/CaloriesSummaryCard';

import type { TabParamList } from '@/app/navigation/types';
import { MEALS } from '../data';
import { useTheme } from '@/shared/hooks/useTheme';

import { useSummaryLayout } from '../hooks/useSummaryLayout';
import { useHomeScrollAnimation } from '../hooks/useHomeScrollAnimation';
import { useWeekDays } from '../hooks/useWeekDays';
import { getConsumedProgress } from '../utils';

import { WeekDaysRow } from '../components/WeekDaysRow';
import { MealsPanel } from '../components/MealsPanel';
import { HomeTopBar } from '../components/HomeTopBar';
import { styles } from '../styles';

type Props = BottomTabScreenProps<TabParamList, 'Home'> & {
  consumedCalories?: number;
  dailyGoal?: number;
};

export function HomeScreen({ consumedCalories, dailyGoal }: Props) {
  const t = useTheme();
  const { width } = useWindowDimensions();

  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

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

  const progress = getConsumedProgress(consumedCalories, dailyGoal);

  const dateLabel = today.toLocaleDateString('fa-IR', {
    day: 'numeric',
    month: 'long',
  });

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
              style={[
                styles.summaryArea,
                { minHeight: compact ? 230 : 270 },
              ]}
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
                <CaloriesSummaryCard compact={compact} ringSize={ringSize} />
              </Animated.View>
            </View>

            <WeekDaysRow weekDays={weekDays} theme={t} />
          </View>

          <MealsPanel
            meals={MEALS}
            dateLabel={dateLabel}
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