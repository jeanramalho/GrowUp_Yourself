import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { healthService } from '@/services/HealthService';
import { healthAIService } from '@/services/HealthAIService';
import { ChatMessage, HealthProfile } from '@/models/health';
import * as DocumentPicker from 'expo-document-picker';

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
  const [profile, setProfile] = useState<HealthProfile | null>(null);

  const flatListRef = useRef<FlatList>(null);

  // Load Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await healthService.sanitizeHistory();
      const history = await healthService.getChatHistory();
      setMessages(history);

      const userProfile = await healthService.getProfile();
      setProfile(userProfile);

      // Proactive check
      const msg = await healthAIService.checkIn();
      if (msg) {
        setMessages(prev => [...prev, msg]);
      }
    } catch (e) {
      console.error("Error loading health data", e);
    }
  };

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;
    if (loading) return;

    const msgText = text.trim();
    setInputText('');
    setLoading(true);

    try {
      // processMessage handles saving user msg and saving AI response
      await healthAIService.processMessage(msgText);

      // Refresh history and profile
      const updatedHistory = await healthService.getChatHistory();
      setMessages(updatedHistory);

      const updatedProfile = await healthService.getProfile();
      setProfile(updatedProfile);

    } catch (error) {
      console.error("Error sending message", error);
      Alert.alert('Erro', 'Não consegui processar sua mensagem.');
    } finally {
      setLoading(false);
    }
  };

  const onOptionSelect = async (option: { label: string, value: any }) => {
    await handleSend(option.label);
  };

  const onPickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled) {
        setLoading(true);
        const asset = result.assets[0];
        await healthAIService.processMessage(`Analise meu exame: ${asset.name}`);
        const updatedHistory = await healthService.getChatHistory();
        setMessages(updatedHistory);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const onClearChat = async () => {
    Alert.alert(
      'Limpar Conversa',
      'Tem certeza que deseja apagar todo o histórico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar', style: 'destructive', onPress: async () => {
            await healthService.clearChat();
            setMessages([]);
            loadData();
          }
        },
      ]
    );
  }

  // Quick Actions Configuration
  const quickActions: QuickActionItem[] = [
    { icon: "fitness-center", label: "Exercício", text: "Relatório de exercícios", color: colors.sky500 ?? '#0EA5E9' },
    { icon: "chart-bar", label: "Métricas", text: "Métricas de saúde", color: colors.primary ?? '#3b82f6' },
    { icon: "file-document-outline", label: "Exame", text: "Analisar exame", color: colors.warning ?? '#f59e0b' },
    { icon: "food-apple-outline", label: "Dieta", text: "Dieta semanal", color: colors.success ?? '#22c55e' },
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
            <Text style={styles.statsLabel}>Meta Água</Text>
            <Text style={[styles.statsValue, { color: colors.text }]}>
              {profile?.peso ? `${Math.round(profile.peso * 35)} ml` : '-- ml'}
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
        renderItem={({ item }) => {
          const isAI = item.sender === 'ai';
          return (
            <View style={[
              styles.msgContainer,
              !isAI ? styles.msgUser : styles.msgAssistant
            ]}>
              <View style={[
                styles.msgBubble,
                !isAI
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
                  !isAI ? { color: 'white' } : { color: colors.text }
                ]}>{item.text}</Text>

                {item.metadata?.options && isAI && (
                  <View style={styles.optionsContainer}>
                    {item.metadata.options.map((opt: any, idx: number) => (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.optionButton, { borderColor: colors.primary }]}
                        onPress={() => onOptionSelect(opt)}
                      >
                        <Text style={[styles.optionText, { color: colors.primary }]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          loading ? (
            <View style={styles.msgContainer}>
              <View style={[styles.loadingBubble, { backgroundColor: colors.surface }]}>
                <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>IA PENSANDO...</Text>
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
            <TouchableOpacity onPress={onPickDocument} style={styles.attachButton}>
              <MaterialCommunityIcons name="plus" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite sua dúvida de saúde..."
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
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Adjust for tab bar
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  attachButton: {
    padding: 8,
    marginLeft: 4,
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'white'
  },
  optionText: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});
