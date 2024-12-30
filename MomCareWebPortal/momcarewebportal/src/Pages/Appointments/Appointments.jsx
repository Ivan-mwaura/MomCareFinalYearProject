import React, { useState } from "react";
import "./Appointments.scss";

const Appointments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [chwFilter, setChwFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingAppointment, setViewingAppointment] = useState(null);
  const [reschedulingAppointment, setReschedulingAppointment] = useState(null);
  const [cancelingAppointment, setCancelingAppointment] = useState(null);

  const appointmentsPerPage = 10;

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "Jane Doe",
      chw: "Susan",
      location: "Nairobi",
      date: "2024-11-25",
      time: "10:00 AM",
      purpose: "Antenatal Check-up",
      providerDetails: "Dr. John Smith",
      status: "Pending",
    },
    {
      id: 2,
      patientName: "Mary Wanjiru",
      chw: "Lucy",
      location: "Mombasa",
      date: "2024-11-26",
      time: "11:00 AM",
      purpose: "Postnatal Follow-up",
      providerDetails: "Nurse Mary Jane",
      status: "Pending",
    },
    // Add more dummy data here
  ]);

  const filteredAppointments = appointments
    .filter((appointment) =>
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (appointment) =>
        locationFilter === "All" || appointment.location === locationFilter
    )
    .filter((appointment) => chwFilter === "All" || appointment.chw === chwFilter)
    .filter(
      (appointment) => dateFilter === "" || appointment.date === dateFilter
    );

  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  const displayedAppointments = filteredAppointments.slice(
    (currentPage - 1) * appointmentsPerPage,
    currentPage * appointmentsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleViewAppointment = (appointment) => {
    setViewingAppointment(appointment);
  };

  const handleCloseAppointment = () => {
    setViewingAppointment(null);
  };

  const handleApproveAppointment = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: "Approved" }
          : appointment
      )
    );
  };

  const handleRescheduleAppointment = (appointment) => {
    setReschedulingAppointment(appointment);
  };

  const handleConfirmReschedule = (newDate, newTime) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === reschedulingAppointment.id
          ? { ...appointment, date: newDate, time: newTime }
          : appointment
      )
    );
    setReschedulingAppointment(null);
  };

  const handleCancelReschedule = () => {
    setReschedulingAppointment(null);
  };

  const handleCancelAppointment = (appointment) => {
    setCancelingAppointment(appointment);
  };

  const handleConfirmCancel = () => {
    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== cancelingAppointment.id)
    );
    setCancelingAppointment(null);
  };

  const handleCancelCancel = () => {
    setCancelingAppointment(null);
  };

  return (
    <div className="appointments">
      <h1>Appointments Management</h1>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by patient name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="All">All Locations</option>
          <option value="Nairobi">Nairobi</option>
          <option value="Mombasa">Mombasa</option>
          <option value="Kisumu">Kisumu</option>
        </select>
        <select value={chwFilter} onChange={(e) => setChwFilter(e.target.value)}>
          <option value="All">All CHWs</option>
          <option value="Susan">Susan</option>
          <option value="Lucy">Lucy</option>
          <option value="Peter">Peter</option>
        </select>
      </div>

      {/* Appointments List */}
      <div className="appointments-list">
        <h2>Scheduled Appointments</h2>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>CHW</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patientName}</td>
                <td>{appointment.chw}</td>
                <td>{appointment.location}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.purpose}</td>
                <td>{appointment.status}</td>
                <td>
                  <button onClick={() => handleViewAppointment(appointment)}>
                    View
                  </button>
                  <button onClick={() => handleApproveAppointment(appointment.id)}>
                    Approve
                  </button>
                  <button onClick={() => handleRescheduleAppointment(appointment)}>
                    Reschedule
                  </button>
                  <button onClick={() => handleCancelAppointment(appointment)}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {/* Modal: Appointment Details */}
      {viewingAppointment && (
        <div className="modal">
          <div className="modal-content">
            <h2>Appointment Details</h2>
            <p>
              <strong>Patient:</strong> {viewingAppointment.patientName}
            </p>
            <p>
              <strong>CHW:</strong> {viewingAppointment.chw}
            </p>
            <p>
              <strong>Location:</strong> {viewingAppointment.location}
            </p>
            <p>
              <strong>Date:</strong> {viewingAppointment.date}
            </p>
            <p>
              <strong>Time:</strong> {viewingAppointment.time}
            </p>
            <p>
              <strong>Purpose:</strong> {viewingAppointment.purpose}
            </p>
            <p>
              <strong>Provider Details:</strong>{" "}
              {viewingAppointment.providerDetails}
            </p>
            <button onClick={handleCloseAppointment}>Close</button>
          </div>
        </div>
      )}

      {/* Modal: Reschedule Confirmation */}
      {reschedulingAppointment && (
        <div className="modal">
          <div className="modal-content">
            <h2>Reschedule Appointment</h2>
            <p>Are you sure you want to reschedule this appointment?</p>
            <input
              type="date"
              onChange={(e) => handleConfirmReschedule(e.target.value, "12:00 PM")}
            />
            <button onClick={handleConfirmReschedule}>Confirm</button>
            <button onClick={handleCancelReschedule}>Cancel</button>
          </div>
        </div>
      )}

      {/* Modal: Cancel Confirmation */}
      {cancelingAppointment && (
        <div className="modal">
          <div className="modal-content">
            <h2>Cancel Appointment</h2>
            <p>Are you sure you want to cancel this appointment?</p>
            <button onClick={handleConfirmCancel}>Yes</button>
            <button onClick={handleCancelCancel}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
