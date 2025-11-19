import React from "react";
import { View } from "react-native";
import { StatCard } from "./StatCard";

export function StatisticsGrid() {
  const stats = [
    {
      label: "Total Student",
      value: "47 Pupils",
      icon: "📖",
    },
    {
      label: "Available resources",
      value: "21",
      icon: "📁",
    },
    {
      label: "No. of Classroom",
      value: "5",
      icon: "📋",
    },
    {
      label: "Downloaded Files",
      value: "10 files",
      icon: "📥",
    },
  ];

  return (
    <View className="flex-row flex-wrap" style={{ gap: 12 }}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </View>
  );
}
