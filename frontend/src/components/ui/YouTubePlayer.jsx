import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const YouTubePlayer = ({ videoId, onClose }) => {
  const [playing, setPlaying] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.playerContainer}>
        <YoutubePlayer
          height={SCREEN_HEIGHT * 0.6}
          width={SCREEN_WIDTH}
          play={playing}
          videoId={videoId}
          onChangeState={(event) => {
            if (event === "ended") {
              setPlaying(false);
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
