import React, { useEffect, useState, useRef } from "react";
import ReactSelect from "react-select";
import { FloorMapService } from "../../services/floormapService.js";
import { AssetService } from "../../services/assetService.js";
import "./_tailmapReport.scss";
import { cacheService } from "../../services/cacheService.js";
import imageConverterService from "src/services/imageConverterService.js";

function TailmapReport() {
  const [floormaps, setFloormaps] = useState([]);
  const [selectedFloormap, setSelectedFloormap] = useState(null);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [tailmapData, setTailmapData] = useState(null);
  const [isTailmapVisible, setIsTailmapVisible] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const containerSize = { width: 800, height: 600 };
  const [imageSize, setImageSize] = useState({ width: 1600, height: 1100 });
  const [imgSource, setImgSource] = useState("");

  // Deklaracija floormapOptions prije korištenja u JSX-u
  const floormapOptions = floormaps.map((floormap) => ({
    value: floormap.id,
    label: floormap.name,
    floormap,
  }));

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
    setSelectedAsset(null);
    setTailmapData(null);
    setIsTailmapVisible(false);
  }

  async function handleTailMapGeneration() {
    if (!selectedAsset) return;

    try {
      FloorMapService.getFloorMapById(selectedFloormap.id).then((data) => {
        setImageSize({ width: data.width, height: data.height });
        setImgSource(imageConverterService.getFloorMapImageSource(data));
      });
      const data = await AssetService.getAssetPositionHistory(
        selectedAsset.value,
        "2025-01-14T09:00:00",
        "2025-01-15T09:00:00"
      );
      setTailmapData(data);
      setIsTailmapVisible(true);
    } catch (error) {
      console.error("Error fetching tailmap data:", error.message);
    }
  }

  useEffect(() => {
    if (tailmapData && canvasRef.current && imageSize) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(zoom, zoom);

      ctx.strokeStyle = "rgba(0, 0, 255, 0.8)";
      ctx.lineWidth = 2 / zoom;

      ctx.beginPath();
      tailmapData.forEach(({ x, y }, index) => {
        const normalizedX = (x / imageSize.width) * imageSize.width;
        const normalizedY = (y / imageSize.height) * imageSize.height;

        if (index === 0) {
          ctx.moveTo(normalizedX, normalizedY);
        } else {
          ctx.lineTo(normalizedX, normalizedY);
        }
      });
      ctx.stroke();

      ctx.restore();
    }
  }, [tailmapData, zoom]);

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
    <div className="tailmap-report">
      {!isTailmapVisible && (
        <h1 className="tailmap-report__title">Tailmap Report</h1>
      )}

      {!isTailmapVisible && (
        <div className="tailmap-report__controls">
          <div className="tailmap-report__form-group">
            <label className="tailmap-report__label">Select a Floor Map:</label>
            <ReactSelect
              className="tailmap-report__select"
              options={floormapOptions}
              onChange={handleFloormapSelect}
              placeholder="Select a Floor Map"
            />
          </div>

          {selectedFloormap && (
            <div className="tailmap-report__form-group">
              <label className="tailmap-report__label">Select Asset:</label>
              <ReactSelect
                className="tailmap-report__select"
                options={assetOptions}
                value={selectedAsset}
                onChange={setSelectedAsset}
                placeholder="Select Asset..."
              />
            </div>
          )}

          <button
            className="tailmap-report__generate-btn"
            onClick={handleTailMapGeneration}
          >
            Generate Tailmap Report
          </button>
        </div>
      )}

      {isTailmapVisible && tailmapData && (
        <div className="tailmap-report__tailmap-container">
          <div className="tailmap-report__header">
            <h2 className="tailmap-report__subtitle">
              Floormap Detail for {selectedFloormap.id}
            </h2>
            <button
              className="tailmap-report__reload-btn"
              onClick={handleReload}
            >
              New Report
            </button>
          </div>

          <div
            className="tailmap-report__map-wrapper"
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <div
              className="tailmap-report__map-container"
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
              {imgSource ? (
                  <img
                      src={imgSource}
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
              ) : (
                  <p>Loading image...</p>
              )}
              {imageSize ? (
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
                      }}/>
              ) : (
                  <p>Loading image...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TailmapReport;
