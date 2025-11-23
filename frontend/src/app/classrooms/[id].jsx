import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BaseLayout } from "../../components/layout";
import { COLORS, API_ENDPOINTS } from "../../constants";
import { api } from "../../services/api";
import { useAuthStore } from "../../stores";

export default function ClassroomDetailsPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Student enrollment state
  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [removingEnrollmentId, setRemovingEnrollmentId] = useState(null);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate age from birth date
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Toggle student selection
  const handleStudentToggle = (studentId) => {
    setSelectedStudentIds((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  // Enroll selected students
  const handleEnrollStudents = async () => {
    if (selectedStudentIds.length === 0) {
      Alert.alert("Error", "Please select at least one student");
      return;
    }

    setIsEnrolling(true);
    try {
      // Enroll each student
      const enrollmentPromises = selectedStudentIds.map((studentId) =>
        api.post(API_ENDPOINTS.ENROLLMENTS.CREATE, {
          classId: id,
          studentId: studentId,
        })
      );

      await Promise.all(enrollmentPromises);

      Alert.alert(
        "Success",
        `${selectedStudentIds.length} student${
          selectedStudentIds.length !== 1 ? "s" : ""
        } enrolled successfully`,
        [
          {
            text: "OK",
            onPress: () => {
              // Clear selection and refresh classroom data
              setSelectedStudentIds([]);
              fetchClassroomData();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error enrolling students:", error);
      const errorMessage =
        error.message || "Failed to enroll students. Please try again.";
      // Check if it's a duplicate enrollment error
      if (errorMessage.includes("already enrolled")) {
        Alert.alert("Already Enrolled", errorMessage);
      } else {
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  // Remove student from class
  const handleRemoveStudent = (student) => {
    Alert.alert(
      "Remove Student",
      `Are you sure you want to remove ${student.name} from this class?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setRemovingEnrollmentId(student.enrollmentId);
            try {
              await api.delete(
                API_ENDPOINTS.ENROLLMENTS.DELETE(student.enrollmentId)
              );
              Alert.alert(
                "Success",
                `${student.name} has been removed from the class`
              );
              // Refresh classroom data
              fetchClassroomData();
            } catch (error) {
              console.error("Error removing student:", error);
              Alert.alert(
                "Error",
                error.message || "Failed to remove student. Please try again."
              );
            } finally {
              setRemovingEnrollmentId(null);
            }
          },
        },
      ]
    );
  };

  // Fetch students for enrollment
  const fetchStudents = async () => {
    if (!isAuthenticated || !classroom) return;

    setIsLoadingStudents(true);
    try {
      const data = await api.get(API_ENDPOINTS.STUDENTS.LIST);
      // Get list of already enrolled student IDs
      const enrolledStudentIds = new Set(
        (classroom.students || []).map((s) => s.id)
      );

      // Transform API response and filter by age range and enrollment status
      const studentList = data
        .map((item) => {
          if (item.student) {
            const age = calculateAge(item.student.birthDate);
            return {
              id: item.student.id,
              name: item.student.name,
              age: age,
              birthDate: item.student.birthDate,
            };
          }
          return null;
        })
        .filter(Boolean)
        .filter((student) => {
          // Filter by classroom age range
          if (!classroom.ageRange) return true;
          const ageMatch =
            student.age >= (classroom.ageRange.min || 0) &&
            student.age <= (classroom.ageRange.max || 0);
          // Also filter out already enrolled students
          const notEnrolled = !enrolledStudentIds.has(student.id);
          return ageMatch && notEnrolled;
        });

      setStudents(studentList);
    } catch (error) {
      console.error("Error fetching students:", error);
      Alert.alert("Error", "Failed to load students");
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Fetch classroom data
  const fetchClassroomData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await api.get(API_ENDPOINTS.CLASSES.GET(id));
      setClassroom(data);
    } catch (error) {
      console.error("Error fetching classroom data:", error);
      Alert.alert("Error", error.message || "Failed to load classroom details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassroomData();
  }, [id]);

  // Fetch students when classroom is loaded and modal is opened
  useEffect(() => {
    if (showStudentModal && classroom) {
      fetchStudents();
    }
  }, [showStudentModal, classroom]);

  if (loading) {
    return (
      <BaseLayout showBottomNav={false} backgroundColor="bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text className="text-gray-500 text-base mt-4">
            Loading classroom...
          </Text>
        </View>
      </BaseLayout>
    );
  }

  if (!classroom) {
    return (
      <BaseLayout showBottomNav={false} backgroundColor="bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="school-outline" size={64} color={COLORS.GRAY_400} />
          <Text className="text-gray-500 text-base mt-4 text-center">
            Classroom not found
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 px-6 py-3 rounded-xl"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout showBottomNav={false} backgroundColor="bg-white">
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Purple Header Section */}
          <View
            className="pt-6 px-6 pb-6"
            style={{ backgroundColor: "#6A0DAD" }}
          >
            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="mr-4"
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-white mb-1">
                  Classroom Details
                </Text>
              </View>
            </View>

            {/* Classroom Name and Info */}
            <View className="items-center mt-4">
              <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-3">
                <Ionicons name="school" size={32} color="white" />
              </View>
              <Text className="text-3xl font-bold text-white mb-2">
                {classroom.name}
              </Text>
              {classroom.description && (
                <Text className="text-base text-white opacity-90 text-center mb-3">
                  {classroom.description}
                </Text>
              )}
              <View className="px-3 py-1 bg-white/20 rounded-full">
                <Text className="text-sm text-white font-semibold">
                  Ages {classroom.ageRange?.min || 0}-
                  {classroom.ageRange?.max || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Content Section */}
          <View className="px-4 pb-6 -mt-2">
            {/* Statistics Cards */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 bg-white rounded-xl shadow p-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="people" size={24} color={COLORS.PRIMARY} />
                  <Text className="text-3xl font-bold text-gray-900 ml-2">
                    {classroom.studentCount || 0}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500">
                  Student{classroom.studentCount !== 1 ? "s" : ""}
                </Text>
              </View>
              <View className="flex-1 bg-white rounded-xl shadow p-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name="document-text"
                    size={24}
                    color={COLORS.PRIMARY}
                  />
                  <Text className="text-3xl font-bold text-gray-900 ml-2">
                    {classroom.resourceCount || 0}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500">
                  Resource{classroom.resourceCount !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>

            {/* Enrolled Students List */}
            <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
              <View className="px-6 py-4 border-b border-gray-100 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-gray-900">
                  Enrolled Students ({classroom.students?.length || 0})
                </Text>
              </View>
              <View className="p-4">
                {classroom.students && classroom.students.length > 0 ? (
                  classroom.students.map((student, index) => {
                    const age = calculateAge(student.birthDate);
                    const isRemoving =
                      removingEnrollmentId === student.enrollmentId;
                    return (
                      <View
                        key={student.id}
                        className={`flex-row items-center py-4 ${
                          index !== classroom.students.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <TouchableOpacity
                          onPress={() => router.push(`/students/${student.id}`)}
                          activeOpacity={0.7}
                          className="flex-1 flex-row items-center"
                        >
                          <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center mr-3">
                            <Text className="text-lg font-semibold text-purple-700">
                              {student.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-base font-semibold text-gray-900">
                              {student.name}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">
                              Age {age !== null ? age : "N/A"}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleRemoveStudent(student)}
                          disabled={isRemoving}
                          activeOpacity={0.7}
                          className="ml-3 p-2"
                        >
                          {isRemoving ? (
                            <ActivityIndicator
                              size="small"
                              color={COLORS.PRIMARY}
                            />
                          ) : (
                            <Ionicons
                              name="close-circle"
                              size={24}
                              color="#EF4444"
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  })
                ) : (
                  <View className="py-8 items-center justify-center">
                    <Ionicons
                      name="people-outline"
                      size={48}
                      color={COLORS.GRAY_400}
                    />
                    <Text className="text-gray-500 text-base mt-4 text-center">
                      No students enrolled yet
                    </Text>
                    <Text className="text-gray-400 text-sm mt-2 text-center">
                      Use the "Enroll Students" section below to add students
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Classroom Information */}
            <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
              <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-lg font-bold text-gray-900">
                  Classroom Information
                </Text>
              </View>
              <View className="p-6">
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-500 mb-1">
                    Start Date
                  </Text>
                  <Text className="text-base text-gray-900">
                    {formatDate(classroom.startDate)}
                  </Text>
                </View>
                {classroom.endDate && (
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-500 mb-1">
                      End Date
                    </Text>
                    <Text className="text-base text-gray-900">
                      {formatDate(classroom.endDate)}
                    </Text>
                  </View>
                )}
                <View>
                  <Text className="text-sm font-semibold text-gray-500 mb-1">
                    Created At
                  </Text>
                  <Text className="text-base text-gray-900">
                    {formatDate(classroom.createdAt)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Age Range */}
            <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
              <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-lg font-bold text-gray-900">
                  Age Range
                </Text>
              </View>
              <View className="p-6">
                <View className="flex-row items-center">
                  <Ionicons name="calendar" size={24} color={COLORS.PRIMARY} />
                  <Text className="text-base text-gray-900 ml-3">
                    {classroom.ageRange?.min || 0} -{" "}
                    {classroom.ageRange?.max || 0} years old
                  </Text>
                </View>
              </View>
            </View>

            {/* Teacher Information */}
            {classroom.teacherName && (
              <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
                <View className="px-6 py-4 border-b border-gray-100">
                  <Text className="text-lg font-bold text-gray-900">
                    Teacher
                  </Text>
                </View>
                <View className="p-6">
                  <View className="flex-row items-center">
                    <Ionicons name="person" size={24} color={COLORS.PRIMARY} />
                    <Text className="text-base text-gray-900 ml-3">
                      {classroom.teacherName}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Add Students Section */}
            <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
              <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-lg font-bold text-gray-900">
                  Enroll Students
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Add students to this classroom
                </Text>
              </View>
              <View className="p-6">
                <TouchableOpacity
                  onPress={() => setShowStudentModal(true)}
                  activeOpacity={0.7}
                  className="border border-gray-300 rounded-xl px-4 py-3.5 flex-row items-center justify-between bg-white"
                >
                  <Text
                    className={`text-base flex-1 ${
                      selectedStudentIds.length > 0
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                    numberOfLines={1}
                  >
                    {selectedStudentIds.length > 0
                      ? `${selectedStudentIds.length} student${
                          selectedStudentIds.length !== 1 ? "s" : ""
                        } selected`
                      : "Select students to enroll"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={COLORS.GRAY_500}
                  />
                </TouchableOpacity>
                {selectedStudentIds.length > 0 && (
                  <TouchableOpacity
                    onPress={handleEnrollStudents}
                    disabled={isEnrolling}
                    activeOpacity={0.7}
                    className="mt-4 px-4 py-3 rounded-xl items-center"
                    style={{
                      backgroundColor: isEnrolling
                        ? COLORS.GRAY_400
                        : COLORS.PRIMARY,
                    }}
                  >
                    <Text className="text-white font-semibold text-base">
                      {isEnrolling
                        ? "Enrolling..."
                        : `Enroll ${selectedStudentIds.length} Student${
                            selectedStudentIds.length !== 1 ? "s" : ""
                          }`}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Student Selection Modal */}
      <Modal
        visible={showStudentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStudentModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowStudentModal(false)}
          className="flex-1 bg-black/50 justify-center items-center px-4"
        >
          <View
            className="bg-white rounded-xl w-full max-w-md"
            style={{ maxHeight: "70%" }}
            onStartShouldSetResponder={() => true}
          >
            <View className="px-4 py-3 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-900">
                Select Students
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Ages {classroom?.ageRange?.min || 0}-
                {classroom?.ageRange?.max || 0}
              </Text>
            </View>
            {isLoadingStudents ? (
              <View className="px-4 py-12 items-center justify-center">
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                <Text className="text-gray-500 text-base mt-4">
                  Loading students...
                </Text>
              </View>
            ) : students.length === 0 ? (
              <View className="px-4 py-12 items-center justify-center">
                <Ionicons
                  name="people-outline"
                  size={48}
                  color={COLORS.GRAY_400}
                />
                <Text className="text-gray-500 text-base mt-4 text-center">
                  No students available for this age range
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  Create students first or adjust the classroom age range
                </Text>
              </View>
            ) : (
              <FlatList
                data={students}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const isSelected = selectedStudentIds.includes(item.id);
                  return (
                    <TouchableOpacity
                      onPress={() => handleStudentToggle(item.id)}
                      activeOpacity={0.7}
                      className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100"
                    >
                      <View className="flex-1">
                        <Text className="text-base text-gray-900 font-medium">
                          {item.name}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          Age {item.age}
                        </Text>
                      </View>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={COLORS.PRIMARY}
                        />
                      )}
                      {!isSelected && (
                        <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
            <View className="px-4 py-3 border-t border-gray-200">
              <TouchableOpacity
                onPress={() => setShowStudentModal(false)}
                activeOpacity={0.7}
                className="bg-purple-600 rounded-xl py-3 items-center"
              >
                <Text className="text-white font-semibold text-base">
                  Done ({selectedStudentIds.length} selected)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </BaseLayout>
  );
}
