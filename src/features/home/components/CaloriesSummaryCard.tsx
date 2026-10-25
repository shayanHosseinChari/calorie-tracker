import React, { useMemo } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';
import { MacroCard } from '@/shared/components/MacroCard';
import { CalorieRing } from '@/shared/components/CalorieRing';

type GoalType = 'lose' | 'maintain' | 'gain';

type Props = {
  compact: boolean;
  ringSize: number;
  consumed: number;
  goal: number;
  maintain: number;
  lose: number;
  gain: number;
  goalType: GoalType;
  macros?: {
    fat: { value: number; target: number };
    carbs: { value: number; target: number };
    protein: { value: number; target: number };
  };
};

const faNum = (n: number) =>
  Math.round(n).toLocaleString('fa-IR');

export function CaloriesSummaryCard({
  compact,
  ringSize,
  consumed,
  goal,
  maintain,
  lose,
  gain,
  goalType,
  macros,
}: Props) {
  const t = useTheme();
  const { width } = useWindowDimensions();

  const isNarrow = width < 360;
  const remaining = Math.max(goal - consumed, 0);
  const over = consumed > goal ? consumed - goal : 0;
  const progress = goal > 0 ? Math.min(consumed / goal, 1) : 0;

  const goalLabel = useMemo(() => {
    if (goalType === 'lose') return 'کاهش وزن';
    if (goalType === 'gain') return 'افزایش وزن';
    return 'ثبات وزن';
  }, [goalType]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.colors.white,
          borderRadius: t.radius.xl,
          ...t.shadows.card,
          padding: compact ? 14 : 16,
        },
      ]}
    >
      <View style={styles.overview}>
        <CalorieRing size={ringSize} progress={progress} consumed={consumed} goal={goal} />

        <View style={styles.info}>
          <Text
            style={[
              styles.eyebrow,
              { color: t.colors.muted, fontFamily: t.typography.family },
            ]}
          >
            کالری امروز • {goalLabel}
          </Text>

          <View style={styles.numbers}>
            <Text
              style={[
                styles.consumed,
                {
                  fontSize: compact ? 26 : 32,
                  color: t.colors.text,
                  fontFamily: t.typography.family,
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {faNum(consumed)}
            </Text>
            <Text
              style={[
                styles.target,
                { color: t.colors.muted, fontFamily: t.typography.family },
              ]}
            >
              {' '}/ {faNum(goal)}
            </Text>
          </View>

          <Text
            style={[
              styles.unit,
              { color: t.colors.text, fontFamily: t.typography.family },
            ]}
          >
            کالری
          </Text>

          <Text
            style={[
              styles.remaining,
              { color: t.colors.muted, fontFamily: t.typography.family },
            ]}
          >
            {over > 0 ? (
              <>
                <Text style={{ color: t.colors.neutralIconActive }}>{faNum(over)} </Text>
                کالری بیش از هدف
              </>
            ) : (
              <>
                <Text style={{ color: t.colors.greenText }}>{faNum(remaining)} </Text>
                کالری باقی‌مانده
              </>
            )}
          </Text>
        </View>
      </View>

      {/* سه هدف: کاهش / ثبات / افزایش */}
      <View style={styles.targetsRow}>
        <GoalPill
          label="کاهش"
          value={lose}
          active={goalType === 'lose'}
          color={t.colors.orangeDeep}
          colors={t.colors}
          fontFamily={t.typography.family}
        />
        <GoalPill
          label="ثبات"
          value={maintain}
          active={goalType === 'maintain'}
          color={t.colors.greenDeep}
          colors={t.colors}
          fontFamily={t.typography.family}
        />
        <GoalPill
          label="افزایش"
          value={gain}
          active={goalType === 'gain'}
          color={t.colors.peachBar}
          colors={t.colors}
          fontFamily={t.typography.family}
        />
      </View>

      {macros ? (
        <View style={styles.macros}>
          <MacroCard
            title="چربی"
            value={`${faNum(macros.fat.value)} گرم`}
            color={t.colors.yellow}
            progress={`${Math.round(
              Math.min(macros.fat.value / Math.max(macros.fat.target, 1), 1) * 100
            )}%`}
            barColor={t.colors.orangeDeep}
          />
          <MacroCard
            title="کربوهیدرات"
            value={`${faNum(macros.carbs.value)} گرم`}
            color={t.colors.green}
            progress={`${Math.round(
              Math.min(macros.carbs.value / Math.max(macros.carbs.target, 1), 1) * 100
            )}%`}
            barColor={t.colors.greenDeep}
          />
          <MacroCard
            title="پروتئین"
            value={`${faNum(macros.protein.value)} گرم`}
            color={t.colors.peach}
            progress={`${Math.round(
              Math.min(macros.protein.value / Math.max(macros.protein.target, 1), 1) * 100
            )}%`}
            barColor={t.colors.peachBar}
          />
        </View>
      ) : null}
    </View>
  );
}

function GoalPill({
  label,
  value,
  active,
  color,
  colors,
  fontFamily,
}: {
  label: string;
  value: number;
  active: boolean;
  color: string;
  colors: any;
  fontFamily: string;
}) {
  return (
    <View
      style={[
        styles.pill,
        {
          borderColor: active ? color : colors.greenTrack,
          backgroundColor: active ? color + '18' : colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.pillLabel,
          { color: active ? color : colors.muted, fontFamily },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.pillValue,
          { color: active ? color : colors.text, fontFamily },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {faNum(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },
  overview: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  info: { flex: 1, alignItems: 'flex-end', minWidth: 0 },
  eyebrow: { fontSize: 12, textAlign: 'right', marginBottom: 7 },
  numbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: '100%',
  },
  consumed: { fontFamily: 'vazir' },
  target: { fontSize: 15 },
  unit: { fontSize: 13, marginTop: 2, textAlign: 'right' },
  remaining: {
    fontSize: 11,
    lineHeight: 20,
    marginTop: 9,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  targetsRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  pillLabel: { fontSize: 10, marginBottom: 2 },
  pillValue: { fontSize: 13 },
  macros: { flexDirection: 'row-reverse', gap: 8 },
});