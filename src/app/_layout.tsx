import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { theme } from '@/theme';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.gray400,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            height: 80,
          },
          tabBarBackground: () => (
            <View style={styles.tabBarBackground}>
              <View style={styles.floatingTabBar} />
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="view-dashboard" color={color} size={28} />
            ),
          }}
        />
        <Tabs.Screen
          name="spirituality"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="meditation" color={color} size={28} />
            ),
          }}
        />
        <Tabs.Screen
          name="health"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="heart" color={color} size={28} />
            ),
          }}
        />
        <Tabs.Screen
          name="finance"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="wallet" color={color} size={28} />
            ),
          }}
        />
        <Tabs.Screen
          name="relationships"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-group" color={color} size={28} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabBarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  floatingTabBar: {
    width: '100%',
    height: 64,
    backgroundColor: theme.colors.surface,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    ...theme.shadows.lg,
  },
});
