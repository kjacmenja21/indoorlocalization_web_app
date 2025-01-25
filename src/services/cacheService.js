// ./services/cacheService.js
class CacheService {
    constructor() {
        this.cache = {
            floormaps: null,
            assets: null,
            zones: null,
        };
        this.refreshPromises = {
            floormaps: null,
            assets: null,
            zones: null,
        };
    }

    // Fetch data and cache it
    async fetchAndCache(entity, fetchFunction) {
        if (!this.cache[entity]) {
            if (!this.refreshPromises[entity]) {
                this.refreshPromises[entity] = fetchFunction()
                    .then((data) => {
                        this.cache[entity] = data;
                        this.refreshPromises[entity] = null; // Reset promise
                        return data;
                    })
                    .catch((err) => {
                        this.refreshPromises[entity] = null; // Reset promise on error
                        throw err;
                    });
            }
            return this.refreshPromises[entity];
        }
        return Promise.resolve(this.cache[entity]);
    }

    // Update cache for a specific entity
    updateCache(entity, newItem, mergeStrategy) {
        if (!(entity in this.cache)) {
            throw new Error(`Entity "${entity}" is not a valid cache key.`);
        }

        const currentCache = this.cache[entity];

        if (!currentCache) {
            // If no cache exists, set it to the new item
            this.cache[entity] = Array.isArray(newItem) ? [...newItem] : { ...newItem };
        } else if (Array.isArray(currentCache)) {
            // Default behavior for arrays: append the new item(s)
            this.cache[entity] = [...currentCache, ...(Array.isArray(newItem) ? newItem : [newItem])];
        } else if (typeof currentCache === "object" && typeof newItem === "object") {
            // Default behavior for objects: shallow merge
            this.cache[entity] = {
                ...currentCache,
                ...newItem,
            };
        } else if (mergeStrategy && typeof mergeStrategy === "function") {
            // Use custom merge strategy if provided
            this.cache[entity] = mergeStrategy(currentCache, newItem);
        } else {
            throw new Error(`Unable to update cache for entity "${entity}" with incompatible types.`);
        }
    }

    // Clear specific cache
    clearCache(entity) {
        if (entity in this.cache) {
            this.cache[entity] = null;
        }
    }

    // Clear all caches
    clearAllCaches() {
        Object.keys(this.cache).forEach((entity) => {
            this.cache[entity] = null;
        });
    }
}

export const cacheService = new CacheService();
