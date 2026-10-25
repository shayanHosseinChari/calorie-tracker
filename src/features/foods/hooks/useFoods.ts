import { useQuery } from '@tanstack/react-query';
import { foodsApi } from '../api/foodsApi';
import type { FoodListParams } from '../types';

export const foodKeys = {
  all: ['foods'] as const,
  list: (params?: FoodListParams) =>
    [...foodKeys.all, 'list', params ?? {}] as const,
  search: (q: string) => [...foodKeys.all, 'search', q] as const,
};

export const useFoods = (params?: FoodListParams) => {
  return useQuery({
    queryKey: foodKeys.list(params),
    queryFn: () => foodsApi.listFoods(params),
    staleTime: 10 * 60 * 1000, 
  });
};