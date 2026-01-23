import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Alert, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { financeService } from '@/services/FinanceService';
import { CategoriaFinanceira } from '@/models';

interface CategoryManagerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect?: (category: CategoriaFinanceira) => void;
}

export function CategoryManagerModal({ visible, onClose, onSelect }: CategoryManagerModalProps) {
    const { colors, isDarkMode } = useAppTheme();
    const [categories, setCategories] = useState<CategoriaFinanceira[]>([]);
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');

    // Form State
    const [name, setName] = useState('');
    const [type, setType] = useState<'receita' | 'despesa'>('despesa');
    const [isPermanent, setIsPermanent] = useState(true);
    const [selectedIcon, setSelectedIcon] = useState('tag-outline');
    const [selectedColor, setSelectedColor] = useState('#2563EB');

    const icons = ['tag-outline', 'food', 'car', 'home', 'shopping', 'medical-bag', 'school', 'gamepad-variant', 'airplane', 'dog', 'bank', 'cash', 'chart-line', 'gift'];
    const colorsList = ['#2563EB', '#DC2626', '#16A34A', '#D97706', '#9333EA', '#DB2777', '#0891B2', '#4F46E5', '#EA580C', '#65A30D'];

    useEffect(() => {
        if (visible) {
            loadCategories();
            setViewMode('list');
            resetForm();
        }
    }, [visible]);

    const loadCategories = async () => {
        const cats = await financeService.getCategories();
        setCategories(cats.filter(c => !c.arquivada));
    };

    const resetForm = () => {
        setName('');
        setType('despesa');
        setIsPermanent(true);
        setSelectedIcon('tag-outline');
        setSelectedColor('#2563EB');
    };

    const handleCreate = async () => {
        if (!name.trim()) {
            Alert.alert('Erro', 'Nome da categoria é obrigatório');
            return;
        }

        try {
            await financeService.createCategory({
                nome: name,
                tipo: type,
                is_permanente: isPermanent,
                icone: selectedIcon,
                cor: selectedColor
            });
            await loadCategories();
            setViewMode('list');
        } catch (error) {
            Alert.alert('Erro', 'Falha ao criar categoria');
        }
    };

    const handleDelete = async (id: string) => {
        Alert.alert('Excluir', 'Tem certeza? Categorias arquivadas não aparecerão mais.', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    await financeService.deleteCategory(id);
                    loadCategories();
                }
            }
        ]);
    };

    const renderItem = ({ item }: { item: CategoriaFinanceira }) => (
        <TouchableOpacity
            style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => {
                if (onSelect) {
                    onSelect(item);
                    onClose(); // Auto close on select
                }
            }}
        >
            <View style={[styles.iconBox, { backgroundColor: item.cor + '20' }]}>
                <MaterialCommunityIcons name={item.icone as any} size={24} color={item.cor} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.itemName, { color: colors.text }]}>{item.nome}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Text style={[styles.itemType, { color: item.tipo === 'receita' ? colors.success : colors.error }]}>
                        {item.tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </Text>
                    <Text style={[styles.itemType, { color: colors.textSecondary }]}>
                        {item.is_permanente ? 'Permanente' : 'Mensal'}
                    </Text>
                </View>
            </View>
            {!onSelect && (
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ padding: 8 }}>
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {viewMode === 'list' ? 'Categorias' : 'Nova Categoria'}
                    </Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {viewMode === 'list' ? (
                    <>
                        <FlatList
                            data={categories}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={{ padding: 24, gap: 12 }}
                            ListEmptyComponent={
                                <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 40 }}>
                                    Nenhuma categoria encontrada.
                                </Text>
                            }
                        />
                        <View style={{ padding: 24, paddingBottom: 40 }}>
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: colors.primary }]}
                                onPress={() => setViewMode('create')}
                            >
                                <Text style={styles.btnText}>Criar Nova Categoria</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <ScrollView contentContainerStyle={{ padding: 24 }}>
                        <View style={styles.formGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Nome</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                value={name}
                                onChangeText={setName}
                                placeholder="Ex: Mercado, Aluguel..."
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Tipo</Text>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <TouchableOpacity
                                    style={[styles.typeBtn, type === 'receita' && { backgroundColor: colors.success + '20', borderColor: colors.success }]}
                                    onPress={() => setType('receita')}
                                >
                                    <Text style={{ color: type === 'receita' ? colors.success : colors.textSecondary, fontWeight: 'bold' }}>Receita</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.typeBtn, type === 'despesa' && { backgroundColor: colors.error + '20', borderColor: colors.error }]}
                                    onPress={() => setType('despesa')}
                                >
                                    <Text style={{ color: type === 'despesa' ? colors.error : colors.textSecondary, fontWeight: 'bold' }}>Despesa</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Recorrência</Text>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <TouchableOpacity
                                    style={[styles.typeBtn, isPermanent && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                                    onPress={() => setIsPermanent(true)}
                                >
                                    <MaterialCommunityIcons name="infinite" size={20} color={isPermanent ? colors.primary : colors.textSecondary} style={{ marginRight: 8 }} />
                                    <Text style={{ color: isPermanent ? colors.primary : colors.textSecondary, fontWeight: 'bold' }}>Permanente</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.typeBtn, !isPermanent && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                                    onPress={() => setIsPermanent(false)}
                                >
                                    <MaterialCommunityIcons name="calendar-month" size={20} color={!isPermanent ? colors.primary : colors.textSecondary} style={{ marginRight: 8 }} />
                                    <Text style={{ color: !isPermanent ? colors.primary : colors.textSecondary, fontWeight: 'bold' }}>Apenas este Mês</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>
                                {isPermanent
                                    ? "Categorias permanentes aparecem em todos os meses."
                                    : "Categorias mensais são úteis para gastos pontuais (Ex: Viagem, Reforma)."}
                            </Text>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Ícone</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                                {icons.map(icon => (
                                    <TouchableOpacity
                                        key={icon}
                                        style={[styles.iconOption, selectedIcon === icon && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                                        onPress={() => setSelectedIcon(icon)}
                                    >
                                        <MaterialCommunityIcons name={icon as any} size={24} color={selectedIcon === icon ? 'white' : colors.text} />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Cor</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                                {colorsList.map(color => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[styles.colorOption, { backgroundColor: color }, selectedColor === color && { borderWidth: 2, borderColor: colors.text }]}
                                        onPress={() => setSelectedColor(color)}
                                    />
                                ))}
                            </ScrollView>
                        </View>

                        <View style={{ gap: 12, marginTop: 24 }}>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={handleCreate}>
                                <Text style={styles.btnText}>Salvar Categoria</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border }]} onPress={() => setViewMode('list')}>
                                <Text style={[styles.btnText, { color: colors.text }]}>Voltar</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
    title: { fontSize: 20, fontWeight: 'bold' },
    closeBtn: { padding: 4 },
    itemCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 0, gap: 16 },
    iconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    itemName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    itemType: { fontSize: 12, fontWeight: '600' },
    btn: { padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    formGroup: { marginBottom: 24 },
    label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { padding: 16, borderRadius: 12, borderWidth: 1, fontSize: 16 },
    typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'transparent', backgroundColor: 'rgba(0,0,0,0.05)' },
    iconOption: { width: 48, height: 48, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
    colorOption: { width: 48, height: 48, borderRadius: 24 },
});
