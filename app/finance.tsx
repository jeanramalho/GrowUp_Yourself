import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { VictoryPie, VictoryChart, VictoryTheme, VictoryLine } from 'victory-native';
import { theme } from '../src/theme';

const FinanceScreen = () => {
  const [activeTab, setActiveTab] = useState<'planning' | 'transactions' | 'investments'>('planning');

  const renderContent = () => {
    switch (activeTab) {
      case 'planning':
        return <PlanningView />;
      case 'transactions':
        return <TransactionsView />;
      case 'investments':
        return <InvestmentsView />;
      default:
        return <PlanningView />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestão Financeira</Text>
      </View>

      <View style={styles.tabContainer}>
        <TabButton title="Planejamento" isActive={activeTab === 'planning'} onPress={() => setActiveTab('planning')} />
        <TabButton title="Lançamentos" isActive={activeTab === 'transactions'} onPress={() => setActiveTab('transactions')} />
        <TabButton title="Investimentos" isActive={activeTab === 'investments'} onPress={() => setActiveTab('investments')} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const TabButton = ({ title, isActive, onPress }: { title: string; isActive: boolean; onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.tabButton, isActive && styles.activeTabButton]}
    onPress={onPress}
  >
    <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>{title}</Text>
  </TouchableOpacity>
);

const PlanningView = () => {
  const data = [
    { x: 'Moradia', y: 35 },
    { x: 'Alimentação', y: 25 },
    { x: 'Transporte', y: 15 },
    { x: 'Lazer', y: 10 },
    { x: 'Outros', y: 15 },
  ];

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumo do Mês</Text>
        <View style={styles.chartContainer}>
          <VictoryPie
            data={data}
            width={300}
            height={300}
            colorScale={[theme.colors.primary, theme.colors.primaryLight, theme.colors.primaryDark, theme.colors.textSecondary, theme.colors.surfaceDark]}
            innerRadius={50}
            style={{
              labels: { fill: theme.colors.text, fontSize: 12, padding: 10 },
            }}
          />
        </View>
        <View style={styles.summaryRow}>
          <SummaryItem label="Planejado" value="R$ 5.000,00" color={theme.colors.primary} />
          <SummaryItem label="Gasto" value="R$ 3.250,00" color={theme.colors.error} />
          <SummaryItem label="Restante" value="R$ 1.750,00" color={theme.colors.success} />
        </View>
      </View>
    </View>
  );
};

const TransactionsView = () => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Últimos Lançamentos</Text>
    <TransactionItem category="Supermercado" date="Hoje" amount="- R$ 450,00" type="expense" />
    <TransactionItem category="Salário" date="Ontem" amount="+ R$ 5.000,00" type="income" />
    <TransactionItem category="Uber" date="Ontem" amount="- R$ 25,90" type="expense" />
  </View>
);

const InvestmentsView = () => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Carteira de Investimentos</Text>
    <View style={styles.chartContainer}>
      <VictoryChart width={300} height={200} theme={VictoryTheme.material}>
        <VictoryLine
          style={{
            data: { stroke: theme.colors.primary },
            parent: { border: "1px solid #ccc" }
          }}
          data={[
            { x: 1, y: 1000 },
            { x: 2, y: 1050 },
            { x: 3, y: 1120 },
            { x: 4, y: 1200 },
          ]}
        />
      </VictoryChart>
    </View>
    <TransactionItem category="Tesouro Direto" date="Rendimento +1.2%" amount="R$ 12.450,00" type="neutral" />
  </View>
);

const SummaryItem = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <View style={styles.summaryItem}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={[styles.summaryValue, { color }]}>{value}</Text>
  </View>
);

const TransactionItem = ({ category, date, amount, type }: { category: string; date: string; amount: string; type: 'income' | 'expense' | 'neutral' }) => (
  <View style={styles.transactionItem}>
    <View>
      <Text style={styles.transactionCategory}>{category}</Text>
      <Text style={styles.transactionDate}>{date}</Text>
    </View>
    <Text style={[
      styles.transactionAmount,
      type === 'income' ? { color: theme.colors.success } : type === 'expense' ? { color: theme.colors.error } : { color: theme.colors.text }
    ]}>{amount}</Text>
  </View>
);

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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  tabButton: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.spacing.l,
    marginRight: theme.spacing.s,
    backgroundColor: theme.colors.surface,
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary,
  },
  tabButtonText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  activeTabButtonText: {
    color: theme.colors.textLight,
  },
  scrollContent: {
    padding: theme.spacing.m,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily.bold,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  transactionCategory: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
  },
  transactionDate: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary,
  },
  transactionAmount: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily.bold,
  },
});

export default FinanceScreen;
