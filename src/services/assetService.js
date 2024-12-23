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
       }/*
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return {
            data: assetList.slice(startIndex, endIndex),
            total: assetList.length,
        };*/
    },

    updateAsset: async (assetId, updatedData) => {
        /*
        try{
            const response = await axiosInstance.put('API_PATHS.ASSETS_PUT/${assetId}', updatedData);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update assets';
            console.error(`Error fetching assets: ${errorMessage}`);
        }*/
        const assetIndex = assetList.findIndex(asset => asset.id === assetId);
        if (assetIndex === -1) {
            throw new Error(`Asset with ID ${assetId} not found.`);
        }
        // Merge existing asset with updated data
        assetList[assetIndex] = { ...assetList[assetIndex], ...updatedData };
        return assetList[assetIndex];
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
        /*
                    try {
                    const response = await axiosInstance.post(`${API_PATHS.ASSETS_POST}`, { asset: newAsset });
                    return response.data;
                } catch (error) {
                    const errorMessage = error.response?.data?.message || error.message || 'Failed to create project';
                    console.error(`Error creating project for course ${courseId}: ${errorMessage}`);
                    throw new Error(errorMessage);
                }*/

            const newId = assetList.length ? Math.max(...assetList.map(asset => asset.id)) + 1 : 1;  // Auto-generate ID
            const assetWithId = { ...newAsset, id: newId, lastSync: new Date().toISOString() }; // Add ID and lastSync
            console.log("Lista prije dodavanja:", assetList);
            assetList.push(assetWithId);
            console.log("Added asset:", assetWithId);
            console.log("Lista poslije dodavanja:", assetList);
            return assetWithId;  // Return the newly added asset */
        } catch (error) {
            console.error("Error adding asset:", error.message);
        }
    },
};
