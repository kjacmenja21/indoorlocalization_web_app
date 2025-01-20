import React from "react";
import { Link } from "react-router-dom";

function ReportPage() {
  return (
      <div>
        <h1>Report</h1>
        <p>This is the Report page.</p>

        <Link to="/report/heatmap">
            <button>Go to Heatmap</button>
        </Link>
        <Link to="/report/tailmap">
            <button>Go to Tailmap</button>
        </Link>
        <Link to="/report/table-report">
          <button>Go to Table Report</button>
        </Link>
      </div>
  );
}

export default ReportPage;
