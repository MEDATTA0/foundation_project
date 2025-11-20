import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../stores";
import { COLORS } from "../../constants";
import { USER_NAME } from "../../constants/userName";

// Sample classroom data
const classrooms = [
  { id: "all", name: "All Classrooms" },
  { id: "class1", name: "Humanitarian Learning" },
  { id: "class2", name: "Introduction to Technology" },
  { id: "class3", name: "Basic Computer Skills" },
  { id: "class4", name: "Basic English" },
];

// Sample student data with classroom assignments
const studentsData = [
  { id: 1, name: "Emma Watsonn", classroomId: "class1" },
  { id: 2, name: "Oliver Smith", classroomId: "class1" },
  { id: 3, name: "Sophia Johnson", classroomId: "class2" },
  { id: 4, name: "Liam Brown", classroomId: "class2" },
  { id: 5, name: "Ava Davis", classroomId: "class3" },
  { id: 6, name: "Noah Wilson", classroomId: "class3" },
  { id: 7, name: "Isabella Martinez", classroomId: "class4" },
  { id: 8, name: "Ethan Anderson", classroomId: "class4" },
  { id: 9, name: "Mia Thompson", classroomId: "class1" },
  { id: 10, name: "James Wilson", classroomId: "class2" },
  { id: 11, name: "Charlotte Lee", classroomId: "class3" },
  { id: 12, name: "Benjamin Taylor", classroomId: "class4" },
  { id: 13, name: "Amelia White", classroomId: "class1" },
  { id: 14, name: "Lucas Harris", classroomId: "class2" },
  { id: 15, name: "Harper Clark", classroomId: "class3" },
  { id: 16, name: "Alexander Lewis", classroomId: "class4" },
  { id: 17, name: "Evelyn Walker", classroomId: "class1" },
  { id: 18, name: "Daniel Hall", classroomId: "class2" },
  { id: 19, name: "Abigail Young", classroomId: "class3" },
  { id: 20, name: "Matthew King", classroomId: "class4" },
];

export function StudentsListComponent({
  onClose,
  pageTitle = "Students List",
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  const userName = user?.name || USER_NAME;
  const [selectedClassroom, setSelectedClassroom] = useState(classrooms[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter students based on selected classroom
  const filteredStudents =
    selectedClassroom.id === "all"
      ? studentsData
      : studentsData.filter(
          (student) => student.classroomId === selectedClassroom.id
        );

  const handleViewStudent = (studentId) => {
    router.push(`/students/${studentId}`);
  };

  const handleSelectClassroom = (classroom) => {
    setSelectedClassroom(classroom);
    setIsDropdownOpen(false);
  };

  const getHeaderTitle = () => {
    if (selectedClassroom.id === "all") {
      return pageTitle;
    }
    return selectedClassroom.name;
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header with Purple Banner */}
      <View className="relative">
        {/* Purple Banner with rounded top */}
        <View
          className="pt-6 px-6 pb-6 flex-row items-center"
          style={{ backgroundColor: "#6A0DAD" }}
        >
          {/* User Name and Title */}
          <View className="flex-1">
            <Text className="text-4xl font-bold text-white mb-2">
              {userName}
            </Text>
            <Text className="text-lg text-white opacity-90">
              {getHeaderTitle()}
            </Text>
          </View>

          {/* Dropdown Filter */}
          <TouchableOpacity
            onPress={() => setIsDropdownOpen(true)}
            activeOpacity={0.8}
            className="flex-row items-center px-4 py-2 rounded-lg bg-white/20"
          >
            <Ionicons name="filter" size={18} color="#FFFFFF" />
            <Text className="text-white font-medium text-sm ml-2">
              {selectedClassroom.name}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="#FFFFFF"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
          className="flex-1 bg-black/50 justify-center items-center px-4"
        >
          <View
            className="bg-white rounded-xl w-full max-w-sm"
            style={{ maxHeight: "70%" }}
          >
            <View className="px-4 py-3 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-900">
                Select Classroom
              </Text>
            </View>
            <FlatList
              data={classrooms}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedClassroom.id === item.id;
                return (
                  <TouchableOpacity
                    onPress={() => handleSelectClassroom(item)}
                    activeOpacity={0.7}
                    className="px-4 py-4 flex-row items-center justify-between"
                    style={{
                      backgroundColor: isSelected
                        ? COLORS.PRIMARY + "10"
                        : "transparent",
                    }}
                  >
                    <Text
                      className="text-base flex-1"
                      style={{
                        color: isSelected
                          ? COLORS.PRIMARY
                          : COLORS.TEXT_PRIMARY,
                        fontWeight: isSelected ? "600" : "400",
                      }}
                    >
                      {item.name}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={COLORS.PRIMARY}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Students List */}
      <View className="flex-1 bg-white overflow-hidden">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, index) => (
              <View
                key={student.id}
                className="flex-row items-center justify-between px-4 py-4"
                style={{
                  borderBottomWidth:
                    index !== filteredStudents.length - 1 ? 1 : 0,
                  borderBottomColor: "#F3F4F6",
                }}
              >
                <View className="flex flex-row items-center gap-2">
                  <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center">
                    <Text className="text-xl font-medium text-[#6A0DAD]">
                      {student.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text className="text-xl font-medium text-slate-700">
                    {student.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleViewStudent(student.id)}
                  activeOpacity={0.8}
                  className="px-6 py-2 rounded-lg"
                  style={{ backgroundColor: COLORS.PRIMARY }}
                >
                  <Text className="text-white font-semibold text-sm">View</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View className="px-6 py-12 items-center justify-center">
              <Ionicons
                name="people-outline"
                size={48}
                color={COLORS.GRAY_400}
              />
              <Text className="text-gray-500 text-base mt-4 text-center">
                No students found in this classroom
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
