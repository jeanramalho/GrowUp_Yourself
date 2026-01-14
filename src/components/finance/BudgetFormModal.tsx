import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { financeService } from '@/services/FinanceService';

interface BudgetFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
}

const CATEGORIES = [
    'Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Doação', 'Outros'
];

export const BudgetFormModal: React.FC<BudgetFormModalProps> = ({
    visible,
    onClose,
    onSaveSuccess,
}) => {
    const { colors, isDarkMode } = useAppTheme();

    const [budgets, setBudgets] = useState<Record<string, string>>({});

    useEffect(() => {
        if (visible) {
            financeService.getPlannedByMonth(new Date()).then(data => {
                const initial: Record<string, string> = {};
                data.forEach(t => {
                    if (t.categoria) initial[t.categoria] = t.valor.toString();
                });
                setBudgets(initial);
            });
        }
    }, [visible]);

    const handleSave = async () => {
        try {
            const currentPlanned = await financeService.getPlannedByMonth(new Date());

            for (const cat of CATEGORIES) {
                const val = parseFloat(budgets[cat] || '0');
                const existing = currentPlanned.find(t => t.categoria === cat);

                if (existing) {
                    await financeService.updateTransaction(existing.id, { valor: val });
                } else if (val > 0) {
                    await financeService.createTransaction({
                        tipo: 'despesa',
                        categoria: cat,
                        valor: val,
                        data: new Date().toISOString().split('T')[0],
                        nota: 'Planejamento Mensal',
                        planejado: true,
                    });
                }
            }

            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error("Save budget error:", error);
            Alert.alert("Erro", "Não foi possível salvar o planejamento.");
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>Planejamento Mensal</Text>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={[styles.saveButtonText, { color: colors.primary }]}>Salvar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        Defina quanto você planeja gastar em cada categoria para este mês.
                    </Text>

                    <View style={styles.form}>
                        {CATEGORIES.map(cat => (
                            <View key={cat} style={styles.inputRow}>
                                <Text style={[styles.label, { color: colors.text }]}>{cat}</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                    value={budgets[cat] || ''}
                                    onChangeText={(text) => setBudgets(p => ({ ...p, [cat]: text }))}
                                    placeholder="0,00"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="numeric"
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
    closeButton: { padding: 4 },
    title: { fontSize: 18, fontWeight: 'bold' },
    saveButton: { padding: 4 },
    saveButtonText: { fontSize: 16, fontWeight: 'bold' },
    scrollContent: { padding: 24, gap: 16 },
    description: { fontSize: 14, marginBottom: 16 },
    form: { gap: 12 },
    inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    label: { flex: 1, fontSize: 16, fontWeight: '500' },
    input: { width: 120, height: 48, borderRadius: 12, paddingHorizontal: 12, fontSize: 16, borderWidth: 1, textAlign: 'right' },
});
