import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';

type Props = {
  size?: number;
  strokeWidth?: number;
  innerStrokeWidth?: number;
  outerProgress?: number;
  innerProgress?: number;
  percentLabel?: string;
  caption?: string;
};

export function CalorieRing({
  size = 124,
  strokeWidth = 7,
  innerStrokeWidth = 6,
  outerProgress = 84,
  innerProgress = 60,
  percentLabel,
  caption = 'هدف روزانه',
}: Props) {
  const t = useTheme();

  const cx = size / 2;
  const cy = size / 2;
  const outerR = (size - strokeWidth) / 2;
  const innerR = outerR - strokeWidth - 3 - innerStrokeWidth / 2;

  const outerC = 2 * Math.PI * outerR;
  const innerC = 2 * Math.PI * innerR;

  const clampedOuter = Math.max(0, Math.min(100, outerProgress));
  const clampedInner = Math.max(0, Math.min(100, innerProgress));

  const outerDash = (clampedOuter / 100) * outerC;
  const innerDash = (clampedInner / 100) * innerC;

  const label = percentLabel ?? `${toPersianDigits(Math.round(clampedOuter))}٪`;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <View
        style={[
          styles.glow,
          {
            width: size * 0.98,
            height: size * 0.98,
            borderRadius: size,
            backgroundColor: t.colors.ringGlow,
          },
        ]}
      />

      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="outerGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={t.colors.ringOrange} />
            <Stop offset="1" stopColor={t.colors.orange} />
          </LinearGradient>

          <LinearGradient id="innerGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={t.colors.greenSurfaceAlt} />
            <Stop offset="1" stopColor={t.colors.greenDeep} />
          </LinearGradient>
        </Defs>

        <Circle
          cx={cx}
          cy={cy}
          r={outerR}
          stroke={t.colors.ringTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={outerR}
          stroke="url(#outerGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${outerDash} ${outerC - outerDash}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />

        <Circle
          cx={cx}
          cy={cy}
          r={innerR}
          stroke={t.colors.greenTrack}
          strokeWidth={innerStrokeWidth}
          fill="none"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={innerR}
          stroke="url(#innerGrad)"
          strokeWidth={innerStrokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${innerDash} ${innerC - innerDash}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>

      <View style={styles.center} pointerEvents="none">
        <Text
          style={[
            styles.percent,
            {
              color: t.colors.greenTextDarker,
              fontFamily: t.typography.family,
              fontSize: size * 0.16,
            },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.caption,
            {
              color: t.colors.muted,
              fontFamily: t.typography.family,
              fontSize: size * 0.065,
            },
          ]}
        >
          {caption}
        </Text>
      </View>
    </View>
  );
}

function toPersianDigits(input: number | string): string {
  const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/\d/g, d => map[Number(d)]);
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  center: {
    position:"absolute",
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    fontWeight: '600',
  },
  caption: {
    marginTop: 2,
  },
});