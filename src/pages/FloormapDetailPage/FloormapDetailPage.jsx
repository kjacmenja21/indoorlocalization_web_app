import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FloorMapService } from "../../services/floormapService.js";
import AssetSimulationService from "../../services/assetSimulationService.js";
import FloormapDisplay from "../../components/FloormapDisplay/FloormapDisplay.jsx";
import AssetSelector from "../../components/AssetSelector/AssetSelector.jsx";
import "./_floormapDetailPage.scss";
import {cacheService} from "src/services/cacheService.js";

function FloormapDetail() {
  const { floormapId } = useParams();
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [activeAsset, setActiveAssetState] = useState([]);
  const [floormapName, setFloormapName] = useState("");

  const setActiveAsset = useCallback((asset) => {
    setActiveAssetState(asset);
  }, []);

  useEffect(() => {
    FloorMapService.getFloorMapById(floormapId).then((floormap) => {
      if (!floormap) {
        navigate("/floormaps");
        return;
      }
      setFloormapName(floormap.name);
      let assetSimulationService = new AssetSimulationService(
        floormapId,
        floormap.width,
        floormap.height,
        5
      );
      assetSimulationService.startSimulation(setAssets);
    });
  }, [floormapId, navigate]);

  const handleEditZone = () => {
    navigate(`/zone-editing/${floormapId}`);
  };

  function handleDelete() {
    FloorMapService.deleteFloorMap(floormapId).then(() => {
      cacheService.clearCache("floormaps");
      navigate("/");
    });
  }

  return (
    <div className="floormap-detail">
      <div className="header-section">
        <h1 className="title">Floormap: {floormapName}</h1>

        {/* Flex container for dropdown and button */}
        <div className="controls-container">
          <AssetSelector assets={assets} setActiveAsset={setActiveAsset} />
          <button onClick={handleEditZone} className="edit-button">
            Edit Zones
          </button>
          <button onClick={handleDelete}>Delete Floormap</button>
        </div>
      </div>

      <FloormapDisplay
        floormapId={floormapId}
        assets={assets}
        activeAsset={activeAsset}
        setActiveAsset={setActiveAsset}
      />
    </div>
  );
}

export default FloormapDetail;
