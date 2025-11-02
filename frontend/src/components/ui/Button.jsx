import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

/**
 * Button Component
 * Reusable button component with loading state
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onPress - Press handler
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.variant - Button variant (primary, secondary, outline)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {string} props.className - Additional CSS classes
 */
export function Button({
  children,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const baseClasses =
    "flex items-center justify-center rounded-md font-medium transition-colors";

  const variantClasses = {
    primary: "bg-gray-900 text-gray-50 hover:bg-gray-900/90",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline:
      "border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50",
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-9 px-4 text-sm",
    lg: "h-11 px-6 text-base",
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${className} ${isDisabled ? "opacity-50" : ""}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#fff" : "#000"}
        />
      ) : (
        <Text
          className={variant === "primary" ? "text-gray-50" : "text-gray-900"}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
