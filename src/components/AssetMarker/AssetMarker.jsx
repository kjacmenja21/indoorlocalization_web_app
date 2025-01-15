import React from "react";

function AssetMarkers({
  assets,
  zoom,
  position,
  setActiveAsset,
  activeAsset,
  floormapId,
}) {
  return (
    <>
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
          onClick={() => setActiveAsset(asset)}
        >
          <div className="name-tag">{asset.id}</div>
        </div>
      ))}

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
    </>
  );
}

export default AssetMarkers;
