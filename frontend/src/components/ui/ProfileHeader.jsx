import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../stores";

export function ProfileHeader({ userName, userImage, onNotificationPress }) {
  const { top } = useSafeAreaInsets();
  const { user } = useAuthStore();

  // Use user from store if not provided as prop, fallback to user name from store
  const displayName = userName || user?.name || "User";
  const displayImage = userImage || user?.image || null;

  return (
    <View
      // style={{ paddingTop: top }}
      className="bg-white px-4 py-3 flex flex-row items-center border-b border-gray-200 justify-between"
    >
      {/* Profile Section */}
      <View className="flex flex-row items-center flex-1">
        {/* Profile Picture */}
        <View className="w-12 h-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
          {displayImage ? (
            <Image
              source={{ uri: displayImage }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-purple-300 items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Name and Welcome */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{displayName}</Text>
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
