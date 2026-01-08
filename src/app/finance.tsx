import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';

const { width } = Dimensions.get('window');

export default function FinanceScreen() {
  const { colors, isDarkMode, shadows } = useAppTheme();

  const chartData = [
    { name: 'Seg', val: 120, height: 40 },
    { name: 'Ter', val: 45, height: 15 },
    { name: 'Qua', val: 200, height: 70 },
    { name: 'Qui', val: 80, height: 25 },
    { name: 'Sex', val: 150, height: 50 },
    { name: 'Sab', val: 300, height: 100 },
    { name: 'Dom', val: 100, height: 35 },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Finanças</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Gestão de Prosperidade</Text>
        </View>
        <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(30, 58, 138, 0.3)' : '#E0E7FF' }]}>
          <MaterialCommunityIcons name="currency-usd" size={28} color={isDarkMode ? '#60A5FA' : '#1E3A8A'} />
        </View>
      </View>

      {/* Alert Banner */}
      <View style={[styles.alertBanner, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }]}>
        <View style={styles.alertIconBox}>
          <MaterialCommunityIcons name="alert-circle-outline" size={24} color="white" />
        </View>
        <View style={styles.alertTextContainer}>
          <Text style={[styles.alertTitle, { color: isDarkMode ? '#F87171' : '#DC2626' }]}>Atenção ao Planejamento</Text>
          <Text style={styles.alertDesc}>Você utilizou 91% do orçamento de R$ 3.000 planejado para este mês.</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statHeader}>
            <MaterialCommunityIcons name="trending-up" size={16} color={colors.success} />
            <Text style={styles.statLabel}>ENTRADAS</Text>
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>R$ 5.400</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statHeader}>
            <MaterialCommunityIcons name="trending-down" size={16} color={colors.error} />
            <Text style={styles.statLabel}>GASTO REAL</Text>
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>R$ 2.750</Text>
        </View>
      </View>

      {/* Chart Section */}
      <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }, shadows.sm]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: isDarkMode ? colors.text : '#334155' }]}>Gastos Diários</Text>
          <Text style={styles.chartBadge}>OUTUBRO</Text>
        </View>

        <View style={styles.chartContainer}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={[
                styles.bar,
                {
                  height: `${item.height}%`,
                  backgroundColor: item.val > 200 ? '#0A6CF0' : '#2B8AF7',
                  borderRadius: 4
                }
              ]} />
              <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={[styles.actionButton, shadows.md]}>
        <Text style={styles.actionButtonText}>Lançar Nova Movimentação</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 32,
    borderWidth: 1,
    gap: 16,
    marginBottom: 16,
  },
  alertIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 14,
    color: '#EF4444',
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981', // we override color in render based on type
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartCard: {
    padding: 24,
    borderRadius: 40,
    borderWidth: 1,
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B82F6',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 12, // slightly thinner than web due to space
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
  },
  actionButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
