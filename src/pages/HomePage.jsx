import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login/Login";
import { AuthService } from "../services/auth/authService";
import {FloorMapService} from "../services/auth/floormapService.js"; // Assuming AuthService exists

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
      <div>
        {!isAuthenticated ? (
            <Login />
        ) : (
            <div>
              <h2>Floor Maps</h2>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {floormaps.length > 0 ? (
                    floormaps.map((floormap) => (
                        <div
                            key={floormap.id}
                            style={{ margin: "10px", cursor: "pointer" }}
                            onClick={() => handleFloormapClick(floormap.id)}
                        >
                          <img
                              src={floormap.image}
                              alt={floormap.name}
                              style={{ width: "200px", height: "150px", objectFit: "cover" }}
                          />
                          <p>{floormap.name}</p>
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
