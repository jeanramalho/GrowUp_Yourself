import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { useThemeStore } from '@/store/themeStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { colors, isDarkMode, spacing, typography, borderRadius } = useAppTheme();
  const { toggleTheme } = useThemeStore();

  const menuItems = [
    { icon: 'account-outline', label: "Informações Pessoais" },
    { icon: 'bell-outline', label: "Notificações" },
    { icon: 'shield-check-outline', label: "Privacidade & Segurança" },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Profile Header */}
        <View style={styles.headerSection}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarBorder, { borderColor: 'rgba(59, 130, 246, 0.2)' }]}>
              <Image
                source={{ uri: 'https://picsum.photos/seed/jean/200' }}
                style={[styles.avatar, { backgroundColor: colors.surface }]}
              />
            </View>
            <View style={[styles.levelBadge, { backgroundColor: colors.primary, borderColor: colors.surface }]}>
              <Text style={styles.levelText}>5</Text>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>Alex Carvalho</Text>
            <Text style={[styles.userLevel, { color: colors.primary }]}>Explorador Nível 5</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100 }]}>
                  {/* @ts-ignore icon name string */}
                  <MaterialCommunityIcons name={item.icon} size={20} color={colors.textSecondary} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}

          {/* Dark Mode Toggle */}
          <View style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100 }]}>
                <MaterialCommunityIcons name={isDarkMode ? "weather-night" : "weather-sunny"} size={20} color={colors.textSecondary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.text }]}>Modo Escuro</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={'white'}
            />
          </View>
        </View>

        {/* Developer Export Section */}
        <View style={[styles.devSection, { backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : colors.gray100, borderColor: colors.border }]}>
          <View style={styles.devHeader}>
            <MaterialCommunityIcons name="download" size={20} color={colors.primary} />
            <Text style={[styles.devTitle, { color: colors.text }]}>Exportar Design Tokens (JSON)</Text>
          </View>
          <Text style={[styles.devDesc, { color: colors.textSecondary }]}>Prontos para uso em React Native / Expo.</Text>
          <View style={[styles.codeBlock, { backgroundColor: isDarkMode ? colors.gray900 : 'white', borderColor: colors.border }]}>
            <Text style={[styles.codeText, { color: colors.textSecondary }]}>
              {`{
  "colors": { ... },
  "typography": { ... }
}`}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>DESIGN BY JEAN RAMALHO</Text>
          <Text style={styles.footerVersion}>v1.0.4 Prototype</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarBorder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  menuSection: {
    gap: 12,
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    padding: 8,
    borderRadius: 12,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  devSection: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 32,
  },
  devHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  devTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  devDesc: {
    fontSize: 12,
    marginBottom: 16,
  },
  codeBlock: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  codeText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  footer: {
    alignItems: 'center',
  },
  footerBrand: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
