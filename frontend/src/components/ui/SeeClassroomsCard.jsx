import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants";

/**
 * SeeClassroomsCard Component
 * Orange card with "See Classrooms" button and countdown timer
 *
 * @param {Object} props - Component props
 * @param {Function} props.onPress - Callback when card is pressed
 * @param {boolean} props.locked - Whether the card is locked
 * @param {number} props.countdownSeconds - Initial countdown in seconds
 */
export function SeeClassroomsCard({
  onPress,
  locked = true,
  countdownSeconds = 5435, // 1:30:35 in seconds
}) {
  const [timeLeft, setTimeLeft] = useState(countdownSeconds);

  useEffect(() => {
    if (!locked) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [locked]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={locked}
      activeOpacity={0.8}
      style={{ backgroundColor: COLORS.ACCENT_ORANGE }}
      className="rounded-2xl p-5 mb-4 flex-row items-center justify-between"
    >
      <View className="flex-1">
        <Text className="text-white text-xl font-bold mb-1">
          See Classrooms
        </Text>
        {locked && (
          <Text className="text-white text-sm opacity-90">
            Locked - will open in {formatTime(timeLeft)}
          </Text>
        )}
      </View>

      {/* Lock Icon */}
      {locked && (
        <View className="ml-3 border-2 border-[#D8D8D8] rounded-full py-3 px-3.5 shadow-lg">
          <Text className="text-white text-xl">🔒</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
