/**
 * Spirituality pillar main screen
 * Shows list of spiritual metas
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';

import { theme } from '@/theme/tokens';

export default function SpiritualityScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.card}>
        <Text variant="headlineSmall" style={styles.title}>
          Espiritualidade
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Gerencie suas metas semanais de desenvolvimento espiritual
        </Text>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Subtópicos
          </Text>
          <Text variant="bodyMedium" style={styles.item}>• Leitura</Text>
          <Text variant="bodyMedium" style={styles.item}>• Oração/Meditação</Text>
          <Text variant="bodyMedium" style={styles.item}>• Vida em Comunidade/Igreja</Text>
          <Text variant="bodyMedium" style={styles.item}>• Serviço Voluntário</Text>
        </View>

        <Button
          mode="contained"
          onPress={() => {
            // TODO: Implementar navegação para criar meta
            console.log('Criar nova meta');
          }}
          style={styles.button}
        >
          Nova Meta
        </Button>

        <Text variant="bodySmall" style={styles.placeholder}>
          Metas de espiritualidade em breve...
        </Text>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray100,
  },
  content: {
    padding: theme.spacing.lg,
  },
  card: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.white,
    ...theme.shadows.md,
  },
  title: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.pillar.spirituality,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.gray600,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.gray900,
    fontWeight: '600',
  },
  item: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.gray700,
    paddingLeft: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  placeholder: {
    color: theme.colors.gray500,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
