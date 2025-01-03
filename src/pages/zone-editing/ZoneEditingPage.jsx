import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stage, Layer, Rect } from "react-konva";
import { FloorMapService } from "../../services/floormapService.js";
import "../_pages.scss";
import ZoneStage from "./ZoneStage";
import ZoneMenu from "./ZoneMenu.jsx";


function ZoneEditing() {
    const { floormapId } = useParams();
    const [floormap, setFloormap] = useState({});
    const [zones, setZones] = useState([]);
    const [newZone, setNewZone] = useState(null);
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [zoneName, setZoneName] = useState("");
    const [zoneNameError, setZoneNameError] = useState(false);
    const [isFinishedDrawing, setIsFinishedDrawing] = useState(false);
    const containerRef = useRef();

    useEffect(() => {
        FloorMapService.getFloorMapById(floormapId)
            .then((floormap) => {
                console.log(`Fetched floormap details for ID ${floormapId}:`, floormap);
                setFloormap(floormap);
            })
            .catch((error) => {
                console.error(`Error fetching floormap details for ID ${floormapId}:`, error);
            });
    }, [floormapId]);

    useEffect(() => {
        // Prepare to fetch zones (not implemented yet)
        // Placeholder for future API call
        console.log(`Prepare to fetch zones for floormap ${floormapId}`);
    }, [floormapId]);

    useEffect(() => {
        const updateStageSize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const containerHeight = containerRef.current.offsetHeight;

                const stageWidth = floormap.width || 3000;
                const stageHeight = floormap.height || 2000;
                const scaleFactor = Math.min(containerWidth / stageWidth, containerHeight / stageHeight);

                setStageSize({
                    width: stageWidth * scaleFactor,
                    height: stageHeight * scaleFactor,
                });
            }
        };

        updateStageSize();
        window.addEventListener("resize", updateStageSize);
        return () => window.removeEventListener("resize", updateStageSize);
    }, [floormap]);

    const handleMouseDown = (e) => {
        if (isDrawing && !newZone) {
            const stage = e.target.getStage();
            const pointer = stage.getPointerPosition();
            setNewZone({
                x: pointer.x,
                y: pointer.y,
                width: 0,
                height: 0,
                color: Math.floor(Math.random() * 16777215).toString(16),
            });
        } else if (!isDrawing && newZone) {
            setIsDrawing(false);
            setIsFinishedDrawing(true);
        }
    };

    const handleMouseMove = (e) => {
        if (isDrawing && newZone) {
            const stage = e.target.getStage();
            const pointer = stage.getPointerPosition();
            setNewZone((zone) => ({
                ...zone,
                width: pointer.x - zone.x,
                height: pointer.y - zone.y,
            }));
        }
    };

    const handleMouseUp = () => {
        if (isDrawing && newZone) {
            setIsDrawing(false);
            setIsFinishedDrawing(true);
        }
    };

    const handleZoneNameChange = (name) => {
        setZoneName(name);
        setZoneNameError(false);
    };

    const handleSubmitZone = () => {
        if (!zoneName) {
            setZoneNameError(true);
            return;
        }
        const updatedZones = [...zones, { ...newZone, name: zoneName }];
        setZones(updatedZones);
        setNewZone(null);
        setZoneName("");
        setZoneNameError(false);
        setIsFinishedDrawing(false);
        setIsDrawing(false);
        console.log("Zone submitted:", { ...newZone, name: zoneName });
        console.log("Zone after convertion:", convertZoneData({ ...newZone, name: zoneName }, floormapId));

    };

    // Handle undo for the ongoing drawing
    const handleUndo = () => {
        if (newZone) {
            setNewZone(null); // Clear the current drawing
        }
    };

    const toggleEditMode = () => {
        setIsEditable((prev) => !prev);
        console.log("zones:", zones);
    };

    const convertZoneData = (zoneData, floorMapId) => {
        const { name, color, x, y, width, height } = zoneData;

        const points = [
            { ordinalNumber: 0, x, y }, // Top-left corner
            { ordinalNumber: 1, x: x + width, y }, // Top-right corner
            { ordinalNumber: 2, x, y: y + height }, // Bottom-left corner
        ];

        return {
            name,
            floorMapId,
            color: parseInt(color.replace('#', ''), 16),
            points,
        };
    };

    const convertBackendZoneData = (backendZoneData) => {
        const { name, color, points } = backendZoneData;

        // Extract the points from the backend data
        const [topLeft, topRight, bottomLeft] = points;

        // Calculate width and height
        const width = topRight.x - topLeft.x;
        const height = bottomLeft.y - topLeft.y;

        // Return the zone data in the format you can use for drawing
        return {
            name,
            color: `#${color.toString(16).padStart(6, '0')}`, // Convert color back to hex
            x: topLeft.x,
            y: topLeft.y,
            width,
            height,
        };
    };

    const handleZoneUpdate = (index, updatedZone) => {
        const updatedZones = [...zones];
        updatedZones[index] = updatedZone;
        setZones(updatedZones);
    };

    return (
        <div className="zone-editing">
            <h2>Floormap Detail for {floormapId}</h2>
            <div className="zone-editing-container">
                <button onClick={toggleEditMode}>
                    {isEditable ? "Disable Editing" : "Enable Editing"}
                </button>
                <div className="stage-container" ref={containerRef}>
                    <ZoneStage
                        stageSize={stageSize}
                        floormap={floormap}
                        zones={zones}
                        newZone={newZone}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onZoneUpdate={handleZoneUpdate}
                        isEditable={isEditable}
                    />
                </div>
                <ZoneMenu
                    isDrawing={isDrawing}
                    setIsDrawing={setIsDrawing}
                    zoneName={zoneName}
                    zoneNameError={zoneNameError}
                    onZoneNameChange={handleZoneNameChange}
                    onSubmitZone={handleSubmitZone}
                    isFinishedDrawing={isFinishedDrawing}
                    onUndo={handleUndo}
                />
            </div>
        </div>
    );
}

export default ZoneEditing;
