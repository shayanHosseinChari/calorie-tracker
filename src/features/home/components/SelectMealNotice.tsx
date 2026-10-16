import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  mealTitle: string;
  onDismiss: () => void;
  theme: any;
}

export function SelectedMealNotice({
  mealTitle,
  onDismiss,
  theme: t,
}: Props) {
  const fontFamily = t.typography.family;

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.notice,
        {
          backgroundColor: t.colors.greenSurface,
          borderRadius: t.radius.sm,
        },
      ]}
    >
      <Text
        style={[
          styles.noticeText,
          {
            color: t.colors.greenTextDark,
            fontFamily,
          },
        ]}
      >
        وعدهٔ انتخاب‌شده: {mealTitle}
      </Text>

      <TouchableOpacity
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="بستن پیام"
        style={styles.dismiss}
      >
        <Text
          style={[
            styles.dismissText,
            {
              color: t.colors.greenTextDark,
              fontFamily,
            },
          ]}
        >
          ×
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    direction: 'ltr',
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 5,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  dismiss: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    fontSize: 24,
  },
});