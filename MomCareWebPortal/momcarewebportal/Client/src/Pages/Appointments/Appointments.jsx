// src/Pages/Appointments/Appointments.jsx
import { useState, useEffect } from "react";
import "./Appointments.scss";
import { useToast } from "../../Components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "../../Redux/getAllAppointmentsSlice";
import axios from "../../utils/axiosConfig";
import AppointmentsSkeleton from "../../Components/Skeletons/AppointmentsSkeleton";

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
  const [formErrors, setFormErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [rescheduleFormData, setRescheduleFormData] = useState({
    date: '',
    time: ''
  });

  const appointmentsPerPage = 10;
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Get appointments from Redux store
  const { data: appointments, loading: appointmentsLoading } = useSelector(
    (state) => state.appointments
  );

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  if (appointmentsLoading) {
    return <AppointmentsSkeleton />;
  }

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
      await axios.put(`/appointments/${appointmentId}/approve`);
      dispatch(fetchAppointments());
      toast({
        title: "✅ Success",
        description: "Appointment approved successfully."
      });
    } catch {
      toast({
        title: "❌ Error",
        description: "Failed to approve appointment."
      });
    }
  };

  // Reschedule appointment
  const handleRescheduleAppointment = (appointment) => {
    setReschedulingAppointment(appointment);
    setRescheduleFormData({
      date: '',
      time: ''
    });
    setFormErrors({});
  };

  const validateRescheduleForm = () => {
    const errors = {};
    
    if (!rescheduleFormData.date) {
      errors.date = 'Date is required';
    } else {
      const selectedDate = new Date(rescheduleFormData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'Date cannot be in the past';
      }
    }
    
    if (!rescheduleFormData.time) {
      errors.time = 'Time is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmReschedule = async () => {
    if (!validateRescheduleForm()) {
      setShowErrorModal(true);
      return;
    }
    
    try {
      await axios.put(`/appointments/${reschedulingAppointment.id}`, {
        date: rescheduleFormData.date,
        time: rescheduleFormData.time
      });
      dispatch(fetchAppointments());
      setReschedulingAppointment(null);
      setRescheduleFormData({ date: '', time: '' });
      setFormErrors({});
      toast({
        title: "✅ Success",
        description: "Appointment rescheduled successfully."
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: error.response?.data?.message || "Failed to reschedule appointment."
      });
    }
  };

  const handleRescheduleFormChange = (e) => {
    const { name, value } = e.target;
    setRescheduleFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
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
      await axios.delete(`/appointments/${cancelingAppointment.id}`);
      dispatch(fetchAppointments());
      setCancelingAppointment(null);
      toast({
        title: "✅ Success",
        description: "Appointment cancelled successfully."
      });
    } catch {
      toast({
        title: "❌ Error",
        description: "Failed to cancel appointment."
      });
    }
  };

  const handleCancelCancel = () => {
    setCancelingAppointment(null);
  };

  const ErrorModal = ({ errors, onClose }) => {
    return (
      <div className="error-modal" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div className="modal-content">
          <div className="error-header">
            <h2>Please Fix the Following Errors</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
          <div className="error-list">
            {Object.entries(errors).map(([field, error]) => (
              <div key={field} className="error-item">
                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {error}
              </div>
            ))}
          </div>
          <div className="error-actions">
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
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
            <p>Please select a new date and time for this appointment.</p>
            <div className="form-group">
              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={rescheduleFormData.date}
                  onChange={handleRescheduleFormChange}
                  className={formErrors.date ? 'error' : ''}
                />
                {formErrors.date && <span className="error-message">{formErrors.date}</span>}
              </label>
            </div>
            <div className="form-group">
              <label>
                Time
                <input
                  type="time"
                  name="time"
                  value={rescheduleFormData.time}
                  onChange={handleRescheduleFormChange}
                  className={formErrors.time ? 'error' : ''}
                />
                {formErrors.time && <span className="error-message">{formErrors.time}</span>}
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={handleConfirmReschedule} className="confirm-btn">
                Confirm Reschedule
              </button>
              <button onClick={handleCancelReschedule} className="cancel-btn">
                Cancel
              </button>
            </div>
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

      {showErrorModal && (
        <ErrorModal 
          errors={formErrors} 
          onClose={() => setShowErrorModal(false)} 
        />
      )}
    </div>
  );
};

export default Appointments;
