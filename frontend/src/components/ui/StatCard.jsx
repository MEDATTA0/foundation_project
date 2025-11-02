import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../../constants";

/**
 * StatCard Component
 * Yellow card displaying a statistic with icon and value
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label text
 * @param {string} props.value - Value to display
 * @param {string} props.icon - Icon emoji or text
 */
export function StatCard({ label, value, icon }) {
  return (
    <View
      style={{
        backgroundColor: COLORS.ACCENT_YELLOW,
        flex: 1,
        minWidth: "47%",
        maxWidth: "47%",
      }}
      elevation={10}
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.25}
      shadowRadius={3.84}
      className="rounded-2xl p-4"
    >
      <View className="mb-3">
        <Text className="text-2xl">{icon}</Text>
      </View>
      <Text className="text-gray-700 text-sm font-medium mb-1">{label}</Text>
      <Text className="text-gray-900 text-lg font-bold">{value}</Text>
    </View>
  );
}
