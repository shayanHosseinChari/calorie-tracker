import { useQuery } from '@tanstack/react-query';
import { foodsApi } from '../api/foodsApi';
import { foodKeys } from './useFoods';

export const useFoodSearch = (q: string, enabled = true) => {
  const trimmed = q.trim();

  return useQuery({
    queryKey: foodKeys.search(trimmed),
    queryFn: () => foodsApi.searchFoods(trimmed),
    enabled: enabled && trimmed.length > 0,
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};