import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { ContactSuggestion } from '@/models';

interface SuggestedContactModalProps {
    visible: boolean;
    onClose: () => void;
    contact: ContactSuggestion | null;
    onSuggestAnother: () => void;
}

export function SuggestedContactModal({ visible, onClose, contact, onSuggestAnother }: SuggestedContactModalProps) {
    const { colors, shadows } = useAppTheme();

    const handleSendMessage = () => {
        if (!contact?.phoneNumber) return;

        // Clean phone number: remove any non-numeric characters
        const cleanNumber = contact.phoneNumber.replace(/\D/g, '');

        // WhatsApp URL
        const whatsappUrl = `https://wa.me/${cleanNumber}`;

        Linking.canOpenURL(whatsappUrl)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(whatsappUrl);
                } else {
                    console.error("Don't know how to open URI: " + whatsappUrl);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };

    if (!contact) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.surface }, shadows.lg]}>
                    <View style={styles.header}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                            <MaterialCommunityIcons name="account-heart-outline" size={32} color={colors.primary} />
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.body}>
                        <Text style={[styles.suggestionLabel, { color: colors.textSecondary }]}>Sugestão de Contato</Text>
                        <Text style={[styles.contactName, { color: colors.text }]}>{contact.name}</Text>
                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            Que tal mandar uma mensagem para {contact.name.split(' ')[0]} hoje? Pequenos gestos fortalecem grandes vínculos.
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                            onPress={handleSendMessage}
                        >
                            <MaterialCommunityIcons name="whatsapp" size={20} color="white" />
                            <Text style={styles.primaryButtonText}>Enviar mensagem</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.secondaryButton, { borderColor: colors.border }]}
                            onPress={onSuggestAnother}
                        >
                            <MaterialCommunityIcons name="refresh" size={20} color={colors.text} />
                            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Sugerir outro contato</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        borderRadius: 32,
        padding: 24,
        alignItems: 'center',
        maxWidth: 400,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        padding: 4,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        alignItems: 'center',
        marginBottom: 32,
    },
    suggestionLabel: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    contactName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    footer: {
        width: '100%',
        gap: 12,
    },
    primaryButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
