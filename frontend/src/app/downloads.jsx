import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BaseLayout } from "../components/layout";
import { BottomNavigation } from "../components/navigation";
import { NAVIGATION_TABS, COLORS, API_ENDPOINTS } from "../constants";
import { api } from "../services/api";
import { useAuthStore } from "../stores";
import {
  getDownloadedResources,
  removeDownloadedResource,
  getLocalFilePath,
} from "../utils/downloadManager";
import * as FileSystem from "expo-file-system";

export default function DownloadsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);

  // Determine resource type from URL
  const getResourceType = (url) => {
    if (!url) return "link";

    // Check for YouTube/Vimeo first
    if (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("vimeo.com")
    )
      return "video";

    // Check for document URLs
    if (
      url.match(/\.(pdf|doc|docx)$/i) ||
      url.includes("drive.google.com") ||
      url.includes("dropbox.com")
    )
      return "document";

    // Check for direct video file URLs
    if (url.match(/\.(mp4|avi|mov|m4v|mkv|webm)$/i)) return "video";

    // Check for images
    if (url.match(/\.(jpg|jpeg|png|gif)$/i)) return "image";

    return "link";
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Get file extension from URL
  const getFileExtension = (url) => {
    if (!url) return "";
    const match = url.match(/\.([^.?#]+)(\?|#|$)/);
    return match ? match[1].toUpperCase() : "";
  };

  // Fetch downloads from AsyncStorage and match with API resources
  useEffect(() => {
    const fetchDownloads = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        // Get all downloaded resources from AsyncStorage
        const downloadedResources = await getDownloadedResources();
        const downloadEntries = Object.entries(downloadedResources);

        if (downloadEntries.length === 0) {
          setDownloads([]);
          setLoading(false);
          return;
        }

        // Fetch all resources from API to get full details
        let allResources = [];
        try {
          allResources = await api.get(API_ENDPOINTS.RESOURCES.LIST);
        } catch (error) {
          console.error("Error fetching resources:", error);
          // Continue with just the stored data if API fails
        }

        // Create a map of resourceId to resource details
        const resourceMap = new Map();
        allResources.forEach((resource) => {
          resourceMap.set(resource.id, resource);
        });

        // Transform downloaded resources to match UI expectations
        const transformedDownloads = await Promise.all(
          downloadEntries.map(async ([resourceId, downloadInfo]) => {
            // Get resource details from API if available
            const apiResource = resourceMap.get(resourceId);

            // Determine type from URL
            const url = downloadInfo.url || "";
            const type = getResourceType(url);

            // Get file extension
            const fileExtension = getFileExtension(url);

            // Get file size
            const fileSize = downloadInfo.fileSize || 0;

            // Verify file still exists
            const localPath = await getLocalFilePath(resourceId);
            if (!localPath) {
              // File doesn't exist, skip it
              return null;
            }

            return {
              id: resourceId,
              resourceId: resourceId,
              title:
                downloadInfo.title || apiResource?.title || "Untitled Resource",
              description: apiResource?.description || "",
              type: type,
              category: apiResource?.class?.name || "Uncategorized",
              fileType: fileExtension || "File",
              size: formatFileSize(fileSize),
              downloadedAt:
                downloadInfo.downloadedAt || new Date().toISOString(),
              downloadStatus: "completed",
              localPath: localPath,
              classId: apiResource?.classId,
              url: url,
            };
          })
        );

        // Filter out null entries (files that don't exist)
        const validDownloads = transformedDownloads.filter(Boolean);

        // Sort by download date (newest first)
        validDownloads.sort((a, b) => {
          return new Date(b.downloadedAt) - new Date(a.downloadedAt);
        });

        setDownloads(validDownloads);
      } catch (error) {
        console.error("Error fetching downloads:", error);
        Alert.alert("Error", "Failed to load downloads");
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, [isAuthenticated]);

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
    // Navigate to resource details page if we have classId
    if (download.classId) {
      router.push({
        pathname: `/resources/${download.resourceId}`,
        params: { classId: download.classId },
      });
    } else {
      Alert.alert(
        "Information",
        "Resource details are not available. The resource may have been removed from its class."
      );
    }
  };

  const handleDeleteDownload = async (download) => {
    Alert.alert(
      "Delete Download",
      `Are you sure you want to delete "${download.title}"? This will remove it from your device.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await removeDownloadedResource(
                download.resourceId
              );
              if (result.success) {
                // Remove from local state
                setDownloads((prev) =>
                  prev.filter((d) => d.id !== download.resourceId)
                );
                Alert.alert("Success", "Download removed successfully");
              } else {
                Alert.alert(
                  "Error",
                  result.error || "Failed to remove download"
                );
              }
            } catch (error) {
              console.error("Error deleting download:", error);
              Alert.alert("Error", "Failed to remove download");
            }
          },
        },
      ]
    );
  };

  const handleOpenFile = async (download) => {
    try {
      if (!download.localPath) {
        Alert.alert("Error", "File path not found");
        return;
      }

      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(download.localPath);
      if (!fileInfo.exists) {
        Alert.alert(
          "File Not Found",
          "The downloaded file no longer exists. It may have been deleted."
        );
        // Remove from downloads
        await removeDownloadedResource(download.resourceId);
        setDownloads((prev) =>
          prev.filter((d) => d.id !== download.resourceId)
        );
        return;
      }

      // For videos, navigate to resource details page to use the video player
      if (download.type === "video") {
        if (download.classId) {
          router.push({
            pathname: `/resources/${download.resourceId}`,
            params: { classId: download.classId },
          });
        } else {
          Alert.alert(
            "Information",
            "Cannot open video. Resource details are not available."
          );
        }
      } else {
        // For other file types, try to open with system default app
        const canOpen = await Linking.canOpenURL(download.localPath);
        if (canOpen) {
          await Linking.openURL(download.localPath);
        } else {
          // Try with file:// prefix if not already present
          const filePath = download.localPath.startsWith("file://")
            ? download.localPath
            : `file://${download.localPath}`;
          const canOpenWithPrefix = await Linking.canOpenURL(filePath);
          if (canOpenWithPrefix) {
            await Linking.openURL(filePath);
          } else {
            Alert.alert(
              "Cannot Open File",
              "Unable to open this file type. Please use a file manager app."
            );
          }
        }
      }
    } catch (error) {
      console.error("Error opening file:", error);
      Alert.alert("Error", "Failed to open file");
    }
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
      showBottomNav={false}
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
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                <Text className="text-gray-500 text-base mt-4">
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
                                onPress={() => handleDeleteDownload(download)}
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
