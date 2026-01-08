import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircularProgress } from '@/components/ui/CircularProgress';

interface HeaderProps {
    onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfilePress }) => {
    const insets = useSafeAreaInsets();

    // Mock data matching the React App
    const pillarProgress = {
        spirituality: 0.65,
        health: 0.42,
        finance: 0.91,
        relationships: 0.30,
    };

    const renderPillar = (icon: any, progress: number, color: string) => (
        <View style={styles.pillarItem}>
            <CircularProgress
                size={42}
                strokeWidth={4}
                progress={progress * 100}
                color={color}
                backgroundColor={theme.colors.gray200}
            >
                <MaterialCommunityIcons name={icon} size={20} color={color} />
            </CircularProgress>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: Math.max(insets.top, 24) }]}>
            <View style={styles.topRow}>
                <View style={styles.greetingContainer}>
                    <Text style={styles.brandText}>GROWUP YOURSELF</Text>
                    <Text style={styles.greetingText}>Olá, Jean</Text>
                </View>
                <TouchableOpacity onPress={onProfilePress} style={styles.avatarContainer}>
                    <Image
                        source={{ uri: 'https://picsum.photos/seed/jean/100' }}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.pillarsContainer}>
                {renderPillar("creation", pillarProgress.spirituality, theme.colors.pillar.spirituality)}
                {renderPillar("heart-pulse", pillarProgress.health, theme.colors.pillar.health)}
                {renderPillar("wallet", pillarProgress.finance, pillarProgress.finance > 0.9 ? theme.colors.error : theme.colors.pillar.finance)}
                {renderPillar("account-group", pillarProgress.relationships, theme.colors.pillar.relationships)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,0.8)', // Blur effect simulation
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray200,
        paddingHorizontal: 24,
        paddingBottom: 16,
        zIndex: 50,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    greetingContainer: {
        flexDirection: 'column',
    },
    brandText: {
        fontSize: 10,
        fontWeight: '900',
        color: theme.colors.primary,
        letterSpacing: 2,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    greetingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(37, 99, 235, 0.2)', // blue-500/20
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    pillarsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    pillarItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
