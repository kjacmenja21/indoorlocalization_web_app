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
                console.log("ZoneStage.jsx", zone),
                <ZoneEditor
                    key={index}
                    zone={zone}
                    onUpdate={(updatedZone) => onZoneUpdate(index, updatedZone)}
                    isEditable={isEditable}
                />
            ))}

            {/* Render the new zone being drawn */}
            {newZone && (
                <ZoneEditor
                    zone={newZone}
                    isEditable={false} // New zone isn't editable until finalized
                    onUpdate={() => {}}
                />
            )}
        </Layer>
    </Stage>
);

export default ZoneStage;
