import React from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Footer Component
 * Reusable footer component with copyright and optional links
 *
 * @param {Object} props - Component props
 * @param {string} props.copyrightText - Copyright text
 * @param {Array} props.links - Footer links array
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showOnNative - Whether to show on native platforms
 */
export function Footer({
  copyrightText = `© ${new Date().getFullYear()} Me`,
  links = [],
  className = "",
  showOnNative = false,
}) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className={`flex shrink-0 bg-gray-100 ${
        !showOnNative ? "native:hidden" : ""
      } ${className}`}
      style={{ paddingBottom: bottom }}
    >
      <View className="py-6 flex-1 items-start px-4 md:px-6">
        {copyrightText && (
          <Text className="text-center text-gray-700">{copyrightText}</Text>
        )}
        {links.length > 0 && (
          <View className="flex flex-row gap-4 mt-2">
            {links.map((link, index) => (
              <Text key={index} className="text-gray-600 text-sm">
                {link.label}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
