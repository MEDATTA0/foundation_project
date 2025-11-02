import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../../constants";

/**
 * AppLogo Component
 * Circular logo with 'L=' symbol matching the design
 */
export function AppLogo({ size = 100 }) {
  return (
    <View
      className="bg-white border-2 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderColor: COLORS.PRIMARY,
      }}
    >
      <Text
        className="font-bold"
        style={{
          fontSize: size * 0.4,
          color: COLORS.LOGO_BLUE,
          letterSpacing: -2,
        }}
      >
        CC
      </Text>
    </View>
  );
}
