import React from "react";
import { Stage, Layer, Rect } from "react-konva";

const ZoneStage = ({ stageSize, floormap, zones, newZone, onMouseDown, onMouseMove, onMouseUp }) => (
    <Stage
        width={stageSize.width}
        height={stageSize.height}
        style={{
            backgroundImage: `url(${floormap.imageUrl || "/mnt/data/image.png"})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
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
);

export default ZoneStage;
