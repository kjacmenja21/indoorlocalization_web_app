import React, { useEffect, useState } from "react";
import "./_addAssetForm.scss";
import { FloorMapService } from "../../services/floormapService.js";

function AddAssetForm({ onAddAsset, closeModal }) {
    const [newAsset, setNewAsset] = useState({
        name: "",
        active: true,
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
        setNewAsset({ name: "", active: true, floormap_id: null }); // Reset the form
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

            {/* Active toggle field */}
            <div className="add-asset-form__input-group">
                <select
                    id="active-select"
                    className="add-asset-form__input"
                    value={newAsset.active ? "Active" : "Inactive"}
                    onChange={(e) => setNewAsset({ ...newAsset, active: e.target.value === "Active" })}
                    required
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
                <label className="add-asset-form__placeholder" htmlFor="active-select">
                    Active
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
