import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/Login/Login";
import { AuthService } from "../../services/auth/authService";
import { FloorMapService } from "../../services/floormapService.js";
import AddFloormapForm from "../../components/AddFloormapForm/AddFloormapForm.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import imageConverterService from "../../services/imageConverterService.js";
import { cacheService } from "../../services/cacheService.js";
import "./_homePage.scss";

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [floormaps, setFloormaps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      setIsAuthenticated(true);
      const fetchFloormaps = async () => {
        try {
          const data = await cacheService.fetchAndCache(
            "floormaps",
            FloorMapService.getAllFloorMaps
          );
          setFloormaps(data);
        } catch (error) {
          console.error("Error fetching floor maps:", error.message);
        }
      };
      fetchFloormaps();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleFloormapClick = (floormapId) => {
    navigate(`/floormap/${floormapId}`);
  };

  const handleAddFloormap = async (floormapData, imageFile) => {
    try {
      const newFloormap = await FloorMapService.addFloorMap(
        floormapData,
        imageFile
      );
      setFloormaps([...floormaps, newFloormap]);
    } catch (error) {
      console.error("Error adding floor map:", error.message);
    }
  };

  return (
    <div className="home-page">
      {!isAuthenticated ? (
        <Login />
      ) : (
        <div className="home-page__content">
          <div className="home-page__header">
            <h2 className="home-page__title">Floor Maps</h2>
            <Modal buttonText="Add New Floor Map" title="Add New Floor Map">
              <AddFloormapForm onAddFloorMap={handleAddFloormap} />
            </Modal>
          </div>
          <div className="home-page__floormap-grid">
            {floormaps.length > 0 ? (
              floormaps.map((floormap) => (
                <div
                  key={floormap.id}
                  className="home-page__floormap-item"
                  onClick={() => handleFloormapClick(floormap.id)}
                >
                  <img
                    src={imageConverterService.getFloorMapImageSource(floormap)}
                    alt={floormap.name}
                    className="home-page__floormap-image"
                  />
                  <p className="home-page__floormap-name">{floormap.name}</p>
                  <button
                    className="home-page__floormap-button btn"
                    onClick={() => handleFloormapClick(floormap.id)}
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p className="home-page__no-floormaps">
                No floor maps available.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
