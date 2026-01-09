import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PersonalInfoModal } from './PersonalInfoModal';

export const ProfileRequiredOverlay = () => {
    const { colors, spacing, borderRadius } = useAppTheme();
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                    <MaterialCommunityIcons name="account-plus" size={40} color="white" />
                </View>

                <Text style={[styles.title, { color: colors.text }]}>Perfil Necessário</Text>

                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    Para utilizar o app é necessário que seja criado um perfil primeiro.
                    Suas informações nos ajudam a personalizar sua experiência.
                </Text>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={() => setIsModalVisible(true)}
                >
                    <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
            </View>

            <PersonalInfoModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        zIndex: 1000,
    },
    card: {
        width: '100%',
        padding: 32,
        borderRadius: 32,
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
