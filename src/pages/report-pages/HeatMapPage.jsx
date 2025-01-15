import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import FloormapDetail from "../FloormapDetail.jsx";
import { FloorMapService } from "../../services/floormapService.js";
import ReactSelect from "react-select";
import {AssetService} from "../../services/assetService.js";

function HeatMapPage() {
    const [floormaps, setFloormaps] = useState([]);
    const [selectedFloormap, setSelectedFloormap] = useState(null);
    const [assets, setAssets] = useState([]);
    const [selectedAssets, setSelectedAssets] = useState([]);
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

    useEffect(() => {
        if (!selectedFloormap) return;

        const fetchAssets = async () => {
            let allAssets = [];
            let page = 1;
            const itemsPerPage = 5;
            let hasMoreAssets = true;

            try {
                while (hasMoreAssets) {
                    const response = await AssetService.getPaginatedAssets(page, itemsPerPage);

                    if (response && response.page && response.page.length > 0) {
                        allAssets = [...allAssets, ...response.page];
                        page++;
                        hasMoreAssets = page <= response.total_pages;
                    } else {
                        hasMoreAssets = false;
                    }
                }
                const filteredAssets = allAssets.filter((asset) => asset.floormap_id === selectedFloormap.id);
                setAssets(filteredAssets);
            } catch (error) {
                console.error("Error fetching all assets:", error.message);
            }
        };

        fetchAssets();
    }, [selectedFloormap]);


    const assetOptions = assets.map((asset) => ({
        value: asset.id,
        label: asset.name,
    }));
    function handleFloormapSelect(selectedOption) {
        setSelectedFloormap(selectedOption.floormap);
        setSelectedAssets([]);
    }

    return (
        <div>
            <h1>Heatmap Page</h1>
            <div style={{ marginBottom: "20px", width: "300px" }}>
                <label>Select a Floor Map:</label>
                <ReactSelect
                    options={floormapOptions}
                    onChange={handleFloormapSelect}
                    placeholder="Select a Floor Map"
                    styles={{
                        container: (base) => ({ ...base, marginBottom: "10px", width: "100%" }),
                    }}
                />
            </div>
            {selectedFloormap && (
                <div style={{ marginBottom: "20px", width: "300px" }}>
                    <label>Select Assets:</label>
                    <ReactSelect
                        options={assetOptions}
                        isMulti
                        value={selectedAssets}
                        onChange={setSelectedAssets}
                        placeholder="Select Assets..."
                        styles={{
                            container: (base) => ({ ...base, width: "100%" }),
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default HeatMapPage;
