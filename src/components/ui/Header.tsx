import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { useUserStore } from '@/store/userStore';

interface HeaderProps {
    onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfilePress }) => {
    const insets = useSafeAreaInsets();
    const { colors, isDarkMode } = useAppTheme();
    const { avatarUri } = useUserStore();

    // Mock data matching the React App
    const pillarProgress = {
        spirituality: 0.65,
        health: 0.42,
        finance: 0.91,
        relationships: 0.30,
    };

    const defaultAvatar = 'https://picsum.photos/seed/default-avatar/200';

    const renderPillar = (icon: any, progress: number, color: string) => (
        <View style={styles.pillarItem}>
            <CircularProgress
                size={48}
                strokeWidth={4}
                progress={progress * 100}
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
                    <Text style={[styles.greetingText, { color: colors.text }]}>Olá, Jean</Text>
                </View>
                <TouchableOpacity onPress={onProfilePress} style={[styles.avatarContainer, { borderColor: 'rgba(59, 130, 246, 0.2)' }]}>
                    <Image
                        source={{ uri: avatarUri || defaultAvatar }}
                        style={[styles.avatar, { backgroundColor: colors.surface }]}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.pillarsContainer}>
                {renderPillar("creation", pillarProgress.spirituality, colors.pillar.spirituality)}
                {renderPillar("heart-pulse", pillarProgress.health, colors.pillar.health)}
                {renderPillar("wallet", pillarProgress.finance, pillarProgress.finance > 0.9 ? colors.error : colors.pillar.finance)}
                {renderPillar("account-group", pillarProgress.relationships, colors.pillar.relationships)}
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
