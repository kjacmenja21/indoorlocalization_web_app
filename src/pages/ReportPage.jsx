import React from "react";
import { Link } from "react-router-dom";
import ReportTabs from "../components/ReportTabs/ReportTabs";

function ReportPage() {
  return (
    <>
      <div>
        <h1>Report</h1>
        <p>This is the Report page.</p>

        <Link to="/report/heatmap">
          <button>Go to Heatmap</button>
        </Link>
      </div>
      <ReportTabs></ReportTabs>

      <Link to="/report/table-report">
        <button>Go to Table Report</button>
      </Link>
    </>
  );
}

export default ReportPage;
