import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { financeService } from '@/services/FinanceService';
import { LancamentoFinanceiro, Investimento, Conta, CartaoCredito } from '@/models';
import { TransactionFormModal } from '@/components/finance/TransactionFormModal';
import { BudgetFormModal } from '@/components/finance/BudgetFormModal';
import { InvestmentFormModal } from '@/components/finance/InvestmentFormModal';
import { AccountFormModal } from '@/components/finance/AccountFormModal';
import { CardFormModal } from '@/components/finance/CardFormModal';
import { CreditCardInvoiceModal } from '@/components/finance/CreditCardInvoiceModal';

// ... inside component ...
const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
const [selectedCard, setSelectedCard] = useState<CartaoCredito | null>(null);

// ... inside renderGestao ...
// Update card onPress
const renderGestao = () => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Contas e Vales</Text>
      <TouchableOpacity onPress={() => setIsAccountModalVisible(true)} style={styles.addButtonCircle}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>

    {accounts.map(acc => (
      <View key={acc.id} style={[styles.listItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <MaterialCommunityIcons
          name={acc.tipo === 'carteira' ? 'wallet' : 'food'}
          size={24}
          color={colors.primary}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.itemTitle, { color: colors.text }]}>{acc.nome}</Text>
          <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{acc.tipo.replace('_', ' ')}</Text>
        </View>
        <Text style={[styles.itemValue, { color: colors.text }]}>R$ {acc.saldo_inicial.toFixed(2)}</Text>
      </View>
    ))}

    <View style={[styles.sectionHeader, { marginTop: 16 }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Cartões de Crédito</Text>
      <TouchableOpacity onPress={() => setIsCardModalVisible(true)} style={styles.addButtonCircle}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>

    {cards.map(card => (
      <TouchableOpacity
        key={card.id}
        style={[styles.cardItem, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderColor: colors.border }]}
        onPress={() => {
          setSelectedCard(card);
          setIsInvoiceModalVisible(true);
        }}
      >
        <View style={styles.cardInfo}>
          <MaterialCommunityIcons name="credit-card-chip" size={32} color={colors.primary} />
          <View>
            <Text style={[styles.itemTitle, { color: colors.text }]}>{card.nome}</Text>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>Vence dia {card.dia_vencimento}</Text>
          </View>
        </View>

        <View style={styles.cardFaturaBox}>
          <Text style={[styles.faturaLabel, { color: colors.textSecondary }]}>Fatura Atual</Text>
          <Text style={[styles.faturaValue, { color: colors.error }]}>R$ {card.fatura.toFixed(2)}</Text>
          <TouchableOpacity
            style={[styles.payBtn, { backgroundColor: colors.primary }]}
            onPress={() => {
              Alert.alert("Pagar Fatura", "Escolha a conta para o pagamento", [
                { text: "Cancelar", style: "cancel" },
                ...accounts.map(acc => ({
                  text: acc.nome,
                  onPress: async () => {
                    await financeService.payInvoice(card.id, acc.id, card.fatura);
                    fetchData();
                  }
                }))
              ]);
            }}
          >
            <Text style={styles.payBtnText}>Pagar Agora</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

// ... at the end of return ...
      <TransactionDetailsModal
        visible={isDetailsModalVisible}
        onClose={() => setIsDetailsModalVisible(false)}
        transaction={selectedTransaction}
      />

      <CreditCardInvoiceModal
        visible={isInvoiceModalVisible}
        onClose={() => setIsInvoiceModalVisible(false)}
        card={selectedCard}
      />
    </View >

  const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    const today = new Date();
    const s = await financeService.getMonthSummary(today);
    const chart = await financeService.getDailySpending(today);
    const transactions = await financeService.getTransactionsByMonth(today);
    const invs = await financeService.getInvestments();
    const planned = await financeService.getPlannedByMonth(today);
    const accs = await financeService.getAccounts();
    const crds = await financeService.getCards();

    const cardsWithFatura = await Promise.all(crds.map(async c => ({
      ...c,
      fatura: await financeService.getCardInvoice(c.id, today)
    })));

    setSummary(s);
    setDailyChart(chart);
    setRecentTransactions(transactions);
    setInvestments(invs);
    setPlannedItems(planned);
    setAccounts(accs);
    setCards(cardsWithFatura);
  } catch (error) {
    console.error("Error fetching finance data:", error);
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  applyFilters();
}, [recentTransactions, filterType, filterAccount]);

const applyFilters = () => {
  let filtered = [...recentTransactions];

  if (filterType !== 'all') {
    filtered = filtered.filter(t => t.tipo === filterType);
  }

  if (filterAccount !== 'all') {
    // Check if it's an account ID or Card ID
    // Transaction has conta_id OR cartao_id
    filtered = filtered.filter(t => t.conta_id === filterAccount || t.cartao_id === filterAccount);
  }

  setFilteredTransactions(filtered);
};

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
      {(['Resumo', 'Lançamentos', 'Planejamento', 'Investimentos', 'Gestão'] as TabType[]).map((tab) => (
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
    {/* Wallet Balance Card */}
    <View style={[styles.mainBalanceCard, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
      <Text style={styles.mainBalanceLabel}>SALDO EM CARTEIRA</Text>
      <Text style={styles.mainBalanceValue}>R$ {summary.balance.toFixed(2)}</Text>
      <View style={styles.mainBalanceRow}>
        <View>
          <Text style={styles.mainBalanceSubLabel}>ORÇAMENTO TOTAL</Text>
          <Text style={styles.mainBalanceSubValue}>R$ {summary.plannedExpenses.toFixed(2)}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <MaterialCommunityIcons name="wallet-outline" size={32} color="rgba(255,255,255,0.4)" />
        </View>
      </View>
    </View>

    {/* Vouchers and Cards Summaries */}
    <View style={{ gap: 12 }}>
      {summary.hasVouchers && (
        <View style={[styles.miniCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialCommunityIcons name="ticket-percent-outline" size={24} color={colors.secondary} />
            <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Vales (A/R)</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>R$ {summary.vouchersBalance.toFixed(2)}</Text>
        </View>
      )}

      {cards.length > 0 && (
        <View style={[styles.miniCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialCommunityIcons name="credit-card-outline" size={24} color={colors.error} />
            <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Faturas Abertas</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.error }}>
            R$ {cards.reduce((sum, c) => sum + c.fatura, 0).toFixed(2)}
          </Text>
        </View>
      )}
    </View>

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

const renderTransactions = () => {
  // Filter options

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Lançamentos</Text>
        <TouchableOpacity onPress={() => setIsTransactionModalVisible(true)} style={styles.addButtonCircle}>
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filters UI */}
      <View style={{ marginBottom: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => setFilterType('all')}
            style={[styles.filterChip, filterType === 'all' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
          >
            <Text style={{ color: filterType === 'all' ? 'white' : colors.text, fontSize: 12 }}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilterType('receita')}
            style={[styles.filterChip, filterType === 'receita' && { backgroundColor: colors.success, borderColor: colors.success }]}
          >
            <Text style={{ color: filterType === 'receita' ? 'white' : colors.text, fontSize: 12 }}>Entradas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilterType('despesa')}
            style={[styles.filterChip, filterType === 'despesa' && { backgroundColor: colors.error, borderColor: colors.error }]}
          >
            <Text style={{ color: filterType === 'despesa' ? 'white' : colors.text, fontSize: 12 }}>Saídas</Text>
          </TouchableOpacity>

          <View style={{ width: 1, height: 20, backgroundColor: colors.border, marginHorizontal: 8, alignSelf: 'center' }} />

          <TouchableOpacity
            onPress={() => setFilterAccount('all')}
            style={[styles.filterChip, filterAccount === 'all' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
          >
            <Text style={{ color: filterAccount === 'all' ? 'white' : colors.text, fontSize: 12 }}>Geral</Text>
          </TouchableOpacity>

          {accounts.map(acc => (
            <TouchableOpacity
              key={acc.id}
              onPress={() => setFilterAccount(acc.id)}
              style={[styles.filterChip, filterAccount === acc.id && { backgroundColor: colors.primary, borderColor: colors.primary }]}
            >
              <Text style={{ color: filterAccount === acc.id ? 'white' : colors.text, fontSize: 12 }}>{acc.nome}</Text>
            </TouchableOpacity>
          ))}

          {cards.map(c => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setFilterAccount(c.id)}
              style={[styles.filterChip, filterAccount === c.id && { backgroundColor: colors.primary, borderColor: colors.primary }]}
            >
              <Text style={{ color: filterAccount === c.id ? 'white' : colors.text, fontSize: 12 }}>Cartão: {c.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredTransactions.length > 0 ? (
        filteredTransactions.map(t => {
          const isCard = !!t.cartao_id;
          const isVoucher = accounts.find(a => a.id === t.conta_id && ['vale_alimentacao', 'vale_refeicao'].includes(a.tipo));

          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.listItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => {
                setSelectedTransaction(t);
                setIsDetailsModalVisible(true);
              }}
              onLongPress={() => {
                Alert.alert("Opções", "O que deseja fazer?", [
                  { text: "Editar", onPress: () => { setSelectedTransaction(t); setIsTransactionModalVisible(true); } },
                  { text: "Excluir", style: "destructive", onPress: () => handleDeleteTransaction(t.id) },
                  { text: "Cancelar", style: "cancel" }
                ]);
              }}
            >
              <View style={styles.listItemIcon}>
                <MaterialCommunityIcons
                  name={t.tipo === 'receita' ? 'arrow-up-circle' : 'arrow-down-circle'}
                  size={32}
                  color={t.tipo === 'receita' ? colors.success : colors.error}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemTitle, { color: colors.text }]}>{t.categoria}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
                    {t.data.split('-').reverse().join('/')}
                  </Text>
                  {isCard && <MaterialCommunityIcons name="credit-card" size={12} color={colors.textSecondary} />}
                  {isVoucher && <MaterialCommunityIcons name="ticket-percent" size={12} color={colors.textSecondary} />}
                  {t.parcelas_total && t.parcelas_total > 1 && (
                    <Text style={{ fontSize: 10, color: colors.textSecondary, fontWeight: 'bold' }}>
                      ({t.parcela_atual}/{t.parcelas_total})
                    </Text>
                  )}
                </View>
                {t.nota && (
                  <Text numberOfLines={1} style={[styles.itemSubtitle, { color: colors.textSecondary, fontStyle: 'italic', marginTop: 2 }]}>
                    {t.nota}
                  </Text>
                )}
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={[styles.itemValue, { color: t.tipo === 'receita' ? colors.success : colors.error }]}>
                  {t.tipo === 'receita' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhuma movimentação encontrada.</Text>
      )}
    </View>
  );
};

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

const renderGestao = () => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Contas e Vales</Text>
      <TouchableOpacity onPress={() => setIsAccountModalVisible(true)} style={styles.addButtonCircle}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>

    {accounts.map(acc => (
      <View key={acc.id} style={[styles.listItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <MaterialCommunityIcons
          name={acc.tipo === 'carteira' ? 'wallet' : 'food'}
          size={24}
          color={colors.primary}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.itemTitle, { color: colors.text }]}>{acc.nome}</Text>
          <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{acc.tipo.replace('_', ' ')}</Text>
        </View>
        <Text style={[styles.itemValue, { color: colors.text }]}>R$ {acc.saldo_inicial.toFixed(2)}</Text>
      </View>
    ))}

    <View style={[styles.sectionHeader, { marginTop: 16 }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Cartões de Crédito</Text>
      <TouchableOpacity onPress={() => setIsCardModalVisible(true)} style={styles.addButtonCircle}>
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>

    {cards.map(card => (
      <View key={card.id} style={[styles.cardItem, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderColor: colors.border }]}>
        <View style={styles.cardInfo}>
          <MaterialCommunityIcons name="credit-card-chip" size={32} color={colors.primary} />
          <View>
            <Text style={[styles.itemTitle, { color: colors.text }]}>{card.nome}</Text>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>Vence dia {card.dia_vencimento}</Text>
          </View>
        </View>

        <View style={styles.cardFaturaBox}>
          <Text style={[styles.faturaLabel, { color: colors.textSecondary }]}>Fatura Atual</Text>
          <Text style={[styles.faturaValue, { color: colors.error }]}>R$ {card.fatura.toFixed(2)}</Text>
          <TouchableOpacity
            style={[styles.payBtn, { backgroundColor: colors.primary }]}
            onPress={() => {
              Alert.alert("Pagar Fatura", "Escolha a conta para o pagamento", [
                { text: "Cancelar", style: "cancel" },
                ...accounts.map(acc => ({
                  text: acc.nome,
                  onPress: async () => {
                    await financeService.payInvoice(card.id, acc.id, card.fatura);
                    fetchData();
                  }
                }))
              ]);
            }}
          >
            <Text style={styles.payBtnText}>Pagar Agora</Text>
          </TouchableOpacity>
        </View>
      </View>
    ))}
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
          {activeTab === 'Gestão' && renderGestao()}
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

    <AccountFormModal
      visible={isAccountModalVisible}
      onClose={() => setIsAccountModalVisible(false)}
      onSaveSuccess={fetchData}
    />

    <CardFormModal
      visible={isCardModalVisible}
      onClose={() => setIsCardModalVisible(false)}
      onSaveSuccess={fetchData}
    />

    <TransactionDetailsModal
      visible={isDetailsModalVisible}
      onClose={() => setIsDetailsModalVisible(false)}
      transaction={selectedTransaction}
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

  mainBalanceCard: { padding: 24, borderRadius: 32, gap: 8, marginBottom: 8 },
  mainBalanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  mainBalanceValue: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  mainBalanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 },
  mainBalanceSubLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 'bold' },
  mainBalanceSubValue: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  miniCard: { padding: 16, borderRadius: 20, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

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

  cardItem: { padding: 20, borderRadius: 24, borderWidth: 1, gap: 16 },
  cardInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardFaturaBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.03)', padding: 12, borderRadius: 16 },
  faturaLabel: { fontSize: 12, fontWeight: '600' },
  faturaValue: { fontSize: 18, fontWeight: 'bold' },
  payBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  payBtnText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, backgroundColor: 'transparent' },
});
