import React from "react";
import { useRouter } from "expo-router";
import { BaseLayout } from "../components/layout";
import { BottomNavigation } from "../components/navigation";
import { NAVIGATION_TABS } from "../constants";
import { StudentsListComponent } from "../components/ui/StudentsListComponent";

/**
 * Students Page
 * Displays list of students with View buttons
 */
export default function StudentsPage() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <BaseLayout
      showBottomNav={true}
      bottomNav={<BottomNavigation tabs={NAVIGATION_TABS} />}
      backgroundColor="bg-gray-100"
    >
      <StudentsListComponent onClose={handleClose} pageTitle="Students List" />
    </BaseLayout>
  );
}
