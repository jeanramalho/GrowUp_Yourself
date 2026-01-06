import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import Header from '../src/components/Header';
import { initDatabase } from '../src/services/Database';

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    initDatabase();
  }, []);

  // Mock progress data - replace with real data later
  const progress = {
    spirituality: 0.7,
    health: 0.5,
    finance: 0.3,
    relationships: 0.8,
  };

  return (
    <Tabs
      screenOptions={{
        header: () => (
          <Header
            progress={progress}
            onProfilePress={() => router.push('/profile')}
          />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.surface,
        },
      }}
    >
      <Tabs.Screen
        name="spirituality"
        options={{
          title: 'Espiritualidade',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Saúde',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fitness-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: 'Finanças',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="relationships"
        options={{
          title: 'Relacionamentos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="_layout"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
