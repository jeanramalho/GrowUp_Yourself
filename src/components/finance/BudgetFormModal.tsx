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
import { CurrencyInput } from '../ui/CurrencyInput';
import { CategoryManagerModal } from './CategoryManagerModal';

interface BudgetFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
}

export const BudgetFormModal: React.FC<BudgetFormModalProps> = ({
    visible,
    onClose,
    onSaveSuccess,
}) => {
    const { colors, isDarkMode } = useAppTheme();

    const [budgets, setBudgets] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState<string[]>([]);
    const [isCategoryManagerVisible, setIsCategoryManagerVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            loadData();
        }
    }, [visible]);

    const loadData = async () => {
        const cats = await financeService.getPlanningCategories();
        setCategories(cats.map(c => c.nome));

        financeService.getPlannedByMonth(new Date()).then(data => {
            const initial: Record<string, string> = {};
            // Pre-fill existing logic
            data.forEach(t => {
                if (t.categoria) initial[t.categoria] = t.valor.toFixed(2).replace('.', ',');
            });
            setBudgets(initial);
        });
    };

    const handleSave = async () => {
        try {
            const currentPlanned = await financeService.getPlannedByMonth(new Date());

            for (const cat of categories) {
                const rawVal = budgets[cat];
                if (!rawVal) continue;

                const val = parseFloat(rawVal.replace('.', '').replace(',', '.')); // Handle '1.000,00' -> '1000.00' if using formatted
                // CurrencyInput output is "X,XX".
                const valParsed = parseFloat(rawVal.replace(',', '.'));

                const existing = currentPlanned.find(t => t.categoria === cat);

                if (existing) {
                    if (valParsed !== existing.valor) {
                        await financeService.updateTransaction(existing.id, { valor: valParsed });
                    }
                } else if (valParsed > 0) {
                    await financeService.createTransaction({
                        tipo: 'despesa',
                        categoria: cat,
                        valor: valParsed,
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
                        Defina quanto você planeja gastar.
                    </Text>

                    <TouchableOpacity
                        style={[styles.manageBtn, { borderColor: colors.primary }]}
                        onPress={() => setIsCategoryManagerVisible(true)}
                    >
                        <Text style={[styles.manageBtnText, { color: colors.primary }]}>Gerenciar Categorias</Text>
                    </TouchableOpacity>

                    <View style={styles.form}>
                        {categories.map(cat => (
                            <View key={cat} style={styles.inputRow}>
                                <Text style={[styles.label, { color: colors.text }]}>{cat}</Text>
                                <CurrencyInput
                                    style={{ width: 120, textAlign: 'right' }}
                                    value={budgets[cat] || ''}
                                    onValueChange={(val) => setBudgets(p => ({ ...p, [cat]: val }))}
                                    placeholder="0,00"
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <CategoryManagerModal
                    visible={isCategoryManagerVisible}
                    onClose={() => {
                        setIsCategoryManagerVisible(false);
                        loadData(); // Reload categories
                    }}
                />
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
    description: { fontSize: 14, marginBottom: 8 },
    manageBtn: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, marginBottom: 16 },
    manageBtnText: { fontWeight: 'bold', fontSize: 12 },
    form: { gap: 12 },
    inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    label: { flex: 1, fontSize: 16, fontWeight: '500' },
});
