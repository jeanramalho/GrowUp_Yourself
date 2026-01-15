import React, { useState, useEffect } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme';

interface CurrencyInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
    value: string | number;
    onValueChange: (value: string) => void;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onValueChange, style, ...props }) => {
    const { colors, isDarkMode } = useAppTheme();

    // Internal state to handle user typing before formatting
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        // When external value changes, update display if not focused (or initially)
        // We assume value is simple string or number like '10.50'
        if (value !== undefined && value !== null) {
            setDisplayValue(value.toString().replace('.', ','));
        }
    }, [value]);

    const handleBlur = () => {
        if (!displayValue) return;

        let cleanVal = displayValue.replace(/[^\d,]/g, ''); // Allow digits and comma only
        if (!cleanVal) return;

        // Replace comma with dot for number parsing
        let numVal = parseFloat(cleanVal.replace(',', '.'));

        if (!isNaN(numVal)) {
            // Format to 2 decimal places
            const formatted = numVal.toFixed(2).replace('.', ',');
            setDisplayValue(formatted);
            onValueChange(formatted);
        }
    };

    const handleChangeText = (text: string) => {
        // Allow typing numbers and one comma
        const clean = text.replace(/[^0-9,]/g, '');
        const parts = clean.split(',');
        if (parts.length > 2) return; // Only one comma allowed

        if (parts.length === 2 && parts[1].length > 2) return; // Max 2 decimal places

        setDisplayValue(clean);
        onValueChange(clean);
    };

    return (
        <TextInput
            style={[
                styles.input,
                {
                    backgroundColor: isDarkMode ? colors.gray800 : colors.gray100,
                    color: colors.text,
                    borderColor: colors.border
                },
                style
            ]}
            value={displayValue}
            onChangeText={handleChangeText}
            onBlur={(e) => {
                handleBlur();
                props.onBlur && props.onBlur(e);
            }}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor={colors.textSecondary}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
    },
});
