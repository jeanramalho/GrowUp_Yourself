import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { Compromisso } from '@/models';

interface CompromissoDetailModalProps {
    visible: boolean;
    onClose: () => void;
    compromisso: Compromisso | null;
}

export function CompromissoDetailModal({ visible, onClose, compromisso }: CompromissoDetailModalProps) {
    const { colors, isDarkMode, shadows } = useAppTheme();

    if (!compromisso) return null;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const getEventIcon = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes('café') || t.includes('cafe')) return 'coffee';
        if (t.includes('jantar') || t.includes('almoço') || t.includes('comida')) return 'silverware-fork-knife';
        if (t.includes('reunião') || t.includes('trampo') || t.includes('trabalho')) return 'briefcase';
        if (t.includes('presente') || t.includes('aniversário')) return 'gift';
        if (t.includes('❤️') || t.includes('amor') || t.includes('romântico')) return 'heart';
        return 'calendar-check';
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    <View style={styles.header}>
                        <View style={[styles.iconBox, { backgroundColor: colors.blue300 + '20' }]}>
                            <MaterialCommunityIcons name={getEventIcon(compromisso.titulo) as any} size={32} color={colors.blue300} />
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <MaterialCommunityIcons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={[styles.title, { color: colors.text }]}>{compromisso.titulo}</Text>

                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="account-outline" size={20} color={colors.textSecondary} />
                            <Text style={[styles.infoText, { color: colors.text }]}>
                                {compromisso.com_quem || 'Alguém especial'}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="calendar-outline" size={20} color={colors.textSecondary} />
                            <Text style={[styles.infoText, { color: colors.text }]}>
                                {formatDate(compromisso.data_hora)}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="clock-outline" size={20} color={colors.textSecondary} />
                            <Text style={[styles.infoText, { color: colors.text }]}>
                                {formatTime(compromisso.data_hora)}
                            </Text>
                        </View>

                        {compromisso.preparacao && (
                            <View style={[styles.noteContainer, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100 }]}>
                                <Text style={[styles.noteLabel, { color: colors.textSecondary }]}>Notas / Preparação</Text>
                                <Text style={[styles.noteText, { color: colors.text }]}>{compromisso.preparacao}</Text>
                            </View>
                        )}
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.doneBtn, { backgroundColor: colors.primary }]}
                        onPress={onClose}
                    >
                        <Text style={styles.doneBtnText}>Entendido</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        padding: 4,
    },
    content: {
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoText: {
        fontSize: 16,
    },
    noteContainer: {
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
        gap: 8,
    },
    noteLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    noteText: {
        fontSize: 14,
        lineHeight: 20,
    },
    doneBtn: {
        marginTop: 32,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    doneBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
