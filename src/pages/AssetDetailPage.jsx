import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AssetService } from "../services/auth/assetService.js";

function AssetDetailPage() {
    const { id } = useParams();
    const [asset, setAsset] = useState(null);

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const fetchedAsset = await AssetService.getAssetById(Number(id));
                setAsset(fetchedAsset);
            } catch (error) {
                console.error("Error fetching asset details:", error.message);
            }
        };

        fetchAsset();
    }, [id]);

    return (
        <div>
            <h2>Asset Details</h2>
            {asset ? (
                <div>
                    <p><strong>ID:</strong> {asset.id}</p>
                    <p><strong>Name:</strong> {asset.name}</p>
                    <p><strong>X:</strong> {asset.x}</p>
                    <p><strong>Y:</strong> {asset.y}</p>
                    <p><strong>Last Sync:</strong> {new Date(asset.lastSync).toLocaleString()}</p>
                    <p><strong>Floor Map Name:</strong> {asset.floorMapName}</p>
                </div>
            ) : (
                <p>Loading asset details...</p>
            )}
        </div>
    );
}

export default AssetDetailPage;
