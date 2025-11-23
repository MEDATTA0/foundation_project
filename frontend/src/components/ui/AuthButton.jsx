import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { COLORS } from "../../constants";

export function AuthButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      className={`rounded-lg px-8 items-center justify-center min-h-[52px] ${
        disabled || loading ? "opacity-60" : ""
      }`}
      style={{ backgroundColor: COLORS.PRIMARY }}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className="text-white text-base font-semibold">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
