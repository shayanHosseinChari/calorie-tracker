// features/meals/hooks/useAddMeals.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mealsApi } from '../api/mealsApi';
import { mealKeys } from './useMeals';
import type { AddMealPayload } from '../types';

export const useAddMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddMealPayload) => mealsApi.addMeal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealKeys.all });
    },
  });
};