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
import { LancamentoFinanceiro, Conta, CartaoCredito, CategoriaFinanceira } from '@/models';
import { CurrencyInput } from '../ui/CurrencyInput';
import { DatePickerInput } from '../ui/DatePickerInput';
import { CategoryManagerModal } from './CategoryManagerModal';

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
        categoria_id: '',
        categoria_nome: 'Outros',
        categoria_icone: 'tag-outline',
        categoria_cor: '#666',
        valor: '',
        data: new Date(),
        nota: '',
        metodo: 'conta' as 'conta' | 'cartao',
        pagamentoId: '',
        parcelas: '1',
    });

    const [accounts, setAccounts] = useState<Conta[]>([]);
    const [cards, setCards] = useState<CartaoCredito[]>([]);
    const [installmentType, setInstallmentType] = useState<'total' | 'parcela'>('total');

    const [isCategoryPickerVisible, setIsCategoryPickerVisible] = useState(false);

    // Effect for loading data
    useEffect(() => {
        if (visible) {
            loadMethods();
        }
    }, [visible]);

    // Effect for form initialization (Reset or Edit Mode)
    useEffect(() => {
        if (visible) {
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
                if (transactionToEdit.data && transactionToEdit.data.length === 10) {
                    const [y, m, d] = transactionToEdit.data.split('-').map(Number);
                    parsedDate = new Date(y, m - 1, d);
                }

                // Try to find category details if ID exists, or use legacy name
                let catDetails = {
                    id: transactionToEdit.categoria_id || '',
                    nome: transactionToEdit.categoria || 'Outros',
                    icone: 'tag-outline',
                    cor: '#666'
                };

                if (transactionToEdit.categoria_id) {
                    financeService.getCategories().then(cats => {
                        const found = cats.find(c => c.id === transactionToEdit.categoria_id);
                        if (found) {
                            setFormData(prev => ({
                                ...prev,
                                categoria_nome: found.nome,
                                categoria_icone: found.icone,
                                categoria_cor: found.cor
                            }));
                        }
                    });
                }

                setFormData({
                    tipo: transactionToEdit.tipo,
                    categoria_id: catDetails.id,
                    categoria_nome: catDetails.nome,
                    categoria_icone: catDetails.icone,
                    categoria_cor: catDetails.cor,
                    valor: transactionToEdit.valor.toFixed(2).replace('.', ','),
                    data: parsedDate,
                    nota: transactionToEdit.nota || '',
                    metodo: transactionToEdit.cartao_id ? 'cartao' : 'conta',
                    pagamentoId: transactionToEdit.cartao_id || transactionToEdit.conta_id || '',
                    parcelas: (transactionToEdit.parcelas_total || 1).toString(),
                });
                setInstallmentType('parcela'); // Editing usually means we see the installment value
            } else {
                // RESET FORM
                setFormData({
                    tipo: 'despesa',
                    categoria_id: '',
                    categoria_nome: 'Selecione...',
                    categoria_icone: 'tag-plus-outline',
                    categoria_cor: colors.textSecondary,
                    valor: '',
                    data: new Date(),
                    nota: '',
                    metodo: 'conta',
                    pagamentoId: accounts.length > 0 ? accounts[0].id : '',
                    parcelas: '1',
                });
                setInstallmentType('total');
            }
        }
    }, [visible, transactionToEdit, accounts]);

    const loadMethods = async () => {
        const accs = await financeService.getAccounts();
        const crds = await financeService.getCards();
        setAccounts(accs);
        setCards(crds);
    };

    const handleSave = async () => {
        const rawValue = parseFloat(formData.valor.replace(',', '.'));
        const parcelasNum = parseInt(formData.parcelas) || 1;

        if (isNaN(rawValue) || rawValue <= 0) {
            Alert.alert("Erro", "Por favor, insira um valor válido.");
            return;
        }

        if (!formData.categoria_id && formData.categoria_nome === 'Selecione...') {
            Alert.alert("Erro", "Selecione uma categoria.");
            return;
        }

        try {
            // Determine final installment value passed to service
            let finalInstallmentValue = rawValue;
            if (formData.metodo === 'cartao' && parcelasNum > 1 && installmentType === 'total') {
                finalInstallmentValue = rawValue / parcelasNum;
            }

            const year = formData.data.getFullYear();
            const month = String(formData.data.getMonth() + 1).padStart(2, '0');
            const day = String(formData.data.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const data: any = {
                tipo: formData.tipo,
                categoria_id: formData.categoria_id,
                // Fallback for legacy display
                categoria: formData.categoria_nome,
                valor: finalInstallmentValue,
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
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Categoria</Text>
                            <TouchableOpacity
                                style={[styles.selector, { borderColor: colors.border, backgroundColor: colors.surface }]}
                                onPress={() => setIsCategoryPickerVisible(true)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <View style={{ backgroundColor: (formData.categoria_cor) + '20', padding: 8, borderRadius: 8 }}>
                                        <MaterialCommunityIcons name={formData.categoria_icone as any} size={20} color={formData.categoria_cor} />
                                    </View>
                                    <Text style={[styles.selectorText, { color: colors.text }]}>{formData.categoria_nome}</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
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
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <TextInput
                                        style={[styles.input, { flex: 1, backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                        value={formData.parcelas}
                                        onChangeText={(text) => setFormData(p => ({ ...p, parcelas: text }))}
                                        placeholder="1"
                                        keyboardType="numeric"
                                    />
                                </View>
                                {parseInt(formData.parcelas) > 1 && (
                                    <View style={{ flexDirection: 'row', marginTop: 8, backgroundColor: isDarkMode ? colors.gray800 : '#e5e5e5', borderRadius: 8, padding: 2 }}>
                                        <TouchableOpacity
                                            style={{ flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 6, backgroundColor: installmentType === 'total' ? (isDarkMode ? '#334155' : 'white') : 'transparent' }}
                                            onPress={() => setInstallmentType('total')}
                                        >
                                            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>Valor Total</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 6, backgroundColor: installmentType === 'parcela' ? (isDarkMode ? '#334155' : 'white') : 'transparent' }}
                                            onPress={() => setInstallmentType('parcela')}
                                        >
                                            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>Valor da Parcela</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </ScrollView>

                <CategoryManagerModal
                    visible={isCategoryPickerVisible}
                    onClose={() => setIsCategoryPickerVisible(false)}
                    onSelect={(cat) => {
                        setFormData(p => ({
                            ...p,
                            categoria_id: cat.id,
                            categoria_nome: cat.nome,
                            categoria_icone: cat.icone,
                            categoria_cor: cat.cor
                        }));
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
    scrollContent: { padding: 24, gap: 24 },
    typeSelector: { flexDirection: 'row', gap: 12 },
    typeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: 'transparent', gap: 8, backgroundColor: '#f5f5f5' },
    typeButtonText: { fontWeight: 'bold' },
    form: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
    input: { height: 56, borderRadius: 16, paddingHorizontal: 16, fontSize: 16, borderWidth: 1 },
    selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1 },
    selectorText: { fontSize: 16, fontWeight: '500' },
    paymentSelector: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    payMethodBtn: { paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderRadius: 8 },
    methodList: { flexDirection: 'row' },
    methodChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginRight: 8 },
});
