import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { FloorMapService } from "../../services/floormapService.js";
import { AssetService } from "../../services/assetService.js";
import HeatMapDisplay from "../../components/HeatMapDisplay/HeatMapDisplay.jsx";


function HeatMapPage() {
    const [floormaps, setFloormaps] = useState([]);
    const [selectedFloormap, setSelectedFloormap] = useState(null);
    const [assets, setAssets] = useState([]);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [heatmapData, setHeatmapData] = useState(null);
    const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);

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
        setHeatmapData(null);
        setIsHeatmapVisible(false);
    }

    async function handleHeatMapGeneration() {
        const historyOfAssetPositions = [];

        const selectedAssetIds = await Promise.all(
            selectedAssets.map(async (asset) => {
                const data = await AssetService.getAssetPositionHistory(
                    asset.value,
                    "2025-01-14T09:00:00",
                    "2025-01-15T09:00:00"
                );

                const assetHistoryMap = data.reduce((acc, { x, y }) => {
                    const key = `${x},${y}`;

                    if (!acc[key]) {
                        acc[key] = { x, y, count: 0 };
                    }
                    acc[key].count += 1;
                    return acc;
                }, {});

                return {
                    id: asset.value,
                    positions: Object.values(assetHistoryMap),
                };
            })
        );

        historyOfAssetPositions.push(...selectedAssetIds);

        setHeatmapData(historyOfAssetPositions);
        setIsHeatmapVisible(true);
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
            <button onClick={handleHeatMapGeneration}>Generate Heatmap Report</button>

            {isHeatmapVisible && heatmapData && (
                <HeatMapDisplay floormapId={selectedFloormap.id} heatmapData={heatmapData} />
            )}
        </div>
    );
}

export default HeatMapPage;
