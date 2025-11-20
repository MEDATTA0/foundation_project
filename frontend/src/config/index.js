/**
 * Application Configuration
 */

export const config = {
  api: {
    baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api",
    timeout: 30000,
  },
  app: {
    name: "Classroom Connect",
    version: "1.0.0",
  },
  storage: {
    authKey: "auth-storage",
  },
};
