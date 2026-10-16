import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';

type Props = { compact: boolean };

export function HomeHeader({ compact }: Props) {
  const t = useTheme();
  return (
    <View style={styles.header}>
      <View style={styles.userSection}>
        <View style={[styles.avatar, { backgroundColor: t.colors.peachSoft }]}>
          <Text style={styles.avatarEmoji}>👨🏻</Text>
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text style={[styles.greeting, { fontSize: compact ? 18 : 21, color: t.colors.text, fontFamily: t.typography.family }]}>
            سلام، روز بخیر
          </Text>
          <Text style={[styles.subtitle, { color: t.colors.muted, fontFamily: t.typography.family }]}>
            امروز هم مراقب خودت باش
          </Text>
        </View>
      </View>

      <View style={styles.notification} accessible accessibilityLabel="اعلان‌ها">
        <Text style={[styles.bell, { color: t.colors.text, fontFamily: t.typography.family }]}>♧</Text>
        <View style={[styles.dot, { backgroundColor: t.colors.orange }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26, gap: 10 },
  userSection: { flexDirection: 'row-reverse', alignItems: 'center', flex: 1, gap: 11 },
  avatar: { width: 49, height: 49, borderRadius: 25, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarEmoji: { fontSize: 33 },
  greeting: { textAlign: 'right', writingDirection: 'rtl' },
  subtitle: { fontSize: 11, textAlign: 'right', writingDirection: 'rtl', marginTop: 5 },
  notification: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  bell: { fontSize: 30 },
  dot: { position: 'absolute', top: 7, right: 8, width: 6, height: 6, borderRadius: 3 },
});