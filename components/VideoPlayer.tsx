import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface VideoPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime?: string;
  totalTime?: string;
  progress?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = (SCREEN_WIDTH * 9) / 16; // 16:9 aspect ratio

export default function VideoPlayer({
  isPlaying,
  onPlayPause,
  currentTime = '0:00',
  totalTime = '0:00',
  progress = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [showControls, setShowControls] = useState(true);

  // Sync video playback with isPlaying prop
  React.useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [isPlaying]);

  const handleVideoPress = () => {
    setShowControls(true);
    // Hide controls after 3 seconds
    setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Video Placeholder - Using a gradient background with emoji */}
      <View style={styles.videoPlaceholder}>
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.placeholderEmoji}>📚</Text>
          <Text style={styles.placeholderText}>Video Placeholder</Text>
        </LinearGradient>
      </View>

      {/* Controls Overlay */}
      <TouchableOpacity
        style={styles.controlsOverlay}
        activeOpacity={1}
        onPress={handleVideoPress}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.controlsGradient}
        >
          {/* Center Play/Pause Button */}
          <View style={styles.centerControl}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={onPlayPause}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={48}
                color="white"
              />
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[styles.progressBarFill, { width: `${progress}%` }]}
                />
              </View>
            </View>

            {/* Time and Fullscreen */}
            <View style={styles.controlsRow}>
              <Text style={styles.timeText}>
                {currentTime} / {totalTime}
              </Text>
              <TouchableOpacity style={styles.fullscreenButton}>
                <Ionicons name="expand" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  placeholderText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.7,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  controlsGradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  centerControl: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1 }],
  },
  bottomControls: {
    paddingHorizontal: 16,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
  fullscreenButton: {
    padding: 4,
  },
});
