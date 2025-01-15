import React, { useCallback } from "react";
import ReactSelect from "react-select";

const AssetSelector = React.memo(({ assets, setActiveAsset }) => {
  const assetOptions = assets.map((asset) => ({
    value: asset.id,
    label: `Asset ${asset.id}`,
    asset,
  }));

  const handleAssetSelect = useCallback(
    (selectedOption) => {
      setActiveAsset(selectedOption.asset);
    },
    [setActiveAsset]
  );

  return (
    <ReactSelect
      options={assetOptions}
      onChange={handleAssetSelect}
      placeholder="Select an Asset"
      styles={{
        container: (base) => ({
          ...base,
          marginBottom: "10px",
          width: "300px",
        }),
      }}
    />
  );
});

export default AssetSelector;
