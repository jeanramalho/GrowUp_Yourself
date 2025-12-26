/**
 * AppHeader component
 * Fixed header showing monthly progress for all 4 pillars
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { theme } from '@/theme/tokens';

/**
 * Progress data for a single pillar
 */
interface PillarProgress {
  id: string;
  name: string;
  icon: string;
  color: string;
  progress: number; // 0-100
}

/**
 * Props for AppHeader
 */
interface AppHeaderProps {
  /**
   * Progress data for each pillar
   * If not provided, will show placeholder data
   */
  progress?: Record<string, number>;
  /**
   * Optional callback when header is tapped
   */
  onPress?: () => void;
}

/**
 * AppHeader component showing progress bars for all pillars
 */
export const AppHeader: React.FC<AppHeaderProps> = ({ progress, onPress }) => {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  /**
   * Get pillar-specific color
   */
  const getPillarColor = (pillarId: string): string => {
    const colorMap: Record<string, string> = {
      'pilar-1': theme.colors.pillar.spirituality,
      'pilar-2': theme.colors.pillar.health,
      'pilar-3': theme.colors.pillar.finance,
      'pilar-4': theme.colors.pillar.relationships,
    };
    return colorMap[pillarId] || theme.colors.primary;
  };

  /**
   * Get pillar icon
   */
  const getPillarIcon = (pillarId: string): string => {
    const iconMap: Record<string, string> = {
      'pilar-1': 'meditation',
      'pilar-2': 'heart',
      'pilar-3': 'trending-up',
      'pilar-4': 'people',
    };
    return iconMap[pillarId] || 'star';
  };

  /**
   * Get pillar name
   */
  const getPillarName = (pillarId: string): string => {
    const nameMap: Record<string, string> = {
      'pilar-1': 'Espiritualidade',
      'pilar-2': 'Saúde',
      'pilar-3': 'Finanças',
      'pilar-4': 'Relacionamentos',
    };
    return nameMap[pillarId] || 'Desconhecido';
  };

  const pillarIds = ['pilar-1', 'pilar-2', 'pilar-3', 'pilar-4'];

  const pillarProgress: PillarProgress[] = pillarIds.map((id) => ({
    id,
    name: getPillarName(id),
    icon: getPillarIcon(id),
    color: getPillarColor(id),
    progress: progress?.[id] ?? 0, // Placeholder: 0% if not provided
  }));

  return (
    <>
      <Surface style={styles.container}>
        <View style={styles.headerContent}>
          <Text variant="headlineSmall" style={styles.title}>
            Progresso Mensal
          </Text>
        </View>

        {/* Progress Bars */}
        <View style={styles.progressGrid}>
          {pillarProgress.map((pillar) => (
            <TouchableOpacity
              key={pillar.id}
              style={styles.pillarCard}
              onPress={() => {
                setSelectedPillar(pillar.id);
              }}
            >
              {/* Pillar Icon */}
              <View
                style={[styles.iconContainer, { backgroundColor: pillar.color }]}
              >
                <MaterialCommunityIcons
                  name={pillar.icon}
                  size={24}
                  color={theme.colors.white}
                />
              </View>

              {/* Progress Bar */}
              <View style={styles.barContainer}>
                <Text style={styles.barLabel}>{pillar.progress}%</Text>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${pillar.progress}%`,
                        backgroundColor: pillar.color,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Pillar Name */}
              <Text style={styles.pillarName} numberOfLines={2}>
                {pillar.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Surface>

      {/* Detail Modal */}
      {selectedPillar && (
        <PillarDetailModal
          pillarId={selectedPillar}
          pillarName={getPillarName(selectedPillar)}
          pillarColor={getPillarColor(selectedPillar)}
          progress={progress?.[selectedPillar] ?? 0}
          onClose={() => setSelectedPillar(null)}
        />
      )}
    </>
  );
};

/**
 * Pillar detail modal
 */
interface PillarDetailModalProps {
  pillarId: string;
  pillarName: string;
  pillarColor: string;
  progress: number;
  onClose: () => void;
}

const PillarDetailModal: React.FC<PillarDetailModalProps> = ({
  pillarId,
  pillarName,
  pillarColor,
  progress,
  onClose,
}) => {
  // Placeholder data for weekly breakdown
  const weeklyScores = [100, 75, 50, 100]; // Example: 4 weeks

  const average = Math.round(
    weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length
  );

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Surface style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text variant="headlineSmall" style={styles.modalTitle}>
                {pillarName}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={theme.colors.gray700}
                />
              </TouchableOpacity>
            </View>

            {/* Progress Overview */}
            <View style={styles.modalProgressSection}>
              <Text variant="bodyLarge" style={styles.modalLabel}>
                Progresso Mensal
              </Text>
              <View style={styles.modalProgressBar}>
                <View
                  style={[
                    styles.modalProgressFill,
                    {
                      width: `${progress}%`,
                      backgroundColor: pillarColor,
                    },
                  ]}
                />
              </View>
              <Text
                variant="displaySmall"
                style={[styles.modalProgressText, { color: pillarColor }]}
              >
                {progress}%
              </Text>
            </View>

            {/* Weekly Breakdown */}
            <View style={styles.modalBreakdownSection}>
              <Text variant="bodyLarge" style={styles.modalLabel}>
                Semanas
              </Text>
              <View style={styles.weekContainer}>
                {weeklyScores.map((score, index) => (
                  <View key={index} style={styles.weekItem}>
                    <View
                      style={[
                        styles.weekBar,
                        { backgroundColor: pillarColor, opacity: score / 100 },
                      ]}
                    />
                    <Text style={styles.weekLabel}>{score}%</Text>
                  </View>
                ))}
              </View>
              <Text variant="bodySmall" style={styles.averageText}>
                Média: {average}%
              </Text>
            </View>
          </ScrollView>
        </Surface>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // AppHeader styles
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  headerContent: {
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  pillarCard: {
    width: '48%',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  barContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  barLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.gray900,
    marginBottom: 4,
  },
  barBackground: {
    width: '90%',
    height: 8,
    backgroundColor: theme.colors.gray300,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  pillarName: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray700,
    textAlign: 'center',
    marginTop: 4,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  modalProgressSection: {
    marginBottom: theme.spacing.lg,
  },
  modalLabel: {
    color: theme.colors.gray700,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  modalProgressBar: {
    width: '100%',
    height: 16,
    backgroundColor: theme.colors.gray300,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  modalProgressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.md,
  },
  modalProgressText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  modalBreakdownSection: {
    marginBottom: theme.spacing.lg,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  weekItem: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  weekBar: {
    width: 32,
    height: 80,
    borderRadius: theme.borderRadius.sm,
  },
  weekLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray600,
  },
  averageText: {
    textAlign: 'center',
    color: theme.colors.gray600,
    fontWeight: '500',
  },
});
