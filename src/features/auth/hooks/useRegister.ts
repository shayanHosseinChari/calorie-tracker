import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { profileApi } from '@/features/profile/api/profileApi';
import { tokenStorage } from '@/shared/auth/tokenStorage';
import { useAuth } from '../context/AuthContext';
import { RegisterPayload } from '../types/types';

export const useRegister = () => {
  const { signIn } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const auth = await authApi.register(payload);
      // توکن را قبل از GET /profile ست کن تا interceptor آن را بفرستد
      await tokenStorage.setToken(auth.access_token);
      const profile = await profileApi.getProfile();
      return { auth, profile };
    },
    onSuccess: async ({ auth, profile }) => {
      // این خط کلید ماجراست: state را در AuthContext ست می‌کند
      await signIn(auth.access_token, profile);
      queryClient.clear();
    },
    onError: async () => {
      await tokenStorage.clearToken();
    },
  });
};