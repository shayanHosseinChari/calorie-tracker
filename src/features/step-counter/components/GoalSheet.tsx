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
  onClose: () => void
}

const PRESETS = [5000, 8000, 10000, 12000, 15000]

export const GoalSheet: React.FC<Props> = ({ goal, onSave, onClose }) => {
  const t = useTheme()
  const { colors, radius, spacing, typography } = t
  const [value, setValue] = useState(String(goal))

  const handleSave = () => {
    const num = Number(value.replace(/[^0-9]/g, ''))
    if (!num) return
    onSave(num)
    onClose()
  }

  return (
    <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
      <Text
        style={{
          fontFamily: typography.family,
          fontSize: typography.size.h2,
          color: colors.text,
          marginBottom: spacing.lg,
          textAlign: 'right',
        }}
      >
        هدف روزانه
      </Text>

      {/* Presets */}
      <View style={[styles.presets, { gap: spacing.sm }]}>
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
      <View style={[styles.inputRow, { gap: spacing.sm, marginTop: spacing.lg }]}>
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
      </View>

      {/* دکمه ذخیره */}
      <Pressable
        onPress={handleSave}
        style={{
          backgroundColor: colors.orange,
          paddingVertical: spacing.md,
          borderRadius: radius.lg,
          marginTop: spacing.lg,
        }}
      >
        <Text
          style={{
            fontFamily: typography.family,
            fontSize: typography.size.base,
            color: colors.white,
            textAlign: 'center',
          }}
        >
          ذخیره
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  presets: { flexDirection: 'row', flexWrap: 'wrap' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
})