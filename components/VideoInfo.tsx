import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface VideoInfoProps {
  title: string;
  description: string;
}

export default function VideoInfo({ title, description }: VideoInfoProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const height = useSharedValue(0);

  const textDark = useThemeColor({ light: '#1F2937', dark: '#F9FAFB' }, 'textDark');
  const textMedium = useThemeColor({ light: '#6B7280', dark: '#D1D5DB' }, 'textMedium');
  const primaryTeal = useThemeColor({ light: '#0F766E', dark: '#14B8A6' }, 'primaryTeal');

  // Initialize animation value once both heights are measured
  useEffect(() => {
    if (collapsedHeight > 0 && expandedHeight > 0 && !isReady) {
      height.value = collapsedHeight; // Start in collapsed state
      setIsReady(true);
    }
  }, [collapsedHeight, expandedHeight, isReady]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: isReady ? height.value : 'auto',
      overflow: 'hidden',
    };
  });

  const toggleDescription = () => {
    if (!isReady) return; // Don't allow toggle until measurements complete

    const targetHeight = showFullDescription ? collapsedHeight : expandedHeight;

    // Animate to target height with spring (300ms, gentle damping)
    height.value = withSpring(targetHeight, {
      damping: 15,
      stiffness: 150,
      mass: 1,
    });

    setShowFullDescription(!showFullDescription);
  };

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
        {/* Visible animated text */}
        <Animated.View style={animatedStyle}>
          <Text
            style={[styles.description, { color: textMedium }]}
            numberOfLines={showFullDescription ? undefined : 3}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        </Animated.View>

        {/* Hidden measurement elements - only render until both heights measured */}
        {!isReady && (
          <View style={{ position: 'absolute', opacity: 0, left: -9999 }}>
            <Text
              style={[styles.description, { color: textMedium }]}
              numberOfLines={3}
              onLayout={(e) => setCollapsedHeight(e.nativeEvent.layout.height)}
            >
              {description}
            </Text>
            <Text
              style={[styles.description, { color: textMedium }]}
              onLayout={(e) => setExpandedHeight(e.nativeEvent.layout.height)}
            >
              {description}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={toggleDescription}
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
