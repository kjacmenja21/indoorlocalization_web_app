import React, { useEffect, useState } from "react";
import "./_addAssetForm.scss";
import { FloorMapService } from "../../services/floormapService.js";

function AddAssetForm({ onAddAsset, closeModal }) {
    const [newAsset, setNewAsset] = useState({
        name: "",
        x: 0,
        y: 0,
        floormap_id: null,
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

    const handleAddAsset = (e) => {
        e.preventDefault();
        if (!newAsset.floormap_id) {
            alert("Please select a floormap.");
            return;
        }
        onAddAsset(newAsset);
        closeModal();
        setNewAsset({ name: "", x: 0, y: 0, floormap_id: null }); // Reset the form
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
                <select
                    id="floormap-select"
                    className="add-asset-form__input"
                    value={newAsset.floormap_id || ""}
                    onChange={(e) =>
                        setNewAsset({ ...newAsset, floormap_id: Number(e.target.value) })
                    }
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
                <label className="add-asset-form__placeholder" htmlFor="floormap-select">
                    Floor Map
                </label>
            </div>

            <div className="add-asset-form__actions">
                <button
                    className="add-asset-form__button add-asset-form__button--submit"
                    type="submit"
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
