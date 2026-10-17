import React from 'react'
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import { useTheme } from '@/shared/hooks/useTheme'

type Props = {
  onReset: () => void
}

export const ActionButtons: React.FC<Props> = ({ onReset }) => {
  const t = useTheme()
  const { colors, radius, spacing, typography, shadows } = t

  const handleReset = () => {
    Alert.alert(
      'ریست قدم‌ها',
      'مطمئنی می‌خوای قدم‌های امروز رو صفر کنی؟',
      [
        { text: 'انصراف', style: 'cancel' },
        { text: 'ریست', style: 'destructive', onPress: onReset },
      ],
    )
  }

  return (
    <View style={[styles.row, { gap: spacing.sm, marginTop: spacing.lg }]}>
      <Pressable
        onPress={handleReset}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: colors.peachDeep,
            borderRadius: radius.lg,
            paddingVertical: spacing.md,
            opacity: pressed ? 0.8 : 1,
            ...shadows.card,
          },
        ]}
      >
        <Text
          style={{
            fontFamily: typography.family,
            fontSize: typography.size.base,
            fontWeight: '700',
            color: colors.neutralIconActive,
            textAlign: 'center',
          }}
        >
          ریست قدم‌ها
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row',position:"absolute", bottom:50,},
  btn: { padding: 10},
})