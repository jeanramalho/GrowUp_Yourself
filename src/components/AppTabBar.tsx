/**
 * AppTabBar component
 * Custom tab bar for navigation between pillars and profile
 * Note: This is a reference implementation. Expo Router's built-in TabBar is used by default.
 * This component can be used if custom styling is needed.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { theme } from '@/theme/tokens';

/**
 * Tab definition
 */
export interface TabDefinition {
  id: string;
  label: string;
  icon: string;
  color?: string;
}

/**
 * Props for AppTabBar
 */
interface AppTabBarProps {
  /**
   * Currently active tab ID
   */
  activeTab: string;
  /**
   * Callback when a tab is pressed
   */
  onTabPress: (tabId: string) => void;
  /**
   * Array of tab definitions
   */
  tabs: TabDefinition[];
}

/**
 * AppTabBar component
 * Provides custom navigation between pillars and profile
 */
export const AppTabBar: React.FC<AppTabBarProps> = ({
  activeTab,
  onTabPress,
  tabs,
}) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab,
          ]}
          onPress={() => onTabPress(tab.id)}
          activeOpacity={0.7}
        >
          <View style={styles.tabContent}>
            <MaterialCommunityIcons
              name={tab.icon}
              size={24}
              color={
                activeTab === tab.id
                  ? tab.color || theme.colors.primary
                  : theme.colors.gray500
              }
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color:
                    activeTab === tab.id
                      ? tab.color || theme.colors.primary
                      : theme.colors.gray500,
                },
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </View>
          {activeTab === tab.id && (
            <View
              style={[
                styles.activeIndicator,
                {
                  backgroundColor: tab.color || theme.colors.primary,
                },
              ]}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

/**
 * Preset tabs for GrowUp Yourself
 */
export const DEFAULT_TABS: TabDefinition[] = [
  {
    id: 'spirituality',
    label: 'Espiritualidade',
    icon: 'meditation',
    color: theme.colors.pillar.spirituality,
  },
  {
    id: 'health',
    label: 'Saúde',
    icon: 'heart',
    color: theme.colors.pillar.health,
  },
  {
    id: 'finance',
    label: 'Finanças',
    icon: 'trending-up',
    color: theme.colors.pillar.finance,
  },
  {
    id: 'relationships',
    label: 'Relacionamentos',
    icon: 'people',
    color: theme.colors.pillar.relationships,
  },
  {
    id: 'profile',
    label: 'Perfil',
    icon: 'account',
    color: theme.colors.primary,
  },
];

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 80 : 60,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray300,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    paddingHorizontal: theme.spacing.xs,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  activeTab: {
    // Active tab styling is applied via tabContent and activeIndicator
  },
  tabContent: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  tabLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '500',
    marginTop: 2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '80%',
    height: 3,
    borderRadius: theme.borderRadius.sm,
  },
});
