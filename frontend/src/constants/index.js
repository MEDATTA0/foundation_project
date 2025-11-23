export * from "./theme";

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/update",
  },
  DASHBOARD: "/dashboard",
  STUDENTS: {
    LIST: "/students",
    CREATE: "/students",
    GET: (id) => `/students/${id}`,
    UPDATE: (id) => `/students/${id}`,
    DELETE: (id) => `/students/${id}`,
  },
  CLASSES: {
    LIST: "/classes",
    CREATE: "/classes",
    GET: (id) => `/classes/${id}`,
    UPDATE: (id) => `/classes/${id}`,
    DELETE: (id) => `/classes/${id}`,
  },
  ENROLLMENTS: {
    CREATE: "/enrollments",
    LIST: "/enrollments",
    DELETE: (id) => `/enrollments/${id}`,
  },
};

// App Configuration
export const APP_CONFIG = {
  NAME: "ACME",
  VERSION: "1.0.0",
  API_TIMEOUT: 30000,
};

// Navigation Routes
export const ROUTES = {
  SPLASH: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  HOME: "/home",
};

// Bottom Navigation Tabs
export const NAVIGATION_TABS = [
  {
    href: "/home",
    label: "Home",
    icon: "🏠",
  },
  {
    href: "/students",
    label: "Students",
    icon: "👤",
  },
  {
    href: "/resources",
    label: "Resources",
    icon: "📚",
  },
  {
    href: "/classrooms",
    label: "Classrooms",
    icon: "🏫",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: "⚙️",
  },
];
