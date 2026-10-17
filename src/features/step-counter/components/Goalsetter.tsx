import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native'
import { useTheme } from '@/shared/hooks/useTheme'

type Props = {
  goal: number
  onSave: (value: number) => void
}

const PRESETS = [5000, 8000, 10000, 12000, 15000]

export const GoalSetter: React.FC<Props> = ({ goal, onSave }) => {
  const t = useTheme()
  const { colors, radius, shadows, spacing, typography } = t
  const [value, setValue] = useState(String(goal))

  const handleSave = () => {
    const num = Number(value.replace(/[^0-9]/g, ''))
    if (!num) return
    onSave(num)
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.white,
          borderRadius: radius.lg,
          padding: spacing.lg,
          marginTop: spacing.lg,
          ...shadows.card,
        },
      ]}
    >
      <Text
        style={{
          fontFamily: typography.family,
          fontSize: typography.size.lg,
          fontWeight: '700',
          color: colors.text,
          marginBottom: spacing.sm,
        }}
      >
        هدف روزانه
      </Text>

      {/* Presets */}
      <View style={[styles.presets, { gap: spacing.xs, marginBottom: spacing.md }]}>
        {PRESETS.map(preset => {
          const active = Number(value) === preset
          return (
            <Pressable
              key={preset}
              onPress={() => setValue(String(preset))}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: radius.md,
                backgroundColor: active ? colors.orange : colors.background,
              }}
            >
              <Text
                style={{
                  fontFamily: typography.family,
                  fontSize: typography.size.sm,
                  fontWeight: '600',
                  color: active ? colors.white : colors.text,
                }}
              >
                {preset.toLocaleString('fa-IR')}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {/* ورودی دستی */}
      <View style={[styles.inputRow, { gap: spacing.sm }]}>
        <TextInput
          value={value}
          onChangeText={setValue}
          keyboardType="number-pad"
          placeholder="مثلاً ۱۰۰۰۰"
          placeholderTextColor={colors.muted}
          style={{
            flex: 1,
            fontFamily: typography.family,
            fontSize: typography.size.base,
            color: colors.text,
            backgroundColor: colors.background,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            textAlign: 'right',
          }}
        />
        <Pressable
          onPress={handleSave}
          style={{
            backgroundColor: colors.orange,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            borderRadius: radius.md,
          }}
        >
          <Text
            style={{
              fontFamily: typography.family,
              fontSize: typography.size.base,
              fontWeight: '700',
              color: colors.white,
            }}
          >
            ذخیره
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {},
  presets: { flexDirection: 'row', flexWrap: 'wrap' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
})