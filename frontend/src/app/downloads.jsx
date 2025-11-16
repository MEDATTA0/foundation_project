import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BaseLayout } from "../components/layout";
import { BottomNavigation } from "../components/navigation";
import { NAVIGATION_TABS, COLORS } from "../constants";

export default function DownloadsPage() {
  const router = useRouter();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock downloads data - will be replaced with actual API call
  const mockDownloads = [
    {
      id: 1,
      resourceId: 1,
      title: "Basic Counting Course",
      description: "Learn numbers 1-10 with fun activities",
      type: "document",
      category: "Mathematics",
      fileType: "PDF",
      size: "2.4 MB",
      downloadedAt: "2024-11-15T10:30:00",
      downloadStatus: "completed",
    },
    {
      id: 2,
      resourceId: 2,
      title: "Alphabet Adventure",
      description: "Interactive alphabet learning",
      type: "video",
      category: "Language",
      fileType: "MP4",
      size: "125 MB",
      downloadedAt: "2024-11-14T15:45:00",
      downloadStatus: "completed",
    },
    {
      id: 3,
      resourceId: 3,
      title: "Simple Addition",
      description: "Introduction to addition for beginners",
      type: "document",
      category: "Mathematics",
      fileType: "PDF",
      size: "1.8 MB",
      downloadedAt: "2024-11-13T09:20:00",
      downloadStatus: "completed",
    },
    {
      id: 4,
      resourceId: 7,
      title: "Advanced Mathematics",
      description: "Complex problem solving",
      type: "document",
      category: "Mathematics",
      fileType: "PDF",
      size: "4.5 MB",
      downloadedAt: "2024-11-12T14:10:00",
      downloadStatus: "completed",
    },
  ];

  // Fetch downloads from backend
  useEffect(() => {
    const fetchDownloads = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await api.get('/downloads');
        // setDownloads(response.data);

        // Using mock data for now
        setDownloads(mockDownloads);
      } catch (error) {
        console.error("Error fetching downloads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleViewResource = (download) => {
    // Navigate to resource details page
    router.push(`/resources/${download.resourceId}`);
  };

  const handleDeleteDownload = (downloadId) => {
    // Delete download
    console.log("Deleting download:", downloadId);
    // TODO: Implement delete functionality
    // await api.delete(`/downloads/${downloadId}`);
    setDownloads((prev) => prev.filter((d) => d.id !== downloadId));
  };

  const handleOpenFile = (download) => {
    // Open downloaded file
    console.log("Opening file:", download);
    // TODO: Implement file opening functionality
    alert(`Opening ${download.title}...`);
  };

  // Group downloads by date
  const groupedDownloads = downloads.reduce((acc, download) => {
    const date = formatDate(download.downloadedAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(download);
    return acc;
  }, {});

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
                <Text className="text-3xl font-bold text-white mb-1">
                  Downloads
                </Text>
                <Text className="text-base text-white opacity-90">
                  Your downloaded resources
                </Text>
              </View>
            </View>

            {/* Download Stats */}
            <View className="flex-row gap-4 my-4">
              <View className="flex-1 bg-white/20 rounded-xl px-4 py-3">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="download" size={18} color="white" />
                  <Text className="text-2xl font-bold text-white ml-2">
                    {downloads.length}
                  </Text>
                </View>
                <Text className="text-xs text-white opacity-90">
                  Total Downloads
                </Text>
              </View>
              <View className="flex-1 bg-white/20 rounded-xl px-4 py-3">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="checkmark-circle" size={18} color="white" />
                  <Text className="text-2xl font-bold text-white ml-2">
                    {
                      downloads.filter((d) => d.downloadStatus === "completed")
                        .length
                    }
                  </Text>
                </View>
                <Text className="text-xs text-white opacity-90">Completed</Text>
              </View>
            </View>
          </View>

          {/* Downloads List */}
          <View className="bg-white -mt-6 pb-6">
            {loading ? (
              <View className="px-6 py-12 items-center justify-center">
                <Text className="text-gray-500 text-base">
                  Loading downloads...
                </Text>
              </View>
            ) : downloads.length === 0 ? (
              <View className="px-6 py-12 items-center justify-center">
                <Ionicons
                  name="download-outline"
                  size={64}
                  color={COLORS.GRAY_400}
                />
                <Text className="text-gray-500 text-base mt-4 text-center">
                  No downloads yet
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  Download resources to view them here
                </Text>
              </View>
            ) : (
              Object.entries(groupedDownloads).map(([date, dateDownloads]) => (
                <View key={date} className="mx-4 mb-4">
                  <View className="bg-white rounded-xl shadow overflow-hidden">
                    {/* Date Header */}
                    <View className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                      <Text className="text-sm font-semibold text-gray-600">
                        {date}
                      </Text>
                    </View>

                    {/* Downloads for this date */}
                    <View>
                      {dateDownloads.map((download, index) => {
                        const resourceIcon = getResourceIcon(download.type);
                        return (
                          <View
                            key={download.id}
                            className={`px-6 py-4 ${
                              index < dateDownloads.length - 1
                                ? "border-b border-gray-100"
                                : ""
                            }`}
                          >
                            <View className="flex-row items-start">
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
                                  {download.title}
                                </Text>
                                <Text className="text-sm text-gray-600 mb-2">
                                  {download.description}
                                </Text>
                                <View className="flex-row items-center flex-wrap gap-2">
                                  <View className="px-2 py-1 bg-gray-100 rounded-full">
                                    <Text className="text-xs font-medium text-gray-700">
                                      {download.category}
                                    </Text>
                                  </View>
                                  <Text className="text-xs text-gray-500">
                                    {download.fileType}
                                  </Text>
                                  <Text className="text-xs text-gray-400">
                                    •
                                  </Text>
                                  <Text className="text-xs text-gray-500">
                                    {download.size}
                                  </Text>
                                </View>
                                <Text className="text-xs text-gray-400 mt-2">
                                  Downloaded {formatDate(download.downloadedAt)}
                                </Text>
                              </View>
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row gap-2 mt-3 ml-16">
                              <TouchableOpacity
                                onPress={() => handleOpenFile(download)}
                                activeOpacity={0.7}
                                className="flex-1 px-4 py-2 rounded-lg flex-row items-center justify-center"
                                style={{ backgroundColor: COLORS.PRIMARY }}
                              >
                                <Ionicons
                                  name="open-outline"
                                  size={18}
                                  color="white"
                                />
                                <Text className="text-white font-semibold text-sm ml-2">
                                  Open
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleViewResource(download)}
                                activeOpacity={0.7}
                                className="px-4 py-2 rounded-lg border border-gray-300"
                              >
                                <Ionicons
                                  name="eye-outline"
                                  size={18}
                                  color={COLORS.GRAY_600}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  handleDeleteDownload(download.id)
                                }
                                activeOpacity={0.7}
                                className="px-4 py-2 rounded-lg border border-red-300"
                              >
                                <Ionicons
                                  name="trash-outline"
                                  size={18}
                                  color="#EF4444"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      })}
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
