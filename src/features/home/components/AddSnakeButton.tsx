import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onPress: () => void;
  theme: any;
}

export function AddSnackButton({ onPress, theme: t }: Props) {
  const fontFamily = t.typography.family;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="افزودن میان‌وعده"
      style={[
        styles.addSnackButton,
        { backgroundColor: t.colors.greenSurface },
      ]}
    >
      <View style={[styles.addIcon, { backgroundColor: t.colors.orange }]}>
        <Text style={[styles.addIconText, { color: t.colors.white, fontFamily }]}>
          +
        </Text>
      </View>

      <Text
        style={[styles.addSnackText, { color: t.colors.greenTextDark, fontFamily }]}
      >
        افزودن میان‌وعده
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addSnackButton: {
    direction: 'ltr',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 56,
    borderRadius: 18,
    marginTop: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconText: { fontSize: 23, lineHeight: 28 },
  addSnackText: { fontSize: 12, lineHeight: 22, writingDirection: 'rtl' },
});