import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import "./_assetTable.scss";
import {useNavigate} from "react-router-dom";

const AssetTable = ({ assets }) => {
  const styles = {
    iconButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "16px",
    },
  };
  const navigate = useNavigate();

  return (
    <>
      <ul className="responsive-table__list">
        <li className="responsive-table__list-item responsive-table__list-item--header">
          <div className="responsive-table__column responsive-table__column--1">
            ID
          </div>
          <div className="responsive-table__column responsive-table__column--2">
            Name
          </div>
          <div className="responsive-table__column responsive-table__column--3">
            X
          </div>
          <div className="responsive-table__column responsive-table__column--4">
            Y
          </div>
          <div className="responsive-table__column responsive-table__column--5">
            Last Sync
          </div>
          <div className="responsive-table__column responsive-table__column--6">
            Floor Map Name
          </div>
          <div className="responsive-table__column responsive-table__column--7">
            Details
          </div>
        </li>
        {assets.length > 0 &&
          assets.map((asset) => (
            <li
              key={asset.id}
              className="responsive-table__list-item responsive-table__list-item--row"
            >
              <div
                className="responsive-table__column responsive-table__column--1"
                data-label="ID"
              >
                {asset.id}
              </div>
              <div
                className="responsive-table__column responsive-table__column--2"
                data-label="Name"
              >
                {asset.name}
              </div>
              <div
                className="responsive-table__column responsive-table__column--3"
                data-label="X"
              >
                {asset.x}
              </div>
              <div
                className="responsive-table__column responsive-table__column--4"
                data-label="Y"
              >
                {asset.y}
              </div>
              <div
                className="responsive-table__column responsive-table__column--5"
                data-label="Last sync"
              >
                {new Date(asset.last_sync).toLocaleString()}
              </div>
              <div
                className="responsive-table__column responsive-table__column--6"
                data-label="Floor Map Name"
              >
                {asset.floorMapName}
              </div>
              <div
                className="responsive-table__column responsive-table__column--7"
                data-label="Details"
              >
                <button
                  style={styles.iconButton}
                  onClick={() => navigate(`/assets/${asset.id}`, { state: { asset } })
                  }
                >
                  <FaInfoCircle size={23} />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
};

export default AssetTable;
