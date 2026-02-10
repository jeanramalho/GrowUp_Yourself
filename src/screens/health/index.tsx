/**
 * Health pillar main screen
 * Implements an offline AI chat interface for health management
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { theme } from '@/theme/tokens';
import { ChatMessage } from '@/models/health';
import { healthService } from '@/services/HealthService';
import { healthAIService } from '@/services/HealthAIService';
import { ChatBubble } from '@/components/health/ChatBubble';
import { QuickActions } from '@/components/health/QuickActions';

export default function HealthScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await healthService.getChatHistory();
      if (history.length === 0) {
        // Add initial greeting if empty
        await handleSend('Olá', true);
      } else {
        setMessages(history);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSend = async (text: string, isHiddenInit = false) => {
    if (!text.trim()) return;

    const messageText = text.trim();
    setInputText('');
    setIsLoading(true);

    try {
      // Optimistic update for user message (if not hidden init)
      if (!isHiddenInit) {
        const tempUserMsg: ChatMessage = {
          id: Date.now().toString(),
          text: messageText,
          sender: 'user',
          timestamp: new Date().toISOString(),
          type: 'text'
        };
        setMessages(prev => [...prev, tempUserMsg]);
      }

      // Process with AI
      const aiResponse = await healthAIService.processMessage(messageText);

      // Reload history to get correct IDs and order (or just append AI response)
      // For simplicity and correctness with DB IDs, let's reload or append returned msg
      // But processMessage saves both user (if not saved yet? handler does) and AI.
      // HealthAIService.processMessage saves the user message first.

      // Let's just reload history to ensure sync with DB
      const updatedHistory = await healthService.getChatHistory();
      setMessages(updatedHistory);

    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>Assistente de Saúde</Text>
        <TouchableOpacity onPress={() => healthService.clearChat().then(loadChatHistory)}>
          <MaterialCommunityIcons name="delete-outline" size={24} color={theme.colors.gray600} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <QuickActions onAction={(text) => handleSend(text)} />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite aqui..."
            placeholderTextColor={theme.colors.gray500}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={() => handleSend(inputText)}
            disabled={!inputText.trim() || isLoading}
          >
            <MaterialCommunityIcons name="send" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  headerTitle: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  listContent: {
    paddingVertical: theme.spacing.md,
  },
  loadingContainer: {
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.gray100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.gray400,
  },
});
