import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Select, MenuItem, Button } from "@mui/material";

const customerData = [
  { month: "January", newCustomers: 50, revenue: 20000 },
  { month: "February", newCustomers: 70, revenue: 30000 },
  { month: "March", newCustomers: 80, revenue: 35000 },
  { month: "April", newCustomers: 65, revenue: 28000 },
  { month: "May", newCustomers: 90, revenue: 40000 },
];


const organizeDataByMonth = (data) => {
  return {
    labels: data.map((entry) => entry.month),
    datasets: [
      {
        label: "New Customers",
        data: data.map((entry) => entry.newCustomers),
        borderColor: "#42A5F5",
        backgroundColor: "rgba(66, 165, 245, 0.2)",
      },
      {
        label: "Revenue ($)",
        data: data.map((entry) => entry.revenue),
        borderColor: "#66BB6A",
        backgroundColor: "rgba(102, 187, 106, 0.2)",
      },
    ],
  };
};

const LineGraph = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [chartData, setChartData] = useState(organizeDataByMonth(customerData));

  useEffect(() => {
    // Fetch or update data based on selectedYear if needed
    setChartData(organizeDataByMonth(customerData));
  }, [selectedYear]);

  const handleDownloadReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(customerData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Customer_Report.xlsx");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Customer Relationship Manager (CRM) Dashboard</h2>
      <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
        <MenuItem value="2023">2023</MenuItem>
        <MenuItem value="2024">2024</MenuItem>
      </Select>
      <Line data={chartData} />
      <Button variant="contained" color="primary" onClick={handleDownloadReport} style={{ marginTop: 20 }}>
        Download Report
      </Button>
    </div>
  );
};

export default LineGraph;
