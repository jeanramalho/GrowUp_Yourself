import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { financeService } from '@/services/FinanceService';
import { LancamentoFinanceiro, Investimento } from '@/models';
import { TransactionFormModal } from '@/components/finance/TransactionFormModal';
import { BudgetFormModal } from '@/components/finance/BudgetFormModal';
import { InvestmentFormModal } from '@/components/finance/InvestmentFormModal';
import { useFocusEffect } from 'expo-router';

const { width } = Dimensions.get('window');

type TabType = 'Resumo' | 'Lançamentos' | 'Planejamento' | 'Investimentos';

export default function FinanceScreen() {
  const { colors, isDarkMode, shadows } = useAppTheme();
  const [activeTab, setActiveTab] = useState<TabType>('Resumo');

  // State
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, plannedIncome: 0, plannedExpenses: 0, balance: 0, expenseUsagePercent: 0 });
  const [dailyChart, setDailyChart] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<LancamentoFinanceiro[]>([]);
  const [investments, setInvestments] = useState<Investimento[]>([]);
  const [plannedItems, setPlannedItems] = useState<LancamentoFinanceiro[]>([]);

  // Modals
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [isInvestmentModalVisible, setIsInvestmentModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<LancamentoFinanceiro | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date();
      const s = await financeService.getMonthSummary(today);
      const chart = await financeService.getDailySpending(today);
      const transactions = await financeService.getTransactionsByMonth(today);
      const invs = await financeService.getInvestments();
      const planned = await financeService.getPlannedByMonth(today);

      setSummary(s);
      setDailyChart(chart);
      setRecentTransactions(transactions);
      setInvestments(invs);
      setPlannedItems(planned);
    } catch (error) {
      console.error("Error fetching finance data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleDeleteTransaction = async (id: string) => {
    Alert.alert("Excluir", "Deseja excluir esta movimentação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir", style: "destructive", onPress: async () => {
          await financeService.deleteTransaction(id);
          fetchData();
        }
      }
    ]);
  };

  const handleDeleteInvestment = async (id: string) => {
    Alert.alert("Excluir", "Deseja excluir este investimento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir", style: "destructive", onPress: async () => {
          await financeService.deleteInvestment(id);
          fetchData();
        }
      }
    ]);
  };

  const renderTabs = () => (
    <View style={styles.tabsWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
        {(['Resumo', 'Lançamentos', 'Planejamento', 'Investimentos'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: isDarkMode ? colors.primary : colors.primary + '20', borderColor: colors.primary }
            ]}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? (isDarkMode ? 'white' : colors.primary) : colors.textSecondary }]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderSummary = () => (
    <View style={styles.section}>
      {/* Alert Banner */}
      {summary.expenseUsagePercent > 90 && (
        <View style={[styles.alertBanner, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }]}>
          <View style={styles.alertIconBox}>
            <MaterialCommunityIcons name="alert-circle-outline" size={24} color="white" />
          </View>
          <View style={styles.alertTextContainer}>
            <Text style={[styles.alertTitle, { color: isDarkMode ? '#F87171' : '#DC2626' }]}>
              {summary.expenseUsagePercent >= 100 ? 'Orçamento Estourado!' : 'Atenção ao Planejamento'}
            </Text>
            <Text style={styles.alertDesc}>
              Você utilizou {Math.round(summary.expenseUsagePercent)}% do orçamento planejado para este mês.
            </Text>
          </View>
        </View>
      )}

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statHeader}>
            <MaterialCommunityIcons name="trending-up" size={16} color={colors.success} />
            <Text style={[styles.statLabel, { color: colors.success }]}>ENTRADAS</Text>
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>R$ {summary.income.toFixed(2)}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statHeader}>
            <MaterialCommunityIcons name="trending-down" size={16} color={colors.error} />
            <Text style={[styles.statLabel, { color: colors.error }]}>GASTO REAL</Text>
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>R$ {summary.expenses.toFixed(2)}</Text>
        </View>
      </View>

      {/* Chart Section */}
      <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }, shadows.sm]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Gastos (Últimos 7 dias)</Text>
        </View>

        <View style={styles.chartContainer}>
          {dailyChart.map((item, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={[
                styles.bar,
                {
                  height: `${item.height}%`,
                  backgroundColor: item.val > 0 ? colors.primary : colors.border,
                  borderRadius: 4
                }
              ]} />
              <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.actionButton, shadows.md]}
        onPress={() => {
          setSelectedTransaction(null);
          setIsTransactionModalVisible(true);
        }}
      >
        <Text style={styles.actionButtonText}>Lançar Nova Movimentação</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTransactions = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Lançamentos do Mês</Text>
        <TouchableOpacity onPress={() => setIsTransactionModalVisible(true)} style={styles.addButtonCircle}>
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {recentTransactions.length > 0 ? (
        recentTransactions.map(t => (
          <View key={t.id} style={[styles.listItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.listItemIcon}>
              <MaterialCommunityIcons
                name={t.tipo === 'receita' ? 'arrow-up-circle' : 'arrow-down-circle'}
                size={32}
                color={t.tipo === 'receita' ? colors.success : colors.error}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>{t.categoria}</Text>
              <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{t.data} • {t.nota || 'Sem nota'}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Text style={[styles.itemValue, { color: t.tipo === 'receita' ? colors.success : colors.error }]}>
                {t.tipo === 'receita' ? '+' : '-'} R$ {t.valor.toFixed(2)}
              </Text>
              <TouchableOpacity onPress={() => handleDeleteTransaction(t.id)}>
                <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhuma movimentação lançada.</Text>
      )}
    </View>
  );

  const renderPlanning = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Objetivos Mensais</Text>
        <TouchableOpacity onPress={() => setIsBudgetModalVisible(true)} style={styles.addButtonCircle}>
          <MaterialCommunityIcons name="pencil" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {plannedItems.length > 0 ? (
        plannedItems.map(p => {
          const realExp = recentTransactions.filter(t => t.tipo === 'despesa' && t.categoria === p.categoria).reduce((sum, t) => sum + t.valor, 0);
          const percent = p.valor > 0 ? (realExp / p.valor) * 100 : 0;
          return (
            <View key={p.id} style={[styles.listItem, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: 'column', gap: 12 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Text style={[styles.itemTitle, { color: colors.text }]}>{p.categoria}</Text>
                <Text style={[styles.itemValue, { color: colors.text }]}>R$ {realExp.toFixed(0)} / R$ {p.valor.toFixed(0)}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(percent, 100)}%`, backgroundColor: percent > 100 ? colors.error : colors.primary }]} />
              </View>
            </View>
          );
        })
      ) : (
        <TouchableOpacity onPress={() => setIsBudgetModalVisible(true)} style={styles.emptyStateContainer}>
          <MaterialCommunityIcons name="finance" size={48} color={colors.primary + '40'} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Defina seu planejamento clicando no lápis.</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderInvestments = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Meus Investimentos</Text>
        <TouchableOpacity onPress={() => setIsInvestmentModalVisible(true)} style={styles.addButtonCircle}>
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {investments.length > 0 ? (
        investments.map(inv => {
          const returns = financeService.calculateReturns(inv);
          return (
            <View key={inv.id} style={[styles.listItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.listItemIcon, { backgroundColor: colors.primary + '10', borderRadius: 12, padding: 8 }]}>
                <MaterialCommunityIcons name="chart-line" size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemTitle, { color: colors.text }]}>{inv.nome}</Text>
                <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>Início: {inv.data_inicio}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={[styles.itemValue, { color: colors.text }]}>R$ {inv.principal.toFixed(2)}</Text>
                <Text style={[styles.itemSubtitle, { color: colors.success, fontWeight: 'bold' }]}>+ R$ {returns.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => handleDeleteInvestment(inv.id)}>
                  <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      ) : (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum investimento cadastrado.</Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
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

        {renderTabs()}

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 48 }} />
        ) : (
          <>
            {activeTab === 'Resumo' && renderSummary()}
            {activeTab === 'Lançamentos' && renderTransactions()}
            {activeTab === 'Planejamento' && renderPlanning()}
            {activeTab === 'Investimentos' && renderInvestments()}
          </>
        )}
      </ScrollView>

      <TransactionFormModal
        visible={isTransactionModalVisible}
        onClose={() => {
          setIsTransactionModalVisible(false);
          setSelectedTransaction(null);
        }}
        transactionToEdit={selectedTransaction}
        onSaveSuccess={fetchData}
      />

      <BudgetFormModal
        visible={isBudgetModalVisible}
        onClose={() => setIsBudgetModalVisible(false)}
        onSaveSuccess={fetchData}
      />

      <InvestmentFormModal
        visible={isInvestmentModalVisible}
        onClose={() => setIsInvestmentModalVisible(false)}
        onSaveSuccess={fetchData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 24, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14 },
  iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },

  tabsWrapper: { marginBottom: 24, marginHorizontal: -24 },
  tabsContainer: { paddingHorizontal: 24, gap: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'transparent', backgroundColor: 'transparent' },
  tabText: { fontSize: 14, fontWeight: 'bold' },

  section: { gap: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  addButtonCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center' },

  alertBanner: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 32, borderWidth: 1, gap: 16, marginBottom: 8 },
  alertIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
  alertTextContainer: { flex: 1 },
  alertTitle: { fontWeight: 'bold', marginBottom: 4 },
  alertDesc: { fontSize: 14, opacity: 0.8 },

  statsGrid: { flexDirection: 'row', gap: 16 },
  statCard: { flex: 1, padding: 20, borderRadius: 24, borderWidth: 1 },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  statLabel: { fontSize: 10, fontWeight: 'bold' },
  statValue: { fontSize: 18, fontWeight: 'bold' },

  chartCard: { padding: 24, borderRadius: 40, borderWidth: 1 },
  chartHeader: { marginBottom: 24 },
  chartTitle: { fontSize: 16, fontWeight: 'bold' },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  barContainer: { alignItems: 'center', gap: 8, flex: 1, height: '100%', justifyContent: 'flex-end' },
  bar: { width: 12, minHeight: 4 },
  barLabel: { fontSize: 10 },

  actionButton: { backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 16, alignItems: 'center', width: '100%', marginTop: 8 },
  actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

  listItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 1, gap: 12 },
  listItemIcon: { justifyContent: 'center', alignItems: 'center' },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
  itemSubtitle: { fontSize: 12 },
  itemValue: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 24, fontStyle: 'italic' },
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },

  progressBarBg: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, width: '100%', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
});

