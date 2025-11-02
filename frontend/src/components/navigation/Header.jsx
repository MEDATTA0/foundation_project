import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Header Component
 * Reusable header with logo, navigation links, and optional actions
 *
 * @param {Object} props - Component props
 * @param {string} props.logo - Logo text or component
 * @param {Array} props.navItems - Navigation items array
 * @param {React.ReactNode} props.rightActions - Right side actions/buttons
 * @param {string} props.className - Additional CSS classes
 */
export function Header({
  logo = "ACME",
  navItems = [],
  rightActions,
  className = "",
}) {
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={{ paddingTop: top }}
      className={`bg-white border-b border-gray-200 ${className}`}
    >
      <View className="px-4 lg:px-6 h-14 flex items-center flex-row justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold flex-1 items-center justify-center">
          <Text className="text-lg font-bold">{logo}</Text>
        </Link>

        {/* Navigation Items */}
        {navItems.length > 0 && (
          <View className="flex flex-row gap-4 sm:gap-6">
            {navItems.map((item, index) => (
              <NavLink key={index} {...item} />
            ))}
          </View>
        )}

        {/* Right Actions */}
        {rightActions && (
          <View className="flex flex-row items-center gap-2">
            {rightActions}
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * NavLink Component
 * Individual navigation link item
 */
function NavLink({ href, label, onPress, className = "" }) {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} className={`${className}`}>
        <Text className="text-md font-medium hover:underline web:underline-offset-4">
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <Link
      href={href || "/"}
      className={`text-md font-medium hover:underline web:underline-offset-4 ${className}`}
    >
      <Text>{label}</Text>
    </Link>
  );
}
