/**
 * User profile screen
 * Shows and manages user profile information
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { theme } from '@/theme/tokens';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text variant="displaySmall" style={styles.title}>
        Meu Perfil
      </Text>
      <Text variant="bodyMedium" style={styles.placeholder}>
        Perfil em breve...
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
