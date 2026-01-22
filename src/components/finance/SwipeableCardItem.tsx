import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { CartaoCredito } from '@/models';

interface SwipeableCardItemProps {
    card: CartaoCredito & { fatura?: number };
    onPress?: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onPay: () => void;
    isDarkMode?: boolean;
}

export const SwipeableCardItem: React.FC<SwipeableCardItemProps> = ({
    card,
    onPress,
    onEdit,
    onDelete,
    onPay,
    isDarkMode = false
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
                activeOpacity={0.7}
                style={[styles.cardItem, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderColor: colors.border }]}
                onPress={onPress}
            >
                <View style={styles.cardInfo}>
                    <MaterialCommunityIcons name="credit-card-chip" size={32} color={colors.primary} />
                    <View>
                        <Text style={[styles.itemTitle, { color: colors.text }]}>{card.nome}</Text>
                        <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>Vence dia {card.dia_vencimento}</Text>
                    </View>
                </View>

                <View style={styles.cardFaturaBox}>
                    <Text style={[styles.faturaLabel, { color: colors.textSecondary }]}>Fatura Atual</Text>
                    <Text style={[styles.faturaValue, { color: colors.error }]}>R$ {card.fatura?.toFixed(2) || '0.00'}</Text>
                    <TouchableOpacity
                        style={[styles.payBtn, { backgroundColor: colors.primary }]}
                        onPress={onPay}
                    >
                        <Text style={styles.payBtnText}>Pagar Agora</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    swipeContainer: {
        marginBottom: 12,
    },
    cardItem: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        gap: 16,
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemSubtitle: {
        fontSize: 14,
    },
    cardFaturaBox: {
        alignItems: 'flex-start',
        gap: 4,
    },
    faturaLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    faturaValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    payBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        marginTop: 8,
    },
    payBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    rightActionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 12,
        gap: 8,
        height: '100%', // Ensure actions take full height/center vertically
        justifyContent: 'center'
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
