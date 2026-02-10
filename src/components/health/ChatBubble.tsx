import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { theme } from '@/theme/tokens';
import { ChatMessage } from '@/models/health';

interface ChatBubbleProps {
    message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
    const isUser = message.sender === 'user';

    return (
        <View style={[
            styles.container,
            isUser ? styles.userContainer : styles.aiContainer
        ]}>
            <View style={[
                styles.bubble,
                isUser ? styles.userBubble : styles.aiBubble
            ]}>
                <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
                    {message.text}
                </Text>
                <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: theme.spacing.md,
        marginVertical: 4,
        flexDirection: 'row',
    },
    userContainer: {
        justifyContent: 'flex-end',
    },
    aiContainer: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        elevation: 1,
    },
    userBubble: {
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: theme.colors.white,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: theme.colors.gray200,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
    },
    userText: {
        color: theme.colors.white,
    },
    aiText: {
        color: theme.colors.text,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    userTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    aiTimestamp: {
        color: theme.colors.gray500,
    }
});
