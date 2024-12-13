import axios from "axios";
import { environment } from "../../consts/envierment-prod.js";
import { AuthService } from "../../services/auth/authService.js";
const apiUrl = environment.apiUrl;

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
      config.headers.contentType = "application/x-www-form-urlencoded";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const tokens = await AuthService.refreshToken();
        axiosInstance.defaults.headers.common[
          "authorization"
        ] = `Bearer ${tokens.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        AuthService.logout();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
