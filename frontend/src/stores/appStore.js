import { create } from "zustand";

/**
 * Application Store
 * Manages global application state (theme, notifications, dashboard, etc.)
 */
export const useAppStore = create((set, get) => ({
  // State
  theme: "light",
  isLoading: false,
  error: null,
  notifications: [],
  dashboard: {
    students: 0,
    resources: 0,
    classrooms: 0,
    recentSessions: [],
  },
  isDashboardLoading: false,
  dashboardError: null,
  students: [],
  isStudentsLoading: false,
  studentsError: null,

  // Actions
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),

  // Dashboard Actions
  setDashboard: (dashboardData) => set({ dashboard: dashboardData }),
  setDashboardLoading: (isLoading) => set({ isDashboardLoading: isLoading }),
  setDashboardError: (error) => set({ dashboardError: error }),
  clearDashboardError: () => set({ dashboardError: null }),

  // Students Actions
  setStudents: (studentsData) => set({ students: studentsData }),
  setStudentsLoading: (isLoading) => set({ isStudentsLoading: isLoading }),
  setStudentsError: (error) => set({ studentsError: error }),
  clearStudentsError: () => set({ studentsError: null }),
}));
