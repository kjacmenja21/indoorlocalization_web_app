import React, { useState } from "react";
import "./_addAssetForm.scss";

function AddAssetForm({ onAddAsset, onCancel }) {
  const [newAsset, setNewAsset] = useState({
    name: "",
    x: 0,
    y: 0,
    floorMapName: "",
  });

  const handleAddAsset = (e) => {
    e.preventDefault();
    onAddAsset(newAsset);
    setNewAsset({ name: "", x: 0, y: 0, floorMapName: "" });
  };

  return (
    <form
      onSubmit={handleAddAsset}
      style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px",
      }}
    >
      <h3>Add New Asset</h3>
      <label>
        Name:
        <input
          type="text"
          value={newAsset.name}
          onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
          required
        />
      </label>
      <label>
        X Coordinate:
        <input
          type="number"
          value={newAsset.x}
          onChange={(e) =>
            setNewAsset({ ...newAsset, x: Number(e.target.value) })
          }
          required
        />
      </label>
      <label>
        Y Coordinate:
        <input
          type="number"
          value={newAsset.y}
          onChange={(e) =>
            setNewAsset({ ...newAsset, y: Number(e.target.value) })
          }
          required
        />
      </label>
      <label>
        Floor Map Name:
        <input
          type="text"
          value={newAsset.floorMapName}
          onChange={(e) =>
            setNewAsset({ ...newAsset, floorMapName: e.target.value })
          }
          required
        />
      </label>
      <button type="submit">Add</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default AddAssetForm;
