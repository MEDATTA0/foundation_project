import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

/**
 * BaseLayout Component
 * Provides a consistent base layout structure for all screens
 * Bottom navigation is absolutely positioned at the bottom
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} props.showHeader - Whether to show header
 * @param {boolean} props.showFooter - Whether to show footer
 * @param {boolean} props.showBottomNav - Whether to show bottom navigation
 * @param {React.ReactNode} props.header - Custom header component
 * @param {React.ReactNode} props.footer - Custom footer component
 * @param {React.ReactNode} props.bottomNav - Custom bottom navigation component
 * @param {string} props.backgroundColor - Background color class
 * @param {boolean} props.safeArea - Whether to apply safe area insets
 */
export function BaseLayout({
  children,
  showHeader = false,
  showFooter = false,
  showBottomNav = true,
  header,
  footer,
  bottomNav,
  backgroundColor = "bg-white",
  safeArea = true,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        safeArea && {
          paddingTop: insets.top,
        },
      ]}
      className={`flex-1 ${backgroundColor}`}
    >
      <StatusBar style="dark-content" />
      {showHeader && header && <View style={styles.header}>{header}</View>}
      <View style={styles.content}>{children}</View>
      {showFooter && footer && <View style={styles.footer}>{footer}</View>}
      {showBottomNav && bottomNav && (
        <View style={[styles.bottomNav, { bottom: 0 }]}>{bottomNav}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  header: {
    zIndex: 10,
  },
  content: {
    flex: 1,
    // Add padding bottom to prevent content from being hidden behind bottom nav
    // This matches the bottom navigation height
    paddingBottom: 65,
  },
  footer: {
    zIndex: 10,
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 100,
  },
});
