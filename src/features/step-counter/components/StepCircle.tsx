import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { useTheme } from '@/shared/hooks/useTheme'

type Props = {
  steps: number
  goal: number
  progress: number
  size?: number
  strokeWidth?: number
}

export const StepCircle: React.FC<Props> = ({
  steps,
  goal,
  progress,
  size = 260,
  strokeWidth = 18,
}) => {
  const t = useTheme()
  const { colors, spacing, typography } = t

  const center = size / 2
  const radiusValue = center - strokeWidth / 2
  const circumference = 2 * Math.PI * radiusValue
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radiusValue}
          stroke={colors.ringTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radiusValue}
          stroke={colors.ringOrange}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      <View style={styles.centerContent}>
        <Text
          style={{
            fontFamily: typography.family,
            fontSize: typography.size.display,
            color: colors.text,
            letterSpacing: -1,
          }}
        >
          {steps.toLocaleString('fa-IR')}
        </Text>
        <Text
          style={{
            fontFamily: typography.family,
            fontSize: typography.size.base,
            color: colors.muted,
            marginTop: spacing.xs,
          }}
        >
          از {goal.toLocaleString('fa-IR')} قدم
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  centerContent: {
    position:"absolute",
    alignItems: 'center',
    justifyContent: 'center',
  },
})