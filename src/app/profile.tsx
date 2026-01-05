/**
 * User profile screen
 * Shows and manages user profile information
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, TextInput, Button } from 'react-native-paper';

import { theme } from '@/theme/tokens';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.card}>
        <Text variant="headlineSmall" style={styles.title}>
          Meu Perfil
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Gerencie suas informações pessoais
        </Text>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Informações Pessoais
          </Text>
          <TextInput
            label="Nome"
            mode="outlined"
            style={styles.input}
            placeholder="Seu nome"
          />
          <TextInput
            label="Peso (kg)"
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="Ex: 75"
          />
          <TextInput
            label="Altura (m)"
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="Ex: 1.78"
          />
          <TextInput
            label="Meta de Peso (kg)"
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="Ex: 70"
          />
        </View>

        <Button
          mode="contained"
          onPress={() => {
            // TODO: Implementar salvamento de perfil
            console.log('Salvar perfil');
          }}
          style={styles.button}
        >
          Salvar Perfil
        </Button>

        <Text variant="bodySmall" style={styles.placeholder}>
          Funcionalidade completa em breve...
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
    color: theme.colors.primary,
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
  input: {
    marginBottom: theme.spacing.md,
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
