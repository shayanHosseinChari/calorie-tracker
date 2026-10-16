import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MealCard } from '../../../shared/components/MealCard';
import type { MEALS } from '../data';

import { AddSnackButton } from './AddSnakeButton';
import { SelectedMealNotice } from './SelectMealNotice';

interface Props {
  meals: typeof MEALS;
  dateLabel: string;
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
  compact,
  pagePadding,
  selectedMeal,
  onSelectMeal,
  onDismissNotice,
  theme: t,
}: Props) {
  const fontFamily = t.typography.family;

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
      <View
        style={[styles.panelHandle, { backgroundColor: t.colors.muted }]}
      />

      <View style={styles.panelHeader}>
        <View style={styles.headingText}>
          <Text
            style={[
              styles.panelTitle,
              { color: t.colors.greenTextDark, fontFamily },
            ]}
          >
            امروز، {dateLabel}
          </Text>

          <Text
            style={[styles.panelSubtitle, { color: t.colors.muted, fontFamily }]}
          >
            {meals.length.toLocaleString('fa-IR')} وعده برای امروز
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
            برنامهٔ روز
          </Text>
        </View>
      </View>

      <View style={styles.mealsList}>
        {meals.map((meal, index) => (
          <View key={meal.id} style={styles.mealRow}>
            <View style={styles.timeline}>
              {index < meals.length - 1 && (
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
                onPress={() => onSelectMeal(meal.title)}
              />
            </View>
          </View>
        ))}
      </View>

      {selectedMeal && (
        <SelectedMealNotice
          mealTitle={selectedMeal}
          onDismiss={onDismissNotice}
          theme={t}
        />
      )}

      <AddSnackButton onPress={() => onSelectMeal('میان‌وعده')} theme={t} />

      <Text style={[styles.bottomHint, { color: t.colors.muted, fontFamily }]}>
        هر وعده، یک قدم به هدفت نزدیک‌تر
      </Text>
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