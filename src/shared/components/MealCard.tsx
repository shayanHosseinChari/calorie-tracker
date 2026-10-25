import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useTheme } from '../hooks/useTheme';

export type MealFood = {
  id: number;
  food_id: number;
  food_name: string;
  calories: number;
  amount: number;
  unit: string;
};

export type Meal = {
  id: string;
  title: string;
  calories: number;
  icon: string;
  color: string;
  itemsCount?: number;
  subtitle?: string;
  foods?: MealFood[];
};

type Props = { meal: Meal; compact?: boolean; onPress?: () => void };

const faNum = (n: number) => Math.round(n).toLocaleString('fa-IR');

export function MealCard({ meal, compact, onPress }: Props) {
  const t = useTheme();
  const iconSize = compact ? 48 : 56;
  const foods = meal.foods ?? [];
  const isEmpty = foods.length === 0 && (meal.itemsCount ?? 0) === 0;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.colors.white,
          borderRadius: t.radius.lg,
          ...t.shadows.soft,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.icon,
            {
              backgroundColor: meal.color,
              width: iconSize,
              height: iconSize,
              borderRadius: t.radius.md,
            },
          ]}
        >
          <MaterialDesignIcons
            name={meal.icon as any}
            size={compact ? 24 : 28}
            color={t.colors.text}
          />
        </View>

        <View style={styles.info}>
          <Text
            style={[
              styles.title,
              { color: t.colors.text, fontFamily: t.typography.family },
            ]}
            numberOfLines={1}
          >
            {meal.title}
          </Text>
          <Text
            style={[
              styles.cal,
              { color: t.colors.muted, fontFamily: t.typography.family },
            ]}
            numberOfLines={1}
          >
            {isEmpty
              ? 'ثبت نشده'
              : `${faNum(meal.calories)} کالری`}
          </Text>
        </View>

        <Pressable
          onPress={onPress}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`افزودن غذا به ${meal.title}`}
          style={({ pressed }) => [
            styles.add,
            { backgroundColor: t.colors.peachDeep },
            pressed && { opacity: 0.7 },
          ]}
        >
          <MaterialDesignIcons name="plus" size={22} color={t.colors.addIcon} />
        </Pressable>
      </View>

      {foods.length > 0 ? (
        <View style={styles.foodsList}>
          {foods.map((f) => (
            <View key={f.id} style={styles.foodRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.foodName,
                    { color: t.colors.text, fontFamily: t.typography.family },
                  ]}
                  numberOfLines={1}
                >
                  {f.food_name}
                </Text>
                <Text
                  style={[
                    styles.foodAmount,
                    { color: t.colors.muted, fontFamily: t.typography.family },
                  ]}
                  numberOfLines={1}
                >
                  {faNum(f.amount)} {f.unit}
                </Text>
              </View>
              <Text
                style={[
                  styles.foodCal,
                  { color: t.colors.greenTextDark, fontFamily: t.typography.family },
                ]}
              >
                {faNum(f.calories * f.amount)} کالری
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  icon: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, alignItems: 'flex-end', minWidth: 0 },
  title: { fontSize: 16, textAlign: 'right', writingDirection: 'rtl' },
  cal: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  add: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodsList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 8,
    gap: 6,
  },
  foodRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  foodName: {
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  foodAmount: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  foodCal: {
    fontSize: 11,
    textAlign: 'left',
  },
});