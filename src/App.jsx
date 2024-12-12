import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import AssetPage from "./pages/AssetPage";
import ReportPage from "./pages/ReportPage";
import Layout from "./shared/Layout";
import Login from "./components/Login/Login.jsx";

function App() {
  return (
    <div>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/asset" element={<AssetPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
