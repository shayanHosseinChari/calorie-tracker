// features/home/hooks/useConsumedCalories.ts
import { useMemo } from 'react';
import { useMeals } from '@/features/meals/hooks/useMeals';
import { toApiDate } from '@/shared/util/date';
import type { MealName } from '@/features/meals/types';

const MEAL_NAME_TO_KEY: Record<string, MealName> = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  snack: 'snack',
};

// 👇 پارامتر selectedDate اضافه شد (پیش‌فرض: امروز)
export function useConsumedCalories(selectedDate: Date = new Date()) {
  const day = toApiDate(selectedDate);
  const { data, isLoading, isError } = useMeals(day);

  const mealsRaw = useMemo(() => {
    const empty: Record<MealName, any[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };
    const list = Array.isArray(data?.meals) ? data!.meals : [];
    for (const meal of list) {
      const key = MEAL_NAME_TO_KEY[meal.meal_name];
      if (!key) continue;
      empty[key] = Array.isArray(meal.foods) ? meal.foods : [];
    }
    return empty;
  }, [data]);

  const consumedCalories = useMemo(() => {
    const all = Object.values(mealsRaw).flat();
    const total = all.reduce(
      (sum, item) => sum + (Number(item?.calories) || 0) * (Number(item?.amount) || 1),
      0
    );
    return Number.isFinite(total) ? Math.round(total) : 0;
  }, [mealsRaw]);

  return { consumedCalories, mealsRaw, isLoading, isError, raw: data };
}