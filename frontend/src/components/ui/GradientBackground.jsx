import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../constants";

/**
 * GradientBackground Component
 * Provides a gradient background matching the design
 * Subtle gradient from light gray to white to light gray
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array} props.colors - Gradient colors array
 * @param {Object} props.start - Start position {x, y}
 * @param {Object} props.end - End position {x, y}
 */
export function GradientBackground({
  children,
  colors = [
    "#F9FAFB", // GRAY_50 - lightest
    "#FFFFFF", // White
    "#F3F4F6", // GRAY_100 - slightly darker
  ],
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
}) {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={styles.gradient}
    >
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
  },
});
