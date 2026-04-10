import { Platform } from 'react-native';

export const TAB_BAR_BASE_HEIGHT = 80;
export const TAB_BAR_GAP = 12;

export const getTabBarBottomInset = (safeAreaBottom: number): number => {
  const platformMin = Platform.OS === 'ios' ? 20 : 10;
  return Math.max(safeAreaBottom, platformMin);
};

export const getTabBarScreenOffset = (safeAreaBottom: number): number => {
  return TAB_BAR_BASE_HEIGHT + getTabBarBottomInset(safeAreaBottom) + TAB_BAR_GAP;
};
