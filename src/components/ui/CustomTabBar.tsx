import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { theme } from '@/theme';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {

    // Icon mapping
    const getIcon = (routeName: string, isFocused: boolean) => {
        const color = isFocused ? theme.colors.primary : theme.colors.gray400;
        const size = isFocused ? 24 : 20;

        switch (routeName) {
            case 'home': return <MaterialCommunityIcons name="home" size={size} color={color} />;
            case 'spirituality': return <MaterialCommunityIcons name="sparkles" size={size} color={color} />;
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

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];

                    // Skip if href is null (hidden tabs)
                    // Note: In expo-router, we might not see href: null here directly in the same way, 
                    // but we can check if it's one of our main tabs.
                    // Filtering logic based on known tabs:
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
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={[styles.tabItem, isFocused && styles.tabItemFocused]}
                        >
                            {getIcon(route.name, isFocused)}
                            <Text style={[styles.label, isFocused ? styles.labelFocused : styles.labelInactive]}>
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
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 40, // Increased for a more pill-like shape if needed, or stick to design
        borderWidth: 1,
        borderColor: theme.colors.slate100,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 8,
        ...theme.shadows.lg,
        shadowColor: '#000',
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
    labelFocused: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    labelInactive: {
        color: theme.colors.gray400,
    },
});
