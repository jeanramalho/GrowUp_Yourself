import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';

const RelationshipsScreen = () => {
  const [commitments, setCommitments] = useState([
    {
      id: '1',
      title: 'Jantar com a Família',
      withWho: 'Esposa e Filhos',
      date: 'Hoje, 19:00',
      recurrence: 'Semanal (Quinta)',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Ligação para os Pais',
      withWho: 'Pai e Mãe',
      date: 'Amanhã, 10:00',
      recurrence: 'Semanal (Sexta)',
      status: 'pending',
    },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Relacionamentos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos Compromissos</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
        </View>

        {commitments.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.recurrenceTag}>
                <Ionicons name="repeat" size={12} color={theme.colors.primary} />
                <Text style={styles.recurrenceText}>{item.recurrence}</Text>
              </View>
            </View>

            <View style={styles.cardRow}>
              <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.cardText}>{item.withWho}</Text>
            </View>

            <View style={styles.cardRow}>
              <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.cardText}>{item.date}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Concluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.m,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.h1,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  scrollContent: {
    padding: theme.spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  recurrenceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
    borderRadius: theme.spacing.s,
    gap: 4,
  },
  recurrenceText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.primary,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
    marginBottom: 4,
  },
  cardText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
  },
  actions: {
    marginTop: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.spacing.s,
  },
  actionButtonText: {
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.sizes.small,
  },
});

export default RelationshipsScreen;
