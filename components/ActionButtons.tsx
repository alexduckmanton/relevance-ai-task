import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ActionButton {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}

const actions: ActionButton[] = [
  { icon: 'bookmark-outline', label: 'Save for later' },
  { icon: 'card-outline', label: 'Make flashcards' },
  { icon: 'document-text-outline', label: 'Study notes' },
  { icon: 'help-circle-outline', label: 'Quiz me' },
];

export default function ActionButtons() {
  const primaryTeal = useThemeColor({ light: '#0F766E', dark: '#14B8A6' }, 'primaryTeal');
  const textDark = useThemeColor({ light: '#1F2937', dark: '#F9FAFB' }, 'textDark');
  const bgLight = useThemeColor({ light: '#F3F4F6', dark: '#374151' }, 'bgLight');
  const bgActive = useThemeColor({ light: '#E5E7EB', dark: '#4B5563' }, 'bgActive');

  const handlePress = (label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(`Action pressed: ${label}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, { backgroundColor: bgLight }]}
            onPress={() => handlePress(action.label)}
            activeOpacity={0.7}
          >
            <Ionicons name={action.icon} size={20} color={primaryTeal} />
            <Text
              style={[styles.label, { color: textDark }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    minHeight: 44, // iOS minimum touch target
    gap: 8,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },
});
