import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export type Meal = {
  id: string;
  title: string;
  calories: string;
  icon: string;
  color: string;
};

type Props = { meal: Meal; compact?: boolean; onPress?: () => void };

export function MealCard({ meal, compact, onPress }: Props) {
  const t = useTheme();
  const iconSize = compact ? 48 : 58;

  return (
    <View style={[styles.card, { backgroundColor: t.colors.white, borderRadius: t.radius.lg, ...t.shadows.soft }]}>
      <View style={[styles.icon, { backgroundColor: meal.color, width: iconSize, height: iconSize, borderRadius: t.radius.md }]}>
        <Text style={styles.emoji}>{meal.icon}</Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, { color: t.colors.text, fontFamily: t.typography.family }]}>{meal.title}</Text>
        <Text style={[styles.cal, { color: t.colors.muted, fontFamily: t.typography.family }]}>
          {meal.calories} کیلوکالری
        </Text>
      </View>

      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`افزودن غذا به ${meal.title}`}
        style={[styles.add, { backgroundColor: t.colors.peachDeep }]}
      >
        <Text style={[styles.addText, { color: t.colors.addIcon, fontFamily: t.typography.family }]}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row-reverse', alignItems: 'center', padding: 12, gap: 12 },
  icon: { alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 29 },
  info: { flex: 1, alignItems: 'flex-end' },
  title: { fontSize: 17, textAlign: 'right' },
  cal: { fontSize: 12, marginTop: 5, textAlign: 'right', writingDirection: 'rtl' },
  add: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  addText: { fontSize: 26, lineHeight: 32 },
});