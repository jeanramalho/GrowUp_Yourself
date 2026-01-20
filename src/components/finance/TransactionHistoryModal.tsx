import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { LancamentoFinanceiro } from '@/models';
import { financeService } from '@/services/FinanceService';

interface TransactionHistoryModalProps {
    visible: boolean;
    onClose: () => void;
    type: 'receita' | 'despesa';
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({ visible, onClose, type }) => {
    const { colors, isDarkMode } = useAppTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [transactions, setTransactions] = useState<LancamentoFinanceiro[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            loadTransactions();
        }
    }, [visible, currentDate, type]);

    const loadTransactions = async () => {
        setLoading(true);
        // We need all transactions to filter by type and account (well, summary cards usually mean ALL accounts)
        // Let's assume this view shows ALL transactions of this type for the month
        const allTransactions = await financeService.getTransactionsByMonth(currentDate);
        const filtered = allTransactions.filter(t => t.tipo === type);
        // Sort by date desc
        filtered.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
        setTransactions(filtered);
        setLoading(false);
    };

    const changeMonth = (increment: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + increment);
        setCurrentDate(newDate);
    };

    const totalValue = transactions.reduce((sum, t) => sum + t.valor, 0);

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: type === 'receita' ? colors.success : colors.error }]}>
                        Histórico de {type === 'receita' ? 'Entradas' : 'Saídas'}
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.monthSelector}>
                    <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}>
                        <MaterialCommunityIcons name="chevron-left" size={32} color={colors.primary} />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.monthText, { color: colors.text }]}>{monthNames[currentDate.getMonth()]}</Text>
                        <Text style={[styles.yearText, { color: colors.textSecondary }]}>{currentDate.getFullYear()}</Text>
                    </View>
                    <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}>
                        <MaterialCommunityIcons name="chevron-right" size={32} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.totalCard, { backgroundColor: type === 'receita' ? colors.success + '20' : colors.error + '20' }]}>
                    <Text style={[styles.totalLabel, { color: type === 'receita' ? colors.success : colors.error }]}>Total no Mês</Text>
                    <Text style={[styles.totalValue, { color: type === 'receita' ? colors.success : colors.error }]}>
                        R$ {totalValue.toFixed(2)}
                    </Text>
                </View>

                <ScrollView contentContainerStyle={styles.list}>
                    {transactions.length > 0 ? (
                        transactions.map(t => (
                            <View key={t.id} style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <View style={styles.iconBox}>
                                    <MaterialCommunityIcons
                                        name={type === 'receita' ? 'arrow-up-circle' : 'arrow-down-circle'}
                                        size={24}
                                        color={type === 'receita' ? colors.success : colors.error}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.itemTitle, { color: colors.text }]}>{t.categoria}</Text>
                                    <Text style={[styles.itemDate, { color: colors.textSecondary }]}>
                                        {t.data.split('-').reverse().join('/')}
                                    </Text>
                                    {t.nota && <Text numberOfLines={1} style={{ fontSize: 12, color: colors.textSecondary, fontStyle: 'italic' }}>{t.nota}</Text>}
                                </View>
                                <Text style={[styles.itemValue, { color: type === 'receita' ? colors.success : colors.error }]}>
                                    R$ {t.valor.toFixed(2)}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum registro encontrado neste mês.</Text>
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
    monthSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    arrowBtn: { padding: 8 },
    monthText: { fontSize: 20, fontWeight: 'bold' },
    yearText: { fontSize: 14 },
    totalCard: { marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 16, alignItems: 'center' },
    totalLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
    totalValue: { fontSize: 24, fontWeight: 'bold' },
    list: { padding: 16, gap: 12 },
    item: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, gap: 12 },
    iconBox: { justifyContent: 'center', alignItems: 'center' },
    itemTitle: { fontSize: 16, fontWeight: '600' },
    itemDate: { fontSize: 12 },
    itemValue: { fontSize: 16, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 32, fontStyle: 'italic' }
});
