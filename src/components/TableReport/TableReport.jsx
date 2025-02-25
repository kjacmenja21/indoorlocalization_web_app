import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { FloorMapService } from "../../services/floormapService.js";
import { AssetService } from "../../services/assetService.js";
import { ZoneService } from "../../services/zoneService.js";
import "./_tableReport.scss";
import { cacheService } from "../../services/cacheService.js";

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
          if (response?.page?.length > 0) {
            allAssets = [...allAssets, ...response.page];
            page++;
            hasMoreAssets = page <= response.total_pages;
          } else hasMoreAssets = false;
        }
        setAssets(
          allAssets.filter((asset) => asset.floormap_id === selectedFloormap.id)
        );
      } catch (error) {
        console.error("Error fetching assets:", error.message);
      }
    };
    fetchAssets();
  }, [selectedFloormap]);

  const assetOptions = assets.map((asset) => ({
    value: asset.id,
    label: asset.name,
  }));

  const handleFloormapSelect = (selectedOption) => {
    setSelectedFloormap(selectedOption.floormap);
    setSelectedAssets([]);
    setTableReportData(null);
    setIsTableReportVisible(false);
  };

  const handleTableReportGeneration = async () => {
    try {
      const zones = await ZoneService.getZones(selectedFloormap.id);
      if (!zones) return;

      const reportData = (
        await Promise.all(
          selectedAssets.map(async (asset) => {
            const history = await AssetService.getAssetZoneHistory(
              asset.value,
              "2025-01-14T09:00:00",
              "2025-01-15T09:00:00"
            );

            return history.map(({ zoneId, enterDateTime, exitDateTime }) => {
              const timeSpent =
                (new Date(exitDateTime) - new Date(enterDateTime)) / 3.6e6;
              const zone = zones.find((z) => z.id === zoneId) || {
                name: "Unknown Zone",
              };
              return {
                assetName: asset.label,
                zoneName: zone.name,
                timeSpent: timeSpent.toFixed(2),
              };
            });
          })
        )
      ).flat();

      setTableReportData(reportData);
      setIsTableReportVisible(true);
    } catch (error) {
      console.error("Report generation failed:", error.message);
    }
  };

  const handleReload = () => window.location.reload();

  return (
    <div className="table-report">
      {!isTableReportVisible && (
        <h1 className="table-report__title">Table Report</h1>
      )}
      {!isTableReportVisible && (
        <div className="table-report__controls">
          <div className="table-report__form-group">
            <label className="table-report__label">Select a Floor Map:</label>
            <ReactSelect
              className="table-report__select"
              options={floormapOptions}
              onChange={handleFloormapSelect}
              placeholder="Select a Floor Map"
            />
          </div>

          {selectedFloormap && (
            <div className="table-report__form-group">
              <label className="table-report__label">Select Assets:</label>
              <ReactSelect
                className="table-report__select"
                options={assetOptions}
                isMulti
                value={selectedAssets}
                onChange={setSelectedAssets}
                placeholder="Select Assets..."
              />
            </div>
          )}

          <button
            className="table-report__generate-btn"
            onClick={handleTableReportGeneration}
          >
            Generate Report
          </button>
        </div>
      )}

      {isTableReportVisible && (
        <div className="table-report__container">
          <div className="table-report__header">
            <h2 className="table-report__subtitle">
              Report for {selectedFloormap?.name}
            </h2>
            <button className="table-report__reload-btn" onClick={handleReload}>
              New Report
            </button>
          </div>

          <ul className="responsive-table__list">
            <li className="responsive-table__list-item responsive-table__list-item--header">
              <div className="responsive-table__column responsive-table__column--1">
                Asset
              </div>
              <div className="responsive-table__column responsive-table__column--2">
                Zone
              </div>
              <div className="responsive-table__column responsive-table__column--3">
                Hours
              </div>
            </li>
            {tableReportData?.map((item, index) => (
              <li
                key={index}
                className="responsive-table__list-item responsive-table__list-item--row"
              >
                <div
                  className="responsive-table__column responsive-table__column--1"
                  data-label="Asset"
                >
                  {item.assetName}
                </div>
                <div
                  className="responsive-table__column responsive-table__column--2"
                  data-label="Zone"
                >
                  {item.zoneName}
                </div>
                <div
                  className="responsive-table__column responsive-table__column--3"
                  data-label="Hours"
                >
                  {item.timeSpent}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TableReport;
