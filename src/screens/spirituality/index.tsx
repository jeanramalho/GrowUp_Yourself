/**
 * Spirituality pillar main screen
 * Shows list of spiritual metas
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { theme } from '@/theme/tokens';

export default function SpiritualityScreen() {
  return (
    <View style={styles.container}>
      <Text variant="displaySmall" style={styles.title}>
        Espiritualidade
      </Text>
      <Text variant="bodyMedium" style={styles.placeholder}>
        Metas de espiritualidade em breve...
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
