import React from "react";
import { Text, View, ScrollView } from "react-native";
import { BaseLayout, Container } from "../components/layout";
import { BottomNavigation } from "../components/navigation";
import { NAVIGATION_TABS } from "../constants";

/**
 * Resources Page
 */
export default function ResourcesPage() {
  return (
    <BaseLayout
      showBottomNav={true}
      bottomNav={<BottomNavigation tabs={NAVIGATION_TABS} />}
    >
      <ScrollView className="flex-1" barStyle="dark-content">
        <Container>
          <View className="py-8 px-4">
            <Text className="text-3xl font-bold mb-4">Resources</Text>
            <Text className="text-gray-600 text-base leading-6">
              Manage your resources and course materials.
            </Text>
          </View>
        </Container>
      </ScrollView>
    </BaseLayout>
  );
}
