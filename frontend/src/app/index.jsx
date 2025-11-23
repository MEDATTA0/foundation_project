import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppLogo, AuthButton, AuthGradientBackground } from "../components/ui";
import { useAuthStore } from "../stores";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  };

  return (
    <AuthGradientBackground>
      <StatusBar style="dark" />
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo */}
        <View className="mb-10">
          <AppLogo size={120} />
        </View>

        {/* Tagline */}
        <Text className="text-2xl font-bold text-gray-900 text-center mb-16 italic">
          Empowering Early Literacy
        </Text>

        {/* Get Started Button */}
        <View className="w-full max-w-xs">
          <AuthButton title="Get Started" onPress={handleGetStarted} />
        </View>
      </View>
    </AuthGradientBackground>
  );
}
