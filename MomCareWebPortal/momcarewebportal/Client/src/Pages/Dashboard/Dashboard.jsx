import { useState, useEffect, useRef } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';
import axios from 'axios';
import Cookies from 'js-cookie';
import { saveAs } from 'file-saver';
import DashboardSkeleton from '../../Components/Skeletons/DashboardSkeleton';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.scss';

// Register Chart.js components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  annotationPlugin
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalMothers: 0,
    highRiskCases: 0,
    upcomingAppointments: 0,
    activeCHWs: 0,
    appointmentTrends: [],
    riskChanges: [],
  });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('riskTrends');

  // Refs for each chart to manage instances
  const chartRefs = {
    riskDistribution: useRef(null),
    appointmentAttendance: useRef(null),
    caseDistribution: useRef(null),
    appointmentTrends: useRef(null),
    riskChanges: useRef(null),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch dashboard data
        const dashboardResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(dashboardResponse.data);

        // Fetch analytics data
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const analyticsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/analytics?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAnalyticsData(analyticsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  // Cleanup charts on unmount or update
  useEffect(() => {
    return () => {
      Object.values(chartRefs).forEach((ref) => {
        if (ref.current && ref.current.chartInstance) {
          ref.current.chartInstance.destroy();
        }
      });
    };
  }, []);

  const handleExport = () => {
    if (!analyticsData) return;

    let content = '';
    const dateRange = analyticsData.dateRange;

    switch (reportType) {
      case 'riskTrends':
        content = `Risk Distribution Report\n`;
        content += `Date Range: ${new Date(dateRange.start).toLocaleDateString()} to ${new Date(
          dateRange.end
        ).toLocaleDateString()}\n\n`;
        content += `High Risk: ${analyticsData.riskDistribution.high} (${analyticsData.riskDistribution.percentages.high}%)\n`;
        content += `Low Risk: ${analyticsData.riskDistribution.low} (${analyticsData.riskDistribution.percentages.low}%)\n`;
        break;
      case 'attendance':
        content = `Appointment Attendance Report\n`;
        content += `Date Range: ${new Date(dateRange.start).toLocaleDateString()} to ${new Date(
          dateRange.end
        ).toLocaleDateString()}\n\n`;
        content += `Attended: ${analyticsData.attendanceData.attended} (${analyticsData.attendanceData.percentages.attended}%)\n`;
        content += `Missed: ${analyticsData.attendanceData.missed} (${analyticsData.attendanceData.percentages.missed}%)\n`;
        content += `Scheduled: ${analyticsData.attendanceData.scheduled} (${analyticsData.attendanceData.percentages.scheduled}%)\n`;
        content += `Cancelled: ${analyticsData.attendanceData.cancelled} (${analyticsData.attendanceData.percentages.cancelled}%)\n`;
        break;
      case 'caseDistribution':
        content = `Geographic Distribution Report\n`;
        content += `Date Range: ${new Date(dateRange.start).toLocaleDateString()} to ${new Date(
          dateRange.end
        ).toLocaleDateString()}\n\n`;
        Object.entries(analyticsData.locationDistribution).forEach(([county, data]) => {
          content += `${county}: ${data.count} (${data.percentage}%)\n`;
        });
        break;
      default:
        break;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${reportType}_report_${new Date().toISOString().split('T')[0]}.txt`);
  };

  // Function to get user initials
  const getUserInitials = () => {
    if (!user?.firstName) return 'U';
    const names = user.firstName.split(' ');
    return names.map(name => name[0]).join('').toUpperCase();
  };

  console.log(getUserInitials());

  const handleLogout = async () => {
    try {
      await logout();
      // The AuthContext should handle the redirect to login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  // Chart data for analytics visualizations
  const riskTrendData = {
    labels: ['High', 'Low'],
    datasets: [
      {
        label: 'Risk Distribution',
        data: [
          analyticsData?.riskDistribution.high || 0,
          analyticsData?.riskDistribution.low || 0,
        ],
        backgroundColor: ['#FF6B8A', '#FFE6EB'],
      },
    ],
  };

  const appointmentAttendanceData = {
    labels: ['Attended', 'Missed', 'Scheduled', 'Cancelled'],
    datasets: [
      {
        label: 'Appointment Status',
        data: [
          analyticsData?.attendanceData.attended || 0,
          analyticsData?.attendanceData.missed || 0,
          analyticsData?.attendanceData.scheduled || 0,
          analyticsData?.attendanceData.cancelled || 0,
        ],
        backgroundColor: ['#90EE90', '#FF6B8A', '#FFD700', '#87CEEB'],
      },
    ],
  };

  const caseDistributionData = {
    labels: analyticsData ? Object.keys(analyticsData.locationDistribution) : [],
    datasets: [
      {
        data: analyticsData
          ? Object.values(analyticsData.locationDistribution).map((d) => d.count)
          : [],
        backgroundColor: ['#FF6347', '#FFD700', '#90EE90', '#87CEEB', '#FFB6C1'],
      },
    ],
  };

  // Chart data for dashboard visualizations
  const appointmentTrendsData = {
    labels: dashboardData?.appointmentTrends?.map((trend) => new Date(trend.date)) || [],
    datasets: [
      {
        label: 'Appointments',
        data: dashboardData?.appointmentTrends?.map((trend) => parseInt(trend.count)) || [],
        borderColor: '#FF6B8A',
        backgroundColor: 'rgba(255, 107, 138, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const riskChangesData = {
    labels: dashboardData?.riskChanges?.map((change) => new Date(change.date)) || [],
    datasets: [
      {
        label: 'High Risk',
        data: dashboardData?.riskChanges?.map((change) => parseInt(change.high)) || [],
        borderColor: '#FF6B8A',
        backgroundColor: 'rgba(255, 107, 138, 0.1)',
        tension: 0.3,
        fill: true,
        yAxisID: 'yHigh',
      },
      {
        label: 'Low Risk',
        data: dashboardData?.riskChanges?.map((change) => parseInt(change.low)) || [],
        borderColor: '#63D8D8',
        backgroundColor: 'rgba(99, 216, 216, 0.1)',
        tension: 0.3,
        fill: true,
        yAxisID: 'yLow',
      },
    ],
  };

  // Common chart options
  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'end' },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += context.parsed.y;
              if (reportType === 'riskTrends' && analyticsData) {
                label += ` (${analyticsData.riskDistribution.percentages[context.label.toLowerCase()]}%)`;
              } else if (reportType === 'attendance' && analyticsData) {
                const status = context.label.toLowerCase();
                label += ` (${analyticsData.attendanceData.percentages[status]}%)`;
              } else if (reportType === 'caseDistribution' && analyticsData) {
                const county = context.label;
                label += ` (${analyticsData.locationDistribution[county].percentage}%)`;
              }
            }
            return label;
          },
        },
      },
    },
  };

  // Specific chart options
  const chartOptions = {
    riskDistribution: {
      ...baseChartOptions,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Cases' },
          ticks: { stepSize: Math.max(...riskTrendData.datasets[0].data) / 5 || 1 },
          suggestedMax: Math.max(...riskTrendData.datasets[0].data) * 1.1 || 10,
        },
        x: {
          grid: { display: false, drawBorder: false },
          title: { display: true, text: 'Risk Level' },
        },
      },
      plugins: {
        ...baseChartOptions.plugins,
        datalabels: {
          formatter: (value, ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} (${percentage}%)`;
          },
          color: '#333333',
          anchor: 'end',
          align: 'top',
        },
      },
    },
    appointmentAttendance: {
      ...baseChartOptions,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Appointments' },
          ticks: { stepSize: Math.max(...appointmentAttendanceData.datasets[0].data) / 5 || 1 },
          suggestedMax: Math.max(...appointmentAttendanceData.datasets[0].data) * 1.1 || 10,
        },
        x: {
          grid: { display: false, drawBorder: false },
          title: { display: true, text: 'Status' },
        },
      },
      plugins: {
        ...baseChartOptions.plugins,
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              yMin: analyticsData?.attendanceData.missed * 0.1 || 0,
              yMax: analyticsData?.attendanceData.missed * 0.1 || 0,
              borderColor: '#63D8D8',
              borderWidth: 2,
              label: { content: 'Target Miss Rate (10%)', enabled: true, position: 'center' },
            },
          },
        },
      },
    },
    caseDistribution: {
      ...baseChartOptions,
      plugins: {
        ...baseChartOptions.plugins,
        datalabels: {
          formatter: (value, ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${ctx.chart.data.labels[ctx.dataIndex]}: ${value} (${percentage}%)`;
          },
          color: '#333333',
          anchor: 'center',
          align: 'center',
        },
      },
    },
    appointmentTrends: {
      ...baseChartOptions,
      scales: {
        x: {
          type: 'time',
          time: { unit: 'day', displayFormats: { day: 'MMM d' } },
          maxTicksLimit: 10,
          title: { display: true, text: 'Date' },
          grid: { display: false, drawBorder: false },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Appointments' },
          suggestedMax: Math.max(...appointmentTrendsData.datasets[0].data) * 1.1 || 10,
          ticks: { stepSize: Math.max(...appointmentTrendsData.datasets[0].data) / 5 || 1 },
        },
      },
    },
    riskChanges: {
      ...baseChartOptions,
      scales: {
        yHigh: {
          beginAtZero: true,
          position: 'left',
          title: { display: true, text: 'High Risk Cases' },
          suggestedMax: Math.max(...riskChangesData.datasets[0].data) * 1.1 || 10,
          ticks: { stepSize: Math.max(...riskChangesData.datasets[0].data) / 5 || 1 },
        },
        yLow: {
          beginAtZero: true,
          position: 'right',
          title: { display: true, text: 'Low Risk Cases' },
          suggestedMax: Math.max(...riskChangesData.datasets[1].data) * 1.1 || 10,
          ticks: { stepSize: Math.max(...riskChangesData.datasets[1].data) / 5 || 1 },
        },
        x: {
          type: 'time',
          time: { unit: 'day', displayFormats: { day: 'MMM d' } },
          maxTicksLimit: 10,
          title: { display: true, text: 'Date' },
          grid: { display: false, drawBorder: false },
        },
      },
      plugins: {
        ...baseChartOptions.plugins,
        annotation: {
          annotations: {
            threshold: {
              type: 'line',
              yMin: 100, // Adjust based on historical data or policy
              yMax: 100,
              borderColor: '#FF6B8A',
              borderWidth: 2,
              label: { content: 'High Risk Threshold', enabled: true, position: 'center' },
            },
          },
        },
      },
    },
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <div className="user-initials">
            {getUserInitials()}
          </div>
          <div className="user-welcome">
            <p>Welcome, {user?.firstName || ''}</p>
          </div>
        </div>
        <h1>Dashboard & Analytics</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Mothers</h3>
          <p>{dashboardData.totalMothers}</p>
        </div>
        <div className="card">
          <h3>High Risk Cases</h3>
          <p>{dashboardData.highRiskCases}</p>
        </div>
        <div className="card">
          <h3>Upcoming Appointments</h3>
          <p>{dashboardData.upcomingAppointments}</p>
        </div>
        <div className="card">
          <h3>Active CHWs</h3>
          <p>{dashboardData.activeCHWs}</p>
        </div>
      </div>

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

      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Risk Distribution</h3>
          <Bar
            ref={chartRefs.riskDistribution}
            data={riskTrendData}
            options={chartOptions.riskDistribution}
            height={300}
          />
        </div>
        <div className="chart-container">
          <h3>Appointment Attendance</h3>
          <Bar
            ref={chartRefs.appointmentAttendance}
            data={appointmentAttendanceData}
            options={chartOptions.appointmentAttendance}
            height={300}
          />
        </div>
        <div className="chart-container">
          <h3>Geographic Distribution of Cases</h3>
          <Pie
            ref={chartRefs.caseDistribution}
            data={caseDistributionData}
            options={chartOptions.caseDistribution}
            height={300}
          />
        </div>
        <div className="chart-container">
          <h3>Appointment Trends</h3>
          <Line
            ref={chartRefs.appointmentTrends}
            data={appointmentTrendsData}
            options={chartOptions.appointmentTrends}
            height={300}
          />
        </div>
        <div className="chart-container">
          <h3>Risk Level Changes</h3>
          <Line
            ref={chartRefs.riskChanges}
            data={riskChangesData}
            options={chartOptions.riskChanges}
            height={300}
          />
        </div>
      </div>

      <div className="reports">
        <h2>Generate Reports</h2>
        <div className="report-controls">
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="riskTrends">Risk Trends Report</option>
            <option value="attendance">Appointment Attendance Report</option>
            <option value="caseDistribution">Geographic Case Distribution Report</option>
          </select>
          <button onClick={handleExport}>Export Report</button>
        </div>
        <div className="report-preview">
          <h3>Report Preview: {reportType}</h3>
          <p>
            Date Range: {analyticsData?.dateRange.start
              ? new Date(analyticsData.dateRange.start).toLocaleDateString()
              : 'N/A'}{' '}
            to{' '}
            {analyticsData?.dateRange.end
              ? new Date(analyticsData.dateRange.end).toLocaleDateString()
              : 'N/A'}
          </p>
          {reportType === 'riskTrends' && analyticsData && (
            <div>
              <p>
                High Risk: {analyticsData.riskDistribution.high} (
                {analyticsData.riskDistribution.percentages.high}%)
              </p>
              <p>
                Low Risk: {analyticsData.riskDistribution.low} (
                {analyticsData.riskDistribution.percentages.low}%)
              </p>
            </div>
          )}
          {reportType === 'attendance' && analyticsData && (
            <div>
              <p>
                Attended: {analyticsData.attendanceData.attended} (
                {analyticsData.attendanceData.percentages.attended}%)
              </p>
              <p>
                Missed: {analyticsData.attendanceData.missed} (
                {analyticsData.attendanceData.percentages.missed}%)
              </p>
              <p>
                Scheduled: {analyticsData.attendanceData.scheduled} (
                {analyticsData.attendanceData.percentages.scheduled}%)
              </p>
              <p>
                Cancelled: {analyticsData.attendanceData.cancelled} (
                {analyticsData.attendanceData.percentages.cancelled}%)
              </p>
            </div>
          )}
          {reportType === 'caseDistribution' && analyticsData && (
            <div>
              {Object.entries(analyticsData.locationDistribution).map(([county, data]) => (
                <p key={county}>
                  {county}: {data.count} ({data.percentage}%)
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;