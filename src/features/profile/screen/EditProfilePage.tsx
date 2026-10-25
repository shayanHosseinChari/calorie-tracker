import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import { useTheme } from '@/shared/hooks/useTheme';
import { useToast } from '@/shared/ui/toast/ToastContext';
import { useProfileContext } from '@/features/profile/context/ProfileContext';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import { normalizeDigits } from '@/features/auth/utils/normalizeDigits';
import type { ActivityLevel } from '@/shared/types/activity';

type Colors = ReturnType<typeof useTheme>['colors'];

const ACTIVITY_OPTIONS: { key: ActivityLevel; label: string; desc: string; icon: string }[] = [
  { key: 1, label: 'بی‌تحرک', desc: 'کمترین تحرک، کار اداری', icon: 'seat-outline' },
  { key: 2, label: 'سبک', desc: 'ورزش ۱ تا ۳ روز در هفته', icon: 'walk' },
  { key: 3, label: 'متوسط', desc: 'ورزش ۳ تا ۵ روز در هفته', icon: 'run' },
  { key: 4, label: 'زیاد', desc: 'ورزش ۶ تا ۷ روز در هفته', icon: 'run-fast' },
  { key: 5, label: 'بسیار زیاد', desc: 'ورزش سنگین روزانه یا کار یدی', icon: 'weight-lifter' },
];

