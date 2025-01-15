import React, { useState } from "react";

function AssetMarkers({
  assets,
  zoom,
  position,
  setActiveAsset,
  activeAsset,
  imageSize,
  containerSize,
}) {
  const [draggingAsset, setDraggingAsset] = useState(null);

  const handleMouseDown = (e, asset) => {
    e.preventDefault();
    setDraggingAsset(asset.id);
  };

  const handleMouseMove = (e) => {
    if (!draggingAsset) return;

    const asset = assets.find((a) => a.id === draggingAsset);
    if (!asset) return;

    // Izračun granica vidljivog dijela slike unutar kontejnera
    const visibleBounds = {
      left: Math.max(position.x, 0),
      top: Math.max(position.y, 0),
      right: Math.min(position.x + imageSize.width * zoom, containerSize.width),
      bottom: Math.min(
        position.y + imageSize.height * zoom,
        containerSize.height
      ),
    };

    // Preračunavanje pozicije asseta
    const newX = (e.clientX - position.x) / zoom;
    const newY = (e.clientY - position.y) / zoom;

    // Ograničavanje unutar vidljivih granica
    const limitedX = Math.min(
      Math.max(newX, (visibleBounds.left - position.x) / zoom),
      (visibleBounds.right - position.x) / zoom
    );
    const limitedY = Math.min(
      Math.max(newY, (visibleBounds.top - position.y) / zoom),
      (visibleBounds.bottom - position.y) / zoom
    );

    // Ažuriramo poziciju aktivnog asseta
    setActiveAsset({ ...asset, x: limitedX, y: limitedY });
  };

  const handleMouseUp = () => {
    setDraggingAsset(null);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Zaustavlja drag ako miš izađe iz područja
    >
      {assets.map((asset) => (
        <div
          key={asset.id}
          onMouseDown={(e) => handleMouseDown(e, asset)}
          style={{
            position: "absolute",
            // Preračunavamo poziciju asseta s obzirom na trenutnu poziciju slike i zoom
            top: asset.y * zoom + position.y,
            left: asset.x * zoom + position.x,
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: activeAsset?.id === asset.id ? "blue" : "red",
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
          }}
        />
      ))}
    </div>
  );
}

export default AssetMarkers;
