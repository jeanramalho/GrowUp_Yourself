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


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

});
