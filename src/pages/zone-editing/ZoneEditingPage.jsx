import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stage, Layer, Rect } from "react-konva";
import { FloorMapService } from "../../services/floormapService.js";
import "../_pages.scss";
import ZoneStage from "./ZoneStage";


function ZoneEditing() {
    const { floormapId } = useParams();
    const [floormap, setFloormap] = useState({});
    const [zones, setZones] = useState([]);
    const [newZone, setNewZone] = useState(null);
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
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
        const stage = e.target.getStage();
        const pointer = stage.getPointerPosition();
        setNewZone({ x: pointer.x, y: pointer.y, width: 0, height: 0, color: Math.floor(Math.random() * 16777215).toString(16) });
    };

    const handleMouseMove = (e) => {
        if (!newZone) return;

        const stage = e.target.getStage();
        const pointer = stage.getPointerPosition();

        setNewZone((zone) => ({
            ...zone,
            width: pointer.x - zone.x,
            height: pointer.y - zone.y,
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
                <ZoneStage
                    stageSize={stageSize}
                    floormap={floormap}
                    zones={zones}
                    newZone={newZone}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                />
                <button onClick={() => console.log("Zones to submit:", zones)}>Submit Zones</button>
            </div>
        </div>
    );
}

export default ZoneEditing;
