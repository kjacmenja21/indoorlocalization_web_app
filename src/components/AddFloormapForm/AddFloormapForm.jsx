import React, { useState } from "react";
import { FloorMapService } from "../../services/floormapService.js";

function AddFloorMapForm() {
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
            const addedFloorMap = await FloorMapService.addFloorMap(floorMapData, imageFile);
            console.log("Added floor map:", addedFloorMap);
        } catch (error) {
            console.error("Error adding floor map:", error.message);
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                <label>Floor Map Name</label>
                <input
                    type="text"
                    value={floorMapData.name}
                    onChange={(e) => setFloorMapData({ ...floorMapData, name: e.target.value })}
                    required
                />
            </div>

            <div>
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} required />
            </div>

            <div>
                <label>Width</label>
                <input
                    type="number"
                    value={floorMapData.width}
                    onChange={(e) => setFloorMapData({ ...floorMapData, width: e.target.value })}
                    required
                />
            </div>

            <div>
                <label>Height</label>
                <input
                    type="number"
                    value={floorMapData.height}
                    onChange={(e) => setFloorMapData({ ...floorMapData, height: e.target.value })}
                    required
                />
            </div>

            <div>
                <label>X Coordinate</label>
                <input
                    type="number"
                    value={floorMapData.tx}
                    onChange={(e) => setFloorMapData({ ...floorMapData, tx: e.target.value })}
                    required
                />
            </div>

            <div>
                <label>Y Coordinate</label>
                <input
                    type="number"
                    value={floorMapData.ty}
                    onChange={(e) => setFloorMapData({ ...floorMapData, ty: e.target.value })}
                    required
                />
            </div>

            <div>
                <label>Total Width</label>
                <input
                    type="number"
                    value={floorMapData.tw}
                    onChange={(e) => setFloorMapData({ ...floorMapData, tw: e.target.value })}
                    required
                />
            </div>

            <div>
                <label>Total Height</label>
                <input
                    type="number"
                    value={floorMapData.th}
                    onChange={(e) => setFloorMapData({ ...floorMapData, th: e.target.value })}
                    required
                />
            </div>

            <button type="submit">Add Floor Map</button>
        </form>
    );
}

export default AddFloorMapForm;
