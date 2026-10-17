import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@shared/hooks/useTheme';

import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { TabParamList } from './types';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { StepCounter } from '@/features/step-counter';

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
    name: 'Diary' as const,
    label: 'دفترچه',
    icon: ({ color, size }: IconProps) => (
      <MaterialDesignIcons name="notebook" color={color} size={size} />
    ),
    component: () => null,
  },
 
  {
    name: 'Profile' as const,
    label: 'پروفایل',
    icon: ({ color, size }: IconProps) => (
      <MaterialDesignIcons name="account" color={color} size={size} />
    ),
    component: () => null,
  },
  {
    name: 'StepCounter' as const,
    label: 'قدم شمار',
    icon: ({ color, size }: IconProps) => (
      <MaterialDesignIcons name="food-steak" color={color} size={size} />
    ),
    component: StepCounter,
  },
];

export function BottomTabNavigator() {
  const t = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.neutralIconActive,
        tabBarInactiveTintColor: t.colors.neutralIcon,
        tabBarActiveBackgroundColor: t.colors.peachActive,

        animation: 'shift',
        tabBarStyle: {
          backgroundColor: t.colors.white,
          borderTopWidth: 0,
          marginHorizontal: 16,
          height: 58,
          marginBottom: 6,
          paddingVertical: 5,
          borderRadius: t.radius.xl,
          position: 'absolute',
          ...t.shadows.nav,
        },
        tabBarLabelStyle: {
          fontFamily: t.typography.family,
          fontSize: 10,
        },
        tabBarItemStyle:{
          overflow:"hidden",
          borderRadius:t.radius.xl,marginVertical: 3,marginHorizontal: 2
        }
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
            tabBarIcon: ({ color, focused, size }) => (
              <tab.icon
                color={focused ? t.colors.addIcon : t.colors.muted}
                size={size}
              />
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