import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { useFocusEffect } from 'expo-router';
import { relationshipService } from '@/services/RelationshipService';
import { Compromisso } from '@/models';
import { CompromissoDetailModal } from '../relationships/CompromissoDetailModal';

export function RelationshipSummaryCard() {
    const { colors, shadows, isDarkMode } = useAppTheme();
    const [upcoming, setUpcoming] = useState<Compromisso[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompromisso, setSelectedCompromisso] = useState<Compromisso | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const loadUpcoming = useCallback(async () => {
        try {
            setLoading(true);
            const data = await relationshipService.getUpcomingCompromissos(3);
            setUpcoming(data);
        } catch (error) {
            console.error("Error loading upcoming commitments:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadUpcoming();
        }, [loadUpcoming])
    );

    const handleCompromissoPress = (compromisso: Compromisso) => {
        setSelectedCompromisso(compromisso);
        setIsModalVisible(true);
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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Próximos Compromissos</Text>
                <MaterialCommunityIcons name="account-group" size={20} color={colors.blue300} />
            </View>

            <View style={[styles.mainCard, { backgroundColor: colors.surface, borderColor: colors.border }, shadows.sm]}>
                {loading ? (
                    <ActivityIndicator color={colors.primary} style={{ padding: 20 }} />
                ) : upcoming.length > 0 ? (
                    <View style={styles.list}>
                        {upcoming.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.itemCard, { backgroundColor: isDarkMode ? colors.gray800 : colors.background, borderColor: colors.border }]}
                                onPress={() => handleCompromissoPress(item)}
                            >
                                <View style={[styles.iconBox, { backgroundColor: colors.blue300 + '20' }]}>
                                    <MaterialCommunityIcons name={getEventIcon(item.titulo) as any} size={20} color={colors.blue300} />
                                </View>
                                <View style={styles.itemInfo}>
                                    <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.titulo}</Text>
                                    <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                                        {formatDate(item.data_hora)} • {formatTime(item.data_hora)} • {item.com_quem || 'Alguém especial'}
                                    </Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="heart-plus-outline" size={40} color={colors.blue300 + '90'} />
                        <Text style={[styles.emptyText, { color: colors.text }]}>
                            Você ainda não tem compromissos na aba de relacionamentos.
                        </Text>
                        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                            Que tal agendar um café ou um jantar com alguém que você ama? Conectar-se é crescer!
                        </Text>
                    </View>
                )}
            </View>

            <CompromissoDetailModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                compromisso={selectedCompromisso}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    mainCard: {
        borderRadius: 32,
        borderWidth: 1,
        padding: 20,
    },
    list: {
        gap: 12,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 20,
        borderWidth: 1,
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    emptyText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
});
