import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants";

/**
 * AuthInput Component
 * Input field for authentication forms
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label text
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChangeText - Change handler
 * @param {string} props.type - Input type (text, email, password)
 * @param {boolean} props.secureTextEntry - Whether to hide text
 */
export function AuthInput({
  label,
  placeholder,
  value,
  onChangeText,
  type = "text",
  secureTextEntry = false,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <View className="mb-5">
      <Text className="text-sm font-medium text-gray-900 mb-2">{label}</Text>
      <View className="relative">
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 bg-white"
          placeholder={placeholder}
          placeholderTextColor={COLORS.GRAY_400}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !isPasswordVisible}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-4 top-1/2 -mt-2.5 p-1"
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color={COLORS.GRAY_500}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
