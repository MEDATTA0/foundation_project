import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../stores";

/**
 * QuizHeader Component
 * Orange banner with profile picture, user name, and page title
 *
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Close button handler
 * @param {string} props.pageTitle - Page title text
 */
export function QuizHeader({ onClose, pageTitle = "Quiz Tests" }) {
  const { user } = useAuthStore();
  const userName = user?.name || "Rekha Baitharu";

  return (
    <View className="relative">
      {/* Close Button */}
      <TouchableOpacity
        onPress={onClose}
        className="absolute top-4 right-4 z-10 w-8 h-8 items-center justify-center"
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={24} color="#000000" />
      </TouchableOpacity>

      {/* Orange Banner with rounded ends */}
      <View
        className="px-6 py-5 flex-row items-center mx-4 mt-4"
        style={{ backgroundColor: "#F97316", borderRadius: 20 }}
      >
        {/* Profile Picture */}
        <View className="w-16 h-16 rounded-full bg-white border-2 border-amber-300 overflow-hidden mr-4">
          {user?.image ? (
            <Image
              source={{ uri: user.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-purple-300 items-center justify-center">
              <Text className="text-white text-xl font-bold">
                {userName.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        {/* User Name and Title */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-1">
            {userName}
          </Text>
          <Text className="text-sm text-gray-700">{pageTitle}</Text>
        </View>
      </View>
    </View>
  );
}
