import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./_sidebar.scss";

import { MdOutlineHome } from "react-icons/md";
import { MdOutlineWebAsset } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { AuthService } from "../../services/auth/authService.js";

const Sidebar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
          setIsAdmin(user.role === "admin");
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Failed to check user status", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    checkUserStatus();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
    handleNavigation("/login");
  };

  return (
    <ul className="menu">
      <li className="menu__item">
        <Link to="/" className="menu__link">
          <i className="menu__icon">
            <MdOutlineHome />
          </i>
          <span className="menu__text">Floormaps</span>
        </Link>
      </li>
      {isAuthenticated && (
        <>
          <li className="menu__item">
            <Link to="/asset" className="menu__link">
              <i className="menu__icon">
                <MdOutlineWebAsset />
              </i>
              <span className="menu__text">Asset</span>
            </Link>
          </li>
          <li className="menu__item">
            <Link to="/report" className="menu__link">
              <i className="menu__icon">
                <TbReportSearch />
              </i>
              <span className="menu__text">Report</span>
            </Link>
          </li>
          <li className="menu__item">
            <button onClick={handleLogout} className="menu__link">
              <i className="menu__icon">
                <BiLogOut/>
              </i>
              <span className="menu__text">Logout</span>
            </button>
          </li>
        </>
      )}
    </ul>
  );
};

export default Sidebar;
