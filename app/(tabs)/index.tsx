import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeColor } from '@/hooks/use-theme-color';
import VideoPlayer from '@/components/VideoPlayer';
import VideoInfo from '@/components/VideoInfo';
import ActionButtons from '@/components/ActionButtons';
import ConversationDrawer from '@/components/ConversationDrawer';
import type { Message } from '@/components/MessageBubble';

export default function HomeScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'user',
      text: 'Can you explain the main concept from this video?',
      timestamp: '2:30 PM',
    },
    {
      id: '2',
      type: 'ai',
      text: 'Of course! The video covers the fundamentals of React hooks. The main concept is that hooks allow you to use state and other React features without writing a class component.',
      timestamp: '2:30 PM',
    },
    {
      id: '3',
      type: 'user',
      text: 'What are the most important hooks to know?',
      timestamp: '2:31 PM',
    },
    {
      id: '4',
      type: 'ai',
      text: 'The most essential hooks are useState for managing state, useEffect for side effects, and useContext for accessing context. These three will cover most of your needs when starting out!',
      timestamp: '2:31 PM',
    },
  ]);

  const bgPage = useThemeColor({ light: '#F9FAFB', dark: '#1F2937' }, 'bgPage');

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleInputFocus = () => {
    if (isPlaying) {
      setIsPlaying(false);
    }
    // Auto-expand drawer when focusing input
    if (!isDrawerExpanded) {
      setIsDrawerExpanded(true);
    }
  };

  const handleSubmitQuestion = () => {
    if (!inputValue.trim()) return;

    // Create user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };

    // Create AI response (mock)
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      text: 'Great question! Let me help you understand that better. This is a mock response that demonstrates the conversation flow.',
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };

    setMessages([...messages, newUserMessage, aiResponse]);
    setInputValue('');
    setIsDrawerExpanded(true); // Auto-expand drawer on submit
  };

  const handleSelectPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPage }]} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          {/* Main Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Video Player */}
            <VideoPlayer
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              currentTime="2:34"
              totalTime="15:42"
              progress={16}
            />

            {/* Video Info */}
            <VideoInfo
              title="Introduction to React Hooks - Complete Guide for Beginners"
              description="Learn everything you need to know about React Hooks in this comprehensive tutorial. We'll cover useState, useEffect, useContext, and more advanced hooks. Perfect for developers who want to understand modern React development patterns and best practices."
            />

            {/* Action Buttons */}
            <ActionButtons />

            {/* Spacer to prevent content hiding under drawer */}
            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Conversation Drawer */}
          <ConversationDrawer
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmit={handleSubmitQuestion}
            onInputFocus={handleInputFocus}
            onSelectPrompt={handleSelectPrompt}
            isExpanded={isDrawerExpanded}
            onExpandChange={setIsDrawerExpanded}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 200, // Extra space to prevent content hiding under drawer
  },
  bottomSpacer: {
    height: 100,
  },
});
