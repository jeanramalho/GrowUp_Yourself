import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { useRouter } from 'expo-router';

// Helper to get formatted date string similar to design "Segunda, 24 Out"
const getFormattedDate = () => {
    return "Segunda, 24 Out";
};

export default function HomeScreen() {
    const router = useRouter();

    const activeHabits = [
        { id: '1', title: 'Leitura Reflexiva', pillar: 'spirituality', time: '30 min', icon: 'creation', color: theme.colors.primary, bg: 'bg-blue-500' }, // Mapping logic
        { id: '2', title: 'Treino Hiit', pillar: 'health', time: '40 min', icon: 'heart-pulse', color: theme.colors.sky500, bg: 'bg-sky-500' },
    ];

    const pillars = [
        { type: 'spirituality', icon: 'creation', label: "Espírito", progress: 65, color: theme.colors.indigo600 },
        { type: 'health', icon: 'heart-pulse', label: "Saúde", progress: 42, color: theme.colors.sky500 },
        { type: 'finance', icon: 'wallet', label: "Finanças", progress: 91, color: theme.colors.blue900 }, // navy mapped
        { type: 'relationships', icon: 'account-group', label: "Relações", progress: 30, color: theme.colors.blue300 },
    ];

    const handlePillarPress = (pillar: string) => {
        // Navigate to pillar screen
        router.push(`/${pillar}`);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Metas de Hoje Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Metas de Hoje</Text>
                    <Text style={styles.dateBadge}>{getFormattedDate()}</Text>
                </View>

                <View style={styles.habitsList}>
                    {activeHabits.map((habit) => (
                        <View key={habit.id} style={styles.habitCard}>
                            <View style={styles.habitContent}>
                                <View style={[styles.habitIconBox, { backgroundColor: habit.color }]}>
                                    {/* @ts-ignore icon name string */}
                                    <MaterialCommunityIcons name={habit.icon} size={20} color="white" />
                                </View>
                                <View>
                                    <Text style={styles.habitTitle}>{habit.title}</Text>
                                    <Text style={styles.habitSubtitle}>{habit.time} • Restante</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.playButton}
                                onPress={() => handlePillarPress(habit.pillar)}
                            >
                                <MaterialCommunityIcons name="play" size={18} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>

            {/* Visão dos Pilares Section */}
            <View style={[styles.section, { marginBottom: 100 }]}>
                <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Visão dos Pilares</Text>
                <View style={styles.grid}>
                    {pillars.map((p) => (
                        <TouchableOpacity
                            key={p.type}
                            style={styles.pillarCard}
                            onPress={() => handlePillarPress(p.type)}
                        >
                            <View style={[styles.pillarIconBox, { backgroundColor: p.color }]}>
                                {/* @ts-ignore icon name string */}
                                <MaterialCommunityIcons name={p.icon} size={20} color="white" />
                            </View>
                            <Text style={styles.pillarLabel}>{p.label}</Text>

                            <View style={styles.pillarProgressBg}>
                                <View style={[styles.pillarProgressFill, { width: `${p.progress}%`, backgroundColor: p.color }]} />
                            </View>
                            <Text style={styles.pillarProgressText}>{p.progress}% Completo</Text>
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
        backgroundColor: theme.colors.background,
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
        color: theme.colors.text,
    },
    dateBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.primary,
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
        backgroundColor: theme.colors.surface,
        padding: 20,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: theme.colors.slate100,
        ...theme.shadows.sm,
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
        color: theme.colors.text,
    },
    habitSubtitle: {
        fontSize: 12,
        color: theme.colors.gray400,
        marginTop: 2,
    },
    playButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.blue50,
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
        backgroundColor: theme.colors.surface,
        padding: 20,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: theme.colors.slate100,
        ...theme.shadows.sm,
    },
    pillarIconBox: {
        width: 44,
        height: 44,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    pillarLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
    },
    pillarProgressBg: {
        height: 6,
        backgroundColor: theme.colors.slate100,
        borderRadius: 999,
        width: '100%',
        overflow: 'hidden',
        marginBottom: 8,
    },
    pillarProgressFill: {
        height: '100%',
        borderRadius: 999,
    },
    pillarProgressText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.gray400,
        textTransform: 'uppercase',
    },
});
