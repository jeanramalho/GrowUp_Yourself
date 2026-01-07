import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useAppTheme } from '@/theme';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const { colors, isDarkMode, shadows } = useAppTheme();

    // Icon mapping
    const getIcon = (routeName: string, isFocused: boolean) => {
        const color = isFocused ? colors.primary : colors.textSecondary;
        const size = isFocused ? 24 : 20;

        switch (routeName) {
            case 'home': return <MaterialCommunityIcons name="home" size={size} color={color} />;
            case 'spirituality': return <MaterialCommunityIcons name="creation" size={size} color={color} />;
            case 'health': return <MaterialCommunityIcons name="heart-pulse" size={size} color={color} />;
            case 'finance': return <MaterialCommunityIcons name="wallet" size={size} color={color} />;
            case 'relationships': return <MaterialCommunityIcons name="account-group" size={size} color={color} />;
            default: return <MaterialCommunityIcons name="circle" size={size} color={color} />;
        }
    };

    const getLabel = (routeName: string) => {
        switch (routeName) {
            case 'home': return 'Início';
            case 'spirituality': return 'Espírito';
            case 'health': return 'Saúde';
            case 'finance': return 'Finanças';
            case 'relationships': return 'Relações';
            default: return '';
        }
    };

    // Dynamic Styles for Theming
    const dynamicStyles = {
        content: {
            backgroundColor: isDarkMode ? colors.surface : 'rgba(255,255,255,0.95)',
            borderColor: colors.border,
            shadowColor: isDarkMode ? '#000' : colors.text,
        },
        labelFocused: { color: colors.primary },
        labelInactive: { color: colors.textSecondary },
    };

    return (
        <View style={styles.container}>
            <View style={[styles.content, dynamicStyles.content, shadows.lg]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];

                    if (['index', 'profile', '_sitemap', '+not-found'].includes(route.name)) return null;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={[styles.tabItem, isFocused && styles.tabItemFocused]}
                        >
                            {getIcon(route.name, isFocused)}
                            <Text style={[styles.label, isFocused ? dynamicStyles.labelFocused : dynamicStyles.labelInactive]}>
                                {getLabel(route.name)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        backgroundColor: 'transparent',
        zIndex: 100,
    },
    content: {
        flexDirection: 'row',
        width: '90%',
        maxWidth: 400,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 8,
        shadowOpacity: 0.1,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: -10 },
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        height: '100%',
    },
    tabItemFocused: {
        transform: [{ scale: 1.1 }],
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
