import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FloorMapService } from "../services/floormapService.js";
import AssetSimulationService from "../services/assetSimulationService.js";
import FloormapDisplay from "../components/FloormapDisplay/FloormapDisplay.jsx";

function FloormapDetail() {
  const { floormapId } = useParams();
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);

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
      <FloormapDisplay floormapId={floormapId} assets={assets} />
      <button onClick={handleEditZone} style={{ marginTop: "20px" }}>
        Edit Zones
      </button>
    </div>
  );
}

export default FloormapDetail;
