/**
 * App entry point
 * Initializes Expo Router and applies theme
 */

import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { Stack } from 'expo-router';

import { theme } from '@/theme/tokens';

/**
 * Root app component
 */
export default function RootApp() {
  useEffect(() => {
    // Initialize app here
    console.log('GrowUp Yourself app started');
  }, []);

  return (
    <PaperProvider theme={theme.paperTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </PaperProvider>
  );
}
