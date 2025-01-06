import React, { useState } from "react";
import ZoneEditor from "./ZoneEditor.jsx";
import { Layer, Stage } from "react-konva";

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
                       onDeleteZone,
                   }) => {
    const [selectedZoneId, setSelectedZoneId] = useState(null);

    const handleZoneClick = (zoneId) => {
        // Toggle selection of the clicked zone
        setSelectedZoneId(zoneId === selectedZoneId ? null : zoneId);
    };

    const handleDeleteClick = () => {
        if (selectedZoneId) {
            const selectedZone = zones.find((zone) => zone.id === selectedZoneId);
            if (window.confirm(`Are you sure you want to delete the zone "${selectedZone.name}"?`)) {
                onDeleteZone(selectedZoneId);
                setSelectedZoneId(null); // Deselect after deletion
            }
        }
    };

    return (
        <div>
            <Stage
                width={stageSize.width}
                height={stageSize.height}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
            >
                <Layer>
                    {zones.map((zone, index) => (
                        <ZoneEditor
                            key={index}
                            zone={zone}
                            onUpdate={(updatedZone) => onZoneUpdate(index, updatedZone)}
                            isEditable={isEditable}
                            stageSize={stageSize}
                            isSelected={zone.id === selectedZoneId} // Pass selection status
                            onClick={() => handleZoneClick(zone.id)} // Handle zone click
                        />
                    ))}
                    {newZone && (
                        <ZoneEditor
                            zone={newZone}
                            isEditable={true}
                            onUpdate={onNewZoneUpdate}
                            stageSize={stageSize}
                        />
                    )}
                </Layer>
            </Stage>

            {selectedZoneId && (
                <button
                    onClick={handleDeleteClick}
                    style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                    }}
                >
                    Delete Zone
                </button>
            )}
        </div>
    );
};

export default ZoneStage;
