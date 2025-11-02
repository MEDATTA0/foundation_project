import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants";

/**
 * BottomNavigation Component
 * Bottom navigation bar matching Figma design - positioned at absolute bottom
 *
 * @param {Object} props - Component props
 * @param {Array} props.tabs - Array of tab objects {href, label, icon}
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.activeColor - Active tab color
 * @param {string} props.inactiveColor - Inactive tab color
 */
export function BottomNavigation({
  tabs = [],
  className = "",
  activeColor = COLORS.NAV_ACTIVE,
  inactiveColor = COLORS.NAV_INACTIVE,
}) {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Helper to check if route is active
  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
      className={`bg-gray-100 ${className}`}
    >
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <TabItem
            key={index}
            {...tab}
            isActive={isActive(tab.href)}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
          />
        ))}
      </View>
    </View>
  );
}

/**
 * TabItem Component
 * Individual tab button matching design
 */
function TabItem({ href, label, icon, isActive, activeColor, inactiveColor }) {
  const iconColor = isActive ? activeColor : inactiveColor;
  const labelColor = isActive ? activeColor : inactiveColor;

  return (
    <Link href={href} asChild>
      <TouchableOpacity
        style={styles.tabItem}
        className="flex-1 items-center justify-center"
        activeOpacity={0.7}
      >
        <View style={styles.tabContent}>
          {/* Active indicator above icon */}
          {isActive && (
            <View
              style={[styles.activeIndicator, { backgroundColor: activeColor }]}
            />
          )}

          {/* Icon */}
          {icon && (
            <View style={styles.iconContainer}>
              {typeof icon === "string" ? (
                <Text style={[styles.iconText, { color: iconColor }]}>
                  {icon}
                </Text>
              ) : (
                <View style={{ color: iconColor }}>{icon}</View>
              )}
            </View>
          )}

          {/* Label */}
          <Text
            style={[
              styles.label,
              { color: labelColor },
              isActive && styles.labelActive,
            ]}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 65,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabsContainer: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    height: "100%",
    position: "relative",
    paddingVertical: 6,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -15,
    width: 30,
    height: 2,
    borderRadius: 1,
  },
  iconContainer: {
    marginBottom: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  iconText: {
    fontSize: 22,
    lineHeight: 26,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 2,
  },
  labelActive: {
    fontWeight: "600",
  },
});
