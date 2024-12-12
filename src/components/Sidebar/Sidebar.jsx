import React from "react";
import { Link } from "react-router-dom";
import "./_sidebar.scss";

import { MdOutlineHome } from "react-icons/md";
import { TfiDashboard } from "react-icons/tfi";
import { MdOutlineWebAsset } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";

const Sidebar = () => {
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
      <li className="menu__item">
        <Link to="/dashboard" className="menu__link">
          <i className="menu__icon">
            <TfiDashboard />
          </i>
          <span className="menu__text">Dashboard</span>
        </Link>
      </li>
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
    </ul>
  );
};

export default Sidebar;