const EditProfile = () => {
  const t = useTheme();
  const colors = t.colors;
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const toast = useToast();

  const { profile } = useProfileContext();
  const updateMutation = useUpdateProfile();

  const currentYear = new Date().getFullYear();
  const currentAge =
    profile?.age ?? (profile?.birth_year ? currentYear - profile.birth_year : 0);

  const [height, setHeight] = useState(profile?.height ? String(profile.height) : '');
  const [weight, setWeight] = useState(profile?.weight ? String(profile.weight) : '');
  const [age, setAge] = useState(currentAge ? String(currentAge) : '');
  const [gender, setGender] = useState<0 | 1>(profile?.gender === 1 ? 1 : 0);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    (profile?.activity_level ?? 3) as ActivityLevel
  );
  const [focused, setFocused] = useState<'height' | 'weight' | 'age' | null>(null);

  const introOpacity = useRef(new Animated.Value(0)).current;
  const introTranslate = useRef(new Animated.Value(16)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(introOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(introTranslate, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [introOpacity, introTranslate]);

  const validate = () => {
    const h = Number(normalizeDigits(height));
    const w = Number(normalizeDigits(weight));
    const a = Number(normalizeDigits(age));

    if (!h || h < 50 || h > 250) {
      toast.show('قد باید بین ۵۰ تا ۲۵۰ سانتی‌متر باشد.', { type: 'error' });
      return null;
    }
    if (!w || w < 20 || w > 300) {
      toast.show('وزن باید بین ۲۰ تا ۳۰۰ کیلوگرم باشد.', { type: 'error' });
      return null;
    }
    if (!a || a < 1 || a > 130) {
      toast.show('سن باید بین ۱ تا ۱۳۰ سال باشد.', { type: 'error' });
      return null;
    }
    return { height: h, weight: w, age: a, gender, activity_level: activityLevel };
  };

  const handleSave = async () => {
    const values = validate();
    if (!values) return;

    try {
      await updateMutation.mutateAsync(values);
      toast.show('پروفایل با موفقیت به‌روزرسانی شد.', { type: 'success' });
      navigation.goBack();
    } catch (e: any) {
      toast.show(e?.message ?? 'به‌روزرسانی انجام نشد.', { type: 'error' });
    }
  };

  const isSubmitting = updateMutation.isPending;

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <View style={styles.headerRow}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={styles.headerIcon}
                hitSlop={10}
              >
                <MaterialDesignIcons name="arrow-right" size={22} color={colors.white} />
              </Pressable>
              <Text style={styles.headerTitle}>ویرایش پروفایل</Text>
              <View style={{ width: 38 }} />
            </View>

            <Text style={styles.headerSubtitle}>
              اطلاعات بدنی‌ات را به‌روز کن تا محاسبه کالری دقیق‌تر شود
            </Text>
          </View>

          <Animated.View
            style={[
              styles.body,
              { opacity: introOpacity, transform: [{ translateY: introTranslate }] },
            ]}
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>قد</Text>
              <InputField
                icon="human-male-height"
                value={height}
                onChangeText={setHeight}
                placeholder="مثلاً ۱۷۵"
                unit="cm"
                focused={focused === 'height'}
                onFocus={() => setFocused('height')}
                onBlur={() => setFocused(null)}
                editable={!isSubmitting}
                styles={styles}
                colors={colors}
              />

              <Text style={styles.cardTitle}>وزن</Text>
              <InputField
                icon="weight-kilogram"
                value={weight}
                onChangeText={setWeight}
                placeholder="مثلاً ۷۰"
                unit="kg"
                focused={focused === 'weight'}
                onFocus={() => setFocused('weight')}
                onBlur={() => setFocused(null)}
                editable={!isSubmitting}
                styles={styles}
                colors={colors}
              />

              <Text style={styles.cardTitle}>سن</Text>
              <InputField
                icon="calendar-account-outline"
                value={age}
                onChangeText={setAge}
                placeholder="مثلاً ۲۱"
                unit="سال"
                focused={focused === 'age'}
                onFocus={() => setFocused('age')}
                onBlur={() => setFocused(null)}
                editable={!isSubmitting}
                styles={styles}
                colors={colors}
              />

              <Text style={styles.cardTitle}>جنسیت</Text>
              <View style={styles.genderRow}>
                <Pressable
                  onPress={() => setGender(0)}
                  style={[styles.genderOption, gender === 0 && styles.genderOptionActive]}
                  disabled={isSubmitting}
                >
                  <MaterialDesignIcons
                    name="gender-female"
                    size={20}
                    color={gender === 0 ? colors.white : colors.muted}
                  />
                  <Text
                    style={[styles.genderLabel, gender === 0 && styles.genderLabelActive]}
                  >
                    خانم
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setGender(1)}
                  style={[styles.genderOption, gender === 1 && styles.genderOptionActive]}
                  disabled={isSubmitting}
                >
                  <MaterialDesignIcons
                    name="gender-male"
                    size={20}
                    color={gender === 1 ? colors.white : colors.muted}
                  />
                  <Text
                    style={[styles.genderLabel, gender === 1 && styles.genderLabelActive]}
                  >
                    آقا
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.cardTitle}>سطح فعالیت</Text>
              <View style={styles.activityList}>
                {ACTIVITY_OPTIONS.map((opt) => {
                  const active = activityLevel === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      onPress={() => setActivityLevel(opt.key)}
                      disabled={isSubmitting}
                      style={[styles.activityOption, active && styles.activityOptionActive]}
                    >
                      <View style={styles.activityIconWrap}>
                        <MaterialDesignIcons
                          name={opt.icon as any}
                          size={20}
                          color={active ? colors.orange : colors.muted}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[styles.activityLabel, active && styles.activityLabelActive]}
                        >
                          {opt.label}
                        </Text>
                        <Text style={styles.activityDesc}>{opt.desc}</Text>
                      </View>
                      {active ? (
                        <MaterialDesignIcons
                          name="check-circle"
                          size={20}
                          color={colors.orange}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Pressable
              onPress={handleSave}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.saveButton,
                (pressed || isSubmitting) && { opacity: 0.85 },
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <MaterialDesignIcons name="content-save-outline" size={20} color={colors.white} />
                  <Text style={styles.saveText}>ذخیره تغییرات</Text>
                </>
              )}
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

function InputField({
  icon,
  value,
  onChangeText,
  placeholder,
  unit,
  focused,
  onFocus,
  onBlur,
  editable,
  styles,
  colors,
}: {
  icon: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  unit: string;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  editable: boolean;
  styles: ReturnType<typeof createStyles>;
  colors: Colors;
}) {
  return (
    <View style={[styles.inputContainer, focused && styles.inputContainerFocused]}>
      <MaterialDesignIcons
        name={icon as any}
        size={20}
        color={focused ? colors.orange : colors.muted}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType="numeric"
        onFocus={onFocus}
        onBlur={onBlur}
        editable={editable}
      />
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },

    header: {
      backgroundColor: colors.orange,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      paddingHorizontal: 20,
      paddingBottom: 26,
      shadowColor: colors.orange,
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
    headerRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    headerIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: { color: colors.white, fontSize: 18, fontFamily: 'vazir' },
    headerSubtitle: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: 12,
      fontFamily: 'vazir',
      textAlign: 'right',
      writingDirection: 'rtl',
      lineHeight: 22,
    },

    body: { paddingHorizontal: 16, paddingTop: 20, gap: 16 },
    card: {
      backgroundColor: colors.white,
      borderRadius: 22,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      gap: 8,
    },
    cardTitle: {
      fontSize: 13,
      fontFamily: 'vazir',
      color: colors.muted,
      textAlign: 'right',
      writingDirection: 'rtl',
      marginTop: 6,
    },
    inputContainer: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 10,
      minHeight: 54,
      paddingHorizontal: 14,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      borderRadius: 16,
    },
    inputContainerFocused: {
      borderColor: colors.orange,
      backgroundColor: colors.white,
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      color: colors.text,
      fontSize: 15,
      fontFamily: 'vazir',
      textAlign: 'right',
    },
    unit: {
      fontSize: 12,
      fontFamily: 'vazir',
      color: colors.muted,
    },
    genderRow: {
      flexDirection: 'row-reverse',
      gap: 10,
      marginTop: 4,
    },
    genderOption: {
      flex: 1,
      minHeight: 52,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      backgroundColor: colors.background,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    genderOptionActive: {
      backgroundColor: colors.orange,
      borderColor: colors.orange,
    },
    genderLabel: {
      fontFamily: 'vazir',
      fontSize: 14,
      color: colors.muted,
    },
    genderLabelActive: {
      color: colors.white,
    },
    activityList: { width: '100%', gap: 10, marginTop: 4 },
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
      width: 36,
      height: 36,
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
    saveButton: {
      minHeight: 56,
      backgroundColor: colors.orange,
      borderRadius: 18,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 4,
      shadowColor: colors.orange,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
    saveText: { color: colors.white, fontSize: 16, fontFamily: 'vazir' },
  });

export default EditProfile;