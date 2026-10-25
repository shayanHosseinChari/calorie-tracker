import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { MEALS } from '../data';

import { MealCard, type MealFood } from '@/shared/components/MealCard';
import { useNavigation } from '@react-navigation/native';
import { useMeals } from '@/features/meals/hooks/useMeals';

interface Props {
  meals: typeof MEALS;
  dateLabel: string;
  date: string;            // تاریخ انتخاب‌شده (YYYY-MM-DD)
  compact: boolean;
  pagePadding: number;
  selectedMeal: string | null;
  onSelectMeal: (title: string) => void;
  onDismissNotice: () => void;
  theme: any;
}

export function MealsPanel({
  meals,
  dateLabel,
  date,
  compact,
  pagePadding,
  selectedMeal,
  onSelectMeal,
  onDismissNotice,
  theme: t,
}: Props) {
  const fontFamily = t.typography.family;
  const navigation = useNavigation<any>();

  const { data: mealsData } = useMeals(date);

  // 👇 تشخیص اینکه تاریخ انتخابی امروز است یا نه
  const isToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}` === date;
  }, [date]);

  // merge داده‌ی API با ثابت‌های UI (MEALS)
  const mergedMeals = useMemo(() => {
    const serverMeals = mealsData?.meals ?? [];
    return meals.map((uiMeal) => {
      const server = serverMeals.find(
        (m: any) => String(m.meal_id) === String(uiMeal.id)
      );
      const foods: MealFood[] = (server?.foods ?? []).map((f: any) => ({
        id: f.id,
        food_id: f.food_id,
        food_name: f.food_name,
        calories: f.calories,
        amount: f.amount,
        unit: f.unit,
      }));
      return {
        ...uiMeal,
        foods,
        itemsCount: foods.length,
        calories:
          server?.total_calories ??
          foods.reduce((s, f) => s + f.calories * f.amount, 0),
        serverMealId: server?.id,
        mealType: server?.meal_id ?? uiMeal.id,
        date,
      };
    });
  }, [meals, mealsData, date]);

  return (
    <View
      style={[
        styles.mealsPanel,
        {
          backgroundColor: t.colors.background,
          paddingHorizontal: pagePadding,
        },
      ]}
    >
      <View style={[styles.panelHandle, { backgroundColor: t.colors.muted }]} />

      <View style={styles.panelHeader}>
        <View style={styles.headingText}>
          {/* 👇 عنوان پویا */}
          <Text
            style={[
              styles.panelTitle,
              { color: t.colors.greenTextDark, fontFamily },
            ]}
          >
            {isToday ? `امروز، ${dateLabel}` : dateLabel}
          </Text>

          {/* 👇 زیرنویس پویا */}
          <Text
            style={[styles.panelSubtitle, { color: t.colors.muted, fontFamily }]}
          >
            {mergedMeals.filter((m) => m.itemsCount > 0).length.toLocaleString('fa-IR')}{' '}
            وعده {isToday ? 'برای امروز' : 'برای این روز'}
          </Text>
        </View>

        <View
          style={[
            styles.todayBadge,
            { backgroundColor: t.colors.greenSurface },
          ]}
        >
          <View
            style={[styles.todayDot, { backgroundColor: t.colors.orange }]}
          />
          <Text
            style={[
              styles.todayBadgeText,
              { color: t.colors.greenTextDark, fontFamily },
            ]}
          >
            {isToday ? 'برنامهٔ روز' : 'برنامهٔ روز'}
          </Text>
        </View>
      </View>

      <View style={styles.mealsList}>
        {mergedMeals.map((meal, index) => (
          <View key={meal.id} style={styles.mealRow}>
            <View style={styles.timeline}>
              {index < mergedMeals.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    { backgroundColor: t.colors.greenSurface },
                  ]}
                />
              )}
              <View
                style={[
                  styles.timelineDot,
                  {
                    borderColor: t.colors.greenTextDark,
                    backgroundColor: t.colors.background,
                  },
                ]}
              />
            </View>

            <View style={styles.mealCardContainer}>
              <MealCard
                meal={meal}
                compact={compact}
                onPress={() => {
                  navigation.navigate('UpdateMeals', {
                    meal: {
                      id: meal.mealType,
                      meal_id: meal.mealType,
                      title: meal.title,
                      date, // 👈 تاریخ انتخابی به صفحه ویرایش پاس می‌شود
                    },
                  });
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mealsPanel: {
    flexGrow: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingBottom: 120,
  },
  panelHandle: {
    width: 34,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    opacity: 0.2,
    marginBottom: 22,
  },
  panelHeader: {
    direction: 'ltr',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  headingText: { flex: 1 },
  panelTitle: {
    fontSize: 17,
    lineHeight: 28,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  panelSubtitle: {
    fontSize: 11,
    lineHeight: 20,
    marginTop: 3,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  todayBadge: {
    direction: 'ltr',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
  },
  todayDot: { width: 6, height: 6, borderRadius: 3 },
  todayBadgeText: { fontSize: 10, lineHeight: 18 },
  mealsList: { gap: 12 },
  mealRow: {
    direction: 'ltr',
    flexDirection: 'row-reverse',
    alignItems: 'stretch',
    gap: 10,
  },
  mealCardContainer: { flex: 1, minWidth: 0 },
  timeline: { width: 12, alignItems: 'center', justifyContent: 'center' },
  timelineLine: {
    position: 'absolute',
    width: 2,
    top: '50%',
    bottom: -12,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  bottomHint: {
    marginTop: 18,
    fontSize: 11,
    lineHeight: 22,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});