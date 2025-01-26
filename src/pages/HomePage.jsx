import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login/Login";
import { AuthService } from "../services/auth/authService";
import { FloorMapService } from "../services/floormapService.js";
import AddFloormapForm from "../components/AddFloormapForm/AddFloormapForm.jsx";
import Modal from "../components/Modal/Modal.jsx";
import imageConverterService from "../services/imageConverterService.js";
import {cacheService} from "../services/cacheService.js";

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [floormaps, setFloormaps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (AuthService.isAuthenticated()) {
      setIsAuthenticated(true);
      // Fetch floor maps if authenticated
      console.log("Autenticiran sam")
      const fetchFloormaps = async () => {
        try {
          console.log("Pokusavam dohvatiti floor mape")
          const data = await cacheService.fetchAndCache(
              "floormaps",
              FloorMapService.getAllFloorMaps
          );
          console.log("Dohvatio sam floor mape: ", data)
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
      const newFloormap = await FloorMapService.addFloorMap(floormapData, imageFile);
      setFloormaps([...floormaps, newFloormap]);
    } catch (error) {
      console.error("Error adding floor map:", error.message);
    }}

  return (
    <div className="home-page">
      {!isAuthenticated ? (
        <Login />
      ) : (
        <div>
          <h2>Floor Maps</h2>
          <Modal buttonText="Add New Floor Map" title="Add New Floor Map">
            <AddFloormapForm onAddFloorMap={handleAddFloormap}/>
          </Modal>

          <div className="floormap-grid">
            {floormaps.length > 0 ? (
              floormaps.map((floormap) => (
                <div
                  key={floormap.id}
                  className="floormap-item"
                  onClick={() => handleFloormapClick(floormap.id)}
                >
                  <img
                    src={imageConverterService.getFloorMapImageSource(floormap)}
                    alt={floormap.name}
                    className="floormap-image"
                  />
                  <p>{floormap.name}</p>
                  <button
                    className="btn"
                    onClick={() => handleFloormapClick(floormap.id)}
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p>No floor maps available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
