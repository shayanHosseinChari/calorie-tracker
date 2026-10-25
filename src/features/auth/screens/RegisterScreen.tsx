import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  BackHandler,
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
import { useNavigation } from '@react-navigation/native';
import { toGregorian } from 'jalaali-js';

import { useTheme } from '@/shared/hooks/useTheme';
import { useToast } from '@/shared/ui/toast/ToastContext';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { normalizeDigits } from '../utils/normalizeDigits';
import { ActivityLevel } from '@/shared/types/activity';

type Colors = ReturnType<typeof useTheme>['colors'];

const STEPS = ['موبایل', 'رمز عبور', 'نام', 'جنسیت', 'قد و وزن', 'تاریخ تولد', 'فعالیت'];

const GENDER_OPTIONS = [
  { key: 0 as const, label: 'خانم', icon: 'gender-female' },
  { key: 1 as const, label: 'آقا', icon: 'gender-male' },
];

const ACTIVITY_OPTIONS: { key: ActivityLevel; label: string; desc: string; icon: string }[] = [
  { key: 1, label: 'بی‌تحرک', desc: 'کمترین تحرک، کار اداری', icon: 'seat-outline' },
  { key: 2, label: 'سبک', desc: 'ورزش ۱ تا ۳ روز در هفته', icon: 'walk' },
  { key: 3, label: 'متوسط', desc: 'ورزش ۳ تا ۵ روز در هفته', icon: 'run' },
  { key: 4, label: 'زیاد', desc: 'ورزش ۶ تا ۷ روز در هفته', icon: 'run-fast' },
  { key: 5, label: 'بسیار زیاد', desc: 'ورزش سنگین روزانه یا کار یدی', icon: 'weight-lifter' },
];

