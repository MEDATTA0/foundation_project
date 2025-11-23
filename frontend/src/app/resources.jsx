import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BaseLayout } from "../components/layout";
import { BottomNavigation } from "../components/navigation";
import { NAVIGATION_TABS, COLORS, API_ENDPOINTS } from "../constants";
import { api } from "../services/api";
import { useAuthStore } from "../stores";

export default function ResourcesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Age range filter options
  const ageRanges = [
    { id: "all", label: "All", min: null, max: null },
    { id: "4-6", label: "4-6", min: 4, max: 6 },
    { id: "7-10", label: "7-10", min: 7, max: 10 },
    { id: "11-14", label: "11-14", min: 11, max: 14 },
  ];

  const [selectedAgeRange, setSelectedAgeRange] = useState(ageRanges[0]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock resource data - Replace with actual API call
  // Expected structure from backend:
  // {
  //   id: number,
  //   title: string,
  //   description: string,
  //   type: "document" | "video" | "link" | "image",
  //   ageRange: { min: number, max: number },
  //   category: string,
  //   url?: string,
  //   size?: string,
  //   fileType?: string,
  // }
  const mockResources = [
    {
      id: 1,
      title: "Basic Counting Course",
      description: "Learn numbers 1-10 with fun activities",
      type: "document",
      ageRange: { min: 4, max: 6 },
      category: "Mathematics",
      fileType: "PDF",
      size: "2.4 MB",
    },
    {
      id: 2,
      title: "Alphabet Adventure",
      description: "Interactive alphabet learning",
      type: "video",
      ageRange: { min: 4, max: 6 },
      category: "Language",
      fileType: "MP4",
      size: "125 MB",
    },
    {
      id: 3,
      title: "Simple Addition",
      description: "Introduction to addition for beginners",
      type: "document",
      ageRange: { min: 7, max: 10 },
      category: "Mathematics",
      fileType: "PDF",
      size: "1.8 MB",
    },
    {
      id: 4,
      title: "Reading Comprehension",
      description: "Practice reading and understanding stories",
      type: "document",
      ageRange: { min: 7, max: 10 },
      category: "Language",
      fileType: "PDF",
      size: "3.2 MB",
    },
    {
      id: 5,
      title: "Science Experiments",
      description: "Fun science activities for kids",
      type: "video",
      ageRange: { min: 7, max: 10 },
      category: "Science",
      fileType: "MP4",
      size: "98 MB",
    },
    {
      id: 6,
      title: "Introduction to Coding",
      description: "Learn basic programming concepts",
      type: "link",
      ageRange: { min: 11, max: 14 },
      category: "Technology",
      url: "https://example.com/coding",
    },
    {
      id: 7,
      title: "Advanced Mathematics",
      description: "Complex problem solving",
      type: "document",
      ageRange: { min: 11, max: 14 },
      category: "Mathematics",
      fileType: "PDF",
      size: "4.5 MB",
    },
    {
      id: 8,
      title: "Creative Writing",
      description: "Express yourself through writing",
      type: "document",
      ageRange: { min: 11, max: 14 },
      category: "Language",
      fileType: "DOCX",
      size: "456 KB",
    },
  ];

  // Fetch resources from backend
  useEffect(() => {
    const fetchResources = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        // Fetch all resources for the teacher (across all classes)
        const data = await api.get(API_ENDPOINTS.RESOURCES.LIST);

        // Transform backend data to match frontend expectations
        // Backend returns: { id, classId, title, description, resource (URL string), ageMin, ageMax, ageRange, createdAt, updatedAt, class: { id, name } }
        const transformedResources = data.map((item) => {
          // Determine resource type from URL
          const url = item.resource;
          let type = "link";
          if (
            url.match(/\.(pdf|doc|docx)$/i) ||
            url.includes("drive.google.com") ||
            url.includes("dropbox.com")
          )
            type = "document";
          else if (
            url.match(/\.(mp4|avi|mov)$/i) ||
            url.includes("youtube.com") ||
            url.includes("youtu.be") ||
            url.includes("vimeo.com")
          )
            type = "video";
          else if (url.match(/\.(jpg|jpeg|png|gif)$/i)) type = "image";

          return {
            id: item.id,
            title: item.title || item.resource.split("/").pop() || "Resource",
            description:
              item.description ||
              `Resource from ${item.class?.name || "Unknown Class"}`,
            type: type,
            url: item.resource,
            classId: item.classId,
            className: item.class?.name || "Unknown",
            ageRange:
              item.ageRange ||
              (item.ageMin !== null && item.ageMax !== null
                ? { min: item.ageMin, max: item.ageMax }
                : null),
            createdAt: item.createdAt,
          };
        });

        setResources(transformedResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
        // Fallback to empty array on error
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [isAuthenticated]);

  // Filter resources based on selected age range
  const filteredResources =
    selectedAgeRange.id === "all"
      ? resources
      : resources.filter((resource) => {
          if (!resource.ageRange) return false; // Exclude resources without age range
          // Check if resource age range overlaps with selected filter range
          return (
            resource.ageRange.min <= selectedAgeRange.max &&
            resource.ageRange.max >= selectedAgeRange.min
          );
        });

  // Group resources by category
  const groupedResources = filteredResources.reduce((acc, resource) => {
    const category = resource.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(resource);
    return acc;
  }, {});

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

  const handleAgeRangeFilter = (ageRange) => {
    setSelectedAgeRange(ageRange);
  };

  const handleRemoveResource = (resource) => {
    Alert.alert(
      "Remove Resource",
      "Are you sure you want to remove this resource?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            console.log("Remove resource:", resource);
          },
        },
      ]
    );
  };

  const handleViewResource = (resource) => {
    // Navigate to resource details page with classId
    router.push({
      pathname: `/resources/${resource.id}`,
      params: { classId: resource.classId },
    });
  };

  const handleCreateResource = () => {
    router.push("/resources/create");
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
            className="pt-6 px-6 pb-12"
            style={{ backgroundColor: "#6A0DAD" }}
          >
            <Text className="text-4xl font-bold text-white mb-2">
              Resources
            </Text>
            <Text className="text-lg text-white opacity-90 mb-4">
              Filter by age range and assign courses to children
            </Text>

            {/* Create Resource Button */}
            <TouchableOpacity
              onPress={handleCreateResource}
              activeOpacity={0.7}
              className="bg-white rounded-full px-6 py-3 flex-row items-center justify-center mb-4 shadow-lg"
            >
              <Ionicons name="add-circle" size={24} color="#6A0DAD" />
              <Text className="text-purple-600 font-semibold text-base ml-2">
                Create Resource
              </Text>
            </TouchableOpacity>

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

          {/* White Background Section with Resources */}
          <View className="bg-white -mt-8 pb-6">
            {loading ? (
              <View className="px-6 py-12 items-center justify-center">
                <Text className="text-gray-500 text-base">
                  Loading resources...
                </Text>
              </View>
            ) : filteredResources.length === 0 ? (
              <View className="px-6 py-12 items-center justify-center">
                <Ionicons
                  name="document-outline"
                  size={48}
                  color={COLORS.GRAY_400}
                />
                <Text className="text-gray-500 text-base mt-4 text-center">
                  No resources found for this age range
                </Text>
              </View>
            ) : (
              Object.entries(groupedResources).map(
                ([category, categoryResources]) => {
                  const categoryIcon = getResourceIcon(
                    categoryResources[0]?.type || "document"
                  );
                  return (
                    <View key={category} className="mx-4 mb-4">
                      <View className="bg-white rounded-xl shadow overflow-hidden">
                        {/* Category Header */}
                        <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
                          <View
                            className="w-12 h-12 rounded-full items-center justify-center mr-4"
                            style={{
                              backgroundColor: `${categoryIcon.color}15`,
                            }}
                          >
                            <Ionicons
                              name={categoryIcon.name}
                              size={24}
                              color={categoryIcon.color}
                            />
                          </View>
                          <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-900">
                              {category}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">
                              {categoryResources.length} course
                              {categoryResources.length !== 1 ? "s" : ""}
                            </Text>
                          </View>
                        </View>

                        {/* Resource Items */}
                        <View className="px-4 py-2">
                          {categoryResources.map((resource, index) => {
                            const resourceIcon = getResourceIcon(resource.type);
                            return (
                              <View
                                key={resource.id}
                                className={`py-4 ${
                                  index < categoryResources.length - 1
                                    ? "border-b border-gray-100"
                                    : ""
                                }`}
                              >
                                <View className="flex-row items-start mb-3">
                                  <View
                                    className="w-10 h-10 rounded-full items-center justify-center mr-3 mt-1"
                                    style={{
                                      backgroundColor: `${resourceIcon.color}15`,
                                    }}
                                  >
                                    <Ionicons
                                      name={resourceIcon.name}
                                      size={20}
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
                                    <View className="flex-row items-center">
                                      <View className="px-2 py-1 bg-purple-100 rounded-full mr-2">
                                        <Text className="text-xs font-semibold text-purple-700">
                                          Ages {resource.ageRange.min}-
                                          {resource.ageRange.max}
                                        </Text>
                                      </View>
                                      {resource.fileType && (
                                        <Text className="text-xs text-gray-500">
                                          {resource.fileType}
                                        </Text>
                                      )}
                                      {resource.size && (
                                        <>
                                          <Text className="text-xs text-gray-400 mx-1">
                                            •
                                          </Text>
                                          <Text className="text-xs text-gray-500">
                                            {resource.size}
                                          </Text>
                                        </>
                                      )}
                                    </View>
                                  </View>
                                </View>

                                {/* Action Buttons */}
                                <View
                                  className="flex-row gap-2"
                                  style={{ marginLeft: 52 }}
                                >
                                  <TouchableOpacity
                                    onPress={() => handleViewResource(resource)}
                                    activeOpacity={0.7}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 flex-row items-center justify-center"
                                  >
                                    <Ionicons
                                      name={
                                        resource.type === "link"
                                          ? "open-outline"
                                          : "eye-outline"
                                      }
                                      size={18}
                                      color="#6B7280"
                                    />
                                    <Text className="text-gray-700 font-medium text-sm ml-2">
                                      {resource.type === "link"
                                        ? "Open"
                                        : "View"}
                                    </Text>
                                  </TouchableOpacity>
                                  {/* <TouchableOpacity
                                    onPress={() =>
                                      handleAssignResource(resource)
                                    }
                                    activeOpacity={0.7}
                                    className="flex-1 px-4 py-2 rounded-lg flex-row items-center justify-center"
                                    style={{ backgroundColor: COLORS.PRIMARY }}
                                  >
                                    <Ionicons
                                      name="person-add"
                                      size={18}
                                      color="white"
                                    />
                                    <Text className="text-white font-semibold text-sm ml-2">
                                      Assign
                                    </Text>
                                  </TouchableOpacity> */}
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleRemoveResource(resource)
                                    }
                                    activeOpacity={0.7}
                                    className="flex-1 px-4 py-2 rounded-lg flex-row items-center justify-center"
                                    style={{
                                      backgroundColor: "white",
                                      borderWidth: 1,
                                      borderColor: "#EF4444",
                                    }}
                                  >
                                    <Ionicons
                                      name="trash"
                                      size={18}
                                      color="#EF4444"
                                    />
                                    <Text className="text-red-500 font-semibold text-sm ml-2">
                                      Remove
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                  );
                }
              )
            )}
          </View>
        </ScrollView>
      </View>
    </BaseLayout>
  );
}
