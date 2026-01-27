import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { useThemeStore } from '@/store/themeStore';
import { useUserStore } from '@/store/userStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { PersonalInfoModal } from '@/components/profile/PersonalInfoModal';

export default function ProfileScreen() {
  const { colors, isDarkMode, spacing, typography, borderRadius } = useAppTheme();
  const { toggleTheme } = useThemeStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    avatarPath,
    setAvatar,
    getAvatarUri,
    notificationsEnabled,
    toggleNotifications,
    userName,
    userLevel,
    userTitle
  } = useUserStore();

  const avatarUri = getAvatarUri(); // Reconstruct URI for display

  const handlePickImage = async () => {
    // ... logic remains same ...
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para mudar a foto.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Enables cropping
        aspect: [1, 1], // Square aspect ratio
        quality: 1,
      });

      if (!result.canceled) {
        const selectedUri = result.assets[0].uri;

        try {
          const fileName = selectedUri.split('/').pop();
          const newPath = `${FileSystem.documentDirectory}${Date.now()}_${fileName}`;

          await FileSystem.copyAsync({
            from: selectedUri,
            to: newPath
          });

          setAvatar(newPath);
        } catch (err) {
          console.error('Error saving image:', err);
          // Fallback to original URI if save fails, though it might not persist
          setAvatar(selectedUri);
        }
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao selecionar a imagem.');
    }
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Profile Header */}
        <View style={styles.headerSection}>
          <TouchableOpacity onPress={handlePickImage} style={styles.avatarWrapper}>
            <View style={[styles.avatarBorder, { borderColor: 'rgba(59, 130, 246, 0.2)' }]}>
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={[styles.avatar, { backgroundColor: colors.surface }]}
                />
              ) : (
                <View style={[styles.avatar, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100, justifyContent: 'center', alignItems: 'center' }]}>
                  <MaterialCommunityIcons name="account" size={60} color={colors.textSecondary} />
                </View>
              )}
              <View style={[styles.editIconContainer, { backgroundColor: colors.primary }]}>
                <MaterialCommunityIcons name="pencil" size={16} color="white" />
              </View>
            </View>
            <View style={[styles.levelBadge, { backgroundColor: colors.primary, borderColor: colors.surface }]}>
              <Text style={styles.levelText}>{userLevel}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
            <Text style={[styles.userLevel, { color: colors.primary }]}>{userTitle}</Text>
          </View>
        </View>

        {/* Unified Menu Section */}
        <View style={styles.menuSection}>
          {/* Informações Pessoais */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setIsModalVisible(true)}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100 }]}>
                <MaterialCommunityIcons name="account-outline" size={20} color={colors.textSecondary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.text }]}>Informações Pessoais</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Notificações Toggle */}
          <View style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: isDarkMode ? colors.gray800 : colors.gray100 }]}>
                <MaterialCommunityIcons name={notificationsEnabled ? "bell-ring" : "bell-off"} size={20} color={colors.textSecondary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.text }]}>Notificações</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor={'white'}
            />
          </View>

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


        <View style={styles.footer}>
          <Text style={styles.footerBrand}>DESIGN BY JEAN RAMALHO</Text>
          <Text style={styles.footerVersion}>v1.0.4 Prototype</Text>
        </View>

      </ScrollView>

      <PersonalInfoModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
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
    fontSize: 12,
    fontWeight: 'bold',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 10,
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
    fontSize: 14,
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
  footer: {
    alignItems: 'center',
  },
  footerBrand: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
