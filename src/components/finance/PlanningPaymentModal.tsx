import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { LancamentoFinanceiro, CategoriaFinanceira, Conta } from '@/models';
import { financeService } from '@/services/FinanceService';

interface PlanningPaymentModalProps {
    visible: boolean;
    onClose: () => void;
    item: LancamentoFinanceiro | null;
    category: CategoriaFinanceira | undefined;
    accounts: Conta[];
    onPaySuccess: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function PlanningPaymentModal({ visible, onClose, item, category, accounts, onPaySuccess, onEdit, onDelete }: PlanningPaymentModalProps) {
    const { colors, isDarkMode } = useAppTheme();
    const [isPaying, setIsPaying] = useState(false);

    if (!item) return null;

    const handlePay = (accountId: string) => {
        Alert.alert('Confirmar Pagamento', `Deseja pagar R$ ${item.valor.toFixed(2)} usando a conta selecionada?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Confirmar',
                onPress: async () => {
                    try {
                        await financeService.payPlannedItem(item.id, accountId, new Date().toISOString().split('T')[0]);
                        setIsPaying(false);
                        onPaySuccess();
                        onClose();
                    } catch (error) {
                        Alert.alert('Erro', 'Falha ao processar pagamento');
                    }
                }
            }
        ]);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: colors.surface }]}>
                    {!isPaying ? (
                        <>
                            <View style={styles.header}>
                                <View style={[styles.iconBox, { backgroundColor: (category?.cor || colors.primary) + '20' }]}>
                                    <MaterialCommunityIcons name={(category?.icone as any) || 'tag'} size={32} color={category?.cor || colors.primary} />
                                </View>
                                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                    <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ alignItems: 'center', marginBottom: 24 }}>
                                <Text style={[styles.value, { color: colors.text }]}>R$ {item.valor.toFixed(2)}</Text>
                                <Text style={[styles.catName, { color: colors.textSecondary }]}>{category?.nome || 'Sem Categoria'}</Text>
                                <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                                    Vencimento: {new Date(item.data).toLocaleDateString('pt-BR')}
                                </Text>
                            </View>

                            {item.status === 'pendente' && (
                                <TouchableOpacity
                                    style={[styles.payMainBtn, { backgroundColor: colors.primary }]}
                                    onPress={() => setIsPaying(true)}
                                >
                                    <MaterialCommunityIcons name="check-circle-outline" size={24} color="white" />
                                    <Text style={styles.payMainBtnText}>Pagar Agora</Text>
                                </TouchableOpacity>
                            )}

                            <View style={styles.actionsRow}>
                                <TouchableOpacity style={styles.actionItem} onPress={onEdit}>
                                    <View style={[styles.actionIcon, { backgroundColor: colors.border }]}>
                                        <MaterialCommunityIcons name="pencil" size={20} color={colors.text} />
                                    </View>
                                    <Text style={[styles.actionLabel, { color: colors.text }]}>Editar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionItem} onPress={onDelete}>
                                    <View style={[styles.actionIcon, { backgroundColor: colors.error + '20' }]}>
                                        <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.error} />
                                    </View>
                                    <Text style={[styles.actionLabel, { color: colors.error }]}>Excluir</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.header}>
                                <Text style={[styles.title, { color: colors.text }]}>Escolha a Forma de Pagamento</Text>
                                <TouchableOpacity onPress={() => setIsPaying(false)}>
                                    <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Voltar</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={{ maxHeight: 300 }}>
                                {accounts.map(acc => (
                                    <TouchableOpacity
                                        key={acc.id}
                                        style={[styles.accountItem, { borderBottomColor: colors.border }]}
                                        onPress={() => handlePay(acc.id)}
                                    >
                                        <View>
                                            <Text style={[styles.accName, { color: colors.text }]}>{acc.nome}</Text>
                                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>{acc.tipo === 'carteira' ? 'Carteira' : 'Vale'}</Text>
                                        </View>
                                        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    container: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    closeBtn: { padding: 4 },
    iconBox: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    value: { fontSize: 32, fontWeight: 'bold', marginBottom: 4 },
    catName: { fontSize: 18, fontWeight: '600' },
    payMainBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 16, gap: 8, marginBottom: 24 },
    payMainBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
    actionsRow: { flexDirection: 'row', justifyContent: 'space-around' },
    actionItem: { alignItems: 'center', gap: 8 },
    actionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    actionLabel: { fontSize: 12, fontWeight: '500' },

    title: { fontSize: 18, fontWeight: 'bold' },
    accountItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
    accName: { fontSize: 16, fontWeight: 'bold' },
});
