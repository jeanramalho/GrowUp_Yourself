export const theme = {
  colors: {
    primary: '#3B82F6', // Blue 500
    primaryDark: '#2563EB', // Blue 600
    primaryLight: '#60A5FA', // Blue 400
    secondary: '#64748B', // Slate 500
    background: '#F8FAFC', // Slate 50
    backgroundDark: '#0F172A', // Slate 900
    surface: '#FFFFFF',
    surfaceDark: '#1E293B', // Slate 800
    text: '#0F172A', // Slate 900
    textLight: '#F8FAFC', // Slate 50
    textSecondary: '#94A3B8', // Slate 400
    success: '#10B981', // Emerald 500
    error: '#EF4444', // Red 500
    warning: '#F59E0B', // Amber 500

    // Additional colors from React app
    sky500: '#0EA5E9',
    sky600: '#0284C7',
    sky400: '#38BDF8',
    indigo600: '#4F46E5',
    emerald500: '#10B981',
    navy600: '#2563EB', // Mapping navy to blue-600 for now as navy isn't standard tailwind v3 without config, assuming it's deep blue
    blue900: '#1E3A8A',
    blue50: '#EFF6FF',
    blue300: '#93C5FD',
    slate100: '#F1F5F9',
    slate300: '#CBD5E1',
    slate800: '#1E293B',
    slate900: '#0F172A',

    // Pillar specific colors
    pillar: {
      spirituality: '#4F46E5', // Indigo 600
      health: '#0EA5E9', // Sky 500 (Updated to match React app icon colors roughly)
      finance: '#10B981', // Emerald 500
      relationships: '#3B82F6', // Blue 500
    },

    // Grays (Slate)
    gray100: '#F1F5F9',
    gray200: '#E2E8F0',
    gray300: '#CBD5E1',
    gray400: '#94A3B8',
    gray500: '#64748B',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1E293B',
    gray900: '#0F172A',

    white: '#FFFFFF',
    black: '#000000',
  },
  typography: {
    fontFamily: {
      regular: 'Inter-Regular',
      medium: 'Inter-Medium',
      bold: 'Inter-Bold',
    },
    sizes: {
      h1: 26,
      h2: 20,
      body: 16,
      small: 14,
      caption: 12,
    },
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};
