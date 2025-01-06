import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stage, Layer, Rect } from "react-konva";
import { FloorMapService } from "../../services/floormapService.js";
import "../_pages.scss";
import ZoneStage from "./ZoneStage";
import ZoneMenu from "./ZoneMenu.jsx";
import {ZoneService} from "../../services/zoneService.js";


function ZoneEditing() {
    const { floormapId } = useParams();
    const [floormap, setFloormap] = useState({});
    const [floormapScale, setFloormapScale] = useState(1);
    const [newZone, setNewZone] = useState(null);
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [zoneName, setZoneName] = useState("");
    const [zoneNameError, setZoneNameError] = useState(false);
    const [isFinishedDrawing, setIsFinishedDrawing] = useState(false);
    const containerRef = useRef();
    const [updatedZoneIndices, setUpdatedZoneIndices] = useState(new Set());

    const [realWorldZones, setRealWorldZones] = useState([]);
    const [scaledZones, setScaledZones] = useState([]);
    const [backendZones, setBackendZones] = useState([]);

    useEffect(() => {
        FloorMapService.getFloorMapById(floormapId)
            .then((floormap) => {
                console.log(`Fetched floormap details for ID ${floormapId}:`, floormap);
                setFloormap(floormap);

                // Fetch zones associated with the floormap
                ZoneService.getZones(floormapId)
                    .then((zones) => {
                        console.log(`Fetched zones for floormap ID ${floormapId}:`, zones);
                        setBackendZones(zones);
                    })
                    .catch((error) => {
                        console.error(`Error fetching zones for floormap ID ${floormapId}:`, error);
                    });
            })
            .catch((error) => {
                console.error(`Error fetching floormap details for ID ${floormapId}:`, error);
            });
    }, [floormapId]);


    useEffect(() => {
        const updateStageSize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const containerHeight = containerRef.current.offsetHeight;

                const stageWidth = floormap.width || 3000;
                const stageHeight = floormap.height || 2000;
                const scaleFactor = Math.min(containerWidth / stageWidth, containerHeight / stageHeight);
                console.log("Stage size:", stageWidth, stageHeight);
                setStageSize({
                    width: stageWidth * scaleFactor,
                    height: stageHeight * scaleFactor,
                });
                setFloormapScale(scaleFactor);
            }
        };

        updateStageSize();
        window.addEventListener("resize", updateStageSize);
        return () => window.removeEventListener("resize", updateStageSize);
    }, [floormap]);

    useEffect(() => {
        console.log("Backend zones:", backendZones);
        setScaledZones(convertZonesForDisplay(backendZones, floormapScale));
        console.log("Scaled zones:", scaledZones);
    }, [floormapScale, backendZones]);

    const convertZonesForDisplay = (zones, scale) => {
        return zones.map((zone) => {
            // Extract the bounding box from the points
            const minX = Math.min(...zone.points.map((p) => p.x));
            const minY = Math.min(...zone.points.map((p) => p.y));
            const maxX = Math.max(...zone.points.map((p) => p.x));
            const maxY = Math.max(...zone.points.map((p) => p.y));

            // Calculate the dimensions
            const width = maxX - minX;
            const height = maxY - minY;

            // Return the zone in the drawing format, scaled for display
            return {
                id: zone.id,
                name: zone.name,
                color: `#${zone.color.toString(16).padStart(6, '0')}`, // Convert color to hex
                x: minX * scale,
                y: minY * scale,
                width: width * scale,
                height: height * scale,
            };
        });
    };


    const convertZoneToRealWorld = (zone) => ({
        ...zone,
        x: zone.x / floormapScale,
        y: zone.y / floormapScale,
        width: zone.width / floormapScale,
        height: zone.height / floormapScale,
    });
    const convertZonesToRealWorld = (zones) => zones.map(convertZoneToRealWorld);

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

    const handleSubmitZone = async () => {
        if (!zoneName) {
            setZoneNameError(true);
            return;
        }
        console.log("New zone to submit:", newZone);
        let newZoneData = {...newZone, name: zoneName};
        for (const zone of scaledZones) {
            if (areZonesOverlapping(newZoneData, zone)) {
                console.log("Overlapping zones:", newZoneData, zone);
                alert(
                    `The new zone "${zoneName}" overlaps with the existing zone "${zone.name}". Please adjust its position or size.`
                );
                return;
            }
        }
        newZoneData = {
            name: zoneName,
            color: newZone.color,
            x: newZone.x,
            y: newZone.y,
            width: newZone.width,
            height: newZone.height,
        };

        newZoneData = convertZoneData(newZoneData, floormapId, floormapScale)

        console.log("Zone submitted:", newZoneData);
        try {
            // Call the backend service to add the zone
            const savedZone = await ZoneService.addZone(newZoneData);

            if (savedZone) {
                // If the zone is successfully saved, update the local state
                const updatedZones = [...scaledZones, savedZone];
                setScaledZones(updatedZones);
                setNewZone(null);
                setZoneName("");
                setZoneNameError(false);
                setIsFinishedDrawing(false);
                setIsDrawing(false);

                console.log("Zone successfully submitted and saved:", savedZone);
            } else {
                alert("Failed to save the zone. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting zone:", error);
            alert("An error occurred while adding the zone. Please try again later.");
        }
    };

    // Handle undo for the ongoing drawing
    const handleUndo = () => {
        if (newZone) {
            setNewZone(null); // Clear the current drawing
        }
    };

    const toggleEditMode = () => {
        setIsEditable((prev) => !prev);
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


    const convertZoneData = (zoneData, floorMapId, scale) => {
        const { name, color, x, y, width, height } = zoneData;

        // Scale back to real-world dimensions
        const realX = x / scale;
        const realY = y / scale;
        const realWidth = width / scale;
        const realHeight = height / scale;

        // Define all four corners of the rectangle
        const points = [
            { ordinalNumber: 0, x: realX, y: realY }, // Top-left corner
            { ordinalNumber: 1, x: realX + realWidth, y: realY }, // Top-right corner
            { ordinalNumber: 2, x: realX + realWidth, y: realY + realHeight }, // Bottom-right corner
            { ordinalNumber: 3, x: realX, y: realY + realHeight }, // Bottom-left corner
        ];

        return {
            name,
            floorMapId,
            color: parseInt(color.replace('#', ''), 16), // Convert hex color to integer
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

    const handleZoneUpdate = (index, updatedScaledZone) => {
        console.log("Updating zone:", index, updatedScaledZone);

        // Convert scaled zone to real-world format
        const updatedRealWorldZone = convertZoneToRealWorld(updatedScaledZone);

        // Update real-world zones
        const updatedRealWorldZones = [...realWorldZones];
        updatedRealWorldZones[index] = updatedRealWorldZone;
        setRealWorldZones(updatedRealWorldZones);

        // Update scaled zones
        const updatedScaledZones = [...scaledZones];
        updatedScaledZones[index] = updatedScaledZone;
        setScaledZones(updatedScaledZones);

        console.log("Zone updated:", { updatedRealWorldZone, updatedScaledZone });

        // Track updated zones
        setUpdatedZoneIndices((prevSet) => {
            const newSet = new Set(prevSet);
            newSet.add(index);
            return newSet;
        });
    };

    const saveUpdatedZones = () => {
        // Extract updated zones based on updatedZoneIndices
        const updatedZonesArray = Array.from(updatedZoneIndices).map(
            (index) => scaledZones[index]
        );

        // Check for overlaps among updated zones and all zones
        console.log("Checking overlaps among updated zones:", updatedZonesArray);
        console.log("updatedScaledZones:", scaledZones);

        for (let i = 0; i < updatedZonesArray.length; i++) {
            for (let j = 0; j < scaledZones.length; j++) {
                if (
                    areZonesOverlapping(updatedZonesArray[i], scaledZones[j]) &&
                    updatedZonesArray[i].name !== scaledZones[j].name
                ) {
                    alert(
                        `Zones "${updatedZonesArray[i].name}" and "${scaledZones[j].name}" overlap. Please resolve the conflict before saving.`
                    );
                    return;
                }
            }
        }

        // Prepare zones for backend
        const updatedRealWorldZones = Array.from(updatedZoneIndices).map(
            (index) => realWorldZones[index]
        );
        const zonesToSave = updatedRealWorldZones.map((zone) =>
            convertZoneData(zone, floormapId, 1) // Scale is 1 as zones are in real-world dimensions
        );

        console.log("Saving updated zones to backend:", zonesToSave);

        // Perform save operation (placeholder)
        // If successful, clear the updated zone indices
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
        const newRealWorldZone = convertZoneToRealWorld(finalizedZone);
        setRealWorldZones((prevZones) => [...prevZones, newRealWorldZone]);
        setScaledZones((prevZones) => [...prevZones, finalizedZone]);
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
                        zones={scaledZones}
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
