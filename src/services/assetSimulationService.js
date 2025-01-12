class AssetSimulationService {
    constructor(floormapId, floormapWidth, floormapHeight, movementSpeed) {
        this.floormapId = floormapId;
        this.floormapWidth = floormapWidth;
        this.floormapHeight = floormapHeight;
        this.movementSpeed = movementSpeed;
        this.assets = this.generateAssets(floormapId);
        this.animationFrameId = null;
        this.callback = null;
    }

    generateAssets(floormapId) {
        let assets = [];
        if (floormapId === "1") {
            assets = [
                { id: 1, x: 50, y: 50, direction: 1 },
                { id: 2, x: 100, y: 150, direction: 1 },
                { id: 3, x: 200, y: 100, direction: 1 },
            ];
        } else if (floormapId === "2") {
            assets = [
                { id: 4, x: 100, y: 50, direction: 1 },
                { id: 5, x: 150, y: 200, direction: 1 },
                { id: 6, x: 250, y: 150, direction: 1 },
            ];
        }
        return assets;
    }

    updatePositions() {
        this.assets = this.assets.map((asset) => {
            let newX = asset.x + this.movementSpeed * asset.direction;

            if (newX <= 0 || newX >= this.floormapWidth - 10) {
                asset.direction *= -1;
                newX = Math.min(Math.max(newX, 0), this.floormapWidth - 10);
            }

            return { ...asset, x: newX };
        });

        if (this.callback) {
            this.callback(this.assets); // Update the React state
        }

        this.animationFrameId = requestAnimationFrame(() => this.updatePositions());
    }

    startSimulation(callback) {
        this.callback = callback;
        this.animationFrameId = requestAnimationFrame(() => this.updatePositions());
    }

    stopSimulation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

export default AssetSimulationService;
