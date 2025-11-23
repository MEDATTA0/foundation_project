import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../stores";
import { useAppStore } from "../../stores/appStore";
import { COLORS, API_ENDPOINTS } from "../../constants";
import { api } from "../../services/api";

export function StudentsListComponent({
  onClose,
  pageTitle = "Students List",
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const {
    students,
    isStudentsLoading,
    studentsError,
    setStudents,
    setStudentsLoading,
    setStudentsError,
    clearStudentsError,
  } = useAppStore();
  const userName = user?.name || "User";

  // Fetch students from API
  const fetchStudents = useCallback(async () => {
    if (!isAuthenticated) return;

    setStudentsLoading(true);
    clearStudentsError();

    try {
      const data = await api.get(API_ENDPOINTS.STUDENTS.LIST);
      // Transform API response to component format
      const studentList = data
        .map((item) => {
          if (item.student) {
            return {
              id: item.student.id,
              name: item.student.name,
              birthDate: item.student.birthDate,
            };
          }
          return null;
        })
        .filter(Boolean);
      setStudents(studentList);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setStudentsError(error.message || "Failed to load students");
    } finally {
      setStudentsLoading(false);
    }
  }, [
    isAuthenticated,
    setStudents,
    setStudentsLoading,
    setStudentsError,
    clearStudentsError,
  ]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleRefresh = () => {
    fetchStudents();
  };

  const handleViewStudent = (studentId) => {
    router.push(`/students/${studentId}`);
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header with Purple Banner */}
      <View className="relative">
        {/* Purple Banner with rounded top */}
        <View
          className="pt-6 px-6 pb-6 flex-row items-center"
          style={{ backgroundColor: "#6A0DAD" }}
        >
          {/* User Name and Title */}
          <View className="flex-1">
            <Text className="text-4xl font-bold text-white mb-2">
              {userName}
            </Text>
            <Text className="text-lg text-white opacity-90">{pageTitle}</Text>
          </View>
        </View>
      </View>

      {/* Students List */}
      <View className="flex-1 bg-white overflow-hidden">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={isStudentsLoading}
              onRefresh={handleRefresh}
              colors={[COLORS.PRIMARY]}
            />
          }
        >
          {/* Error Message */}
          {studentsError && (
            <View className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <Text className="text-red-600 text-sm">{studentsError}</Text>
            </View>
          )}

          {/* Loading State */}
          {isStudentsLoading && students.length === 0 ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator size="large" color={COLORS.PRIMARY} />
              <Text className="text-gray-500 mt-4">Loading students...</Text>
            </View>
          ) : students.length > 0 ? (
            students.map((student, index) => (
              <View
                key={student.id}
                className="flex-row items-center justify-between px-4 py-4"
                style={{
                  borderBottomWidth: index !== students.length - 1 ? 1 : 0,
                  borderBottomColor: "#F3F4F6",
                }}
              >
                <View className="flex flex-row items-center gap-2">
                  <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center">
                    <Text className="text-xl font-medium text-[#6A0DAD]">
                      {student.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xl font-medium text-slate-700">
                      {student.name}
                    </Text>
                    {student.birthDate && (
                      <Text className="text-sm text-gray-500">
                        Born: {new Date(student.birthDate).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleViewStudent(student.id)}
                  activeOpacity={0.8}
                  className="px-6 py-2 rounded-lg"
                  style={{ backgroundColor: COLORS.PRIMARY }}
                >
                  <Text className="text-white font-semibold text-sm">View</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View className="px-6 py-12 items-center justify-center">
              <Ionicons
                name="people-outline"
                size={48}
                color={COLORS.GRAY_400}
              />
              <Text className="text-gray-500 text-base mt-4 text-center">
                No students found
              </Text>
              <Text className="text-gray-400 text-sm mt-2 text-center">
                Create your first student to get started
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
