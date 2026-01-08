import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { useRouter } from 'expo-router';
import { CircularProgress } from '@/components/ui/CircularProgress';

// Helper to get formatted date string similar to design "Segunda, 24 Out"
const getFormattedDate = () => {
    return "Segunda, 24 Out";
};

export default function HomeScreen() {
    const router = useRouter();
    const { colors, shadows } = useAppTheme();

    const activeHabits = [
        { id: '1', title: 'Leitura Reflexiva', pillar: 'spirituality', time: '30 min', icon: 'creation', color: colors.primary, bg: 'bg-blue-500' },
        { id: '2', title: 'Treino Hiit', pillar: 'health', time: '40 min', icon: 'heart-pulse', color: colors.sky500, bg: 'bg-sky-500' },
    ];

    const pillars = [
        { type: 'spirituality', icon: 'creation', label: "Espírito", progress: 65, color: colors.indigo600 },
        { type: 'health', icon: 'heart-pulse', label: "Saúde", progress: 42, color: colors.sky500 },
        { type: 'finance', icon: 'wallet', label: "Finanças", progress: 91, color: colors.navy600 }, // navy mapped
        { type: 'relationships', icon: 'account-group', label: "Relações", progress: 30, color: colors.blue300 },
    ];

    const handlePillarPress = (pillar: string) => {
        router.push(`/${pillar}`);
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
                    {activeHabits.map((habit) => (
                        <View key={habit.id} style={[styles.habitCard, { backgroundColor: colors.surface, borderColor: colors.border }, shadows.sm]}>
                            <View style={styles.habitContent}>
                                <View style={[styles.habitIconBox, { backgroundColor: habit.color }]}>
                                    {/* @ts-ignore icon name string */}
                                    <MaterialCommunityIcons name={habit.icon} size={20} color="white" />
                                </View>
                                <View>
                                    <Text style={[styles.habitTitle, { color: colors.text }]}>{habit.title}</Text>
                                    <Text style={[styles.habitSubtitle, { color: colors.textSecondary }]}>{habit.time} • Restante</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.playButton, { backgroundColor: colors.blue50 }]}
                                onPress={() => handlePillarPress(habit.pillar)}
                            >
                                <MaterialCommunityIcons name="play" size={18} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    ))}
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
                                    {/* @ts-ignore icon name string */}
                                    <MaterialCommunityIcons name={p.icon} size={28} color={p.color} />
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
        pillarTextContainer: {
            alignItems: 'center',
        },
        pillarLabel: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 4,
        },
    });
