import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { BaseLayout } from "../components/layout";
import { BottomNavigation } from "../components/navigation";
import {
  ProfileHeader,
  WelcomeBanner,
  SeeClassroomsCard,
  StatisticsGrid,
  RecentSessions,
} from "../components/ui";
import { NAVIGATION_TABS } from "../constants";

export default function HomePage() {
  const router = useRouter();

  const handleNotificationPress = () => {
    // Navigate to notifications or show notification modal
    console.log("Notifications pressed");
  };

  const handleSeeClassroomsPress = () => {
    router.push("/classrooms");
  };

  return (
    <BaseLayout
      showBottomNav={true}
      bottomNav={<BottomNavigation tabs={NAVIGATION_TABS} />}
      backgroundColor="bg-gray-50"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <ProfileHeader onNotificationPress={handleNotificationPress} />

        {/* Main Content */}
        <View className="px-4 pt-4 pb-8">
          {/* Welcome Banner */}
          <WelcomeBanner />

          {/* See Classrooms Card */}
          <SeeClassroomsCard onPress={handleSeeClassroomsPress} />

          {/* Statistics Grid */}
          <StatisticsGrid />

          {/* Recent Sessions */}
          <RecentSessions />
        </View>
      </ScrollView>
    </BaseLayout>
  );
}
