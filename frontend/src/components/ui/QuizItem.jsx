import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants";

/**
 * QuizItem Component
 * Individual quiz item with title and Start button
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Quiz title
 * @param {Function} props.onStart - Start button press handler
 */
export function QuizItem({ title, onStart }) {
  return (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
      <Text className="text-base font-medium text-gray-900 flex-1">
        {title}
      </Text>
      <TouchableOpacity
        onPress={onStart}
        activeOpacity={0.8}
        className="px-6 py-2 rounded-lg"
        style={{ backgroundColor: COLORS.PRIMARY }}
      >
        <Text className="text-white font-semibold text-sm">Start</Text>
      </TouchableOpacity>
    </View>
  );
}
