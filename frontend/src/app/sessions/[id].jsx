import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BaseLayout } from "../../components/layout";
import { COLORS } from "../../constants";

// Mock session data - to be replaced with actual API call
const mockSessionsData = {
  1: {
    id: 1,
    className: "Mathematics - Nyabirasi",
    subject: "Math",
    date: "2024-03-15",
    time: "10:00 AM - 11:30 AM",
    location: "Nyabirasi Primary School",
    duration: "1 hour 30 minutes",
    totalStudents: 47,
    attendedStudents: 45,
    attendancePercentage: 95.7,
    status: "completed",
    resources: [
      {
        id: 1,
        title: "Basic Counting Course",
        type: "document",
        category: "Mathematics",
      },
      {
        id: 2,
        title: "Math Practice Problems",
        type: "document",
        category: "Mathematics",
      },
    ],
    students: [
      { id: 1, name: "Emma Watson", attended: true },
      { id: 2, name: "Oliver Smith", attended: true },
      { id: 3, name: "Sophia Johnson", attended: true },
      { id: 4, name: "Liam Brown", attended: true },
      { id: 5, name: "Ava Davis", attended: true },
      { id: 6, name: "Noah Wilson", attended: true },
      { id: 7, name: "Isabella Martinez", attended: true },
      { id: 8, name: "Ethan Anderson", attended: true },
      { id: 9, name: "Mia Thompson", attended: true },
      { id: 10, name: "James Wilson", attended: true },
      { id: 11, name: "Charlotte Lee", attended: true },
      { id: 12, name: "Benjamin Taylor", attended: true },
      { id: 13, name: "Amelia White", attended: true },
      { id: 14, name: "Lucas Harris", attended: true },
      { id: 15, name: "Harper Clark", attended: true },
      { id: 16, name: "Alexander Lewis", attended: true },
      { id: 17, name: "Evelyn Walker", attended: true },
      { id: 18, name: "Daniel Hall", attended: true },
      { id: 19, name: "Abigail Young", attended: true },
      { id: 20, name: "Matthew King", attended: true },
      { id: 21, name: "Scarlett Wright", attended: true },
      { id: 22, name: "Henry Green", attended: true },
      { id: 23, name: "Luna Adams", attended: true },
      { id: 24, name: "Jack Baker", attended: true },
      { id: 25, name: "Grace Cooper", attended: true },
      { id: 26, name: "Owen Evans", attended: true },
      { id: 27, name: "Chloe Foster", attended: true },
      { id: 28, name: "Leo Gray", attended: true },
      { id: 29, name: "Zoe Hill", attended: true },
      { id: 30, name: "Mason Jones", attended: true },
      { id: 31, name: "Lily Kelly", attended: true },
      { id: 32, name: "Aiden Lee", attended: true },
      { id: 33, name: "Nora Mitchell", attended: true },
      { id: 34, name: "Carter Nelson", attended: true },
      { id: 35, name: "Hannah Parker", attended: true },
      { id: 36, name: "Wyatt Roberts", attended: true },
      { id: 37, name: "Aria Scott", attended: true },
      { id: 38, name: "Logan Turner", attended: true },
      { id: 39, name: "Ella White", attended: true },
      { id: 40, name: "Caleb Young", attended: true },
      { id: 41, name: "Maya Brown", attended: true },
      { id: 42, name: "Isaac Davis", attended: true },
      { id: 43, name: "Avery Garcia", attended: true },
      { id: 44, name: "Layla Martinez", attended: true },
      { id: 45, name: "Nathan Rodriguez", attended: true },
      { id: 46, name: "Sofia Thompson", attended: false },
      { id: 47, name: "Dylan Wilson", attended: false },
    ],
    notes:
      "Great session! Students were very engaged with the counting exercises. Most students completed the practice problems successfully.",
  },
  2: {
    id: 2,
    className: "Science - Nyabirasi",
    subject: "Science",
    date: "2024-03-14",
    time: "2:00 PM - 3:30 PM",
    location: "Nyabirasi Primary School",
    duration: "1 hour 30 minutes",
    totalStudents: 45,
    attendedStudents: 42,
    attendancePercentage: 93.3,
    status: "completed",
    resources: [
      {
        id: 3,
        title: "Introduction to Plants",
        type: "video",
        category: "Science",
      },
    ],
    students: [
      { id: 1, name: "Emma Watson", attended: true },
      { id: 2, name: "Oliver Smith", attended: true },
      { id: 3, name: "Sophia Johnson", attended: true },
      { id: 4, name: "Liam Brown", attended: true },
      { id: 5, name: "Ava Davis", attended: true },
      { id: 6, name: "Noah Wilson", attended: true },
      { id: 7, name: "Isabella Martinez", attended: true },
      { id: 8, name: "Ethan Anderson", attended: true },
      { id: 9, name: "Mia Thompson", attended: true },
      { id: 10, name: "James Wilson", attended: true },
      { id: 11, name: "Charlotte Lee", attended: true },
      { id: 12, name: "Benjamin Taylor", attended: true },
      { id: 13, name: "Amelia White", attended: true },
      { id: 14, name: "Lucas Harris", attended: true },
      { id: 15, name: "Harper Clark", attended: true },
      { id: 16, name: "Alexander Lewis", attended: true },
      { id: 17, name: "Evelyn Walker", attended: true },
      { id: 18, name: "Daniel Hall", attended: true },
      { id: 19, name: "Abigail Young", attended: true },
      { id: 20, name: "Matthew King", attended: true },
      { id: 21, name: "Scarlett Wright", attended: true },
      { id: 22, name: "Henry Green", attended: true },
      { id: 23, name: "Luna Adams", attended: true },
      { id: 24, name: "Jack Baker", attended: true },
      { id: 25, name: "Grace Cooper", attended: true },
      { id: 26, name: "Owen Evans", attended: true },
      { id: 27, name: "Chloe Foster", attended: true },
      { id: 28, name: "Leo Gray", attended: true },
      { id: 29, name: "Zoe Hill", attended: true },
      { id: 30, name: "Mason Jones", attended: true },
      { id: 31, name: "Lily Kelly", attended: true },
      { id: 32, name: "Aiden Lee", attended: true },
      { id: 33, name: "Nora Mitchell", attended: true },
      { id: 34, name: "Carter Nelson", attended: true },
      { id: 35, name: "Hannah Parker", attended: true },
      { id: 36, name: "Wyatt Roberts", attended: true },
      { id: 37, name: "Aria Scott", attended: true },
      { id: 38, name: "Logan Turner", attended: true },
      { id: 39, name: "Ella White", attended: true },
      { id: 40, name: "Caleb Young", attended: true },
      { id: 41, name: "Maya Brown", attended: true },
      { id: 42, name: "Isaac Davis", attended: true },
      { id: 43, name: "Avery Garcia", attended: false },
      { id: 44, name: "Layla Martinez", attended: false },
      { id: 45, name: "Nathan Rodriguez", attended: false },
    ],
    notes:
      "Students enjoyed the plant video. Some students had questions about photosynthesis which we discussed.",
  },
  3: {
    id: 3,
    className: "English - Nyakabiga",
    subject: "English",
    date: "2024-03-13",
    time: "9:00 AM - 10:30 AM",
    location: "Nyakabiga Primary School",
    duration: "1 hour 30 minutes",
    totalStudents: 40,
    attendedStudents: 38,
    attendancePercentage: 95.0,
    status: "completed",
    resources: [
      {
        id: 4,
        title: "Alphabet Adventure",
        type: "video",
        category: "Language",
      },
      {
        id: 5,
        title: "Basic English Vocabulary",
        type: "document",
        category: "Language",
      },
    ],
    students: [
      { id: 1, name: "Emma Watson", attended: true },
      { id: 2, name: "Oliver Smith", attended: true },
      { id: 3, name: "Sophia Johnson", attended: true },
      { id: 4, name: "Liam Brown", attended: true },
      { id: 5, name: "Ava Davis", attended: true },
      { id: 6, name: "Noah Wilson", attended: true },
      { id: 7, name: "Isabella Martinez", attended: true },
      { id: 8, name: "Ethan Anderson", attended: true },
      { id: 9, name: "Mia Thompson", attended: true },
      { id: 10, name: "James Wilson", attended: true },
      { id: 11, name: "Charlotte Lee", attended: true },
      { id: 12, name: "Benjamin Taylor", attended: true },
      { id: 13, name: "Amelia White", attended: true },
      { id: 14, name: "Lucas Harris", attended: true },
      { id: 15, name: "Harper Clark", attended: true },
      { id: 16, name: "Alexander Lewis", attended: true },
      { id: 17, name: "Evelyn Walker", attended: true },
      { id: 18, name: "Daniel Hall", attended: true },
      { id: 19, name: "Abigail Young", attended: true },
      { id: 20, name: "Matthew King", attended: true },
      { id: 21, name: "Scarlett Wright", attended: true },
      { id: 22, name: "Henry Green", attended: true },
      { id: 23, name: "Luna Adams", attended: true },
      { id: 24, name: "Jack Baker", attended: true },
      { id: 25, name: "Grace Cooper", attended: true },
      { id: 26, name: "Owen Evans", attended: true },
      { id: 27, name: "Chloe Foster", attended: true },
      { id: 28, name: "Leo Gray", attended: true },
      { id: 29, name: "Zoe Hill", attended: true },
      { id: 30, name: "Mason Jones", attended: true },
      { id: 31, name: "Lily Kelly", attended: true },
      { id: 32, name: "Aiden Lee", attended: true },
      { id: 33, name: "Nora Mitchell", attended: true },
      { id: 34, name: "Carter Nelson", attended: true },
      { id: 35, name: "Hannah Parker", attended: true },
      { id: 36, name: "Wyatt Roberts", attended: true },
      { id: 37, name: "Aria Scott", attended: true },
      { id: 38, name: "Logan Turner", attended: true },
      { id: 39, name: "Ella White", attended: false },
      { id: 40, name: "Caleb Young", attended: false },
    ],
    notes:
      "Good progress on vocabulary. Students practiced alphabet sounds and basic words.",
  },
  4: {
    id: 4,
    className: "History - Kimironko",
    subject: "History",
    date: "2024-03-12",
    time: "11:00 AM - 12:30 PM",
    location: "Kimironko Primary School",
    duration: "1 hour 30 minutes",
    totalStudents: 47,
    attendedStudents: 44,
    attendancePercentage: 93.6,
    status: "completed",
    resources: [
      {
        id: 6,
        title: "Rwandan History Overview",
        type: "document",
        category: "History",
      },
    ],
    students: [
      { id: 1, name: "Emma Watson", attended: true },
      { id: 2, name: "Oliver Smith", attended: true },
      { id: 3, name: "Sophia Johnson", attended: true },
      { id: 4, name: "Liam Brown", attended: true },
      { id: 5, name: "Ava Davis", attended: true },
      { id: 6, name: "Noah Wilson", attended: true },
      { id: 7, name: "Isabella Martinez", attended: true },
      { id: 8, name: "Ethan Anderson", attended: true },
      { id: 9, name: "Mia Thompson", attended: true },
      { id: 10, name: "James Wilson", attended: true },
      { id: 11, name: "Charlotte Lee", attended: true },
      { id: 12, name: "Benjamin Taylor", attended: true },
      { id: 13, name: "Amelia White", attended: true },
      { id: 14, name: "Lucas Harris", attended: true },
      { id: 15, name: "Harper Clark", attended: true },
      { id: 16, name: "Alexander Lewis", attended: true },
      { id: 17, name: "Evelyn Walker", attended: true },
      { id: 18, name: "Daniel Hall", attended: true },
      { id: 19, name: "Abigail Young", attended: true },
      { id: 20, name: "Matthew King", attended: true },
      { id: 21, name: "Scarlett Wright", attended: true },
      { id: 22, name: "Henry Green", attended: true },
      { id: 23, name: "Luna Adams", attended: true },
      { id: 24, name: "Jack Baker", attended: true },
      { id: 25, name: "Grace Cooper", attended: true },
      { id: 26, name: "Owen Evans", attended: true },
      { id: 27, name: "Chloe Foster", attended: true },
      { id: 28, name: "Leo Gray", attended: true },
      { id: 29, name: "Zoe Hill", attended: true },
      { id: 30, name: "Mason Jones", attended: true },
      { id: 31, name: "Lily Kelly", attended: true },
      { id: 32, name: "Aiden Lee", attended: true },
      { id: 33, name: "Nora Mitchell", attended: true },
      { id: 34, name: "Carter Nelson", attended: true },
      { id: 35, name: "Hannah Parker", attended: true },
      { id: 36, name: "Wyatt Roberts", attended: true },
      { id: 37, name: "Aria Scott", attended: true },
      { id: 38, name: "Logan Turner", attended: true },
      { id: 39, name: "Ella White", attended: true },
      { id: 40, name: "Caleb Young", attended: true },
      { id: 41, name: "Maya Brown", attended: true },
      { id: 42, name: "Isaac Davis", attended: true },
      { id: 43, name: "Avery Garcia", attended: true },
      { id: 44, name: "Layla Martinez", attended: true },
      { id: 45, name: "Nathan Rodriguez", attended: false },
      { id: 46, name: "Sofia Thompson", attended: false },
      { id: 47, name: "Dylan Wilson", attended: false },
    ],
    notes:
      "Students learned about important historical events. Discussion was very engaging.",
  },
};

