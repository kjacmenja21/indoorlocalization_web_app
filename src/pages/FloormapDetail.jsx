import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import {FloorMapService} from "../services/floormapService.js";

function FloormapDetail() {
    const { floormapId } = useParams();
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const floormapWidth = 500; // Image width
    const floormapHeight = 300; // Image height
    const movementSpeed = 5; // Speed of asset movement (in pixels)

    useEffect(() => {
        // Generate assets based on floormapId
        const generateAssets = (floormapId) => {
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

            // Return assets with the floormap ID attached
            return assets.map((asset) => ({
                ...asset,
                floormapId: parseInt(floormapId),
            }));
        };

        // Initialize the assets based on the floormapId
        const initialAssets = generateAssets(floormapId);
        setAssets(initialAssets);

        // Function to simulate asset movement
        const moveAssets = () => {
            setAssets((prevAssets) => {
                return prevAssets.map((asset) => {
                    // Random movement in both x and y directions
                    const newX = asset.x + (Math.random() * movementSpeed * 2 - movementSpeed);
                    const newY = asset.y + (Math.random() * movementSpeed * 2 - movementSpeed);

                    // Ensure assets stay within the bounds of the floormap
                    const clampedX = Math.min(Math.max(newX, 0), floormapWidth - 10); // 10px for the asset size
                    const clampedY = Math.min(Math.max(newY, 0), floormapHeight - 10); // 10px for the asset size

                    return {
                        ...asset,
                        x: clampedX,
                        y: clampedY,
                    };
                });
            });
        };

        // Set an interval to move assets every 100ms
        const intervalId = setInterval(moveAssets, 100);

        // Cleanup on component unmount
        return () => clearInterval(intervalId);
    }, [floormapId]);

    const handleDeleteClick = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this floor map?"
        );
        if (confirmed) {
            try {
                await FloorMapService.deleteFloorMap(floormapId);
                alert("Floor map deleted successfully!");
                navigate("/home");  // Navigate to the HomePage after deletion
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
                    backgroundImage: `url('/mnt/data/image.png')`, // Background image path
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Render assets */}
                {assets.map((asset) => (
                    <div
                        key={asset.id}
                        style={{
                            position: "absolute",
                            top: `${asset.y}px`,  // Directly use asset's y position
                            left: `${asset.x}px`, // Directly use asset's x position
                            width: "10px",
                            height: "10px",
                            backgroundColor: "red",
                            borderRadius: "50%",
                            transform: "translate(-50%, -50%)", // Centers the asset
                        }}
                        title={`Asset ID: ${asset.id}, FloorMap ID: ${asset.floormapId}`}
                    ></div>
                ))}
            </div>
            <button onClick={handleDeleteClick}>Delete Floor Map</button>
        </div>
    );
}

export default FloormapDetail;
