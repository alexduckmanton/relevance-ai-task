import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  const [showControls, setShowControls] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState('0:00');
  const [videoTotalTime, setVideoTotalTime] = useState('0:00');

  // Create video player instance
  const player = useVideoPlayer(require('@/assets/videos/Lesson.mp4'), (player) => {
    player.loop = false;
    player.play();
  });

  // Sync video playback with isPlaying prop
  useEffect(() => {
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, player]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Update video progress and time displays
  useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        const currentTime = player.currentTime || 0;
        const duration = player.duration || 0;

        // Update current time
        setVideoCurrentTime(formatTime(currentTime));

        // Update total duration
        if (duration > 0) {
          setVideoTotalTime(formatTime(duration));
          // Update progress percentage
          const progressPercent = (currentTime / duration) * 100;
          setVideoProgress(progressPercent);
        }
      }
    }, 100); // Update every 100ms for smooth progress bar

    return () => clearInterval(interval);
  }, [player]);

  const handleVideoPress = () => {
    setShowControls(true);
    // Hide controls after 3 seconds
    setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Video Component */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls={false}
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
                size={40}
                color="white"
              />
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            {/* Time and Fullscreen */}
            <View style={styles.controlsRow}>
              <Text style={styles.timeText}>
                {player.currentTime < 0 ? '0:00' : videoCurrentTime} / {videoTotalTime}
              </Text>
              <TouchableOpacity style={styles.fullscreenButton}>
                <Ionicons name="expand" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[styles.progressBarFill, { width: `${videoProgress}%` }]}
                />
              </View>
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
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  progressBarContainer: {
    marginTop: 8,
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
