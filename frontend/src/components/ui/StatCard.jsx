import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../../constants";

export function StatCard({ label, value, icon }) {
  return (
    <View
      style={{
        backgroundColor: COLORS.PRIMARY_LIGHT,
        flex: 1,
        minWidth: "47%",
        maxWidth: "47%",
      }}
      elevation={1}
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.25}
      shadowRadius={3.84}
      className="rounded-2xl p-4"
    >
      <View className="mb-3">
        <Text className="text-2xl">{icon}</Text>
      </View>
      <Text className="text-white text-sm font-medium mb-1">{label}</Text>
      <Text className="text-white text-lg font-bold">{value}</Text>
    </View>
  );
}
