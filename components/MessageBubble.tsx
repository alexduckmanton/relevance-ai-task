import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user';

  const userMessageBg = useThemeColor({ light: '#0F766E', dark: '#14B8A6' }, 'userMessage');
  const aiMessageBg = useThemeColor({ light: '#F3F4F6', dark: '#374151' }, 'aiMessage');
  const textDark = useThemeColor({ light: '#1F2937', dark: '#F9FAFB' }, 'textDark');
  const textMuted = useThemeColor({ light: '#6B7280', dark: '#9CA3AF' }, 'textMuted');

  const backgroundColor = isUser ? userMessageBg : aiMessageBg;
  const textColor = isUser ? 'white' : textDark;

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View
        style={[
          styles.bubble,
          { backgroundColor },
          isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={[styles.messageText, { color: textColor }]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 4,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
});
