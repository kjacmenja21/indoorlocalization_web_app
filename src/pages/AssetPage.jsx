import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AssetService } from "../services/auth/assetService.js";

function AssetPage() {
  const [assets, setAssets] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0); // Track total assets
  const [currentPage, setCurrentPage] = useState(1);
  const [newAsset, setNewAsset] = useState({ name: "", x: 0, y: 0, floorMapName: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const itemsPerPage = 5;

  // Fetch assets on component mount
  useEffect(() => {
    const fetchPaginatedAssets = async () => {
      try {
        const { data, total } = await AssetService.getPaginatedAssets(currentPage, itemsPerPage);
        setAssets(data);
        setTotalAssets(total); // Keep track of total assets for pagination
      } catch (error) {
        console.error("Error fetching paginated assets:", error.message);
      }
    };

    fetchPaginatedAssets();
  }, [currentPage]);

  // Pagination logic
  const totalPages = Math.ceil(assets.length / itemsPerPage);
  const paginatedAssets = assets.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Add new asset
  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      const newId = assets.length ? Math.max(...assets.map((a) => a.id)) + 1 : 1;
      const assetToAdd = { ...newAsset, id: newId, lastSync: new Date().toISOString() };
      const updatedAsset = await AssetService.addAsset(assetToAdd);
      setAssets([...assets, updatedAsset]);
      setNewAsset({ name: "", x: 0, y: 0, floorMapName: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding asset:", error.message);
    }
  };

  return (
      <div>
        <h2>Asset List</h2>
        <h2>Mateo nemoj da te buni paginacija kad dodas novi asset... Cim kliknes da ode na drugu stranicu paginacije on napravi poziv za novih 5 asseta pa se ovaj bogec novododani izgubi...Pogle u consolu vidis da se je dodal :)</h2>
        <button style={styles.addButton} onClick={() => setShowAddForm(true)}>
          Add Asset
        </button>
        {showAddForm && (
            <form style={styles.form} onSubmit={handleAddAsset}>
              <h3>Add New Asset</h3>
              <label>
                Name:
                <input
                    type="text"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                    required
                />
              </label>
              <label>
                X Coordinate:
                <input
                    type="number"
                    value={newAsset.x}
                    onChange={(e) => setNewAsset({...newAsset, x: Number(e.target.value)})}
                    required
                />
              </label>
              <label>
                Y Coordinate:
                <input
                    type="number"
                    value={newAsset.y}
                    onChange={(e) => setNewAsset({...newAsset, y: Number(e.target.value)})}
                    required
                />
              </label>
              <label>
                Floor Map Name:
                <input
                    type="text"
                    value={newAsset.floorMapName}
                    onChange={(e) => setNewAsset({...newAsset, floorMapName: e.target.value})}
                    required
                />
              </label>
              <button type="submit">Add</button>
              <button type="button" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </form>
        )}
        <table style={{borderCollapse: "collapse", width: "100%"}}>
          <thead>
          <tr>
            <th style={styles.header}>ID</th>
            <th style={styles.header}>Name</th>
            <th style={styles.header}>X</th>
            <th style={styles.header}>Y</th>
            <th style={styles.header}>Last Sync</th>
            <th style={styles.header}>Floor Map Name</th>
            <th style={styles.header}>Actions</th>
          </tr>
          </thead>
          <tbody>
          {paginatedAssets.length > 0 ? (
              paginatedAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td style={styles.cell}>{asset.id}</td>
                    <td style={styles.cell}>{asset.name}</td>
                    <td style={styles.cell}>{asset.x}</td>
                    <td style={styles.cell}>{asset.y}</td>
                    <td style={styles.cell}>
                      {new Date(asset.lastSync).toLocaleString()}
                    </td>
                    <td style={styles.cell}>{asset.floorMapName}</td>
                    <td style={styles.cell}>
                      <button
                          style={styles.iconButton}
                          onClick={() => navigate(`/assets/${asset.id}`)}
                      >
                        🔍
                      </button>
                    </td>
                  </tr>
              ))
          ) : (
              <tr>
                <td colSpan="7" style={styles.noData}>
                  No assets found.
                </td>
              </tr>
          )}
          </tbody>
        </table>
        <div style={styles.pagination}>
          <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
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

const styles = {
  header: {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f4f4f4",
    textAlign: "left",
  },
  cell: {
    border: "1px solid #ddd",
    padding: "8px",
  },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  noData: {
    textAlign: "center",
    padding: "16px",
    backgroundColor: "#f9f9f9",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  addButton: {
    marginBottom: "10px",
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
};

export default AssetPage;
