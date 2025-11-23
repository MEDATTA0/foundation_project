import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AppLogo,
  AuthInput,
  AuthButton,
  AuthGradientBackground,
} from "../components/ui";
import { api } from "../services/api";
import { API_ENDPOINTS } from "../constants";
import { useAuthStore } from "../stores/authStore";

export default function SignUpScreen() {
  const router = useRouter();
  const { login, setLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSignUp = async () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoading(true);

    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const token = response.token || response.session?.token;
      const user = response.user;

      if (token && user) {
        // Store token and user in auth store
        login(user, token);
        console.log("Sign up successful");
        console.log("User:", user);
        console.log("Token:", token);

        // Navigate to home
        router.replace("/home");
      } else {
        console.error("Invalid response structure:", response);
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage = error.message || "Sign up failed. Please try again.";
      setError(errorMessage);

      // Show alert for better UX
      Alert.alert("Sign Up Failed", errorMessage);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
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

            {/* Error Message */}
            {error && (
              <View className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <Text className="text-red-600 text-sm">{error}</Text>
              </View>
            )}

            {/* Input Fields */}
            <View className="mb-5">
              <AuthInput
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
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
                label="Password"
                placeholder="Enter your password (min 8 characters)"
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
              <AuthButton
                title="Sign up"
                onPress={handleSignUp}
                loading={isLoading}
                disabled={isLoading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </AuthGradientBackground>
  );
}
