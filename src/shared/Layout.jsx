import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <div className="layout__navigation">
        <Sidebar />
      </div>

      <div className="layout__content">{children}</div>
    </div>
  );
};

export default Layout;
