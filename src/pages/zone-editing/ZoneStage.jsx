import React from "react";
import { Layer, Rect, Stage } from "react-konva";

const ZoneStage = ({ stageSize, floormap, zones, newZone, onMouseDown, onMouseMove, onMouseUp }) => (
    <Stage width={stageSize.width} height={stageSize.height} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
        <Layer>
            {/* Render existing zones */}
            {zones.map((zone, index) => (
                <Rect
                    key={index}
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    fill={`#${zone.color}`}
                    stroke="black"
                    strokeWidth={2}
                />
            ))}
            {/* Render the new zone being drawn */}
            {newZone && (
                <Rect
                    x={newZone.x}
                    y={newZone.y}
                    width={newZone.width}
                    height={newZone.height}
                    fill={`#${newZone.color}`}
                    stroke="black"
                    strokeWidth={2}
                />
            )}
        </Layer>
    </Stage>
);

export default ZoneStage;
