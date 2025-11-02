import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AppLogo,
  AuthInput,
  AuthButton,
  AuthGradientBackground,
} from "../components/ui";

/**
 * Sign Up Screen
 * Registration form for new users
 */
export default function SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    className: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = () => {
    // Handle sign up logic
    console.log("Sign up:", formData);
    // Navigate to home or dashboard
    router.push("/home");
  };

  const handleLoginLink = () => {
    router.push("/login");
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
          <View className="bg-white rounded-xl py-8 px-4 w-full max-w-sm shadow-lg">
            {/* Header */}
            <Text className="text-4xl font-bold text-gray-900 text-center mb-2">
              JOIN
            </Text>
            <Text className="text-3xl font-bold text-gray-900 text-center mb-8">
              Classroom Connect
            </Text>

            {/* Input Fields */}
            <View className="mb-5">
              <AuthInput
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange("fullName", value)}
                type="text"
              />

              <AuthInput
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                type="email"
              />

              <AuthInput
                label="Class Name"
                placeholder="Enter class name"
                value={formData.className}
                onChangeText={(value) => handleInputChange("className", value)}
                type="text"
              />

              <AuthInput
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                type="password"
              />
            </View>

            {/* Already have account link */}
            <TouchableOpacity
              onPress={handleLoginLink}
              className="items-center mb-6"
            >
              <Text className="text-sm text-gray-600">
                Already have an account?
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <View className="w-full">
              <AuthButton title="Sign up" onPress={handleSignUp} />
            </View>
          </View>
        </View>
      </ScrollView>
    </AuthGradientBackground>
  );
}
