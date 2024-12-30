import React, { useState } from "react";
import "./Alerts.scss";

const Alerts = () => {
  const [tab, setTab] = useState("alerts");
  const [viewingPatient, setViewingPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const alerts = Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    type: index % 2 === 0 ? "High-Risk Pregnancy" : "Missed Appointment",
    description: `Alert ${index + 1}: ${index % 2 === 0 ? "Immediate action required" : "Missed appointment"}`,
    patientId: index + 1,
    patientName: `Patient ${index + 1}`,
    date: `2024-11-${(index % 30) + 1}`,
  }));

  const notifications = [
    { id: 1, message: "A new mother, Grace Akinyi, has been registered.", date: "2024-11-14" },
    { id: 2, message: "System maintenance scheduled for 2024-11-20.", date: "2024-11-12" },
  ];

  const alertsPerPage = 10;
  const totalPages = Math.ceil(alerts.length / alertsPerPage);

  const handleTabChange = (tabName) => setTab(tabName);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleViewPatientProfile = (patientId) => {
    // Simulate fetching patient details from an API
    const fetchedPatient = {
      id: patientId,
      name: `Patient ${patientId}`,
      risk: "High",
      location: "Nairobi",
      pregnancyStage: "Second Trimester",
      chw: "Susan",
      visits: ["2024-11-15 - Follow-up required", "2024-10-20 - Routine check"],
      labResults: ["Blood pressure high", "Hemoglobin slightly low"],
      riskAssessments: ["Requires nutritional support"],
    };
    setViewingPatient(fetchedPatient);
  };

  const handleCloseModal = () => setViewingPatient(null);

  const paginatedAlerts = alerts.slice(
    (currentPage - 1) * alertsPerPage,
    currentPage * alertsPerPage
  );

  return (
    <div className="alerts">
      <h1>Alerts and Notifications</h1>

      {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={tab === "alerts" ? "active" : ""}
          onClick={() => handleTabChange("alerts")}
        >
          Alerts
        </button>
        <button
          className={tab === "notifications" ? "active" : ""}
          onClick={() => handleTabChange("notifications")}
        >
          Notifications
        </button>
      </div>

      {/* Alerts Tab */}
      {tab === "alerts" && (
        <div className="alerts-list">
          <h2>Urgent Alerts</h2>
          {paginatedAlerts.length === 0 ? (
            <p>No alerts available.</p>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAlerts.map((alert) => (
                    <tr key={alert.id}>
                      <td>{alert.type}</td>
                      <td>{alert.description}</td>
                      <td>{alert.patientName}</td>
                      <td>{alert.date}</td>
                      <td>
                        <button
                          onClick={() => handleViewPatientProfile(alert.patientId)}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {tab === "notifications" && (
        <div className="notifications-list">
          <h2>General Notifications</h2>
          {notifications.length === 0 ? (
            <p>No notifications available.</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <p>{notification.message}</p>
                  <span>{notification.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Modal: Patient Details */}
      {viewingPatient && (
        <div className="modal">
          <div className="modal-content">
            <h2>Patient Profile: {viewingPatient.name}</h2>
            <p>
              <strong>Risk Level:</strong> {viewingPatient.risk}
            </p>
            <p>
              <strong>Location:</strong> {viewingPatient.location}
            </p>
            <p>
              <strong>Pregnancy Stage:</strong> {viewingPatient.pregnancyStage}
            </p>
            <p>
              <strong>Assigned CHW:</strong> {viewingPatient.chw}
            </p>
            <h3>Health History</h3>
            <p>
              <strong>Visits:</strong>
            </p>
            <ul>
              {viewingPatient.visits.map((visit, index) => (
                <li key={index}>{visit}</li>
              ))}
            </ul>
            <p>
              <strong>Lab Results:</strong>
            </p>
            <ul>
              {viewingPatient.labResults.map((result, index) => (
                <li key={index}>{result}</li>
              ))}
            </ul>
            <p>
              <strong>Risk Assessments:</strong>
            </p>
            <ul>
              {viewingPatient.riskAssessments.map((assessment, index) => (
                <li key={index}>{assessment}</li>
              ))}
            </ul>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
