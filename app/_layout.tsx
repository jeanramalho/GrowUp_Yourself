/**
 * Root navigation layout for GrowUp Yourself
 * Uses Expo Router for tab-based navigation
 */

import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';

import { theme } from '@/theme/tokens';
import { AppHeader } from '@/components/AppHeader';
import { notificationService } from '@/services/NotificationService';
import { Database } from '@/repositories/Repository';
import { MigrationRunner } from '@/repositories/migrations';
import * as SQLite from 'expo-sqlite';

/**
 * Initialize database
 */
async function initializeDatabase(): Promise<Database> {
  try {
    const db = await SQLite.openDatabaseAsync('growup_yourself.db');
    const database = new Database();
    await database.initialize(db);

    // Run migrations
    const migrationRunner = new MigrationRunner(db);
    await migrationRunner.runMigrations();

    console.log('Database initialized successfully');
    return database;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Root layout with tab navigation
 * Provides main navigation structure for all pillars + profile
 */
export default function RootLayout() {
  useEffect(() => {
    // Initialize services
    const initApp = async () => {
      try {
        // Initialize database
        await initializeDatabase();

        // Initialize notifications
        await notificationService.initialize();
        await notificationService.requestPermissions();

        console.log('GrowUp Yourself app started successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initApp();
  }, []);

  // Placeholder progress data - will be replaced with real data from ViewModel
  const progress = {
    'pilar-1': 0,
    'pilar-2': 0,
    'pilar-3': 0,
    'pilar-4': 0,
  };

  return (
    <PaperProvider theme={theme.paperTheme}>
      <View style={styles.container}>
        {/* Fixed Header with Progress */}
        <AppHeader progress={progress} />

      {/* Tab Navigation */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.gray500,
          tabBarStyle: {
            backgroundColor: theme.colors.white,
            borderTopColor: theme.colors.gray300,
            borderTopWidth: 1,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 80 : 56,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: -4,
          },
        }}
      >
        {/* Spirituality Tab */}
        <Tabs.Screen
          name="spirituality"
          options={{
            title: 'Espiritualidade',
            tabBarLabel: 'Espiritualidade',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="meditation" color={color} size={size} />
            ),
          }}
        />

        {/* Health Tab */}
        <Tabs.Screen
          name="health"
          options={{
            title: 'Saúde',
            tabBarLabel: 'Saúde',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="heart" color={color} size={size} />
            ),
          }}
        />

        {/* Finance Tab */}
        <Tabs.Screen
          name="finance"
          options={{
            title: 'Finanças',
            tabBarLabel: 'Finanças',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="trending-up" color={color} size={size} />
            ),
          }}
        />

        {/* Relationships Tab */}
        <Tabs.Screen
          name="relationships"
          options={{
            title: 'Relacionamentos',
            tabBarLabel: 'Relacionamentos',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-group" color={color} size={size} />
            ),
          }}
        />

        {/* Profile Tab */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});
