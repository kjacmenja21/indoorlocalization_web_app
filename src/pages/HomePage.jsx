import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login/Login";
import { AuthService } from "../services/auth/authService";
import { FloorMapService } from "../services/floormapService.js";
import AddFloormapForm from "../components/AddFloormapForm/AddFloormapForm.jsx";
import Modal from "../components/Modal/Modal.jsx";

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [floormaps, setFloormaps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (AuthService.isAuthenticated()) {
      setIsAuthenticated(true);
      // Fetch floor maps if authenticated
      const fetchFloormaps = async () => {
        try {
          const data = await FloorMapService.getAllFloorMaps();
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

  return (
    <div className="home-page">
      {!isAuthenticated ? (
        <Login />
      ) : (
        <div>
          <h2>Floor Maps</h2>
          <Modal buttonText="Add New Floor Map" title="Add New Floor Map">
            <AddFloormapForm />
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
                    src={floormap.image}
                    alt={floormap.name}
                    className="floormap-image"
                  />
                  <p>{floormap.name}</p>
                  <button
                    className="floormap-button"
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
