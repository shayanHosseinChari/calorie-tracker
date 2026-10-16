import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';

type Props = { title: string; hint?: string };

export function SectionHeading({ title, hint }: Props) {
  const t = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: t.colors.text, fontFamily: t.typography.family }]}>{title}</Text>
      {hint && <Text style={[styles.hint, { color: t.colors.muted, fontFamily: t.typography.family }]}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: 27, marginBottom: 15 },
  title: { fontSize: 21, textAlign: 'right' },
  hint: { fontSize: 12 },
});