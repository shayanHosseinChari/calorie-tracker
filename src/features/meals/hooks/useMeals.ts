import { useQuery } from '@tanstack/react-query';
import { mealsApi } from '../api/mealsApi';

export const mealKeys = {
  all: ['meals'] as const,
  byDay: (day?: string) => [...mealKeys.all, day ?? 'all'] as const,
};

export const useMeals = (day?: string) => {
  return useQuery({
    queryKey: mealKeys.byDay(day),
    queryFn: () => mealsApi.getMeals(day),
    staleTime: 60 * 1000, 
  });
};