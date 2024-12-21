import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AssetService } from "../services/assetService.js";
import AssetTable from "../components/AssetTable/AssetTable.jsx";
import AddAssetForm from "../components/AddAssetForm/AddAssetForm.jsx";
import Modal from "../components/Modal/Modal.jsx";
import Pagination from "../components/Pagination/Pagination.jsx";
import "./_pages.scss";
import {AssetPropType} from "../core/types/assetPropType.js";
import {FloorMapService} from "../services/floormapService.js";

function AssetPage() {
  const [assets, setAssets] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const itemsPerPage = 5;

  // Fetch assets on component mount
  useEffect(() => {
    const fetchAssetsWithFloorMapNames = async () => {
      try {
        const { page, page_limit } = await AssetService.getPaginatedAssets(currentPage, itemsPerPage);
        const floorMapIds = [...new Set(page.map((asset) => asset.floormap_id))];
        const floorMapPromises = floorMapIds.map((id) => FloorMapService.getFloorMapById(id));
        const floorMaps = await Promise.all(floorMapPromises);

        const floorMapIdToName = floorMaps.reduce((acc, floorMap) => {
          acc[floorMap.id] = floorMap.name;
          return acc;
        }, {});

        const assetsWithNames = page.map((asset) => ({
          ...asset,
          floorMapName: floorMapIdToName[asset.floormap_id] || "Unknown Floor",
        }));

        setAssets(assetsWithNames);
        setTotalAssets(page_limit);
      } catch (error) {
        console.error("Error fetching assets or floor maps:", error.message);
      }
    };

    fetchAssetsWithFloorMapNames();
  }, [currentPage]);

  // Pagination logic
  const totalPages = Math.ceil(totalAssets / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
      <div className="asset-page">
        <div className="asset-container">
          <div className="asset-container__header">
            <h2>Asset List</h2>
          </div>
          <div className="asset-container__content">
            <Modal buttonText="Add asset" title="Add new asset">
              <AddAssetForm />
            </Modal>
          </div>
        </div>

        <AssetTable
            assets={assets.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            )}
        />

        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
      </div>
  );
}

AssetPage.propTypes = {
  assets: AssetPropType,
};

export default AssetPage;
