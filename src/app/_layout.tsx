import React, { useEffect, useState, useCallback } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { theme, useAppTheme } from '@/theme';
import { CustomTabBar } from '@/components/ui/CustomTabBar';
import { Header } from '@/components/ui/Header';
import { useUserStore } from '@/store/userStore';
import { ProfileRequiredOverlay } from '@/components/profile/ProfileRequiredOverlay';
import { database } from '@/repositories/Repository';
import { MigrationRunner } from '@/repositories/migrations';
import { notificationService } from '@/services/NotificationService';
import * as SQLite from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { SplashScreen } from '@/components/ui/SplashScreen';

// Keep the native splash screen visible while JS loads
ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { isProfileComplete, userName } = useUserStore();
  
  // App initialization states
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSplashAnimationComplete, setIsSplashAnimationComplete] = useState(false);

  // Hide native splash screen once the JS Splash component is ready
  const onSplashLayout = useCallback(async () => {
    try {
      await ExpoSplashScreen.hideAsync();
    } catch (e) {
      console.warn('Error hiding native splash:', e);
    }
  }, []);

  useEffect(() => {
    const initApp = async () => {
      try {
        const db = await SQLite.openDatabaseAsync('growup_yourself.db');
        await database.initialize(db);

        // Run migrations
        const migrationRunner = new MigrationRunner(db);
        await migrationRunner.runMigrations();

        // Load user profile from DB
        await useUserStore.getState().loadFromDb();

        // Initialize notifications
        await notificationService.initialize();
        await notificationService.requestPermissions();

        console.log('Database and services initialized successfully');
        
        // Wait at least a bit more to show the beautiful splash logo if init was too fast
        setTimeout(() => setIsInitialized(true), 500);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsInitialized(true); // Still proceed, or show an error screen
      }
    };

    initApp();
  }, []);

  // Show splash overlay while not initialized or while animation is running
  const showSplash = !isInitialized || !isSplashAnimationComplete;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {showSplash && (
        <View style={StyleSheet.absoluteFill} onLayout={onSplashLayout}>
          <SplashScreen 
            isVisible={!isInitialized} 
            onAnimationComplete={() => setIsSplashAnimationComplete(true)} 
          />
        </View>
      )}

      {isInitialized && (
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
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

