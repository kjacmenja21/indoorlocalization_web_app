import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FloorMapService } from "../services/floormapService.js";
import AssetSimulationService from "../services/assetSimulationService.js";

function FloormapDetail() {
    const { floormapId } = useParams();
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const [activeAsset, setActiveAsset] = useState(null); // Track the clicked asset
    const floormapWidth = 500; // Image width
    const floormapHeight = 300; // Image height
    const movementSpeed = 5; // Speed of asset movement (in pixels)

    useEffect(() => {
        const simulationService = new AssetSimulationService(floormapId, floormapWidth, floormapHeight, movementSpeed);

        // Start simulation and update assets
        simulationService.startSimulation(setAssets);

        // Cleanup on component unmount
        return () => {
            simulationService.stopSimulation();
        };
    }, [floormapId]);

    const handleDeleteClick = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this floor map?"
        );
        if (confirmed) {
            try {
                await FloorMapService.deleteFloorMap(floormapId);
                alert("Floor map deleted successfully!");
                navigate("/home");
            } catch (error) {
                alert("Failed to delete floor map. Please try again.");
            }
        }
    };

    return (
        <div className="floormap-detail">
            <h2>Floormap Detail for {floormapId}</h2>
            <div
                className="floormap-container"
                style={{
                    backgroundImage: `url('/mnt/data/image.png')`,
                    width: `${floormapWidth}px`,
                    height: `${floormapHeight}px`,
                }}
            >
                {assets.map((asset) => (
                    <div
                        key={asset.id}
                        style={{
                            position: "absolute",
                            top: `${asset.y}px`,
                            left: `${asset.x}px`,
                            width: "10px",
                            height: "10px",
                            backgroundColor: "red",
                            borderRadius: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                        title={`Asset ID: ${asset.id}, FloorMap ID: ${asset.floormapId}`}
                        onClick={() => setActiveAsset(asset)}
                    >
                        <div className="name-tag">{asset.id}</div>

                    </div>
                ))}

            </div>

            {activeAsset && (
                <div className="dialog">
                    <h3>Asset Details</h3>
                    <p>ID: {activeAsset.id}</p>
                    <p>X: {activeAsset.x}</p>
                    <p>Y: {activeAsset.y}</p>
                    <p>FloorMap ID: {activeAsset.floormapId}</p>
                    <button onClick={() => setActiveAsset(null)}>Close</button>
                </div>
            )}

            <button onClick={handleDeleteClick}>Delete Floor Map</button>
            <Link to={`/zone-editing/${floormapId}`} style={{marginLeft: "10px"}}>
                <button>Edit Zones</button>
            </Link>
        </div>

    );
}

export default FloormapDetail;
