import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { profileApi } from '@/features/profile/api/profileApi';
import { tokenStorage } from '@/shared/auth/tokenStorage';
import { useAuth } from '../context/AuthContext';
import type { LoginPayload } from '../types/types';

export const useLogin = () => {
  const { signIn } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const auth = await authApi.login(payload);
      // توکن را قبل از GET /profile ست کن تا interceptor آن را بفرستد
      await tokenStorage.setToken(auth.access_token);
      const profile = await profileApi.getProfile();
      return { auth, profile };
    },
    onSuccess: async ({ auth, profile }) => {
      // این خط state را در AuthContext ست می‌کند → isAuthenticated true می‌شود
      await signIn(auth.access_token, profile);
      queryClient.clear();
    },
    onError: async () => {
      // اگر GET /profile شکست خورد، توکن نیمه‌کاره را پاک کن
      await tokenStorage.clearToken();
    },
  });
};