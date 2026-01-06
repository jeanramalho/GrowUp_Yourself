export const theme = {
  colors: {
    primary: '#2563EB', // Blue 600
    primaryDark: '#1D4ED8', // Blue 700
    primaryLight: '#60A5FA', // Blue 400
    secondary: '#475569', // Slate 600
    background: '#F8FAFC', // Slate 50
    backgroundDark: '#0F172A', // Slate 900
    surface: '#FFFFFF',
    surfaceDark: '#1E293B', // Slate 800
    text: '#0F172A', // Slate 900
    textLight: '#F8FAFC', // Slate 50
    textSecondary: '#64748B', // Slate 500
    success: '#10B981', // Emerald 500
    error: '#EF4444', // Red 500
    warning: '#F59E0B', // Amber 500

    // Pillar specific colors
    pillar: {
      spirituality: '#4F46E5', // Indigo 600
      health: '#2563EB', // Blue 600
      finance: '#10B981', // Emerald 500
      relationships: '#0EA5E9', // Sky 500
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
