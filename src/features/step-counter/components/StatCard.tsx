import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/shared/hooks/useTheme'

type Props = {
  label: string
  value: string
  unit?: string
  icon?: React.ReactNode
  accent?: string
}

export const StatCard: React.FC<Props> = ({ label, value, unit, icon, accent }) => {
  const t = useTheme()
  const { colors, radius, shadows, spacing, typography } = t

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: accent ?? colors.white,
          borderRadius: radius.lg,
          padding: spacing.md,
          ...shadows.card,
        },
      ]}
    >
      {icon && <View style={{ marginBottom: spacing.sm }}>{icon}</View>}

      <Text
        style={{
          fontFamily: typography.family,
          fontSize: typography.size.sm,
          fontWeight: '500',
          color: colors.muted,
        }}
      >
        {label}
      </Text>

      <View style={styles.valueRow}>
        <Text
          style={{
            fontFamily: typography.family,
            fontSize: typography.size.xl,
            fontWeight: '700',
            color: colors.text,
          }}
        >
          {value}
        </Text>
        {unit && (
          <Text
            style={{
              fontFamily: typography.family,
              fontSize: typography.size.xs,
              color: colors.muted,
              marginLeft: spacing.xs,
            }}
          >
            {unit}
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
})