import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { getDB } from '../src/services/Database';

const SpiritualityScreen = () => {
  const [goals, setGoals] = useState([]);
  const db = getDB();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM goals WHERE pillar_id = 1'); // Assuming 1 is Spirituality
      setGoals(result);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const sections = [
    { id: 'reading', title: 'Leitura', icon: 'book-outline' },
    { id: 'prayer', title: 'Oração/Meditação', icon: 'sunny-outline' },
    { id: 'community', title: 'Vida em Comunidade', icon: 'people-outline' },
    { id: 'service', title: 'Serviço Voluntário', icon: 'heart-outline' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Espiritualidade</Text>

        <View style={styles.sectionsGrid}>
          {sections.map((section) => (
            <TouchableOpacity key={section.id} style={styles.sectionCard}>
              <Ionicons name={section.icon} size={32} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subHeader}>Minhas Metas</Text>
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhuma meta cadastrada.</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Criar Nova Meta</Text>
            </TouchableOpacity>
          </View>
        ) : (
          goals.map((goal: any) => (
            <View key={goal.id} style={styles.goalCard}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalDescription}>{goal.description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.m,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.h1,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.l,
  },
  sectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  sectionCard: {
    width: '47%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.spacing.s,
    alignItems: 'center',
    gap: theme.spacing.s,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.l,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.s,
  },
  emptyStateText: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.m,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.spacing.s,
  },
  addButtonText: {
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.bold,
  },
  goalCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  goalTitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  goalDescription: {
    color: theme.colors.textSecondary,
  },
});

export default SpiritualityScreen;
