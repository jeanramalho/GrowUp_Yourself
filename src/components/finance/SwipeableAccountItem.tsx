import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { Conta } from '@/models';

interface SwipeableAccountItemProps {
    account: Conta & { saldo_atual?: number };
    onPress?: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const SwipeableAccountItem: React.FC<SwipeableAccountItemProps> = ({
    account,
    onPress,
    onEdit,
    onDelete
}) => {
    const { colors } = useAppTheme();
    const swipeableRef = React.useRef<Swipeable>(null);

    const closeSwipeable = () => {
        swipeableRef.current?.close();
    };

    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
        return (
            <View style={styles.rightActionsContainer}>
                <TouchableOpacity
                    onPress={() => { closeSwipeable(); onEdit(); }}
                    style={styles.editCircle}
                >
                    <MaterialCommunityIcons name="pencil" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { closeSwipeable(); onDelete(); }}
                    style={styles.deleteCircle}
                >
                    <MaterialCommunityIcons name="trash-can-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            friction={2}
            rightThreshold={40}
            containerStyle={styles.swipeContainer}
        >
            <TouchableOpacity
                style={[styles.listItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={onPress} // Optional, maybe just list item
                activeOpacity={1} // Disable opacity change on press if no action
            >
                <MaterialCommunityIcons
                    name={account.tipo === 'carteira' ? 'wallet' : 'food'}
                    size={24}
                    color={colors.primary}
                />
                <View style={{ flex: 1 }}>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>{account.nome}</Text>
                    <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{account.tipo.replace('_', ' ')}</Text>
                </View>
                <Text style={[styles.itemValue, { color: colors.text }]}>
                    R$ {account.saldo_atual !== undefined ? account.saldo_atual.toFixed(2) : account.saldo_inicial.toFixed(2)}
                </Text>
            </TouchableOpacity>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    swipeContainer: {
        marginBottom: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        gap: 12,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemSubtitle: {
        fontSize: 12,
    },
    itemValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    rightActionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 12,
        gap: 8,
    },
    editCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#3B82F6', // Blue 500
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
