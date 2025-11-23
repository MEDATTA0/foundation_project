import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import Video from "react-native-video";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants";

export const VideoPlayer = ({ uri, onClose }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Validate URI is not a YouTube/Vimeo URL - prevent rendering if invalid
  const isValidVideoUri =
    uri &&
    !uri.includes("youtube.com") &&
    !uri.includes("youtu.be") &&
    !uri.includes("vimeo.com");

  useEffect(() => {
    if (uri && !isValidVideoUri) {
      Alert.alert(
        "Invalid Video Format",
        "YouTube and Vimeo videos must be played using WebView, not the native video player. Please use the WebView player instead.",
        [{ text: "OK", onPress: onClose }]
      );
    }
  }, [uri, isValidVideoUri, onClose]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const handleLoad = (data) => {
    setDuration(data.duration);
    setShowControls(true);
  };

  const handleEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const seekTo = (time) => {
    if (videoRef.current) {
      videoRef.current.seek(time);
      setCurrentTime(time);
    }
  };

  const handleError = (error) => {
    console.error("Video player error:", error);

    // Check if it's Error 153 (configuration error)
    if (error?.errorCode === 153 || error?.errorString?.includes("153")) {
      Alert.alert(
        "Video Format Error",
        "This video format is not supported. Please ensure you're using a direct video file URL (MP4, AVI, MOV) and not a YouTube/Vimeo link.",
        [
          {
            text: "OK",
            onPress: onClose,
          },
        ]
      );
    } else {
      Alert.alert(
        "Playback Error",
        error?.errorString ||
          "Unable to play this video. Please check the video format or try downloading it first.",
        [
          {
            text: "OK",
            onPress: onClose,
          },
        ]
      );
    }
  };

  // Don't render Video component if URI is invalid
  if (!isValidVideoUri) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="white" />
          <Text style={styles.errorText}>
            Invalid video URL. YouTube and Vimeo videos must use WebView.
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        paused={!isPlaying}
        resizeMode="contain"
        onProgress={handleProgress}
        onLoad={handleLoad}
        onEnd={handleEnd}
        onError={handleError}
        repeat={false}
        controls={false}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        posterResizeMode="contain"
      />

      {/* Custom Controls Overlay */}
      {showControls && (
        <View style={styles.controlsOverlay}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={togglePlayPause}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={48}
              color="white"
            />
          </TouchableOpacity>

          {/* Progress Bar */}
          {duration > 0 && (
            <View style={styles.progressContainer}>
              <TouchableOpacity
                style={styles.progressBarContainer}
                onPress={(e) => {
                  const { locationX } = e.nativeEvent;
                  const progress =
                    (locationX / e.nativeEvent.target.offsetWidth) * duration;
                  seekTo(progress);
                }}
                activeOpacity={1}
              >
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${(currentTime / duration) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Time Display */}
          {duration > 0 && (
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {formatTime(currentTime * 1000)} / {formatTime(duration * 1000)}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const formatTime = (millis) => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 250,
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  progressBarContainer: {
    width: "100%",
    paddingVertical: 10,
  },
  progressBarBackground: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  controlsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: 8,
  },
  playPauseButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 35,
    padding: 15,
  },
  progressContainer: {
    position: "absolute",
    bottom: 50,
    left: 10,
    right: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.PRIMARY,
  },
  timeContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    alignItems: "center",
  },
  timeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
