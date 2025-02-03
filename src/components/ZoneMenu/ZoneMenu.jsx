import React from "react";
import "./_zoneMenu.scss";

const ZoneMenu = ({
  isDrawing,
  setIsDrawing,
  zoneName,
  zoneNameError,
  onZoneNameChange,
  onSubmitZone,
  isFinishedDrawing,
  onUndo,
}) => (
  <div className="zone-menu">
    <h3 className="zone-menu__title">Zone Options</h3>
    <div className="zone-menu__controls">
      <button
        className={`zone-menu__button ${
          isDrawing ? "zone-menu__button--active" : ""
        }`}
        onClick={() => setIsDrawing(!isDrawing)}
        disabled={!!zoneName && isDrawing}
      >
        {isDrawing ? "Stop Drawing" : "Draw Rectangle"}
      </button>

      <button
        className="zone-menu__button zone-menu__button--secondary"
        onClick={onUndo}
        disabled={isDrawing}
      >
        Undo
      </button>
    </div>

    {isFinishedDrawing && (
      <div className="zone-menu__form">
        <div className="zone-menu__input-group">
          <label className="zone-menu__label">
            Zone Name:
            <input
              className={`zone-menu__input ${
                zoneNameError ? "zone-menu__input--error" : ""
              }`}
              type="text"
              value={zoneName}
              onChange={(e) => onZoneNameChange(e.target.value)}
              placeholder="Enter zone name"
            />
          </label>
          {zoneNameError && (
            <p className="zone-menu__error">
              Please enter a name for the zone.
            </p>
          )}
        </div>
        <button
          className="zone-menu__button zone-menu__button--submit"
          onClick={onSubmitZone}
        >
          Submit Zone
        </button>
      </div>
    )}
  </div>
);

export default ZoneMenu;
