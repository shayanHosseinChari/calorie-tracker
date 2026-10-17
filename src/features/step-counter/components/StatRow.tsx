import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useTheme } from '@/shared/hooks/useTheme'
import { StatCard } from './StatCard'

type Props = {
  distanceKm: number
  calories: number
  activeMinutes: number
}

export const StatsRow: React.FC<Props> = ({ distanceKm, calories, activeMinutes }) => {
  const { colors, spacing } = useTheme()

  return (
    <View style={[styles.row, { gap: spacing.sm }]}>
      <StatCard
        label="مسافت"
        value={distanceKm.toLocaleString('fa-IR')}
        unit="کیلومتر"
        accent={colors.peachSoft}
      />
      <StatCard
        label="کالری"
        value={calories.toLocaleString('fa-IR')}
        unit="kcal"
        accent={colors.yellow}
      />
      <StatCard
        label="فعال"
        value={activeMinutes.toLocaleString('fa-IR')}
        unit="دقیقه"
        accent={colors.greenSurface}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
})