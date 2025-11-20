import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { USER_NAME } from "../../constants/userName";

export function ProfileHeader({
  userName = USER_NAME,
  userImage,
  onNotificationPress,
}) {
  const { top } = useSafeAreaInsets();

  return (
    <View
      // style={{ paddingTop: top }}
      className="bg-white px-4 py-3 flex flex-row items-center border-b border-gray-200 justify-between"
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
              <Text className="text-white text-2xl font-bold">
                {userName.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        {/* Name and Welcome */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{userName}</Text>
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
