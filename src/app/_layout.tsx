/**
 * Root navigation layout for GrowUp Yourself
 * Uses Expo Router for tab-based navigation
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { theme } from '@/theme/tokens';
import { AppHeader } from '@/components/AppHeader';

/**
 * Root layout with tab navigation
 * Provides main navigation structure for all pillars + profile
 */
export default function RootLayout() {
  // Placeholder progress data - will be replaced with real data from ViewModel
  const progress = {
    'pilar-1': 0,
    'pilar-2': 0,
    'pilar-3': 0,
    'pilar-4': 0,
  };

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});
