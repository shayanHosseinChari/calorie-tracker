import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@/shared/hooks/useTheme';
import { useToast } from '@/shared/ui/toast/ToastContext';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { normalizeDigits } from '../utils/normalizeDigits';

type Colors = ReturnType<typeof useTheme>['colors'];

const LoginScreen = () => {
  const t = useTheme();
  const colors = t.colors;
  const styles = useMemo(() => createStyles(colors), [colors]);
  const toast = useToast();
  const navigation = useNavigation();

  const passwordRef = useRef<TextInput>(null);
  const submittingRef = useRef(false);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focused, setFocused] = useState<'phone' | 'password' | null>(null);
  const [error, setError] = useState('');

  const loginMutation = useLogin();
  const isSubmitting = loginMutation.isPending;

  const introOpacity = useRef(new Animated.Value(0)).current;
  const introTranslate = useRef(new Animated.Value(16)).current;
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(introOpacity, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(introTranslate, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();
  }, [introOpacity, introTranslate]);

  const handleSubmit = async () => {
    if (submittingRef.current) return;

    const normalizedPhone = normalizeDigits(phone).replace(/\s/g, '');

    if (!/^09\d{9}$/.test(normalizedPhone)) {
      setError('شماره موبایل معتبر وارد کنید.');
      toast.show('شماره موبایل معتبر وارد کنید.', { type: 'error' });
      return;
    }

    if (!password.trim()) {
      setError('رمز عبور خود را وارد کنید.');
      toast.show('رمز عبور خود را وارد کنید.', { type: 'error' });
      return;
    }

    Keyboard.dismiss();
    setError('');
    submittingRef.current = true;

    try {
      await loginMutation.mutateAsync({ phone: normalizedPhone, password });
      toast.show('خوش آمدید!', { type: 'success' });
    } catch (e: any) {
      const message =
        e?.message ?? 'ورود انجام نشد. اطلاعات را بررسی و دوباره تلاش کنید.';
      setError(message);
      toast.show(message, { type: 'error' });
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              { opacity: introOpacity, transform: [{ translateY: introTranslate }] },
            ]}
          >
            <LinearGradient
              colors={[colors.greenSurface, colors.background]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={styles.hero}
            >
              <View style={styles.logo}>
                <View style={styles.logoLeaf} />
                <View style={styles.logoFruit}>
                  <MaterialDesignIcons
                    name="silverware-fork-knife"
                    size={40}
                    color={colors.background}
                  />
                </View>
              </View>

              <Text style={styles.title}>ورود به حساب کاربری</Text>
              <Text style={styles.subtitle}>برای ادامه، اطلاعات خود را وارد کنید</Text>
            </LinearGradient>

            <View style={styles.card}>
              <View
                style={[
                  styles.inputContainer,
                  focused === 'phone' && styles.inputContainerFocused,
                ]}
              >
                <MaterialDesignIcons
                  name="phone-outline"
                  size={22}
                  color={focused === 'phone' ? colors.orange : colors.muted}
                />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={(v) => {
                    setPhone(v);
                    if (error) setError('');
                  }}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused(null)}
                  placeholder="شماره موبایل"
                  placeholderTextColor={colors.muted}
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  autoComplete="tel"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  accessibilityLabel="شماره موبایل"
                  editable={!isSubmitting}
                  maxLength={13}
                />
              </View>

              <View
                style={[
                  styles.inputContainer,
                  focused === 'password' && styles.inputContainerFocused,
                ]}
              >
                <MaterialDesignIcons
                  name="lock-outline"
                  size={22}
                  color={focused === 'password' ? colors.orange : colors.muted}
                />
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    if (error) setError('');
                  }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="رمز عبور"
                  placeholderTextColor={colors.muted}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  autoComplete="current-password"
                  returnKeyType="go"
                  onSubmitEditing={handleSubmit}
                  accessibilityLabel="رمز عبور"
                  editable={!isSubmitting}
                />
                <Pressable
                  onPress={() => setPasswordVisible((c) => !c)}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={
                    passwordVisible ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'
                  }
                  style={styles.eyeButton}
                >
                  <MaterialDesignIcons
                    name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color={colors.muted}
                  />
                </Pressable>
              </View>

              <Pressable
                onPress={() => {
                  // اگر صفحه بازیابی رمز دارید اینجا navigate کنید
                }}
                disabled={isSubmitting}
                accessibilityRole="button"
                hitSlop={8}
                style={styles.forgotButton}
              >
                <Text style={styles.forgotText}>رمز عبور خود را فراموش کرده‌اید؟</Text>
              </Pressable>

              {error ? (
                <View style={styles.errorBox}>
                  <MaterialDesignIcons
                    name="alert-circle-outline"
                    size={16}
                    color={colors.neutralIconActive}
                  />
                  <Text
                    style={styles.error}
                    accessibilityRole="alert"
                    accessibilityLiveRegion="polite"
                  >
                    {error}
                  </Text>
                </View>
              ) : null}

              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="ورود به حساب کاربری"
                accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
                style={({ pressed }) => [
                  styles.loginButton,
                  (pressed || isSubmitting) && styles.pressed,
                  isSubmitting && styles.loginButtonBusy,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <Text style={styles.loginText}>ورود</Text>
                    <MaterialDesignIcons name="arrow-left" size={20} color={colors.white} />
                  </>
                )}
              </Pressable>

              <View style={styles.signUpSection}>
                <Text style={styles.signUpText}>حساب کاربری ندارید؟</Text>
                <Pressable
                  onPress={() => navigation.navigate('Register')}
                  accessibilityRole="button"
                  hitSlop={8}
                  style={styles.signUpButton}
                >
                  <Text style={styles.signUpLink}>ثبت‌نام کنید</Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={() => {
                // اگر صفحه‌ای برای گشت‌وگذار دارید اینجا navigate کنید
              }}
              disabled={isSubmitting}
              accessibilityRole="button"
              style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
            >
              <View style={styles.bannerIllustration}>
                <MaterialDesignIcons
                  name="food-apple-outline"
                  size={36}
                  color={colors.orange}
                />
                <View style={styles.bowl} />
              </View>

              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>به سبک سالم زندگی کنید</Text>
                <Text style={styles.bannerSubtitle}>
                  با شمارش کالری، به هدف وزنی خود برسید
                </Text>
              </View>

              <MaterialDesignIcons
                name="arrow-right"
                size={22}
                color={colors.greenTextDark}
              />
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    flex: { flex: 1 },
    screen: { flex: 1, backgroundColor: colors.background },
    scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
    content: { flex: 1, width: '100%', maxWidth: 440, alignSelf: 'center', gap: 20 },
    hero: {
      borderRadius: 28,
      paddingTop: 28,
      paddingBottom: 32,
      paddingHorizontal: 20,
      alignItems: 'center',
      overflow: 'hidden',
    },
    logo: { width: 84, height: 90, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 18 },
    logoFruit: {
      width: 72,
      height: 68,
      borderRadius: 28,
      backgroundColor: colors.orange,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ rotate: '12deg' }],
      shadowColor: colors.orange,
      shadowOpacity: 0.35,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
    logoLeaf: {
      position: 'absolute',
      top: 4,
      left: 42,
      width: 24,
      height: 13,
      borderTopLeftRadius: 18,
      borderBottomRightRadius: 18,
      backgroundColor: colors.greenText,
      transform: [{ rotate: '-28deg' }],
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontFamily: 'vazir',
      textAlign: 'center',
      writingDirection: 'rtl',
      lineHeight: 38,
    },
    subtitle: {
      color: colors.muted,
      fontSize: 13,
      fontFamily: 'vazir',
      textAlign: 'center',
      writingDirection: 'rtl',
      lineHeight: 22,
      marginTop: 6,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 26,
      padding: 18,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 3,
    },
    inputContainer: {
      direction: 'ltr',
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 56,
      paddingHorizontal: 14,
      gap: 10,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      borderRadius: 16,
    },
    inputContainerFocused: { borderColor: colors.orange, backgroundColor: colors.white },
    input: {
      flex: 1,
      minWidth: 0,
      paddingVertical: 12,
      paddingHorizontal: 0,
      color: colors.text,
      fontSize: 15,
      fontFamily: 'vazir',
      textAlign: 'right',
    },
    eyeButton: { minWidth: 28, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
    errorBox: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 6,
      backgroundColor: '#FDECEC',
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    error: {
      flex: 1,
      color: colors.neutralIconActive,
      fontSize: 12,
      fontFamily: 'vazir',
      lineHeight: 20,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    loginButton: {
      minHeight: 56,
      backgroundColor: colors.orange,
      borderRadius: 18,
      flexDirection: 'row-reverse',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginTop: 6,
      shadowColor: colors.orange,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
    loginButtonBusy: { opacity: 0.85 },
    loginText: { color: colors.white, fontSize: 17, fontFamily: 'vazir' },
    pressed: { opacity: 0.85 },
    forgotButton: { alignSelf: 'flex-end', paddingVertical: 2 },
    forgotText: {
      color: colors.neutralIconActive,
      fontSize: 12,
      fontFamily: 'vazir',
      lineHeight: 22,
      writingDirection: 'rtl',
    },
    signUpSection: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 6,
      gap: 6,
    },
    signUpText: { color: colors.muted, fontSize: 13, fontFamily: 'vazir' },
    signUpButton: { paddingVertical: 4 },
    signUpLink: { color: colors.orange, fontSize: 13, fontFamily: 'vazir' },
    banner: {
      direction: 'ltr',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.greenSurface,
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: 18,
    },
    bannerIllustration: { width: 46, height: 52, alignItems: 'center', justifyContent: 'center' },
    bowl: {
      width: 42,
      height: 20,
      marginTop: -10,
      borderBottomLeftRadius: 22,
      borderBottomRightRadius: 22,
      backgroundColor: colors.greenSurfaceAlt,
    },
    bannerContent: { flex: 1, gap: 4 },
    bannerTitle: {
      color: colors.text,
      fontSize: 13,
      fontFamily: 'vazir',
      lineHeight: 22,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    bannerSubtitle: {
      color: colors.greenTextDarker,
      fontSize: 10,
      fontFamily: 'vazir',
      lineHeight: 18,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
  });

export default LoginScreen;