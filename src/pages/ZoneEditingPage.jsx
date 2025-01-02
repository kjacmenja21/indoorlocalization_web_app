import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FloorMapService } from "../services/floormapService.js";
import { Stage, Layer, Rect } from "react-konva";
import "./_pages.scss";

function ZoneEditing() {
    const { floormapId } = useParams();
    const navigate = useNavigate();
    const [floormap, setFloormap] = useState({});
    const [zones, setZones] = useState([]);
    const [newZone, setNewZone] = useState(null);
    const stageRef = useRef();
    const containerRef = useRef(); // Reference for parent container
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

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
        // Dynamically adjust the stage size based on container size
        const updateStageSize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const containerHeight = containerRef.current.offsetHeight;

                // Scale the stage proportionally
                const stageWidth = floormap.width || 3000;
                const stageHeight = floormap.height || 2000;
                const scaleFactor = Math.min(
                    containerWidth / stageWidth,
                    containerHeight / stageHeight
                );

                setStageSize({
                    width: stageWidth * scaleFactor,
                    height: stageHeight * scaleFactor,
                });
            }
        };

        updateStageSize();
        window.addEventListener("resize", updateStageSize); // Update size on window resize
        return () => window.removeEventListener("resize", updateStageSize);
    }, [floormap]);

    const handleMouseDown = (e) => {
        const stage = stageRef.current.getStage();
        const pointer = stage.getPointerPosition();

        setNewZone({
            x: pointer.x,
            y: pointer.y,
            width: 0,
            height: 0,
            color: Math.floor(Math.random() * 16777215).toString(16), // Random color
        });
    };

    const handleMouseMove = () => {
        if (!newZone) return;

        const stage = stageRef.current.getStage();
        const pointer = stage.getPointerPosition();

        const maxWidth = stageSize.width;
        const maxHeight = stageSize.height;

        setNewZone((zone) => ({
            ...zone,
            width: Math.min(pointer.x - zone.x, maxWidth - zone.x),
            height: Math.min(pointer.y - zone.y, maxHeight - zone.y),
        }));
    };

    const handleMouseUp = () => {
        if (newZone) {
            setZones([...zones, newZone]);
            setNewZone(null);
        }
    };

    return (
        <div className="zone-editing">
            <h2>Floormap Detail for {floormapId}</h2>
            <div className="stage-container" ref={containerRef}>
                <Stage
                    ref={stageRef}
                    className="konva-stage"
                    width={stageSize.width}
                    height={stageSize.height}
                    style={{
                        backgroundImage: `url(${floormap.imageUrl || "/mnt/data/image.png"})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <Layer>
                        {zones.map((zone, index) => (
                            <Rect
                                key={index}
                                x={zone.x}
                                y={zone.y}
                                width={zone.width}
                                height={zone.height}
                                fill={`#${zone.color}`}
                                opacity={0.5}
                            />
                        ))}
                        {newZone && (
                            <Rect
                                x={newZone.x}
                                y={newZone.y}
                                width={newZone.width}
                                height={newZone.height}
                                fill={`#${newZone.color}`}
                                opacity={0.5}
                            />
                        )}
                    </Layer>
                </Stage>
                <button
                    onClick={() => {
                        console.log("Zones to submit:", zones);
                    }}
                >
                    Submit Zones
                </button>
            </div>
        </div>
    );
}

export default ZoneEditing;
