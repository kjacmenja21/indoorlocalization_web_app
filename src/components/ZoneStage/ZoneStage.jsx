import React, { useState } from "react";
import ZoneEditor from "../ZoneEditor/ZoneEditor.jsx";
import { Layer, Stage } from "react-konva";
import "./_zoneStage.scss";

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
    setSelectedZoneId(zoneId === selectedZoneId ? null : zoneId);
  };

  const handleDeleteClick = () => {
    if (selectedZoneId) {
      const selectedZone = zones.find((zone) => zone.id === selectedZoneId);
      if (
        window.confirm(
          `Are you sure you want to delete the zone "${selectedZone.name}"?`
        )
      ) {
        onDeleteZone(selectedZoneId);
        setSelectedZoneId(null);
      }
    }
  };

  return (
    <div className="zone-stage">
      <Stage
        className="zone-stage__canvas"
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
              isSelected={zone.id === selectedZoneId}
              onClick={() => handleZoneClick(zone.id)}
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
          className="zone-stage__delete-button"
          onClick={handleDeleteClick}
        >
          Delete Zone
        </button>
      )}
    </div>
  );
};

export default ZoneStage;
