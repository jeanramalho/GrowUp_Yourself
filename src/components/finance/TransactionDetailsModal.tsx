import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { LancamentoFinanceiro } from '@/models';

interface TransactionDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    transaction: LancamentoFinanceiro | null;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ visible, onClose, transaction }) => {
    const { colors } = useAppTheme();

    if (!transaction) return null;

    const isExpense = transaction.tipo === 'despesa';

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <View style={[styles.iconCircle, { backgroundColor: isExpense ? colors.error + '20' : colors.success + '20' }]}>
                            <MaterialCommunityIcons
                                name={isExpense ? 'arrow-down' : 'arrow-up'}
                                size={32}
                                color={isExpense ? colors.error : colors.success}
                            />
                        </View>
                        <Text style={[styles.amount, { color: isExpense ? colors.error : colors.success }]}>
                            {isExpense ? '- ' : '+ '}R$ {transaction.valor.toFixed(2)}
                        </Text>
                        <Text style={[styles.title, { color: colors.text }]}>{transaction.categoria}</Text>
                    </View>

                    <ScrollView style={styles.details}>
                        <DetailRow label="Data" value={transaction.data.split('-').reverse().join('/')} icon="calendar" />

                        {transaction.nota && (
                            <DetailRow label="Descrição" value={transaction.nota} icon="text" />
                        )}

                        {transaction.conta_id && (
                            <DetailRow label="Conta" value="Carteira/Vale" icon="wallet" />
                        )}

                        {transaction.cartao_id && (
                            <DetailRow label="Cartão" value="Cartão de Crédito" icon="credit-card" />
                        )}

                        {transaction.parcelas_total && transaction.parcelas_total > 1 && (
                            <>
                                <DetailRow label="Parcela" value={`${transaction.parcela_atual}/${transaction.parcelas_total}`} icon="layers" />
                                <DetailRow
                                    label="Valor da Parcela"
                                    value={`R$ ${transaction.valor.toFixed(2)}`}
                                    icon="cash-multiple"
                                />
                                <DetailRow
                                    label="Valor Total da Compra"
                                    value={`R$ ${(transaction.valor * transaction.parcelas_total).toFixed(2)}`}
                                    icon="cart-outline"
                                />
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const DetailRow = ({ label, value, icon }: { label: string, value: string, icon: any }) => {
    const { colors } = useAppTheme();
    return (
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <MaterialCommunityIcons name={icon} size={20} color={colors.textSecondary} />
                <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
            </View>
            <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
    card: { borderRadius: 24, padding: 24, maxHeight: '80%' },
    closeBtn: { alignSelf: 'flex-end' },
    header: { alignItems: 'center', marginBottom: 32 },
    iconCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    amount: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
    title: { fontSize: 20, fontWeight: '500' },
    details: { gap: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
    label: { fontSize: 16 },
    value: { fontSize: 16, fontWeight: 'bold' }
});
