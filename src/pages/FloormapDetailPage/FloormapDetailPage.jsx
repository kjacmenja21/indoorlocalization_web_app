import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FloorMapService } from "../../services/floormapService.js";
import AssetSimulationService from "../../services/assetSimulationService.js";
import FloormapDisplay from "../../components/FloormapDisplay/FloormapDisplay.jsx";
import AssetSelector from "../../components/AssetSelector/AssetSelector.jsx";
import "./_floormapDetailPage.scss";

function FloormapDetail() {
  const { floormapId } = useParams();
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [activeAsset, setActiveAssetState] = useState([]);

  const setActiveAsset = useCallback((asset) => {
    setActiveAssetState(asset);
  }, []);

  useEffect(() => {
    FloorMapService.getFloorMapById(floormapId).then((floormap) => {
      if (!floormap) {
        navigate("/floormaps");
        return;
      }
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

  return (
    <div>
      <AssetSelector assets={assets} setActiveAsset={setActiveAsset} />
      <FloormapDisplay
        floormapId={floormapId}
        assets={assets}
        activeAsset={activeAsset}
        setActiveAsset={setActiveAsset}
      />
      <button onClick={handleEditZone} style={{ marginTop: "20px" }}>
        Edit Zones
      </button>
    </div>
  );
}

export default FloormapDetail;
