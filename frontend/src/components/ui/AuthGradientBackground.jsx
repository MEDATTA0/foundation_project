import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { COLORS } from "../../constants";

/**
 * AuthGradientBackground Component
 * Light gradient background for auth screens (purple to yellow to green)
 */
export function AuthGradientBackground({ children }) {
  return (
    <LinearGradient
      colors={[
        COLORS.GRADIENT_START,
        COLORS.GRADIENT_MIDDLE,
        COLORS.GRADIENT_END,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1 w-full h-full"
    >
      <View className="flex-1">{children}</View>
    </LinearGradient>
  );
}
