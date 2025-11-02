import { useAuthStore } from "../stores/authStore";

/**
 * useAuth Hook
 * Convenience hook for accessing authentication state and actions
 */
export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    setUser,
    setToken,
    login,
    logout,
    setLoading,
    updateUser,
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    setUser,
    setToken,
    login,
    logout,
    setLoading,
    updateUser,
  };
}
