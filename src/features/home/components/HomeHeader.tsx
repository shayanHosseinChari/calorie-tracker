import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useProfileContext } from '@/features/profile/context/ProfileContext';

type Props = { compact: boolean };

// 👇 انتخاب ایموجی بر اساس جنسیت
function getAvatarEmoji(gender?: number | null): string {
  const g =gender;

  if (g === 1 ) {
    return '👨🏻';
  }
  if (g === 0) {
    return '👩🏻';
  }

  // پیش‌فرض (نامشخص)
  return '🧑🏻';
}

export function HomeHeader({ compact }: Props) {
  const t = useTheme();
  const { profile } = useProfileContext();

  const avatarEmoji = getAvatarEmoji(profile?.gender);

  return (
    <View style={styles.header}>
      <View style={styles.userSection}>
        <View style={[styles.avatar, { backgroundColor: t.colors.peachSoft }]}>
          <Text style={styles.avatarEmoji}>{avatarEmoji}</Text>
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text
            numberOfLines={1}
            style={[
              styles.greeting,
              {
                fontSize: compact ? 18 : 21,
                color: t.colors.text,
                fontFamily: t.typography.family,
              },
            ]}
          >
            {profile?.name} سلام، روز بخیر
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: t.colors.muted, fontFamily: t.typography.family },
            ]}
          >
            امروز هم مراقب خودت باش
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
    gap: 10,
  },
  userSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flex: 1,
    gap: 11,
  },
  avatar: {
    width: 49,
    height: 49,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarEmoji: { fontSize: 33 },
  greeting: { textAlign: 'right', writingDirection: 'rtl' },
  subtitle: {
    fontSize: 11,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 5,
  },
});