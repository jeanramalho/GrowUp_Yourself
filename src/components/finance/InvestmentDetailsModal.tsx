import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { Investimento } from '@/models';
import { financeService } from '@/services/FinanceService';

interface InvestmentDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    investment: Investimento | null;
}

export const InvestmentDetailsModal: React.FC<InvestmentDetailsModalProps> = ({ visible, onClose, investment }) => {
    const { colors } = useAppTheme();

    if (!investment) return null;

    const returns = financeService.calculateReturns(investment);
    const total = investment.principal + returns;

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
                            <MaterialCommunityIcons
                                name="chart-line"
                                size={32}
                                color={colors.primary}
                            />
                        </View>
                        <Text style={[styles.amount, { color: colors.text }]}>
                            R$ {total.toFixed(2)}
                        </Text>
                        <Text style={[styles.title, { color: colors.textSecondary }]}>{investment.nome}</Text>
                    </View>

                    <ScrollView style={styles.details}>
                        <DetailRow label="Principal Investido" value={`R$ ${investment.principal.toFixed(2)}`} icon="cash" />
                        <DetailRow label="Rendimento Total" value={`+ R$ ${returns.toFixed(2)}`} icon="trending-up" color={colors.success} />
                        <DetailRow label="Taxa de Juros (a.a.)" value={`${investment.taxa_juros_ano}%`} icon="percent" />
                        <DetailRow label="Data de Início" value={investment.data_inicio?.split('-').reverse().join('/') || '-'} icon="calendar" />

                        {investment.notas && (
                            <DetailRow label="Notas" value={investment.notas} icon="text" />
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const DetailRow = ({ label, value, icon, color }: { label: string, value: string, icon: any, color?: string }) => {
    const { colors } = useAppTheme();
    return (
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <MaterialCommunityIcons name={icon} size={20} color={colors.textSecondary} />
                <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
            </View>
            <Text style={[styles.value, { color: color || colors.text }]}>{value}</Text>
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
