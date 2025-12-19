/**
 * HeaderProgress Component
 * Fixed header displaying 4 pillar icons with monthly progress bars
 *
 * SPEC-001: Header fixo com 4 ícones e barras de progresso mensais
 * 
 * Requirements:
 * - Display 4 main pillars: Espiritualidade, Saúde, Finanças, Relacionamentos
 * - Show monthly progress (0-100%) as bars for each pillar
 * - Use pillar-specific colors from design tokens
 * - Accessible labels and text scaling
 * - Responsive to different screen sizes
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  AccessibilityInfo,
  useWindowDimensions,
} from 'react-native';
import designTokens from '@styles/design-tokens.json';

type PilarType = 'espiritualidade' | 'saude' | 'financas' | 'relacionamentos';

interface HeaderProgressProps {
  progress: {
    espiritualidade: number;
    saude: number;
    financas: number;
    relacionamentos: number;
  };
  paddingHorizontal?: number;
  allowFontScaling?: boolean;
}

interface PilarConfig {
  id: PilarType;
  label: string;
  color: string;
  lightColor: string;
}

const pillarConfigs: PilarConfig[] = [
  {
    id: 'espiritualidade',
    label: 'Espiritualidade',
    color: designTokens.colors.pillars.espiritualidade,
    lightColor: designTokens.colors.pillars.espiritualidade_light,
  },
  {
    id: 'saude',
    label: 'Saúde',
    color: designTokens.colors.pillars.saude,
    lightColor: designTokens.colors.pillars.saude_light,
  },
  {
    id: 'financas',
    label: 'Finanças',
    color: designTokens.colors.pillars.financas,
    lightColor: designTokens.colors.pillars.financas_light,
  },
  {
    id: 'relacionamentos',
    label: 'Relacionamentos',
    color: designTokens.colors.pillars.relacionamentos,
    lightColor: designTokens.colors.pillars.relacionamentos_light,
  },
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: designTokens.colors.grayscale.white,
    paddingVertical: designTokens.spacing[4],
    paddingHorizontal: designTokens.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.grayscale.gray_200,
    elevation: 2,
    shadowColor: designTokens.colors.grayscale.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  header: {
    marginBottom: designTokens.spacing[3],
  },

  title: {
    fontSize: designTokens.typography.fontSize.lg,
    fontWeight: '700',
    color: designTokens.colors.grayscale.gray_900,
    marginBottom: designTokens.spacing[1],
  },

  subtitle: {
    fontSize: designTokens.typography.fontSize.sm,
    color: designTokens.colors.grayscale.gray_500,
  },

  pillarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: designTokens.spacing[3],
  },

  pillarCard: {
    flex: 1,
    alignItems: 'center',
  },

  pillarLabel: {
    fontSize: designTokens.typography.fontSize.xs,
    fontWeight: '600',
    marginBottom: designTokens.spacing[2],
    textAlign: 'center',
    color: designTokens.colors.grayscale.gray_700,
  },

  progressBarContainer: {
    width: '100%',
    height: designTokens.spacing[3],
    backgroundColor: designTokens.colors.grayscale.gray_200,
    borderRadius: designTokens.borderRadius.full,
    overflow: 'hidden',
    marginBottom: designTokens.spacing[2],
  },

  progressBarFill: {
    height: '100%',
    borderRadius: designTokens.borderRadius.full,
  },

  percentageText: {
    fontSize: designTokens.typography.fontSize.sm,
    fontWeight: '700',
    textAlign: 'center',
    color: designTokens.colors.grayscale.gray_800,
  },
});

const HeaderProgress: React.FC<HeaderProgressProps> = ({
  progress,
  paddingHorizontal = designTokens.spacing[4],
  allowFontScaling = true,
}) => {
  const { width } = useWindowDimensions();

  // Determine if we should use compact layout on small screens
  const isCompactLayout = width < 360;

  const getProgressPercentage = (value: number): number => {
    return Math.min(Math.max(Math.round(value), 0), 100);
  };

  const containerStyle = [
    styles.container,
    {
      paddingHorizontal,
    },
  ];

  return (
    <View style={containerStyle} testID="header-progress">
      {/* Header Info */}
      <View style={styles.header} accessible={true} accessibilityRole="header">
        <Text
          style={styles.title}
          allowFontScaling={allowFontScaling}
          accessibilityRole="header"
        >
          Seu Progresso
        </Text>
        <Text
          style={styles.subtitle}
          allowFontScaling={allowFontScaling}
          accessibilityRole="text"
        >
          Mês atual
        </Text>
      </View>

      {/* Pillar Progress Cards */}
      <View style={styles.pillarGrid} accessible={true} accessibilityRole="list">
        {pillarConfigs.map((pillar) => {
          const progressValue = progress[pillar.id];
          const percentage = getProgressPercentage(progressValue);
          const fillWidth = `${percentage}%`;

          const accessibilityLabel = `${pillar.label}, ${percentage}% de progresso no mês`;

          return (
            <View
              key={pillar.id}
              style={styles.pillarCard}
              testID={`pilar-${pillar.id}`}
              accessible={true}
              accessibilityLabel={accessibilityLabel}
              accessibilityRole="progressbar"
              accessibilityLiveRegion="polite"
            >
              {/* Pillar Label */}
              <Text
                style={styles.pillarLabel}
                allowFontScaling={allowFontScaling}
                numberOfLines={isCompactLayout ? 1 : 2}
              >
                {pillar.label}
              </Text>

              {/* Progress Bar */}
              <View
                style={styles.progressBarContainer}
                testID={`progress-bar-container-${pillar.id}`}
              >
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: fillWidth,
                      backgroundColor: pillar.color,
                    },
                  ]}
                  testID={`progress-bar-fill-${pillar.id}`}
                  accessible={false}
                />
              </View>

              {/* Percentage Text */}
              <Text
                style={styles.percentageText}
                allowFontScaling={allowFontScaling}
                testID={`progress-percentage-${pillar.id}`}
              >
                {percentage}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default HeaderProgress;
