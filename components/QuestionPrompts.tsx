import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '@/hooks/use-theme-color';

interface QuestionPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  "What does that mean?",
  "Explain this concept",
  "Why is this important?",
  "Give me an example",
  "How does this work?",
  "What's the key takeaway?"
];

export default function QuestionPrompts({ onSelectPrompt }: QuestionPromptsProps) {
  const [showFade, setShowFade] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  const bgLight = useThemeColor({ light: '#F3F4F6', dark: '#374151' }, 'bgLight');
  const textDark = useThemeColor({ light: '#1F2937', dark: '#F9FAFB' }, 'textDark');
  const bgPage = useThemeColor({ light: '#F9FAFB', dark: '#1F2937' }, 'bgPage');

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 10;
    setShowFade(!isAtEnd);
  };

  const handleSelectPrompt = (prompt: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectPrompt(prompt);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {prompts.map((prompt, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.promptButton, { backgroundColor: bgLight }]}
            onPress={() => handleSelectPrompt(prompt)}
            activeOpacity={0.7}
          >
            <Text style={[styles.promptText, { color: textDark }]}>
              {prompt}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Fade gradient on the right */}
      {showFade && (
        <LinearGradient
          colors={['transparent', bgPage]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fadeGradient}
          pointerEvents="none"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  promptButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999, // fully rounded
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptText: {
    fontSize: 14,
    fontWeight: '500',
  },
  fadeGradient: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 48,
  },
});
