import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BaseLayout } from "../../components/layout";
import { BottomNavigation } from "../../components/navigation";
import { AuthInput, AuthButton } from "../../components/ui";
import { NAVIGATION_TABS, API_ENDPOINTS, COLORS } from "../../constants";
import { api } from "../../services/api";
import { useAuthStore } from "../../stores";

export default function CreateStudentPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState("create"); // "create" or "delete"
  const [isLoading, setIsLoading] = useState(false);

  // Create form state
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
  });
  const [formError, setFormError] = useState(null);

  // Delete state
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch students for delete tab
  const fetchStudents = async () => {
    if (!isAuthenticated) return;

    setIsLoadingStudents(true);
    try {
      const data = await api.get(API_ENDPOINTS.STUDENTS.LIST);
      // The API returns TeacherStudent records, extract student data
      // Handle both cases: with student relation or just studentId
      const studentList = data
        .map((item) => {
          // If student relation is included
          if (item.student) {
            return {
              id: item.student.id,
              name: item.student.name,
              birthDate: item.student.birthDate,
            };
          }
          // If only studentId is provided (would need separate fetch, but handle gracefully)
          if (item.studentId) {
            return {
              id: item.studentId,
              name: "Unknown Student",
              birthDate: null,
            };
          }
          return null;
        })
        .filter(Boolean); // Remove null entries
      setStudents(studentList);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      Alert.alert("Error", "Failed to load students list");
    } finally {
      setIsLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (activeTab === "delete") {
      fetchStudents();
    }
  }, [activeTab, isAuthenticated]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formError) setFormError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError("Name is required");
      return false;
    }
    if (!formData.birthDate) {
      setFormError("Birth date is required");
      return false;
    }
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.birthDate)) {
      setFormError("Please enter a valid date (YYYY-MM-DD)");
      return false;
    }
    return true;
  };

  const handleCreateStudent = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setFormError(null);

    try {
      await api.post(API_ENDPOINTS.STUDENTS.CREATE, {
        name: formData.name.trim(),
        birthDate: formData.birthDate,
      });

      Alert.alert("Success", "Student created successfully", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setFormData({ name: "", birthDate: "" });
            // Navigate back - the students list will refresh automatically
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Failed to create student:", error);
      const errorMessage =
        error.message || "Failed to create student. Please try again.";
      setFormError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = (student) => {
    Alert.alert(
      "Delete Student",
      `Are you sure you want to delete ${student.name}? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDeleteStudent(student.id),
        },
      ]
    );
  };

  const confirmDeleteStudent = async (studentId) => {
    setDeletingId(studentId);
    try {
      await api.delete(API_ENDPOINTS.STUDENTS.DELETE(studentId));
      Alert.alert("Success", "Student deleted successfully", [
        {
          text: "OK",
          onPress: () => {
            // Refresh students list
            fetchStudents();
          },
        },
      ]);
    } catch (error) {
      console.error("Failed to delete student:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to delete student. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <BaseLayout
      showBottomNav={false}
      bottomNav={<BottomNavigation tabs={NAVIGATION_TABS} />}
      backgroundColor="bg-gray-50"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 -ml-2"
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.TEXT_PRIMARY}
              />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">
              Manage Students
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Tabs */}
          <View className="flex-row bg-gray-100 rounded-lg p-1">
            <TouchableOpacity
              onPress={() => setActiveTab("create")}
              className={`flex-1 py-2 px-4 rounded-md ${
                activeTab === "create" ? "bg-white shadow-sm" : "bg-transparent"
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "create" ? "text-gray-900" : "text-gray-600"
                }`}
              >
                Create Student
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => setActiveTab("delete")}
              className={`flex-1 py-2 px-4 rounded-md ${
                activeTab === "delete" ? "bg-white shadow-sm" : "bg-transparent"
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "delete" ? "text-gray-900" : "text-gray-600"
                }`}
              >
                Delete Student
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Content */}
        <View className="px-2 py-6">
          {activeTab === "create" ? (
            /* Create Student Form */
            <View className="bg-white rounded-xl py-6 px-4 shadow-sm">
              <Text className="text-lg font-bold text-gray-900 mb-6">
                Create New Student
              </Text>

              {/* Error Message */}
              {formError && (
                <View className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <Text className="text-red-600 text-sm">{formError}</Text>
                </View>
              )}

              {/* Form Fields */}
              <AuthInput
                label="Student Name"
                placeholder="Enter student's full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                type="text"
              />

              <AuthInput
                label="Birth Date"
                placeholder="YYYY-MM-DD (e.g., 2010-05-15)"
                value={formData.birthDate}
                onChangeText={(value) => handleInputChange("birthDate", value)}
                type="text"
              />

              <Text className="text-xs text-gray-500 mb-4 -mt-2">
                Format: YYYY-MM-DD (e.g., 2010-05-15)
              </Text>

              {/* Submit Button */}
              <View className="mt-4">
                <AuthButton
                  title="Create Student"
                  onPress={handleCreateStudent}
                  loading={isLoading}
                  disabled={isLoading}
                />
              </View>
            </View>
          ) : (
            /* Delete Student List */
            <View className="bg-white rounded-xl shadow-sm overflow-hidden">
              <View className="px-6 py-4 border-b border-gray-200">
                <Text className="text-lg font-bold text-gray-900">
                  Delete Student
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Tap the red X icon to delete a student
                </Text>
              </View>

              {isLoadingStudents ? (
                <View className="py-12 items-center justify-center">
                  <Text className="text-gray-500">Loading students...</Text>
                </View>
              ) : students.length === 0 ? (
                <View className="py-12 items-center justify-center">
                  <Ionicons
                    name="people-outline"
                    size={48}
                    color={COLORS.GRAY_400}
                  />
                  <Text className="text-gray-500 mt-4 text-center">
                    No students found
                  </Text>
                </View>
              ) : (
                <View>
                  {students.map((student, index) => (
                    <View
                      key={student.id}
                      className={`flex-row items-center justify-between px-6 py-4 ${
                        index !== students.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                          {student.name}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          Born: {formatDate(student.birthDate)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteStudent(student)}
                        disabled={deletingId === student.id}
                        className="p-2 ml-4"
                        activeOpacity={0.7}
                      >
                        {deletingId === student.id ? (
                          <View className="w-6 h-6 items-center justify-center">
                            <Text className="text-red-500">...</Text>
                          </View>
                        ) : (
                          <Ionicons
                            name="close-circle"
                            size={28}
                            color="#EF4444"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </BaseLayout>
  );
}
