import axiosInstance from "../interceptor/interceptor";
import { API_PATHS } from "../../consts/api-paths";

export const AuthService = {
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post(API_PATHS.LOGIN, {
        username,
        password,
      });
      if (response.data && response.data.tokens) {
        localStorage.setItem("accessToken", response.data.tokens.accessToken);
        localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
        localStorage.setItem("currentUser", JSON.stringify(response.data.user));

        return response.data;
      }
      throw new Error("Login failed: No tokens returned from server");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      throw new Error(`Login failed: ${errorMessage}`);
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("currentUser");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error(
        "Error retrieving current user from localStorage:",
        error.message
      );
      return null;
    }
  },

  getUserRole: () => {
    const user = AuthService.getCurrentUser();
    return user ? user.role : null;
  },

  logout: () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token found");

      const response = await axiosInstance.post(API_PATHS.REFRESH_TOKEN, {
        refreshToken,
      });
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      throw new Error(`Error refreshing token: ${errorMessage}`);
    }
  },

  isAdmin: () => {
    return AuthService.getUserRole() === "admin";
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },
};
