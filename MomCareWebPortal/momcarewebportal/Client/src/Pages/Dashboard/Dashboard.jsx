import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import DashboardSkeleton from '../../Components/Skeletons/DashboardSkeleton';
import './Dashboard.scss';

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [dashboardData, setDashboardData] = useState({
    totalMothers: 0,
    highRiskCases: 0,
    upcomingAppointments: 0,
    activeCHWs: 0,
    appointmentTrends: [],
    riskChanges: [],
    chwPerformance: [],
    upcomingAppointmentsList: [],
    recentAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Use the correct API endpoint
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Dashboard data received:', response.data); // Debug log
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err); // Debug log
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleRiskFilter = (event) => {
    setRiskFilter(event.target.value);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  // Appointment trends data
  const appointmentTrendsData = {
    labels: dashboardData?.appointmentTrends?.map(trend => new Date(trend.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Appointments',
        data: dashboardData?.appointmentTrends?.map(trend => parseInt(trend.count)) || [],
        borderColor: '#FF6B8A',
        backgroundColor: 'rgba(255, 107, 138, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  // Risk level changes data
  const riskChangesData = {
    labels: dashboardData?.riskChanges?.map(change => new Date(change.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'High Risk',
        data: dashboardData?.riskChanges?.map(change => parseInt(change.high)) || [],
        borderColor: '#FF6B8A',
        backgroundColor: 'rgba(255, 107, 138, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Low Risk',
        data: dashboardData?.riskChanges?.map(change => parseInt(change.low)) || [],
        borderColor: '#63D8D8',
        backgroundColor: 'rgba(99, 216, 216, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  // CHW performance data
  const chwPerformanceData = {
    labels: dashboardData?.chwPerformance?.map(chw => chw.name) || [],
    datasets: [
      {
        label: 'Completed Follow-ups',
        data: dashboardData?.chwPerformance?.map(chw => parseInt(chw.completedFollowUps)) || [],
        backgroundColor: '#FFE6EB',
        borderColor: '#FF6B8A'
      },
      {
        label: 'Total Mothers',
        data: dashboardData?.chwPerformance?.map(chw => parseInt(chw.totalMothers)) || [],
        backgroundColor: '#E6F7F7',
        borderColor: '#63D8D8'
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end'
      }
    }
  };

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <div className="dashboard-header">
        <div className="user-info">
          <div className="user-initials">IM</div>
          <div className="user-welcome">
            <p>Welcome, Ivy Mitchelle</p>
          </div>
        </div>
        
        <h1>Dashboard</h1>
        <button onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
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

      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Appointment Trends</h3>
          <Line data={appointmentTrendsData} options={chartOptions} height={300} />
        </div>
        <div className="chart-container">
          <h3>Risk Level Changes</h3>
          <Line data={riskChangesData} options={chartOptions} height={300} />
        </div>
        <div className="chart-container">
          <h3>CHW Performance</h3>
          <Bar data={chwPerformanceData} options={chartOptions} height={300} />
        </div>
      </div>

      <div className="dashboard-lists">
        <div className="upcoming-appointments">
          <h3>Upcoming Appointments</h3>
          {dashboardData.upcomingAppointmentsList?.length > 0 ? (
            <ul>
              {dashboardData.upcomingAppointmentsList.map((appointment, index) => (
                <li key={index}>
                  <span className="date">{new Date(appointment.date).toLocaleDateString()}</span>
                  <span className="name">{appointment.motherName}</span>
                  <span className={`risk ${appointment.riskLevel?.toLowerCase()}`}>
                    {appointment.riskLevel}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No upcoming appointments</p>
          )}
        </div>

        <div className="recent-alerts">
          <h3>Recent Alerts</h3>
          {dashboardData.recentAlerts?.length > 0 ? (
            <ul>
              {dashboardData.recentAlerts.map((alert, index) => (
                <li key={index} className={`alert ${alert.priority}`}>
                  <h4>{alert.title}</h4>
                  <p>{alert.description}</p>
                  <span className="date">{new Date(alert.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No recent alerts</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;