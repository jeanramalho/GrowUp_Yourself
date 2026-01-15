import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';

interface DatePickerInputProps {
    label?: string;
    value: Date;
    onChange: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
    label,
    value,
    onChange,
    minDate,
    maxDate
}) => {
    const { colors, isDarkMode } = useAppTheme();
    const [show, setShow] = useState(false);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR');
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
        <View style={styles.container}>
            {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}

            <TouchableOpacity
                style={[
                    styles.input,
                    {
                        backgroundColor: isDarkMode ? colors.gray800 : colors.gray100,
                        borderColor: colors.border
                    }
                ]}
                onPress={() => setShow(true)}
            >
                <Text style={[styles.valueText, { color: colors.text }]}>{formatDate(value)}</Text>
                <MaterialCommunityIcons name="calendar" size={20} color={colors.textSecondary} />
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
                                    mode="date"
                                    display="spinner"
                                    onChange={handleChange}
                                    minimumDate={minDate}
                                    maximumDate={maxDate}
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
                        mode="date"
                        display="default"
                        onChange={handleChange}
                        minimumDate={minDate}
                        maximumDate={maxDate}
                    />
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { gap: 8 },
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
