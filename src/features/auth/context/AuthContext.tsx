import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';

import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/shared/auth/keys';
import { tokenStorage } from '@/shared/auth/tokenStorage';
import { onUnauthorized } from '@/shared/auth/authEvents';
import type { Profile } from '@/features/profile/types';

export type User = Profile;

type AuthState = {
  isLoading: boolean;
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
};

type AuthContextValue = AuthState & {
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // اگر QueryClientProvider در بالای درخت هست، از آن استفاده می‌کنیم؛
  // در غیر این صورت useQueryClient خطا می‌دهد. برای امنیت، آن را اختیاری می‌کنیم.
  let queryClient: ReturnType<typeof useQueryClient> | undefined;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    queryClient = useQueryClient();
  } catch {
    queryClient = undefined;
  }

  // بوت‌استرپ: خواندن توکن و کاربر از AsyncStorage
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(AUTH_USER_KEY),
        ]);

        if (cancelled) return;

        if (storedToken) {
          setToken(storedToken);
          // کش in-memory را هم گرم کن تا اولین درخواست تأخیر نداشته باشد
          await tokenStorage.setToken(storedToken);
        }
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser) as User);
          } catch {
            // اگر JSON خراب بود، کاربر را null نگه دار
            setUser(null);
          }
        }
      } catch (e) {
        console.warn('Auth bootstrap failed', e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(
    async (newToken: string, newUser: User) => {
      await AsyncStorage.setMany({
  [AUTH_TOKEN_KEY]: newToken,
  [AUTH_USER_KEY]: JSON.stringify(newUser),
});
      await tokenStorage.setToken(newToken);
      setToken(newToken);
      setUser(newUser);
    },
    []
  );

  const signOut = useCallback(async () => {
    await AsyncStorage.removeMany([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
    await tokenStorage.clearToken();
    setToken(null);
    setUser(null);
    // پاک کردن کش React Query (اگر در دسترس است)
    queryClient?.clear();
  }, [queryClient]);

  // 401 خودکار → logout
  useEffect(() => {
    const unsubscribe = onUnauthorized(() => {
      setToken(null);
      setUser(null);
      AsyncStorage.removeMany([AUTH_TOKEN_KEY, AUTH_USER_KEY]).catch(() => {});
      queryClient?.clear();
    });
    return unsubscribe;
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      token,
      user,
      isAuthenticated: !!token,
      signIn,
      signOut,
    }),
    [isLoading, token, user, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}