import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./_tableReportDisplay.scss";

function TableReportDisplay({ selectedFloormap, tableReportData }) {
  const rows = tableReportData.map((data, index) => ({
    id: index,
    assetName: data.assetName,
    zoneName: data.zoneName,
    timeSpent: data.timeSpent.toFixed(2),
  }));

  return (
    <div>
      <h2>Report Data for {selectedFloormap.name}</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="table report">
          <TableHead>
            <TableRow>
              <TableCell>Asset Name</TableCell>
              <TableCell>Zone Name</TableCell>
              <TableCell align="right">Time Spent (hours)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.assetName}
                </TableCell>
                <TableCell>{row.zoneName}</TableCell>
                <TableCell align="right">{row.timeSpent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default TableReportDisplay;
