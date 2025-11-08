import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface VideoPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = (SCREEN_WIDTH * 9) / 16; // 16:9 aspect ratio

export default function VideoPlayer({
  isPlaying,
  onPlayPause,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [showControls, setShowControls] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState('0:00');
  const [videoTotalTime, setVideoTotalTime] = useState('0:00');

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

  // Format milliseconds to MM:SS
  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle video playback status updates
  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      // Update current time
      setVideoCurrentTime(formatTime(status.positionMillis));

      // Update total duration
      if (status.durationMillis) {
        setVideoTotalTime(formatTime(status.durationMillis));
        // Update progress percentage
        const progressPercent = (status.positionMillis / status.durationMillis) * 100;
        setVideoProgress(progressPercent);
      }
    }
  };

  const handleVideoPress = () => {
    setShowControls(true);
    // Hide controls after 3 seconds
    setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Video Component */}
      <Video
        ref={videoRef}
        source={require('@/assets/videos/Lesson.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={false}
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />

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
                  style={[styles.progressBarFill, { width: `${videoProgress}%` }]}
                />
              </View>
            </View>

            {/* Time and Fullscreen */}
            <View style={styles.controlsRow}>
              <Text style={styles.timeText}>
                {videoCurrentTime} / {videoTotalTime}
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
  video: {
    width: '100%',
    height: '100%',
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
