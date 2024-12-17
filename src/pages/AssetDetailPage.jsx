import React from "react";
import { useLocation } from "react-router-dom";

function AssetDetailPage() {
  const { state } = useLocation();
  const asset = state?.asset;

  return (
    <div>
      <h2>Asset Details</h2>
      {asset ? (
        <div>
          <p>
            <strong>ID:</strong> {asset.id}
          </p>
          <p>
            <strong>Name:</strong> {asset.name}
          </p>
          <p>
            <strong>X:</strong> {asset.x}
          </p>
          <p>
            <strong>Y:</strong> {asset.y}
          </p>
          <p>
            <strong>Last Sync:</strong>{" "}
            {new Date(asset.last_sync).toLocaleString()}
          </p>
          <p>
            <strong>Floor Map Name:</strong> {asset.floormap_id}
          </p>
        </div>
      ) : (
        <p>No asset details provided.</p>
      )}
    </div>
  );
}

export default AssetDetailPage;
