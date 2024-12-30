import React, { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import "./Dashboard.scss";

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [toDoList, setToDoList] = useState([
    { id: 1, task: "Follow up with Jane Doe", completed: false },
    { id: 2, task: "Schedule appointment for Mary Wanjiru", completed: false },
    { id: 3, task: "Update Lucy Akinyi's records", completed: false },
  ]);

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

  const toggleTaskCompletion = (id) => {
    setToDoList((prevList) =>
      prevList.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const user = {
    firstName: "Ivy",
    lastName: "Mitchelle",
  };
  const userInitials = `${user.firstName[0]}${user.lastName[0]}`;



  const filteredMothers = [
    { name: "Jane Doe", risk: "High", appointment: "2024-11-25", notification: "Urgent case flagged" },
    { name: "Mary Wanjiru", risk: "Medium", appointment: "2024-11-26", notification: "Follow-up required" },
    { name: "Lucy Akinyi", risk: "Low", appointment: "2024-12-01", notification: "No alerts" },
  ]
    .filter((mother) =>
      mother.name.toLowerCase().includes(searchQuery)
    )
    .filter((mother) =>
      riskFilter === "All" || mother.risk === riskFilter
    );

  const riskTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "High-Risk Cases",
        data: [12, 19, 10, 15, 22, 30],
        borderColor: "#FF6B8A",
        backgroundColor: "rgba(255, 107, 138, 0.3)",
        fill: true,
      },
    ],
  };

  const chwPerformanceData = {
    labels: ["Susan", "Mary", "John", "Lucy"],
    datasets: [
      {
        label: "Follow-ups Completed",
        data: [15, 25, 20, 10],
        backgroundColor: ["#FF6B8A", "#FFB6C1", "#FFE6EB", "#FF6B8A"],
      },
    ],
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      <div className="dashboard-header">

      <div className="user-info">
          <div className="user-initials">{userInitials}</div>
          <div className="user-welcome">
            <p>Welcome, {user.firstName} {user.lastName}</p>
          </div>
        </div>
        
        <h1>MomCare Dashboard</h1>
        <button onClick={toggleDarkMode}>
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h2>Total Registered Mothers</h2>
          <p>1,245</p>
        </div>
        <div className="card">
          <h2>High-Risk Cases</h2>
          <p>34</p>
        </div>
        <div className="card">
          <h2>Upcoming Appointments</h2>
          <p>78</p>
        </div>
        <div className="card">
          <h2>CHW Performance</h2>
          <p>View Metrics</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart">
          <h2>Risk Trends</h2>
          <Line data={riskTrendData} />
        </div>
        <div className="chart">
          <h2>CHW Performance</h2>
          <Bar data={chwPerformanceData} />
        </div>
      </div>

      <div className="recent-activities">
        <h2>Recent Activities</h2>
        <ul>
          <li>Jane Doe flagged as high-risk on 2024-11-19</li>
          <li>Mary Wanjiru completed an appointment on 2024-11-18</li>
          <li>CHW Susan added a new patient: Lucy Akinyi</li>
        </ul>
      </div>

      <div className="notifications-widget">
        <h2>Notifications</h2>
        <p>2 High-risk cases require immediate attention</p>
        <p>5 missed appointments in the past week</p>
      </div>

      <div className="dashboard-table">
        <h2>Assigned Mothers</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearch}
          />
          <select value={riskFilter} onChange={handleRiskFilter}>
            <option value="All">All Risks</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Risk Status</th>
              <th>Next Appointment</th>
              <th>Notifications</th>
            </tr>
          </thead>
          <tbody>
            {filteredMothers.map((mother, index) => (
              <tr key={index}>
                <td>{mother.name}</td>
                <td className={`${mother.risk.toLowerCase()}-risk`}>{mother.risk}</td>
                <td>{mother.appointment}</td>
                <td>{mother.notification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="to-do-list">
        <h2>To-Do List for CHWs</h2>
        <ul>
          {toDoList.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
              />
              <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                {task.task}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
