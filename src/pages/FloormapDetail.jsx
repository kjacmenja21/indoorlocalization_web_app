import React, { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {FloorMapService} from "../services/floormapService.js";
import AssetSimulationService from "../services/assetSimulationService.js";

function FloormapDetail() {
    const { floormapId } = useParams();
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
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
        <div>
            <h2>Floormap Detail for {floormapId}</h2>
            <div
                style={{
                    position: "relative",
                    width: `${floormapWidth}px`,
                    height: `${floormapHeight}px`,
                    border: "1px solid black",
                    backgroundImage: `url('/mnt/data/image.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
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
                    ></div>
                ))}
            </div>
            <button onClick={handleDeleteClick}>Delete Floor Map</button>
            <Link to={`/zone-editing/${floormapId}`} style={{ marginLeft: "10px" }}>
                <button>Edit Zones</button>
            </Link>
        </div>
    );
}

export default FloormapDetail;
