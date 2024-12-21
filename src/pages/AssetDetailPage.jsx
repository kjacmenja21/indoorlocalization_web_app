import React from "react";
import PropTypes from "prop-types";
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

AssetDetailPage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      asset: PropTypes.shape({
        name: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired,
        floormap_id: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        last_sync: PropTypes.string.isRequired,
      }),
    }),
  }),
};

export default AssetDetailPage;
