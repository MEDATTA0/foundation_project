import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  AppLogo,
  AuthInput,
  AuthButton,
  AuthGradientBackground,
} from "../components/ui";
import { api } from "../services/api";
import { API_ENDPOINTS } from "../constants";
import { useAuthStore } from "../stores/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const { login, setLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleLogin = async () => {
    // Validate form
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoading(true);

    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      // Response structure: { token, user } or { session: { token }, user }
      const token = response.token || response.session?.token;
      const user = response.user;

      if (token && user) {
        // Store token and user in auth store
        login(user, token);
        console.log("Login successful");
        console.log("User:", user);
        console.log("Token:", token);

        // Navigate to home
        router.replace("/home");
      } else {
        console.error("Invalid response structure:", response);
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.message || "Login failed. Please check your credentials.";
      setError(errorMessage);

      // Show alert for better UX
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
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

            {/* Error Message */}
            {error && (
              <View className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <Text className="text-red-600 text-sm">{error}</Text>
              </View>
            )}

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
              <AuthButton
                title="Login"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
              />
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
