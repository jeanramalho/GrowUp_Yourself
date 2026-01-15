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
import { LancamentoFinanceiro, Conta, CartaoCredito, CategoriaPlanejamento } from '@/models';
import { CurrencyInput } from '../ui/CurrencyInput';
import { DatePickerInput } from '../ui/DatePickerInput';

interface TransactionFormModalProps {
    visible: boolean;
    onClose: () => void;
    transactionToEdit?: LancamentoFinanceiro | null;
    onSaveSuccess: () => void;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
    visible,
    onClose,
    transactionToEdit,
    onSaveSuccess,
}) => {
    const { colors, isDarkMode } = useAppTheme();

    const [formData, setFormData] = useState({
        tipo: 'despesa' as 'receita' | 'despesa',
        categoria: 'Outros',
        valor: '',
        data: new Date(),
        nota: '',
        metodo: 'conta' as 'conta' | 'cartao',
        pagamentoId: '',
        parcelas: '1',
    });

    const [accounts, setAccounts] = useState<Conta[]>([]);
    const [cards, setCards] = useState<CartaoCredito[]>([]);
    const [categories, setCategories] = useState<CategoriaPlanejamento[]>([]);
    const [customCategory, setCustomCategory] = useState('');

    useEffect(() => {
        if (visible) {
            loadMethods();
            financeService.getPlanningCategories().then(setCategories);

            if (transactionToEdit) {
                // Ensure date is valid, fallback to today
                let parsedDate = new Date();
                if (transactionToEdit.data) {
                    const d = new Date(transactionToEdit.data);
                    if (!isNaN(d.getTime())) {
                        parsedDate = d;
                    }
                }

                // Add T12:00:00 to avoid timezone issues shifting days
                // If the string is YYYY-MM-DD
                if (transactionToEdit.data && transactionToEdit.data.length === 10) {
                    const [y, m, d] = transactionToEdit.data.split('-').map(Number);
                    parsedDate = new Date(y, m - 1, d);
                }

                setFormData({
                    tipo: transactionToEdit.tipo,
                    categoria: transactionToEdit.categoria || 'Outros',
                    valor: transactionToEdit.valor.toFixed(2).replace('.', ','),
                    data: parsedDate,
                    nota: transactionToEdit.nota || '',
                    metodo: transactionToEdit.cartao_id ? 'cartao' : 'conta',
                    pagamentoId: transactionToEdit.cartao_id || transactionToEdit.conta_id || '',
                    parcelas: (transactionToEdit.parcelas_total || 1).toString(),
                });
            } else {
                setFormData({
                    tipo: 'despesa',
                    categoria: 'Outros',
                    valor: '',
                    data: new Date(),
                    nota: '',
                    metodo: 'conta',
                    pagamentoId: '',
                    parcelas: '1',
                });
            }
        }
    }, [visible, transactionToEdit]);

    const loadMethods = async () => {
        const accs = await financeService.getAccounts();
        const crds = await financeService.getCards();
        setAccounts(accs);
        setCards(crds);
        if (!transactionToEdit) {
            if (accs.length > 0) {
                setFormData(p => ({ ...p, pagamentoId: accs[0].id }));
            }
        }
    };

    const handleSave = async () => {
        const valorNum = parseFloat(formData.valor.replace(',', '.'));
        const parcelasNum = parseInt(formData.parcelas) || 1;

        if (isNaN(valorNum) || valorNum <= 0) {
            Alert.alert("Erro", "Por favor, insira um valor válido.");
            return;
        }

        try {
            // Format date to YYYY-MM-DD safely
            const year = formData.data.getFullYear();
            const month = String(formData.data.getMonth() + 1).padStart(2, '0');
            const day = String(formData.data.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const data: any = {
                tipo: formData.tipo,
                categoria: customCategory || formData.categoria,
                valor: valorNum,
                data: dateStr,
                nota: formData.nota,
                planejado: false,
                parcelas_total: parcelasNum,
            };

            if (formData.metodo === 'cartao') {
                data.cartao_id = formData.pagamentoId;
            } else {
                data.conta_id = formData.pagamentoId;
            }

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

    const filteredCategories = categories.length > 0 ? categories : [{ id: '1', nome: 'Outros', tipo: 'despesa', sistema: true, created_at: '' }];

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
                            onPress={() => setFormData(p => ({ ...p, tipo: 'receita' }))}
                            style={[styles.typeButton, formData.tipo === 'receita' && { backgroundColor: colors.success + '20', borderColor: colors.success }]}
                        >
                            <MaterialCommunityIcons name="arrow-up-circle" size={24} color={formData.tipo === 'receita' ? colors.success : colors.textSecondary} />
                            <Text style={[styles.typeButtonText, { color: formData.tipo === 'receita' ? colors.success : colors.textSecondary }]}>Receita</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setFormData(p => ({ ...p, tipo: 'despesa' }))}
                            style={[styles.typeButton, formData.tipo === 'despesa' && { backgroundColor: colors.error + '20', borderColor: colors.error }]}
                        >
                            <MaterialCommunityIcons name="arrow-down-circle" size={24} color={formData.tipo === 'despesa' ? colors.error : colors.textSecondary} />
                            <Text style={[styles.typeButtonText, { color: formData.tipo === 'despesa' ? colors.error : colors.textSecondary }]}>Despesa</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Valor</Text>
                            <CurrencyInput
                                value={formData.valor}
                                onValueChange={(val) => setFormData(p => ({ ...p, valor: val }))}
                                placeholder="0,00"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <DatePickerInput
                                label="Data"
                                value={formData.data}
                                onChange={(date) => setFormData(p => ({ ...p, data: date }))}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Descrição</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                value={formData.nota}
                                onChangeText={(text) => setFormData(p => ({ ...p, nota: text }))}
                                placeholder="Ex: Supermercado"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Conta / Cartão</Text>
                            <View style={styles.paymentSelector}>
                                <TouchableOpacity
                                    style={[styles.payMethodBtn, formData.metodo === 'conta' && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }]}
                                    onPress={() => setFormData(p => ({ ...p, metodo: 'conta', pagamentoId: accounts[0]?.id || '' }))}
                                >
                                    <Text style={{ color: formData.metodo === 'conta' ? colors.primary : colors.textSecondary }}>Conta/Vale</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.payMethodBtn, formData.metodo === 'cartao' && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }]}
                                    onPress={() => setFormData(p => ({ ...p, metodo: 'cartao', pagamentoId: cards[0]?.id || '' }))}
                                >
                                    <Text style={{ color: formData.metodo === 'cartao' ? colors.primary : colors.textSecondary }}>Cartão de Crédito</Text>
                                </TouchableOpacity>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.methodList}>
                                {formData.metodo === 'conta' ? accounts.map(acc => (
                                    <TouchableOpacity
                                        key={acc.id}
                                        style={[styles.methodChip, formData.pagamentoId === acc.id && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                                        onPress={() => setFormData(p => ({ ...p, pagamentoId: acc.id }))}
                                    >
                                        <Text style={{ color: formData.pagamentoId === acc.id ? 'white' : colors.text }}>
                                            {acc.nome} {acc.tipo !== 'carteira' ? `(${acc.tipo === 'vale_alimentacao' ? 'VA' : 'VR'})` : ''}
                                        </Text>
                                    </TouchableOpacity>
                                )) : cards.map(c => (
                                    <TouchableOpacity
                                        key={c.id}
                                        style={[styles.methodChip, formData.pagamentoId === c.id && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                                        onPress={() => setFormData(p => ({ ...p, pagamentoId: c.id }))}
                                    >
                                        <Text style={{ color: formData.pagamentoId === c.id ? 'white' : colors.text }}>{c.nome}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {formData.metodo === 'cartao' && (
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Parcelas</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                    value={formData.parcelas}
                                    onChangeText={(text) => setFormData(p => ({ ...p, parcelas: text }))}
                                    placeholder="1"
                                    keyboardType="numeric"
                                />
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Categoria</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
                                {filteredCategories.map(cat => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        onPress={() => {
                                            setFormData(p => ({ ...p, categoria: cat.nome }));
                                            setCustomCategory('');
                                        }}
                                        style={[
                                            styles.categoryChip,
                                            { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, borderColor: formData.categoria === cat.nome && !customCategory ? colors.primary : colors.border }
                                        ]}
                                    >
                                        <Text style={[styles.categoryText, { color: formData.categoria === cat.nome && !customCategory ? colors.primary : colors.textSecondary }]}>{cat.nome}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <TextInput
                                style={[styles.input, { height: 44, marginTop: 8, fontSize: 14, backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                value={customCategory}
                                onChangeText={setCustomCategory}
                                placeholder="Ou digite uma nova categoria..."
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
    typeSelector: { flexDirection: 'row', gap: 12 },
    typeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: 'transparent', gap: 8, backgroundColor: '#f5f5f5' },
    typeButtonText: { fontWeight: 'bold' },
    form: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
    input: { height: 56, borderRadius: 16, paddingHorizontal: 16, fontSize: 16, borderWidth: 1 },
    categoryList: { flexDirection: 'row' },
    categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
    categoryText: { fontSize: 14, fontWeight: '600' },
    paymentSelector: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    payMethodBtn: { paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderRadius: 8 },
    methodList: { flexDirection: 'row' },
    methodChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginRight: 8 },
});
