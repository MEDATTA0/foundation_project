import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BaseLayout } from "../../components/layout";
import { VideoPlayer } from "../../components/ui/VideoPlayer";
import { WebViewPlayer } from "../../components/ui/WebViewPlayer";
import { YouTubePlayer } from "../../components/ui/YouTubePlayer";
import { COLORS, API_ENDPOINTS } from "../../constants";
import {
  isYouTubeUrl,
  isVimeoUrl,
  getVimeoEmbedUrl,
  extractYouTubeVideoId,
} from "../../utils/videoUtils";
import { api } from "../../services/api";
import { useAuthStore } from "../../stores";
import {
  isResourceDownloaded,
  getLocalFilePath,
  downloadResource,
  removeDownloadedResource,
} from "../../utils/downloadManager";

export default function ResourceDetailsPage() {
  const router = useRouter();
  const { id, classId, sessionId } = useLocalSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [localPath, setLocalPath] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showWebViewPlayer, setShowWebViewPlayer] = useState(false);
  const [showYouTubePlayer, setShowYouTubePlayer] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [webViewUri, setWebViewUri] = useState(null);
  const [youtubeVideoId, setYoutubeVideoId] = useState(null);
  const [isVimeo, setIsVimeo] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);

  // Determine resource type from URL
  const getResourceType = (url) => {
    if (!url) return "link";

    // Check for YouTube/Vimeo first (these are videos but need WebView)
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

    // Check for direct video file URLs (MP4, AVI, MOV, etc.)
    if (url.match(/\.(mp4|avi|mov|m4v|mkv|webm)$/i)) return "video";

    // Check for images
    if (url.match(/\.(jpg|jpeg|png|gif)$/i)) return "image";

    return "link";
  };

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

  // Check if resource is downloaded
  useEffect(() => {
    const checkDownloadStatus = async () => {
      if (!id) return;

      const downloaded = await isResourceDownloaded(id);
      setIsDownloaded(downloaded);

      if (downloaded) {
        const path = await getLocalFilePath(id);
        setLocalPath(path);
      }
    };

    checkDownloadStatus();
  }, [id]);

  // Fetch resource data
  useEffect(() => {
    const fetchResourceData = async () => {
      if (!id || !classId || !isAuthenticated) {
        Alert.alert("Error", "Missing resource information");
        router.back();
        return;
      }

      setLoading(true);
      try {
        const data = await api.get(API_ENDPOINTS.RESOURCES.GET(classId, id));
        setResource(data);
      } catch (error) {
        console.error("Error fetching resource data:", error);
        Alert.alert(
          "Error",
          error.message || "Failed to load resource details"
        );
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchResourceData();
  }, [id, classId, isAuthenticated]);

  const handlePlayVideo = async () => {
    if (!resource?.resource) return;

    const resourceType = getResourceType(resource.resource);
    if (resourceType !== "video") {
      handleOpenResource();
      return;
    }

    // ALWAYS check for YouTube/Vimeo FIRST - these MUST use specialized players
    const youtubeUrl = isYouTubeUrl(resource.resource);
    const vimeoUrl = isVimeoUrl(resource.resource);

    if (youtubeUrl) {
      // Extract video ID and show in YouTube player
      const videoId = extractYouTubeVideoId(resource.resource);
      console.log("videoId", videoId);
      if (videoId) {
        setYoutubeVideoId(videoId);
        setShowYouTubePlayer(true);
        return; // IMPORTANT: Return early to prevent reaching react-native-video
      } else {
        Alert.alert("Error", "Invalid YouTube URL");
        return;
      }
    }

    if (vimeoUrl) {
      // Convert to embed URL and show in WebView
      const embedUrl = getVimeoEmbedUrl(resource.resource);
      console.log("embedUrl", embedUrl);
      if (embedUrl) {
        setWebViewUri(embedUrl);
        setIsYouTube(false);
        setIsVimeo(true);
        setShowWebViewPlayer(true);
        return; // IMPORTANT: Return early to prevent reaching react-native-video
      } else {
        Alert.alert("Error", "Invalid Vimeo URL");
        return;
      }
    }

    // For direct video URLs only (not YouTube/Vimeo)
    // Check if it's a direct video file URL (MP4, AVI, MOV, etc.)
    const isDirectVideoUrl = resource.resource.match(
      /\.(mp4|avi|mov|m4v|mkv|webm)$/i
    );

    if (!isDirectVideoUrl) {
      Alert.alert(
        "Unsupported Format",
        "This video format is not supported for in-app playback. Please use a direct video file URL (MP4, AVI, MOV) or YouTube/Vimeo link."
      );
      return;
    }

    // Double-check: Never allow YouTube/Vimeo URLs to reach react-native-video
    if (
      resource.resource.includes("youtube") ||
      resource.resource.includes("youtu.be") ||
      resource.resource.includes("vimeo")
    ) {
      Alert.alert(
        "Error",
        "YouTube and Vimeo videos can not be downloaded at the moment."
      );
      return;
    }

    // For direct video URLs, check if downloaded
    if (isDownloaded && localPath) {
      setVideoUri(localPath);
    } else {
      setVideoUri(resource.resource);
    }

    setShowVideoPlayer(true);
  };

  const handleDownload = async () => {
    if (!resource?.resource || !id) return;

    const resourceType = getResourceType(resource.resource);

    // Check if it's a YouTube or Vimeo URL
    const youtubeUrl = isYouTubeUrl(resource.resource);
    const vimeoUrl = isVimeoUrl(resource.resource);

    if (youtubeUrl || vimeoUrl) {
      Alert.alert(
        "Not Supported",
        "YouTube and Vimeo videos cannot be downloaded directly. Please watch them now."
      );
      return;
    }

    if (isDownloaded) {
      Alert.alert(
        "Remove Download",
        "This resource is already downloaded. Do you want to remove it?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: async () => {
              const result = await removeDownloadedResource(id);
              if (result.success) {
                setIsDownloaded(false);
                setLocalPath(null);
                Alert.alert("Success", "Download removed");
              } else {
                Alert.alert("Error", "Failed to remove download");
              }
            },
          },
        ]
      );
      return;
    }

    setDownloading(true);
    setDownloadProgress(0);
    try {
      const result = await downloadResource(
        id,
        resource.resource,
        resource.title || "Resource",
        (progress) => {
          setDownloadProgress(progress);
        }
      );

      if (result.success) {
        setIsDownloaded(true);
        setLocalPath(result.localPath);
        setDownloadProgress(0);
        Alert.alert(
          "Success",
          result.alreadyExists
            ? "Resource is already downloaded"
            : "Resource downloaded successfully! You can now watch it offline."
        );
      } else {
        Alert.alert("Error", result.error || "Failed to download resource");
      }
    } catch (error) {
      console.error("Error downloading:", error);
      Alert.alert("Error", "Failed to download resource");
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleOpenResource = async () => {
    if (!resource?.resource) return;

    const resourceType = getResourceType(resource.resource);

    // For videos, use the video player
    if (resourceType === "video") {
      handlePlayVideo();
      return;
    }

    // For other resources, open in browser
    try {
      const canOpen = await Linking.canOpenURL(resource.resource);
      if (canOpen) {
        await Linking.openURL(resource.resource);
      } else {
        Alert.alert("Error", "Cannot open this URL");
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert("Error", "Failed to open resource");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <BaseLayout showBottomNav={false} backgroundColor="bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text className="text-gray-500 text-base mt-4">
            Loading resource...
          </Text>
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

  const resourceType = getResourceType(resource.resource);
  const resourceIcon = getResourceIcon(resourceType);

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
                  Resource Details
                </Text>
              </View>
            </View>

            {/* Resource Icon and Title */}
            <View className="items-center mt-4">
              <View
                className="w-16 h-16 rounded-full items-center justify-center mb-3"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <Ionicons name={resourceIcon.name} size={32} color="white" />
              </View>
              <Text className="text-2xl font-bold text-white mb-2 text-center">
                {resource.title || "Untitled Resource"}
              </Text>
              {resource.description && (
                <Text className="text-base text-white opacity-90 text-center mb-3">
                  {resource.description}
                </Text>
              )}
              {resource.ageMin !== null && resource.ageMax !== null && (
                <View className="px-3 py-1 bg-white/20 rounded-full">
                  <Text className="text-sm text-white font-semibold">
                    Ages {resource.ageMin}-{resource.ageMax}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Content Section */}
          <View className="px-4 pb-6 -mt-2">
            {/* Resource Information */}
            <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
              <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-lg font-bold text-gray-900">
                  Resource Information
                </Text>
              </View>
              <View className="p-6">
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-500 mb-1">
                    Type
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
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
                    <Text className="text-base text-gray-900 capitalize">
                      {resourceType}
                    </Text>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-500 mb-1">
                    Resource URL
                  </Text>
                  <Text
                    className="text-base text-blue-600 mt-2"
                    numberOfLines={2}
                  >
                    {resource.resource}
                  </Text>
                </View>

                {resource.ageMin !== null && resource.ageMax !== null && (
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-500 mb-1">
                      Age Range
                    </Text>
                    <Text className="text-base text-gray-900 mt-2">
                      {resource.ageMin} - {resource.ageMax} years old
                    </Text>
                  </View>
                )}

                <View>
                  <Text className="text-sm font-semibold text-gray-500 mb-1">
                    Created At
                  </Text>
                  <Text className="text-base text-gray-900 mt-2">
                    {formatDate(resource.createdAt)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Video Player for Videos */}
            {resourceType === "video" && (
              <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
                <View className="px-6 py-4 border-b border-gray-100">
                  <Text className="text-lg font-bold text-gray-900">
                    Video Player
                  </Text>
                  {isDownloaded && (
                    <View className="mt-2 flex-row items-center">
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#10B981"
                      />
                      <Text className="text-sm text-green-600 ml-2">
                        Available offline
                      </Text>
                    </View>
                  )}
                  {isYouTubeUrl(resource.resource) && (
                    <View className="mt-2 flex-row items-center">
                      <Ionicons
                        name="information-circle"
                        size={16}
                        color={COLORS.PRIMARY}
                      />
                      <Text className="text-sm text-purple-600 ml-2">
                        Will play in-app using YouTube player
                      </Text>
                    </View>
                  )}
                  {isVimeoUrl(resource.resource) && (
                    <View className="mt-2 flex-row items-center">
                      <Ionicons
                        name="information-circle"
                        size={16}
                        color={COLORS.PRIMARY}
                      />
                      <Text className="text-sm text-purple-600 ml-2">
                        Will play in-app using WebView
                      </Text>
                    </View>
                  )}
                </View>
                <View className="p-4">
                  <TouchableOpacity
                    onPress={handlePlayVideo}
                    activeOpacity={0.7}
                    className="bg-purple-600 rounded-xl px-6 py-4 flex-row items-center justify-center shadow-lg"
                  >
                    <Ionicons name="play-circle" size={24} color="white" />
                    <Text className="text-white font-semibold text-base ml-2">
                      {isDownloaded
                        ? "Play Offline"
                        : isYouTubeUrl(resource.resource) ||
                          isVimeoUrl(resource.resource)
                        ? "Play Video"
                        : "Play Video"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Download/Remove Download Button */}
            {resourceType === "video" && (
              <View className="mb-4">
                <TouchableOpacity
                  onPress={handleDownload}
                  disabled={downloading}
                  activeOpacity={0.7}
                  className={`rounded-xl px-6 py-4 flex-row items-center justify-center shadow-lg ${
                    isDownloaded
                      ? "bg-red-500"
                      : downloading
                      ? "bg-gray-400"
                      : "bg-green-600"
                  }`}
                >
                  {downloading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons
                      name={isDownloaded ? "trash" : "download"}
                      size={24}
                      color="white"
                    />
                  )}
                  <Text className="text-white font-semibold text-base ml-2">
                    {downloading
                      ? `Downloading... ${Math.round(downloadProgress * 100)}%`
                      : isDownloaded
                      ? "Remove Download"
                      : "Download for Offline"}
                  </Text>
                </TouchableOpacity>
                {downloading && downloadProgress > 0 && (
                  <View className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <View
                      className="bg-green-600 h-full rounded-full"
                      style={{ width: `${downloadProgress * 100}%` }}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Open Resource Button (for non-videos) */}
            {resourceType !== "video" && (
              <TouchableOpacity
                onPress={handleOpenResource}
                activeOpacity={0.7}
                className="bg-purple-600 rounded-xl px-6 py-4 flex-row items-center justify-center shadow-lg mb-4"
              >
                <Ionicons
                  name={
                    resourceType === "document"
                      ? "document-text"
                      : "open-outline"
                  }
                  size={24}
                  color="white"
                />
                <Text className="text-white font-semibold text-base ml-2">
                  {resourceType === "document" ? "Open Document" : "Open Link"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Video Player Modal (for direct video URLs) */}
      <Modal
        visible={showVideoPlayer}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => {
          handleVideoClose();
        }}
      >
        <View className="flex-1 bg-black">
          <VideoPlayer
            uri={videoUri}
            onClose={() => handleVideoClose()}
            onVideoEnd={() => handleVideoEnd()}
          />
        </View>
      </Modal>

      {/* YouTube Player Modal */}
      <Modal
        visible={showYouTubePlayer}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => {
          handleVideoClose();
        }}
      >
        <View className="flex-1 bg-black">
          <YouTubePlayer
            videoId={youtubeVideoId}
            onClose={() => handleVideoClose()}
            onVideoEnd={() => handleVideoEnd()}
          />
        </View>
      </Modal>

      {/* WebView Player Modal (for Vimeo) */}
      <Modal
        visible={showWebViewPlayer}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => {
          handleVideoClose();
        }}
      >
        <WebViewPlayer
          uri={webViewUri}
          onClose={() => handleVideoClose()}
          isVimeo={isVimeo}
          onVideoEnd={() => handleVideoEnd()}
        />
      </Modal>
    </BaseLayout>
  );
}
