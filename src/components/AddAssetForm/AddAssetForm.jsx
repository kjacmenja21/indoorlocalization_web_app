import React, { useState } from "react";
import "./_addAssetForm.scss";
import Modal from "../Modal/Modal";

function AddAssetForm({ onAddAsset, closeModal }) {
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
    <form className="add-asset-form" onSubmit={handleAddAsset}>
      <div className="add-asset-form__input-group">
        <input
          id="name"
          className="add-asset-form__input"
          type="text"
          value={newAsset.name}
          onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
          required
          placeholder=" "
        />
        <label className="add-asset-form__placeholder" htmlFor="name">
          Name
        </label>
      </div>

      <div className="add-asset-form__input-group">
        <input
          id="x-coordinate"
          className="add-asset-form__input"
          type="number"
          value={newAsset.x}
          onChange={(e) =>
            setNewAsset({ ...newAsset, x: Number(e.target.value) })
          }
          required
          placeholder=" "
        />
        <label className="add-asset-form__placeholder" htmlFor="x-coordinate">
          X Coordinate
        </label>
      </div>

      <div className="add-asset-form__input-group">
        <input
          id="y-coordinate"
          className="add-asset-form__input"
          type="number"
          value={newAsset.y}
          onChange={(e) =>
            setNewAsset({ ...newAsset, y: Number(e.target.value) })
          }
          required
          placeholder=" "
        />
        <label className="add-asset-form__placeholder" htmlFor="y-coordinate">
          Y Coordinate
        </label>
      </div>

      <div className="add-asset-form__input-group">
        <input
          id="floor-map-name"
          className="add-asset-form__input"
          type="text"
          value={newAsset.floorMapName}
          onChange={(e) =>
            setNewAsset({ ...newAsset, floorMapName: e.target.value })
          }
          required
          placeholder=" "
        />
        <label className="add-asset-form__placeholder" htmlFor="floor-map-name">
          Floor Map Name
        </label>
      </div>

      <div className="add-asset-form__actions">
        <button
          className="add-asset-form__button add-asset-form__button--submit"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            closeModal();
          }}
        >
          Add
        </button>
        <button
          className="add-asset-form__button add-asset-form__button--cancel"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            closeModal();
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddAssetForm;
