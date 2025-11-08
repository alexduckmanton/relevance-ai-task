import ActionButtons from '@/components/ActionButtons';
import ConversationDrawer from '@/components/ConversationDrawer';
import type { Message } from '@/components/MessageBubble';
import VideoInfo from '@/components/VideoInfo';
import VideoPlayer from '@/components/VideoPlayer';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'user',
      text: 'What does that mean?',
      timestamp: '2:30 PM',
    },
    {
      id: '2',
      type: 'ai',
      text: 'A derivative measures how fast something is changing at a specific moment - like the instantaneous speed of a car or the slope of a curve at a single point.',
      timestamp: '2:30 PM',
    },
    // {
    //   id: '3',
    //   type: 'user',
    //   text: 'What are the most important hooks to know?',
    //   timestamp: '2:31 PM',
    // },
    // {
    //   id: '4',
    //   type: 'ai',
    //   text: 'The most essential hooks are useState for managing state, useEffect for side effects, and useContext for accessing context. These three will cover most of your needs when starting out!',
    //   timestamp: '2:31 PM',
    // },
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

  // Shared logic for adding messages to conversation
  const addMessageToConversation = (text: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    // Create user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: text,
      timestamp: timestamp,
    };

    // Create AI response (mock)
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      text: 'Great question! Let me help you understand that better. This is a mock response that demonstrates the conversation flow.',
      timestamp: timestamp,
    };

    // Update messages with functional update to avoid stale closure
    setMessages((prevMessages) => [...prevMessages, newUserMessage, aiResponse]);

    // Auto-expand drawer to show conversation
    setIsDrawerExpanded(true);

    // Pause video when message is submitted
    if (isPlaying) {
      setIsPlaying(false);
    }
  };

  const handleSubmitQuestion = () => {
    if (!inputValue.trim()) return;

    addMessageToConversation(inputValue);
    setInputValue(''); // Clear input after submit
  };

  const handleSelectPrompt = (prompt: string) => {
    // Auto-submit the prompt immediately (don't populate input field)
    addMessageToConversation(prompt);
  };

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPage }]} edges={['top']}>
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
            />

            {/* Video Info */}
            <VideoInfo
              title="Introduction to Calculus: Understanding Derivatives"
              description="Learn the fundamental concepts of derivatives in calculus. This comprehensive tutorial covers the basic principles, real-world applications, and step-by-step examples to help you master this essential mathematical concept. Perfect for high school and college students."
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
