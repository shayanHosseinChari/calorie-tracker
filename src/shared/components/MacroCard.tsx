import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

type Props = {
  title: string;
  value: string;
  color: string;
  progress: `${number}%`;
  barColor: string;
};

export function MacroCard({ title, value, color, progress, barColor }: Props) {
  const t = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: color, borderRadius: t.radius.md }]}>
      <Text style={[styles.title, { color: t.colors.text, fontFamily: t.typography.family }]}>{title}</Text>
      <View style={[styles.track, { backgroundColor: t.colors.macroTrack }]}>
        <View style={[styles.fill, { width: progress, backgroundColor: barColor }]} />
      </View>
      <Text style={[styles.value, { color: t.colors.macroValue, fontFamily: t.typography.family }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 0, paddingHorizontal: 8, paddingVertical: 12, alignItems: 'center' },
  title: { fontSize: 12, textAlign: 'center' },
  track: { width: '90%', height: 5, borderRadius: 3, marginVertical: 9, overflow: 'hidden', alignItems: 'flex-end' },
  fill: { height: '100%', borderRadius: 3 },
  value: { fontSize: 11, textAlign: 'center', writingDirection: 'rtl' },
});