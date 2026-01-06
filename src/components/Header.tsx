import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface HeaderProps {
    progress: {
        spirituality: number;
        health: number;
        finance: number;
        relationships: number;
    };
    onProfilePress: () => void;
}

const Header: React.FC<HeaderProps> = ({ progress, onProfilePress }) => {
    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.pillarsContainer}>
                    <PillarIcon
                        icon="book-outline"
                        progress={progress.spirituality}
                        color={theme.colors.primary}
                    />
                    <PillarIcon
                        icon="fitness-outline"
                        progress={progress.health}
                        color={theme.colors.primary}
                    />
                    <PillarIcon
                        icon="cash-outline"
                        progress={progress.finance}
                        color={theme.colors.primary}
                    />
                    <PillarIcon
                        icon="people-outline"
                        progress={progress.relationships}
                        color={theme.colors.primary}
                    />
                </View>
                <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
                    <Ionicons name="person-circle-outline" size={32} color={theme.colors.primaryDark} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const PillarIcon = ({ icon, progress, color }: { icon: keyof typeof Ionicons.glyphMap; progress: number; color: string }) => (
    <View style={styles.pillarItem}>
        <Ionicons name={icon} size={24} color={color} />
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: color }]} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surface,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.s,
        height: 60,
    },
    pillarsContainer: {
        flexDirection: 'row',
        gap: theme.spacing.l,
        alignItems: 'center',
    },
    pillarItem: {
        alignItems: 'center',
        gap: 4,
    },
    progressBarContainer: {
        width: 24,
        height: 4,
        backgroundColor: theme.colors.surface,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
    profileButton: {
        padding: 4,
    },
});

export default Header;
