import axiosInstance from "../core/interceptor/interceptor.js";
import { API_PATHS } from "../consts/api-paths.js";

let floorMapList = [
    {
        id: 1,
        name: 'FloorMap 1',
        image: 'https://via.placeholder.com/150', // Placeholder image URL
        tx: 100,
        ty: 200,
    },
    {
        id: 2,
        name: 'FloorMap 2',
        image: 'https://via.placeholder.com/150',
        tx: 150,
        ty: 300,
    },
    {
        id: 3,
        name: 'FloorMap 3',
        image: 'https://via.placeholder.com/150',
        tx: 200,
        ty: 400,
    },
    {
        id: 4,
        name: 'FloorMap 4',
        image: 'https://via.placeholder.com/150',
        tx: 250,
        ty: 500,
    },
    {
        id: 5,
        name: 'FloorMap 5',
        image: 'https://via.placeholder.com/150',
        tx: 300,
        ty: 600,
    },
];

export const FloorMapService = {
    getFloorMapById: async (floorMapId) => {
        try {
            const response = await axiosInstance.get(`${API_PATHS.FLOORMAPS_GET_BY_ID}${floorMapId}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch floor map';
            console.error(`Error fetching floor map by ID (${floorMapId}): ${errorMessage}`);
            throw new Error(errorMessage);
        }
    },

    getFloorMapName: async (floorMapId) => {
        try {
            const floorMap = await this.getFloorMapById(floorMapId);
            return floorMap.name;
        } catch (error) {
            console.error(`Error fetching floor map name: ${error.message}`);
            return "Unknown Floor";
        }
    },

    getAllFloorMaps: async () => {
        try {
            // Fetch the first page to get total_pages
            const firstResponse = await axiosInstance.get(API_PATHS.FLOORMAPS_GET_ALL, {
                params: { page: 1, limit: 10 },
            });

            const { total_pages } = firstResponse.data;
            let allFloorMaps = [...firstResponse.data.page];

            if (total_pages > 1) {
                const pageRequests = [];
                for (let page = 2; page <= total_pages; page++) {
                    pageRequests.push(
                        axiosInstance.get(API_PATHS.FLOORMAPS_GET_ALL, {
                            params: { page, limit: 10 },
                        })
                    );
                }

                const otherPages = await Promise.all(pageRequests);

                otherPages.forEach((response) => {
                    allFloorMaps = [...allFloorMaps, ...response.data.page];
                });
            }

            return allFloorMaps;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch floormaps";
            console.error(`Error fetching floormaps: ${errorMessage}`);
            throw new Error(errorMessage);
        }
    },

    addFloorMap: async (newFloorMapData, imageFile) => {
        try {
            const formData = new FormData();
            formData.append("image", imageFile); // Append the image
            formData.append("floormap_data", JSON.stringify(newFloorMapData)); // Append the floor map data

            const response = await axiosInstance.post(API_PATHS.FLOORMAPS_POST, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to add floor map";
            console.error(`Error adding floor map: ${errorMessage}`);
            throw new Error(errorMessage);
        }
    },


    deleteFloorMap: async (floorMapId) => {
        /* Simulated backend call
        try {
            const response = await axiosInstance.delete(`${API_PATHS.FLOORMAPS_DELETE}/${floorMapId}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete floor map';
            console.error(`Error deleting floor map: ${errorMessage}`);
        }
        */
        const floorMapIndex = floorMapList.findIndex(floorMap => floorMap.id === floorMapId);
        if (floorMapIndex === -1) {
            throw new Error(`Floor map with ID ${floorMapId} not found.`);
        }
        const deletedFloorMap = floorMapList.splice(floorMapIndex, 1)[0];
        return deletedFloorMap;
    },
};
