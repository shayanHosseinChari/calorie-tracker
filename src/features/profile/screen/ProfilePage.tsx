import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import { useTheme } from '@/shared/hooks/useTheme';
import { useProfileContext } from '@/features/profile/context/ProfileContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useNavigation } from '@react-navigation/native';

type Colors = ReturnType<typeof useTheme>['colors'];

const MENU_ITEMS = [
  { icon: 'account-edit-outline', label: 'ویرایش پروفایل', route: 'EditProfile' },
  { icon: 'chart-line', label: 'گزارش‌ها', route: 'Reports' },

] as const;

const NAVBAR_HEIGHT = 56;

const ProfilePage = () => {
  const t = useTheme();
  const colors = t.colors;
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
const navigation = useNavigation()
  const { profile,error,isLoading,isError,refetch } = useProfileContext();
  const { signOut } = useAuth();

  const initial = profile?.name?.trim()?.[0] ?? '؟';
  const genderLabel = profile?.gender === 1 ? 'آقا' : 'خانم';
const currentYear = new Date().getFullYear();
const age =
  profile?.age ??
  (profile?.birth_year ? currentYear - profile.birth_year : null);
const ageLabel = age != null ? `${age} ساله` : '—';
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showNavbar, setShowNavbar] = useState(false);

  const threshold = Math.max(headerHeight - NAVBAR_HEIGHT - insets.top, 40);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const y = event.nativeEvent.contentOffset.y;
        const shouldShow = y > threshold;
        if (shouldShow !== showNavbar) setShowNavbar(shouldShow);
      },
    }
  );

  const navbarOpacity = scrollY.interpolate({
    inputRange: [4 ,20],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const navbarTranslateY = scrollY.interpolate({
    inputRange: [0 , threshold],
    outputRange: [-12, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.screen}>
      <Animated.View
        pointerEvents={showNavbar ? 'auto' : 'none'}
        style={[
          styles.navbar,
          {
            paddingTop: insets.top,
            height: NAVBAR_HEIGHT + insets.top,
            opacity: navbarOpacity,
            transform: [{ translateY: navbarTranslateY }],
          },
        ]}
      >
        <View style={styles.navbarInner}>
          <View style={styles.navbarAvatar}>
            <Text style={styles.navbarAvatarText}>{initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.navbarName} numberOfLines={1}>
              {profile?.name }
            </Text>
           <Text style={styles.navbarSubtitle} numberOfLines={1}>
  {genderLabel} • {ageLabel}
</Text>
          </View>
          <Pressable style={styles.navbarIcon} hitSlop={10}>
            <MaterialDesignIcons name="bell-outline" size={20} color={colors.white} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
          style={[styles.header, { paddingTop: insets.top + 12 }]}
        >
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>پروفایل</Text>
            <Pressable onPress={()=>{
                 navigation.navigate("EditProfilePage")
            }} style={styles.headerIcon} hitSlop={10}>
              <MaterialDesignIcons name="pen-plus" size={22} color={colors.white} />
              <View style={styles.bellDot} />
            </Pressable>
          </View>

          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{profile?.name ?? 'کاربر'}</Text>
              <Text style={styles.subtitle}>
                {genderLabel} • {profile?.birth_year} 
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <Stat label="قد" value={profile?.height ? `${profile.height} cm` : '—'} styles={styles} />
            <View style={styles.statDivider} />
            <Stat label="وزن" value={profile?.weight ? `${profile.weight} kg` : '—'} styles={styles} />
            <View style={styles.statDivider} />
            <Stat label="سن" value={profile?.age ? `${profile.age}` : '—'} styles={styles} />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>اطلاعات حساب</Text>
            <InfoRow icon="phone-outline" label="شماره موبایل" value={profile?.phone ?? '—'} styles={styles} colors={colors} />
            <InfoRow icon="cake-variant-outline" label="سال تولد" value={profile?.birth_year ? String(profile.birth_year) : '—'} styles={styles} colors={colors} />
            <InfoRow icon="gender-male-female" label="جنسیت" value={genderLabel} styles={styles} colors={colors} last />
          </View>

         

          <Pressable onPress={signOut} style={({ pressed }) => [styles.logout, pressed && { opacity: 0.7 }]}>
            <MaterialDesignIcons name="logout" size={20} color={colors.neutralIconActive} />
            <Text style={styles.logoutText}>خروج از حساب</Text>
          </Pressable>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

function Stat({ label, value, styles }: { label: string; value: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value, styles, colors, last }: { icon: string; label: string; value: string; styles: ReturnType<typeof createStyles>; colors: Colors; last?: boolean }) {
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
      <MaterialDesignIcons name={icon as any} size={20} color={colors.muted} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },

    navbar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: colors.orange,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
      justifyContent: 'flex-end',
    },
    navbarInner: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    navbarAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.25)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'rgba(255,255,255,0.6)',
    },
    navbarAvatarText: { color: colors.white, fontSize: 16, fontFamily: 'vazir' },
    navbarName: { color: colors.white, fontSize: 14, fontFamily: 'vazir', textAlign: 'right', writingDirection: 'rtl' },
    navbarSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontFamily: 'vazir', textAlign: 'right', writingDirection: 'rtl', marginTop: 1 },
    navbarIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },

    header: {
      backgroundColor: colors.orange,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      paddingHorizontal: 20,
      paddingBottom: 22,
      shadowColor: colors.orange,
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
    headerRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
    headerTitle: { color: colors.white, fontSize: 18, fontFamily: 'vazir' },
    headerIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
    bellDot: { position: 'absolute', top: 9, right: 10, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
    avatarRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 14 },
    avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)' },
    avatarText: { color: colors.white, fontSize: 26, fontFamily: 'vazir' },
    name: { color: colors.white, fontSize: 18, fontFamily: 'vazir', textAlign: 'right', writingDirection: 'rtl' },
    subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontFamily: 'vazir', marginTop: 4, textAlign: 'right', writingDirection: 'rtl' },
    statsRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 8, marginTop: 20 },
    stat: { flex: 1, alignItems: 'center' },
    statValue: { color: colors.white, fontSize: 14, fontFamily: 'vazir' },
    statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontFamily: 'vazir', marginTop: 2 },
    statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.25)' },

    body: { paddingHorizontal: 16, paddingTop: 20, gap: 14 },
    card: { backgroundColor: colors.white, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: colors.greenTrack },
    cardTitle: { fontSize: 13, fontFamily: 'vazir', color: colors.muted, textAlign: 'right', writingDirection: 'rtl', marginBottom: 10 },
    infoRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.greenTrack },
    infoLabel: { flex: 1, fontSize: 13, fontFamily: 'vazir', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },
    infoValue: { fontSize: 13, fontFamily: 'vazir', color: colors.muted },
    menuRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.greenTrack },
    menuIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.peachSoft, alignItems: 'center', justifyContent: 'center' },
    menuLabel: { flex: 1, fontSize: 14, fontFamily: 'vazir', color: colors.text, textAlign: 'right', writingDirection: 'rtl' },
    logout: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FDECEC', borderRadius: 18, paddingVertical: 14, marginTop: 6 },
    logoutText: { color: colors.neutralIconActive, fontSize: 14, fontFamily: 'vazir' },
  });

export default ProfilePage;