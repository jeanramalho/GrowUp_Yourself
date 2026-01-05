/**
 * App entry point
 * Initializes Expo Router and applies theme
 */

import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { Slot } from 'expo-router';

import { theme } from '@/theme/tokens';
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
 * Root app component
 */
export default function RootApp() {
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

  return (
    <PaperProvider theme={theme.paperTheme}>
      <Slot />
    </PaperProvider>
  );
}
