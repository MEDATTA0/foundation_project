import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BaseLayout } from "../../components/layout";
import { BottomNavigation } from "../../components/navigation";
import { NAVIGATION_TABS, COLORS } from "../../constants";

/**
 * Resource Details Page
 * View detailed information about a resource and interact with it
 */
export default function ResourceDetailsPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Mock resource data - Replace with actual API call
  const mockResources = {
    1: {
      id: 1,
      title: "Basic Counting Course",
      description:
        "Learn numbers 1-10 with fun activities. This comprehensive course introduces children to basic counting through interactive exercises, colorful illustrations, and engaging stories that make learning numbers enjoyable and memorable.",
      type: "document",
      category: "Mathematics",
      ageRange: { min: 4, max: 6 },
      fileType: "PDF",
      size: "2.4 MB",
      duration: "15 min read",
      pages: 24,
      createdAt: "2024-01-15",
      author: "Ms. Sarah Johnson",
      tags: ["Numbers", "Counting", "Basic Math"],
    },
    2: {
      id: 2,
      title: "Alphabet Adventure",
      description:
        "Interactive alphabet learning video. Join our animated characters as they explore each letter of the alphabet through songs, stories, and fun activities. Perfect for young learners starting their reading journey.",
      type: "video",
      category: "Language",
      ageRange: { min: 4, max: 6 },
      fileType: "MP4",
      size: "125 MB",
      duration: "10 min",
      resolution: "1080p",
      createdAt: "2024-01-20",
      author: "Mr. David Chen",
      tags: ["Alphabet", "Reading", "Language"],
    },
    3: {
      id: 3,
      title: "Simple Addition",
      description:
        "Introduction to addition for beginners. This course teaches children the fundamentals of addition through visual aids, step-by-step instructions, and practice exercises.",
      type: "document",
      category: "Mathematics",
      ageRange: { min: 7, max: 10 },
      fileType: "PDF",
      size: "1.8 MB",
      duration: "12 min read",
      pages: 18,
      createdAt: "2024-02-01",
      author: "Ms. Emily Rodriguez",
      tags: ["Addition", "Math", "Arithmetic"],
    },
    4: {
      id: 4,
      title: "Reading Comprehension",
      description:
        "Practice reading and understanding stories. Develop critical thinking skills through engaging stories and comprehension questions.",
      type: "document",
      category: "Language",
      ageRange: { min: 7, max: 10 },
      fileType: "PDF",
      size: "3.2 MB",
      duration: "20 min read",
      pages: 32,
      createdAt: "2024-02-05",
      author: "Mr. James Wilson",
      tags: ["Reading", "Comprehension", "Stories"],
    },
    5: {
      id: 5,
      title: "Science Experiments",
      description:
        "Fun science activities for kids. Learn about the world through hands-on experiments and exciting discoveries.",
      type: "video",
      category: "Science",
      ageRange: { min: 7, max: 10 },
      fileType: "MP4",
      size: "98 MB",
      duration: "15 min",
      resolution: "1080p",
      createdAt: "2024-02-10",
      author: "Ms. Lisa Anderson",
      tags: ["Science", "Experiments", "Discovery"],
    },
    6: {
      id: 6,
      title: "Introduction to Coding",
      description:
        "Learn basic programming concepts through interactive exercises and visual programming.",
      type: "link",
      category: "Technology",
      ageRange: { min: 11, max: 14 },
      url: "https://example.com/coding",
      createdAt: "2024-02-15",
      author: "Mr. Michael Brown",
      tags: ["Coding", "Programming", "Technology"],
    },
    7: {
      id: 7,
      title: "Advanced Mathematics",
      description:
        "Complex problem solving and critical thinking. Advanced concepts for older students.",
      type: "document",
      category: "Mathematics",
      ageRange: { min: 11, max: 14 },
      fileType: "PDF",
      size: "4.5 MB",
      duration: "30 min read",
      pages: 45,
      createdAt: "2024-02-20",
      author: "Ms. Lisa Anderson",
      tags: ["Math", "Problem Solving", "Advanced"],
    },
    8: {
      id: 8,
      title: "Creative Writing",
      description:
        "Express yourself through writing. Learn to write stories, poems, and creative pieces.",
      type: "document",
      category: "Language",
      ageRange: { min: 11, max: 14 },
      fileType: "DOCX",
      size: "456 KB",
      duration: "25 min read",
      pages: 12,
      createdAt: "2024-02-25",
      author: "Ms. Emily Rodriguez",
      tags: ["Writing", "Creative", "Language"],
    },
  };

  // Fetch resource data
  useEffect(() => {
    const fetchResourceData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await api.get(`/resources/${id}`);
        // setResource(response.data);

        // Using mock data
        const resourceData = mockResources[id] || mockResources[1];
        setResource(resourceData);
      } catch (error) {
        console.error("Error fetching resource data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResourceData();
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

  const handleReadContent = () => {
    // Navigate to reading view or open PDF viewer
    console.log("Reading content:", resource);
    // TODO: Implement reading functionality
    // router.push(`/resources/${resource.id}/read`);
    alert("Opening document for reading...");
  };

  const handlePlayVideo = () => {
    // Open video player
    console.log("Playing video:", resource);
    // TODO: Implement video playback
    // router.push(`/resources/${resource.id}/play`);
    alert("Playing video...");
  };

  const handleOpenLink = () => {
    // Open URL in browser
    console.log("Opening link:", resource.url);
    // Linking.openURL(resource.url);
    alert(`Opening: ${resource.url}`);
  };

  const handleAssign = () => {
    // Show assign modal or navigate to assign page
    setShowAssignModal(true);
    // router.push(`/resources/${resource.id}/assign`);
  };

  const handleDownload = () => {
    // Download resource
    console.log("Downloading resource:", resource);
    alert("Downloading resource...");
  };

  const handleBookmark = () => {
    // Bookmark resource
    console.log("Bookmarking resource:", resource);
    alert("Bookmarking resource...");
  };

  if (loading) {
    return (
      <BaseLayout showBottomNav={false} backgroundColor="bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-base">Loading resource...</Text>
        </View>
      </BaseLayout>
    );
  }

  if (!resource) {
    return (
      <BaseLayout showBottomNav={false} backgroundColor="bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="document-outline" size={64} color={COLORS.GRAY_400} />
          <Text className="text-gray-500 text-base mt-4 text-center">
            Resource not found
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

  const resourceIcon = getResourceIcon(resource.type);

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
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => router.back()}
                className="mr-4"
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-white mb-1">
                  Resource Details
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleBookmark}
                className="ml-4"
                activeOpacity={0.7}
              >
                <Ionicons name="bookmark-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Resource Content */}
          <View className="px-0 pb-6">
            {/* Resource Card */}
            <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
              <View className="p-6">
                {/* Resource Icon and Title */}
                <View className="flex-row items-start mb-4">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: `${resourceIcon.color}15` }}
                  >
                    <Ionicons
                      name={resourceIcon.name}
                      size={32}
                      color={resourceIcon.color}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                      {resource.title}
                    </Text>
                    <View className="flex-row items-center flex-wrap gap-2">
                      <View className="px-3 py-1 bg-purple-100 rounded-full">
                        <Text className="text-xs font-semibold text-purple-700">
                          {resource.category}
                        </Text>
                      </View>
                      <View className="px-3 py-1 bg-blue-100 rounded-full">
                        <Text className="text-xs font-semibold text-blue-700">
                          Ages {resource.ageRange.min}-{resource.ageRange.max}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Description */}
                <View className="mb-6">
                  <Text className="text-base text-gray-600 leading-6">
                    {resource.description}
                  </Text>
                </View>

                {/* Resource Details */}
                <View className="bg-gray-50 rounded-xl p-4 mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-3">
                    Resource Information
                  </Text>
                  <View className="gap-3">
                    {resource.fileType && (
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons
                            name="document-text"
                            size={18}
                            color={COLORS.GRAY_500}
                          />
                          <Text className="text-sm text-gray-600 ml-2">
                            File Type
                          </Text>
                        </View>
                        <Text className="text-sm font-semibold text-gray-900">
                          {resource.fileType}
                        </Text>
                      </View>
                    )}
                    {resource.size && (
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons
                            name="folder"
                            size={18}
                            color={COLORS.GRAY_500}
                          />
                          <Text className="text-sm text-gray-600 ml-2">
                            File Size
                          </Text>
                        </View>
                        <Text className="text-sm font-semibold text-gray-900">
                          {resource.size}
                        </Text>
                      </View>
                    )}
                    {resource.duration && (
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons
                            name="time"
                            size={18}
                            color={COLORS.GRAY_500}
                          />
                          <Text className="text-sm text-gray-600 ml-2">
                            Duration
                          </Text>
                        </View>
                        <Text className="text-sm font-semibold text-gray-900">
                          {resource.duration}
                        </Text>
                      </View>
                    )}
                    {resource.pages && (
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons
                            name="document"
                            size={18}
                            color={COLORS.GRAY_500}
                          />
                          <Text className="text-sm text-gray-600 ml-2">
                            Pages
                          </Text>
                        </View>
                        <Text className="text-sm font-semibold text-gray-900">
                          {resource.pages}
                        </Text>
                      </View>
                    )}
                    {resource.resolution && (
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons
                            name="tv"
                            size={18}
                            color={COLORS.GRAY_500}
                          />
                          <Text className="text-sm text-gray-600 ml-2">
                            Resolution
                          </Text>
                        </View>
                        <Text className="text-sm font-semibold text-gray-900">
                          {resource.resolution}
                        </Text>
                      </View>
                    )}
                    {resource.author && (
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons
                            name="person"
                            size={18}
                            color={COLORS.GRAY_500}
                          />
                          <Text className="text-sm text-gray-600 ml-2">
                            Author
                          </Text>
                        </View>
                        <Text className="text-sm font-semibold text-gray-900">
                          {resource.author}
                        </Text>
                      </View>
                    )}
                    {resource.createdAt && (
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons
                            name="calendar"
                            size={18}
                            color={COLORS.GRAY_500}
                          />
                          <Text className="text-sm text-gray-600 ml-2">
                            Created
                          </Text>
                        </View>
                        <Text className="text-sm font-semibold text-gray-900">
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Tags */}
                {resource.tags && resource.tags.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Tags
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {resource.tags.map((tag, index) => (
                        <View
                          key={index}
                          className="px-3 py-1 bg-gray-100 rounded-full"
                        >
                          <Text className="text-xs font-medium text-gray-700">
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View className="gap-3">
                  {resource.type === "document" && (
                    <TouchableOpacity
                      onPress={handleReadContent}
                      activeOpacity={0.7}
                      className="px-6 py-4 rounded-xl flex-row items-center justify-center"
                      style={{ backgroundColor: "#3B82F6" }}
                    >
                      <Ionicons name="book" size={20} color="white" />
                      <Text className="text-white font-semibold text-base ml-2">
                        Read Content
                      </Text>
                    </TouchableOpacity>
                  )}

                  {resource.type === "video" && (
                    <TouchableOpacity
                      onPress={handlePlayVideo}
                      activeOpacity={0.7}
                      className="px-6 py-4 rounded-xl flex-row items-center justify-center"
                      style={{ backgroundColor: "#EF4444" }}
                    >
                      <Ionicons name="play" size={20} color="white" />
                      <Text className="text-white font-semibold text-base ml-2">
                        Play Video
                      </Text>
                    </TouchableOpacity>
                  )}

                  {resource.type === "link" && (
                    <TouchableOpacity
                      onPress={handleOpenLink}
                      activeOpacity={0.7}
                      className="px-6 py-4 rounded-xl flex-row items-center justify-center"
                      style={{ backgroundColor: "#14B8A6" }}
                    >
                      <Ionicons name="open-outline" size={20} color="white" />
                      <Text className="text-white font-semibold text-base ml-2">
                        Open Link
                      </Text>
                    </TouchableOpacity>
                  )}

                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={handleAssign}
                      activeOpacity={0.7}
                      className="flex-1 px-6 py-4 rounded-xl border-2 flex-row items-center justify-center"
                      style={{ borderColor: COLORS.PRIMARY }}
                    >
                      <Ionicons
                        name="person-add"
                        size={20}
                        color={COLORS.PRIMARY}
                      />
                      <Text
                        className="font-semibold text-base ml-2"
                        style={{ color: COLORS.PRIMARY }}
                      >
                        Assign
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDownload}
                      activeOpacity={0.7}
                      className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 flex-row items-center justify-center"
                    >
                      <Ionicons
                        name="download-outline"
                        size={20}
                        color={COLORS.GRAY_600}
                      />
                      <Text className="text-gray-700 font-semibold text-base ml-2">
                        Download
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </BaseLayout>
  );
}
