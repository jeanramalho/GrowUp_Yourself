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
    Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { financeService } from '@/services/FinanceService';
import { LancamentoFinanceiro } from '@/models';

interface TransactionFormModalProps {
    visible: boolean;
    onClose: () => void;
    transactionToEdit?: LancamentoFinanceiro | null;
    onSaveSuccess: () => void;
}

const CATEGORIES = [
    'Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Doação', 'Outros'
];

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
    visible,
    onClose,
    transactionToEdit,
    onSaveSuccess,
}) => {
    const { colors, isDarkMode, spacing } = useAppTheme();

    const [formData, setFormData] = useState({
        tipo: 'despesa' as 'receita' | 'despesa',
        categoria: 'Outros',
        valor: '',
        data: new Date().toISOString().split('T')[0],
        nota: '',
    });

    useEffect(() => {
        if (visible) {
            if (transactionToEdit) {
                setFormData({
                    tipo: transactionToEdit.tipo,
                    categoria: transactionToEdit.categoria || 'Outros',
                    valor: transactionToEdit.valor.toString(),
                    data: transactionToEdit.data,
                    nota: transactionToEdit.nota || '',
                });
            } else {
                setFormData({
                    tipo: 'despesa',
                    categoria: 'Outros',
                    valor: '',
                    data: new Date().toISOString().split('T')[0],
                    nota: '',
                });
            }
        }
    }, [visible, transactionToEdit]);

    const handleSave = async () => {
        const valorNum = parseFloat(formData.valor.replace(',', '.'));
        if (isNaN(valorNum) || valorNum <= 0) {
            Alert.alert("Erro", "Por favor, insira um valor válido.");
            return;
        }

        try {
            const data = {
                tipo: formData.tipo,
                categoria: formData.categoria,
                valor: valorNum,
                data: formData.data,
                nota: formData.nota,
                planejado: false,
            };

            if (transactionToEdit) {
                await financeService.updateTransaction(transactionToEdit.id, data);
            } else {
                await financeService.createTransaction(data);
            }

            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error("Save transaction error:", error);
            Alert.alert("Erro", "Não foi possível salvar a movimentação.");
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
                    <Text style={[styles.title, { color: colors.text }]}>
                        {transactionToEdit ? 'Editar Movimentação' : 'Nova Movimentação'}
                    </Text>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={[styles.saveButtonText, { color: colors.primary }]}>Salvar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.typeSelector}>
                        <TouchableOpacity
                            onPress={() => setFormData(p => ({ ...p, tipo: 'despesa' }))}
                            style={[
                                styles.typeButton,
                                formData.tipo === 'despesa' && { backgroundColor: colors.error + '20', borderColor: colors.error }
                            ]}
                        >
                            <MaterialCommunityIcons name="minus-circle-outline" size={20} color={formData.tipo === 'despesa' ? colors.error : colors.textSecondary} />
                            <Text style={[styles.typeButtonText, { color: formData.tipo === 'despesa' ? colors.error : colors.textSecondary }]}>Despesa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setFormData(p => ({ ...p, tipo: 'receita' }))}
                            style={[
                                styles.typeButton,
                                formData.tipo === 'receita' && { backgroundColor: colors.success + '20', borderColor: colors.success }
                            ]}
                        >
                            <MaterialCommunityIcons name="plus-circle-outline" size={20} color={formData.tipo === 'receita' ? colors.success : colors.textSecondary} />
                            <Text style={[styles.typeButtonText, { color: formData.tipo === 'receita' ? colors.success : colors.textSecondary }]}>Receita</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Valor</Text>
                        <TextInput
                            style={[styles.input, styles.valueInput, { color: formData.tipo === 'despesa' ? colors.error : colors.success }]}
                            value={formData.valor}
                            onChangeText={(text) => setFormData(p => ({ ...p, valor: text }))}
                            placeholder="0,00"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="numeric"
                            autoFocus
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Categoria</Text>
                        <View style={styles.categoriesContainer}>
                            {CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => setFormData(p => ({ ...p, categoria: cat }))}
                                    style={[
                                        styles.categoryChip,
                                        { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100 },
                                        formData.categoria === cat && { backgroundColor: colors.primary, borderColor: colors.primary }
                                    ]}
                                >
                                    <Text style={[styles.categoryChipText, { color: formData.categoria === cat ? 'white' : colors.text }]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Data (AAAA-MM-DD)</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                            value={formData.data}
                            onChangeText={(text) => setFormData(p => ({ ...p, data: text }))}
                            placeholder="2024-10-15"
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Nota (opcional)</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                            value={formData.nota}
                            onChangeText={(text) => setFormData(p => ({ ...p, nota: text }))}
                            placeholder="Ex: Compra do mês"
                            placeholderTextColor={colors.textSecondary}
                        />
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
    scrollContent: { padding: 24, gap: 24 },
    typeSelector: { flexDirection: 'row', gap: 12 },
    typeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
    typeButtonText: { fontWeight: 'bold' },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
    input: { height: 56, borderRadius: 16, paddingHorizontal: 16, fontSize: 16, borderWidth: 1 },
    valueInput: { fontSize: 32, fontWeight: 'bold', height: 72, textAlign: 'center', borderBottomWidth: 2, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderColor: 'transparent' },
    categoriesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'transparent' },
    categoryChipText: { fontSize: 14, fontWeight: '500' },
});
