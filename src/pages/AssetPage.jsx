import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AssetService } from "../services/auth/assetService.js";
import AssetTable from "../components/AssetTable/AssetTable.jsx";
import AddAssetForm from "../components/AddAssetForm/AddAssetForm.jsx";

function AssetPage() {
  const [assets, setAssets] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0); // Track total assets
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const itemsPerPage = 5;

  // Fetch assets on component mount
  useEffect(() => {
    const fetchPaginatedAssets = async () => {
      try {
        const { data, total } = await AssetService.getPaginatedAssets(
          currentPage,
          itemsPerPage
        );
        setAssets(data);
        setTotalAssets(total); // Keep track of total assets for pagination
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
    <div>
      <h2>Asset List</h2>
      <button
        style={{ marginBottom: "10px", padding: "10px", fontSize: "16px" }}
        onClick={() => setShowAddForm(true)}
      >
        Add Asset
      </button>
      {showAddForm && (
        <AddAssetForm
          onAddAsset={handleAddAsset}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      <AssetTable
        assets={assets.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )}
        onNavigate={(id) => navigate(`/assets/${id}`)}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AssetPage;
