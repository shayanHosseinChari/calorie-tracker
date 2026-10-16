import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './providers/ThemeProvider';
import { RootNavigator } from './navigation/RootNavigator';
import { AuthProvider } from '@/features/auth/context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
       <AuthProvider>
         <RootNavigator />
       </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}