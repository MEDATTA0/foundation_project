import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BaseLayout } from "../../components/layout";
import { COLORS, API_ENDPOINTS } from "../../constants";
import { api } from "../../services/api";
import { useAuthStore } from "../../stores";

export default function CreateResourcePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Age range options
  const ageRanges = [
    { id: "4-6", label: "4-6", min: 4, max: 6 },
    { id: "7-10", label: "7-10", min: 7, max: 10 },
    { id: "11-14", label: "11-14", min: 11, max: 14 },
  ];

  // Resource type options
  const resourceTypes = [
    { id: "video", label: "Video", icon: "videocam" },
    { id: "document", label: "Document Link", icon: "document-text" },
  ];

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    resource: "",
    resourceType: "video",
    ageRange: null,
    classId: null,
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showAgeRangeDropdown, setShowAgeRangeDropdown] = useState(false);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        const data = await api.get(API_ENDPOINTS.CLASSES.LIST);
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [isAuthenticated]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (!formData.resource.trim()) {
      Alert.alert("Error", "Please enter a resource URL");
      return;
    }

    // Validate URL format
    try {
      new URL(formData.resource);
    } catch (e) {
      Alert.alert("Error", "Please enter a valid URL");
      return;
    }

    if (!formData.classId) {
      Alert.alert("Error", "Please select a class");
      return;
    }

    if (!formData.ageRange) {
      Alert.alert("Error", "Please select an age range");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(API_ENDPOINTS.RESOURCES.CREATE(formData.classId), {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        resource: formData.resource.trim(),
        ageMin: formData.ageRange.min,
        ageMax: formData.ageRange.max,
      });

      Alert.alert("Success", "Resource created successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error creating resource:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to create resource. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedClass = classes.find((c) => c.id === formData.classId);

  return (
    <BaseLayout showBottomNav={false} backgroundColor="bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        {/* Purple Header Section */}
        <View className="pt-6 px-6 pb-6" style={{ backgroundColor: "#6A0DAD" }}>
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
                Create Resource
              </Text>
              <Text className="text-base text-white opacity-90">
                Add a new video or document link
              </Text>
            </View>
          </View>
        </View>

        {/* Form Section */}
        <View className="px-4 pt-6">
          {/* Title */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Title <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={formData.title}
              onChangeText={(text) => handleInputChange("title", text)}
              placeholder="e.g., Basic Counting Course"
              placeholderTextColor={COLORS.GRAY_400}
              className="border border-gray-300 rounded-xl px-4 py-3.5 bg-white text-base text-gray-900"
            />
          </View>

          {/* Description */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Description
            </Text>
            <TextInput
              value={formData.description}
              onChangeText={(text) => handleInputChange("description", text)}
              placeholder="e.g., Learn numbers 1-10 with fun activities"
              placeholderTextColor={COLORS.GRAY_400}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="border border-gray-300 rounded-xl px-4 py-3.5 bg-white text-base text-gray-900 min-h-[100px]"
            />
          </View>

          {/* Resource Type */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-900 mb-3">
              Resource Type <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row gap-3">
              {resourceTypes.map((type) => {
                const isSelected = formData.resourceType === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => handleInputChange("resourceType", type.id)}
                    activeOpacity={0.7}
                    className={`flex-1 border-2 rounded-xl px-4 py-4 flex-row items-center justify-center ${
                      isSelected
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <Ionicons
                      name={type.icon}
                      size={24}
                      color={isSelected ? COLORS.PRIMARY : COLORS.GRAY_500}
                    />
                    <Text
                      className={`ml-2 font-semibold text-base ${
                        isSelected ? "text-purple-600" : "text-gray-700"
                      }`}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Resource URL */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Resource URL <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={formData.resource}
              onChangeText={(text) => handleInputChange("resource", text)}
              placeholder={
                formData.resourceType === "video"
                  ? "https://youtube.com/watch?v=..."
                  : "https://example.com/document.pdf"
              }
              placeholderTextColor={COLORS.GRAY_400}
              className="border border-gray-300 rounded-xl px-4 py-3.5 bg-white text-base text-gray-900"
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text className="text-xs text-gray-500 mt-2">
              {formData.resourceType === "video"
                ? "Enter a YouTube, Vimeo, or video file URL"
                : "Enter a document link (PDF, DOC, etc.)"}
            </Text>
          </View>

          {/* Select Class */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-900 mb-3">
              Assign to Class <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowClassDropdown(true)}
              activeOpacity={0.7}
              className="border border-gray-300 rounded-xl px-4 py-3.5 flex-row items-center justify-between bg-white"
            >
              <Text
                className={`text-base flex-1 ${
                  selectedClass ? "text-gray-900" : "text-gray-400"
                }`}
                numberOfLines={1}
              >
                {selectedClass ? selectedClass.name : "Select a class"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.GRAY_500} />
            </TouchableOpacity>
          </View>

          {/* Age Range */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-900 mb-3">
              Age Range <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowAgeRangeDropdown(true)}
              activeOpacity={0.7}
              className="border border-gray-300 rounded-xl px-4 py-3.5 flex-row items-center justify-between bg-white"
            >
              <Text
                className={`text-base flex-1 ${
                  formData.ageRange ? "text-gray-900" : "text-gray-400"
                }`}
                numberOfLines={1}
              >
                {formData.ageRange
                  ? `Ages ${formData.ageRange.min}-${formData.ageRange.max}`
                  : "Select age range"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.GRAY_500} />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.7}
            className="bg-purple-600 rounded-xl px-6 py-4 flex-row items-center justify-center shadow-lg"
            style={{
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text className="text-white font-semibold text-base ml-2">
                  Create Resource
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Class Selection Modal */}
      <Modal
        visible={showClassDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowClassDropdown(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowClassDropdown(false)}
          className="flex-1 bg-black/50 justify-center items-center px-4"
        >
          <View
            className="bg-white rounded-xl w-full max-w-md"
            style={{ maxHeight: "70%" }}
            onStartShouldSetResponder={() => true}
          >
            <View className="px-4 py-3 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-900">
                Select Class
              </Text>
            </View>
            {loading ? (
              <View className="px-4 py-12 items-center justify-center">
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                <Text className="text-gray-500 text-base mt-4">
                  Loading classes...
                </Text>
              </View>
            ) : classes.length === 0 ? (
              <View className="px-4 py-12 items-center justify-center">
                <Ionicons
                  name="school-outline"
                  size={48}
                  color={COLORS.GRAY_400}
                />
                <Text className="text-gray-500 text-base mt-4 text-center">
                  No classes available
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  Create a class first
                </Text>
              </View>
            ) : (
              <ScrollView>
                {classes.map((classItem) => {
                  const isSelected = formData.classId === classItem.id;
                  return (
                    <TouchableOpacity
                      key={classItem.id}
                      onPress={() => {
                        handleInputChange("classId", classItem.id);
                        setShowClassDropdown(false);
                      }}
                      activeOpacity={0.7}
                      className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100"
                    >
                      <View className="flex-1">
                        <Text className="text-base text-gray-900 font-medium">
                          {classItem.name}
                        </Text>
                        {classItem.description && (
                          <Text className="text-sm text-gray-500 mt-1">
                            {classItem.description}
                          </Text>
                        )}
                      </View>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={COLORS.PRIMARY}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
            <View className="px-4 py-3 border-t border-gray-200">
              <TouchableOpacity
                onPress={() => setShowClassDropdown(false)}
                activeOpacity={0.7}
                className="bg-purple-600 rounded-xl py-3 items-center"
              >
                <Text className="text-white font-semibold text-base">
                  {selectedClass ? "Done" : "Cancel"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Age Range Selection Modal */}
      <Modal
        visible={showAgeRangeDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAgeRangeDropdown(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowAgeRangeDropdown(false)}
          className="flex-1 bg-black/50 justify-center items-center px-4"
        >
          <View
            className="bg-white rounded-xl w-full max-w-md"
            style={{ maxHeight: "70%" }}
            onStartShouldSetResponder={() => true}
          >
            <View className="px-4 py-3 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-900">
                Select Age Range
              </Text>
            </View>
            <ScrollView>
              {ageRanges.map((ageRange) => {
                const isSelected =
                  formData.ageRange?.id === ageRange.id ||
                  (formData.ageRange?.min === ageRange.min &&
                    formData.ageRange?.max === ageRange.max);
                return (
                  <TouchableOpacity
                    key={ageRange.id}
                    onPress={() => {
                      handleInputChange("ageRange", ageRange);
                      setShowAgeRangeDropdown(false);
                    }}
                    activeOpacity={0.7}
                    className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100"
                  >
                    <Text className="text-base text-gray-900 font-medium">
                      Ages {ageRange.min}-{ageRange.max}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={COLORS.PRIMARY}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View className="px-4 py-3 border-t border-gray-200">
              <TouchableOpacity
                onPress={() => setShowAgeRangeDropdown(false)}
                activeOpacity={0.7}
                className="bg-purple-600 rounded-xl py-3 items-center"
              >
                <Text className="text-white font-semibold text-base">
                  {formData.ageRange ? "Done" : "Cancel"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </BaseLayout>
  );
}
