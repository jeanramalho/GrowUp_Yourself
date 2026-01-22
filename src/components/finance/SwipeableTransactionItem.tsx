import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { LancamentoFinanceiro, Conta } from '@/models';

interface SwipeableTransactionItemProps {
    transaction: LancamentoFinanceiro;
    onPress: () => void;
    onEdit: () => void;
    onDelete: () => void;
    accounts?: Conta[]; // Optional, for looking up voucher names if needed
}

export const SwipeableTransactionItem: React.FC<SwipeableTransactionItemProps> = ({
    transaction,
    onPress,
    onEdit,
    onDelete,
    accounts = []
}) => {
    const { colors, isDarkMode } = useAppTheme();
    const swipeableRef = React.useRef<Swipeable>(null);

    const closeSwipeable = () => {
        swipeableRef.current?.close();
    };

    const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
        const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity onPress={() => { closeSwipeable(); onEdit(); }} style={styles.leftAction}>
                <Animated.View style={[styles.actionIcon, { transform: [{ scale }] }]}>
                    <MaterialCommunityIcons name="pencil" size={24} color="white" />
                    <Text style={styles.actionText}>Editar</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity
                onPress={() => { closeSwipeable(); onDelete(); }}
                style={styles.rightAction}
            >
                <Animated.View style={[styles.actionIcon, { transform: [{ scale }] }]}>
                    <MaterialCommunityIcons name="trash-can-outline" size={24} color="white" />
                    <Text style={styles.actionText}>Excluir</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const isCard = !!transaction.cartao_id;
    const isVoucher = accounts.find(a => a.id === transaction.conta_id && ['vale_alimentacao', 'vale_refeicao'].includes(a.tipo));

    return (
        <Swipeable
            ref={swipeableRef}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            containerStyle={styles.swipeContainer}
        >
            <TouchableOpacity
                style={[styles.listItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={onPress}
                activeOpacity={0.9}
            >
                <View style={styles.listItemIcon}>
                    <MaterialCommunityIcons
                        name={transaction.tipo === 'receita' ? 'arrow-up-circle' : 'arrow-down-circle'}
                        size={32}
                        color={transaction.tipo === 'receita' ? colors.success : colors.error}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>{transaction.categoria}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
                            {transaction.data.split('-').reverse().join('/')}
                        </Text>
                        {isCard && <MaterialCommunityIcons name="credit-card" size={12} color={colors.textSecondary} />}
                        {!!isVoucher && <MaterialCommunityIcons name="ticket-percent" size={12} color={colors.textSecondary} />}
                        {transaction.parcelas_total && transaction.parcelas_total > 1 && (
                            <Text style={{ fontSize: 10, color: colors.textSecondary, fontWeight: 'bold' }}>
                                ({transaction.parcela_atual}/{transaction.parcelas_total})
                            </Text>
                        )}
                    </View>
                    {transaction.nota && (
                        <Text numberOfLines={1} style={[styles.itemSubtitle, { color: colors.textSecondary, fontStyle: 'italic', marginTop: 2 }]}>
                            {transaction.nota}
                        </Text>
                    )}
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={[styles.itemValue, { color: transaction.tipo === 'receita' ? colors.success : colors.error }]}>
                        {transaction.tipo === 'receita' ? '+' : '-'} R$ {transaction.valor.toFixed(2)}
                    </Text>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    swipeContainer: {
        marginBottom: 8,
        borderRadius: 20,
        overflow: 'hidden', // Important for rounded corners on swipe actions
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        gap: 12,
    },
    listItemIcon: {
        justifyContent: 'center',
        alignItems: 'center',
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
    leftAction: {
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 1,
        paddingHorizontal: 20,
    },
    rightAction: {
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'flex-start', // Icons start from left of the red area
        flex: 1,
        paddingHorizontal: 20,
    },
    actionIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
    },
    actionText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 4,
    },
});
