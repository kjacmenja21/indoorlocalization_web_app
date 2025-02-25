import axiosInstance from "../../core/interceptor/interceptor";
import { API_PATHS } from "../../consts/api-paths";

export const AuthService = {
  login: async (username, password) => {
    try {
      let data = {
        username: username,
        password: password,
      };
      const response = await axiosInstance.post(
        API_PATHS.LOGIN,
        new URLSearchParams(data)
      );
      console.log("response: ", response);
      if (
        response.data &&
        response.data.access_token &&
        response.data.refresh_token
      ) {
        console.log("response: ", response);
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refresh-token", response.data.refresh_token);
        localStorage.setItem("currentUser", JSON.stringify(response.data));

        return response.data;
      }
      throw new Error("Login failed: No tokens returned from server");
    } catch (error) {
        localStorage.setItem("accessToken", "test");
        localStorage.setItem("refreshToken", "test");
        localStorage.setItem("currentUser", JSON.stringify({role: "admin"}));
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

  logout: async () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("currentUser");
      //TODO: Remove danje linije kad se popravi refresh token
      try {
        let data = {
          username: 'admin',
          password: 'admin_password',
        };
        const response = await axiosInstance.post(
            API_PATHS.LOGIN,
            new URLSearchParams(data)
        );
        console.log("response: ", response);
        if (
            response.data &&
            response.data.access_token &&
            response.data.refresh_token
        ) {
          console.log("response: ", response);
          localStorage.setItem("accessToken", response.data.access_token);
          localStorage.setItem("refresh-token", response.data.refresh_token);
          localStorage.setItem("currentUser", JSON.stringify(response.data));

          return response.data;
        }
        throw new Error("Login failed: No tokens returned from server");
      } catch (error) {
        //TODO: Remove, ovo je jos dok ne mozemo napravit poziv za login
        console.log("Login failed: No tokens returned from server");
        /*localStorage.setItem("accessToken", "test");
          localStorage.setItem("refreshToken", "test");
          localStorage.setItem("currentUser", JSON.stringify({role: "admin"}));*/
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred";
        throw new Error(`Login failed: ${errorMessage}`);
      }
      //===========================
      //window.location.href = "/login";
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
