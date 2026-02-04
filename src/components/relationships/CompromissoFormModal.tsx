import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { relationshipService } from '@/services/RelationshipService';
import { Compromisso } from '@/models';
import { DatePickerInput } from '../ui/DatePickerInput';

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
    const [note, setNote] = useState('');
    const [type, setType] = useState('Encontro'); // Default type

    useEffect(() => {
        if (visible) {
            if (compromissoToEdit) {
                setTitle(compromissoToEdit.titulo);
                setPerson(compromissoToEdit.com_quem || '');
                setDate(new Date(compromissoToEdit.data_hora));
                setNote(compromissoToEdit.preparacao || '');
                // Status could be used for 'type' or similar, but for now we follow the design
                // which has Weekly, Monthly etc. Let's keep it simple.
            } else {
                resetForm();
            }
        }
    }, [visible, compromissoToEdit]);

    const resetForm = () => {
        setTitle('');
        setPerson('');
        setDate(new Date());
        setNote('');
        setType('Encontro');
    };

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Erro', 'O título é obrigatório.');
            return;
        }

        try {
            const payload: Omit<Compromisso, 'id'> = {
                titulo: title.trim(),
                com_quem: person.trim() || null,
                data_hora: date.toISOString(),
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
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
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

                    <View>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Quando?</Text>
                        <DatePickerInput
                            value={date}
                            onChange={setDate}
                        />
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
});
