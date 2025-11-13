import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BaseLayout } from "../components/layout";
import { BottomNavigation } from "../components/navigation";
import { NAVIGATION_TABS, COLORS } from "../constants";

export default function ClassroomsPage() {
  const router = useRouter();

  // Age range filter options
  const ageRanges = [
    { id: "all", label: "All", min: null, max: null },
    { id: "4-6", label: "4-6", min: 4, max: 6 },
    { id: "7-10", label: "7-10", min: 7, max: 10 },
    { id: "11-14", label: "11-14", min: 11, max: 14 },
  ];

  const [selectedAgeRange, setSelectedAgeRange] = useState(ageRanges[0]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock classroom data - Replace with actual API call
  // Expected structure from backend:
  // {
  //   id: string,
  //   name: string,
  //   description: string,
  //   ageRange: { min: number, max: number },
  //   studentCount: number,
  //   resourceCount: number,
  //   teacherName?: string,
  //   createdAt?: string,
  // }
  const mockClassrooms = [
    {
      id: "class1",
      name: "Humanitarian Learning",
      description: "Introduction to humanitarian values and empathy",
      ageRange: { min: 4, max: 6 },
      studentCount: 5,
      resourceCount: 8,
      teacherName: "Ms. Sarah Johnson",
    },
    {
      id: "class2",
      name: "Introduction to Technology",
      description: "Basic computer skills and digital literacy",
      ageRange: { min: 7, max: 10 },
      studentCount: 6,
      resourceCount: 12,
      teacherName: "Mr. David Chen",
    },
    {
      id: "class3",
      name: "Basic Computer Skills",
      description: "Fundamental computing concepts and applications",
      ageRange: { min: 7, max: 10 },
      studentCount: 5,
      resourceCount: 10,
      teacherName: "Ms. Emily Rodriguez",
    },
    {
      id: "class4",
      name: "Basic English",
      description: "English language fundamentals for beginners",
      ageRange: { min: 4, max: 6 },
      studentCount: 4,
      resourceCount: 6,
      teacherName: "Mr. James Wilson",
    },
    {
      id: "class5",
      name: "Advanced Mathematics",
      description: "Complex problem solving and critical thinking",
      ageRange: { min: 11, max: 14 },
      studentCount: 7,
      resourceCount: 15,
      teacherName: "Ms. Lisa Anderson",
    },
    {
      id: "class6",
      name: "Creative Arts",
      description: "Exploring creativity through art and expression",
      ageRange: { min: 7, max: 10 },
      studentCount: 6,
      resourceCount: 9,
      teacherName: "Mr. Michael Brown",
    },
  ];

  // Fetch classrooms from backend
  useEffect(() => {
    const fetchClassrooms = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await api.get('/classrooms');
        // setClassrooms(response.data);

        // Using mock data for now
        setClassrooms(mockClassrooms);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  // Filter classrooms based on selected age range
  const filteredClassrooms =
    selectedAgeRange.id === "all"
      ? classrooms
      : classrooms.filter((classroom) => {
          // Check if classroom age range overlaps with selected filter range
          return (
            classroom.ageRange.min <= selectedAgeRange.max &&
            classroom.ageRange.max >= selectedAgeRange.min
          );
        });

  const handleAgeRangeFilter = (ageRange) => {
    setSelectedAgeRange(ageRange);
  };

  const handleCreateClassroom = () => {
    // Navigate to create classroom screen
    console.log("Create classroom");
    // TODO: Navigate to create classroom screen
    // router.push('/classrooms/create');
  };

  const handleViewClassroom = (classroomId) => {
    // Navigate to classroom details screen
    console.log("View classroom:", classroomId);
    // TODO: Navigate to classroom details
    // router.push(`/classrooms/${classroomId}`);
  };

  const handleViewStudents = (classroomId) => {
    // Navigate to students list filtered by classroom
    console.log("View students for classroom:", classroomId);
    router.push("/students");
  };

  const handleManageResources = (classroomId) => {
    // Navigate to manage resources for this classroom
    console.log("Manage resources for classroom:", classroomId);
    // TODO: Navigate to classroom resources management
    // router.push(`/classrooms/${classroomId}/resources`);
  };

  return (
    <BaseLayout
      showBottomNav={true}
      bottomNav={<BottomNavigation tabs={NAVIGATION_TABS} />}
      backgroundColor="bg-white"
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        >
          {/* Purple Header Section */}
          <View
            className="pt-16 px-6 pb-6"
            style={{ backgroundColor: "#6A0DAD", minHeight: 180 }}
          >
            <Text className="text-4xl font-bold text-white mb-2">
              Classrooms
            </Text>
            <Text className="text-lg text-white opacity-90 mb-4">
              Manage your classrooms, students, and assigned courses
            </Text>

            {/* Age Range Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-2"
            >
              <View className="flex-row gap-2">
                {ageRanges.map((ageRange) => {
                  const isSelected = selectedAgeRange.id === ageRange.id;
                  return (
                    <TouchableOpacity
                      key={ageRange.id}
                      onPress={() => handleAgeRangeFilter(ageRange)}
                      activeOpacity={0.7}
                      className={`px-5 py-2 rounded-full border-2 ${
                        isSelected
                          ? "bg-white border-white"
                          : "bg-transparent border-white/50"
                      }`}
                    >
                      <Text
                        className={`text-base font-semibold ${
                          isSelected ? "text-purple-600" : "text-white"
                        }`}
                      >
                        {ageRange.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* White Background Section with Classrooms */}
          <View className="bg-white -mt-8 pb-6">
            {/* Create Classroom Button */}
            <View className="mx-4 my-4">
              <TouchableOpacity
                onPress={handleCreateClassroom}
                activeOpacity={0.7}
                className="bg-purple-600 rounded-full px-6 py-4 flex-row items-center justify-center shadow-lg"
              >
                <Ionicons name="add-circle" size={24} color="white" />
                <Text className="text-white font-semibold text-base ml-2">
                  Create New Classroom
                </Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View className="px-6 py-12 items-center justify-center">
                <Text className="text-gray-500 text-base">
                  Loading classrooms...
                </Text>
              </View>
            ) : filteredClassrooms.length === 0 ? (
              <View className="px-6 py-12 items-center justify-center">
                <Ionicons
                  name="school-outline"
                  size={48}
                  color={COLORS.GRAY_400}
                />
                <Text className="text-gray-500 text-base mt-4 text-center">
                  No classrooms found for this age range
                </Text>
              </View>
            ) : (
              filteredClassrooms.map((classroom) => (
                <View key={classroom.id} className="mx-4 mb-4">
                  <View className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    {/* Classroom Header */}
                    <TouchableOpacity
                      onPress={() => handleViewClassroom(classroom.id)}
                      activeOpacity={0.7}
                      className="px-6 py-4 border-b border-gray-100"
                    >
                      <View className="flex-row items-start">
                        <View className="w-14 h-14 rounded-full bg-purple-100 items-center justify-center mr-4">
                          <Ionicons
                            name="school"
                            size={28}
                            color={COLORS.PRIMARY}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-xl font-bold text-gray-900 mb-1">
                            {classroom.name}
                          </Text>
                          <Text className="text-sm text-gray-600 mb-2">
                            {classroom.description}
                          </Text>
                          <View className="flex-row items-center flex-wrap">
                            <View className="px-2 py-1 bg-purple-100 rounded-full mr-2 mb-1">
                              <Text className="text-xs font-semibold text-purple-700">
                                Ages {classroom.ageRange.min}-
                                {classroom.ageRange.max}
                              </Text>
                            </View>
                            {classroom.teacherName && (
                              <View className="flex-row items-center mr-2 mb-1">
                                <Ionicons
                                  name="person"
                                  size={14}
                                  color="#6B7280"
                                />
                                <Text className="text-xs text-gray-500 ml-1">
                                  {classroom.teacherName}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#9CA3AF"
                        />
                      </View>
                    </TouchableOpacity>

                    {/* Classroom Stats */}
                    <View className="px-6 py-4 bg-gray-50">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 items-center">
                          <View className="flex-row items-center mb-1">
                            <Ionicons
                              name="people"
                              size={20}
                              color={COLORS.PRIMARY}
                            />
                            <Text className="text-2xl font-bold text-gray-900 ml-2">
                              {classroom.studentCount}
                            </Text>
                          </View>
                          <Text className="text-xs text-gray-500">
                            Student{classroom.studentCount !== 1 ? "s" : ""}
                          </Text>
                        </View>
                        <View className="w-px h-12 bg-gray-300" />
                        <View className="flex-1 items-center">
                          <View className="flex-row items-center mb-1">
                            <Ionicons
                              name="document-text"
                              size={20}
                              color={COLORS.PRIMARY}
                            />
                            <Text className="text-2xl font-bold text-gray-900 ml-2">
                              {classroom.resourceCount}
                            </Text>
                          </View>
                          <Text className="text-xs text-gray-500">
                            Resource
                            {classroom.resourceCount !== 1 ? "s" : ""}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="px-4 py-3 flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleViewStudents(classroom.id)}
                        activeOpacity={0.7}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 flex-row items-center justify-center"
                      >
                        <Ionicons
                          name="people-outline"
                          size={18}
                          color="#6B7280"
                        />
                        <Text className="text-gray-700 font-medium text-sm ml-2">
                          Students
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleManageResources(classroom.id)}
                        activeOpacity={0.7}
                        className="flex-1 px-4 py-3 rounded-lg flex-row items-center justify-center"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                      >
                        <Ionicons name="book-outline" size={18} color="white" />
                        <Text className="text-white font-semibold text-sm ml-2">
                          Resources
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </BaseLayout>
  );
}
