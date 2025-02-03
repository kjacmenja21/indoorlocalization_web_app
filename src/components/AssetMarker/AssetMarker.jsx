import React, { useState, useEffect, useCallback } from "react";
import { cacheService } from "../../services/cacheService";

const AssetMarkers = ({
                        assets,
                        zoom,
                        position,
                        setActiveAsset,
                        activeAsset,
                        imageSize,
                        containerSize,
                        fetchAssetById, // Function to fetch asset data from backend
                      }) => {
  const [draggingAsset, setDraggingAsset] = useState(null);
  const [assetNames, setAssetNames] = useState({});

  const fetchAssetName = useCallback(async (assetId) => {
    try {
      const assetData = await cacheService.fetchAndCache("assets", fetchAssetById, assetId);
      setAssetNames((prev) => ({
        ...prev,
        [assetId]: assetData?.name || "Unknown",
      }));
    } catch (error) {
      console.error("Failed to fetch asset:", error);
    }
  }, [fetchAssetById]);

  useEffect(() => {
    assets.forEach((asset) => {
      if (!assetNames[asset.id]) {
        fetchAssetName(asset.id);
      }
    });
  }, [assets, fetchAssetName, assetNames]);

  const handleMouseDown = (e, asset) => {
    e.preventDefault();
    setDraggingAsset(asset.id);
  };

  const handleMouseMove = (e) => {
    if (!draggingAsset) return;

    const asset = assets.find((a) => a.id === draggingAsset);
    if (!asset) return;

    const visibleBounds = {
      left: Math.max(position.x, 0),
      top: Math.max(position.y, 0),
      right: Math.min(position.x + imageSize.width * zoom, containerSize.width),
      bottom: Math.min(position.y + imageSize.height * zoom, containerSize.height),
    };

    const newX = (e.clientX - position.x) / zoom;
    const newY = (e.clientY - position.y) / zoom;

    const limitedX = Math.min(
        Math.max(newX, (visibleBounds.left - position.x) / zoom),
        (visibleBounds.right - position.x) / zoom
    );
    const limitedY = Math.min(
        Math.max(newY, (visibleBounds.top - position.y) / zoom),
        (visibleBounds.bottom - position.y) / zoom
    );

    setActiveAsset({ ...asset, x: limitedX, y: limitedY });
  };

  const handleMouseUp = () => {
    setDraggingAsset(null);
  };

  return (
      <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        {assets.map((asset) => (
            <div
                key={asset.id}
                onMouseDown={(e) => handleMouseDown(e, asset)}
                style={{
                  position: "absolute",
                  top: asset.y * zoom + position.y,
                  left: asset.x * zoom + position.x,
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: activeAsset?.id === asset.id ? "blue" : "red",
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                }}
            >
              <p
                  style={{
                    width: "200px",
                    height: "20px",
                    margin: "0",
                    transform: "translate(15px, -5px)",
                  }}
              >
                {assetNames[asset.id] || "Active asset"}
              </p>
            </div>
        ))}
      </div>
  );
};

export default AssetMarkers;
