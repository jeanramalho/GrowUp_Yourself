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

interface AccountFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
    account?: any; // Conta | null
}

const ACCOUNT_TYPES = [
    { label: 'Carteira', value: 'carteira', icon: 'wallet' },
    { label: 'V. Alimentação', value: 'vale_alimentacao', icon: 'food' },
    { label: 'V. Refeição', value: 'vale_refeicao', icon: 'silverware-fork-knife' },
];

export const AccountFormModal: React.FC<AccountFormModalProps> = ({
    visible,
    onClose,
    onSaveSuccess,
    account
}) => {
    const { colors, isDarkMode, spacing } = useAppTheme();

    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState<any>('carteira');
    const [saldoInicial, setSaldoInicial] = useState('');

    useEffect(() => {
        if (visible) {
            if (account) {
                setNome(account.nome);
                setTipo(account.tipo);
                setSaldoInicial(account.saldo_inicial.toString().replace('.', ','));
            } else {
                setNome('');
                setTipo('carteira');
                setSaldoInicial('');
            }
        }
    }, [visible, account]);

    const handleSave = async () => {
        if (!nome.trim()) {
            Alert.alert("Erro", "Por favor, insira um nome para a conta.");
            return;
        }

        try {
            const saldo = parseFloat(saldoInicial.replace(',', '.')) || 0;

            if (account) {
                await financeService.updateAccount(account.id, {
                    nome,
                    tipo,
                    saldo_inicial: saldo,
                });
            } else {
                await financeService.createAccount({
                    nome,
                    tipo,
                    saldo_inicial: saldo,
                });
            }

            onSaveSuccess();
            onClose();
            // Clear state only if creating? Or always?
            // Better to clear.
            setNome('');
            setSaldoInicial('');
        } catch (error) {
            console.error("Save account error:", error);
            Alert.alert("Erro", "Não foi possível salvar a conta.");
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
                        {account ? 'Editar Conta / Vale' : 'Nova Conta / Vale'}
                    </Text>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={[styles.saveButtonText, { color: colors.primary }]}>Salvar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Nome da Conta</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                value={nome}
                                onChangeText={setNome}
                                placeholder="Ex: Carteira Neon, Vale Sodexo"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <Text style={[styles.label, { color: colors.textSecondary }]}>Tipo</Text>
                        <View style={styles.typeGrid}>
                            {ACCOUNT_TYPES.map((item) => (
                                <TouchableOpacity
                                    key={item.value}
                                    onPress={() => setTipo(item.value)}
                                    style={[
                                        styles.typeCard,
                                        { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, borderColor: tipo === item.value ? colors.primary : colors.border }
                                    ]}
                                >
                                    <MaterialCommunityIcons name={item.icon as any} size={24} color={tipo === item.value ? colors.primary : colors.textSecondary} />
                                    <Text style={[styles.typeLabel, { color: tipo === item.value ? colors.primary : colors.textSecondary }]}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Saldo Inicial (Opcional)</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                value={saldoInicial}
                                onChangeText={setSaldoInicial}
                                placeholder="0,00"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="numeric"
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
    typeGrid: { flexDirection: 'row', gap: 12 },
    typeCard: { flex: 1, padding: 12, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 8 },
    typeLabel: { fontSize: 12, fontWeight: 'bold' },
});
