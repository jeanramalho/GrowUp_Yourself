/**
 * GrowUp Yourself - Main Application Entry Point
 * Follows constitution principles: offline-first, privacy-preserving, clean architecture
 */

import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';

import { initializeNotifications } from '@services/notifications';
import { initializeDatabase } from '@data/sqliteRepository';
import { globalStyles } from '@styles/global';
import designTokens from '@styles/design-tokens.json';

// Navigation stacks (will be implemented in next phase)
// import RootNavigator from '@navigation/RootNavigator';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App(): React.ReactElement {
  useEffect(() => {
    async function bootstrapAsync() {
      try {
        // Initialize database
        await initializeDatabase();

        // Initialize notifications system
        await initializeNotifications();

        // TODO: Load any other required app state
        // await loadAppConfig();
      } catch (error) {
        console.error('Bootstrap error:', error);
      } finally {
        // Hide splash screen after initialization
        await SplashScreen.hideAsync();
      }
    }

    bootstrapAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={globalStyles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={designTokens.colors.grayscale.white}
        />

        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyle: {
                backgroundColor: designTokens.colors.grayscale.white,
              },
            }}
          >
            {/* TODO: Add screens here */}
            {/* Navigation structure:
              - Stack.Navigator
                - Tab.Navigator (Main content)
                  - Espiritualidade Stack
                  - Saúde Stack
                  - Finanças Stack
                  - Relacionamentos Stack
                  - Perfil Stack
                - Modal Stack (for creating/editing content)
            */}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
