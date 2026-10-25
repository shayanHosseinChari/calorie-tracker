import { apiClient } from '@/shared/api/client';
import { PROFILE_API } from '@/shared/api/routes';
import type { Profile, UpdateProfilePayload } from '../types';

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    const { data } = await apiClient.get<Profile>(PROFILE_API);
    return data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<Profile> => {
    
    await apiClient.patch(PROFILE_API, payload);
    const { data } = await apiClient.get<Profile>(PROFILE_API);
    return data;
  },
};