import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";

export const WebViewPlayer = ({ uri, onClose, isVimeo, onVideoEnd }) => {
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
  // For Vimeo, use direct embed URL with HTML injection
  const getVimeoHTML = (embedUrl) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            body {
              margin: 0;
              padding: 0;
              background: #000;
              overflow: hidden;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <iframe
            src="${embedUrl}"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </body>
      </html>
    `;
  };

  const htmlContent = isVimeo ? getVimeoHTML(uri) : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={28} color="white" />
      </TouchableOpacity>

      {htmlContent ? (
        <WebView
          source={{ html: htmlContent }}
          style={styles.webview}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          originWhitelist={["*"]}
          mixedContentMode="always"
          sharedCookiesEnabled={true}
        />
      ) : (
        <WebView
          source={{ uri }}
          style={styles.webview}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          originWhitelist={["*"]}
          mixedContentMode="always"
          sharedCookiesEnabled={true}
        />
      )}
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
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
});
