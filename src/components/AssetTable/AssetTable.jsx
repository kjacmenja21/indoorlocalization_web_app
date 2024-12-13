import React from "react";
import "./_assetTable.scss";

const AssetTable = ({ assets, onNavigate }) => {
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
    noData: {
      textAlign: "center",
      padding: "16px",
      backgroundColor: "#f9f9f9",
    },
    iconButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "16px",
    },
  };

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
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
        {assets.length > 0 ? (
          assets.map((asset) => (
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
                  onClick={() => onNavigate(asset.id)}
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
  );
};

export default AssetTable;
