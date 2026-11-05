import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
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
  onSelectGoal?: (g: GoalType) => void;
};

const faNum = (n: number) => Math.round(n).toLocaleString('fa-IR');

/* ---------- هاله‌ی نورانی ---------- */
function Halo({
  color,
  size,
  opacity = '14',
}: {
  color: string;
  size: number;
  opacity?: string;
}) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color + opacity,
      }}
    />
  );
}

/* ---------- نوار پیشرفت لوکس با thumb نورانی ---------- */
function LuxeProgressBar({
  progress,
  color,
  trackColor,
  height = 10,
  thumbSize,
  showThumb = true,
}: {
  progress: number;
  color: string;
  trackColor: string;
  height?: number;
  thumbSize?: number;
  showThumb?: boolean;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [trackW, setTrackW] = React.useState(0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: Math.min(Math.max(progress, 0), 1),
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, anim]);

  const thumb = thumbSize ?? height + 6;

  return (
    <View
      onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}
      style={{
        height: Math.max(height, thumb),
        justifyContent: 'center',
      }}
    >
      {/* track */}
      <View
        style={{
          height,
          borderRadius: 999,
          backgroundColor: trackColor,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            borderRadius: 999,
            backgroundColor: color,
            width: anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
        {/* درخشش ملایم روی نوار */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            opacity: 0.08,
          }}
        />
      </View>

      {/* thumb نورانی */}
      {showThumb && trackW > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: (Math.max(height, thumb) - thumb) / 2,
            width: thumb,
            height: thumb,
            borderRadius: thumb / 2,
            backgroundColor: color,
            borderWidth: 2,
            borderColor: '#FFFFFF',
            shadowColor: color,
            shadowOpacity: 0.7,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 0 },
            elevation: 6,
            transform: [
              {
                translateX: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Math.max(trackW - thumb, 0)],
                }),
              },
            ],
          }}
        />
      ) : null}
    </View>
  );
}

/* ---------- segmented goal control ---------- */
function GoalSegment({
  label,
  value,
  active,
  color,
  colors,
  fontFamily,
  onPress,
}: {
  label: string;
  value: number;
  active: boolean;
  color: string;
  colors: any;
  fontFamily: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.segment,
        {
          backgroundColor: active ? color + '14' : 'transparent',
          borderColor: active ? color + '44' : 'transparent',
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {active && (
        <View
          style={{
            position: 'absolute',
            bottom: 4,
            width: 18,
            height: 3,
            borderRadius: 3,
            backgroundColor: color,
          }}
        />
      )}
      <Text
        style={{
          fontSize: 10,
          color: active ? color : colors.muted,
          fontFamily,
          marginBottom: 2,
        }}
      >
        {label}
      </Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{
          fontSize: active ? 14 : 13,
          color: active ? color : colors.text,
          fontFamily,
        }}
      >
        {faNum(value)}
      </Text>
    </Pressable>
  );
}

/* ---------- ماکرو shard ---------- */
function MacroShard({
  title,
  value,
  color,
  progress,
  colors,
  fontFamily,
}: {
  title: string;
  value: string;
  color: string;
  progress: number;
  colors: any;
  fontFamily: string;
}) {
  return (
    <View
      style={[
        styles.macroShard,
        { backgroundColor: color + '0D', borderColor: color + '22' },
      ]}
    >
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 6,
          marginBottom: 6,
        }}
      >
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: color,
            shadowColor: color,
            shadowOpacity: 0.8,
            shadowRadius: 4,
          }}
        />
        <Text style={{ fontSize: 10, color: colors.muted, fontFamily }}>{title}</Text>
      </View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{ fontSize: 13, color: colors.text, fontFamily, marginBottom: 10 }}
      >
        {value}
      </Text>
      <LuxeProgressBar
        progress={progress}
        color={color}
        trackColor={color + '1F'}
        height={6}
        thumbSize={10}
      />
    </View>
  );
}

