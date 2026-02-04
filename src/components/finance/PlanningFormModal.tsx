import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Switch, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { financeService } from '@/services/FinanceService';
import { CategoriaFinanceira, LancamentoFinanceiro } from '@/models';
import { CategoryManagerModal } from './CategoryManagerModal';
import { DatePickerInput } from '../ui/DatePickerInput';
import { CurrencyInput } from '../ui/CurrencyInput';

interface PlanningFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
    planningToEdit?: LancamentoFinanceiro | null;
}

export function PlanningFormModal({ visible, onClose, onSaveSuccess, planningToEdit }: PlanningFormModalProps) {
    const { colors, isDarkMode } = useAppTheme();

    const [value, setValue] = useState('');
    const [date, setDate] = useState(new Date());
    const [selectedCategory, setSelectedCategory] = useState<CategoriaFinanceira | null>(null);
    const [isRecurrent, setIsRecurrent] = useState(false);
    const [note, setNote] = useState('');

    const [isCategoryPickerVisible, setIsCategoryPickerVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            if (planningToEdit) {
                // Edit Mode
                setValue(planningToEdit.valor.toFixed(2).replace('.', ','));
                setDate(new Date(planningToEdit.data));
                setNote(planningToEdit.nota || '');
                setIsRecurrent(false); // Can't toggle recurrence on edit usually, or complex logic

                // Fetch category if needed
                if (planningToEdit.categoria_id) {
                    financeService.getCategories().then(cats => {
                        const found = cats.find(c => c.id === planningToEdit.categoria_id);
                        if (found) setSelectedCategory(found);
                    });
                }
            } else {
                // Create Mode
                resetForm();
            }
        }
    }, [visible, planningToEdit]);

    const resetForm = () => {
        setValue('');
        setDate(new Date());
        setSelectedCategory(null);
        setIsRecurrent(false);
        setNote('');
    };

    const handleSave = async () => {
        if (!value || parseFloat(value.replace(',', '.')) <= 0) {
            Alert.alert('Erro', 'Informe um valor válido.');
            return;
        }
        if (!selectedCategory) {
            Alert.alert('Erro', 'Selecione uma categoria.');
            return;
        }

        const numericValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));

        try {
            const payload = {
                tipo: selectedCategory.tipo,
                valor: numericValue,
                data: date.toISOString().split('T')[0],
                categoria_id: selectedCategory.id,
                nota: note,
                recorrente: isRecurrent // Service handles this
            };

            if (planningToEdit) {
                const { recorrente, ...updatePayload } = payload;
                await financeService.updateTransaction(planningToEdit.id, updatePayload as any);
            } else {
                await financeService.createPlannedItem(payload as any);
            }

            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao salvar planejamento.');
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, { color: colors.text }]}>
                            {planningToEdit ? 'Editar Planejamento' : 'Novo Planejamento'}
                        </Text>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                            Defina seus objetivos futuros
                        </Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
                    <View>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Valor Planejado</Text>
                        <CurrencyInput
                            value={value}
                            onValueChange={setValue}
                            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                            placeholder="0,00"
                            autoFocus={!planningToEdit}
                        />
                    </View>

                    <View>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Categoria</Text>
                        <TouchableOpacity
                            style={[styles.selector, { borderColor: colors.border, backgroundColor: colors.surface }]}
                            onPress={() => setIsCategoryPickerVisible(true)}
                        >
                            {selectedCategory ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <View style={{ backgroundColor: selectedCategory.cor + '20', padding: 8, borderRadius: 8 }}>
                                        <MaterialCommunityIcons name={selectedCategory.icone as any} size={20} color={selectedCategory.cor} />
                                    </View>
                                    <Text style={[styles.selectorText, { color: colors.text }]}>{selectedCategory.nome}</Text>
                                </View>
                            ) : (
                                <Text style={{ color: colors.textSecondary }}>Selecione uma categoria...</Text>
                            )}
                            <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Data de Pagamento</Text>
                        <DatePickerInput
                            value={date}
                            onChange={setDate}
                        />
                    </View>

                    {!planningToEdit && (
                        <View style={[styles.row, { paddingVertical: 8 }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.label, { marginBottom: 4, color: colors.text }]}>Gasto Recorrente?</Text>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Repetir este planejamento nos próximos 12 meses</Text>
                            </View>
                            <Switch
                                value={isRecurrent}
                                onValueChange={setIsRecurrent}
                                trackColor={{ false: colors.border, true: colors.primary }}
                            />
                        </View>
                    )}

                    <View>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Nota / Observação</Text>
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: colors.border, minHeight: 80, textAlignVertical: 'top' }]}
                            value={note}
                            onChangeText={setNote}
                            placeholder="Ex: Pagar até dia 10..."
                            placeholderTextColor={colors.textSecondary}
                            multiline
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                        onPress={handleSave}
                    >
                        <Text style={styles.saveBtnText}>Salvar Planejamento</Text>
                    </TouchableOpacity>

                </ScrollView>

                <CategoryManagerModal
                    visible={isCategoryPickerVisible}
                    onClose={() => setIsCategoryPickerVisible(false)}
                    onSelect={setSelectedCategory}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 12 },
    title: { fontSize: 20, fontWeight: 'bold' },
    closeBtn: { padding: 4 },
    label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { fontSize: 24, padding: 16, borderRadius: 16, borderWidth: 1, fontWeight: 'bold' },
    selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1 },
    selectorText: { fontSize: 16, fontWeight: '500' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    saveBtn: { padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 24 },
    saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
