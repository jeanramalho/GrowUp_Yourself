import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { useRouter, useFocusEffect } from 'expo-router';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { habitService } from '@/services/HabitService';
import { Meta } from '@/models';

type HabitWithStatus = Meta & { completed: boolean; executionId?: string };

// Helper to get formatted date string similar to design "Segunda, 24 Out"
const getFormattedDate = () => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const now = new Date();
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
};

export default function HomeScreen() {
    const router = useRouter();
    const { colors, shadows } = useAppTheme();

    const [activeHabits, setActiveHabits] = useState<HabitWithStatus[]>([]);
    const [pillars, setPillars] = useState([
        { type: 'spirituality', id: 'pilar-1', icon: 'creation', label: "Espírito", progress: 0, color: colors.indigo600 },
        { type: 'health', id: 'pilar-2', icon: 'heart-pulse', label: "Saúde", progress: 0, color: colors.sky500 },
        { type: 'finance', id: 'pilar-3', icon: 'wallet', label: "Finanças", progress: 0, color: colors.navy600 },
        { type: 'relationships', id: 'pilar-4', icon: 'account-group', label: "Relações", progress: 0, color: colors.blue300 },
    ]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const now = new Date();

            // Load Today's Habits
            const todayHabits = await habitService.getHabitsForDate(now);
            setActiveHabits(todayHabits);

            // Load Pillar Progress
            const p1 = await habitService.getMonthlyProgress('pilar-1', now);
            const p2 = await habitService.getMonthlyProgress('pilar-2', now);
            const p3 = await habitService.getMonthlyProgress('pilar-3', now);
            const p4 = await habitService.getMonthlyProgress('pilar-4', now);

            setPillars(prev => prev.map(p => {
                if (p.id === 'pilar-1') return { ...p, progress: p1 };
                if (p.id === 'pilar-2') return { ...p, progress: p2 };
                if (p.id === 'pilar-3') return { ...p, progress: p3 };
                if (p.id === 'pilar-4') return { ...p, progress: p4 };
                return p;
            }));
        } catch (error) {
            console.error("Error loading home data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handlePillarPress = (pillar: string) => {
        router.push(`/${pillar}`);
    };

    const handleToggleHabit = async (habit: HabitWithStatus) => {
        await habitService.toggleCompletion(habit.id, new Date());
        loadData();
    };

    const getPillarColor = (pillarType: string) => {
        const map: Record<string, string> = {
            spirituality: colors.indigo600,
            health: colors.sky500,
            finance: colors.navy600,
            relationships: colors.blue300,
        };
        return map[pillarType] || colors.primary;
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Metas de Hoje Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Metas de Hoje</Text>
                    <Text style={[styles.dateBadge, { color: colors.primary }]}>{getFormattedDate()}</Text>
                </View>

                <View style={styles.habitsList}>
                    {loading ? (
                        <ActivityIndicator color={colors.primary} />
                    ) : activeHabits.length > 0 ? (
                        activeHabits.map((habit) => {
                            const pilarType = pillars.find(p => p.id === habit.pilar_id)?.type || 'spirituality';
                            const habitColor = getPillarColor(pilarType);
                            const habitIcon = habit.pilar_id === 'pilar-1' ? 'creation' :
                                habit.pilar_id === 'pilar-2' ? 'heart-pulse' :
                                    habit.pilar_id === 'pilar-3' ? 'wallet' : 'account-group';

                            return (
                                <TouchableOpacity
                                    key={habit.id}
                                    onPress={() => handleToggleHabit(habit)}
                                    style={[styles.habitCard, { backgroundColor: colors.surface, borderColor: habit.completed ? colors.success : colors.border }, shadows.sm]}
                                >
                                    <View style={styles.habitContent}>
                                        <View style={[styles.habitIconBox, { backgroundColor: habitColor }]}>
                                            <MaterialCommunityIcons name={habitIcon as any} size={20} color="white" />
                                        </View>
                                        <View>
                                            <Text style={[styles.habitTitle, { color: colors.text, textDecorationLine: habit.completed ? 'line-through' : 'none' }]}>
                                                {habit.titulo}
                                            </Text>
                                            <Text style={[styles.habitSubtitle, { color: colors.textSecondary }]}>
                                                {habit.duracao_minutos} min • {habit.horario_sugerido || 'Sem horário'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={[styles.playButton, { backgroundColor: habit.completed ? colors.success + '20' : colors.blue50 }]}
                                    >
                                        <MaterialCommunityIcons
                                            name={habit.completed ? "check" : "play"}
                                            size={18}
                                            color={habit.completed ? colors.success : colors.primary}
                                        />
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    ) : (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: colors.textSecondary }}>Nenhuma meta para hoje.</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Visão dos Pilares Section */}
            <View style={[styles.section, { marginBottom: 100 }]}>
                <Text style={[styles.sectionTitle, { marginBottom: 16, color: colors.text }]}>Visão dos Pilares</Text>
                <View style={styles.grid}>
                    {pillars.map((p) => (
                        <TouchableOpacity
                            key={p.type}
                            style={[styles.pillarCard, { backgroundColor: colors.surface, borderColor: colors.border }, shadows.sm]}
                            onPress={() => handlePillarPress(p.type)}
                        >
                            <View style={styles.pillarContent}>
                                <CircularProgress
                                    size={68}
                                    strokeWidth={4}
                                    progress={p.progress}
                                    color={p.color}
                                    backgroundColor={colors.border}
                                >
                                    <MaterialCommunityIcons name={p.icon as any} size={28} color={p.color} />
                                </CircularProgress>

                                <View style={styles.pillarTextContainer}>
                                    <Text style={[styles.pillarLabel, { color: colors.text }]}>{p.label}</Text>
                                    <Text style={[styles.pillarProgressText, { color: colors.textSecondary }]}>{p.progress}% Completo</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateBadge: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    habitsList: {
        gap: 16,
    },
    habitCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 32,
        borderWidth: 1,
    },
    habitContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    habitIconBox: {
        width: 44,
        height: 44,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    habitTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    habitSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    playButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    pillarCard: {
        width: '47%', // roughly half - gap
        borderRadius: 32,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    pillarContent: {
        alignItems: 'center',
        gap: 12,
    },
    pillarIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    pillarTextContainer: {
        alignItems: 'center',
    },
    pillarLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    pillarProgressText: {
        fontSize: 12,
    },
});
