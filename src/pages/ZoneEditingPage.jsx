import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {FloorMapService} from "../services/floormapService.js";
import { Stage, Layer, Rect } from "react-konva";

function ZoneEditing() {
    const { floormapId } = useParams();
    const navigate = useNavigate();
    const [floormap, setFloormap] = useState({});
    const [zones, setZones] = useState([]);
    const [newZone, setNewZone] = useState(null);
    const stageRef = useRef();


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

        // Ensure the rectangle stays within the boundaries
        const maxWidth = floormap.width;
        const maxHeight = floormap.height;

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
        <div>
            <h2>Floormap Detail for {floormapId}</h2>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Stage
                    ref={stageRef}
                    width={floormap.width || 800}
                    height={floormap.height || 600}
                    style={{
                        border: "1px solid black",
                        backgroundImage: `url(${floormap.imageUrl || "/mnt/data/image.png"})`,
                        backgroundSize: "cover",
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
                    style={{ marginTop: 20 }}
                >
                    Submit Zones
                </button>
            </div>
        </div>
    );
}

export default ZoneEditing;
