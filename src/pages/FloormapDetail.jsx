import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AssetSimulationService from "../services/assetSimulationService.js";
import {FloorMapService} from "../services/floormapService.js";

function FloormapDetail() {
    const { floormapId } = useParams();
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const [activeAsset, setActiveAsset] = useState(null);
    const [zoom, setZoom] = useState(1); // Zoom level
    const [position, setPosition] = useState({ x: 0, y: 0 }); // Pan position
    const [isDragging, setIsDragging] = useState(false); // Drag state
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // Drag start position

    useEffect(() => {
        FloorMapService.getFloorMapById(floormapId).then((floormap) => {
            if (!floormap) {
                navigate("/floormaps");
                return;
            }
            let assetSimulationService = new AssetSimulationService(floormapId, floormap.width, floormap.height, 5);
            assetSimulationService.startSimulation(setAssets);
        });

    }, []);

    const handleZoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3)); // Max zoom: 3x
    const handleZoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Min zoom: 0.5x

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            className="floormap-detail"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Stops dragging if the user leaves the viewport
            style={{ userSelect: "none", overflow: "hidden" }} // Disable text selection while dragging
        >
            <h2>Floormap Detail for {floormapId}</h2>
            <div style={{ marginBottom: "10px" }}>
                <button onClick={handleZoomIn}>Zoom In (+)</button>
                <button onClick={handleZoomOut} style={{ marginLeft: "5px" }}>
                    Zoom Out (-)
                </button>
            </div>
            <div
                className="floormap-container"
                style={{
                    width: "800px",
                    height: "600px",
                    overflow: "hidden",
                    position: "relative",
                    border: "1px solid #ccc",
                    cursor: isDragging ? "grabbing" : "grab",
                }}
                onMouseDown={handleMouseDown}
            >
                <img
                    src="https://fapa.jp/fair-2014/wp-content/uploads/2015/05/floormap_16.svg"
                    alt="Floor Map"
                    draggable={false} // Prevent default image dragging
                    style={{
                        position: "absolute",
                        top: position.y,
                        left: position.x,
                        transform: `scale(${zoom})`,
                        transformOrigin: "center",
                        cursor: "move",
                    }}
                />
                {assets.map((asset) => (
                    <div
                        key={asset.id}
                        className="asset"
                        style={{
                            position: "absolute",
                            top: `${asset.y * zoom + position.y}px`,
                            left: `${asset.x * zoom + position.x}px`,
                            width: "10px",
                            height: "10px",
                            backgroundColor: "red",
                            borderRadius: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                        title={`Asset ID: ${asset.id}, FloorMap ID: ${floormapId}`}
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
                    <p>FloorMap ID: {floormapId}</p>
                    <button onClick={() => setActiveAsset(null)}>Close</button>
                </div>
            )}
            <Link to={`/zone-editing/${floormapId}`} style={{ marginTop: "10px" }}>
                <button>Edit Zones</button>
            </Link>
        </div>
    );
}

export default FloormapDetail;
