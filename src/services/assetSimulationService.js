
import { mqttService } from "./mqttService";

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

    updatePosition(position) {

        if(position.floorMap != this.floormapId) {
            return;
        }
        
        this.assets = this.assets.map((asset) => {
            if(asset.id == position.id) {
                let x = Math.max(0, Math.min(position.x, this.floormapWidth));
                let y = Math.max(0, Math.min(position.y, this.floormapWidth));
                return { ...asset, x: x, y: y };
            }

            return { ...asset };
        });

        if (this.callback) {
            this.callback(this.assets); // Update the React state
        }

    }

    startSimulation(callback) {
        this.callback = callback;
        mqttService.addListener((data) => {
            this.updatePosition(JSON.parse(data));
        });
        mqttService.connect();
    }

    stopSimulation() {
        mqttService.disconnect();
    }
}

export default AssetSimulationService;
