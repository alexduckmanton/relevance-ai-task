import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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

  // Snap points: collapsed (auto-size for input + prompts), expanded (80% of screen)
  const snapPoints = useMemo(() => ['90%'], []);

  // Sync isExpanded prop with bottom sheet snap position
  useEffect(() => {
    if (isExpanded) {
      bottomSheetRef.current?.snapToIndex(1); // Expand
    } else {
      bottomSheetRef.current?.snapToIndex(0); // Collapse
    }
  }, [isExpanded]);

  const handleSheetChange = (index: number) => {
    onExpandChange(index === 1);
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && isExpanded) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isExpanded]);

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
      snapPoints={snapPoints}
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
        {/* Header - only visible when expanded */}
        {isExpanded && (
          <View style={styles.header}>
            <Ionicons
              name="chevron-down"
              size={24}
              color={textDark}
              onPress={() => onExpandChange(false)}
            />
          </View>
        )}

        {/* Messages - only visible when expanded */}
        {isExpanded && (
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
        )}

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
