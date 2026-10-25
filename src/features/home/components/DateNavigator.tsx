// features/home/components/DateNavigator.tsx
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
  date: Date;
  onChange: (next: Date) => void;
  theme: any;
  fontFamily: string;
};

export function DateNavigator({ date, onChange, theme, fontFamily }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const current = new Date(date);
  current.setHours(0, 0, 0, 0);

  const isToday = current.getTime() === today.getTime();

  const goPrev = () => {
    const d = new Date(current);
    d.setDate(d.getDate() - 1);
    onChange(d);
  };

  const goNext = () => {
    if (isToday) return;
    const d = new Date(current);
    d.setDate(d.getDate() + 1);
    if (d.getTime() > today.getTime()) return;
    onChange(d);
  };

  const label = current.toLocaleDateString('fa-IR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.colors.greenTrack,
        backgroundColor: theme.colors.white,
        marginBottom: 12,
      }}
    >
      {/* در RTL: chevron-forward = رفتن به قبل */}
      <Pressable onPress={goPrev} hitSlop={10}>
        <MaterialDesignIcons name="chevron-right" size={20} color={theme.colors.orange} />
      </Pressable>

      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontFamily, fontSize: 13, color: theme.colors.text }}>
          {label}
        </Text>
        {isToday && (
          <Text style={{ fontFamily, fontSize: 10, color: theme.colors.muted, marginTop: 2 }}>
            امروز
          </Text>
        )}
      </View>

      <Pressable onPress={goNext} hitSlop={10} disabled={isToday}>
        <MaterialDesignIcons
          name="chevron-left"
          size={20}
          color={isToday ? theme.colors.greenTrack : theme.colors.orange}
        />
      </Pressable>
    </View>
  );
}