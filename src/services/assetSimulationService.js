class AssetSimulationService {
    constructor(floormapId, floormapWidth, floormapHeight, movementSpeed) {
        this.floormapId = floormapId;
        this.floormapWidth = floormapWidth;
        this.floormapHeight = floormapHeight;
        this.movementSpeed = movementSpeed;
        this.assets = this.generateAssets(floormapId);
        this.intervalId = null;
    }

    generateAssets(floormapId) {
        let assets = [];
        if (floormapId === "1") {
            assets = [
                { id: 1, x: 50, y: 50 },
                { id: 2, x: 100, y: 150 },
                { id: 3, x: 200, y: 100 },
            ];
        } else if (floormapId === "2") {
            assets = [
                { id: 4, x: 100, y: 50 },
                { id: 5, x: 150, y: 200 },
                { id: 6, x: 250, y: 150 },
            ];
        }
        return assets.map((asset) => ({
            ...asset,
            floormapId: parseInt(floormapId),
        }));
    }

    startSimulation(callback) {
        this.intervalId = setInterval(() => {
            this.assets = this.assets.map((asset) => {
                const newX = asset.x + (Math.random() * this.movementSpeed * 2 - this.movementSpeed);
                const newY = asset.y + (Math.random() * this.movementSpeed * 2 - this.movementSpeed);
                return {
                    ...asset,
                    x: Math.min(Math.max(newX, 0), this.floormapWidth - 10),
                    y: Math.min(Math.max(newY, 0), this.floormapHeight - 10),
                };
            });
            callback(this.assets);
        }, 100);
    }

    stopSimulation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}

export default AssetSimulationService;
