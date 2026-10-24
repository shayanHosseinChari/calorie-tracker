import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';

let cachedToken: string | null = null;

export const tokenStorage = {
  getToken: async (): Promise<string | null> => {
    if (cachedToken !== null) return cachedToken;
    cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
    return cachedToken;
  },

  setToken: async (token: string): Promise<void> => {
    cachedToken = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  clearToken: async (): Promise<void> => {
    cachedToken = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
};