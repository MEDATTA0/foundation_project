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
  ABOUT: "/about",
  PRODUCT: "/product",
  PRICING: "/pricing",
};

// Bottom Navigation Tabs
export const NAVIGATION_TABS = [
  {
    href: "/home",
    label: "Home",
    icon: "🏠",
  },
  {
    href: "/about",
    label: "Students",
    icon: "👤",
  },
  {
    href: "/product",
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
