import ActionButtons from '@/components/ActionButtons';
import ConversationDrawer from '@/components/ConversationDrawer';
import type { Message } from '@/components/MessageBubble';
import VideoInfo from '@/components/VideoInfo';
import VideoPlayer from '@/components/VideoPlayer';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    // {
    //   id: '1',
    //   type: 'user',
    //   text: 'What does that mean?',
    //   timestamp: '2:30 PM',
    // },
    // {
    //   id: '2',
    //   type: 'ai',
    //   text: 'A derivative measures how fast something is changing at a specific moment - like the instantaneous speed of a car or the slope of a curve at a single point.',
    //   timestamp: '2:30 PM',
    // },
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

  // Track pending AI responses for cleanup on unmount
  const pendingResponsesRef = useRef<Set<string>>(new Set());

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

    // Create AI placeholder message with loading state
    const aiMessageId = (Date.now() + 1).toString();
    const aiPlaceholder: Message = {
      id: aiMessageId,
      type: 'ai',
      text: '', // Empty text while loading
      timestamp: timestamp,
      isLoading: true, // Show typing indicator
    };

    // Add both messages immediately (user message + loading placeholder)
    setMessages((prevMessages) => [...prevMessages, newUserMessage, aiPlaceholder]);

    // Track this pending response
    pendingResponsesRef.current.add(aiMessageId);

    // Auto-expand drawer to show conversation
    setIsDrawerExpanded(true);

    // Pause video when message is submitted
    if (isPlaying) {
      setIsPlaying(false);
    }

    // Simulate AI response after 2 second delay
    setTimeout(() => {
      // Check if this response is still pending (wasn't cancelled)
      if (!pendingResponsesRef.current.has(aiMessageId)) {
        return; // Response was cancelled
      }

      // Remove from pending set
      pendingResponsesRef.current.delete(aiMessageId);

      // Update the placeholder message with actual response
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                text: 'A derivative measures how fast something is changing at a specific moment - like the instantaneous speed of a car or the slope of a curve at a single point.',
                isLoading: false, // Remove loading state
              }
            : msg
        )
      );
    }, 2000); // 2 second delay
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

  // Cleanup pending responses on unmount
  useEffect(() => {
    return () => {
      pendingResponsesRef.current.clear();
    };
  }, []);

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
