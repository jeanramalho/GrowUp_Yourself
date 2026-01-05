/**
 * Finance pillar main screen
 * Shows financial planning and tracking
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';

import { theme } from '@/theme/tokens';

export default function FinanceScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.card}>
        <Text variant="headlineSmall" style={styles.title}>
          Finanças
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Controle seus gastos, planejamento e investimentos
        </Text>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Áreas de Gestão
          </Text>
          <Text variant="bodyMedium" style={styles.item}>• Planilha de Gastos Reais</Text>
          <Text variant="bodyMedium" style={styles.item}>• Planilha de Orçamento/Planejamento</Text>
          <Text variant="bodyMedium" style={styles.item}>• Planilha de Investimentos</Text>
          <Text variant="bodyMedium" style={styles.item}>• Planilha de Doação</Text>
        </View>

        <Button
          mode="contained"
          onPress={() => {
            // TODO: Implementar dashboard financeiro
            console.log('Abrir dashboard');
          }}
          style={styles.button}
          buttonColor={theme.colors.pillar.finance}
        >
          Ver Dashboard
        </Button>

        <Text variant="bodySmall" style={styles.placeholder}>
          Dashboard financeiro em breve...
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
    color: theme.colors.pillar.finance,
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