export default function SessionDetailsPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingAttendance, setIsEditingAttendance] = useState(false);

  // Fetch session data
  useEffect(() => {
    const fetchSessionData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await api.get(`/sessions/${id}`);
        // setSession(response.data);

        // Using mock data
        const sessionData = mockSessionsData[parseInt(id)];
        if (sessionData) {
          setSession(sessionData);
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSessionData();
    }
  }, [id]);

  const getSubjectIcon = (subject) => {
    const icons = {
      Math: "calculator",
      Science: "flask",
      English: "book",
      History: "library",
    };
    return icons[subject] || "school";
  };

  const getSubjectColor = (subject) => {
    const colors = {
      Math: COLORS.PRIMARY,
      Science: "#10B981",
      English: "#3B82F6",
      History: COLORS.ACCENT_ORANGE,
    };
    return colors[subject] || COLORS.GRAY_500;
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

  const attendedStudents = session?.students.filter((s) => s.attended) || [];
  const absentStudents = session?.students.filter((s) => !s.attended) || [];

  const handleToggleAttendance = (studentId) => {
    if (!isEditingAttendance || !session) return;

    const updatedStudents = session.students.map((student) =>
      student.id === studentId
        ? { ...student, attended: !student.attended }
        : student
    );

    const newAttendedCount = updatedStudents.filter((s) => s.attended).length;
    const newTotalStudents = updatedStudents.length;
    const newAttendancePercentage = (newAttendedCount / newTotalStudents) * 100;

    setSession({
      ...session,
      students: updatedStudents,
      attendedStudents: newAttendedCount,
      attendancePercentage: newAttendancePercentage,
    });
  };

  const handleSaveAttendance = async () => {
    if (!session) return;

    try {
      // TODO: Replace with actual API call
      // await api.put(`/sessions/${id}/attendance`, {
      //   students: session.students.map((s) => ({
      //     id: s.id,
      //     attended: s.attended,
      //   })),
      // });

      console.log("Saving attendance:", session.students);
      setIsEditingAttendance(false);
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

  const handleCancelEdit = () => {
    // Reload original data
    if (id) {
      const originalData = mockSessionsData[parseInt(id)];
      if (originalData) {
        setSession(originalData);
      }
    }
    setIsEditingAttendance(false);
  };

  if (loading) {
    return (
      <BaseLayout showBottomNav={false} backgroundColor="bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-base">Loading session...</Text>
        </View>
      </BaseLayout>
    );
  }

  if (!session) {
    return (
      <BaseLayout showBottomNav={false} backgroundColor="bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="calendar-outline" size={64} color={COLORS.GRAY_400} />
          <Text className="text-gray-500 text-base mt-4 text-center">
            Session not found
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

  const subjectColor = getSubjectColor(session.subject);
  const subjectIcon = getSubjectIcon(session.subject);

  return (
    <BaseLayout showBottomNav={false} backgroundColor="bg-white">
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header Section */}
          <View
            className="pt-6 px-6 pb-6"
            style={{ backgroundColor: subjectColor }}
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
                  Session Details
                </Text>
              </View>
            </View>

            {/* Session Title */}
            <View className="items-center mt-4">
              <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-3">
                <Ionicons name={subjectIcon} size={32} color="white" />
              </View>
              <Text className="text-2xl font-bold text-white mb-1">
                {session.className}
              </Text>
              <Text className="text-base text-white opacity-90">
                {new Date(session.date).toLocaleDateString()} • {session.time}
              </Text>
            </View>

            {/* Attendance Stats */}
            <View className="mt-6 bg-white/20 rounded-xl px-4 py-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-white opacity-90">
                  Attendance
                </Text>
                <Text className="text-xs font-semibold px-2 py-1 rounded-full bg-white/30 text-white">
                  {session.attendancePercentage.toFixed(1)}%
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="flex-1 mr-3">
                  <View className="h-3 bg-white/30 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full bg-white"
                      style={{
                        width: `${session.attendancePercentage}%`,
                      }}
                    />
                  </View>
                </View>
                <Text className="text-2xl font-bold text-white">
                  {session.attendedStudents}/{session.totalStudents}
                </Text>
              </View>
            </View>
          </View>

          {/* Content Section */}
          <View className="px-4 pb-6 -mt-2">
            {/* Session Information */}
            <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
              <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-lg font-bold text-gray-900">
                  Session Information
                </Text>
              </View>
              <View className="p-6">
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-500 mb-1">
                    Location
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons
                      name="location"
                      size={16}
                      color={COLORS.GRAY_500}
                      style={{ marginRight: 6 }}
                    />
                    <Text className="text-base text-gray-900">
                      {session.location}
                    </Text>
                  </View>
                </View>
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-500 mb-1">
                    Duration
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons
                      name="time"
                      size={16}
                      color={COLORS.GRAY_500}
                      style={{ marginRight: 6 }}
                    />
                    <Text className="text-base text-gray-900">
                      {session.duration}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text className="text-sm font-semibold text-gray-500 mb-1">
                    Status
                  </Text>
                  <View className="px-3 py-1 rounded-full bg-green-100 self-start">
                    <Text className="text-xs font-semibold text-green-700">
                      {session.status.charAt(0).toUpperCase() +
                        session.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Resources Used */}
            <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
              <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-lg font-bold text-gray-900">
                  Resources Used ({session.resources.length})
                </Text>
              </View>
              <View className="p-4">
                {session.resources.map((resource, index) => {
                  const resourceIcon = getResourceIcon(resource.type);
                  return (
                    <View
                      key={resource.id}
                      className={`flex-row items-center py-3 ${
                        index < session.resources.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
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
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-slate-700">
                          {resource.title}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          {resource.category}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Students Attendance */}
            <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
              <View className="px-6 py-4 border-b border-gray-100 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-gray-900">
                  ({session.totalStudents})
                </Text>
                <View className="flex-row items-center gap-3">
                  <View className="flex-row gap-2">
                    <View className="px-2 py-1 rounded-full bg-green-100">
                      <Text className="text-xs font-semibold text-green-700">
                        {attendedStudents.length} Present
                      </Text>
                    </View>
                    <View className="px-2 py-1 rounded-full bg-red-100">
                      <Text className="text-xs font-semibold text-red-700">
                        {absentStudents.length} Absent
                      </Text>
                    </View>
                  </View>
                  {!isEditingAttendance ? (
                    <TouchableOpacity
                      onPress={() => setIsEditingAttendance(true)}
                      activeOpacity={0.7}
                      className="px-4 py-2 rounded-lg"
                      style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                      <Ionicons name="create-outline" size={16} color="white" />
                    </TouchableOpacity>
                  ) : (
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={handleCancelEdit}
                        activeOpacity={0.7}
                        className="px-3 py-2 rounded-lg border border-gray-300"
                      >
                        <Text className="text-xs font-semibold text-gray-700">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSaveAttendance}
                        activeOpacity={0.7}
                        className="px-3 py-2 rounded-lg"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                      >
                        <Text className="text-xs font-semibold text-white">
                          Save
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              <View className="p-4">
                {session.students.map((student, index) => (
                  <TouchableOpacity
                    key={student.id}
                    onPress={() => handleToggleAttendance(student.id)}
                    disabled={!isEditingAttendance}
                    activeOpacity={isEditingAttendance ? 0.7 : 1}
                    className={`flex-row items-center justify-between py-3 ${
                      index < session.students.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    } ${isEditingAttendance ? "opacity-100" : ""}`}
                  >
                    <View className="flex-row items-center flex-1">
                      <View
                        className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                          student.attended ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <Ionicons
                          name={student.attended ? "checkmark" : "close"}
                          size={16}
                          color={student.attended ? "#10B981" : "#EF4444"}
                        />
                      </View>
                      <Text className="text-base text-gray-900">
                        {student.name}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <View
                        className={`px-3 py-1 rounded-full ${
                          student.attended ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            student.attended ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {student.attended ? "Present" : "Absent"}
                        </Text>
                      </View>
                      {isEditingAttendance && (
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={COLORS.GRAY_400}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Session Notes */}
            {session.notes && (
              <View className="bg-white rounded-xl shadow overflow-hidden mb-4">
                <View className="px-6 py-4 border-b border-gray-100">
                  <Text className="text-lg font-bold text-gray-900">
                    Session Notes
                  </Text>
                </View>
                <View className="p-6">
                  <Text className="text-base text-gray-700 leading-6">
                    {session.notes}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </BaseLayout>
  );
}
