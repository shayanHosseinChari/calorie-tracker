import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@shared/hooks/useTheme';

import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { TabParamList } from './types';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { StepCounter } from '@/features/step-counter';
import ProfilePage from '@/features/profile/screen/ProfilePage';

const Tab = createBottomTabNavigator<any>();

type IconProps = { color: string; size: number };

const TABS = [
  {
    name: 'Home' as const,
    label: 'خانه',
    icon: ({ color, size }: IconProps) => (
      <MaterialDesignIcons name="home" color={color} size={size} />
    ),
    component: HomeScreen,
  },
    {
    name: 'StepCounter' as const,
    label: 'قدم شمار',
    icon: ({ color, size }: IconProps) => (
      <MaterialDesignIcons name="food-steak" color={color} size={size} />
    ),
    component: StepCounter,
  },
  {
    name: 'Profile' as const,
    label: 'پروفایل',
    icon: ({ color, size }: IconProps) => (
      <MaterialDesignIcons name="account" color={color} size={size} />
    ),
    component: () => <ProfilePage />,
  },

];

export function BottomTabNavigator() {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,

        // 👇 رنگ فعال و غیرفعال
        tabBarActiveTintColor: t.colors.addIcon,   // رنگ آیکون و لیبل در حالت فعال
        tabBarInactiveTintColor: t.colors.muted,   // رنگ آیکون و لیبل در حالت غیرفعال

        // 👇 پس‌زمینه فعال حذف شد
        // tabBarActiveBackgroundColor: t.colors.peachActive,

        animation: 'shift',
        tabBarStyle: {
          backgroundColor: t.colors.white,
          borderTopWidth: 0,
          height: 58 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 5,
          borderRadius: 0,
        },
        tabBarLabelStyle: {
          fontFamily: t.typography.family,
          fontSize: 10,
        },
        tabBarItemStyle: {
          borderRadius: 30,
          marginVertical: 3,
          marginHorizontal: 2,
        },
      }}
    >
      {TABS.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name as any}
          component={tab.component as any}
          options={{
            tabBarLabel: tab.label,
            tabBarAccessibilityLabel: tab.label,
            // 👇 color از پارامتر گرفته می‌شود (React Navigation خودش رنگ فعال/غیرفعال را اعمال می‌کند)
            tabBarIcon: ({ color, size }) => (
              <tab.icon color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
});