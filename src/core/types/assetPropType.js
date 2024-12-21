import PropTypes from "prop-types";

export const AssetPropType = PropTypes.shape({
    name: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    floormap_id: PropTypes.number.isRequired,
    floormap_name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    last_sync: PropTypes.string.isRequired,
});
