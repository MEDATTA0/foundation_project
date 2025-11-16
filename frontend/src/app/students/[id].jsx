import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BaseLayout } from "../../components/layout";
import { COLORS } from "../../constants";

// Mock student data - to be replaced with actual API call
const mockStudentsData = {
  1: {
    id: 1,
    name: "Emma Watsonn",
    age: 5,
    birthDate: "2019-03-15",
    email: "emma.watson@example.com",
    phone: "+1234567890",
    address: "123 Main Street, City",
    enrollmentDate: "2024-01-10",
    attendancePercentage: 92.5,
    enrolledClasses: [
      {
        id: "class1",
        name: "Humanitarian Learning",
        enrollmentDate: "2024-01-10",
        status: "active",
      },
    ],
  },
  2: {
    id: 2,
    name: "Oliver Smith",
    age: 6,
    birthDate: "2018-05-20",
    email: "oliver.smith@example.com",
    phone: "+1234567891",
    address: "456 Oak Avenue, City",
    enrollmentDate: "2024-01-12",
    attendancePercentage: 88.3,
    enrolledClasses: [
      {
        id: "class1",
        name: "Humanitarian Learning",
        enrollmentDate: "2024-01-12",
        status: "active",
      },
    ],
  },
  3: {
    id: 3,
    name: "Sophia Johnson",
    age: 5,
    birthDate: "2019-07-08",
    email: "sophia.johnson@example.com",
    phone: "+1234567892",
    address: "789 Pine Road, City",
    enrollmentDate: "2024-01-15",
    attendancePercentage: 95.0,
    enrolledClasses: [
      {
        id: "class2",
        name: "Introduction to Technology",
        enrollmentDate: "2024-01-15",
        status: "active",
      },
    ],
  },
  4: {
    id: 4,
    name: "Liam Brown",
    age: 6,
    birthDate: "2018-09-12",
    email: "liam.brown@example.com",
    phone: "+1234567893",
    address: "321 Elm Street, City",
    enrollmentDate: "2024-01-18",
    attendancePercentage: 90.2,
    enrolledClasses: [
      {
        id: "class2",
        name: "Introduction to Technology",
        enrollmentDate: "2024-01-18",
        status: "active",
      },
    ],
  },
  5: {
    id: 5,
    name: "Ava Davis",
    age: 5,
    birthDate: "2019-11-25",
    email: "ava.davis@example.com",
    phone: "+1234567894",
    address: "654 Maple Drive, City",
    enrollmentDate: "2024-02-01",
    attendancePercentage: 87.5,
    enrolledClasses: [
      {
        id: "class3",
        name: "Basic Computer Skills",
        enrollmentDate: "2024-02-01",
        status: "active",
      },
    ],
  },
  6: {
    id: 6,
    name: "Noah Wilson",
    age: 6,
    birthDate: "2018-01-30",
    email: "noah.wilson@example.com",
    phone: "+1234567895",
    address: "987 Cedar Lane, City",
    enrollmentDate: "2024-02-05",
    attendancePercentage: 93.8,
    enrolledClasses: [
      {
        id: "class3",
        name: "Basic Computer Skills",
        enrollmentDate: "2024-02-05",
        status: "active",
      },
    ],
  },
  7: {
    id: 7,
    name: "Isabella Martinez",
    age: 5,
    birthDate: "2019-04-18",
    email: "isabella.martinez@example.com",
    phone: "+1234567896",
    address: "147 Birch Court, City",
    enrollmentDate: "2024-02-10",
    attendancePercentage: 91.2,
    enrolledClasses: [
      {
        id: "class4",
        name: "Basic English",
        enrollmentDate: "2024-02-10",
        status: "active",
      },
    ],
  },
  8: {
    id: 8,
    name: "Ethan Anderson",
    age: 6,
    birthDate: "2018-06-22",
    email: "ethan.anderson@example.com",
    phone: "+1234567897",
    address: "258 Spruce Way, City",
    enrollmentDate: "2024-02-12",
    attendancePercentage: 89.6,
    enrolledClasses: [
      {
        id: "class4",
        name: "Basic English",
        enrollmentDate: "2024-02-12",
        status: "active",
      },
    ],
  },
  9: {
    id: 9,
    name: "Mia Thompson",
    age: 5,
    birthDate: "2019-08-14",
    email: "mia.thompson@example.com",
    phone: "+1234567898",
    address: "369 Willow Street, City",
    enrollmentDate: "2024-01-10",
    attendancePercentage: 94.5,
    enrolledClasses: [
      {
        id: "class1",
        name: "Humanitarian Learning",
        enrollmentDate: "2024-01-10",
        status: "active",
      },
    ],
  },
  10: {
    id: 10,
    name: "James Wilson",
    age: 6,
    birthDate: "2018-10-05",
    email: "james.wilson@example.com",
    phone: "+1234567899",
    address: "741 Ash Avenue, City",
    enrollmentDate: "2024-01-15",
    attendancePercentage: 86.7,
    enrolledClasses: [
      {
        id: "class2",
        name: "Introduction to Technology",
        enrollmentDate: "2024-01-15",
        status: "active",
      },
    ],
  },
  11: {
    id: 11,
    name: "Charlotte Lee",
    age: 5,
    birthDate: "2019-12-17",
    email: "charlotte.lee@example.com",
    phone: "+1234567900",
    address: "852 Poplar Road, City",
    enrollmentDate: "2024-02-01",
    attendancePercentage: 92.1,
    enrolledClasses: [
      {
        id: "class3",
        name: "Basic Computer Skills",
        enrollmentDate: "2024-02-01",
        status: "active",
      },
    ],
  },
  12: {
    id: 12,
    name: "Benjamin Taylor",
    age: 6,
    birthDate: "2018-02-28",
    email: "benjamin.taylor@example.com",
    phone: "+1234567901",
    address: "963 Fir Circle, City",
    enrollmentDate: "2024-02-10",
    attendancePercentage: 88.9,
    enrolledClasses: [
      {
        id: "class4",
        name: "Basic English",
        enrollmentDate: "2024-02-10",
        status: "active",
      },
    ],
  },
  13: {
    id: 13,
    name: "Amelia White",
    age: 5,
    birthDate: "2019-05-11",
    email: "amelia.white@example.com",
    phone: "+1234567902",
    address: "159 Hemlock Drive, City",
    enrollmentDate: "2024-01-10",
    attendancePercentage: 96.3,
    enrolledClasses: [
      {
        id: "class1",
        name: "Humanitarian Learning",
        enrollmentDate: "2024-01-10",
        status: "active",
      },
    ],
  },
  14: {
    id: 14,
    name: "Lucas Harris",
    age: 6,
    birthDate: "2018-07-23",
    email: "lucas.harris@example.com",
    phone: "+1234567903",
    address: "357 Cypress Lane, City",
    enrollmentDate: "2024-01-15",
    attendancePercentage: 91.7,
    enrolledClasses: [
      {
        id: "class2",
        name: "Introduction to Technology",
        enrollmentDate: "2024-01-15",
        status: "active",
      },
    ],
  },
  15: {
    id: 15,
    name: "Harper Clark",
    age: 5,
    birthDate: "2019-09-04",
    email: "harper.clark@example.com",
    phone: "+1234567904",
    address: "468 Redwood Street, City",
    enrollmentDate: "2024-02-01",
    attendancePercentage: 89.4,
    enrolledClasses: [
      {
        id: "class3",
        name: "Basic Computer Skills",
        enrollmentDate: "2024-02-01",
        status: "active",
      },
    ],
  },
  16: {
    id: 16,
    name: "Alexander Lewis",
    age: 6,
    birthDate: "2018-11-16",
    email: "alexander.lewis@example.com",
    phone: "+1234567905",
    address: "579 Sequoia Avenue, City",
    enrollmentDate: "2024-02-10",
    attendancePercentage: 93.2,
    enrolledClasses: [
      {
        id: "class4",
        name: "Basic English",
        enrollmentDate: "2024-02-10",
        status: "active",
      },
    ],
  },
  17: {
    id: 17,
    name: "Evelyn Walker",
    age: 5,
    birthDate: "2019-01-27",
    email: "evelyn.walker@example.com",
    phone: "+1234567906",
    address: "680 Magnolia Court, City",
    enrollmentDate: "2024-01-10",
    attendancePercentage: 90.8,
    enrolledClasses: [
      {
        id: "class1",
        name: "Humanitarian Learning",
        enrollmentDate: "2024-01-10",
        status: "active",
      },
    ],
  },
  18: {
    id: 18,
    name: "Daniel Hall",
    age: 6,
    birthDate: "2018-03-09",
    email: "daniel.hall@example.com",
    phone: "+1234567907",
    address: "791 Dogwood Way, City",
    enrollmentDate: "2024-01-15",
    attendancePercentage: 87.3,
    enrolledClasses: [
      {
        id: "class2",
        name: "Introduction to Technology",
        enrollmentDate: "2024-01-15",
        status: "active",
      },
    ],
  },
  19: {
    id: 19,
    name: "Abigail Young",
    age: 5,
    birthDate: "2019-06-21",
    email: "abigail.young@example.com",
    phone: "+1234567908",
    address: "802 Sycamore Road, City",
    enrollmentDate: "2024-02-01",
    attendancePercentage: 94.1,
    enrolledClasses: [
      {
        id: "class3",
        name: "Basic Computer Skills",
        enrollmentDate: "2024-02-01",
        status: "active",
      },
    ],
  },
  20: {
    id: 20,
    name: "Matthew King",
    age: 6,
    birthDate: "2018-08-13",
    email: "matthew.king@example.com",
    phone: "+1234567909",
    address: "913 Chestnut Drive, City",
    enrollmentDate: "2024-02-10",
    attendancePercentage: 92.6,
    enrolledClasses: [
      {
        id: "class4",
        name: "Basic English",
        enrollmentDate: "2024-02-10",
        status: "active",
      },
    ],
  },
};

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

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await api.get(`/students/${id}`);
        // setStudent(response.data);

        // Using mock data
        const studentData = mockStudentsData[parseInt(id)];
        if (studentData) {
          setStudent(studentData);
          setEditForm({
            name: studentData.name,
            birthDate: studentData.birthDate,
          });
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentData();
    }
  }, [id]);

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    // TODO: Replace with actual API call
    // await api.put(`/students/${id}`, editForm);
    console.log("Saving profile:", editForm);

    // Calculate age from birthDate
    const birthDate = new Date(editForm.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Update local state
    setStudent({
      ...student,
      ...editForm,
      age: age,
    });
    setShowEditModal(false);
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
          <Text className="text-gray-500 text-base">Loading student...</Text>
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
