import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';

interface TimePickerInputProps {
    label?: string;
    value: Date;
    onChange: (date: Date) => void;
    disabled?: boolean;
}

export const TimePickerInput: React.FC<TimePickerInputProps> = ({
    label,
    value,
    onChange,
    disabled
}) => {
    const { colors, isDarkMode } = useAppTheme();
    const [show, setShow] = useState(false);

    const formatTime = (date: Date) => {
        if (!date || isNaN(date.getTime())) {
            return '-';
        }
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const handleChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShow(false);
        }

        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    return (
        <View style={[styles.container, disabled && { opacity: 0.5 }]}>
            {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}

            <TouchableOpacity
                style={[
                    styles.input,
                    {
                        backgroundColor: isDarkMode ? colors.gray800 : colors.gray100,
                        borderColor: colors.border
                    }
                ]}
                onPress={() => !disabled && setShow(true)}
                disabled={disabled}
            >
                <Text style={[styles.valueText, { color: colors.text }]}>{formatTime(value)}</Text>
                <MaterialCommunityIcons name="clock-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {show && (
                Platform.OS === 'ios' ? (
                    <Modal transparent animationType="fade" visible={show} onRequestClose={() => setShow(false)}>
                        <View style={styles.iosModalOverlay}>
                            <View style={[styles.iosModalContent, { backgroundColor: isDarkMode ? colors.gray800 : 'white' }]}>
                                <View style={styles.iosHeader}>
                                    <TouchableOpacity onPress={() => setShow(false)}>
                                        <Text style={{ color: colors.primary, fontSize: 16, fontWeight: 'bold' }}>Pronto</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={value}
                                    mode="time"
                                    display="spinner"
                                    onChange={handleChange}
                                    textColor={colors.text}
                                    themeVariant={isDarkMode ? 'dark' : 'light'}
                                />
                            </View>
                        </View>
                    </Modal>
                ) : (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={value}
                        mode="time"
                        display="default"
                        onChange={handleChange}
                    />
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { gap: 8, flex: 1 },
    label: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
    input: {
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    valueText: { fontSize: 16 },
    iosModalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    iosModalContent: {
        paddingBottom: 24,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    iosHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)'
    }
});
