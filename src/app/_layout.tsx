import React, { useCallback, useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
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
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

// Keep the native splash screen visible while app initializes
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const { isProfileComplete, userName } = useUserStore();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const db = await SQLite.openDatabaseAsync('growup_yourself.db');
        await database.initialize(db);

        const migrationRunner = new MigrationRunner(db);
        await migrationRunner.runMigrations();

        await useUserStore.getState().loadFromDb();

        await notificationService.initialize();

        console.log('Database and services initialized successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isInitialized) {
      await SplashScreen.hideAsync();
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="light" backgroundColor="#0F172A" translucent />
      <View style={styles.container}>
        {(!isProfileComplete && !userName) ? (
          <ProfileRequiredOverlay />
        ) : (
          <>
            <Header onProfilePress={() => router.push('/profile')} />
            <Tabs
              tabBar={(props) => <CustomTabBar {...props} />}
              screenOptions={{
                headerShown: false,
                sceneStyle: { backgroundColor: theme.colors.background },
              }}
            >
              <Tabs.Screen name="home" />
              <Tabs.Screen name="spirituality" />
              <Tabs.Screen name="health" />
              <Tabs.Screen name="finance" />
              <Tabs.Screen name="relationships" />

              <Tabs.Screen
                name="profile"
                options={{
                  href: null,
                  tabBarStyle: { display: 'none' },
                }}
              />
              <Tabs.Screen name="index" options={{ href: null }} />
            </Tabs>
          </>
        )}
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
