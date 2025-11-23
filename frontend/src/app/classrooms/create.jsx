import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BaseLayout } from "../../components/layout";
import { BottomNavigation } from "../../components/navigation";
import { NAVIGATION_TABS, COLORS, API_ENDPOINTS } from "../../constants";
import { api } from "../../services/api";
import { useAuthStore } from "../../stores";

export default function CreateClassroomPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Age range options
  const ageRanges = [
    { id: "4-6", label: "4-6", min: 4, max: 6 },
    { id: "7-10", label: "7-10", min: 7, max: 10 },
    { id: "11-14", label: "11-14", min: 11, max: 14 },
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ageRange: null,
    resourceIds: [],
    studentIds: [],
  });

  const [resources, setResources] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [assignStudents, setAssignStudents] = useState(false);

  // Fetch resources and students
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        // Fetch students from API
        const studentsData = await api.get(API_ENDPOINTS.STUDENTS.LIST);
        // Transform API response to component format
        const studentList = studentsData
          .map((item) => {
            if (item.student) {
              // Calculate age from birthDate
              const birthDate = new Date(item.student.birthDate);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
              ) {
                age--;
              }

              return {
                id: item.student.id,
                name: item.student.name,
                age: age,
              };
            }
            return null;
          })
          .filter(Boolean);

        setStudents(studentList);

        // Resources are tied to classes, so they're not available before class creation
        // Set empty array and show "not available" message
        setResources([]);
      } catch (error) {
        console.error("Error fetching data:", error);
        // On error, set empty arrays
        setStudents([]);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Filter resources based on selected age range
  const filteredResources = formData.ageRange
    ? resources.filter(
        (resource) =>
          resource.ageRange.min >= formData.ageRange.min &&
          resource.ageRange.max <= formData.ageRange.max
      )
    : resources;

  // Filter students based on selected age range
  const filteredStudents = formData.ageRange
    ? students.filter(
        (student) =>
          student.age >= formData.ageRange.min &&
          student.age <= formData.ageRange.max
      )
    : students;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAgeRangeSelect = (ageRange) => {
    setFormData((prev) => ({
      ...prev,
      ageRange,
      // Clear resource selections if age range changes
      resourceIds: [],
    }));
  };

  const handleResourceToggle = (resourceId) => {
    setFormData((prev) => {
      const isSelected = prev.resourceIds.includes(resourceId);
      return {
        ...prev,
        resourceIds: isSelected
          ? prev.resourceIds.filter((id) => id !== resourceId)
          : [...prev.resourceIds, resourceId],
      };
    });
  };

  const handleStudentToggle = (studentId) => {
    setFormData((prev) => {
      const isSelected = prev.studentIds.includes(studentId);
      return {
        ...prev,
        studentIds: isSelected
          ? prev.studentIds.filter((id) => id !== studentId)
          : [...prev.studentIds, studentId],
      };
    });
  };

  const getSelectedResourceNames = () => {
    return formData.resourceIds
      .map((id) => {
        const resource = resources.find((r) => r.id === id);
        return resource ? resource.title : null;
      })
      .filter(Boolean)
      .join(", ");
  };

  const getSelectedStudentNames = () => {
    return formData.studentIds
      .map((id) => {
        const student = students.find((s) => s.id === id);
        return student ? student.name : null;
      })
      .filter(Boolean)
      .join(", ");
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      alert("Please enter a classroom name");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter a description");
      return;
    }

    if (!formData.ageRange) {
      alert("Please select an age range");
      return;
    }

    setSubmitting(true);
    try {
      // Calculate start and end dates (using current date as start, 6 months later as end)
      const now = new Date();
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 6);

      // Format dates as ISO 8601 strings (required by backend)
      // Ensure we're sending valid ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
      const startDateISO = startDate.toISOString();
      const endDateISO = endDate.toISOString();

      // Validate dates are valid ISO strings
      if (
        !startDateISO ||
        !endDateISO ||
        typeof startDateISO !== "string" ||
        typeof endDateISO !== "string"
      ) {
        throw new Error("Failed to format dates");
      }

      // Ensure dates are strings (not Date objects)
      const requestBody = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        startDate: String(startDateISO),
        endDate: String(endDateISO),
        ageMin: formData.ageRange?.min,
        ageMax: formData.ageRange?.max,
      };

      // Debug: Log the exact request body being sent
      console.log(
        "Request body being sent:",
        JSON.stringify(requestBody, null, 2)
      );
      console.log("Start date type:", typeof requestBody.startDate);
      console.log("End date type:", typeof requestBody.endDate);
      console.log("Start date value:", requestBody.startDate);
      console.log("End date value:", requestBody.endDate);

      // Validate ISO 8601 format
      const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
      if (
        !iso8601Regex.test(requestBody.startDate) ||
        !iso8601Regex.test(requestBody.endDate)
      ) {
        console.error("Invalid ISO 8601 format:", {
          startDate: requestBody.startDate,
          endDate: requestBody.endDate,
        });
        throw new Error("Dates are not in valid ISO 8601 format");
      }

      const response = await api.post(
        API_ENDPOINTS.CLASSES.CREATE,
        requestBody
      );

      console.log("Classroom created:", response);

      // Navigate back to classrooms page
      router.back();
    } catch (error) {
      console.error("Error creating classroom:", error);
      const errorMessage =
        error.message || "Failed to create classroom. Please try again.";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

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
            className="pt-6 px-6 pb-12"
            style={{ backgroundColor: "#6A0DAD" }}
          >
            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                onPress={handleCancel}
                className="mr-4"
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-3xl font-bold text-white flex-1">
                Create Classroom
              </Text>
            </View>
            <Text className="text-base text-white opacity-90">
              Fill in the details to create a new classroom
            </Text>
          </View>

          {/* Form Section */}
          <View className="bg-white -mt-6 pb-6">
            <View className="mx-4">
              <View className="bg-white rounded-xl shadow overflow-hidden p-6">
                {/* Classroom Name */}
                <View className="mb-5">
                  <Text className="text-sm font-semibold text-gray-900 mb-2">
                    Classroom Name <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 bg-white"
                    placeholder="Enter classroom name"
                    placeholderTextColor={COLORS.GRAY_400}
                    value={formData.name}
                    onChangeText={(value) => handleInputChange("name", value)}
                  />
                </View>

                {/* Description */}
                <View className="mb-5">
                  <Text className="text-sm font-semibold text-gray-900 mb-2">
                    Description <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 bg-white"
                    placeholder="Enter classroom description"
                    placeholderTextColor={COLORS.GRAY_400}
                    value={formData.description}
                    onChangeText={(value) =>
                      handleInputChange("description", value)
                    }
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Age Range Selection */}
                <View className="mb-5">
                  <Text className="text-sm font-semibold text-gray-900 mb-3">
                    Age Range <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="flex-row gap-2 flex-wrap">
                    {ageRanges.map((ageRange) => {
                      const isSelected = formData.ageRange?.id === ageRange.id;
                      return (
                        <TouchableOpacity
                          key={ageRange.id}
                          onPress={() => handleAgeRangeSelect(ageRange)}
                          activeOpacity={0.7}
                          className={`px-5 py-3 rounded-full border-2 ${
                            isSelected
                              ? "bg-purple-600 border-purple-600"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          <Text
                            className={`text-base font-semibold ${
                              isSelected ? "text-white" : "text-gray-700"
                            }`}
                          >
                            {ageRange.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Resources Selection */}
                <View className="mb-5">
                  <Text className="text-sm font-semibold text-gray-900 mb-2">
                    Resources (Optional)
                  </Text>
                  {resources.length === 0 ? (
                    <View className="border border-gray-300 rounded-xl px-4 py-3.5 bg-gray-50">
                      <Text className="text-base text-gray-500 italic">
                        Resources are not available. You can add resources after
                        creating the classroom.
                      </Text>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          if (!formData.ageRange) {
                            alert("Please select an age range first");
                            return;
                          }
                          setShowResourceDropdown(true);
                        }}
                        activeOpacity={0.7}
                        className="border border-gray-300 rounded-xl px-4 py-3.5 flex-row items-center justify-between bg-white"
                      >
                        <Text
                          className={`text-base flex-1 ${
                            formData.resourceIds.length > 0
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                          numberOfLines={1}
                        >
                          {formData.resourceIds.length > 0
                            ? `${formData.resourceIds.length} resource${
                                formData.resourceIds.length !== 1 ? "s" : ""
                              } selected`
                            : "Select resources"}
                        </Text>
                        <Ionicons
                          name="chevron-down"
                          size={20}
                          color={COLORS.GRAY_500}
                        />
                      </TouchableOpacity>
                      {formData.resourceIds.length > 0 && (
                        <Text className="text-xs text-gray-500 mt-2">
                          {getSelectedResourceNames()}
                        </Text>
                      )}
                    </>
                  )}
                </View>

                {/* Optional: Assign Students */}
                <View className="mb-5">
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-sm font-semibold text-gray-900">
                      Assign Students (Optional)
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setAssignStudents(!assignStudents);
                        if (assignStudents) {
                          handleInputChange("studentIds", []);
                        }
                      }}
                      activeOpacity={0.7}
                      className={`w-12 h-6 rounded-full flex-row items-center ${
                        assignStudents ? "bg-purple-600" : "bg-gray-300"
                      }`}
                    >
                      <View
                        className={`w-5 h-5 rounded-full bg-white ${
                          assignStudents ? "ml-6" : "ml-0.5"
                        }`}
                      />
                    </TouchableOpacity>
                  </View>

                  {assignStudents && (
                    <View>
                      {students.length === 0 ? (
                        <View className="border border-gray-300 rounded-xl px-4 py-3.5 bg-gray-50">
                          <Text className="text-base text-gray-500 italic">
                            No students available. Please create students first.
                          </Text>
                        </View>
                      ) : (
                        <>
                          <TouchableOpacity
                            onPress={() => {
                              if (!formData.ageRange) {
                                alert("Please select an age range first");
                                return;
                              }
                              setShowStudentDropdown(true);
                            }}
                            activeOpacity={0.7}
                            className="border border-gray-300 rounded-xl px-4 py-3.5 flex-row items-center justify-between bg-white"
                          >
                            <Text
                              className={`text-base flex-1 ${
                                formData.studentIds.length > 0
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                              numberOfLines={1}
                            >
                              {formData.studentIds.length > 0
                                ? `${formData.studentIds.length} student${
                                    formData.studentIds.length !== 1 ? "s" : ""
                                  } selected`
                                : "Select students"}
                            </Text>
                            <Ionicons
                              name="chevron-down"
                              size={20}
                              color={COLORS.GRAY_500}
                            />
                          </TouchableOpacity>
                          {formData.studentIds.length > 0 && (
                            <Text className="text-xs text-gray-500 mt-2">
                              {getSelectedStudentNames()}
                            </Text>
                          )}
                        </>
                      )}
                    </View>
                  )}
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3 mt-4">
                  <TouchableOpacity
                    onPress={handleCancel}
                    activeOpacity={0.7}
                    className="flex-1 px-4 py-4 rounded-xl border border-gray-300 items-center"
                  >
                    <Text className="text-gray-700 font-semibold text-sm">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    activeOpacity={0.7}
                    disabled={submitting}
                    className="flex-1 px-4 py-4 rounded-xl items-center"
                    style={{
                      backgroundColor: submitting
                        ? COLORS.GRAY_400
                        : COLORS.PRIMARY,
                    }}
                  >
                    <Text className="text-white font-semibold text-sm text-center">
                      {submitting ? "Creating..." : "Create Classroom"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Resources Dropdown Modal */}
      <Modal
        visible={showResourceDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowResourceDropdown(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowResourceDropdown(false)}
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
                Age {formData.ageRange?.label || "N/A"}
              </Text>
            </View>
            {filteredResources.length === 0 ? (
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
                  Resources can be added after creating the classroom
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredResources}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const isSelected = formData.resourceIds.includes(item.id);
                  return (
                    <TouchableOpacity
                      onPress={() => handleResourceToggle(item.id)}
                      activeOpacity={0.7}
                      className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100"
                    >
                      <View className="flex-1">
                        <Text className="text-base text-gray-900 font-medium">
                          {item.title}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          Ages {item.ageRange.min}-{item.ageRange.max}
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
                onPress={() => setShowResourceDropdown(false)}
                activeOpacity={0.7}
                className="bg-purple-600 rounded-xl py-3 items-center"
              >
                <Text className="text-white font-semibold text-base">
                  Done ({formData.resourceIds.length} selected)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Students Dropdown Modal */}
      <Modal
        visible={showStudentDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStudentDropdown(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowStudentDropdown(false)}
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
                Age {formData.ageRange?.label || "N/A"}
              </Text>
            </View>
            {filteredStudents.length === 0 ? (
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
                  Create students first or adjust the age range
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredStudents}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const isSelected = formData.studentIds.includes(item.id);
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
                onPress={() => setShowStudentDropdown(false)}
                activeOpacity={0.7}
                className="bg-purple-600 rounded-xl py-3 items-center"
              >
                <Text className="text-white font-semibold text-base">
                  Done ({formData.studentIds.length} selected)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </BaseLayout>
  );
}
