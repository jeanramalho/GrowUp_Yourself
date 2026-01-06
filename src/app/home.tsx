import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Bom dia,</Text>
                        <Text style={styles.userName}>Carlos Silva</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.notificationButton}>
                            <Ionicons name="notifications-outline" size={26} color={theme.colors.gray600} />
                            <View style={styles.notificationBadge} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.avatarContainer}>
                            {/* Placeholder Avatar */}
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="person" size={20} color={theme.colors.primary} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Pillars Section */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillarsContainer}>
                    <PillarItem
                        icon="meditation"
                        label="Espírito"
                        color={theme.colors.pillar.spirituality}
                        bg={theme.colors.gray100} // Approximate Indigo-50
                        progress={75}
                    />
                    <PillarItem
                        icon="heart"
                        label="Saúde"
                        color={theme.colors.pillar.health}
                        bg="#EFF6FF" // Blue-50
                        progress={50}
                    />
                    <PillarItem
                        icon="wallet"
                        label="Finanças"
                        color={theme.colors.pillar.finance}
                        bg="#ECFDF5" // Emerald-50
                        progress={20}
                    />
                    <PillarItem
                        icon="handshake"
                        label="Social"
                        color={theme.colors.pillar.relationships}
                        bg="#F0F9FF" // Sky-50
                        progress={90}
                    />
                </ScrollView>

                {/* Today's Goals Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Metas de Hoje</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllButton}>Ver todas</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.goalsContainer}>
                    {/* Goal Card 1 - Spirituality */}
                    <View style={styles.goalCard}>
                        <View style={styles.goalCardContent}>
                            <View style={[styles.goalImage, { backgroundColor: theme.colors.gray200 }]}>
                                <MaterialCommunityIcons name="meditation" size={24} color={theme.colors.gray500} />
                            </View>
                            <View style={styles.goalInfo}>
                                <View style={styles.goalHeader}>
                                    <View style={[styles.categoryBadge, { backgroundColor: '#EEF2FF' }]}>
                                        <Text style={[styles.categoryText, { color: theme.colors.pillar.spirituality }]}>Espiritualidade</Text>
                                    </View>
                                    <Text style={styles.timeLeft}>2h restantes</Text>
                                </View>
                                <Text style={styles.goalTitle}>Meditação Matinal</Text>
                                <View style={styles.streakContainer}>
                                    <MaterialCommunityIcons name="fire" size={16} color={theme.colors.warning} />
                                    <Text style={styles.streakText}>12 dias seguidos</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="play" size={20} color={theme.colors.white} />
                            <Text style={styles.actionButtonText}>Iniciar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Goal Card 2 - Finance */}
                    <View style={styles.goalCard}>
                        <View style={styles.goalCardContent}>
                            <View style={[styles.goalImage, { backgroundColor: theme.colors.gray200 }]}>
                                <MaterialCommunityIcons name="piggy-bank" size={24} color={theme.colors.gray500} />
                            </View>
                            <View style={styles.goalInfo}>
                                <View style={styles.goalHeader}>
                                    <View style={[styles.categoryBadge, { backgroundColor: '#ECFDF5' }]}>
                                        <Text style={[styles.categoryText, { color: theme.colors.pillar.finance }]}>Finanças</Text>
                                    </View>
                                    <Text style={styles.timeLeft}>Dia todo</Text>
                                </View>
                                <Text style={styles.goalTitle}>Economizar R$ 10</Text>
                                <View style={styles.streakContainer}>
                                    <MaterialCommunityIcons name="fire" size={16} color={theme.colors.gray300} />
                                    <Text style={styles.streakText}>4 dias seguidos</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                            <Ionicons name="checkmark" size={20} color={theme.colors.pillar.finance} />
                            <Text style={[styles.actionButtonText, { color: theme.colors.pillar.finance }]}>Marcar Feito</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab}>
                <Ionicons name="add" size={32} color={theme.colors.white} />
            </TouchableOpacity>
        </View>
    );
}

const PillarItem = ({ icon, label, color, bg, progress }: any) => (
    <View style={styles.pillarItem}>
        <View style={[styles.pillarIconContainer, { backgroundColor: bg }]}>
            <MaterialCommunityIcons name={icon} size={28} color={color} />
            {/* Circular Progress Placeholder - In real app use SVG */}
            <View style={[styles.circularProgress, { borderColor: color, borderStyle: 'dashed' }]} />
        </View>
        <Text style={styles.pillarLabel}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerSafeArea: {
        backgroundColor: theme.colors.background,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.l,
        paddingVertical: theme.spacing.m,
    },
    greeting: {
        fontSize: theme.typography.sizes.small,
        color: theme.colors.gray500,
        fontWeight: '500',
    },
    userName: {
        fontSize: theme.typography.sizes.h1,
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily.bold,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.m,
    },
    notificationButton: {
        padding: 8,
        borderRadius: theme.borderRadius.full,
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.primary,
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.full,
        borderWidth: 2,
        borderColor: theme.colors.primaryLight, // approximate primary/30
        padding: 2,
    },
    avatarPlaceholder: {
        flex: 1,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.gray200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    pillarsContainer: {
        paddingHorizontal: theme.spacing.l,
        gap: theme.spacing.m,
        marginBottom: theme.spacing.l,
    },
    pillarItem: {
        alignItems: 'center',
        gap: theme.spacing.s,
    },
    pillarIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    circularProgress: {
        position: 'absolute',
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        opacity: 0.5,
    },
    pillarLabel: {
        fontSize: theme.typography.sizes.caption,
        fontWeight: '600',
        color: theme.colors.gray600,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingHorizontal: theme.spacing.l,
        marginBottom: theme.spacing.m,
    },
    sectionTitle: {
        fontSize: 26,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.text,
    },
    seeAllButton: {
        fontSize: theme.typography.sizes.small,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    goalsContainer: {
        paddingHorizontal: theme.spacing.m,
        gap: theme.spacing.m,
    },
    goalCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: 4, // p-1 in tailwind
        borderWidth: 1,
        borderColor: theme.colors.gray200,
        ...theme.shadows.sm,
    },
    goalCardContent: {
        flexDirection: 'row',
        padding: theme.spacing.s, // p-3
        gap: theme.spacing.m,
    },
    goalImage: {
        width: 96, // w-24
        aspectRatio: 3 / 4,
        borderRadius: theme.borderRadius.s,
        justifyContent: 'center',
        alignItems: 'center',
    },
    goalInfo: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
    },
    timeLeft: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.gray400,
    },
    goalTitle: {
        fontSize: 18,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.text,
        marginTop: 4,
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    streakText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.gray500,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        paddingVertical: 10,
        borderRadius: theme.borderRadius.full,
        marginHorizontal: theme.spacing.s,
        marginBottom: theme.spacing.s,
        gap: 8,
        ...theme.shadows.md,
    },
    secondaryButton: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.gray200,
        shadowOpacity: 0,
        elevation: 0,
    },
    actionButtonText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    fab: {
        position: 'absolute',
        bottom: 100, // Above tab bar
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.lg,
    },
});
