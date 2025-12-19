/**
 * Global Application Styles
 * Uses design tokens for consistency
 */

import { StyleSheet } from 'react-native';
import designTokens from './design-tokens.json';

const colors = designTokens.colors;
const spacing = designTokens.spacing;
const typography = designTokens.typography;
const shadows = designTokens.shadows;

export const globalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.grayscale.white,
  },

  containerWithPadding: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.grayscale.white,
  },

  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grayscale.white,
  },

  // Safe area
  safeArea: {
    flex: 1,
    backgroundColor: colors.grayscale.white,
  },

  // Sections
  section: {
    marginVertical: spacing[6],
  },

  sectionPadded: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
  },

  // Typography
  textBase: {
    fontFamily: typography.fontFamily.base,
    fontSize: typography.fontSize.base,
    fontWeight: '400',
    color: colors.grayscale.gray_900,
  },

  textSmall: {
    fontSize: typography.fontSize.sm,
    color: colors.grayscale.gray_700,
  },

  textLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: '500',
  },

  textXLarge: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
  },

  heading: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700',
    color: colors.grayscale.gray_900,
    lineHeight: typography.lineHeight.tight * typography.fontSize['2xl'],
  },

  subheading: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.grayscale.gray_800,
  },

  // Buttons
  button: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: spacing[2],
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonPrimary: {
    backgroundColor: colors.primary[500],
  },

  buttonSecondary: {
    backgroundColor: colors.secondary[500],
  },

  buttonSuccess: {
    backgroundColor: colors.success[500],
  },

  buttonWarning: {
    backgroundColor: colors.warning[500],
  },

  buttonError: {
    backgroundColor: colors.error[500],
  },

  buttonDisabled: {
    backgroundColor: colors.grayscale.gray_300,
  },

  buttonTextPrimary: {
    color: colors.grayscale.white,
    fontWeight: '600',
    fontSize: typography.fontSize.base,
  },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: colors.grayscale.gray_300,
    borderRadius: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    fontSize: typography.fontSize.base,
    color: colors.grayscale.gray_900,
  },

  inputFocused: {
    borderColor: colors.primary[500],
    backgroundColor: colors.grayscale.white,
  },

  // Cards
  card: {
    backgroundColor: colors.grayscale.white,
    borderRadius: spacing[3],
    padding: spacing[4],
    marginBottom: spacing[4],
    elevation: 2,
    shadowColor: colors.grayscale.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 1.5,
  },

  // Dividers
  divider: {
    height: 1,
    backgroundColor: colors.grayscale.gray_200,
    marginVertical: spacing[4],
  },

  // Badges
  badge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: spacing[4],
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgePrimary: {
    backgroundColor: colors.primary[100],
  },

  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.grayscale.white,
  },

  // List
  listItem: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale.gray_100,
  },

  // Error messages
  errorText: {
    color: colors.error[500],
    fontSize: typography.fontSize.sm,
    marginTop: spacing[1],
  },

  // Spacing utilities
  spacer: {
    marginBottom: spacing[4],
  },
});

export default globalStyles;
