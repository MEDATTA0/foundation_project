import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants";
import { useAppStore } from "../../stores/appStore";

export function RecentSessions() {
  const { dashboard } = useAppStore();
  const sessions = dashboard.recentSessions || [];

  // Format date to relative time (Today, Yesterday, X days ago, or date)
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";

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
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Format time from duration and createdAt
  const formatTime = (duration, createdAt) => {
    if (!createdAt) return "N/A";

    const startTime = new Date(createdAt);
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

    const formatTime = (date) => {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  // Transform backend session to component format
  const transformedSessions = sessions.map((session) => ({
    id: session.id,
    className: session.location
      ? `Class Session - ${session.location}`
      : `Class Session`,
    date: formatDate(session.createdAt),
    time: formatTime(session.duration, session.createdAt),
    attendance: "N/A", // Not available in current response
    status: "completed",
    subject: "General",
    classId: session.classId,
    duration: session.duration,
  }));

  if (transformedSessions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Sessions</Text>
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color={COLORS.GRAY_400} />
          <Text style={styles.emptyText}>No recent sessions</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Sessions</Text>
      <View style={styles.sessionsList}>
        {transformedSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </View>
    </View>
  );
}

function SessionCard({ session }) {
  const router = useRouter();

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

  const handleSessionPress = () => {
    router.push(`/sessions/${session.id}`);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={handleSessionPress}
    >
      <View style={styles.cardContent}>
        {/* Left: Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${getSubjectColor(session.subject)}15` },
          ]}
        >
          <Ionicons
            name={getSubjectIcon(session.subject)}
            size={24}
            color={getSubjectColor(session.subject)}
          />
        </View>

        {/* Middle: Session Info */}
        <View style={styles.sessionInfo}>
          <Text style={styles.className}>{session.className}</Text>
          <View style={styles.metaInfo}>
            <Text style={styles.date}>{session.date}</Text>
            <Text style={styles.separator}>at</Text>
            <Text style={styles.time}>{session.time}</Text>
          </View>
          <View style={styles.attendanceContainer}>
            <Ionicons name="people" size={14} color={COLORS.GRAY_500} />
            <Text style={styles.attendance}>{session.attendance} present</Text>
          </View>
        </View>

        {/* Right: Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, styles.completedBadge]}>
            <Text style={styles.statusText}>Done</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  sessionsList: {
    gap: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.GRAY_500,
    marginTop: 12,
  },
  card: {
    backgroundColor: COLORS.BACKGROUND_WHITE,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  separator: {
    fontSize: 13,
    color: COLORS.GRAY_400,
    marginHorizontal: 6,
  },
  time: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
  },
  attendanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  attendance: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  statusContainer: {
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  completedBadge: {
    backgroundColor: "#D1FAE5",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#065F46",
  },
});
