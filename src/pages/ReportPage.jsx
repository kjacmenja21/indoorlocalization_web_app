import React from "react";
import { Link } from "react-router-dom";

function ReportPage() {
  return (
      <div>
        <h1>Report</h1>
        <p>This is the Report page.</p>

        {/* Link to HeatMapPage */}
        <Link to="/report/heatmap">
          <button>Go to Heatmap</button>
        </Link>
      </div>
  );
}

export default ReportPage;
