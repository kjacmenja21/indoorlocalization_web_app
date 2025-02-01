import React, { useEffect, useState } from "react";
import { AssetService } from "../../services/assetService.js";
import AssetTable from "../../components/AssetTable/AssetTable.jsx";
import AddAssetForm from "../../components/AddAssetForm/AddAssetForm.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import "./_assetPage.scss";
import { AssetPropType } from "../../core/types/assetPropType.js";
import { FloorMapService } from "../../services/floormapService.js";

function AssetPage() {
  const [assets, setAssets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAssetsWithFloorMapNames = async () => {
      try {
        // Fetch paginated assets
        const { page, total_pages } = await AssetService.getPaginatedAssets(
            currentPage,
            itemsPerPage
        );

        // Fetch floor maps for associated assets
        const floorMapIds = [...new Set(page.map((asset) => asset.floormap_id))];
        const floorMaps = await Promise.all(
            floorMapIds.map((id) => FloorMapService.getFloorMapById(id))
        );

        // Create a lookup dictionary for floor map names
        const floorMapIdToName = floorMaps.reduce((acc, floorMap) => {
          acc[floorMap.id] = floorMap.name;
          return acc;
        }, {});

        // Map assets with floor map names
        const assetsWithNames = page.map((asset) => ({
          ...asset,
          floorMapName: floorMapIdToName[asset.floormap_id] || "Unknown Floor",
        }));

        // Update state
        setAssets(assetsWithNames);
        setTotalPages(total_pages); // Set total available pages
      } catch (error) {
        console.error("Error fetching assets or floor maps:", error.message);
      }
    };

    fetchAssetsWithFloorMapNames();
  }, [currentPage]);

  // Pagination handlers
  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "next" && prev < totalPages) return prev + 1;
      if (direction === "prev" && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleAddingAsset = async (newAsset) => {
    try {
      console.log("New asset:", newAsset);
      const addedAsset = await AssetService.addAsset(newAsset);
      setAssets((prev) => [...prev, addedAsset]);
    } catch (error) {
      console.error("Error adding asset:", error.message);
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
              <AddAssetForm onAddAsset={handleAddingAsset} />
            </Modal>
          </div>
        </div>

        <AssetTable assets={assets} />

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
