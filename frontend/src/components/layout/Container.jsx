import React from "react";
import { View } from "react-native";

/**
 * Container Component
 * Provides consistent padding and max-width constraints for content
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fullWidth - Whether to use full width
 */
export function Container({ children, className = "", fullWidth = false }) {
  const containerClasses = fullWidth
    ? "w-full"
    : "w-full px-4 md:px-6 lg:px-8 max-w-7xl mx-auto";

  return <View className={`${containerClasses} ${className}`}>{children}</View>;
}
