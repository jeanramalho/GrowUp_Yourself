/**
 * Health pillar main screen
 * Shows health-related metas and info
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { theme } from '@/theme/tokens';

export default function HealthScreen() {
  return (
    <View style={styles.container}>
      <Text variant="displaySmall" style={styles.title}>
        Saúde
      </Text>
      <Text variant="bodyMedium" style={styles.placeholder}>
        Metas de saúde em breve...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary,
  },
  placeholder: {
    color: theme.colors.gray600,
  },
});
