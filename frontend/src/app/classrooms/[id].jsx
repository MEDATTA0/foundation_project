import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BaseLayout } from "../../components/layout";
import { BottomNavigation } from "../../components/navigation";
import { NAVIGATION_TABS, COLORS } from "../../constants";

export default function ClassroomDetailsPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, students, resources
  const [selectedResource, setSelectedResource] = useState(null);
  const [showResourceModal, setShowResourceModal] = useState(false);

  // Mock classroom data - to be replaced with actual API call
  const mockClassroom = {
    id: id || "class1",
    name: "Humanitarian Learning",
    description:
      "Introduction to humanitarian values and empathy. This course helps children understand the importance of kindness, compassion, and helping others.",
    ageRange: { min: 4, max: 6 },
    studentCount: 5,
    resourceCount: 8,
    teacherName: "Ms. Sarah Johnson",
    createdAt: "2024-01-15",
  };

  const mockStudents = [
    { id: 1, name: "Emma Watson", age: 5, avatar: "👧" },
    { id: 2, name: "Oliver Smith", age: 6, avatar: "👦" },
    { id: 3, name: "Sophia Johnson", age: 5, avatar: "👧" },
    { id: 4, name: "Liam Brown", age: 6, avatar: "👦" },
    { id: 5, name: "Mia Thompson", age: 5, avatar: "👧" },
  ];

  const mockResources = [
    {
      id: 1,
      title: "Basic Counting Course",
      description: "Learn numbers 1-10 with fun activities",
      type: "document",
      category: "Mathematics",
      ageRange: { min: 4, max: 6 },
      fileType: "PDF",
      size: "2.4 MB",
      duration: "15 min read",
    },
    {
      id: 2,
      title: "Alphabet Adventure",
      description: "Interactive alphabet learning video",
      type: "video",
      category: "Language",
      ageRange: { min: 4, max: 6 },
      fileType: "MP4",
      size: "125 MB",
      duration: "10 min",
    },
    {
      id: 3,
      title: "Sharing is Caring",
      description: "Story about sharing and kindness",
      type: "document",
      category: "Social Skills",
      ageRange: { min: 4, max: 6 },
      fileType: "PDF",
      size: "1.8 MB",
      duration: "8 min read",
    },
    {
      id: 4,
      title: "Colors of the Rainbow",
      description: "Learn colors through songs and activities",
      type: "video",
      category: "Arts",
      ageRange: { min: 4, max: 6 },
      fileType: "MP4",
      size: "98 MB",
      duration: "12 min",
    },
  ];

  // Fetch classroom data
  useEffect(() => {
    const fetchClassroomData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API calls
        // const classroomResponse = await api.get(`/classrooms/${id}`);
        // const studentsResponse = await api.get(`/classrooms/${id}/students`);
        // const resourcesResponse = await api.get(`/classrooms/${id}/resources`);
        // setClassroom(classroomResponse.data);
        // setStudents(studentsResponse.data);
        // setResources(resourcesResponse.data);

        // Using mock data
        setClassroom(mockClassroom);
        setStudents(mockStudents);
        setResources(mockResources);
      } catch (error) {
        console.error("Error fetching classroom data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, [id]);

  const getResourceIcon = (type) => {
    switch (type) {
      case "document":
        return { name: "document-text", color: "#3B82F6" };
      case "video":
        return { name: "videocam", color: "#EF4444" };
      case "link":
        return { name: "link", color: "#14B8A6" };
      case "image":
        return { name: "images", color: "#F97316" };
      default:
        return { name: "document", color: "#6B7280" };
    }
  };

  const handleResourcePress = (resource) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
  };

  const handleReadContent = (resource) => {
    // Navigate to reading view or open PDF viewer
    console.log("Reading content:", resource);
    // TODO: Implement reading functionality
    // router.push(`/resources/${resource.id}/read`);
  };

  const handlePlayVideo = (resource) => {
    // Open video player
    console.log("Playing video:", resource);
    // TODO: Implement video playback
    // router.push(`/resources/${resource.id}/play`);
  };

  const handleEditClassroom = () => {
    // Navigate to edit classroom page
    console.log("Edit classroom:", classroom.id);
    // router.push(`/classrooms/${classroom.id}/edit`);
  };

  const handleManageStudents = () => {
    // Navigate to manage students page
    router.push("/students");
  };

  const handleAddResource = () => {
    // Navigate to add resource page
    router.push("/resources");
  };

  if (loading) {
    return (
      <BaseLayout showBottomNav={false} backgroundColor="bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-base">Loading classroom...</Text>
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
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
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
                  {classroom.name}
                </Text>
                <Ionicons name="bookmark-outline" size={24} color="white" />
              </View>
              <TouchableOpacity
                onPress={handleEditClassroom}
                className="ml-4"
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View className="flex-row gap-4 mt-4">
              <View className="flex-1 bg-white/20 rounded-xl px-4 py-3">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="people" size={18} color="white" />
                  <Text className="text-2xl font-bold text-white ml-2">
                    {classroom.studentCount}
                  </Text>
                </View>
                <Text className="text-xs text-white opacity-90">
                  Student{classroom.studentCount !== 1 ? "s" : ""}
                </Text>
              </View>
              <View className="flex-1 bg-white/20 rounded-xl px-4 py-3">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="book" size={18} color="white" />
                  <Text className="text-2xl font-bold text-white ml-2">
                    {classroom.resourceCount}
                  </Text>
                </View>
                <Text className="text-xs text-white opacity-90">
                  Resource{classroom.resourceCount !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>
          </View>

          {/* Tab Navigation */}
          <View className="bg-white -mt-2 mx-4 mb-4">
            <View className="bg-white rounded-xl shadow overflow-hidden">
              <View className="flex-row">
                {[
                  { id: "overview", label: "Overview", icon: "grid" },
                  { id: "students", label: "Students", icon: "people" },
                  { id: "resources", label: "Resources", icon: "book" },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      onPress={() => setActiveTab(tab.id)}
                      className={`flex-1 py-4 items-center ${
                        isActive ? "bg-purple-50" : "bg-white"
                      }`}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={tab.icon}
                        size={20}
                        color={isActive ? COLORS.PRIMARY : COLORS.GRAY_500}
                      />
                      <Text
                        className={`text-xs font-semibold mt-1 ${
                          isActive ? "text-purple-600" : "text-gray-500"
                        }`}
                      >
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Content Section */}
          <View className="px-4 pb-6">
            {activeTab === "overview" && (
              <View className="bg-white rounded-xl shadow overflow-hidden p-6">
                {/* Description */}
                <View className="mb-6">
                  <Text className="text-lg font-bold text-gray-900 mb-3">
                    About This Classroom
                  </Text>
                  <Text className="text-base text-gray-600 leading-6">
                    {classroom.description}
                  </Text>
                </View>

                {/* Age Range Badge */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-500 mb-2">
                    Age Range
                  </Text>
                  <View className="px-4 py-2 bg-purple-100 rounded-full self-start">
                    <Text className="text-base font-semibold text-purple-700">
                      Ages {classroom.ageRange.min}-{classroom.ageRange.max}
                    </Text>
                  </View>
                </View>

                {/* Quick Actions */}
                <View className="gap-3">
                  <TouchableOpacity
                    onPress={handleManageStudents}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4">
                        <Ionicons name="people" size={24} color="#3B82F6" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                          Manage Students
                        </Text>
                        <Text className="text-sm text-gray-500">
                          Add or remove students
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={COLORS.GRAY_400}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleAddResource}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mr-4">
                        <Ionicons name="add-circle" size={24} color="#14B8A6" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                          Add Resources
                        </Text>
                        <Text className="text-sm text-gray-500">
                          Assign new resources
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={COLORS.GRAY_400}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {activeTab === "students" && (
              <View className="bg-white rounded-xl shadow overflow-hidden">
                <View className="px-6 py-4 border-b border-gray-100 flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">
                    Students ({students.length})
                  </Text>
                  <TouchableOpacity
                    onPress={handleManageStudents}
                    activeOpacity={0.7}
                    className="px-4 py-2 rounded-lg"
                    style={{ backgroundColor: COLORS.PRIMARY }}
                  >
                    <Text className="text-white font-semibold text-sm">
                      Manage
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="p-4">
                  {students.map((student, index) => (
                    <View
                      key={student.id}
                      className={`flex-row items-center py-4 ${
                        index < students.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center mr-4">
                        <Text className="text-2xl">
                          {student.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-slate-700">
                          {student.name}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          Age {student.age}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={COLORS.GRAY_400}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === "resources" && (
              <View>
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">
                    Resources ({resources.length})
                  </Text>
                  {/* <TouchableOpacity
                    onPress={handleAddResource}
                    activeOpacity={0.7}
                    className="px-4 py-2 rounded-lg"
                    style={{ backgroundColor: COLORS.PRIMARY }}
                  >
                    <Text className="text-white font-semibold text-sm">
                      Add
                    </Text>
                  </TouchableOpacity> */}
                </View>

                {resources.map((resource) => {
                  const resourceIcon = getResourceIcon(resource.type);
                  return (
                    <TouchableOpacity
                      key={resource.id}
                      onPress={() => handleResourcePress(resource)}
                      activeOpacity={0.7}
                      className="bg-white rounded-xl shadow overflow-hidden mb-4"
                    >
                      <View className="p-4">
                        <View className="flex-row items-start mb-3">
                          <View
                            className="w-12 h-12 rounded-full items-center justify-center mr-4"
                            style={{
                              backgroundColor: `${resourceIcon.color}15`,
                            }}
                          >
                            <Ionicons
                              name={resourceIcon.name}
                              size={24}
                              color={resourceIcon.color}
                            />
                          </View>
                          <View className="flex-1">
                            <Text className="text-base font-bold text-gray-900 mb-1">
                              {resource.title}
                            </Text>
                            <Text className="text-sm text-gray-600 mb-2">
                              {resource.description}
                            </Text>
                            <View className="flex-row items-center flex-wrap">
                              <View className="px-2 py-1 bg-gray-100 rounded-full mr-2 mb-1">
                                <Text className="text-xs font-medium text-gray-700">
                                  {resource.category}
                                </Text>
                              </View>
                              <Text className="text-xs text-gray-500">
                                {resource.duration}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-2 mt-2">
                          {resource.type === "document" ? (
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                handleReadContent(resource);
                              }}
                              activeOpacity={0.7}
                              className="flex-1 px-4 py-3 rounded-xl flex-row items-center justify-center"
                              style={{ backgroundColor: "#3B82F6" }}
                            >
                              <Ionicons name="book" size={18} color="white" />
                              <Text className="text-white font-semibold text-sm ml-2">
                                Read
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                handlePlayVideo(resource);
                              }}
                              activeOpacity={0.7}
                              className="flex-1 px-4 py-3 rounded-xl flex-row items-center justify-center"
                              style={{ backgroundColor: "#EF4444" }}
                            >
                              <Ionicons name="play" size={18} color="white" />
                              <Text className="text-white font-semibold text-sm ml-2">
                                Play
                              </Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              // Share or download
                            }}
                            activeOpacity={0.7}
                            className="px-4 py-3 rounded-xl border border-gray-300"
                          >
                            <Ionicons
                              name="download-outline"
                              size={18}
                              color={COLORS.GRAY_600}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Resource Detail Modal */}
      <Modal
        visible={showResourceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResourceModal(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 justify-end">
            <View className="bg-white rounded-t-xl max-h-[80%]">
              {selectedResource && (
                <>
                  <View className="px-6 py-4 border-b border-gray-200 flex-row items-center justify-between">
                    <Text className="text-lg font-bold text-gray-900">
                      Resource Details
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowResourceModal(false)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="close"
                        size={24}
                        color={COLORS.GRAY_600}
                      />
                    </TouchableOpacity>
                  </View>
                  <ScrollView className="px-6 py-4">
                    <View className="mb-4">
                      <View
                        className="w-16 h-16 rounded-full items-center justify-center mb-4"
                        style={{
                          backgroundColor: `${
                            getResourceIcon(selectedResource.type).color
                          }15`,
                        }}
                      >
                        <Ionicons
                          name={getResourceIcon(selectedResource.type).name}
                          size={32}
                          color={getResourceIcon(selectedResource.type).color}
                        />
                      </View>
                      <Text className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedResource.title}
                      </Text>
                      <Text className="text-base text-gray-600 mb-4">
                        {selectedResource.description}
                      </Text>
                      <View className="flex-row items-center flex-wrap gap-2">
                        <View className="px-3 py-1 bg-purple-100 rounded-full">
                          <Text className="text-xs font-semibold text-purple-700">
                            {selectedResource.category}
                          </Text>
                        </View>
                        <View className="px-3 py-1 bg-gray-100 rounded-full">
                          <Text className="text-xs font-medium text-gray-700">
                            {selectedResource.fileType}
                          </Text>
                        </View>
                        <Text className="text-xs text-gray-500">
                          {selectedResource.size}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row gap-3 mt-4">
                      {selectedResource.type === "document" ? (
                        <TouchableOpacity
                          onPress={() => {
                            handleReadContent(selectedResource);
                            setShowResourceModal(false);
                          }}
                          activeOpacity={0.7}
                          className="flex-1 px-6 py-4 rounded-xl flex-row items-center justify-center"
                          style={{ backgroundColor: "#3B82F6" }}
                        >
                          <Ionicons name="book" size={20} color="white" />
                          <Text className="text-white font-semibold text-base ml-2">
                            Read to Students
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            handlePlayVideo(selectedResource);
                            setShowResourceModal(false);
                          }}
                          activeOpacity={0.7}
                          className="flex-1 px-6 py-4 rounded-xl flex-row items-center justify-center"
                          style={{ backgroundColor: "#EF4444" }}
                        >
                          <Ionicons name="play" size={20} color="white" />
                          <Text className="text-white font-semibold text-base ml-2">
                            Play Video
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </BaseLayout>
  );
}
