import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { healthService } from '@/services/HealthService';
import { healthAIService } from '@/services/HealthAIService';
import { ChatMessage, UserProfile } from '@/models';

interface QuickActionItem {
  icon: any;
  label: string;
  text: string;
  color: string;
}

export default function HealthScreen() {
  const { colors, isDarkMode } = useAppTheme();
  const insets = useSafeAreaInsets();

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const flatListRef = useRef<FlatList>(null);

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. Load Profile (for Stats Header)
      const userProfile = await healthService.getProfile();
      setProfile(userProfile);

      // 2. Load Chat History
      // Sanitize first to remove old mock data if needed
      await healthService.sanitizeHistory();
      const history = await healthService.getChatHistory();

      if (history.length === 0) {
        await handleSend('Olá', true);
      } else {
        setMessages(history);
        // Proactive check
        checkProactive();
      }
    } catch (e) {
      console.error("Error loading health data", e);
    }
  };

  const checkProactive = async () => {
    const msg = await healthAIService.checkIn();
    if (msg) {
      setMessages(prev => [...prev, msg]);
    }
  }

  const handleSend = async (text: string = inputText, isHiddenInit = false) => {
    if (!text.trim() && !isHiddenInit) return;
    if (loading && !isHiddenInit) return;

    const msgText = text.trim();
    setInputText('');

    if (!isHiddenInit) {
      setLoading(true);
      // Optimistic UI
      const tempMsg: ChatMessage = {
        id: Date.now().toString(),
        text: msgText,
        sender: 'user',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessages(prev => [...prev, tempMsg]);
    }

    try {
      const response = await healthAIService.processMessage(msgText);

      // Refresh logic to get authoritative history and updated profile (if weight changed)
      const updatedHistory = await healthService.getChatHistory();
      setMessages(updatedHistory);

      const updatedProfile = await healthService.getProfile();
      setProfile(updatedProfile);

    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setLoading(false);
    }
  };

  const onClearChat = async () => {
    await healthService.clearChat();
    loadData();
  }

  // Quick Actions Configuration
  const quickActions: QuickActionItem[] = [
    { icon: "dumbbell", label: "Registrar exercício", text: "Quero registrar um exercício", color: colors.sky500 ?? '#0EA5E9' },
    { icon: "food-apple", label: "Dica de dieta", text: "Me dê uma dica de dieta", color: colors.success ?? '#22c55e' },
    { icon: "cup-water", label: "Meta de Água", text: "Qual minha meta de água?", color: colors.warning ?? '#f59e0b' },
    { icon: "calculator", label: "Meu IMC", text: "Qual meu IMC?", color: colors.primary ?? '#3b82f6' },
  ];

  const QuickAction = ({ item }: { item: QuickActionItem }) => (
    <TouchableOpacity
      onPress={() => handleSend(item.text)}
      style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <MaterialCommunityIcons name={item.icon} size={14} color={item.color} />
      <Text style={[styles.quickActionLabel, { color: isDarkMode ? colors.gray300 : '#334155' }]}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 10 }]}>

      {/* HEADER WITH STATS */}
      <View style={[styles.statsHeader, {
        backgroundColor: isDarkMode ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.1)',
        borderColor: isDarkMode ? 'rgba(14, 165, 233, 0.2)' : '#E0F2FE'
      }]}>
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statsLabel}>Peso Atual</Text>
            <Text style={[styles.statsValue, { color: colors.text }]}>
              {profile?.peso ? `${profile.peso} kg` : '-- kg'}
            </Text>
          </View>
          <View style={[styles.statsDivider, { backgroundColor: isDarkMode ? 'rgba(14, 165, 233, 0.3)' : '#BAE6FD' }]} />
          <View>
            <Text style={styles.statsLabel}>Altura</Text>
            <Text style={[styles.statsValue, { color: colors.text }]}>
              {profile?.altura ? `${(profile.altura / 100).toFixed(2)} m` : '-- m'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClearChat} style={styles.statsIconBox}>
          <MaterialCommunityIcons name="delete-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* CHAT LIST */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContent}
        style={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[
            styles.msgContainer,
            item.sender === 'user' ? styles.msgUser : styles.msgAssistant
          ]}>
            <View style={[
              styles.msgBubble,
              item.sender === 'user'
                ? { backgroundColor: '#2563EB', borderTopRightRadius: 4 }
                : {
                  backgroundColor: colors.surface,
                  borderTopLeftRadius: 4,
                  borderWidth: 1,
                  borderColor: colors.border
                }
            ]}>
              <Text style={[
                styles.msgText,
                item.sender === 'user' ? { color: 'white' } : { color: colors.text }
              ]}>{item.text}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          loading ? (
            <View style={styles.msgContainer}>
              <View style={[styles.loadingBubble, { backgroundColor: colors.surface }]}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>GROWUP IA ESTÁ DIGITANDO...</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* QUICK ACTIONS */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsContainer}>
          {quickActions.map((action, idx) => (
            <QuickAction key={idx} item={action} />
          ))}
        </ScrollView>
      </View>

      {/* INPUT AREA */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View style={styles.inputContainer}>
          <View style={[
            styles.inputWrapper,
            {
              backgroundColor: isDarkMode ? colors.gray900 : colors.gray100,
              borderColor: colors.border
            }
          ]}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Como posso ajudar hoje? (Ex: Tenho 75kg)"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { color: colors.text }]}
              onSubmitEditing={() => handleSend()}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              style={[styles.sendButton, (!inputText.trim() || loading) && { opacity: 0.5 }]}
              disabled={!inputText.trim() || loading}
            >
              <MaterialCommunityIcons name="send" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
            Este recurso oferece sugestões — não substitui avaliação médica.
          </Text>
        </View>
      </KeyboardAvoidingView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsHeader: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0EA5E9',
    textTransform: 'uppercase',
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsDivider: {
    width: 1,
    height: 32,
    alignSelf: 'center',
  },
  statsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  chatContent: {
    paddingBottom: 24,
    gap: 16,
  },
  msgContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
  },
  msgUser: {
    justifyContent: 'flex-end',
  },
  msgAssistant: {
    justifyContent: 'flex-start',
  },
  msgBubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 24,
  },
  msgText: {
    fontSize: 16,
    lineHeight: 24,
  },
  loadingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  quickActionsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 8,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2563EB',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    textTransform: 'uppercase',
  },
});
