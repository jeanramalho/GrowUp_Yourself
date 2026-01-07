import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { CustomTabBar } from '@/components/ui/CustomTabBar';
import { Header } from '@/components/ui/Header';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RootLayout() {
  const router = useRouter();

  return (
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
            tabBarStyle: { display: 'none' }, // Hide tab bar on profile if wanted, or keep it. Design shows it might be hidden or modal.
          }}
        />
        <Tabs.Screen name="index" options={{ href: null }} />
      </Tabs>

      {/* FAB - Nova Meta (Fixed absolute position akin to the React App) */}
      <View style={styles.fabContainer}>
        {/* Implement FAB later if needed or add here. Detailed in App.tsx line 120. */}
        <View style={styles.fab}>
          <MaterialCommunityIcons name="plus" size={28} color="white" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 96, // 24px (bottom) + 80px (tab bar height approx) - adjustments
    right: 24,
    zIndex: 90,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
