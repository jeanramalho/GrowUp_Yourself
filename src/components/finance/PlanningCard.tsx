import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { LancamentoFinanceiro, CategoriaFinanceira } from '@/models';

interface PlanningCardProps {
    item: LancamentoFinanceiro;
    category?: CategoriaFinanceira;
    realSpent: number;
    onPress: () => void;
}

export function PlanningCard({ item, category, realSpent, onPress }: PlanningCardProps) {
    const { colors, isDarkMode } = useAppTheme();

    const progress = item.valor > 0 ? (realSpent / item.valor) * 100 : 0;
    const isOverBudget = realSpent > item.valor;

    // Format date DD/MM/YYYY
    const dateObj = new Date(item.data);
    const formattedDate = dateObj.toLocaleDateString('pt-BR');

    // Status Color
    const statusColor = isOverBudget ? colors.error : (item.status === 'pago' ? colors.success : colors.primary);

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderColor: isOverBudget ? colors.error : colors.border,
                    borderWidth: isOverBudget ? 1.5 : 1
                }
            ]}
            onPress={onPress}
        >
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={[styles.iconBox, { backgroundColor: (category?.cor || colors.primary) + '20' }]}>
                        <MaterialCommunityIcons
                            name={(category?.icone as any) || 'tag-outline'}
                            size={24}
                            color={category?.cor || colors.primary}
                        />
                    </View>
                    <View>
                        <Text style={[styles.categoryName, { color: colors.text }]}>{category?.nome || 'Sem Categoria'}</Text>
                        <Text style={[styles.dateText, { color: colors.textSecondary }]}>Vence em {formattedDate}</Text>
                    </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.valueText, { color: colors.text }]}>R$ {item.valor.toFixed(2)}</Text>
                    {item.status === 'pago' && (
                        <View style={[styles.badge, { backgroundColor: colors.success + '20' }]}>
                            <Text style={[styles.badgeText, { color: colors.success }]}>PAGO</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.progressContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                        Gasto: R$ {realSpent.toFixed(2)}
                    </Text>
                    <Text style={[styles.progressLabel, { color: isOverBudget ? colors.error : colors.textSecondary }]}>
                        {Math.round(progress)}%
                    </Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]}>
                    <View
                        style={[
                            styles.progressBarFill,
                            {
                                width: `${Math.min(progress, 100)}%`,
                                backgroundColor: isOverBudget ? colors.error : (item.status === 'pago' ? colors.success : (category?.cor || colors.primary))
                            }
                        ]}
                    />
                </View>
            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: { padding: 16, borderRadius: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    categoryName: { fontSize: 16, fontWeight: 'bold' },
    dateText: { fontSize: 12 },
    valueText: { fontSize: 18, fontWeight: 'bold' },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 4 },
    badgeText: { fontSize: 10, fontWeight: 'bold' },
    progressContainer: { marginTop: 8 },
    progressBarBg: { height: 6, borderRadius: 3, width: '100%', overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 3 },
    progressLabel: { fontSize: 12, fontWeight: '600' },
});
