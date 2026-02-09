import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, ScrollView, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { relationshipService } from '@/services/RelationshipService';
import { Compromisso } from '@/models';
import { DatePickerInput } from '../ui/DatePickerInput';
import { TimePickerInput } from '../ui/TimePickerInput';

interface CompromissoFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
    compromissoToEdit?: Compromisso | null;
}

export function CompromissoFormModal({ visible, onClose, onSaveSuccess, compromissoToEdit }: CompromissoFormModalProps) {
    const { colors, isDarkMode } = useAppTheme();

    const [title, setTitle] = useState('');
    const [person, setPerson] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [isAllDay, setIsAllDay] = useState(false);
    const [note, setNote] = useState('');

    useEffect(() => {
        if (visible) {
            if (compromissoToEdit) {
                setTitle(compromissoToEdit.titulo);
                setPerson(compromissoToEdit.com_quem || '');
                const d = new Date(compromissoToEdit.data_hora);
                setDate(d);
                setTime(d);
                setIsAllDay(!!compromissoToEdit.is_all_day);
                setNote(compromissoToEdit.preparacao || '');
            } else {
                resetForm();
            }
        }
    }, [visible, compromissoToEdit]);

    const resetForm = () => {
        setTitle('');
        setPerson('');
        setDate(new Date());
        setTime(new Date());
        setIsAllDay(false);
        setNote('');
    };

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Erro', 'O título é obrigatório.');
            return;
        }

        try {
            // Combine date and time
            const finalDate = new Date(date);
            if (isAllDay) {
                finalDate.setHours(0, 0, 0, 0);
            } else {
                finalDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
            }

            const payload: Omit<Compromisso, 'id'> = {
                titulo: title.trim(),
                com_quem: person.trim() || null,
                data_hora: finalDate.toISOString(),
                is_all_day: isAllDay,
                preparacao: note.trim() || null,
                status: 'pendente'
            };

            if (compromissoToEdit) {
                await relationshipService.updateCompromisso(compromissoToEdit.id, payload);
            } else {
                await relationshipService.createCompromisso(payload);
            }

            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Falha ao salvar compromisso.');
        }
    };

    const handleDelete = () => {
        if (!compromissoToEdit) return;

        Alert.alert('Excluir Encontro', 'Deseja realmente excluir este encontro?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    await relationshipService.deleteCompromisso(compromissoToEdit.id);
                    onSaveSuccess();
                    onClose();
                }
            }
        ]);
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, { color: colors.text }]}>
                            {compromissoToEdit ? 'Editar Encontro' : 'Novo Encontro'}
                        </Text>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                            Gerencie seus momentos importantes
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        {compromissoToEdit && (
                            <TouchableOpacity onPress={handleDelete} style={styles.closeBtn}>
                                <MaterialCommunityIcons name="delete-outline" size={24} color={colors.error} />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
                    <View>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>O que vão fazer?</Text>
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Ex: Jantar, Café, Reunião..."
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>

                    <View>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Com quem?</Text>
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                            value={person}
                            onChangeText={setPerson}
                            placeholder="Nome da pessoa"
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>

                    <View style={styles.allDayRow}>
                        <Text style={[styles.label, { color: colors.textSecondary, marginBottom: 0 }]}>O dia todo</Text>
                        <Switch
                            value={isAllDay}
                            onValueChange={setIsAllDay}
                            trackColor={{ false: colors.border, true: colors.primary + '50' }}
                            thumbColor={isAllDay ? colors.primary : colors.gray300}
                        />
                    </View>

                    <View style={styles.dateTimeContainer}>
                        <DatePickerInput
                            label="Data"
                            value={date}
                            onChange={setDate}
                        />
                        {!isAllDay && (
                            <TimePickerInput
                                label="Horário"
                                value={time}
                                onChange={setTime}
                            />
                        )}
                    </View>

                    <View>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Notas / Preparação</Text>
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: colors.border, minHeight: 80, textAlignVertical: 'top' }]}
                            value={note}
                            onChangeText={setNote}
                            placeholder="Ex: Levar presente, reservar mesa..."
                            placeholderTextColor={colors.textSecondary}
                            multiline
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                        onPress={handleSave}
                    >
                        <Text style={styles.saveBtnText}>Salvar Encontro</Text>
                    </TouchableOpacity>
                </ScrollView>
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
    input: { fontSize: 16, padding: 16, borderRadius: 16, borderWidth: 1 },
    saveBtn: { padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 24 },
    saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    allDayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dateTimeContainer: { flexDirection: 'row', gap: 16 },
});
