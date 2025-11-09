import React from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BaseLayout } from "../components/layout";
import { BottomNavigation } from "../components/navigation";
import { SettingsItem } from "../components/ui";
import { NAVIGATION_TABS } from "../constants";
import { useAuthStore } from "../stores";

/**
 * Settings Page
 * Account information and settings management
 */
export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Mock user data - replace with actual user data from store
  const userData = {
    userName: user?.name || "Daisy Uwineza",
    phoneNumber: "1234567890",
    email: user?.email || "rekha@gmail.com",
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handleUpdateProfile = () => {
    // Navigate to update profile screen
    console.log("Update profile");
  };

  const handleEditField = (field) => {
    // Handle editing specific field
    console.log("Edit", field);
  };

  return (
    <BaseLayout
      showBottomNav={true}
      bottomNav={<BottomNavigation tabs={NAVIGATION_TABS} />}
      backgroundColor="bg-white"
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        >
          {/* Purple Header Section */}
          <View
            className="pt-16 px-6 pb-20"
            style={{ backgroundColor: "#6A0DAD", minHeight: 200 }}
          >
            <Text className="text-4xl font-bold text-white mb-2">Settings</Text>
            <Text className="text-lg text-white opacity-90">
              Account Information
            </Text>
          </View>

          {/* White Background Section with Card */}
          <View className="bg-white -mt-12 pb-6">
            {/* White Card */}
            <View className="mx-4 bg-white rounded-3xl shadow-lg overflow-hidden">
              {/* Section Title */}
              <View className="px-6 pt-6 pb-2">
                <Text className="text-sm text-gray-400">
                  Login and security
                </Text>
              </View>

              {/* Settings Items */}
              <View className="px-4">
                {/* User Name */}
                <SettingsItem
                  label="User Name"
                  value={userData.userName}
                  onPress={() => handleEditField("userName")}
                  customIcon={
                    <View className="relative">
                      <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                        <Ionicons name="person" size={24} color="#3B82F6" />
                      </View>
                      <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white items-center justify-center">
                        <Ionicons name="checkmark" size={12} color="white" />
                      </View>
                    </View>
                  }
                />

                {/* Phone Number */}
                <SettingsItem
                  icon="call"
                  iconColor="#14B8A6"
                  label="Phone Number"
                  value={userData.phoneNumber}
                  onPress={() => handleEditField("phoneNumber")}
                />

                {/* Email Id */}
                <SettingsItem
                  icon="mail"
                  iconColor="#3B82F6"
                  label="Email Id"
                  value={userData.email}
                  onPress={() => handleEditField("email")}
                />

                {/* Password */}
                <SettingsItem
                  icon="lock-closed"
                  iconColor="#3B82F6"
                  label="Password"
                  value="••••••••"
                  onPress={() => handleEditField("password")}
                  customIcon={
                    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
                      <Ionicons name="lock-closed" size={24} color="#3B82F6" />
                    </View>
                  }
                />

                {/* Update Profile */}
                <SettingsItem
                  label="Update Profile"
                  onPress={handleUpdateProfile}
                  customIcon={
                    <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center relative">
                      <Ionicons name="person" size={18} color="#F97316" />
                      <View className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-blue-500 items-center justify-center">
                        <Ionicons name="refresh" size={12} color="white" />
                      </View>
                    </View>
                  }
                />
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.7}
              className="mx-12 mt-6 bg-white border-2 border-red-500 rounded-full px-6 py-3 flex-row items-center justify-center"
            >
              <Ionicons name="power" size={20} color="#EF4444" />
              <Text className="text-red-500 font-semibold text-base ml-2">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </BaseLayout>
  );
}
