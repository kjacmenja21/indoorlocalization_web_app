import React, { useEffect, useState, useRef } from "react";
import ReactSelect from "react-select";
import { FloorMapService } from "../../services/floormapService.js";
import { AssetService } from "../../services/assetService.js";
import "./_heatmapReport.scss";
import { cacheService } from "../../services/cacheService.js";

function HeatmapReport() {
  const [floormaps, setFloormaps] = useState([]);
  const [selectedFloormap, setSelectedFloormap] = useState(null);
  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [heatmapData, setHeatmapData] = useState(null);
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const containerSize = { width: 800, height: 600 };
  const imageSize = { width: 1600, height: 1100 };

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
          acc[key] = acc[key] || { x, y, count: 0 };
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

  useEffect(() => {
    if (heatmapData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(zoom, zoom);

      heatmapData.forEach(({ positions }) => {
        positions?.forEach(({ x, y, count }) => {
          const normalizedX = (x / imageSize.width) * imageSize.width;
          const normalizedY = (y / imageSize.height) * imageSize.height;

          const radius = (count * 10) / zoom;
          const gradient = ctx.createRadialGradient(
            normalizedX,
            normalizedY,
            0,
            normalizedX,
            normalizedY,
            radius
          );
          gradient.addColorStop(0, "rgba(255, 0, 0, 0.8)");
          gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

          ctx.beginPath();
          ctx.arc(normalizedX, normalizedY, radius, 0, 2 * Math.PI);
          ctx.fillStyle = gradient;
          ctx.fill();
        });
      });

      ctx.restore();
    }
  }, [heatmapData, zoom]);

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      const limitedX = Math.min(
        Math.max(newX, -imageSize.width * zoom + containerSize.width),
        0
      );
      const limitedY = Math.min(
        Math.max(newY, -imageSize.height * zoom + containerSize.height),
        0
      );

      setPosition({ x: limitedX, y: limitedY });
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="heatmap-report">
      {!isHeatmapVisible && (
        <h1 className="heatmap-report__title">Heatmap Report</h1>
      )}

      {!isHeatmapVisible && (
        <div className="heatmap-report__controls">
          <div className="heatmap-report__form-group">
            <label className="heatmap-report__label">Select a Floor Map:</label>
            <ReactSelect
              className="heatmap-report__select"
              options={floormapOptions}
              onChange={handleFloormapSelect}
              placeholder="Select a Floor Map"
            />
          </div>

          {selectedFloormap && (
            <div className="heatmap-report__form-group">
              <label className="heatmap-report__label">Select Assets:</label>
              <ReactSelect
                className="heatmap-report__select"
                options={assetOptions}
                isMulti
                value={selectedAssets}
                onChange={setSelectedAssets}
                placeholder="Select Assets..."
              />
            </div>
          )}

          <button
            className="heatmap-report__generate-btn"
            onClick={handleHeatMapGeneration}
          >
            Generate Heatmap Report
          </button>
        </div>
      )}

      {isHeatmapVisible && heatmapData && (
        <div className="heatmap-report__heatmap-container">
          <div className="heatmap-report__header">
            <h2 className="heatmap-report__subtitle">
              Floormap Detail for {selectedFloormap.id}
            </h2>
            <button
              className="heatmap-report__reload-btn"
              onClick={handleReload}
            >
              New Report
            </button>
          </div>

          <div
            className="heatmap-report__map-wrapper"
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <div
              className="heatmap-report__map-container"
              style={{
                width: `${containerSize.width}px`,
                height: `${containerSize.height}px`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onMouseDown={(e) => {
                setIsDragging(true);
                setDragStart({
                  x: e.clientX - position.x,
                  y: e.clientY - position.y,
                });
              }}
            >
              <img
                src="https://fapa.jp/fair-2014/wp-content/uploads/2015/05/floormap_16.svg"
                alt="Floor Map"
                draggable={false}
                style={{
                  width: `${imageSize.width}px`,
                  height: `${imageSize.height}px`,
                  position: "absolute",
                  top: position.y,
                  left: position.x,
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                }}
              />
              <canvas
                ref={canvasRef}
                width={imageSize.width}
                height={imageSize.height}
                style={{
                  position: "absolute",
                  top: position.y,
                  left: position.x,
                  width: `${imageSize.width}px`,
                  height: `${imageSize.height}px`,
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeatmapReport;
