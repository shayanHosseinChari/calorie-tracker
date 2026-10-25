import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN_KEY } from './keys';

let cachedToken: string | null | undefined = undefined;

export const tokenStorage = {
  getToken: async (): Promise<string | null> => {
    if (cachedToken !== undefined) return cachedToken;
    cachedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return cachedToken;
  },

  setToken: async (token: string): Promise<void> => {
    cachedToken = token;
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  clearToken: async (): Promise<void> => {
    cachedToken = null;
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  },
};