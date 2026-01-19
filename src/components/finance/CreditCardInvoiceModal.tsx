import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { financeService } from '@/services/FinanceService';
import { CartaoCredito, LancamentoFinanceiro } from '@/models';

interface CreditCardInvoiceModalProps {
    visible: boolean;
    onClose: () => void;
    card: CartaoCredito | null;
    onTransactionPress: (transaction: LancamentoFinanceiro) => void;
}

export const CreditCardInvoiceModal: React.FC<CreditCardInvoiceModalProps> = ({
    visible,
    onClose,
    card,
    onTransactionPress
}) => {
    const { colors, isDarkMode } = useAppTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [transactions, setTransactions] = useState<LancamentoFinanceiro[]>([]);
    const [invoiceTotal, setInvoiceTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && card) {
            // Reset to current month when opening, or keep state? Resetting is safer.
            setCurrentDate(new Date());
            loadInvoice(new Date());
        }
    }, [visible, card]);

    const loadInvoice = async (date: Date) => {
        if (!card) return;
        setLoading(true);
        try {
            const txs = await financeService.getCardTransactions(card.id, date);
            const total = await financeService.getCardInvoice(card.id, date);

            // Sort by date desc
            txs.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

            setTransactions(txs);
            setInvoiceTotal(total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
        loadInvoice(newDate);
    };

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    if (!card) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.title, { color: colors.text }]}>{card.nome}</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Vencimento dia {card.dia_vencimento}
                        </Text>
                    </View>
                    <View style={{ width: 32 }} />
                </View>

                {/* Month Navigator */}
                <View style={styles.monthNav}>
                    <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navBtn}>
                        <MaterialCommunityIcons name="chevron-left" size={30} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={[styles.monthTitle, { color: colors.text }]}>
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </Text>
                    <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navBtn}>
                        <MaterialCommunityIcons name="chevron-right" size={30} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Invoice Summary */}
                <View style={[styles.invoiceCard, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
                    <Text style={[styles.invoiceLabel, { color: colors.textSecondary }]}>Valor da Fatura</Text>
                    <Text style={[styles.invoiceValue, { color: colors.error }]}>R$ {invoiceTotal.toFixed(2)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: invoiceTotal > 0 ? '#FEF2F2' : '#F0FDF4' }]}>
                        <Text style={[styles.statusText, { color: invoiceTotal > 0 ? '#DC2626' : '#16A34A' }]}>
                            {invoiceTotal > 0 ? 'Fatura Aberta / Fechada' : 'Fatura Zerada'}
                        </Text>
                    </View>
                </View>

                {/* Transactions List */}
                <ScrollView contentContainerStyle={styles.listContent}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Lançamentos</Text>
                    {loading ? (
                        <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
                    ) : transactions.length > 0 ? (
                        transactions.map(t => (
                            <TouchableOpacity
                                key={t.id}
                                style={[styles.transactionItem, { borderBottomColor: colors.border }]}
                                onPress={() => onTransactionPress(t)}
                            >
                                <View style={styles.iconBox}>
                                    <MaterialCommunityIcons name={t.tipo === 'receita' ? 'arrow-up' : 'cart-outline'} size={20} color={colors.text} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.tTitle, { color: colors.text }]}>{t.categoria}</Text>
                                    <View style={{ flexDirection: 'row', gap: 6 }}>
                                        <Text style={[styles.tDate, { color: colors.textSecondary }]}>
                                            {t.data.split('-').reverse().slice(0, 2).join('/')}
                                        </Text>
                                        {t.parcelas_total && t.parcelas_total > 1 && (
                                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                                                {t.parcela_atual}/{t.parcelas_total}
                                            </Text>
                                        )}
                                    </View>
                                    {t.nota ? <Text style={{ fontSize: 12, color: colors.textSecondary, fontStyle: 'italic' }}>{t.nota}</Text> : null}
                                </View>
                                <Text style={[styles.tValue, { color: colors.text }]}>
                                    R$ {t.valor.toFixed(2)}
                                </Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 20 }}>
                            Nenhum lançamento nesta fatura.
                        </Text>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
    closeButton: { padding: 4 },
    title: { fontSize: 18, fontWeight: 'bold' },
    subtitle: { fontSize: 12 },
    monthNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    navBtn: { padding: 8 },
    monthTitle: { fontSize: 18, fontWeight: 'bold' },
    invoiceCard: { margin: 16, padding: 24, borderRadius: 20, alignItems: 'center', gap: 8 },
    invoiceLabel: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
    invoiceValue: { fontSize: 32, fontWeight: 'bold' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    listContent: { padding: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    transactionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
    iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
    tTitle: { fontSize: 16, fontWeight: '600' },
    tDate: { fontSize: 12 },
    tValue: { fontSize: 16, fontWeight: 'bold' }
});
