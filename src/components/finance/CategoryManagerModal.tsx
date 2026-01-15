import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { financeService } from '@/services/FinanceService';
import { CategoriaPlanejamento } from '@/models';

interface CategoryManagerModalProps {
    visible: boolean;
    onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({ visible, onClose }) => {
    const { colors, isDarkMode } = useAppTheme();

    const [categories, setCategories] = useState<CategoriaPlanejamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (visible) {
            loadCategories();
        }
    }, [visible]);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const list = await financeService.getPlanningCategories();
            setCategories(list);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao carregar categorias');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            // Default to expense ('despesa') for now, or could infer
            await financeService.createPlanningCategory({
                nome: newCategoryName.trim(),
                tipo: 'despesa', // Defaulting to expense as most user custom cats are expenses
                sistema: false
            });
            setNewCategoryName('');
            setIsAdding(false);
            loadCategories();
        } catch (error) {
            Alert.alert('Erro', 'Falha ao criar categoria');
        }
    };

    const handleDelete = (id: string, name: string) => {
        Alert.alert('Excluir Categoria', `Deseja excluir "${name}"?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir', style: 'destructive', onPress: async () => {
                    await financeService.deletePlanningCategory(id);
                    loadCategories();
                }
            }
        ]);
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>Gerenciar Categorias</Text>
                    <View style={{ width: 32 }} />
                </View>

                <View style={styles.content}>
                    {isAdding ? (
                        <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: isDarkMode ? colors.surface : '#f5f5f5' }]}>
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                value={newCategoryName}
                                onChangeText={setNewCategoryName}
                                placeholder="Nome da nova categoria"
                                placeholderTextColor={colors.textSecondary}
                                autoFocus
                            />
                            <TouchableOpacity onPress={handleAddCategory} style={styles.actionBtn}>
                                <MaterialCommunityIcons name="check" size={24} color={colors.success} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsAdding(false)} style={styles.actionBtn}>
                                <MaterialCommunityIcons name="close" size={24} color={colors.error} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: colors.primary + '20' }]}
                            onPress={() => setIsAdding(true)}
                        >
                            <MaterialCommunityIcons name="plus" size={24} color={colors.primary} />
                            <Text style={[styles.addButtonText, { color: colors.primary }]}>Adicionar Nova Categoria</Text>
                        </TouchableOpacity>
                    )}

                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                    ) : (
                        <FlatList
                            data={categories}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ gap: 12, paddingVertical: 16 }}
                            renderItem={({ item }) => (
                                <View style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <Text style={[styles.itemText, { color: colors.text }]}>{item.nome}</Text>
                                    {!item.sistema && (
                                        <TouchableOpacity onPress={() => handleDelete(item.id, item.nome)}>
                                            <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.error} />
                                        </TouchableOpacity>
                                    )}
                                    {item.sistema && (
                                        <MaterialCommunityIcons name="lock-outline" size={16} color={colors.textSecondary} />
                                    )}
                                </View>
                            )}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    closeButton: { padding: 4 },
    title: { fontSize: 18, fontWeight: 'bold' },
    content: { flex: 1, padding: 20 },
    addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8, marginBottom: 16 },
    addButtonText: { fontWeight: 'bold', fontSize: 16 },
    inputRow: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
    input: { flex: 1, paddingHorizontal: 12, fontSize: 16, height: 40 },
    actionBtn: { padding: 8 },
    item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, borderWidth: 1 },
    itemText: { fontSize: 16, fontWeight: '500' },
});
