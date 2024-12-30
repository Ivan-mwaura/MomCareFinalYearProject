import React, { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./Analytics.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [reportType, setReportType] = useState("riskTrends");

  const riskTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "% High-Risk Pregnancies",
        data: [30, 35, 28, 40, 42, 38],
        borderColor: "#FF6B8A",
        backgroundColor: "rgba(255, 107, 138, 0.3)",
        fill: true,
      },
    ],
  };

  const chwPerformanceData = {
    labels: ["Susan", "Peter", "Mary", "John"],
    datasets: [
      {
        label: "Follow-Up Rate",
        data: [90, 85, 95, 80],
        backgroundColor: ["#6A5ACD", "#48D1CC", "#FFB6C1", "#FFA07A"],
      },
    ],
  };

  const caseDistributionData = {
    labels: ["Nairobi", "Mombasa", "Kisumu"],
    datasets: [
      {
        data: [50, 30, 20],
        backgroundColor: ["#FF6347", "#FFD700", "#90EE90"],
      },
    ],
  };

  const handleReportGeneration = () => {
    alert("Report generated and ready for download!");
    // Logic for report generation and export can go here
  };

  return (
    <div className="analytics">
      <h1>Analytics and Reports</h1>

      {/* Analytics Dashboard */}
      <div className="dashboard">
        <h2>Analytics Dashboard</h2>
        <div className="charts">
          <div className="chart">
            <h3>Risk Assessment Trends</h3>
            <Line data={riskTrendData} />
          </div>
          <div className="chart">
            <h3>CHW Performance Metrics</h3>
            <Bar data={chwPerformanceData} />
          </div>
          <div className="chart">
            <h3>Geographic Distribution of Cases</h3>
            <Pie data={caseDistributionData} />
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="reports">
        <h2>Generate Reports</h2>
        <div className="report-controls">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="riskTrends">Risk Trends Report</option>
            <option value="chwPerformance">CHW Performance Report</option>
            <option value="caseDistribution">
              Geographic Case Distribution Report
            </option>
          </select>
          <button onClick={handleReportGeneration}>Generate Report</button>
        </div>
        <div className="report-preview">
          <h3>Report Preview: {reportType}</h3>
          <p>
            This section will show a preview of the selected report or provide
            details about the data to be exported.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
