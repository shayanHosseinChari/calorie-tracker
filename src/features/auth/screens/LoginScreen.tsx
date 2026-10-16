import React, { useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTheme } from '@/shared/hooks/useTheme'
import { normalizeDigits } from '../utils/normalizeDigits'

type Colors = ReturnType<typeof useTheme>['colors']

type LoginScreenProps = {
  onLogin?: (credentials: {
    mobile: string
    password: string
  }) => void | Promise<void>
  onForgotPassword?: () => void
  onSignUp?: () => void
  onExplore?: () => void
}


const LoginScreen = ({
  onLogin,
  onForgotPassword,
  onSignUp,
  onExplore,
}: LoginScreenProps) => {
  const t = useTheme()
  const colors = t.colors
  const styles = useMemo(() => createStyles(colors), [colors])

  const passwordRef = useRef<TextInput>(null)
  const submittingRef = useRef(false)

  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (submittingRef.current) return

    const normalizedMobile = normalizeDigits(mobile).replace(/\s/g, '')

    if (!/^09\d{9}$/.test(normalizedMobile)) {
      setError('شماره موبایل معتبر وارد کنید.')
      return
    }

    if (!password.trim()) {
      setError('رمز عبور خود را وارد کنید.')
      return
    }

    if (!onLogin) return

    Keyboard.dismiss()
    setError('')
    submittingRef.current = true
    setIsSubmitting(true)

    try {
      await onLogin({
        mobile: normalizedMobile,
        password,
      })
    } catch {
      setError('ورود انجام نشد. اطلاعات را بررسی و دوباره تلاش کنید.')
    } finally {
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

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
          <View style={styles.content}>
            <View style={styles.main}>
              <View style={styles.header}>
                <View
                  style={styles.logo}
                  accessible
                  accessibilityLabel="تغذیه سالم"
                >
                  <View style={styles.logoLeaf} />

                  <View style={styles.logoFruit}>
                    <MaterialDesignIcons
                      name="silverware-fork-knife"
                      size={43}
                      color={colors.background}
                    />
                  </View>
                </View>

                <Text style={styles.title}>ورود به حساب کاربری</Text>

                <Text style={styles.subtitle}>
                  برای ادامه، اطلاعات خود را وارد کنید
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={mobile}
                    onChangeText={setMobile}
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
                  />

                  <MaterialDesignIcons
                    name="email-outline"
                    size={23}
                    color={colors.text}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Pressable
                    onPress={() => setPasswordVisible(current => !current)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={
                      passwordVisible ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'
                    }
                    style={styles.eyeButton}
                  >
                    <MaterialDesignIcons
                      name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                      size={23}
                      color={colors.muted}
                    />
                  </Pressable>

                  <TextInput
                    ref={passwordRef}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
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
                  

                  <MaterialDesignIcons
                    name="lock-outline"
                    size={23}
                    color={colors.text}
                  />
                </View>
                
                <Pressable
                  onPress={onForgotPassword}
                  disabled={!onForgotPassword}
                  accessibilityRole="button"
                  hitSlop={8}
                  style={styles.forgotButton}
                >
                  <Text style={styles.forgotText}>
                    رمز عبور خود را فراموش کرده‌اید؟
                  </Text>
                </Pressable>

                {error ? (
                  <Text
                    style={styles.error}
                    accessibilityRole="alert"
                    accessibilityLiveRegion="polite"
                  >
                    {error}
                  </Text>
                ) : null}

                <Pressable
                  onPress={handleSubmit}
                  disabled={isSubmitting || !onLogin}
                  accessibilityRole="button"
                  accessibilityLabel="ورود به حساب کاربری"
                  accessibilityState={{
                    disabled: isSubmitting || !onLogin,
                    busy: isSubmitting,
                  }}
                  style={({ pressed }) => [
                    styles.loginButton,
                    (pressed || isSubmitting) && styles.pressed,
                  ]}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={styles.loginText}>ورود</Text>
                  )}
                </Pressable>

              </View>

              <View style={styles.signUpSection}>
                <Pressable
                  onPress={onSignUp}
                  disabled={!onSignUp}
                  accessibilityRole="button"
                  hitSlop={8}
                  style={styles.signUpButton}
                >
                  <Text style={styles.signUpLink}>ثبت‌نام کنید</Text>
                </Pressable>
                <Text style={styles.signUpText}>حساب کاربری ندارید؟</Text>
                
              </View>
            </View>

            <Pressable
              onPress={onExplore}
              disabled={!onExplore}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.banner,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.bannerIllustration}>
                <MaterialDesignIcons
                  name="food-apple-outline"
                  size={39}
                  color={colors.orange}
                />
                <View style={styles.bowl} />
              </View>

              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>
                  به سبک سالم زندگی کنید
                </Text>

                <Text style={styles.bannerSubtitle}>
                  با شمارش کالری، به هدف وزنی خود برسید
                </Text>
              </View>

              <MaterialDesignIcons
                name="arrow-right"
                size={23}
                color={colors.greenTextDark}
              />
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 32,
      paddingBottom: 20,
    },
    content: {
      flex: 1,
      width: '100%',
      maxWidth: 440,
      alignSelf: 'center',
      justifyContent: 'space-between',
      gap: 40,
    },
    main: {
      paddingTop: 12,
    },
    header: {
      alignItems: 'center',
      marginBottom: 36,
    },
    logo: {
      width: 88,
      height: 94,
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: 22,
    },
    logoFruit: {
      width: 76,
      height: 71,
      borderRadius: 30,
      backgroundColor: colors.orange,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ rotate: '12deg' }],
    },
    logoLeaf: {
      position: 'absolute',
      top: 5,
      left: 44,
      width: 25,
      height: 14,
      borderTopLeftRadius: 18,
      borderBottomRightRadius: 18,
      backgroundColor: colors.greenText,
      transform: [{ rotate: '-28deg' }],
    },
    title: {
      color: colors.text,
      fontSize: 27,
      fontFamily: 'vazir',
      textAlign: 'center',
      writingDirection: 'rtl',
      lineHeight: 42,
    },
    subtitle: {
      color: colors.muted,
      fontSize: 14,
      fontFamily: 'vazir',
      textAlign: 'center',
      writingDirection: 'rtl',
      lineHeight: 25,
      marginTop: 8,
    },
    form: {
      gap: 14,
    },
    inputContainer: {
      direction: 'ltr',
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 60,
      paddingHorizontal: 17,
      gap: 12,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      borderRadius: 21,
    },
    input: {
      flex: 1,
      minWidth: 0,
      paddingVertical: 15,
      paddingHorizontal: 0,
      color: colors.text,
      fontSize: 15,
      fontFamily: 'vazir',
      textAlign: 'right',
    },
    eyeButton: {
      minWidth: 28,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    error: {
      color: colors.neutralIconActive,
      fontSize: 12,
      fontFamily: 'vazir',
      lineHeight: 22,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    loginButton: {
      minHeight: 58,
      backgroundColor: colors.orange,
      borderRadius: 29,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 14,
    },
    loginText: {
      color: colors.white,
      fontSize: 19,
      fontFamily: 'vazir',
    },
    pressed: {
      opacity: 0.7,
    },
    forgotButton: {
    //   alignSelf: 'center',
      paddingVertical: 2,
        justifyContent:"flex-end",alignItems:"flex-end"
    },
    forgotText: {
      color: colors.neutralIconActive,
      fontSize: 13,
      fontFamily: 'vazir',
      lineHeight: 23,
      writingDirection: 'rtl',
    },
    signUpSection: {
      flexDirection: 'row',
      alignItems:"center",
      justifyContent:"flex-end",marginTop: 10,
      gap: 6,
    },
    signUpText: {
      color: colors.muted,
      fontSize: 14,
      fontFamily: 'vazir',
    },
    signUpButton: {
      paddingVertical: 4,
    },
    signUpLink: {
      color: colors.orange,
      fontSize: 14,
      fontFamily: 'vazir',
    },
    banner: {
      direction: 'ltr',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.greenSurface,
      borderRadius: 23,
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    bannerIllustration: {
      width: 48,
      height: 54,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bowl: {
      width: 43,
      height: 21,
      marginTop: -10,
      borderBottomLeftRadius: 23,
      borderBottomRightRadius: 23,
      backgroundColor: colors.greenSurfaceAlt,
    },
    bannerContent: {
      flex: 1,
      gap: 6,
    },
    bannerTitle: {
      color: colors.text,
      fontSize: 13,
      fontFamily: 'vazir',
      lineHeight: 23,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    bannerSubtitle: {
      color: colors.greenTextDarker,
      fontSize: 10,
      fontFamily: 'vazir',
      lineHeight: 19,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
  })

export default LoginScreen