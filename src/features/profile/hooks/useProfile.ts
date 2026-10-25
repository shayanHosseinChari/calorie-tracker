import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../api/profileApi';

export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
};

export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: profileApi.getProfile,
    staleTime: 5 * 60 * 1000, // ۵ دقیقه
  });
};