import axiosInstance from "../core/interceptor/interceptor.js";
import {API_PATHS} from "../consts/api-paths.js";

let assetList = [
    {
        id: 1,
        name: 'Asset 1',
        x: 10,
        y: 20,
        lastSync: new Date().toISOString(),
        floorMapId: 1,
        floorMapName: 'FloorMap 1',
    },
    {
        id: 2,
        name: 'Asset 2',
        x: 15,
        y: 25,
        lastSync: new Date().toISOString(),
        floorMapId: 1,
        floorMapName: 'FloorMap 1',
    },
    {
        id: 3,
        name: 'Asset 3',
        x: 20,
        y: 30,
        lastSync: new Date().toISOString(),
        floorMapId: 1,
        floorMapName: 'FloorMap 1',
    },
    {
        id: 4,
        name: 'Asset 4',
        x: 25,
        y: 35,
        lastSync: new Date().toISOString(),
        floorMapId: 1,
        floorMapName: 'FloorMap 1',
    },
    {
        id: 5,
        name: 'Asset 5',
        x: 30,
        y: 40,
        lastSync: new Date().toISOString(),
        floorMapId: 1,
        floorMapName: 'FloorMap 1',
    },
];
export const AssetService = {
    getAssetById: async (assetId) => {

        try{
            const response = await axiosInstance.get(`${API_PATHS.ASSETS_GET_BY_ID}/${assetId}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch asset';
            console.error(`Error fetching asset ${assetId}: ${errorMessage}`);
        }/*
        return assetList.find(asset => asset.id === assetId);*/
    },

    getAllAssets: async () => {
        /*
        try{
            const response = await axiosInstance.get(API_PATHS.ASSETS_GET_ALL);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch assets';
            console.error(`Error fetching assets: ${errorMessage}`);
        }*/
        return assetList;
    },

    getPaginatedAssets: async (page = 1, itemsPerPage = 5) => {

       try{
           const response = await axiosInstance.get(API_PATHS.ASSETS_GET_ALL, {
                params: {
                    page: page,
                    limit: itemsPerPage,
                },
            });
           return response.data;
       } catch (error) {
           const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch assets';
           console.error(`Error fetching assets: ${errorMessage}`);
       }
    },

    updateAsset: async (assetId, updatedAsset) => {
        try {
            const response = await axiosInstance.put(
                `${API_PATHS.ASSETS_UPDATE}/${assetId}`,
                updatedAsset
            );
            return response.data; // Successful response
        } catch (error) {
            const errorMessage = error.response?.data?.detail || error.message || 'Failed to update asset';
            console.error(`Error updating asset: ${errorMessage}`);
            throw new Error(errorMessage); // Re-throw the error for further handling
        }
    },

    deleteAsset: async (assetId) => {
        /*
       try{
           const response = await axiosInstance.delete('API_PATHS.ASSETS_DELETE/${assetId}');
           return response.data;
       } catch (error) {
           const errorMessage = error.response?.data?.message || error.message || 'Failed to delete assets';
           console.error(`Error fetching assets: ${errorMessage}`);
       }*/
        const assetIndex = assetList.findIndex(asset => asset.id === assetId);
        if (assetIndex === -1) {
            throw new Error(`Asset with ID ${assetId} not found.`);
        }
        // Remove asset from the list
        const deletedAsset = assetList.splice(assetIndex, 1)[0];
        return deletedAsset;
    },

    addAsset: async (newAsset) => {
        try {
            const response = await axiosInstance.post(API_PATHS.ASSETS_POST, newAsset);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add asset';
            console.error(`Error adding asset: ${errorMessage}`);
            throw new Error(errorMessage);
        }
    },
};
