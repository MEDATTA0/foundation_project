import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BaseLayout } from "../../components/layout";
import { COLORS, API_ENDPOINTS } from "../../constants";
import { api } from "../../services/api";

export default function StudentDetailsPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    birthDate: "",
  });

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

  // Format date from API to YYYY-MM-DD format
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const data = await api.get(API_ENDPOINTS.STUDENTS.GET(id));

        // Transform API response to match UI expectations
        const transformedStudent = {
          id: data.id,
          name: data.name,
          birthDate: formatDateForInput(data.birthDate),
          age: calculateAge(data.birthDate),
          email: "", // Not in API response
          phone: "", // Not in API response
          address: "", // Not in API response
          enrollmentDate: formatDateForInput(data.createdAt),
          attendancePercentage:
            data.total > 0
              ? Math.round((data.attendance / data.total) * 100 * 10) / 10
              : 0,
          enrolledClasses:
            data.Enrollment?.map((enrollment) => ({
              id: enrollment.classId,
              name: enrollment.class?.name || "Unknown Class",
              enrollmentDate: formatDateForInput(enrollment.createdAt),
              status: "active",
            })) || [],
          attendance: data.attendance || 0,
          total: data.total || 0,
        };

        setStudent(transformedStudent);
        setEditForm({
          name: transformedStudent.name,
          birthDate: transformedStudent.birthDate,
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
        Alert.alert("Error", error.message || "Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Update student via API
      await api.patch(API_ENDPOINTS.STUDENTS.UPDATE(id), {
        name: editForm.name,
        birthDate: editForm.birthDate,
      });

      // Update local state
      const updatedAge = calculateAge(editForm.birthDate);
      setStudent({
        ...student,
        ...editForm,
        age: updatedAge,
      });
      setShowEditModal(false);
      Alert.alert("Success", "Student profile updated successfully");
    } catch (error) {
      console.error("Error updating student:", error);
      Alert.alert("Error", error.message || "Failed to update student profile");
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    if (student) {
      setEditForm({
        name: student.name,
        birthDate: student.birthDate,
      });
    }
    setShowEditModal(false);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return "#10B981"; // Green
    if (percentage >= 75) return "#F59E0B"; // Yellow/Orange
    return "#EF4444"; // Red
  };

  const getAttendanceLabel = (percentage) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 75) return "Good";
    return "Needs Improvement";
  };

  if (loading) {
    return (
      <BaseLayout showBottomNav={false} backgroundColor="bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text className="text-gray-500 text-base mt-4">
            Loading student...
          </Text>
        </View>
      </BaseLayout>
    );
  }

  if (!student) {
    return (
      <BaseLayout showBottomNav={false} backgroundColor="bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="person-outline" size={64} color={COLORS.GRAY_400} />
          <Text className="text-gray-500 text-base mt-4 text-center">
            Student not found
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
                  Student Details
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleEditProfile}
                className="ml-4"
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Student Avatar and Name */}
            <View className="items-center mt-4">
              <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-3">
                <Text className="text-4xl font-bold text-white">
                  {student.name.split(" ").length > 1
                    ? student.name
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase())
                        .join("")
                    : student.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="text-3xl font-bold text-white mb-1">
                {student.name}
              </Text>
              <Text className="text-base text-white opacity-90">
                Age {student.age}
              </Text>
            </View>

            {/* Attendance Card */}
            <View className="mt-6 bg-white/20 rounded-xl px-4 py-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-white opacity-90">
                  Attendance
                </Text>
                <Text
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: getAttendanceColor(
                      student.attendancePercentage
                    ),
                    color: "white",
                  }}
                >
                  {getAttendanceLabel(student.attendancePercentage)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="flex-1 mr-3">
                  <View className="h-3 bg-white/30 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${student.attendancePercentage}%`,
                        backgroundColor: getAttendanceColor(
                          student.attendancePercentage
                        ),
                      }}
                    />
                  </View>
                </View>
                <Text className="text-2xl font-bold text-white">
                  {student.attendancePercentage.toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Content Section */}
          <View className="px-4 pb-6 -mt-2">
            {/* Personal Information */}
            <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
              <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-lg font-bold text-gray-900">
                  Personal Information
                </Text>
              </View>
              <View className="p-6">
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-500 mb-1">
                    Birth Date
                  </Text>
                  <Text className="text-base text-gray-900">
                    {new Date(student.birthDate).toLocaleDateString()}
                  </Text>
                </View>
                <View>
                  <Text className="text-sm font-semibold text-gray-500 mb-1">
                    Enrollment Date
                  </Text>
                  <Text className="text-base text-gray-900">
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Enrolled Classes */}
            <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
              <View className="px-6 py-4 border-b border-gray-100 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-gray-900">
                  Enrolled Classes ({student.enrolledClasses.length})
                </Text>
              </View>
              <View className="p-4">
                {student.enrolledClasses.length > 0 ? (
                  student.enrolledClasses.map((classItem, index) => (
                    <View
                      key={classItem.id}
                      className={`flex-row items-center justify-between py-4 ${
                        index < student.enrolledClasses.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                          <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                            <Ionicons
                              name="school"
                              size={20}
                              color={COLORS.PRIMARY}
                            />
                          </View>
                          <View className="flex-1">
                            <Text className="text-base font-semibold text-slate-700">
                              {classItem.name}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">
                              Enrolled:{" "}
                              {new Date(
                                classItem.enrollmentDate
                              ).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View className="px-3 py-1 rounded-full bg-green-100">
                        <Text className="text-xs font-semibold text-green-700">
                          {classItem.status.charAt(0).toUpperCase() +
                            classItem.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="py-8 items-center justify-center">
                    <Ionicons
                      name="school-outline"
                      size={48}
                      color={COLORS.GRAY_400}
                    />
                    <Text className="text-gray-500 text-base mt-4 text-center">
                      No enrolled classes
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Edit Profile Button */}
            <TouchableOpacity
              onPress={handleEditProfile}
              activeOpacity={0.8}
              className="px-6 py-4 rounded-xl flex-row items-center justify-center mb-4"
              style={{ backgroundColor: COLORS.PRIMARY }}
            >
              <Ionicons name="create-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-base ml-2">
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelEdit}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 justify-end">
            <View className="bg-white rounded-t-xl max-h-[90%]">
              <View className="px-6 py-4 border-b border-gray-200 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-gray-900">
                  Edit Profile
                </Text>
                <TouchableOpacity
                  onPress={handleCancelEdit}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={24} color={COLORS.GRAY_600} />
                </TouchableOpacity>
              </View>
              <ScrollView className="px-6 py-4">
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </Text>
                  <TextInput
                    value={editForm.name}
                    onChangeText={(text) =>
                      setEditForm({ ...editForm, name: text })
                    }
                    placeholder="Enter full name"
                    className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                    style={{ color: COLORS.TEXT_PRIMARY }}
                  />
                </View>
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Birth Date
                  </Text>
                  <TextInput
                    value={editForm.birthDate}
                    onChangeText={(text) =>
                      setEditForm({ ...editForm, birthDate: text })
                    }
                    placeholder="YYYY-MM-DD (e.g., 2019-03-15)"
                    className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                    style={{ color: COLORS.TEXT_PRIMARY }}
                  />
                  <Text className="text-xs text-gray-500 mt-1">
                    Format: YYYY-MM-DD
                  </Text>
                </View>
                <View className="flex-row gap-3 mb-4">
                  <TouchableOpacity
                    onPress={handleCancelEdit}
                    activeOpacity={0.7}
                    className="flex-1 px-6 py-4 rounded-xl border border-gray-300"
                  >
                    <Text className="text-gray-700 font-semibold text-base text-center">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveProfile}
                    activeOpacity={0.7}
                    className="flex-1 px-6 py-4 rounded-xl"
                    style={{ backgroundColor: COLORS.PRIMARY }}
                  >
                    <Text className="text-white font-semibold text-base text-center">
                      Save Changes
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </BaseLayout>
  );
}
