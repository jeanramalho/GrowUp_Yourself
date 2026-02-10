import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '@/theme/tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface QuickActionProps {
    onAction: (text: string) => void;
}

export function QuickActions({ onAction }: QuickActionProps) {
    const actions = [
        { label: 'Registrar Peso', icon: 'scale-bathroom', text: 'Gostaria de registrar meu peso.' },
        { label: 'Calcular IMC', icon: 'calculator', text: 'Qual meu IMC?' },
        { label: 'Meta de Água', icon: 'water', text: 'Qual minha meta de água?' },
        { label: 'Dica de Saúde', icon: 'apple', text: 'Me dê uma dica de saúde.' },
        { label: 'Registrar Treino', icon: 'dumbbell', text: 'Hoje eu treinei!' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {actions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.chip}
                        onPress={() => onAction(action.text)}
                    >
                        <MaterialCommunityIcons name={action.icon as any} size={16} color={theme.colors.primary} />
                        <Text style={styles.chipText}>{action.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray200,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.md,
        alignItems: 'center',
        paddingVertical: 8,
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.gray300,
        gap: 6,
    },
    chipText: {
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '500',
    }
});
