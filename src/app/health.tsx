import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function HealthScreen() {
  const { colors, isDarkMode, shadows } = useAppTheme();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá, Jean! Analisei seu perfil (78kg, 1.78m). Seu IMC é 24.6 (Saudável). Hoje é dia de treino HIIT, quer registrar agora ou prefere uma dica de nutrição?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return;

    const userMsg = text;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Recebi: "${userMsg}". Esta é uma resposta simulada da IA.`
      }]);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    // Scroll to bottom on new message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, loading]);

  const QuickAction = ({ icon, label, color }: { icon: any, label: string, color: string }) => (
    <TouchableOpacity
      onPress={() => handleSend(label)}
      style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <MaterialCommunityIcons name={icon} size={14} color={color} />
      <Text style={[styles.quickActionLabel, { color: isDarkMode ? colors.gray300 : '#334155' }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Stats Header */}
      <View style={[styles.statsHeader, {
        backgroundColor: isDarkMode ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.1)', // sky-500/10
        borderColor: isDarkMode ? 'rgba(14, 165, 233, 0.2)' : '#E0F2FE' // sky-900/30 vs sky-100
      }]}>
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statsLabel}>Peso Atual</Text>
            <Text style={[styles.statsValue, { color: colors.text }]}>78.0 kg</Text>
          </View>
          <View style={[styles.statsDivider, { backgroundColor: isDarkMode ? 'rgba(14, 165, 233, 0.3)' : '#BAE6FD' }]} />
          <View>
            <Text style={styles.statsLabel}>Meta</Text>
            <Text style={[styles.statsValue, { color: colors.text }]}>75.0 kg</Text>
          </View>
        </View>
        <View style={styles.statsIconBox}>
          <MaterialCommunityIcons name="brain" size={20} color="white" />
        </View>
      </View>

      {/* Chat List */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatList}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m, i) => (
          <View key={i} style={[
            styles.msgContainer,
            m.role === 'user' ? styles.msgUser : styles.msgAssistant
          ]}>
            <View style={[
              styles.msgBubble,
              m.role === 'user'
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
                m.role === 'user' ? { color: 'white' } : { color: colors.text }
              ]}>{m.content}</Text>
            </View>
          </View>
        ))}
        {loading && (
          <View style={styles.msgContainer}>
            <View style={[styles.loadingBubble, { backgroundColor: colors.surface }]}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>GROWUP IA ESTÁ DIGITANDO...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Actions */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsContainer}>
          <QuickAction icon="dumbbell" label="Registrar exercício" color={colors.sky500} />
          <QuickAction icon="food-apple" label="Dica de dieta" color={colors.success} />
          <QuickAction icon="clipboard-list" label="Adicionar exame" color={colors.warning} />
        </ScrollView>
      </View>

      {/* Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80}>
        <View style={styles.inputContainer}>
          <View style={[
            styles.inputWrapper,
            {
              backgroundColor: isDarkMode ? colors.gray900 : colors.gray100,
              borderColor: colors.border
            }
          ]}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Como posso ajudar hoje?"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { color: colors.text }]}
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              style={styles.sendButton}
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
    paddingTop: 24, // Added padding to separate from Header
  },
  statsHeader: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statsLabel: {
    fontSize: 10,
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
    borderRadius: 12, // rounded-2xl in React
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
    fontSize: 14,
    lineHeight: 20,
  },
  loadingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
  loadingText: {
    fontSize: 10,
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
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputContainer: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80, // Space for CustomTabBar
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
    paddingVertical: 8, // adjust
    fontSize: 14,
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
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
    textTransform: 'uppercase',
  },
});
