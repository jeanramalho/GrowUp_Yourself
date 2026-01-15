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
import { Investimento } from '@/models';
import { CurrencyInput } from '../ui/CurrencyInput';
import { DatePickerInput } from '../ui/DatePickerInput';

interface InvestmentFormModalProps {
    visible: boolean;
    onClose: () => void;
    investmentToEdit?: Investimento | null;
    onSaveSuccess: () => void;
}

export const InvestmentFormModal: React.FC<InvestmentFormModalProps> = ({
    visible,
    onClose,
    investmentToEdit,
    onSaveSuccess,
}) => {
    const { colors, isDarkMode, spacing } = useAppTheme();

    const [formData, setFormData] = useState({
        nome: '',
        principal: '',
        taxa_juros_ano: '',
        data_inicio: new Date(),
        notas: '',
    });

    useEffect(() => {
        if (visible) {
            if (investmentToEdit) {
                let parsedDate = new Date();
                // Add T12:00:00 to avoid timezone issues shifting days, same as Transaction form
                if (investmentToEdit.data_inicio && investmentToEdit.data_inicio.length === 10) {
                    const [y, m, d] = investmentToEdit.data_inicio.split('-').map(Number);
                    parsedDate = new Date(y, m - 1, d);
                } else if (investmentToEdit.data_inicio) {
                    parsedDate = new Date(investmentToEdit.data_inicio);
                }

                setFormData({
                    nome: investmentToEdit.nome,
                    principal: investmentToEdit.principal.toString().replace('.', ','),
                    taxa_juros_ano: investmentToEdit.taxa_juros_ano?.toString().replace('.', ',') || '',
                    data_inicio: parsedDate,
                    notas: investmentToEdit.notas || '',
                });
            } else {
                setFormData({
                    nome: '',
                    principal: '',
                    taxa_juros_ano: '',
                    data_inicio: new Date(),
                    notas: '',
                });
            }
        }
    }, [visible, investmentToEdit]);

    const handleSave = async () => {
        const principalNum = parseFloat(formData.principal.replace(',', '.'));
        const taxaNum = parseFloat(formData.taxa_juros_ano.replace(',', '.'));

        if (!formData.nome.trim()) {
            Alert.alert("Erro", "Por favor, insira um nome para o investimento.");
            return;
        }
        if (isNaN(principalNum) || principalNum <= 0) {
            Alert.alert("Erro", "Por favor, insira um valor principal válido.");
            return;
        }

        try {
            const year = formData.data_inicio.getFullYear();
            const month = String(formData.data_inicio.getMonth() + 1).padStart(2, '0');
            const day = String(formData.data_inicio.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const data: any = {
                nome: formData.nome,
                principal: principalNum,
                taxa_juros_ano: isNaN(taxaNum) ? undefined : taxaNum,
                data_inicio: dateStr,
                notas: formData.notas,
            };

            if (investmentToEdit) {
                await financeService.updateInvestment(investmentToEdit.id, data);
            } else {
                await financeService.createInvestment(data);
            }

            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error("Save investment error:", error);
            Alert.alert("Erro", "Não foi possível salvar o investimento.");
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
                        {investmentToEdit ? 'Editar Investimento' : 'Novo Investimento'}
                    </Text>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={[styles.saveButtonText, { color: colors.primary }]}>Salvar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Nome do Ativo</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                value={formData.nome}
                                onChangeText={(text) => setFormData(p => ({ ...p, nome: text }))}
                                placeholder="Ex: CDB Banco X ou Ações Y"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Valor Principal</Text>
                            <CurrencyInput
                                value={formData.principal}
                                onValueChange={(val) => setFormData(p => ({ ...p, principal: val }))}
                                placeholder="0,00"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Taxa de Juros Anual (%)</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                value={formData.taxa_juros_ano}
                                onChangeText={(text) => setFormData(p => ({ ...p, taxa_juros_ano: text }))}
                                placeholder="Ex: 12,5"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <DatePickerInput
                                label="Data de Início"
                                value={formData.data_inicio}
                                onChange={(date) => setFormData(p => ({ ...p, data_inicio: date }))}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Notas (opcional)</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                value={formData.notas}
                                onChangeText={(text) => setFormData(p => ({ ...p, notas: text }))}
                                placeholder="Alguma observação..."
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>
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
    form: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
    input: { height: 56, borderRadius: 16, paddingHorizontal: 16, fontSize: 16, borderWidth: 1 },
});
