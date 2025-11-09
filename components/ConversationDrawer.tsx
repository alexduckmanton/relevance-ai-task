import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, useBottomSheet } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import InputSection from './InputSection';
import MessageBubble, { Message } from './MessageBubble';
import QuestionPrompts from './QuestionPrompts';

interface ConversationDrawerProps {
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onInputFocus: () => void;
  onSelectPrompt: (prompt: string) => void;
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

// Animated Messages Section - must be inside BottomSheet to use useBottomSheet hook
interface AnimatedMessagesSectionProps {
  messages: Message[];
  flatListRef: React.RefObject<FlatList | null>;
  textDark: string;
  onExpandChange: (expanded: boolean) => void;
}

function AnimatedMessagesSection({ messages, flatListRef, textDark, onExpandChange }: AnimatedMessagesSectionProps) {
  const { animatedIndex } = useBottomSheet();

  // Animate both height and opacity based on bottom sheet position
  const animatedStyle = useAnimatedStyle(() => {
    // Height: animates from 0 to 288px across full range
    var maxHeight = messages.length > 0 ? 288 : 0;
    const height = interpolate(
      animatedIndex.value,
      [0, 1],
      [0, maxHeight],
      'clamp'
    );

    // Opacity: starts fading in at 30% of expansion
    const opacity = interpolate(
      animatedIndex.value,
      [0, 0.3, 1], // Start fading in at 30% of expansion
      [0, 0, 1],   // From invisible to fully visible
      'clamp'
    );

    return {
      height,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[styles.animatedMessagesSection, animatedStyle]}
      pointerEvents="box-none" // Allow touches to pass through when transparent
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-down"
          size={24}
          color={textDark}
          onPress={() => onExpandChange(false)}
        />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={true}
        style={styles.messagesContainer}
        keyboardShouldPersistTaps="always"
      />
    </Animated.View>
  );
}

export default function ConversationDrawer({
  messages,
  inputValue,
  onInputChange,
  onSubmit,
  onInputFocus,
  onSelectPrompt,
  isExpanded,
  onExpandChange,
}: ConversationDrawerProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList>(null);

  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#151718' }, 'background');
  const textDark = useThemeColor({ light: '#1F2937', dark: '#F9FAFB' }, 'textDark');

  // Snap points: collapsed (200px for input + prompts), expanded (90% of screen)
  const snapPoints = useMemo(() => ['90%'], []);
  const snapPointsEmpty = useMemo(() => ['57%'], []);

  // Sync isExpanded prop with bottom sheet snap position
  useEffect(() => {
    if (isExpanded) {
      bottomSheetRef.current?.snapToIndex(1); // Expand
    } else {
      bottomSheetRef.current?.snapToIndex(0); // Collapse
    }
  }, [isExpanded]);

  // Fires immediately when user releases finger (before animation starts)
  // This enables keyboard to respond during animation, not after
  const handleAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      onExpandChange(toIndex === 1);
    },
    [onExpandChange]
  );

  // Fires after animation completes - safety net to ensure final state is correct
  const handleSheetChange = useCallback(
    (index: number) => {
      const shouldExpand = index === 1;
      // Only update if state differs (usually onAnimate already handled it)
      if (isExpanded !== shouldExpand) {
        onExpandChange(shouldExpand);
      }
    },
    [isExpanded, onExpandChange]
  );

  // Track previous messages reference to detect updates (not just length changes)
  const prevMessagesRef = useRef<Message[]>(messages);

  // Scroll to bottom when messages change (including when loading completes)
  useEffect(() => {
    const messagesChanged = prevMessagesRef.current !== messages;

    if (messagesChanged && messages.length > 0 && isExpanded) {
      // Update ref for next comparison
      prevMessagesRef.current = messages;

      // Scroll to bottom with delay to allow render
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150); // Slightly longer delay for loading→content transition
    }
  }, [messages, isExpanded]);

  // Render backdrop (semi-transparent overlay when expanded)
  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
        opacity={0.3}
      />
    ),
    []
  );

  // Render custom handle
  const renderHandle = () => (
    <View style={styles.handleContainer}>
      <View style={styles.handleBar} />
    </View>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={(messages.length > 0) ? snapPoints : snapPointsEmpty}
      onAnimate={handleAnimate}
      onChange={handleSheetChange}
      enablePanDownToClose={false}
      backdropComponent={renderBackdrop}
      handleComponent={renderHandle}
      backgroundStyle={[styles.sheetBackground, { backgroundColor }]}
      style={styles.sheet}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustPan"
    >
      <BottomSheetView style={styles.contentContainer}>
        {/* Animated Messages Section - fades in/out smoothly */}
        <AnimatedMessagesSection
          messages={messages}
          flatListRef={flatListRef}
          textDark={textDark}
          onExpandChange={onExpandChange}
        />

        {/* Always visible section */}
        <View style={styles.fixedSection}>
          <QuestionPrompts onSelectPrompt={onSelectPrompt} />
          <InputSection
            value={inputValue}
            onChange={onInputChange}
            onSubmit={onSubmit}
            onFocus={onInputFocus}
            shouldFocus={isExpanded}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sheetBackground: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
  },
  animatedMessagesSection: {
    flex: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    zIndex: 999
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    height: 288,
  },
  messagesList: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  fixedSection: {
    paddingBottom: 40,
  },
});
