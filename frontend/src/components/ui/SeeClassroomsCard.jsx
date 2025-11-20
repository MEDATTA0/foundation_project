import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants";

export function SeeClassroomsCard({
  onPress,
  description = "View and manage all your classrooms",
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{ backgroundColor: COLORS.ACCENT_ORANGE }}
      className="rounded-2xl p-5 mb-4 flex-row items-center justify-between"
    >
      <View className="flex-1">
        <Text className="text-white text-xl font-bold mb-1">
          See Classrooms
        </Text>
        <Text className="text-white text-sm opacity-90">{description}</Text>
      </View>

      {/* Chevron Right Icon */}
      <View className="ml-3">
        <Ionicons name="chevron-forward" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
}
