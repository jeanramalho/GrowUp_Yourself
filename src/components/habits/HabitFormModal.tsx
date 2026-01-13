import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { habitService } from '@/services/HabitService';
import { Meta } from '@/models';

interface HabitFormModalProps {
    visible: boolean;
    onClose: () => void;
    pilarId: string;
    habitToEdit?: Meta | null;
    onSaveSuccess: () => void;
}

const DAYS = [
    { label: 'D', value: 1 << 0, fullName: 'Domingo' },
    { label: 'S', value: 1 << 1, fullName: 'Segunda' },
    { label: 'T', value: 1 << 2, fullName: 'Terça' },
    { label: 'Q', value: 1 << 3, fullName: 'Quarta' },
    { label: 'Q', value: 1 << 4, fullName: 'Quinta' },
    { label: 'S', value: 1 << 5, fullName: 'Sexta' },
    { label: 'S', value: 1 << 6, fullName: 'Sábado' },
];

export const HabitFormModal: React.FC<HabitFormModalProps> = ({
    visible,
    onClose,
    pilarId,
    habitToEdit,
    onSaveSuccess,
}) => {
    const insets = useSafeAreaInsets();
    const { colors, isDarkMode, spacing } = useAppTheme();

    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        dias_semana: 0,
        duracao_minutos: '30',
        horario_sugerido: '',
    });

    useEffect(() => {
        if (visible) {
            if (habitToEdit) {
                setFormData({
                    titulo: habitToEdit.titulo,
                    descricao: habitToEdit.descricao || '',
                    dias_semana: habitToEdit.dias_semana,
                    duracao_minutos: habitToEdit.duracao_minutos.toString(),
                    horario_sugerido: habitToEdit.horario_sugerido || '',
                });
            } else {
                setFormData({
                    titulo: '',
                    descricao: '',
                    dias_semana: 127, // All days by default
                    duracao_minutos: '30',
                    horario_sugerido: '',
                });
            }
        }
    }, [visible, habitToEdit]);

    const handleToggleDay = (value: number) => {
        setFormData(prev => ({
            ...prev,
            dias_semana: prev.dias_semana ^ value
        }));
    };

    const handleSave = async () => {
        if (!formData.titulo.trim()) {
            Alert.alert("Erro", "Por favor, insira um título para o hábito.");
            return;
        }
        if (formData.dias_semana === 0) {
            Alert.alert("Erro", "Selecione pelo menos um dia da semana.");
            return;
        }

        try {
            const data = {
                pilar_id: pilarId,
                titulo: formData.titulo,
                descricao: formData.descricao,
                dias_semana: formData.dias_semana,
                duracao_minutos: parseInt(formData.duracao_minutos) || 0,
                horario_sugerido: formData.horario_sugerido || null,
                recorrente: true,
            };

            if (habitToEdit) {
                // Update logic (to be added to service if needed, or use repository directly)
                // For now, let's just implement creation to fulfill initial request
                // await habitService.updateHabit(habitToEdit.id, data);
            } else {
                await habitService.createHabit(data);
            }

            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error("Save habit error:", error);
            Alert.alert("Erro", "Não foi possível salvar o hábito.");
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
                        {habitToEdit ? 'Editar Hábito' : 'Novo Hábito'}
                    </Text>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={[styles.saveButtonText, { color: colors.primary }]}>Salvar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Título</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                value={formData.titulo}
                                onChangeText={(text) => setFormData(p => ({ ...p, titulo: text }))}
                                placeholder="Ex: Meditação Matinal"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Dias da Semana</Text>
                            <View style={styles.daysContainer}>
                                {DAYS.map((day) => {
                                    const isSelected = (formData.dias_semana & day.value) !== 0;
                                    return (
                                        <TouchableOpacity
                                            key={day.value}
                                            onPress={() => handleToggleDay(day.value)}
                                            style={[
                                                styles.dayCircle,
                                                {
                                                    backgroundColor: isSelected ? colors.primary : (isDarkMode ? colors.gray800 : colors.gray100),
                                                    borderColor: isSelected ? colors.primary : colors.border
                                                }
                                            ]}
                                        >
                                            <Text style={[styles.dayText, { color: isSelected ? 'white' : colors.text }]}>
                                                {day.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Duração (minutos)</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                    value={formData.duracao_minutos}
                                    onChangeText={(text) => setFormData(p => ({ ...p, duracao_minutos: text }))}
                                    keyboardType="numeric"
                                    placeholder="30"
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                            <View style={{ width: spacing.m }} />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Horário (opcional)</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                    value={formData.horario_sugerido}
                                    onChangeText={(text) => setFormData(p => ({ ...p, horario_sugerido: text }))}
                                    placeholder="07:00"
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Descrição (opcional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, color: colors.text, borderColor: colors.border }]}
                                value={formData.descricao}
                                onChangeText={(text) => setFormData(p => ({ ...p, descricao: text }))}
                                placeholder="Adicione notas sobre este hábito..."
                                placeholderTextColor={colors.textSecondary}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    closeButton: {
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveButton: {
        padding: 4,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 24,
    },
    form: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
        marginBottom: 4,
    },
    input: {
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    textArea: {
        height: 100,
        paddingTop: 16,
        textAlignVertical: 'top',
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    dayCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    dayText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
    }
});
