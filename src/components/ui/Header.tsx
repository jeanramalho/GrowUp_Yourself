import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { useUserStore } from '@/store/userStore';
import { habitService } from '@/services/HabitService';
import { useFocusEffect } from 'expo-router';

interface HeaderProps {
    onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfilePress }) => {
    const insets = useSafeAreaInsets();
    const { colors, isDarkMode } = useAppTheme();
    const { avatarPath, userName, getAvatarUri } = useUserStore();
    const firstName = userName.split(' ')[0];
    const [imageError, setImageError] = useState(false);

    const avatarUri = getAvatarUri(); // Reconstruct URI for display

    const [progress, setProgress] = useState({
        'pilar-1': 0,
        'pilar-2': 0,
        'pilar-3': 0,
        'pilar-4': 0,
    });

    const loadProgress = useCallback(async () => {
        try {
            const now = new Date();
            const p1 = await habitService.getMonthlyProgress('pilar-1', now);
            const p2 = await habitService.getMonthlyProgress('pilar-2', now);
            const p3 = await habitService.getMonthlyProgress('pilar-3', now);
            const p4 = await habitService.getMonthlyProgress('pilar-4', now);

            setProgress({
                'pilar-1': p1,
                'pilar-2': p2,
                'pilar-3': p3,
                'pilar-4': p4,
            });
        } catch (error) {
            console.error("Error loading header progress:", error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadProgress();
        }, [loadProgress])
    );

    const renderPillar = (icon: any, progressValue: number, color: string) => (
        <View style={styles.pillarItem}>
            <CircularProgress
                size={48}
                strokeWidth={4}
                progress={progressValue}
                color={color}
                backgroundColor={isDarkMode ? colors.gray700 : colors.gray200}
            >
                <MaterialCommunityIcons name={icon} size={24} color={color} />
            </CircularProgress>
        </View>
    );

    return (
        <View style={[
            styles.container,
            {
                paddingTop: Math.max(insets.top, 24),
                backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.8)',
                borderBottomColor: colors.border
            }
        ]}>
            <View style={styles.topRow}>
                <View style={styles.greetingContainer}>
                    <Text style={[styles.brandText, { color: colors.primary }]}>GROWUP YOURSELF</Text>
                    <Text style={[styles.greetingText, { color: colors.text }]}>Olá, {firstName}</Text>
                </View>
                <TouchableOpacity onPress={onProfilePress} style={[styles.avatarContainer, { borderColor: 'rgba(59, 130, 246, 0.2)' }]}>
                    {avatarUri && !imageError ? (
                        <Image
                            source={{ uri: avatarUri }}
                            style={[styles.avatar, { backgroundColor: colors.surface }]}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <View style={[styles.avatar, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, justifyContent: 'center', alignItems: 'center' }]}>
                            <MaterialCommunityIcons name="account" size={24} color={colors.textSecondary} />
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.pillarsContainer}>
                {renderPillar("creation", progress['pilar-1'], colors.pillar.spirituality)}
                {renderPillar("heart-pulse", progress['pilar-2'], colors.pillar.health)}
                {renderPillar("wallet", progress['pilar-3'], progress['pilar-3'] > 90 ? colors.error : colors.pillar.finance)}
                {renderPillar("account-group", progress['pilar-4'], colors.pillar.relationships)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
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
        letterSpacing: 2,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    greetingText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
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
