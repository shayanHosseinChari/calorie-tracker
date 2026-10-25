import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { TOP_BAR_HEIGHT } from '../constants';
import { formatCalories } from '../utils';

interface Props {
  consumedCalories?: number;
  dailyGoal?: number;
  progress: number | null;
  compact: boolean;
  pagePadding: number;
  opacity: Animated.AnimatedInterpolation<number>;
  translateY: Animated.AnimatedInterpolation<number>;
  isHeaderVisible: boolean;
  theme: any;
}

export function HomeTopBar({
  consumedCalories,
  dailyGoal,
  progress,
  compact,
  pagePadding,
  opacity,
  translateY,
  isHeaderVisible,
  theme: t,
}: Props) {
  const fontFamily = t.typography.family;
  const consumedLabel = formatCalories(consumedCalories);
  const goalLabel = formatCalories(dailyGoal);

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden={!isHeaderVisible}
      importantForAccessibility={
        isHeaderVisible ? 'auto' : 'no-hide-descendants'
      }
      style={[
        styles.topBar,
        {
          backgroundColor: t.colors.background,
          borderBottomColor: t.colors.greenSurface,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View
        style={[styles.topBarRow, { paddingHorizontal: pagePadding }]}
      >
        <Metric
          label="مصرف‌شده"
          value={consumedLabel}
          unit="کالری"
          dotColor={t.colors.orange}
          valueColor={t.colors.orange}
          compact={compact}
          accessibilityLabel={`کالری مصرف‌شده: ${consumedLabel} کالری`}
          theme={t}
        />

        <View
          style={[
            styles.topBarDivider,
            { backgroundColor: t.colors.greenSurface },
          ]}
        />

        <Metric
          label="هدف روزانه"
          value={goalLabel}
          unit="کالری"
          dotColor={t.colors.greenTextDark}
          valueColor={t.colors.greenTextDark}
          compact={compact}
          accessibilityLabel={`هدف روزانه: ${goalLabel} کالری`}
          theme={t}
        />
      </View>

      {progress !== null && (
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: t.colors.greenSurface },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: t.colors.orange,
              },
            ]}
          />
        </View>
      )}
    </Animated.View>
  );
}

interface MetricProps {
  label: string;
  value: string;
  unit: string;
  dotColor: string;
  valueColor: string;
  compact: boolean;
  accessibilityLabel: string;
  theme: any;
}

function Metric({
  label,
  value,
  unit,
  dotColor,
  valueColor,
  compact,
  accessibilityLabel,
  theme: t,
}: MetricProps) {
  const fontFamily = t.typography.family;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={styles.topBarMetric}
    >
      <View style={[styles.metricDot, { backgroundColor: dotColor }]} />

      <View style={styles.metricContent}>
        <Text
          numberOfLines={1}
          style={[
            styles.metricLabel,
            { color: t.colors.greenTextDark, fontFamily },
          ]}
        >
          {label}
        </Text>

        <View style={styles.metricValueRow}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            style={[
              styles.metricValue,
              { color: valueColor, fontFamily, fontSize: compact ? 18 : 21 },
            ]}
          >
            {value}
          </Text>

          <Text
            numberOfLines={1}
            style={[styles.metricUnit, { color: t.colors.muted, fontFamily }]}
          >
            {unit}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TOP_BAR_HEIGHT,
    zIndex: 20,
    elevation: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topBarRow: {
    flex: 1,
    direction: 'ltr',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  topBarMetric: {
    flex: 1,
    minWidth: 0,
    direction: 'ltr',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  metricDot: { width: 7, height: 7, borderRadius: 4 },
  metricContent: { flex: 1, minWidth: 0, alignItems: 'flex-end' },
  metricLabel: {
    fontSize: 11,
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  metricValueRow: {
    width: '100%',
    direction: 'ltr',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
  },
  metricValue: {
    flexShrink: 1,
    lineHeight: 28,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  metricUnit: { fontSize: 10, lineHeight: 20, writingDirection: 'rtl' },
  topBarDivider: { width: 1, height: 34 },
  progressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    direction: 'ltr',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
});