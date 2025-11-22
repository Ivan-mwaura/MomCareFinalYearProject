import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./Analytics.scss";
import axios from "../../utils/axiosConfig";
import Cookies from "js-cookie";
import { saveAs } from 'file-saver';
import AnalyticsSkeleton from "../../Components/Skeletons/AnalyticsSkeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const Analytics = () => {
  const [reportType, setReportType] = useState("riskTrends");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const token = Cookies.get("token");

  useEffect(() => {
    fetchAnalytics();
  }, [token, startDate, endDate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/analytics?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!analyticsData) return;

    let content = '';
    const dateRange = analyticsData.dateRange;
    
    switch (reportType) {
      case "riskTrends":
        content = `Risk Distribution Report\n`;
        content += `Date Range: ${new Date(dateRange.start).toLocaleDateString()} to ${new Date(dateRange.end).toLocaleDateString()}\n\n`;
        content += `High Risk: ${analyticsData.riskDistribution.high} (${analyticsData.riskDistribution.percentages.high}%)\n`;
        content += `Low Risk: ${analyticsData.riskDistribution.low} (${analyticsData.riskDistribution.percentages.low}%)\n`;
        break;
      case "attendance":
        content = `Appointment Attendance Report\n`;
        content += `Date Range: ${new Date(dateRange.start).toLocaleDateString()} to ${new Date(dateRange.end).toLocaleDateString()}\n\n`;
        content += `Attended: ${analyticsData.attendanceData.attended} (${analyticsData.attendanceData.percentages.attended}%)\n`;
        content += `Missed: ${analyticsData.attendanceData.missed} (${analyticsData.attendanceData.percentages.missed}%)\n`;
        content += `Scheduled: ${analyticsData.attendanceData.scheduled} (${analyticsData.attendanceData.percentages.scheduled}%)\n`;
        content += `Cancelled: ${analyticsData.attendanceData.cancelled} (${analyticsData.attendanceData.percentages.cancelled}%)\n`;
        break;
      case "caseDistribution":
        content = `Geographic Distribution Report\n`;
        content += `Date Range: ${new Date(dateRange.start).toLocaleDateString()} to ${new Date(dateRange.end).toLocaleDateString()}\n\n`;
        Object.entries(analyticsData.locationDistribution).forEach(([county, data]) => {
          content += `${county}: ${data.count} (${data.percentage}%)\n`;
        });
        break;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${reportType}_report_${new Date().toISOString().split('T')[0]}.txt`);
  };

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (!analyticsData) {
    return <div className="error">Failed to load analytics data</div>;
  }

  const riskTrendData = {
    labels: ["High", "Low"],
    datasets: [
      {
        label: "Risk Distribution",
        data: [
          analyticsData.riskDistribution.high,
          analyticsData.riskDistribution.low
        ],
        backgroundColor: ["#FF6B8A", "#FFE6EB"],
      },
    ],
  };

  const appointmentAttendanceData = {
    labels: ["Attended", "Missed", "Scheduled", "Cancelled"],
    datasets: [
      {
        label: "Appointment Status",
        data: [
          analyticsData.attendanceData.attended,
          analyticsData.attendanceData.missed,
          analyticsData.attendanceData.scheduled,
          analyticsData.attendanceData.cancelled
        ],
        backgroundColor: ["#90EE90", "#FF6B8A", "#FFD700", "#87CEEB"],
      },
    ],
  };

  const caseDistributionData = {
    labels: Object.keys(analyticsData.locationDistribution),
    datasets: [
      {
        data: Object.values(analyticsData.locationDistribution).map(d => d.count),
        backgroundColor: ["#FF6347", "#FFD700", "#90EE90", "#87CEEB", "#FFB6C1"],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
              if (reportType === 'riskTrends') {
                label += ` (${analyticsData.riskDistribution.percentages[context.label.toLowerCase()]}%)`;
              } else if (reportType === 'attendance') {
                const status = context.label.toLowerCase();
                label += ` (${analyticsData.attendanceData.percentages[status]}%)`;
              } else if (reportType === 'caseDistribution') {
                const county = context.label;
                label += ` (${analyticsData.locationDistribution[county].percentage}%)`;
              }
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="analytics">
      <h1>Analytics and Reports</h1>

      {/* Date Range Filter */}
      <div className="date-filter">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
        />
      </div>

      {/* Analytics Dashboard */}
      <div className="dashboard">
        <h2>Analytics Dashboard</h2>
        <div className="charts">
          <div className="chart">
            <h3>Risk Distribution</h3>
            <Bar data={riskTrendData} options={chartOptions} />
          </div>
          <div className="chart">
            <h3>Appointment Attendance</h3>
            <Bar data={appointmentAttendanceData} options={chartOptions} />
          </div>
          <div className="chart">
            <h3>Geographic Distribution of Cases</h3>
            <Pie data={caseDistributionData} options={chartOptions} />
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
            <option value="attendance">Appointment Attendance Report</option>
            <option value="caseDistribution">
              Geographic Case Distribution Report
            </option>
          </select>
          <button onClick={handleExport}>Export Report</button>
        </div>
        <div className="report-preview">
          <h3>Report Preview: {reportType}</h3>
          <p>
            Date Range: {new Date(analyticsData.dateRange.start).toLocaleDateString()} to {new Date(analyticsData.dateRange.end).toLocaleDateString()}
          </p>
          {reportType === "riskTrends" && (
            <div>
              <p>High Risk: {analyticsData.riskDistribution.high} ({analyticsData.riskDistribution.percentages.high}%)</p>
              <p>Low Risk: {analyticsData.riskDistribution.low} ({analyticsData.riskDistribution.percentages.low}%)</p>
            </div>
          )}
          {reportType === "attendance" && (
            <div>
              <p>Attended: {analyticsData.attendanceData.attended} ({analyticsData.attendanceData.percentages.attended}%)</p>
              <p>Missed: {analyticsData.attendanceData.missed} ({analyticsData.attendanceData.percentages.missed}%)</p>
              <p>Scheduled: {analyticsData.attendanceData.scheduled} ({analyticsData.attendanceData.percentages.scheduled}%)</p>
              <p>Cancelled: {analyticsData.attendanceData.cancelled} ({analyticsData.attendanceData.percentages.cancelled}%)</p>
            </div>
          )}
          {reportType === "caseDistribution" && (
            <div>
              {Object.entries(analyticsData.locationDistribution).map(([county, data]) => (
                <p key={county}>{county}: {data.count} ({data.percentage}%)</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
