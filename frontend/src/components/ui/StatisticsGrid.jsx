import React from "react";
import { View } from "react-native";
import { StatCard } from "./StatCard";
import { useAppStore } from "../../stores/appStore";

export function StatisticsGrid() {
  const { dashboard } = useAppStore();

  const stats = [
    {
      label: "Total Student",
      value: `${dashboard.students} ${
        dashboard.students === 1 ? "Pupil" : "Pupils"
      }`,
      icon: "📖",
    },
    {
      label: "Available resources",
      value: `${dashboard.resources}`,
      icon: "📁",
    },
    {
      label: "No. of Classroom",
      value: `${dashboard.classrooms}`,
      icon: "📋",
    },
    {
      label: "Downloaded Files",
      value: "0 files", // I will add this later
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
