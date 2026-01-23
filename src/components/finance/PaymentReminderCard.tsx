import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { LancamentoFinanceiro, CategoriaFinanceira } from '@/models';

interface PaymentReminderCardProps {
    item: LancamentoFinanceiro;
    category?: CategoriaFinanceira;
    onPress: () => void;
}

export function PaymentReminderCard({ item, category, onPress }: PaymentReminderCardProps) {
    const { colors } = useAppTheme();

    const today = new Date();
    const dueDate = new Date(item.data);
    const isToday = dueDate.toDateString() === today.toDateString();
    const isOverdue = dueDate < today && !isToday;

    const bg = isOverdue ? colors.error : (isToday ? colors.error : colors.surface);
    const textColor = (isOverdue || isToday) ? 'white' : colors.text;
    const subtextColor = (isOverdue || isToday) ? 'rgba(255,255,255,0.8)' : colors.textSecondary;

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: bg, borderColor: colors.border, borderWidth: (isOverdue || isToday) ? 0 : 1 }]}
            onPress={onPress}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <MaterialCommunityIcons
                        name={(category?.icone as any) || 'alert-circle-outline'}
                        size={24}
                        color={textColor}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>{category?.nome || item.nota || 'Pagamento'}</Text>
                    <Text style={[styles.subtitle, { color: subtextColor }]}>
                        {isToday ? 'Vence Hoje!' : `Vence: ${dueDate.toLocaleDateString('pt-BR')}`}
                    </Text>
                </View>
                <View>
                    <Text style={[styles.value, { color: textColor }]}>R$ {item.valor.toFixed(0)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: { padding: 12, borderRadius: 16, marginBottom: 8 },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    title: { fontWeight: 'bold', fontSize: 14 },
    subtitle: { fontSize: 12 },
    value: { fontWeight: 'bold', fontSize: 16 },
});
