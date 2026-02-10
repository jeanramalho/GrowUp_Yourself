/**
 * Design tokens and theme configuration
 * Centralized styling constants for the application
 */

import { MD3LightTheme } from 'react-native-paper';

/**
 * Color palette
 * Blue-based palette from specification
 */
export const colors = {
  // Primary colors (blue palette from specification)
  primary: '#0A6CF0', // Primary Blue 1
  primaryDark: '#0B3D91', // Navy (escuro)
  primaryLight: '#2B8AF7', // Primary Blue 2
  primaryLighter: '#BBDEFB',

  // Secondary/accent colors
  secondary: '#FFC107',
  secondaryDark: '#FFA000',
  secondaryLight: '#FFD54F',

  // Neutral colors (from specification)
  white: '#FFFFFF',
  text: '#212121', // Default text color
  black: '#000000',
  background: '#F3F6FA', // Default app background
  gray100: '#F3F6FA', // Neutral Gray 1
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#A9B3C7', // Neutral Gray 2
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Semantic colors (from specification)
  success: '#2ECC71', // Success from spec
  warning: '#FF9800',
  error: '#E24B4B', // Alert / Critical from spec
  info: '#2196F3',

  // Pillar-specific colors
  pillar: {
    spirituality: '#7C3AED', // Purple
    health: '#EC4899', // Pink
    finance: '#10B981', // Green
    relationships: '#F59E0B', // Amber
  },

  // Status colors
  completed: '#4CAF50',
  pending: '#FFC107',
  failed: '#F44336',
  skipped: '#9E9E9E',
};

/**
 * Spacing scale
 * Based on 8px base unit
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

/**
 * Typography
 */
export const typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },

  // Font weights
  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

/**
 * Border radius scale
 */
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

/**
 * Shadow definitions
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 1,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 2,
    elevation: 2,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  xl: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 8,
  },
};

/**
 * Z-index scale
 */
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

/**
 * Animation/transition values
 */
export const animation = {
  duration: {
    fast: 150,
    base: 250,
    slow: 350,
  },
  easing: {
    linear: 'linear' as const,
    easeIn: 'ease-in' as const,
    easeOut: 'ease-out' as const,
    easeInOut: 'ease-in-out' as const,
  },
};

/**
 * React Native Paper theme using design tokens
 */
export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.primaryLight,
    error: colors.error,
    background: colors.white,
    surface: colors.white,
    surfaceVariant: colors.gray100,
    outline: colors.gray400,
    inverseOnSurface: colors.gray900,
    inverseSurface: colors.gray800,
    inversePrimary: colors.primaryLight,
    scrim: colors.black,
  },
};

/**
 * Complete theme object for easy access
 */
export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  zIndex,
  animation,
  paperTheme,
};
