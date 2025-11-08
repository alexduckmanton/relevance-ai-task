import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '@/hooks/use-theme-color';

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFocus: () => void;
}

export default function InputSection({
  value,
  onChange,
  onSubmit,
  onFocus,
}: InputSectionProps) {
  const textDark = useThemeColor({ light: '#1F2937', dark: '#F9FAFB' }, 'textDark');
  const textMuted = useThemeColor({ light: '#9CA3AF', dark: '#9CA3AF' }, 'textMuted');
  const bgLight = useThemeColor({ light: '#F3F4F6', dark: '#374151' }, 'bgLight');
  const primaryTeal = useThemeColor({ light: '#0F766E', dark: '#14B8A6' }, 'primaryTeal');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#4B5563' }, 'bgActive');

  const handleSubmit = () => {
    if (value.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSubmit();
    }
  };

  const handleMicPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Microphone pressed');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputWrapper, { backgroundColor: bgLight, borderColor }]}>
        <TextInput
          style={[styles.input, { color: textDark }]}
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          onSubmitEditing={handleSubmit}
          placeholder="Ask anything..."
          placeholderTextColor={textMuted}
          returnKeyType="send"
          multiline
          maxLength={500}
        />

        <View style={styles.buttonsContainer}>
          {/* Microphone button - always visible */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleMicPress}
            activeOpacity={0.7}
          >
            <Ionicons name="mic-outline" size={20} color={textMuted} />
          </TouchableOpacity>

          {/* Send button - only visible when text is entered */}
          {value.trim() && (
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: primaryTeal }]}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingRight: 8,
    minHeight: 48,
    position: 'relative',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 80, // Space for buttons
    fontSize: 16,
    maxHeight: 120,
    ...Platform.select({
      ios: {
        paddingTop: 14,
      },
    }),
  },
  buttonsContainer: {
    position: 'absolute',
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
