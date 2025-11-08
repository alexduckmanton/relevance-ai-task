import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface VideoInfoProps {
  title: string;
  description: string;
}

export default function VideoInfo({ title, description }: VideoInfoProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const textDark = useThemeColor({ light: '#1F2937', dark: '#F9FAFB' }, 'textDark');
  const textMedium = useThemeColor({ light: '#6B7280', dark: '#D1D5DB' }, 'textMedium');
  const primaryTeal = useThemeColor({ light: '#0F766E', dark: '#14B8A6' }, 'primaryTeal');

  return (
    <View style={styles.container}>
      <Text
        style={[styles.title, { color: textDark }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {title}
      </Text>

      <View style={styles.descriptionContainer}>
        <Text
          style={[styles.description, { color: textMedium }]}
          numberOfLines={showFullDescription ? undefined : 3}
          ellipsizeMode="tail"
        >
          {description}
        </Text>

        <TouchableOpacity
          onPress={() => setShowFullDescription(!showFullDescription)}
          activeOpacity={0.7}
          style={styles.toggleButton}
        >
          <Text style={[styles.toggleText, { color: primaryTeal }]}>
            {showFullDescription ? 'Show less' : 'Show more'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: 8,
  },
  descriptionContainer: {
    gap: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  toggleButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
