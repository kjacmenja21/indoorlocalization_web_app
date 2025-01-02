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
    const [zoneName, setZoneName] = useState("");
    const [zoneNameError, setZoneNameError] = useState(false);
    const [isFinishedDrawing, setIsFinishedDrawing] = useState(false); // New state to track drawing completion
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
            setIsDrawing(false); // Finish drawing after second click
            setIsFinishedDrawing(true); // Mark drawing as finished
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
            setIsDrawing(false); // Finish drawing after mouse up
            setIsFinishedDrawing(true); // Mark drawing as finished
        }
    };

    const handleZoneNameChange = (name) => {
        setZoneName(name);
        setZoneNameError(false); // Reset error if the user starts typing
    };

    const handleSubmitZone = () => {
        if (!zoneName) {
            setZoneNameError(true); // Error if zone name is not entered
            return;
        }
        setZones([...zones, { ...newZone, name: zoneName }]);
        setNewZone(null);
        setZoneName("");
        setZoneNameError(false); // Reset error state
        setIsFinishedDrawing(false); // Reset drawing state after submission
        setIsDrawing(false); // Reset drawing state after submission
        console.log("Zone submitted:", { ...newZone, name: zoneName });
    };

    return (
        <div className="zone-editing">
            <h2>Floormap Detail for {floormapId}</h2>
            <div className="zone-editing-container">
                <div className="stage-container" ref={containerRef}>
                    <ZoneStage
                        stageSize={stageSize}
                        floormap={floormap}
                        zones={zones}
                        newZone={newZone}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    />
                </div>
                <ZoneMenu
                    isDrawing={isDrawing}
                    setIsDrawing={setIsDrawing}
                    zoneName={zoneName}
                    zoneNameError={zoneNameError} // Pass error state to ZoneMenu
                    onZoneNameChange={handleZoneNameChange}
                    onSubmitZone={handleSubmitZone}
                    isFinishedDrawing={isFinishedDrawing} // Pass the drawing completion state
                />
            </div>
        </div>
    );
}

export default ZoneEditing;
