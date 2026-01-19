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

interface CardFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
}

export const CardFormModal: React.FC<CardFormModalProps> = ({
    visible,
    onClose,
    onSaveSuccess,
}) => {
    const { colors, isDarkMode, spacing } = useAppTheme();

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [limite, setLimite] = useState('');
    const [diaFechamento, setDiaFechamento] = useState('');
    const [diaVencimento, setDiaVencimento] = useState('');

    useEffect(() => {
        if (visible) {
            setNome('');
            setDescricao('');
            setLimite('');
            setDiaFechamento('');
            setDiaVencimento('');
        }
    }, [visible]);

    const handleSave = async () => {
        if (!nome.trim() || !diaFechamento || !diaVencimento) {
            Alert.alert("Erro", "Por favor, preencha os campos obrigatórios.");
            return;
        }

        try {
            await financeService.createCard({
                nome,
                descricao,
                limite: parseFloat(limite.replace(',', '.')) || 0,
                dia_fechamento: parseInt(diaFechamento),
                dia_vencimento: parseInt(diaVencimento),
            });

            onSaveSuccess();
            onClose();
            setNome('');
            setDescricao('');
            setLimite('');
            setDiaFechamento('');
            setDiaVencimento('');
        } catch (error) {
            console.error("Save card error:", error);
            Alert.alert("Erro", "Não foi possível salvar o cartão.");
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
                    <Text style={[styles.title, { color: colors.text }]}>Novo Cartão de Crédito</Text>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={[styles.saveButtonText, { color: colors.primary }]}>Salvar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Nome do Cartão</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                value={nome}
                                onChangeText={setNome}
                                placeholder="Ex: Neon, Nubank"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Limite Total</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                value={limite}
                                onChangeText={setLimite}
                                placeholder="0,00"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Fechamento (Dia)</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                    value={diaFechamento}
                                    onChangeText={setDiaFechamento}
                                    placeholder="Ex: 10"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Vencimento (Dia)</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                    value={diaVencimento}
                                    onChangeText={setDiaVencimento}
                                    placeholder="Ex: 20"
                                    placeholderTextColor={colors.textSecondary}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Descrição (Opcional)</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                value={descricao}
                                onChangeText={setDescricao}
                                placeholder="Minhas compras..."
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
    scrollContent: { padding: 24 },
    form: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
    input: { height: 56, borderRadius: 16, paddingHorizontal: 16, fontSize: 16, borderWidth: 1 },
    row: { flexDirection: 'row', gap: 12 },
});
