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
import { VideoPlayer } from "../../components/ui/VideoPlayer";
import { WebViewPlayer } from "../../components/ui/WebViewPlayer";
import { YouTubePlayer } from "../../components/ui/YouTubePlayer";
import { COLORS, API_ENDPOINTS } from "../../constants";
import { api } from "../../services/api";
import { useAuthStore } from "../../stores";
import {
  isYouTubeUrl,
  isVimeoUrl,
  getVimeoEmbedUrl,
  extractYouTubeVideoId,
} from "../../utils/videoUtils";

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

  // Resource assignment state
  const [resources, setResources] = useState([]);
  const [selectedResourceIds, setSelectedResourceIds] = useState([]);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // Class resources and session state
  const [classResources, setClassResources] = useState([]);
  const [showResourcesView, setShowResourcesView] = useState(false);
  const [isLoadingClassResources, setIsLoadingClassResources] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);

  // Video player state
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showWebViewPlayer, setShowWebViewPlayer] = useState(false);
  const [showYouTubePlayer, setShowYouTubePlayer] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [webViewUri, setWebViewUri] = useState(null);
  const [youtubeVideoId, setYoutubeVideoId] = useState(null);
  const [isVimeo, setIsVimeo] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);

  // Format date for display
  const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return "N/A";

    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }
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

  // Fetch resources for assignment
  const fetchResources = async () => {
    if (!isAuthenticated || !classroom) return;

    setIsLoadingResources(true);
    try {
      const data = await api.get(API_ENDPOINTS.RESOURCES.LIST);
      // Get list of already assigned resource IDs by fetching class resources
      let assignedResourceIds = new Set();
      try {
        const classResources = await api.get(
          API_ENDPOINTS.RESOURCES.LIST_BY_CLASS(id)
        );
        assignedResourceIds = new Set(classResources.map((r) => r.id));
      } catch (error) {
        // If class has no resources yet, that's fine
        console.log("No resources in class yet");
      }

      // Transform and filter resources
      const resourceList = data
        .map((item) => {
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
            description: item.description || "",
            type: type,
            url: item.resource,
            classId: item.classId,
            className: item.class?.name || "Unknown",
            ageRange:
              item.ageRange ||
              (item.ageMin !== null && item.ageMax !== null
                ? { min: item.ageMin, max: item.ageMax }
                : null),
          };
        })
        .filter((resource) => {
          // Filter out already assigned resources
          return !assignedResourceIds.has(resource.id);
        });

      setResources(resourceList);
    } catch (error) {
      console.error("Error fetching resources:", error);
      Alert.alert("Error", "Failed to load resources");
    } finally {
      setIsLoadingResources(false);
    }
  };

  // Toggle resource selection
  const handleResourceToggle = (resourceId) => {
    setSelectedResourceIds((prev) => {
      if (prev.includes(resourceId)) {
        return prev.filter((id) => id !== resourceId);
      } else {
        return [...prev, resourceId];
      }
    });
  };

  // Assign selected resources to class
  const handleAssignResources = async () => {
    if (selectedResourceIds.length === 0) {
      Alert.alert("Error", "Please select at least one resource");
      return;
    }

    setIsAssigning(true);
    try {
      // Assign each resource to the class
      const assignmentPromises = selectedResourceIds.map((resourceId) => {
        // Find the resource to get its current classId
        const resource = resources.find((r) => r.id === resourceId);
        if (!resource) return Promise.resolve();

        // Update the resource's classId
        return api.patch(
          API_ENDPOINTS.RESOURCES.UPDATE(resource.classId, resourceId),
          {
            classId: id,
            resource: resource.url || "", // Keep existing resource URL
          }
        );
      });

      await Promise.all(assignmentPromises);

      Alert.alert(
        "Success",
        `${selectedResourceIds.length} resource${
          selectedResourceIds.length !== 1 ? "s" : ""
        } assigned successfully`,
        [
          {
            text: "OK",
            onPress: () => {
              // Clear selection and refresh classroom data
              setSelectedResourceIds([]);
              fetchClassroomData();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error assigning resources:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to assign resources. Please try again."
      );
    } finally {
      setIsAssigning(false);
    }
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

  // Fetch class resources when resources view is opened
  useEffect(() => {
    if (showResourcesView && id) {
      fetchClassResources();
    }
  }, [showResourcesView, id]);

  // Fetch students when classroom is loaded and modal is opened
  useEffect(() => {
    if (showStudentModal && classroom) {
      fetchStudents();
    }
  }, [showStudentModal, classroom]);

  // Fetch resources when classroom is loaded and modal is opened
  useEffect(() => {
    if (showResourceModal && classroom) {
      fetchResources();
    }
  }, [showResourceModal, classroom]);

  // Fetch class resources when resources view is opened
  const fetchClassResources = async () => {
    if (!id || !isAuthenticated) return;

    setIsLoadingClassResources(true);
    try {
      const data = await api.get(API_ENDPOINTS.RESOURCES.LIST_BY_CLASS(id));

      // Transform resources to match UI expectations
      const transformedResources = data.map((item) => {
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
          description: item.description || "",
          type: type,
          url: item.resource,
          ageRange:
            item.ageMin !== null && item.ageMax !== null
              ? { min: item.ageMin, max: item.ageMax }
              : null,
        };
      });

      setClassResources(transformedResources);
    } catch (error) {
      console.error("Error fetching class resources:", error);
      Alert.alert("Error", "Failed to load resources");
    } finally {
      setIsLoadingClassResources(false);
    }
  };

  // Start a session
  const handleStartSession = async () => {
    if (!id) return;

    setIsStartingSession(true);
    try {
      // Create a new session
      const sessionData = await api.post(API_ENDPOINTS.CLASS_SESSIONS.CREATE, {
        classId: id,
        duration: 0, // Will be updated when session ends
        location: null,
        resources: null,
      });

      setCurrentSession(sessionData);
      setSessionStartTime(new Date());
      Alert.alert(
        "Session Started",
        "You can now watch videos and mark attendance."
      );
    } catch (error) {
      console.error("Error starting session:", error);
      Alert.alert("Error", error.message || "Failed to start session");
    } finally {
      setIsStartingSession(false);
    }
  };

  // End session and mark attendance
  const handleEndSession = async () => {
    if (!currentSession || !classroom) return;

    Alert.alert(
      "End Session",
      "Do you want to end this session and mark attendance for all students?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Session",
          style: "destructive",
          onPress: async () => {
            setIsEndingSession(true);
            try {
              // Calculate session duration in minutes
              const duration = sessionStartTime
                ? Math.round((new Date() - sessionStartTime) / 1000 / 60)
                : 0;

              // Update session with duration
              await api.patch(
                API_ENDPOINTS.CLASS_SESSIONS.UPDATE(currentSession.id),
                {
                  duration: duration,
                }
              );

              // Mark attendance for all enrolled students (present by default)
              if (classroom.students && classroom.students.length > 0) {
                const attendancePromises = classroom.students.map((student) =>
                  api.post(API_ENDPOINTS.ATTENDANCES.CREATE, {
                    classSessionId: currentSession.id,
                    studentId: student.id,
                    present: true, // Mark all as present by default
                  })
                );

                await Promise.all(attendancePromises);
              }

              Alert.alert(
                "Success",
                "Session ended successfully. Attendance has been marked for all students.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      setCurrentSession(null);
                      setSessionStartTime(null);
                      fetchClassroomData(); // Refresh classroom data
                    },
                  },
                ]
              );
            } catch (error) {
              console.error("Error ending session:", error);
              Alert.alert("Error", error.message || "Failed to end session");
            } finally {
              setIsEndingSession(false);
            }
          },
        },
      ]
    );
  };

  // Handle video playback
  const handlePlayVideo = (resource) => {
    if (!resource || !resource.url) return;

    const url = resource.url;

    // Check for YouTube/Vimeo first
    const youtubeUrl = isYouTubeUrl(url);
    const vimeoUrl = isVimeoUrl(url);

    if (youtubeUrl) {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        setYoutubeVideoId(videoId);
        setShowYouTubePlayer(true);
        return;
      } else {
        Alert.alert("Error", "Invalid YouTube URL");
        return;
      }
    }

    if (vimeoUrl) {
      const embedUrl = getVimeoEmbedUrl(url);
      if (embedUrl) {
        setWebViewUri(embedUrl);
        setIsVimeo(true);
        setShowWebViewPlayer(true);
        return;
      } else {
        Alert.alert("Error", "Invalid Vimeo URL");
        return;
      }
    }

    // For direct video URLs
    const isDirectVideoUrl = url.match(/\.(mp4|avi|mov|m4v|mkv|webm)$/i);

    if (!isDirectVideoUrl) {
      Alert.alert(
        "Unsupported Format",
        "This video format is not supported for in-app playback. Please use a direct video file URL (MP4, AVI, MOV) or YouTube/Vimeo link."
      );
      return;
    }

    // Double-check: Never allow YouTube/Vimeo URLs to reach react-native-video
    if (
      url.includes("youtube") ||
      url.includes("youtu.be") ||
      url.includes("vimeo")
    ) {
      Alert.alert(
        "Error",
        "YouTube and Vimeo videos must be played using WebView."
      );
      return;
    }

    setVideoUri(url);
    setShowVideoPlayer(true);
  };

  // Handle video end
  const handleVideoEnd = () => {
    setVideoCompleted(true);
    if (currentSession) {
      console.log("Video completed during session:", currentSession.id);
    }
  };

  // Handle video close
  const handleVideoClose = () => {
    if (videoCompleted && currentSession) {
      Alert.alert(
        "Video Completed",
        "Great! The video has been completed. You can end the session when ready.",
        [{ text: "OK" }]
      );
    }
    setShowVideoPlayer(false);
    setShowYouTubePlayer(false);
    setShowWebViewPlayer(false);
    setVideoCompleted(false);
    setVideoUri(null);
    setWebViewUri(null);
    setYoutubeVideoId(null);
  };

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
              <TouchableOpacity
                onPress={() => setShowResourcesView(true)}
                activeOpacity={0.7}
                className="flex-1 bg-white rounded-xl shadow p-4"
              >
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
                  Session and Resource{classroom.resourceCount !== 1 ? "s" : ""}
                </Text>
              </TouchableOpacity>
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

            {/* Assign Resources Section */}
            <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
              <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-lg font-bold text-gray-900">
                  Assign Resources
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Add resources to this classroom
                </Text>
              </View>
              <View className="p-6">
                <TouchableOpacity
                  onPress={() => setShowResourceModal(true)}
                  activeOpacity={0.7}
                  className="border border-gray-300 rounded-xl px-4 py-3.5 flex-row items-center justify-between bg-white"
                >
                  <Text
                    className={`text-base flex-1 ${
                      selectedResourceIds.length > 0
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                    numberOfLines={1}
                  >
                    {selectedResourceIds.length > 0
                      ? `${selectedResourceIds.length} resource${
                          selectedResourceIds.length !== 1 ? "s" : ""
                        } selected`
                      : "Select resources to assign"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={COLORS.GRAY_500}
                  />
                </TouchableOpacity>
                {selectedResourceIds.length > 0 && (
                  <TouchableOpacity
                    onPress={handleAssignResources}
                    disabled={isAssigning}
                    activeOpacity={0.7}
                    className="mt-4 px-4 py-3 rounded-xl items-center"
                    style={{
                      backgroundColor: isAssigning
                        ? COLORS.GRAY_400
                        : COLORS.PRIMARY,
                    }}
                  >
                    <Text className="text-white font-semibold text-base">
                      {isAssigning
                        ? "Assigning..."
                        : `Assign ${selectedResourceIds.length} Resource${
                            selectedResourceIds.length !== 1 ? "s" : ""
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

      {/* Resource Selection Modal */}
      <Modal
        visible={showResourceModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowResourceModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowResourceModal(false)}
          className="flex-1 bg-black/50 justify-center items-center px-4"
        >
          <View
            className="bg-white rounded-xl w-full max-w-md"
            style={{ maxHeight: "70%" }}
            onStartShouldSetResponder={() => true}
          >
            <View className="px-4 py-3 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-900">
                Select Resources
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Choose resources to assign to this classroom
              </Text>
            </View>
            {isLoadingResources ? (
              <View className="px-4 py-12 items-center justify-center">
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                <Text className="text-gray-500 text-base mt-4">
                  Loading resources...
                </Text>
              </View>
            ) : resources.length === 0 ? (
              <View className="px-4 py-12 items-center justify-center">
                <Ionicons
                  name="document-outline"
                  size={48}
                  color={COLORS.GRAY_400}
                />
                <Text className="text-gray-500 text-base mt-4 text-center">
                  No resources available
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  Create resources first to assign them to this classroom
                </Text>
              </View>
            ) : (
              <FlatList
                data={resources}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected = selectedResourceIds.includes(item.id);
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
                  const icon = getResourceIcon(item.type);
                  return (
                    <TouchableOpacity
                      onPress={() => handleResourceToggle(item.id)}
                      activeOpacity={0.7}
                      className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100"
                    >
                      <View className="flex-1 flex-row items-center">
                        <View
                          className="w-10 h-10 rounded-full items-center justify-center mr-3"
                          style={{
                            backgroundColor: `${icon.color}15`,
                          }}
                        >
                          <Ionicons
                            name={icon.name}
                            size={20}
                            color={icon.color}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base text-gray-900 font-medium">
                            {item.title}
                          </Text>
                          {item.description && (
                            <Text
                              className="text-sm text-gray-500 mt-1"
                              numberOfLines={1}
                            >
                              {item.description}
                            </Text>
                          )}
                          {item.ageRange && (
                            <Text className="text-xs text-gray-400 mt-1">
                              Ages {item.ageRange.min}-{item.ageRange.max}
                            </Text>
                          )}
                        </View>
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
                onPress={() => setShowResourceModal(false)}
                activeOpacity={0.7}
                className="bg-purple-600 rounded-xl py-3 items-center"
              >
                <Text className="text-white font-semibold text-base">
                  Done ({selectedResourceIds.length} selected)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Resources View Modal */}
      <Modal
        visible={showResourcesView}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowResourcesView(false)}
      >
        <BaseLayout showBottomNav={false} backgroundColor="bg-white">
          <View className="flex-1">
            {/* Header */}
            <View
              className="pt-6 px-6 pb-4"
              style={{ backgroundColor: "#6A0DAD" }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity
                  onPress={() => setShowResourcesView(false)}
                  className="mr-4"
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-white">
                    Class Resources
                  </Text>
                  <Text className="text-base text-white opacity-90">
                    {classroom?.name}
                  </Text>
                </View>
              </View>

              {/* Session Controls */}
              {!currentSession ? (
                <TouchableOpacity
                  onPress={handleStartSession}
                  disabled={isStartingSession}
                  activeOpacity={0.7}
                  className={`rounded-xl px-6 py-3 flex-row items-center justify-center mb-4 ${
                    isStartingSession ? "bg-gray-400" : "bg-white"
                  }`}
                >
                  {isStartingSession ? (
                    <ActivityIndicator size="small" color="#6A0DAD" />
                  ) : (
                    <Ionicons name="play-circle" size={24} color="#6A0DAD" />
                  )}
                  <Text
                    className={`font-semibold text-base ml-2 ${
                      isStartingSession ? "text-gray-600" : "text-purple-600"
                    }`}
                  >
                    {isStartingSession ? "Starting..." : "Start Session"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View className="bg-white/20 rounded-xl px-6 py-3 mb-4">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-white font-semibold text-base">
                        Session Active
                      </Text>
                      <Text className="text-white opacity-80 text-sm mt-1">
                        Started{" "}
                        {sessionStartTime
                          ? formatDate(sessionStartTime)
                          : "recently"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={handleEndSession}
                      disabled={isEndingSession}
                      activeOpacity={0.7}
                      className="bg-red-500 rounded-lg px-4 py-2"
                    >
                      {isEndingSession ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white font-semibold">
                          End Session
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Resources List */}
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {isLoadingClassResources ? (
                <View className="px-6 py-12 items-center justify-center">
                  <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                  <Text className="text-gray-500 text-base mt-4">
                    Loading resources...
                  </Text>
                </View>
              ) : classResources.length === 0 ? (
                <View className="px-6 py-12 items-center justify-center">
                  <Ionicons
                    name="document-outline"
                    size={64}
                    color={COLORS.GRAY_400}
                  />
                  <Text className="text-gray-500 text-base mt-4 text-center">
                    No resources available for this class
                  </Text>
                  <Text className="text-gray-400 text-sm mt-2 text-center">
                    Assign resources to this class to see them here
                  </Text>
                </View>
              ) : (
                <View className="px-4 pt-4">
                  {classResources.map((resource, index) => {
                    const resourceIcon = getResourceIcon(resource.type);
                    return (
                      <View
                        key={resource.id}
                        className={`bg-white rounded-xl shadow overflow-hidden mb-4 ${
                          index < classResources.length - 1 ? "" : ""
                        }`}
                      >
                        <View className="p-6">
                          <View className="flex-row items-start mb-4">
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
                              <Text className="text-lg font-bold text-gray-900 mb-1">
                                {resource.title}
                              </Text>
                              {resource.description && (
                                <Text className="text-sm text-gray-600 mb-2">
                                  {resource.description}
                                </Text>
                              )}
                              {resource.ageRange && (
                                <View className="px-2 py-1 bg-purple-100 rounded-full self-start">
                                  <Text className="text-xs font-semibold text-purple-700">
                                    Ages {resource.ageRange.min}-
                                    {resource.ageRange.max}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>

                          {/* Action Buttons */}
                          <View className="flex-row gap-2">
                            {resource.type === "video" ? (
                              <TouchableOpacity
                                onPress={() => handlePlayVideo(resource)}
                                activeOpacity={0.7}
                                className="flex-1 bg-purple-600 rounded-xl px-4 py-3 flex-row items-center justify-center"
                              >
                                <Ionicons
                                  name="play-circle"
                                  size={20}
                                  color="white"
                                />
                                <Text className="text-white font-semibold text-sm ml-2">
                                  Watch Video
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  router.push({
                                    pathname: `/resources/${resource.id}`,
                                    params: { classId: id },
                                  });
                                }}
                                activeOpacity={0.7}
                                className="flex-1 bg-purple-600 rounded-xl px-4 py-3 flex-row items-center justify-center"
                              >
                                <Ionicons
                                  name="eye-outline"
                                  size={20}
                                  color="white"
                                />
                                <Text className="text-white font-semibold text-sm ml-2">
                                  View Resource
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </ScrollView>
          </View>
        </BaseLayout>

        {/* Video Player Modal (for direct video URLs) */}
        <Modal
          visible={showVideoPlayer}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={handleVideoClose}
        >
          <View className="flex-1 bg-black">
            <VideoPlayer
              uri={videoUri}
              onClose={handleVideoClose}
              onVideoEnd={handleVideoEnd}
            />
          </View>
        </Modal>

        {/* YouTube Player Modal */}
        <Modal
          visible={showYouTubePlayer}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={handleVideoClose}
        >
          <View className="flex-1 bg-black">
            <YouTubePlayer
              videoId={youtubeVideoId}
              onClose={handleVideoClose}
              onVideoEnd={handleVideoEnd}
            />
          </View>
        </Modal>

        {/* WebView Player Modal (for Vimeo) */}
        <Modal
          visible={showWebViewPlayer}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={handleVideoClose}
        >
          <WebViewPlayer
            uri={webViewUri}
            onClose={handleVideoClose}
            isVimeo={isVimeo}
            onVideoEnd={handleVideoEnd}
          />
        </Modal>
      </Modal>
    </BaseLayout>
  );
}

// Helper function to get resource icon (duplicate from above, but needed in modal)
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
