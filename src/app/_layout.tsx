import React, { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '@/theme';
import { CustomTabBar } from '@/components/ui/CustomTabBar';
import { Header } from '@/components/ui/Header';
import { useUserStore } from '@/store/userStore';
import { ProfileRequiredOverlay } from '@/components/profile/ProfileRequiredOverlay';
import { database } from '@/repositories/Repository';
import { MigrationRunner } from '@/repositories/migrations';
import { notificationService } from '@/services/NotificationService';
import * as SQLite from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const router = useRouter();
  const { isProfileComplete, userName } = useUserStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const db = await SQLite.openDatabaseAsync('growup_yourself.db');
        await database.initialize(db);

        // Run migrations
        const migrationRunner = new MigrationRunner(db);
        await migrationRunner.runMigrations();

        // Initialize notifications
        await notificationService.initialize();
        await notificationService.requestPermissions();

        console.log('Database and services initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initApp();
  }, []);

  if (!isInitialized) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // If profile is not complete AND there's no name (legacy/reset), show overlay
  if (!isProfileComplete && !userName) {
    return <ProfileRequiredOverlay />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header onProfilePress={() => router.push('/profile')} />
        <Tabs
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{
            headerShown: false,
            // Background color for screens
            sceneStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Tabs.Screen name="home" />
          <Tabs.Screen name="spirituality" />
          <Tabs.Screen name="health" />
          <Tabs.Screen name="finance" />
          <Tabs.Screen name="relationships" />

          {/* Hidden Screens */}
          <Tabs.Screen
            name="profile"
            options={{
              href: null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Tabs.Screen name="index" options={{ href: null }} />
        </Tabs>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
