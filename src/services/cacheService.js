class CacheService {
    constructor() {
        this.cache = {
            floormaps: {},  // Floormaps cached by ID
            assets: {},      // Assets cached by ID
            zones: {},       // Zones cached by ID
        };
        this.refreshPromises = {
            floormaps: null,
            assets: null,
            zones: null,
        };
    }

    // Fetch specific entity by ID and cache it
    async fetchAndCache(entity, fetchFunction, id = null) {
        console.log("Fetch and cache: ",entity)
        if (entity === 'floormaps' && id) {
            console.log("Unutar floormapsa")
            if (!this.cache.floormaps[id]) {
                if (!this.refreshPromises.floormaps) {
                    this.refreshPromises.floormaps = fetchFunction(id)
                        .then((data) => {
                            this.cache.floormaps[id] = data;
                            this.refreshPromises.floormaps = null; // Reset promise
                            return data;
                        })
                        .catch((err) => {
                            this.refreshPromises.floormaps = null; // Reset promise on error
                            throw err;
                        });
                }
                return this.refreshPromises.floormaps;
            }
            return Promise.resolve(this.cache.floormaps[id]);
        }

        if (entity === 'assets' && id) {
            if (!this.cache.assets[id]) {
                if (!this.refreshPromises.assets) {
                    this.refreshPromises.assets = fetchFunction(id)
                        .then((data) => {
                            this.cache.assets[id] = data;
                            this.refreshPromises.assets = null; // Reset promise
                            return data;
                        })
                        .catch((err) => {
                            this.refreshPromises.assets = null; // Reset promise on error
                            throw err;
                        });
                }
                return this.refreshPromises.assets;
            }
            return Promise.resolve(this.cache.assets[id]);
        }

        if (entity === 'zones' && id) {
            if (!this.cache.zones[id]) {
                if (!this.refreshPromises.zones) {
                    this.refreshPromises.zones = fetchFunction(id)
                        .then((data) => {
                            this.cache.zones[id] = data;
                            this.refreshPromises.zones = null; // Reset promise
                            return data;
                        })
                        .catch((err) => {
                            this.refreshPromises.zones = null; // Reset promise on error
                            throw err;
                        });
                }
                return this.refreshPromises.zones;
            }
            return Promise.resolve(this.cache.zones[id]);
        }
        console.log("this.cache[entity] === null: ", this.cache[entity] === null)
        console.log("this.cache[entity]: ", this.cache[entity])
        if (this.cache[entity] === null || (typeof this.cache[entity] === 'object' && Object.keys(this.cache[entity]).length === 0)) {
            console.log("Ne postoji cache za entity: ", entity);

            if (!this.refreshPromises[entity]) {
                this.refreshPromises[entity] = fetchFunction()
                    .then((data) => {
                        this.cache[entity] = data;
                        this.refreshPromises[entity] = null; // Reset promise
                        console.log("Unutar cache: ", data);
                        return data;
                    })
                    .catch((err) => {
                        this.refreshPromises[entity] = null; // Reset promise on error
                        throw err;
                    });
            }
            return this.refreshPromises[entity];
        }

        console.log("Vracam cache: ", this.cache[entity]); // Ovo se neće preskočiti
        return Promise.resolve(this.cache[entity]);
    }

    // Update cache for a specific entity by ID
    updateCache(entity, newItem, mergeStrategy, id = null) {
        if (entity === 'floormaps' && id) {
            if (!this.cache.floormaps) {
                this.cache.floormaps = {};
            }

            const currentCache = this.cache.floormaps[id];

            if (!currentCache) {
                this.cache.floormaps[id] = { ...newItem };
            } else {
                this.cache.floormaps[id] = mergeStrategy ? mergeStrategy(currentCache, newItem) : { ...currentCache, ...newItem };
            }
        } else if (entity === 'assets' && id) {
            if (!this.cache.assets) {
                this.cache.assets = {};
            }

            const currentCache = this.cache.assets[id];

            if (!currentCache) {
                this.cache.assets[id] = { ...newItem };
            } else {
                this.cache.assets[id] = mergeStrategy ? mergeStrategy(currentCache, newItem) : { ...currentCache, ...newItem };
            }
        } else if (entity === 'zones' && id) {
            if (!this.cache.zones) {
                this.cache.zones = {};
            }

            const currentCache = this.cache.zones[id];

            if (!currentCache) {
                this.cache.zones[id] = { ...newItem };
            } else {
                this.cache.zones[id] = mergeStrategy ? mergeStrategy(currentCache, newItem) : { ...currentCache, ...newItem };
            }
        } else {
            if (!(entity in this.cache)) {
                throw new Error(`Entity "${entity}" is not a valid cache key.`);
            }

            const currentCache = this.cache[entity];

            if (!currentCache) {
                this.cache[entity] = Array.isArray(newItem) ? [...newItem] : { ...newItem };
            } else if (Array.isArray(currentCache)) {
                this.cache[entity] = [...currentCache, ...(Array.isArray(newItem) ? newItem : [newItem])];
            } else if (typeof currentCache === "object" && typeof newItem === "object") {
                this.cache[entity] = { ...currentCache, ...newItem };
            } else if (mergeStrategy && typeof mergeStrategy === "function") {
                this.cache[entity] = mergeStrategy(currentCache, newItem);
            } else {
                throw new Error(`Unable to update cache for entity "${entity}" with incompatible types.`);
            }
        }
    }

    // Clear specific cache by ID
    clearCache(entity, id = null) {
        if (entity in this.cache) {
            if (id) {
                if (entity === 'floormaps') {
                    delete this.cache.floormaps[id];
                } else if (entity === 'assets') {
                    delete this.cache.assets[id];
                } else if (entity === 'zones') {
                    delete this.cache.zones[id];
                }
            } else {
                this.cache[entity] = null;
            }
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
