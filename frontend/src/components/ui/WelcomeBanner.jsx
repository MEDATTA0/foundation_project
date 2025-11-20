import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { COLORS } from "../../constants";

export function WelcomeBanner({ onDismiss }) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  if (dismissed) return null;

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.heading}>Welcome to your teacher panel</Text>
            <Text style={styles.bodyText}>
              Everything you needed to help the children, we did it for you.
            </Text>
          </View>

          <View style={styles.illustrationContainer}>
            <TeacherIllustration />
          </View>
        </View>

        <View style={styles.whiteBorder} />

        {/* <TouchableOpacity
          onPress={handleDismiss}
          style={styles.dismissButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={16} color="#FFFFFF" />
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

function TeacherIllustration() {
  return (
    <Svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <Path d="M5 60 L85 60 L85 70 L5 70 Z" fill="#FFFFFF" opacity="0.95" />
      <Path
        d="M40 12 C40 8, 44 8, 48 12 C52 8, 56 8, 56 12 C56 16, 52 20, 48 20 C44 20, 40 16, 40 12"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <Path d="M44 22 L44 50 L52 50 L52 22 Z" fill="#FFFFFF" opacity="0.95" />
      <Path d="M15 35 L65 35 L65 55 L15 55 Z" fill="#FFFFFF" opacity="0.9" />
      <Path
        d="M18 38 L62 38 L62 52 L18 52 Z"
        fill={COLORS.PRIMARY}
        opacity="0.3"
      />
      <Path d="M17 55 L63 55 L65 60 L15 60 Z" fill="#FFFFFF" opacity="0.85" />
      <Path
        d="M30 28 L15 40 M30 32 L18 42"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.95"
      />
      <Path
        d="M66 28 L80 40 M66 32 L78 42"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.95"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    height: 160,
    position: "relative",
  },
  banner: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    padding: 20,
    position: "relative",
    overflow: "hidden",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 25,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    zIndex: 2,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
    justifyContent: "center",
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 26,
  },
  bodyText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "400",
    opacity: 0.95,
    lineHeight: 20,
  },
  illustrationContainer: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  whiteBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.25)",
    pointerEvents: "none",
    zIndex: 1,
  },
  dismissButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
});
