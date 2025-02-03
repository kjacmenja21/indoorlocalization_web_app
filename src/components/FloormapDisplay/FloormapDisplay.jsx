import React, { useEffect, useState } from "react";
import AssetMarkers from "../AssetMarker/AssetMarker";

function FloormapDisplay({ width, height, image, assets, activeAsset, setActiveAsset }) {
  //const [activeAsset, setActiveAssetState] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerSize = { width: 800, height: 600 }; // Dimenzije kontejnera
  const imageSize = { width, height }; // Dimenzije slike

  //let imgSource;
  useEffect(() => {

    if (activeAsset) {
      const currentAsset = assets.find((asset) => asset.id === activeAsset.id);
      if (currentAsset) {
        setPosition({
          x: Math.min(
            Math.max(
              -currentAsset.x * zoom + containerSize.width / 2,
              -imageSize.width * zoom + containerSize.width
            ),
            0
          ),
          y: Math.min(
            Math.max(
              -currentAsset.y * zoom + containerSize.height / 2,
              -imageSize.height * zoom + containerSize.height
            ),
            0
          ),
        });
      }
    }
  }, [assets, activeAsset, zoom]);

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Ograničenje pozicije
      const limitedX = Math.min(
        Math.max(newX, -imageSize.width * zoom + containerSize.width),
        0
      );
      const limitedY = Math.min(
        Math.max(newY, -imageSize.height * zoom + containerSize.height),
        0
      );

      setPosition({ x: limitedX, y: limitedY });
    }
  };

  return (
    <div
      className="floormap-detail"
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      style={{ userSelect: "none", overflow: "hidden" }}
    >
      <div
        className="floormap-container"
        style={{
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
          overflow: "hidden",
          position: "relative",
          border: "1px solid #ccc",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={(e) => {
          setIsDragging(true);
          setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
          });
        }}
      >
        {image ? (
            <img
                src={image}
                alt="Floor Map"
                draggable={false}
                style={{
                  position: "absolute",
                  top: position.y,
                  left: position.x,
                  transform: `scale(${zoom})`,
                  transformOrigin: "center",
                }}
            />
        ) : (
            <p>Loading image...</p>
        )}

        <AssetMarkers
            assets={assets}
          zoom={zoom}
          position={position}
          setActiveAsset={setActiveAsset}
          activeAsset={activeAsset}
          imageSize={imageSize} // Prosljeđujemo veličinu slike
        />
      </div>
    </div>
  );
}

export default FloormapDisplay;
