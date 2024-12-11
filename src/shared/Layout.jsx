import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        {children} {/* This renders the page-specific content */}
      </div>
    </div>
  );
};

export default Layout;
