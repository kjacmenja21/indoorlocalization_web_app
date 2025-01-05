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
    const [updatedZoneIndices, setUpdatedZoneIndices] = useState(new Set());

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

        const newZoneData = { ...newZone, name: zoneName };
        for (const zone of zones) {
            if (areZonesOverlapping(newZoneData, zone)) {
                console.log("Overlapping zones:", newZoneData, zone);
                alert(
                    `The new zone "${zoneName}" overlaps with the existing zone "${zone.name}". Please adjust its position or size.`
                );
                return;
            }
        }

        const updatedZones = [...zones, newZoneData];
        setZones(updatedZones);
        setNewZone(null);
        setZoneName("");
        setZoneNameError(false);
        setIsFinishedDrawing(false);
        setIsDrawing(false);

        console.log("Zone submitted:", newZoneData);
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
    const round = (value) => Math.round(value * 100) / 100; // Rounds to 2 decimal places

    const areZonesOverlapping = (zoneA, zoneB) => {
        const ax1 = zoneA.x;
        const ay1 = zoneA.y;
        const ax2 = zoneA.x + zoneA.width;
        const ay2 = zoneA.y + zoneA.height;

        const bx1 = zoneB.x;
        const by1 = zoneB.y;
        const bx2 = zoneB.x + zoneB.width;
        const by2 = zoneB.y + zoneB.height;
        console.log("ax1:", ax1, "ay1:", ay1, "ax2:", ax2, "ay2:", ay2);
        return !(ax2 <= bx1 || bx2 <= ax1 || ay2 <= by1 || by2 <= ay1);
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
        console.log("Zone updated (handleZoneUpdate):", updatedZone);
        // Track updated zones
        setUpdatedZoneIndices((prevSet) => {
            const newSet = new Set(prevSet);
            newSet.add(index);
            return newSet;
        });
    };

    const saveUpdatedZones = () => {
        // Check for overlaps among updated zones
        const updatedZonesArray = Array.from(updatedZoneIndices).map(
            (index) => zones[index]
        );
        console.log("Checking overlaps among updated zones:", updatedZonesArray);
        for (let i = 0; i < updatedZonesArray.length; i++) {
            console.log("Checking zone:", updatedZonesArray[i]);
            console.log("i:", i);
            console.log("updatedZonesArray.length:", updatedZonesArray.length);
            for (let j = 0; j < zones.length; j++) {
                console.log("Checking overlap between:", updatedZonesArray[i], zones[j]);
                if (areZonesOverlapping(updatedZonesArray[i], zones[j]) && updatedZonesArray[i].name !== zones[j].name) {
                    alert(
                        `Zones "${updatedZonesArray[i].name}" and "${zones[j].name}" overlap. Please resolve the conflict before saving.`
                    );
                    return;
                }
            }
        }

        // Convert and save zones
        const zonesToSave = updatedZonesArray.map((zone) =>
            convertZoneData(zone, floormapId)
        );

        console.log("Saving zones:", zonesToSave);

        // Clear updated zone tracking on successful save
        setUpdatedZoneIndices(new Set());
    };


    const handleNewZoneUpdate = (updatedZone) => {
        if (!zoneName) {
            setZoneNameError(true); // Handle missing name error
            return;
        }

        // Finalize the new zone with its name and converted data
        const finalizedZone = {
            ...updatedZone,
            name: zoneName,
        };

        // Update the zones state and reset new zone state
        setZones((prevZones) => [...prevZones, finalizedZone]);
        setNewZone(null);
        setZoneName(""); // Clear the name input
        setZoneNameError(false);
        setIsDrawing(false);
        setIsFinishedDrawing(false);

        console.log("New zone added:", finalizedZone);
        console.log("Converted zone for backend:", convertZoneData(finalizedZone, floormapId));
    };


    return (
        <div className="zone-editing">
            <h2>Floormap Detail for {floormapId}</h2>
            <div className="zone-editing-container">
                <button onClick={toggleEditMode}>
                    {isEditable ? "Disable Editing" : "Enable Editing"}
                </button>
                <button
                    onClick={saveUpdatedZones}
                    disabled={updatedZoneIndices.size === 0}
                >
                    {`Save Changes (${updatedZoneIndices.size})`}
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
                        onNewZoneUpdate={handleNewZoneUpdate}
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
