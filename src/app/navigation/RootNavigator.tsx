import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { navigationTheme } from '@shared/theme/navigationTheme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { BottomTabNavigator } from './BottomTabNavigator';
import { AuthNavigator } from './AuthNavigator';
import { ProfileProvider } from '@/features/profile/context/ProfileContext';
import EditProfile from '@/features/profile/screen/EditProfilePage';
import UpdateMealsScreen from '@/features/meals/screens/UpdateMealsScreen';

const Stack = createNativeStackNavigator<any>();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? (
        <ProfileProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={BottomTabNavigator} />
            <Stack.Screen name="EditProfilePage" component={EditProfile} />
            <Stack.Screen name="UpdateMeals" component={UpdateMealsScreen} />

          </Stack.Navigator>
        </ProfileProvider>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});