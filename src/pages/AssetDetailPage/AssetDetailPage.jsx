import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { AssetService } from "../../services/assetService";
import { FloorMapService } from "../../services/floormapService";
import { AssetPropType } from "../../core/types/assetPropType";
import Modal from "../../components/Modal/Modal";
import "./_assetDetailPage.scss";

function AssetDetailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const asset = state?.asset;
  const [updatedAsset, setUpdatedAsset] = useState({
    name: asset?.name || "",
    x: asset?.x || 0,
    y: asset?.y || 0,
    floormap_id: asset?.floormap_id || null,
    active: asset?.active || true,
  });
  const [floorMaps, setFloorMaps] = useState([]);

  useEffect(() => {
    const fetchFloorMaps = async () => {
      try {
        const floorMapList = await FloorMapService.getAllFloorMaps();
        setFloorMaps(floorMapList);
      } catch (error) {
        console.error("Error fetching floormaps:", error.message);
      }
    };

    fetchFloorMaps();
  }, []);

  const handleUpdateAsset = async (e) => {
    e.preventDefault();
    try {
      const response = await AssetService.updateAsset(asset.id, updatedAsset);
      alert("Asset updated successfully!");
      navigate("/assets");
    } catch (error) {
      alert("Error updating asset: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdatedAsset({
      ...updatedAsset,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const EditForm = ({ closeModal }) => (
    <form onSubmit={handleUpdateAsset}>
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={updatedAsset.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>X Coordinate</label>
        <input
          type="number"
          name="x"
          value={updatedAsset.x}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Y Coordinate</label>
        <input
          type="number"
          name="y"
          value={updatedAsset.y}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Floor Map</label>
        <select
          name="floormap_id"
          value={updatedAsset.floormap_id || ""}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select a Floor Map
          </option>
          {floorMaps.map((map) => (
            <option key={map.id} value={map.id}>
              {map.name}
            </option>
          ))}
        </select>
      </div>
      <div className="checkbox-group">
        <input
          type="checkbox"
          name="active"
          checked={updatedAsset.active}
          onChange={handleChange}
        />
        <label>Active</label>
      </div>
      <div className="button-group">
        <button type="submit">Update</button>
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="asset-detail-page">
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
            <strong>Floor Map Name:</strong> {asset.floorMapName}
          </p>

          <Modal buttonText="  Edit  " title="Edit Asset">
            <EditForm />
          </Modal>
        </div>
      ) : (
        <p>No asset details available.</p>
      )}
    </div>
  );
}

AssetDetailPage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      asset: AssetPropType,
    }),
  }),
};

export default AssetDetailPage;
