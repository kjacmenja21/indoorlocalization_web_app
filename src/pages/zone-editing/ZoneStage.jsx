import React from "react";
import { Layer, Stage } from "react-konva";
import ZoneEditor from "./ZoneEditor";

const ZoneStage = ({
                       stageSize,
                       floormap,
                       zones,
                       newZone,
                       onMouseDown,
                       onMouseMove,
                       onMouseUp,
                       onZoneUpdate,
                       onNewZoneUpdate,
                       isEditable,
                   }) => (
    <Stage
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
    >
        <Layer>
            {/* Render existing zones with interactive editing */}
            {zones.map((zone, index) => (
                <ZoneEditor
                    key={index}
                    zone={zone}
                    onUpdate={(updatedZone) => onZoneUpdate(index, updatedZone)}
                    isEditable={isEditable}
                    stageSize={stageSize}
                />
            ))}

            {/* Render the new zone being drawn */}
            {newZone && (
                <ZoneEditor
                    zone={newZone}
                    isEditable={true} // Allow editing if necessary
                    onUpdate={onNewZoneUpdate} // Define how to handle updates for a new zone
                    stageSize={stageSize}
                />
            )}
        </Layer>
    </Stage>
);

export default ZoneStage;
