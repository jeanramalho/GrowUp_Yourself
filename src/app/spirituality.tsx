import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { getDB } from '../services/Database';

const SpiritualityScreen = () => {
  const [goals, setGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const db = getDB();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM goals WHERE pillar_id = 1 ORDER BY id DESC');
      setGoals(result);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) {
      Alert.alert('Erro', 'Por favor, insira um título para a meta.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Erro', 'Por favor, selecione uma categoria.');
      return;
    }

    try {
      await db.runAsync(
        'INSERT INTO goals (pillar_id, title, description, category, created_at) VALUES (?, ?, ?, ?, ?)',
        [1, newGoalTitle, newGoalDescription, selectedCategory, new Date().toISOString()]
      );
      setModalVisible(false);
      setNewGoalTitle('');
      setNewGoalDescription('');
      setSelectedCategory('');
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
      Alert.alert('Erro', 'Não foi possível salvar a meta.');
    }
  };

  const handleDeleteGoal = async (id: number) => {
    Alert.alert(
      'Excluir Meta',
      'Tem certeza que deseja excluir esta meta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.runAsync('DELETE FROM goals WHERE id = ?', [id]);
              fetchGoals();
            } catch (error) {
              console.error('Error deleting goal:', error);
            }
          },
        },
      ]
    );
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
            <TouchableOpacity
              key={section.id}
              style={[
                styles.sectionCard,
                selectedCategory === section.title && styles.selectedSectionCard
              ]}
              onPress={() => {
                setSelectedCategory(section.title);
                setModalVisible(true);
              }}
            >
              <Ionicons
                name={section.icon as any}
                size={32}
                color={selectedCategory === section.title ? theme.colors.white : theme.colors.primary}
              />
              <Text style={[
                styles.sectionTitle,
                selectedCategory === section.title && styles.selectedSectionTitle
              ]}>{section.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.subHeader}>Minhas Metas</Text>
          <TouchableOpacity
            style={styles.addButtonSmall}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhuma meta cadastrada.</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Criar Nova Meta</Text>
            </TouchableOpacity>
          </View>
        ) : (
          goals.map((goal: any) => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalCategoryBadge}>
                  <Text style={styles.goalCategoryText}>{goal.category || 'Geral'}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteGoal(goal.id)}>
                  <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              {goal.description ? <Text style={styles.goalDescription}>{goal.description}</Text> : null}
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Meta</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {sections.map((section) => (
                <TouchableOpacity
                  key={section.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === section.title && styles.selectedCategoryChip
                  ]}
                  onPress={() => setSelectedCategory(section.title)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategory === section.title && styles.selectedCategoryChipText
                  ]}>{section.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Ler 1 capítulo da Bíblia"
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
            />

            <Text style={styles.label}>Descrição (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detalhes adicionais..."
              value={newGoalDescription}
              onChangeText={setNewGoalDescription}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleAddGoal}>
              <Text style={styles.saveButtonText}>Salvar Meta</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    paddingBottom: 100,
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
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedSectionCard: {
    backgroundColor: theme.colors.primary,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  selectedSectionTitle: {
    color: theme.colors.white,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  subHeader: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  addButtonSmall: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  goalCategoryBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  goalCategoryText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  goalTitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  goalDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.spacing.l,
    borderTopRightRadius: theme.spacing.l,
    padding: theme.spacing.l,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  label: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.s,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    fontSize: theme.typography.sizes.body,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    marginBottom: theme.spacing.m,
    maxHeight: 50,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    marginRight: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
  },
  selectedCategoryChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.small,
  },
  selectedCategoryChipText: {
    color: theme.colors.white,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.spacing.s,
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.body,
  },
});

export default SpiritualityScreen;
