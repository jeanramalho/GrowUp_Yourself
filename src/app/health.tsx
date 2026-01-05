/**
 * Health pillar main screen
 * Shows health-related metas and chat with AI
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';

import { theme } from '@/theme/tokens';

export default function HealthScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.card}>
        <Text variant="headlineSmall" style={styles.title}>
          Saúde
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Acompanhe sua saúde com IA e gestão de hábitos saudáveis
        </Text>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Áreas de Acompanhamento
          </Text>
          <Text variant="bodyMedium" style={styles.item}>• 8 Remédios Naturais</Text>
          <Text variant="bodyMedium" style={styles.item}>• Exames e Avaliação Física</Text>
          <Text variant="bodyMedium" style={styles.item}>• Acompanhamento de Peso</Text>
          <Text variant="bodyMedium" style={styles.item}>• Exercícios Físicos</Text>
        </View>

        <Button
          mode="contained"
          onPress={() => {
            // TODO: Implementar chat com IA
            console.log('Abrir chat com IA');
          }}
          style={styles.button}
          buttonColor={theme.colors.pillar.health}
        >
          Chat com IA
        </Button>

        <Text variant="bodySmall" style={styles.placeholder}>
          Chat de saúde em breve...
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
    color: theme.colors.pillar.health,
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
