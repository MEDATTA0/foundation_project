import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * SettingsItem Component
 * Individual setting item with icon, label, and value
 *
 * @param {Object} props - Component props
 * @param {string} props.icon - Icon name from Ionicons
 * @param {string} props.iconColor - Color for the icon
 * @param {string} props.label - Setting label
 * @param {string} props.value - Setting value
 * @param {Function} props.onPress - Press handler
 * @param {React.ReactNode} props.customIcon - Custom icon component
 */
export function SettingsItem({
  icon,
  iconColor = "#3B82F6",
  label,
  value,
  onPress,
  customIcon,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center py-4 border-b border-gray-100"
    >
      {/* Icon Container */}
      <View className="w-12 h-12 items-center justify-center mr-4">
        {customIcon || (
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Ionicons name={icon} size={24} color={iconColor} />
          </View>
        )}
      </View>

      {/* Label and Value */}
      <View className="flex-1">
        <Text className="text-base font-bold text-gray-900">{label}</Text>
        {value && <Text className="text-sm text-gray-700 mt-1">{value}</Text>}
      </View>
    </TouchableOpacity>
  );
}
