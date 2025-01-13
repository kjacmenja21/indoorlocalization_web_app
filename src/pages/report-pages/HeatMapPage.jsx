import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import FloormapDetail from "../FloormapDetail.jsx";
import { FloorMapService } from "../../services/floormapService.js";
import ReactSelect from "react-select";

function HeatMapPage() {
    const [floormaps, setFloormaps] = useState([]);
    const [selectedFloormap, setSelectedFloormap] = useState(null); // Store the selected floor map
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFloormaps = async () => {
            try {
                const data = await FloorMapService.getAllFloorMaps();
                setFloormaps(data);
            } catch (error) {
                console.error("Error fetching floor maps:", error.message);
            }
        };
        fetchFloormaps();
    }, []);

    const floormapOptions = floormaps.map((floormap) => ({
        value: floormap.id,
        label: floormap.name,
        floormap,
    }));

    function handleFloormapSelect(selectedOption) {
        setSelectedFloormap(selectedOption.floormap);
        // Navigate to the FloormapDetail page for the selected floor map
        navigate(`/report/heatmap/heatmap/${selectedOption.value}`);
    }

    return (
        <div>
            <h1>Heatmap Page</h1>
            <ReactSelect
                options={floormapOptions}
                onChange={handleFloormapSelect}
                placeholder="Select a Floor Map"
                styles={{ container: (base) => ({ ...base, marginBottom: "10px", width: "300px" }) }}
            />

            {/* Render FloormapDetail only if a floormap is selected */}
            {selectedFloormap && (
                <Routes>
                    <Route path="/heatmap/:floormapId" element={<FloormapDetail />} />
                </Routes>
            )}
        </div>
    );
}

export default HeatMapPage;
