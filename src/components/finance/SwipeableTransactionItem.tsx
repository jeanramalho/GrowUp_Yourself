import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { LancamentoFinanceiro, Conta } from '@/models';

interface SwipeableTransactionItemProps {
    transaction: LancamentoFinanceiro;
    onPress: () => void;
    onEdit: () => void;
    onDelete: () => void;
    accounts?: Conta[];
}

export const SwipeableTransactionItem: React.FC<SwipeableTransactionItemProps> = ({
    transaction,
    onPress,
    onEdit,
    onDelete,
    accounts = []
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

    const isCard = !!transaction.cartao_id;
    const isVoucher = accounts.find(a => a.id === transaction.conta_id && ['vale_alimentacao', 'vale_refeicao'].includes(a.tipo));

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
