import React, { useEffect, useCallback } from "react";
import { View, ScrollView, RefreshControl, Text } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { BaseLayout } from "../components/layout";
import { BottomNavigation } from "../components/navigation";
import {
  ProfileHeader,
  WelcomeBanner,
  SeeStudentsCard,
  StatisticsGrid,
  RecentSessions,
} from "../components/ui";
import { NAVIGATION_TABS, API_ENDPOINTS } from "../constants";
import { api } from "../services/api";
import { useAppStore } from "../stores/appStore";
import { useAuthStore } from "../stores";
import { COLORS } from "../constants";

export default function HomePage() {
  const router = useRouter();
  const {
    setDashboard,
    setDashboardLoading,
    setDashboardError,
    isDashboardLoading,
    dashboardError,
  } = useAppStore();
  const { isAuthenticated } = useAuthStore();

  const handleNotificationPress = () => {
    // Navigate to notifications or show notification modal
    console.log("Notifications pressed");
  };

  const handleSeeStudentsPress = () => {
    router.push("/students/create");
  };

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) return;

    setDashboardLoading(true);
    setDashboardError(null);

    try {
      const data = await api.get(API_ENDPOINTS.DASHBOARD);
      setDashboard(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setDashboardError(error.message || "Failed to load dashboard data");
    } finally {
      setDashboardLoading(false);
    }
  }, [isAuthenticated, setDashboard, setDashboardLoading, setDashboardError]);

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Refresh dashboard when screen comes into focus (e.g., after creating a student)
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

  const handleRefresh = () => {
    fetchDashboardData();
  };

  return (
    <BaseLayout
      showBottomNav={true}
      bottomNav={<BottomNavigation tabs={NAVIGATION_TABS} />}
      backgroundColor="bg-gray-50"
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isDashboardLoading}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
          />
        }
      >
        {/* Profile Header */}
        <ProfileHeader onNotificationPress={handleNotificationPress} />

        {/* Main Content */}
        <View className="px-4 pt-4 pb-8">
          {/* Error Message */}
          {dashboardError && (
            <View className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <Text className="text-red-600 text-sm">{dashboardError}</Text>
            </View>
          )}

          {/* Welcome Banner */}
          <WelcomeBanner />

          {/* See Students Card */}
          <SeeStudentsCard onPress={handleSeeStudentsPress} />

          {/* Statistics Grid */}
          <StatisticsGrid />

          {/* Recent Sessions */}
          <RecentSessions />
        </View>
      </ScrollView>
    </BaseLayout>
  );
}
