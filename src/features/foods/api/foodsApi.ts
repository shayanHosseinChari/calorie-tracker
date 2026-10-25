import { apiClient } from '@/shared/api/client';
import { FOODS_API, FOOD_SEARCH_API } from '@/shared/api/routes';
import type { Food, FoodListParams } from '../types';

export const foodsApi = {
  listFoods: async (params?: FoodListParams): Promise<Food[]> => {
    const { data } = await apiClient.get<Food[]>(FOODS_API, { params });
    return data;
  },

  searchFoods: async (q: string): Promise<Food[]> => {
    const { data } = await apiClient.get<Food[]>(FOOD_SEARCH_API, {
      params: { q },
    });
    return data;
  },
};