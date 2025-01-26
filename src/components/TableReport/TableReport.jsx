import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { FloorMapService } from "../../services/floormapService.js";
import { AssetService } from "../../services/assetService.js";
import { ZoneService } from "../../services/zoneService.js";
import "./_tableReport.scss";
import {cacheService} from "../../services/cacheService.js";

function TableReport() {
  const [floormaps, setFloormaps] = useState([]);
  const [selectedFloormap, setSelectedFloormap] = useState(null);
  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [tableReportData, setTableReportData] = useState(null);
  const [isTableReportVisible, setIsTableReportVisible] = useState(false);

  useEffect(() => {
    const fetchFloormaps = async () => {
      try {
        const data = await cacheService.fetchAndCache(
            "floormaps",
            FloorMapService.getAllFloorMaps
        );
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
    setSelectedAssets([]);
    setTableReportData(null);
    setIsTableReportVisible(false);
  }

  async function handleTableReportGeneration() {
    const aggregatedData = [];

    try {
      const zones = await ZoneService.getZones(selectedFloormap.id);

      if (!zones) {
        console.error("Failed to fetch zones data");
        return;
      }

      const selectedAssetAggregations = await Promise.all(
        selectedAssets.map(async (asset) => {
          const data = await AssetService.getAssetZoneHistory(
            asset.value,
            "2025-01-14T09:00:00",
            "2025-01-15T09:00:00"
          );

          const zoneTimeMap = data.reduce(
            (acc, { zoneId, enterDateTime, exitDateTime }) => {
              const enterTime = new Date(enterDateTime);
              const exitTime = new Date(exitDateTime);

              const timeSpent = (exitTime - enterTime) / (1000 * 60 * 60);

              if (!acc[zoneId]) {
                acc[zoneId] = {
                  assetId: asset.value,
                  assetName: asset.label,
                  zoneId: zoneId,
                  timeSpent: 0,
                };
              }

              acc[zoneId].timeSpent += timeSpent;
              return acc;
            },
            {}
          );

          const enrichedZones = Object.values(zoneTimeMap).map((zone) => {
            const zoneDetails = zones.find((z) => z.id === zone.zoneId);
            return {
              ...zone,
              zoneName: zoneDetails ? zoneDetails.name : "Unknown Zone",
            };
          });

          return enrichedZones;
        })
      );

      selectedAssetAggregations.forEach((assetZones) => {
        aggregatedData.push(...assetZones);
      });

      setTableReportData(aggregatedData);
      setIsTableReportVisible(true);
    } catch (error) {
      console.error("Error generating table report:", error.message);
    }
  }

  return (
    <div>
      <h1>Table Report</h1>
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
      <button onClick={handleTableReportGeneration}>
        Generate Table Report
      </button>

      {isTableReportVisible && tableReportData && (
        <div className="table-report">
          <h2>Table Report for {selectedFloormap.name}</h2>
          <table>
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Zone Name</th>
                <th>Time Spent (hours)</th>
              </tr>
            </thead>
            <tbody>
              {tableReportData.map((row, index) => (
                <tr key={index}>
                  <td>{row.assetName}</td>
                  <td>{row.zoneName}</td>
                  <td>{row.timeSpent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TableReport;
