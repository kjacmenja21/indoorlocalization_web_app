import axiosInstance from "../core/interceptor/interceptor.js";
import { API_PATHS } from "../consts/api-paths.js";

export const ZoneService = {
    addZone: async (zone) => {
        try {
            const response = await axiosInstance.post(API_PATHS.ZONES, zone);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to add zone";
            console.error(`Error adding zone: ${errorMessage}`);
        }
    },

    getZones: async (floormapId) => {
        try {
            const response = await axiosInstance.get(`${API_PATHS.ZONES}?floorMapId=${floormapId}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch zones";
            console.error(`Error fetching zones: ${errorMessage}`);
        }
    },

    deleteZone: async (zoneId) => {
        try {
            const response = await axiosInstance.delete(`${API_PATHS.ZONES}${zoneId}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to delete zone";
            console.error(`Error deleting zone: ${errorMessage}`);
        }
    },
};
