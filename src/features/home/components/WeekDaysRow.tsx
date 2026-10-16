import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { getCurrentWeek } from '../utils';
import { Theme } from '@react-navigation/native';

type WeekDay = ReturnType<typeof getCurrentWeek>[number];

interface Props {
  weekDays: WeekDay[];
  theme:any;
}

export function WeekDaysRow({ weekDays, theme :t}: Props) {
  const fontFamily = t.typography.family;

  return (
    <View style={styles.weekRow} accessibilityLabel="روزهای هفته">
      {weekDays.map(day => {
        const dayColor = day.isToday
          ? t.colors.white
          : t.colors.greenTextDark;

        return (
          <View
            key={day.date.toDateString()}
            accessible
            accessibilityLabel={`${day.date.toLocaleDateString('fa-IR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}${day.isToday ? '، امروز' : ''}`}
            style={[
              styles.dayItem,
              {
                backgroundColor: day.isToday
                  ? t.colors.orange
                  : 'transparent',
              },
            ]}
          >
            <Text
              style={[styles.dayLabel, { fontFamily, color: dayColor }]}
            >
              {day.label}
            </Text>

            <Text
              style={[
                styles.dayNumber,
                {
                  fontFamily,
                  color: dayColor,
                  opacity: day.isToday ? 1 : 0.65,
                },
              ]}
            >
              {day.date.toLocaleDateString('fa-IR', { day: 'numeric' })}
            </Text>

            <View
              style={[
                styles.dayDot,
                {
                  backgroundColor: day.isToday
                    ? t.colors.white
                    : 'transparent',
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  weekRow: {
    direction: 'ltr',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  dayItem: {
    flex: 1,
    maxWidth: 46,
    minHeight: 66,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 3,
  },
  dayLabel: { fontSize: 12, lineHeight: 18 },
  dayNumber: { fontSize: 12, lineHeight: 18 },
  dayDot: { width: 4, height: 4, borderRadius: 2 },
});