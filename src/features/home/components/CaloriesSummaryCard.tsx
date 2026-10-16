import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { MacroCard } from '../../../shared/components/MacroCard';
import { CalorieRing } from '@/shared/components/CalorieRing';

type Props = { compact: boolean; ringSize: number };

export function CaloriesSummaryCard({ compact, ringSize }: Props) {
  const t = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: t.colors.white, borderRadius: t.radius.xl, ...t.shadows.card }]}>
      <View style={styles.overview}>
        <CalorieRing size={ringSize} />

        <View style={styles.info}>
          <Text style={[styles.eyebrow, { color: t.colors.muted, fontFamily: t.typography.family }]}>
            کالری امروز
          </Text>

          <View style={styles.numbers}>
            <Text style={[styles.consumed, { fontSize: compact ? 27 : 33, color: t.colors.text, fontFamily: t.typography.family }]}>
              ۱٬۸۵۰
            </Text>
            <Text style={[styles.target, { color: t.colors.muted, fontFamily: t.typography.family }]}>
              {' '}/ ۲٬۲۰۰
            </Text>
          </View>

          <Text style={[styles.unit, { color: t.colors.text, fontFamily: t.typography.family }]}>کیلوکالری</Text>

          <Text style={[styles.remaining, { color: t.colors.muted, fontFamily: t.typography.family }]}>
            <Text style={{ color: t.colors.greenText }}>۳۵۰ </Text>
            کیلوکالری باقی‌مانده
          </Text>
        </View>
      </View>

      <View style={styles.macros}>
        <MacroCard title="چربی" value="۴۵ گرم" color={t.colors.yellow} progress="45%" barColor={t.colors.orangeDeep} />
        <MacroCard title="کربوهیدرات" value="۲۱۰ گرم" color={t.colors.green} progress="72%" barColor={t.colors.greenDeep} />
        <MacroCard title="پروتئین" value="۸۵ گرم" color={t.colors.peach} progress="60%" barColor={t.colors.peachBar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },
  overview: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 20 },
  info: { flex: 1, alignItems: 'flex-end' },
  eyebrow: { fontSize: 12, textAlign: 'right', marginBottom: 7 },
  numbers: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', justifyContent: 'flex-end' },
  consumed: { fontFamily: 'vazir' },
  target: { fontSize: 15 },
  unit: { fontSize: 13, marginTop: 2, textAlign: 'right' },
  remaining: { fontSize: 11, lineHeight: 20, marginTop: 9, textAlign: 'right', writingDirection: 'rtl' },
  macros: { flexDirection: 'row-reverse', gap: 8 },
});
