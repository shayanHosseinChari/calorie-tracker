import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profileApi';
import { profileKeys } from './useProfile';
import type { UpdateProfilePayload } from '../types';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profileApi.updateProfile(payload),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileKeys.detail(), updatedProfile);
    },
  });
};