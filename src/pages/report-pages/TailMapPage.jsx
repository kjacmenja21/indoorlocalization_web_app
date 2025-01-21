import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { FloorMapService } from "../../services/floormapService.js";
import { AssetService } from "../../services/assetService.js";
import TailMapDisplay from "../../components/TailmapDisplay/TailmapDisplay.jsx";

function TailMapPage() {
  const [floormaps, setFloormaps] = useState([]);
  const [selectedFloormap, setSelectedFloormap] = useState(null);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [tailmapData, setTailmapData] = useState(null);

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
          const response = await AssetService.getPaginatedAssets(
            page,
            itemsPerPage
          );

          if (response && response.page && response.page.length > 0) {
            allAssets = [...allAssets, ...response.page];
            page++;
            hasMoreAssets = page <= response.total_pages;
          } else {
            hasMoreAssets = false;
          }
        }
        const filteredAssets = allAssets.filter(
          (asset) => asset.floormap_id === selectedFloormap.id
        );
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
    setSelectedAsset(null);
    setTailmapData(null);
  }

  async function handleTailMapGeneration() {
    if (!selectedAsset) return;

    try {
      const data = await AssetService.getAssetPositionHistory(
        selectedAsset.value,
        "2025-01-14T09:00:00",
        "2025-01-15T09:00:00"
      );
      setTailmapData(data);
    } catch (error) {
      console.error("Error fetching tailmap data:", error.message);
    }
  }

  return (
    <div>
      <h1>Tailmap Page</h1>
      <div style={{ marginBottom: "20px", width: "300px" }}>
        <label>Select a Floor Map:</label>
        <ReactSelect
          options={floormapOptions}
          onChange={handleFloormapSelect}
          placeholder="Select a Floor Map"
          styles={{
            container: (base) => ({
              ...base,
              marginBottom: "10px",
              width: "100%",
            }),
          }}
        />
      </div>
      {selectedFloormap && (
        <div style={{ marginBottom: "20px", width: "300px" }}>
          <label>Select an Asset:</label>
          <ReactSelect
            options={assetOptions}
            value={selectedAsset}
            onChange={setSelectedAsset}
            placeholder="Select an Asset..."
            styles={{
              container: (base) => ({ ...base, width: "100%" }),
            }}
          />
        </div>
      )}
      <button onClick={handleTailMapGeneration}>Generate Tailmap Report</button>

      {tailmapData && (
        <TailMapDisplay
          floormapId={selectedFloormap.id}
          tailmapData={tailmapData}
        />
      )}
    </div>
  );
}

export default TailMapPage;
