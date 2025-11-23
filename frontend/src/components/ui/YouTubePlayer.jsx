import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";

export const YouTubePlayer = ({ videoId, onClose, onVideoEnd }) => {
  const [playing, setPlaying] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  // Handle orientation changes and unlock screen rotation
  useEffect(() => {
    // Unlock orientation when component mounts
    ScreenOrientation.unlockAsync();

    // Listen for dimension changes (orientation changes)
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });

    // Lock back to portrait when component unmounts
    return () => {
      subscription?.remove();
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, []);

  // Handle close - lock back to portrait
  const handleClose = () => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    onClose();
  };

  const isLandscape = dimensions.width > dimensions.height;
  const playerHeight = isLandscape
    ? dimensions.height
    : dimensions.height * 0.6;
  const playerWidth = dimensions.width;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.playerContainer}>
        <YoutubePlayer
          height={playerHeight}
          width={playerWidth}
          play={playing}
          videoId={videoId}
          onChangeState={(event) => {
            if (event === "ended") {
              setPlaying(false);
              if (onVideoEnd) {
                onVideoEnd();
              }
            }
          }}
          onError={(error) => {
            console.error("YouTube player error:", error);
            setPlaying(false);
          }}
          webViewStyle={styles.webview}
          webViewProps={{
            allowsFullscreenVideo: true,
            mediaPlaybackRequiresUserAction: false,
          }}
          initialPlayerParams={{
            modestbranding: true,
            rel: false,
            controls: true,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: 8,
  },
  playerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webview: {
    backgroundColor: "#000",
  },
});
