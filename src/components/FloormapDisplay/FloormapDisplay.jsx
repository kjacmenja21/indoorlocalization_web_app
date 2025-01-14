import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";

function FloormapDisplay({ floormapId, assets }) {
  const [activeAsset, setActiveAsset] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (activeAsset) {
      const currentAsset = assets.find((asset) => asset.id === activeAsset.id);
      if (currentAsset) {
        setPosition({
          x: -currentAsset.x * zoom + 400,
          y: -currentAsset.y * zoom + 300,
        });
      }
    }
  }, [assets, activeAsset, zoom]);

  const assetOptions = assets.map((asset) => ({
    value: asset.id,
    label: `Asset ${asset.id}`,
    asset,
  }));

  const handleAssetSelect = (selectedOption) => {
    setActiveAsset(selectedOption.asset);
  };

  return (
    <div
      className="floormap-detail"
      onMouseMove={(e) =>
        isDragging &&
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      style={{ userSelect: "none", overflow: "hidden" }}
    >
      <h2>Floormap Detail for {floormapId}</h2>
      <ReactSelect
        options={assetOptions}
        onChange={handleAssetSelect}
        placeholder="Select an Asset"
        styles={{
          container: (base) => ({
            ...base,
            marginBottom: "10px",
            width: "300px",
          }),
        }}
      />
      <div
        className="floormap-container"
        style={{
          width: "800px",
          height: "600px",
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
        <img
          src="https://fapa.jp/fair-2014/wp-content/uploads/2015/05/floormap_16.svg"
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
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="asset"
            style={{
              position: "absolute",
              transform: `translate(${asset.x * zoom + position.x}px, ${
                asset.y * zoom + position.y
              }px)`,
              width: "10px",
              height: "10px",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
            title={`Asset ID: ${asset.id}`}
          >
            <div className="name-tag">{asset.id}</div>
          </div>
        ))}
      </div>
      {activeAsset && (
        <div className="dialog">
          <h3>Asset Details</h3>
          <p>ID: {activeAsset.id}</p>
          <p>X: {activeAsset.x}</p>
          <p>Y: {activeAsset.y}</p>
          <p>FloorMap ID: {floormapId}</p>
          <button onClick={() => setActiveAsset(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default FloormapDisplay;
