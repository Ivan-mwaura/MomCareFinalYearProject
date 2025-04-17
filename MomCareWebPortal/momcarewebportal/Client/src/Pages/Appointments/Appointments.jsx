// src/Pages/Appointments/Appointments.jsx
import React, { useState, useEffect } from "react";
import "./Appointments.scss";
import { CircularProgress, Skeleton } from "@mui/material";
import { useToast } from "../../Components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "../../Redux/getAllAppointmentsSlice";
import Cookies from "js-cookie";
import axios from "axios";

const Appointments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [chwFilter, setChwFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingAppointment, setViewingAppointment] = useState(null);
  const [reschedulingAppointment, setReschedulingAppointment] = useState(null);
  const [cancelingAppointment, setCancelingAppointment] = useState(null);
  const [viewingDescription, setViewingDescription] = useState(null);

  const appointmentsPerPage = 10;
  const dispatch = useDispatch();
  const { toast } = useToast();
  const token = Cookies.get("token");

  // Get appointments from Redux store
  const { data: appointments, loading: appointmentsLoading } = useSelector(
    (state) => state.appointments
  );

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch, token]);

  // Apply filters on appointments
  const filteredAppointments = appointments
    ? appointments
        .filter((appointment) =>
          appointment.motherName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(
          (appointment) =>
            locationFilter === "All" || appointment.location === locationFilter
        )
        .filter((appointment) =>
          chwFilter === "All" || appointment.chwId === chwFilter
        )
        .filter(
          (appointment) => dateFilter === "" || appointment.date === dateFilter
        )
    : [];

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

  // Approve appointment via backend PUT request
  const handleApproveAppointment = async (appointmentId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}`,
        { status: "Approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: "Success", description: "Appointment approved." });
      dispatch(fetchAppointments());
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Error approving appointment.",
      });
    }
  };

  // Reschedule appointment
  const handleRescheduleAppointment = (appointment) => {
    setReschedulingAppointment(appointment);
  };

  const handleConfirmReschedule = async (newDate, newTime) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${reschedulingAppointment.id}`,
        { date: newDate, time: newTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: "Success", description: "Appointment rescheduled." });
      dispatch(fetchAppointments());
      setReschedulingAppointment(null);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Error rescheduling appointment.",
      });
    }
  };

  // Missing function added: Cancel reschedule (simply clear reschedule state)
  const handleCancelReschedule = () => {
    setReschedulingAppointment(null);
  };

  // Cancel appointment
  const handleCancelAppointment = (appointment) => {
    setCancelingAppointment(appointment);
  };

  const handleConfirmCancel = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/appointments/${cancelingAppointment.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: "Success", description: "Appointment canceled." });
      dispatch(fetchAppointments());
      setCancelingAppointment(null);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Error canceling appointment.",
      });
    }
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
          placeholder="Search by mother name"
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
          {/* Replace these options with dynamic data as needed */}
          <option value="681bb39d-1fce-4d0b-bc24-048717b69176">CHW 1</option>
          <option value="some-other-chw-id">CHW 2</option>
        </select>
      </div>

      {/* Appointments List */}
      <div className="appointments-list">
        <h2>Scheduled Appointments</h2>
        {appointmentsLoading ? (
          <div className="loading-placeholder">
            {Array.from({ length: appointmentsPerPage }).map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={50} style={{ marginBottom: 10 }} />
            ))}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Mother</th>
                <th>Provider</th>
                <th>Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.motherName}</td>
                  <td>{appointment.provider}</td>
                  <td style={{width:'200px'}}>{appointment.type}</td>
                  <td>{appointment.location}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td className="description-cell" title={appointment.description}>{appointment.description}</td>
                  <td>{appointment.status}</td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleViewAppointment(appointment)}>
                        View
                      </button>
                      {appointment.status === "Pending" && (
                        <button onClick={() => handleApproveAppointment(appointment.id)}>
                          Approve
                        </button>
                      )}
                      <button onClick={() => handleRescheduleAppointment(appointment)}>
                        Reschedule
                      </button>
                      <button onClick={() => handleCancelAppointment(appointment)}>
                        Cancel
                      </button>
                      <button onClick={() => setViewingDescription(appointment)}>
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
              <strong>Mother:</strong> {viewingAppointment.motherName}
            </p>
            <p>
              <strong>Provider:</strong> {viewingAppointment.provider}
            </p>
            <p>
              <strong>Type:</strong> {viewingAppointment.type}
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
              <strong>Description:</strong> {viewingAppointment.description}
            </p>
            <p>
              <strong>Status:</strong> {viewingAppointment.status}
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
              onChange={(e) =>
                handleConfirmReschedule(e.target.value, "12:00:00")
              }
            />
            <button onClick={() => handleConfirmReschedule("2024-12-01", "12:00:00")}>
              Confirm
            </button>
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

      {/* Modal: Description Details */}
      {viewingDescription && (
        <div className="modal">
          <div className="modal-content">
            <h2>Appointment Details</h2>
            <div className="description-content">
              <ul className="description-list">
                {viewingDescription.description.split(';').map((item, index) => (
                  <li key={index}>{item.trim()}</li>
                ))}
              </ul>
            </div>
            <button onClick={() => setViewingDescription(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
