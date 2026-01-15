import React, { useState, useEffect } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme';

interface TimeInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
    value: string;
    onValueChange: (value: string) => void;
    format?: 'HH:MM' | 'MM:SS'; // Default HH:MM
}

export const TimeInput: React.FC<TimeInputProps> = ({ value, onValueChange, style, format = 'HH:MM', ...props }) => {
    const { colors, isDarkMode } = useAppTheme();
    const [displayValue, setDisplayValue] = useState(value || '');

    useEffect(() => {
        setDisplayValue(value || '');
    }, [value]);

    const handleBlur = () => {
        if (!displayValue) return;

        // Helper to format numbers like "7" -> "07"
        const pad = (n: string) => n.length === 1 ? `0${n}` : n;

        // If user types simple integer like "45", convert to "45:00"
        if (/^\d+$/.test(displayValue)) {
            const num = parseInt(displayValue, 10);
            if (!isNaN(num)) {
                const formatted = `${num}:${'00'}`;
                setDisplayValue(formatted);
                onValueChange(formatted);
            }
        } else if (displayValue.includes(':')) {
            // Validate HH:MM format roughly
            const parts = displayValue.split(':');
            if (parts.length === 2) {
                const p1 = pad(parts[0]);
                const p2 = pad(parts[1]);
                const final = `${p1}:${p2}`;
                setDisplayValue(final);
                onValueChange(final);
            }
        }
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
            onChangeText={(text) => {
                setDisplayValue(text);
                onValueChange(text);
            }}
            onBlur={(e) => {
                handleBlur();
                props.onBlur && props.onBlur(e);
            }}
            placeholder={format === 'HH:MM' ? "00:00" : "00:00"}
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
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
