import React from "react";
import { Link } from "react-router-dom";
import ReportTabs from "../components/ReportTabs/ReportTabs";

function ReportPage() {
  return (
    <>
      <div>
        <h1>Reports</h1>
      </div>
      <ReportTabs></ReportTabs>
    </>
  );
}

export default ReportPage;
