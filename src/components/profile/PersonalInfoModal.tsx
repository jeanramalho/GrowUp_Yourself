import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { useUserStore } from '@/store/userStore';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { database } from '@/repositories/Repository';

interface PersonalInfoModalProps {
    visible: boolean;
    onClose: () => void;
}

export const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({ visible, onClose }) => {
    const insets = useSafeAreaInsets();
    const { colors, isDarkMode, spacing, borderRadius } = useAppTheme();
    const {
        userName,
        gender,
        weight,
        height,
        weightGoal,
        isProfileComplete,
        updateProfile,
        setProfileComplete,
        resetStore
    } = useUserStore();

    const [formData, setFormData] = useState({
        userName: userName,
        gender: gender || '',
        weight: weight || '',
        height: height || '',
        weightGoal: weightGoal || '',
    });

    useEffect(() => {
        if (visible) {
            setFormData({
                userName,
                gender: gender || '',
                weight: weight || '',
                height: height || '',
                weightGoal: weightGoal || '',
            });
        }
    }, [visible, userName, gender, weight, height, weightGoal]);

    const handleSave = () => {
        const { userName, gender, weight, height, weightGoal } = formData;

        if (!userName.trim() || !gender || !weight || !height || !weightGoal) {
            Alert.alert("Campos Obrigatórios", "Por favor, preencha todas as informações para continuar.");
            return;
        }

        updateProfile(formData);
        setProfileComplete(true);
        onClose();
    };

    const handleReset = () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir seu perfil? Todos os dados e progresso serão perdidos permanentemente.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sim, Excluir",
                    style: "destructive",
                    onPress: () => {
                        Alert.alert(
                            "Confirmação Final",
                            "Esta ação NÃO pode ser desfeita. Deseja prosseguir?",
                            [
                                { text: "Cancelar", style: "cancel" },
                                {
                                    text: "EU TENHO CERTEZA",
                                    style: "destructive",
                                    onPress: async () => {
                                        try {
                                            await database.clearAllData();
                                            resetStore();
                                            onClose();
                                        } catch (error) {
                                            console.error("Error clearing data:", error);
                                            Alert.alert("Erro", "Ocorreu um erro ao excluir os dados.");
                                        }
                                    }
                                }
                            ]
                        );
                    }
                }
            ]
        );
    };

    const renderInput = (label: string, value: string, key: keyof typeof formData, placeholder: string, keyboardType: any = 'default') => (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: isDarkMode ? colors.gray800 : colors.gray100,
                        color: colors.text,
                        borderColor: colors.border
                    }
                ]}
                value={value}
                onChangeText={(text) => setFormData(prev => ({ ...prev, [key]: text }))}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                keyboardType={keyboardType}
            />
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            statusBarTranslucent={true}
            onRequestClose={isProfileComplete ? onClose : () => { }}
        >
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    {/* Header */}
                    <View style={[
                        styles.header,
                        {
                            borderBottomColor: colors.border,
                            paddingTop: Platform.OS === 'ios' ? spacing.m : insets.top + spacing.s
                        }
                    ]}>
                        <View style={styles.backButtonPlaceholder}>
                            {isProfileComplete && (
                                <TouchableOpacity onPress={onClose} style={styles.backButton}>
                                    <MaterialCommunityIcons name="chevron-left" size={32} color={colors.text} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={[styles.title, { color: colors.text }]}>Informações Pessoais</Text>
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={[styles.saveButtonText, { color: colors.primary }]}>Concluir</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.form}>
                            {renderInput("Nome Completo", formData.userName, "userName", "Seu nome")}

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Gênero</Text>
                                <View style={styles.genderContainer}>
                                    {['Masculino', 'Feminino'].map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            onPress={() => setFormData(prev => ({ ...prev, gender: option }))}
                                            style={[
                                                styles.genderOption,
                                                {
                                                    backgroundColor: formData.gender === option ? colors.primary : (isDarkMode ? colors.gray800 : colors.gray100),
                                                    borderColor: formData.gender === option ? colors.primary : colors.border
                                                }
                                            ]}
                                        >
                                            <MaterialCommunityIcons
                                                name={option === 'Masculino' ? 'gender-male' : 'gender-female'}
                                                size={20}
                                                color={formData.gender === option ? 'white' : colors.text}
                                            />
                                            <Text style={[
                                                styles.genderText,
                                                { color: formData.gender === option ? 'white' : colors.text }
                                            ]}>
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    {renderInput("Peso (kg)", formData.weight, "weight", "0.0", "numeric")}
                                </View>
                                <View style={{ width: spacing.m }} />
                                <View style={{ flex: 1 }}>
                                    {renderInput("Altura (cm)", formData.height, "height", "0", "numeric")}
                                </View>
                            </View>

                            {renderInput("Meta de Peso (kg)", formData.weightGoal, "weightGoal", "0.0", "numeric")}

                            {isProfileComplete && (
                                <>
                                    <View style={styles.divider} />

                                    <TouchableOpacity
                                        style={[styles.resetButton, { borderColor: colors.error }]}
                                        onPress={handleReset}
                                    >
                                        <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.error} />
                                        <Text style={[styles.resetButtonText, { color: colors.error }]}>Excluir Perfil e Recomeçar</Text>
                                    </TouchableOpacity>

                                    <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
                                        A exclusão do perfil removerá todos os seus dados e progresso do app de forma permanente.
                                    </Text>
                                </>
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 4,
    },
    backButtonPlaceholder: {
        width: 40,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveButton: {
        padding: 8,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 24,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    input: {
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: 12,
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 18,
        borderRadius: 16,
        borderWidth: 1,
        marginTop: 12,
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    disclaimer: {
        fontSize: 12,
        textAlign: 'center',
        paddingHorizontal: 20,
        marginTop: 4,
        lineHeight: 18,
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    genderOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
    },
    genderText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