/* ============================================================== */
/* =======================   MAIN CARD   ======================== */
/* ============================================================== */

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
  onSelectGoal,
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

  const accent = over > 0 ? t.colors.neutralIconActive : t.colors.greenDeep;
  const accentSoft = accent + '1A';

  /* انیمیشن ورود عدد مصرف‌شده */
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    enter.setValue(0);
    Animated.timing(enter, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [consumed, enter]);

  const consumedScale = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1],
  });
  const consumedOpacity = enter;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.colors.white,
          borderRadius: 26,
          padding: compact ? 16 : 20,
          shadowColor: '#0B3B2E',
          shadowOpacity: 0.08,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 12 },
          elevation: 6,
        },
      ]}
    >
      {/* هاله‌ی نورانی پس‌زمینه */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -40,
          right: -30,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: accentSoft,
          opacity: 0.6,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom: -50,
          left: -40,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: t.colors.greenTrack + '55',
          opacity: 0.6,
        }}
      />

      {/* هدر */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          gap: 6,
          marginBottom: 14,
        }}
      >
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: accent,
            shadowColor: accent,
            shadowOpacity: 0.9,
            shadowRadius: 6,
          }}
        />
        <Text
          style={{
            fontSize: 11,
            color: t.colors.muted,
            fontFamily: t.typography.family,
          }}
        >
          کالری امروز
        </Text>
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: t.colors.muted + '80',
          }}
        />
        <Text
          style={{
            fontSize: 11,
            color: accent,
            fontFamily: t.typography.family,
          }}
        >
          {goalLabel}
        </Text>
      </View>

      {/* Overview — حلقه بالا، متن و نوار افقی زیرش */}
      <View style={styles.overview}>
        {/* حلقه با هاله */}
        <View style={{ alignSelf: 'center' }}>
          <Halo color={accent} size={ringSize + 26} opacity="10" />
          <Halo color={accent} size={ringSize + 12} opacity="14" />
          <CalorieRing
            size={ringSize}
            progress={progress}
            consumed={consumed}
            goal={goal}
          />
        </View>

        {/* متن + نوار افقی */}
        <View style={styles.info}>
          <Animated.View
            style={[
              styles.numbers,
              {
                opacity: consumedOpacity,
                transform: [{ scale: consumedScale }],
                justifyContent: 'center',
              },
            ]}
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: compact ? 30 : 38,
                color: t.colors.text,
                fontFamily: t.typography.family,
              }}
            >
              {faNum(consumed)}
            </Text>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 10,
                backgroundColor: t.colors.greenTrack + 'AA',
                marginStart: 6,
                alignSelf: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: t.colors.muted,
                  fontFamily: t.typography.family,
                }}
              >
                از {faNum(goal)}
              </Text>
            </View>
          </Animated.View>

          <Text
            style={{
              fontSize: 11,
              color: t.colors.muted,
              fontFamily: t.typography.family,
              marginTop: 4,
              textAlign: 'center',
            }}
          >
            کالری
          </Text>

          {/* نوار افقی — تمام‌عرض، زیر عدد، بالای segmented */}
          <View style={{ marginTop: 12, width: '100%' }}>
            <LuxeProgressBar
              progress={progress}
              color={accent}
              trackColor={t.colors.greenTrack}
              height={10}
            />
          </View>

          <Text
            style={{
              fontSize: 11,
              marginTop: 10,
              textAlign: 'center',
              color: t.colors.muted,
              fontFamily: t.typography.family,
              writingDirection: 'rtl',
            }}
          >
            {over > 0 ? (
              <>
                <Text style={{ color: accent }}>{faNum(over)} </Text>
                کالری بیش از هدف
              </>
            ) : (
              <>
                <Text style={{ color: accent }}>{faNum(remaining)} </Text>
                کالری باقی‌مانده
              </>
            )}
          </Text>
        </View>
      </View>

      {/* Segmented goals */}
      <View
        style={[
          styles.segmentWrap,
          {
            backgroundColor: t.colors.background,
            borderColor: t.colors.greenTrack + '80',
            marginBottom: 14,
          },
        ]}
      >
        <GoalSegment
          label="کاهش"
          value={lose}
          active={goalType === 'lose'}
          color={t.colors.orangeDeep}
          colors={t.colors}
          fontFamily={t.typography.family}
          onPress={() => onSelectGoal?.('lose')}
        />
        <GoalSegment
          label="ثبات"
          value={maintain}
          active={goalType === 'maintain'}
          color={t.colors.greenDeep}
          colors={t.colors}
          fontFamily={t.typography.family}
          onPress={() => onSelectGoal?.('maintain')}
        />
        <GoalSegment
          label="افزایش"
          value={gain}
          active={goalType === 'gain'}
          color={t.colors.peachBar}
          colors={t.colors}
          fontFamily={t.typography.family}
          onPress={() => onSelectGoal?.('gain')}
        />
      </View>

      {/* Macros */}
      {macros ? (
        <View style={styles.macros}>
          <MacroShard
            title="چربی"
            value={`${faNum(macros.fat.value)} گرم`}
            color={t.colors.orangeDeep}
            progress={Math.min(macros.fat.value / Math.max(macros.fat.target, 1), 1)}
            colors={t.colors}
            fontFamily={t.typography.family}
          />
          <MacroShard
            title="کربوهیدرات"
            value={`${faNum(macros.carbs.value)} گرم`}
            color={t.colors.greenDeep}
            progress={Math.min(macros.carbs.value / Math.max(macros.carbs.target, 1), 1)}
            colors={t.colors}
            fontFamily={t.typography.family}
          />
          <MacroShard
            title="پروتئین"
            value={`${faNum(macros.protein.value)} گرم`}
            color={t.colors.peachBar}
            progress={Math.min(
              macros.protein.value / Math.max(macros.protein.target, 1),
              1
            )}
            colors={t.colors}
            fontFamily={t.typography.family}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  overview: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 14,
    marginBottom: 16,
  },
  info: { width: '100%', alignItems: 'center', minWidth: 0 },
  numbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  segmentWrap: {
    flexDirection: 'row-reverse',
    gap: 4,
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  segment: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  macros: { flexDirection: 'row-reverse', gap: 8 },
  macroShard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
    minWidth: 0,
  },
});