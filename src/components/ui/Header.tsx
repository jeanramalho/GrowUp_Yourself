import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
                {/* Spirituality */}
                <View style={styles.pillarItem}>
                    <MaterialCommunityIcons name="sparkles" size={16} color={theme.colors.pillar.spirituality} />
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${pillarProgress.spirituality * 100}%`, backgroundColor: theme.colors.primary }]} />
                    </View>
                </View>

                {/* Health */}
                <View style={styles.pillarItem}>
                    <MaterialCommunityIcons name="heart-pulse" size={16} color={theme.colors.pillar.health} />
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${pillarProgress.health * 100}%`, backgroundColor: theme.colors.primary }]} />
                    </View>
                </View>

                {/* Finance */}
                <View style={styles.pillarItem}>
                    <MaterialCommunityIcons name="wallet" size={16} color={theme.colors.pillar.finance} />
                    <View style={styles.progressBarBg}>
                        {/* Using red for > 90% as per React code logic */}
                        <View style={[styles.progressBarFill, { width: `${pillarProgress.finance * 100}%`, backgroundColor: pillarProgress.finance > 0.9 ? theme.colors.error : theme.colors.primary }]} />
                    </View>
                </View>

                {/* Relationships */}
                <View style={styles.pillarItem}>
                    <MaterialCommunityIcons name="account-group" size={16} color={theme.colors.pillar.relationships} />
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${pillarProgress.relationships * 100}%`, backgroundColor: theme.colors.primary }]} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,0.8)', // Blur effect simulation
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.slate100,
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
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    progressBarBg: {
        width: 48,
        height: 4,
        backgroundColor: theme.colors.slate100,
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 999,
    },
});
