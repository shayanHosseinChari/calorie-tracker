// features/meals/api/mealsApi.ts
import { apiClient } from '@/shared/api/client';
import { MEALS_API } from '@/shared/api/routes';
import type { AddMealPayload, Meal, MealsResponse } from '../types';

export const mealsApi = {
  addMeal: async (payload: AddMealPayload): Promise<Meal> => {
    const { data } = await apiClient.post<Meal>(MEALS_API, payload);
    return data;
  },

  getMeals: async (day?: string): Promise<MealsResponse> => {
    const { data } = await apiClient.get<MealsResponse>(MEALS_API, {
      params: day ? { day } : undefined,
    });
    return data;
  },
};