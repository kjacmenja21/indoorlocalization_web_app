import React from "react";

const ZoneMenu = ({ isDrawing, setIsDrawing, zoneName, zoneNameError, onZoneNameChange, onSubmitZone, isFinishedDrawing }) => (
    <div className="zone-menu">
        <h3>Zone Options</h3>
        <button onClick={() => setIsDrawing(!isDrawing)} disabled={!!zoneName && isDrawing}>
            {isDrawing ? "Stop Drawing" : "Draw Rectangle"}
        </button>

        {isFinishedDrawing && (
            <div className="zone-details">
                <label>
                    Zone Name:
                    <input
                        type="text"
                        value={zoneName}
                        onChange={(e) => onZoneNameChange(e.target.value)}
                        placeholder="Enter zone name"
                    />
                </label>
                {zoneNameError && <p style={{ color: "red" }}>Please enter a name for the zone.</p>}
                <button onClick={onSubmitZone}>Submit Zone</button>
            </div>
        )}
    </div>
);

export default ZoneMenu;
