import React, { useState } from "react";
import "./_addFloorMapForm.scss";
import { FloorMapService } from "../../services/floormapService.js";

function AddFloorMapForm({ onAddFloorMap, closeModal }) {
  const [floorMapData, setFloorMapData] = useState({
    name: "",
    width: 0,
    height: 0,
    tx: 0,
    ty: 0,
    tw: 0,
    th: 0,
  });
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!imageFile) {
        alert("Please upload an image.");
        return;
      }
      console.log("floorMapData: ", floorMapData, "imageFile: ", imageFile);
      onAddFloorMap( floorMapData, imageFile );
      closeModal();
      setFloorMapData({
        name: "",
        width: 0,
        height: 0,
        tx: 0,
        ty: 0,
        tw: 0,
        th: 0,
      });
      setImageFile(null);
    } catch (error) {
      console.error("Error adding floor map:", error.message);
    }
  };

  return (
    <form
      className="add-floormap-form"
      onSubmit={handleFormSubmit}
      style={{ maxHeight: "none", overflow: "hidden" }}
    >
      <div className="add-floormap-form__input-group">
        <input
          id="name"
          className="add-floormap-form__input"
          type="text"
          value={floorMapData.name}
          onChange={(e) =>
            setFloorMapData({ ...floorMapData, name: e.target.value })
          }
          required
          placeholder=" "
        />
        <label className="add-floormap-form__placeholder" htmlFor="name">
          Floor Map Name
        </label>
      </div>

      <div className="add-floormap-form__input-group">
        <input
          id="image"
          className="add-floormap-form__input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        <label className="add-floormap-form__placeholder" htmlFor="image">
          Image
        </label>
      </div>

      <div className="add-floormap-form__input-group">
        <input
          id="width"
          className="add-floormap-form__input"
          type="number"
          value={floorMapData.width}
          onChange={(e) =>
            setFloorMapData({ ...floorMapData, width: Number(e.target.value) })
          }
          required
          placeholder=" "
        />
        <label className="add-floormap-form__placeholder" htmlFor="width">
          Width
        </label>
      </div>

      <div className="add-floormap-form__input-group">
        <input
          id="height"
          className="add-floormap-form__input"
          type="number"
          value={floorMapData.height}
          onChange={(e) =>
            setFloorMapData({ ...floorMapData, height: Number(e.target.value) })
          }
          required
          placeholder=" "
        />
        <label className="add-floormap-form__placeholder" htmlFor="height">
          Height
        </label>
      </div>

      <div className="add-floormap-form__input-group">
        <input
          id="x-coordinate"
          className="add-floormap-form__input"
          type="number"
          value={floorMapData.tx}
          onChange={(e) =>
            setFloorMapData({ ...floorMapData, tx: Number(e.target.value) })
          }
          required
          placeholder=" "
        />
        <label
          className="add-floormap-form__placeholder"
          htmlFor="x-coordinate"
        >
          X Coordinate
        </label>
      </div>

      <div className="add-floormap-form__input-group">
        <input
          id="y-coordinate"
          className="add-floormap-form__input"
          type="number"
          value={floorMapData.ty}
          onChange={(e) =>
            setFloorMapData({ ...floorMapData, ty: Number(e.target.value) })
          }
          required
          placeholder=" "
        />
        <label
          className="add-floormap-form__placeholder"
          htmlFor="y-coordinate"
        >
          Y Coordinate
        </label>
      </div>

      <div className="add-floormap-form__input-group">
        <input
          id="total-width"
          className="add-floormap-form__input"
          type="number"
          value={floorMapData.tw}
          onChange={(e) =>
            setFloorMapData({ ...floorMapData, tw: Number(e.target.value) })
          }
          required
          placeholder=" "
        />
        <label className="add-floormap-form__placeholder" htmlFor="total-width">
          Total Width
        </label>
      </div>

      <div className="add-floormap-form__input-group">
        <input
          id="total-height"
          className="add-floormap-form__input"
          type="number"
          value={floorMapData.th}
          onChange={(e) =>
            setFloorMapData({ ...floorMapData, th: Number(e.target.value) })
          }
          required
          placeholder=" "
        />
        <label
          className="add-floormap-form__placeholder"
          htmlFor="total-height"
        >
          Total Height
        </label>
      </div>

      <div className="add-floormap-form__actions">
        <button
          className="add-floormap-form__button add-floormap-form__button--submit"
          type="submit"
        >
          Add
        </button>

        <button
          className="add-floormap-form__button add-floormap-form__button--cancel"
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

export default AddFloorMapForm;
