import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  AppLogo,
  AuthInput,
  AuthButton,
  AuthGradientBackground,
} from "../components/ui";

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    // Handle login logic
    console.log("Login:", formData);
    // Navigate to home or dashboard
    router.push("/home");
  };

  const handleSignUpLink = () => {
    router.push("/signup");
  };

  const handleForgotPassword = () => {
    // Handle forgot password
    console.log("Forgot password");
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <AuthGradientBackground>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center items-center px-4 py-10">
          {/* Card Panel */}
          <View className="bg-white rounded-xl py-8 px-4 w-full max-w-sm relative shadow-lg">
            {/* Close Button */}
            <TouchableOpacity
              onPress={handleClose}
              className="absolute top-4 right-4 w-8 h-8 items-center justify-center z-10"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>

            {/* Header */}
            <Text className="text-xl font-bold text-gray-900 text-center mb-6 mt-2">
              Welcome back!
            </Text>

            {/* Logo */}
            <View className="items-center mb-8">
              <AppLogo size={100} />
            </View>

            {/* Input Fields */}
            <View className="mb-4">
              <AuthInput
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                type="email"
              />

              <AuthInput
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                type="password"
              />
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              className="items-end mb-6"
            >
              <Text className="text-sm text-gray-600">Forgot password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <View className="w-full mb-5">
              <AuthButton title="Login" onPress={handleLogin} />
            </View>

            {/* Sign Up Link */}
            <TouchableOpacity
              onPress={handleSignUpLink}
              className="items-center"
            >
              <Text className="text-sm text-gray-600">
                No account? - Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AuthGradientBackground>
  );
}
