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
      label: "Total Attendance",
      value: "60%",
      icon: "📅",
    },
    {
      label: "No. of Classroom",
      value: "5",
      icon: "📋",
    },
    {
      label: "Notes",
      value: "1000",
      icon: "📚",
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