const RegisterScreen = () => {
  const t = useTheme();
  const colors = t.colors;
  const styles = useMemo(() => createStyles(colors), [colors]);
  const toast = useToast();
  const navigation = useNavigation();
  const registerMutation = useRegister();

  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<0 | 1>(0);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(3);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goNext = () => {
    Keyboard.dismiss();
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    if (step === 0) {
      navigation.goBack();
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
  };

  React.useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (registerMutation.isPending) {
        return true;
      }
      if (step > 0) {
        setStep((s) => Math.max(s - 1, 0));
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [step, registerMutation.isPending]);

  const validateStep = (): boolean => {
    if (step === 0) {
      const p = normalizeDigits(phone).replace(/\s/g, '');
      if (!/^09\d{9}$/.test(p)) {
        toast.show('شماره موبایل معتبر وارد کنید.', { type: 'error' });
        return false;
      }
      setPhone(p);
    }
    if (step === 1) {
      if (password.trim().length < 6) {
        toast.show('رمز عبور باید حداقل ۶ کاراکتر باشد.', { type: 'error' });
        return false;
      }
    }
    if (step === 2) {
      if (!name.trim()) {
        toast.show('نام خود را وارد کنید.', { type: 'error' });
        return false;
      }
    }
    if (step === 4) {
      const h = Number(normalizeDigits(height));
      const w = Number(normalizeDigits(weight));
      if (!h || h < 50 || h > 250) {
        toast.show('قد باید بین ۵۰ تا ۲۵۰ سانتی‌متر باشد.', { type: 'error' });
        return false;
      }
      if (!w || w < 20 || w > 300) {
        toast.show('وزن باید بین ۲۰ تا ۳۰۰ کیلوگرم باشد.', { type: 'error' });
        return false;
      }
    }
    if (step === 5) {
      const parts = normalizeDigits(birthDate).split('/').map(Number);
      if (parts.length !== 3 || parts.some(isNaN)) {
        toast.show('تاریخ را به شکل ۱۴۰۳/۰۳/۱۰ وارد کنید.', { type: 'error' });
        return false;
      }
      const [jy, jm, jd] = parts;
      if (jy < 1300 || jy > 1420 || jm < 1 || jm > 12 || jd < 1 || jd > 31) {
        toast.show('تاریخ شمسی معتبر نیست.', { type: 'error' });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      goNext();
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const parts = normalizeDigits(birthDate).split('/').map(Number);
      const [jy, jm, jd] = parts;
      const { gy } = toGregorian(jy, jm, jd);

      await registerMutation.mutateAsync({
        phone,
        password,
        name: name.trim(),
        height: Number(normalizeDigits(height)),
        weight: Number(normalizeDigits(weight)),
        gender,
        birth_year: gy,
        activity_level: activityLevel,
        
      });
      toast.show('ثبت‌نام با موفقیت انجام شد!', { type: 'success' });
    } catch (e: any) {
      toast.show(e?.message ?? 'ثبت‌نام انجام نشد.', { type: 'error' });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepCard}>
            <MaterialDesignIcons name="phone-outline" size={32} color={colors.orange} />
            <Text style={styles.stepTitle}>شماره موبایل</Text>
            <Text style={styles.stepSubtitle}>شماره‌ای که با آن وارد می‌شوید</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
              autoFocus
              editable={!registerMutation.isPending}
            />
          </View>
        );
      case 1:
        return (
          <View style={styles.stepCard}>
            <MaterialDesignIcons name="lock-outline" size={32} color={colors.orange} />
            <Text style={styles.stepTitle}>رمز عبور</Text>
            <Text style={styles.stepSubtitle}>حداقل ۶ کاراکتر</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••"
              placeholderTextColor={colors.muted}
              secureTextEntry
              autoFocus
              editable={!registerMutation.isPending}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepCard}>
            <MaterialDesignIcons name="account-outline" size={32} color={colors.orange} />
            <Text style={styles.stepTitle}>نام شما</Text>
            <Text style={styles.stepSubtitle}>چطور شما را صدا کنیم؟</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="نام و نام خانوادگی"
              placeholderTextColor={colors.muted}
              autoFocus
              editable={!registerMutation.isPending}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepCard}>
            <MaterialDesignIcons name="gender-male-female" size={32} color={colors.orange} />
            <Text style={styles.stepTitle}>جنسیت</Text>
            <Text style={styles.stepSubtitle}>برای محاسبه دقیق کالری</Text>
            <View style={styles.genderRow}>
              {GENDER_OPTIONS.map((opt) => {
                const active = gender === opt.key;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => setGender(opt.key)}
                    disabled={registerMutation.isPending}
                    style={[styles.genderOption, active && styles.genderOptionActive]}
                  >
                    <MaterialDesignIcons
                      name={opt.icon as any}
                      size={28}
                      color={active ? colors.white : colors.muted}
                    />
                    <Text style={[styles.genderLabel, active && styles.genderLabelActive]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepCard}>
            <MaterialDesignIcons name="human-male-height" size={32} color={colors.orange} />
            <Text style={styles.stepTitle}>قد و وزن</Text>
            <Text style={styles.stepSubtitle}>برای محاسبه دقیق کالری</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={height}
                onChangeText={setHeight}
                placeholder="قد (cm)"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                autoFocus
                editable={!registerMutation.isPending}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={weight}
                onChangeText={setWeight}
                placeholder="وزن (kg)"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                editable={!registerMutation.isPending}
              />
            </View>
          </View>
        );
      case 5:
        return (
          <View style={styles.stepCard}>
            <MaterialDesignIcons name="calendar-outline" size={32} color={colors.orange} />
            <Text style={styles.stepTitle}>تاریخ تولد</Text>
            <Text style={styles.stepSubtitle}>به تاریخ شمسی وارد کنید</Text>
            <TextInput
              style={styles.input}
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="۱۴۰۳/۰۳/۱۰"
              placeholderTextColor={colors.muted}
              keyboardType="numbers-and-punctuation"
              autoFocus
              editable={!registerMutation.isPending}
            />
          </View>
        );
      case 6:
        return (
          <View style={styles.stepCard}>
            <MaterialDesignIcons name="run" size={32} color={colors.orange} />
            <Text style={styles.stepTitle}>سطح فعالیت</Text>
            <Text style={styles.stepSubtitle}>برای محاسبه کالری روزانه</Text>
            <View style={styles.activityList}>
              {ACTIVITY_OPTIONS.map((opt) => {
                const active = activityLevel === opt.key;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => setActivityLevel(opt.key)}
                    disabled={registerMutation.isPending}
                    style={[styles.activityOption, active && styles.activityOptionActive]}
                  >
                    <View style={styles.activityIconWrap}>
                      <MaterialDesignIcons
                        name={opt.icon as any}
                        size={22}
                        color={active ? colors.orange : colors.muted}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.activityLabel, active && styles.activityLabelActive]}>
                        {opt.label}
                      </Text>
                      <Text style={styles.activityDesc}>{opt.desc}</Text>
                    </View>
                    {active ? (
                      <MaterialDesignIcons name="check-circle" size={20} color={colors.orange} />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      default:
        return null;
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
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              onPress={goBack}
              style={styles.backButton}
              hitSlop={12}
              disabled={registerMutation.isPending}
            >
              <MaterialDesignIcons name="arrow-right" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.headerTitle}>ثبت‌نام</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.progressRow}>
            {STEPS.map((label, i) => (
              <View key={label} style={styles.progressItem}>
                <View style={[styles.progressDot, i <= step && styles.progressDotActive]}>
                  <Text style={[styles.progressNum, i <= step && styles.progressNumActive]}>
                    {i + 1}
                  </Text>
                </View>
                <Text style={[styles.progressLabel, i === step && styles.progressLabelActive]}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          <Animated.View style={{ opacity: fadeAnim }}>{renderStep()}</Animated.View>

          <View style={styles.navButtonsRow}>
            {step > 0 ? (
              <Pressable
                onPress={goBack}
                disabled={registerMutation.isPending}
                style={({ pressed }) => [styles.prevButton, pressed && { opacity: 0.7 }]}
              >
                <MaterialDesignIcons name="arrow-right" size={20} color={colors.orange} />
                <Text style={styles.prevText}>قبلی</Text>
              </Pressable>
            ) : (
              <View style={{ flex: 1 }} />
            )}

            <Pressable
              onPress={handleNext}
              disabled={registerMutation.isPending}
              style={({ pressed }) => [
                styles.nextButton,
                { flex: 1 },
                pressed && { opacity: 0.85 },
              ]}
            >
              {registerMutation.isPending ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Text style={styles.nextText}>
                    {step === STEPS.length - 1 ? 'ثبت‌نام' : 'ادامه'}
                  </Text>
                  <MaterialDesignIcons
                    name={step === STEPS.length - 1 ? 'check' : 'arrow-left'}
                    size={20}
                    color={colors.white}
                  />
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    flex: { flex: 1 },
    screen: { flex: 1, backgroundColor: colors.background },
    scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
    header: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontFamily: 'vazir', color: colors.text },
    progressRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      marginBottom: 32,
      paddingHorizontal: 4,
    },
    progressItem: { alignItems: 'center', flex: 1 },
    progressDot: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.greenTrack,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    progressDotActive: { backgroundColor: colors.orange },
    progressNum: { fontSize: 12, fontFamily: 'vazir', color: colors.muted },
    progressNumActive: { color: colors.white },
    progressLabel: { fontSize: 9, fontFamily: 'vazir', color: colors.muted, textAlign: 'center' },
    progressLabelActive: { color: colors.orange },
    stepCard: {
      backgroundColor: colors.white,
      borderRadius: 24,
      padding: 28,
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      marginBottom: 24,
    },
    stepTitle: { fontSize: 20, fontFamily: 'vazir', color: colors.text },
    stepSubtitle: { fontSize: 12, fontFamily: 'vazir', color: colors.muted, marginBottom: 12 },
    input: {
      width: '100%',
      minHeight: 56,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      borderRadius: 16,
      paddingHorizontal: 16,
      fontFamily: 'vazir',
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
    },
    row: { flexDirection: 'row', gap: 12, width: '100%' },
    halfInput: { flex: 1 },
    genderRow: { flexDirection: 'row-reverse', gap: 12, width: '100%' },
    genderOption: {
      flex: 1,
      minHeight: 96,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    genderOptionActive: { backgroundColor: colors.orange, borderColor: colors.orange },
    genderLabel: { fontSize: 14, fontFamily: 'vazir', color: colors.muted },
    genderLabelActive: { color: colors.white },
    activityList: { width: '100%', gap: 10 },
    activityOption: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      backgroundColor: colors.background,
    },
    activityOptionActive: {
      borderColor: colors.orange,
      backgroundColor: colors.peachSoft,
    },
    activityIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activityLabel: {
      fontSize: 13,
      fontFamily: 'vazir',
      color: colors.text,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    activityLabelActive: { color: colors.orange },
    activityDesc: {
      fontSize: 10,
      fontFamily: 'vazir',
      color: colors.muted,
      textAlign: 'right',
      writingDirection: 'rtl',
      marginTop: 2,
    },
    navButtonsRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 10,
      marginTop: 8,
    },
    prevButton: {
      flex: 1,
      minHeight: 56,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: colors.orange,
      backgroundColor: colors.white,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    prevText: {
      color: colors.orange,
      fontSize: 15,
      fontFamily: 'vazir',
    },
    nextButton: {
      minHeight: 56,
      backgroundColor: colors.orange,
      borderRadius: 18,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    nextText: { color: colors.white, fontSize: 17, fontFamily: 'vazir' },
  });

export default RegisterScreen;