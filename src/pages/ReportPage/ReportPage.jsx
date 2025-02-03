import React from "react";
import { Link } from "react-router-dom";
import ReportTabs from "../../components/ReportTabs/ReportTabs";
import "./_reportPage.scss";

function ReportPage() {
  return (
    <div className="report-page">
      <div className="report-page__header">
        <h1 className="report-page__title">Reports</h1>
      </div>
      <ReportTabs></ReportTabs>
    </div>
  );
}

export default ReportPage;
