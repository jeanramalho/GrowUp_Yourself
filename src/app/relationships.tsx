/**
 * Relationships pillar main screen
 * Shows relationship-related metas and agenda
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';

import { theme } from '@/theme/tokens';

export default function RelationshipsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.card}>
        <Text variant="headlineSmall" style={styles.title}>
          Relacionamentos
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Gerencie seus compromissos e atividades com pessoas importantes
        </Text>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Áreas de Relacionamento
          </Text>
          <Text variant="bodyMedium" style={styles.item}>• Família</Text>
          <Text variant="bodyMedium" style={styles.item}>• Amigos</Text>
          <Text variant="bodyMedium" style={styles.item}>• Trabalho</Text>
        </View>

        <Button
          mode="contained"
          onPress={() => {
            // TODO: Implementar agenda
            console.log('Abrir agenda');
          }}
          style={styles.button}
          buttonColor={theme.colors.pillar.relationships}
        >
          Ver Agenda
        </Button>

        <Text variant="bodySmall" style={styles.placeholder}>
          Agenda de relacionamentos em breve...
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
    color: theme.colors.pillar.relationships,
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
