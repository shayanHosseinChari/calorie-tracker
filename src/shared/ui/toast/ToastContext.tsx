import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import { useTheme } from '@/shared/hooks/useTheme';

type ToastType = 'success' | 'error' | 'info';

type ToastOptions = {
  type?: ToastType;
  duration?: number;
};

type ToastContextValue = {
  show: (message: string, options?: ToastOptions) => void;
  hide: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(
    null
  );
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => setToast(null));
  }, [opacity, translateY]);

  const show = useCallback(
    (message: string, options?: ToastOptions) => {
      const type = options?.type ?? 'info';
      const duration = options?.duration ?? 2600;

      if (timerRef.current) clearTimeout(timerRef.current);

      setToast({ message, type });
      opacity.setValue(0);
      translateY.setValue(-20);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 6,
        }),
      ]).start();

      timerRef.current = setTimeout(hide, duration);
    },
    [hide, opacity, translateY]
  );

  const value = useMemo(() => ({ show, hide }), [show, hide]);

  const palette = {
    success: {
      bg: t.colors.greenSurface,
      border: t.colors.greenText,
      text: t.colors.greenTextDarker,
      icon: 'check-circle-outline' as const,
    },
    error: {
      bg: '#FDECEC',
      border: t.colors.neutralIconActive,
      text: t.colors.neutralIconActive,
      icon: 'alert-circle-outline' as const,
    },
    info: {
      bg: t.colors.white,
      border: t.colors.greenTrack,
      text: t.colors.text,
      icon: 'information-outline' as const,
    },
  }[toast?.type ?? 'info'];

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.wrapper,
            { top: insets.top + 12, opacity, transform: [{ translateY }] },
          ]}
        >
          <View
            style={[
              styles.toast,
              {
                backgroundColor: palette.bg,
                borderColor: palette.border,
              },
            ]}
          >
            <MaterialDesignIcons
              name={palette.icon}
              size={20}
              color={palette.text}
            />
            <Text style={[styles.message, { color: palette.text }]}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    maxWidth: 480,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  message: {
    flex: 1,
    fontFamily: 'vazir',
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});