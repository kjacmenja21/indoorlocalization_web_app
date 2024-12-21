import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AssetService } from "../services/assetService.js";
import AssetTable from "../components/AssetTable/AssetTable.jsx";
import AddAssetForm from "../components/AddAssetForm/AddAssetForm.jsx";
import Modal from "../components/Modal/Modal.jsx";
import Pagination from "../components/Pagination/Pagination.jsx";
import "./_pages.scss";

function AssetPage() {
  const [assets, setAssets] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const itemsPerPage = 5;

  // Fetch assets on component mount
  useEffect(() => {
    const fetchPaginatedAssets = async () => {
      try {
        const { current_page, total_pages, page_limit, page } =
          await AssetService.getPaginatedAssets(currentPage, itemsPerPage);
        setAssets(page);
        setTotalAssets(page_limit);
      } catch (error) {
        console.error("Error fetching paginated assets:", error.message);
      }
    };

    fetchPaginatedAssets();
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

  // Add new asset
  const handleAddAsset = async (newAsset) => {
    try {
      const newId = assets.length
        ? Math.max(...assets.map((a) => a.id)) + 1
        : 1;
      const assetToAdd = {
        ...newAsset,
        id: newId,
        lastSync: new Date().toISOString(),
      };
      const updatedAsset = await AssetService.addAsset(assetToAdd);
      setAssets([...assets, updatedAsset]);
      setShowAddForm(false);
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
            <AddAssetForm onAddAsset={handleAddAsset} />
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

export default AssetPage;
