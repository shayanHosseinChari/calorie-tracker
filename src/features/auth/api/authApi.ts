import { apiClient } from '@/shared/api/client';
import { AUTH_LOGIN_API, AUTH_REGISTER_API } from '@/shared/api/routes';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types/types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(AUTH_LOGIN_API, payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(AUTH_REGISTER_API, payload);
    return data;
  },
};