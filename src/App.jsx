import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.jsx";
import AssetPage from "./pages/AssetPage/AssetPage.jsx";
import ReportPage from "./pages/ReportPage/ReportPage.jsx";
import Layout from "./shared/Layout";
import Login from "./components/Login/Login.jsx";
import PrivateRoute from "./core/guard/privateRoute.jsx";
import AssetDetailPage from "./pages/AssetDetailPage/AssetDetailPage.jsx";
import FloormapDetail from "./pages/FloormapDetailPage/FloormapDetailPage.jsx";
import ZoneEditing from "./pages/ZoneEditingPage/ZoneEditingPage.jsx";

function App() {
  return (
    <div>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/floormap/:floormapId"
            element={<PrivateRoute element={FloormapDetail} />}
          />
          <Route path="/asset" element={<PrivateRoute element={AssetPage} />} />
          <Route
            path="/assets/:id"
            element={<PrivateRoute element={AssetDetailPage} />}
          />
          <Route
            path="/report"
            element={<PrivateRoute element={ReportPage} />}
          />
          <Route
            path="/zone-editing/:floormapId"
            element={<PrivateRoute element={ZoneEditing} />}
          />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
