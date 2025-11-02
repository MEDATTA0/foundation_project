import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * ProfileHeader Component
 * Displays user profile picture, name, welcome message, and notification icon
 *
 * @param {Object} props - Component props
 * @param {string} props.userName - User's name
 * @param {string} props.userImage - User's profile image URL
 * @param {Function} props.onNotificationPress - Callback when notification icon is pressed
 */
export function ProfileHeader({
  userName = "Daisy Uwineza",
  userImage,
  onNotificationPress,
}) {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: top }}
      className="bg-white px-4 py-3 flex flex-row items-center justify-between"
    >
      {/* Profile Section */}
      <View className="flex flex-row items-center flex-1">
        {/* Profile Picture */}
        <View className="w-12 h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
          {userImage ? (
            <Image
              source={{ uri: userImage }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-purple-300 items-center justify-center">
              <Text className="text-white text-lg font-bold">
                {userName.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        {/* Name and Welcome */}
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900">{userName}</Text>
          <Text className="text-sm text-gray-500">Welcome back!</Text>
        </View>
      </View>

      {/* Notification Icon */}
      <TouchableOpacity
        onPress={onNotificationPress}
        className="p-2"
        activeOpacity={0.7}
      >
        <Text className="text-2xl">🔔</Text>
      </TouchableOpacity>
    </View>
  );
}
