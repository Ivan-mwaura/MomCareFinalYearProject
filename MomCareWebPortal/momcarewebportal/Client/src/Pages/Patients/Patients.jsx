import { useEffect, useState } from "react";
import "./Patients.scss";
import axios from "axios";
import { CircularProgress, Skeleton } from "@mui/material";
import { useToast } from "../../Components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchMothers } from "../../Redux/getAllMothersSlice";
import { fetchCHWs } from "../../Redux/getAllChwsSlice";
import Cookies from "js-cookie";
import locationData from "./Kenya_Counties_Constituencies_Wards.json";
import PatientsSkeleton from "../../Components/Skeletons/PatientsSkeleton";
import PropTypes from "prop-types";

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [pregnancyStageFilter, setPregnancyStageFilter] = useState("All");
  const [viewingPatient, setViewingPatient] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [wardsList, setWardsList] = useState([]);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get mothers and chws from redux store
  const { data: mothers, loading: mothersLoading } = useSelector((state) => state.mothers);
  const { data: chws, loading: chwsLoading } = useSelector((state) => state.chws);

  useEffect(() => {
    if (!mothers || mothers.length === 0) {
      dispatch(fetchMothers());
    }
  }, [dispatch, mothers]);

  useEffect(() => {
    if (!chws || chws.length === 0) {
      dispatch(fetchCHWs());
    }
  }, [dispatch, chws]);

  // Extract all wards from locationData
  const getAllWards = () => {
    let wards = [];
    Object.keys(locationData).forEach((county) => {
      Object.keys(locationData[county]).forEach((constituency) => {
        wards = [...wards, ...locationData[county][constituency]];
      });
    });
    return wards;
  };

  useEffect(() => {
    setWardsList(getAllWards());
  }, []);

  // Local state for registering a new mother
  const [newMother, setNewMother] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    county: "",
    constituency: "",
    ward: "",
    pregnancyStage: "",
    weeksPregnant: "",
    chwId: "",
    dob: "",
    nationalId: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    dueDate: "",
    password: "",
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;

    // Handle date of birth validation
    if (name === "dob") {
      const selectedDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
        age--;
      }

      if (age < 16) {
        setFormErrors((prev) => ({
          ...prev,
          dob: "Mother must be at least 16 years old",
        }));
        setShowErrorModal(true);
        return;
      }
    }

    // Handle weeks pregnant and due date calculation
    if (name === "weeksPregnant") {
      const weeks = parseInt(value);
      if (!isNaN(weeks)) {
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + (40 - weeks) * 7);

        setNewMother((prev) => ({
          ...prev,
          [name]: value,
          dueDate: dueDate.toISOString().split("T")[0],
        }));
        return;
      }
    }

    setNewMother((prev) => ({ ...prev, [name]: value }));

    if (name === "county") {
      setNewMother((prev) => ({
        ...prev,
        constituency: "",
        ward: "",
        chwId: "",
      }));
    }
    if (name === "constituency") {
      setNewMother((prev) => ({
        ...prev,
        ward: "",
        chwId: "",
      }));
    }
    if (name === "ward") {
      setNewMother((prev) => ({
        ...prev,
        chwId: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Name validations
    if (newMother.firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters long";
    }
    if (newMother.lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters long";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMother.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(newMother.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    // National ID validation
    if (newMother.nationalId.length < 5) {
      errors.nationalId = "National ID must be at least 5 characters long";
    }

    // Emergency contact validations
    if (newMother.emergencyContactName.length < 2) {
      errors.emergencyContactName = "Emergency contact name must be at least 2 characters long";
    }
    if (!phoneRegex.test(newMother.emergencyContactPhone)) {
      errors.emergencyContactPhone = "Please enter a valid emergency contact phone number";
    }
    if (newMother.emergencyContactRelation.length < 2) {
      errors.emergencyContactRelation = "Please specify the relationship";
    }

    // Password validation
    if (newMother.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    // Location validations
    if (!newMother.county) errors.county = "Please select a county";
    if (!newMother.constituency) errors.constituency = "Please select a constituency";
    if (!newMother.ward) errors.ward = "Please select a ward";

    // CHW validation
    if (!newMother.chwId) errors.chwId = "Please select a Community Health Worker";

    // Pregnancy validations
    if (!newMother.pregnancyStage) errors.pregnancyStage = "Please select pregnancy stage";
    if (!newMother.weeksPregnant) {
      errors.weeksPregnant = "Please enter weeks pregnant";
    } else if (newMother.weeksPregnant < 0 || newMother.weeksPregnant > 42) {
      errors.weeksPregnant = "Weeks pregnant must be between 0 and 42";
    }

    // Age validation
    if (newMother.dob) {
      const today = new Date();
      const birthDate = new Date(newMother.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 16) {
        errors.dob = "Mother must be at least 16 years old";
      }
    } else {
      errors.dob = "Date of birth is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterMother = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setShowErrorModal(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const token = Cookies.get("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/mothers/register`,
        {
          firstName: newMother.firstName,
          lastName: newMother.lastName,
          email: newMother.email,
          phone: newMother.phone,
          county: newMother.county,
          constituency: newMother.constituency,
          ward: newMother.ward,
          pregnancyStage: newMother.pregnancyStage,
          weeksPregnant: newMother.weeksPregnant,
          chwId: newMother.chwId,
          dob: newMother.dob,
          nationalId: newMother.nationalId,
          emergencyContactName: newMother.emergencyContactName,
          emergencyContactPhone: newMother.emergencyContactPhone,
          emergencyContactRelation: newMother.emergencyContactRelation,
          dueDate: newMother.dueDate,
          password: newMother.password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        toast({
          title: "✅ Mother Registered",
          description: "The mother has been successfully registered.",
        });
        setShowRegisterForm(false);
        setNewMother({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          county: "",
          constituency: "",
          ward: "",
          pregnancyStage: "",
          weeksPregnant: "",
          chwId: "",
          dob: "",
          nationalId: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          emergencyContactRelation: "",
          dueDate: "",
          password: "",
        });
        setFormErrors({});
        dispatch(fetchMothers());
      }
    } catch (error) {
      console.error("Error registering new mother:", error);

      if (error.response) {
        const { status, data } = error.response;

        if ((status === 400 || status === 409) && data.error && data.field) {
          setFormErrors((prev) => ({
            ...prev,
            [data.field]: data.error,
          }));
          setShowErrorModal(true);
          return;
        }

        if (status === 401) {
          toast({
            title: "❌ Unauthorized",
            description: "You are not authorized to perform this action.",
            variant: "destructive",
          });
          return;
        }

        if (status === 500) {
          toast({
            title: "❌ Server Error",
            description: data.error || "An unexpected error occurred. Please try again later.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "❌ Registration Failed",
          description: data.error || "Failed to register mother. Please try again.",
          variant: "destructive",
        });
      } else if (error.request) {
        toast({
          title: "❌ Network Error",
          description: "No response from server. Please check your internet connection.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "❌ Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Apply filters on mothers
  const filteredPatients = mothers
    ? mothers
        .filter((mother) =>
          mother.firstName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((mother) => riskFilter === "All" || mother.risk === riskFilter)
        .filter((mother) => locationFilter === "All" || mother.ward === locationFilter)
        .filter((mother) =>
          pregnancyStageFilter === "All" || mother.pregnancyStage === pregnancyStageFilter
        )
    : [];

  const handleViewPatient = (patient) => {
    setViewingPatient(patient);
  };

  const handleCloseProfile = () => {
    setViewingPatient(null);
  };

  const entriesPerPage = 10;
  const totalPages = Math.ceil(filteredPatients.length / entriesPerPage);
  const displayedMothers = filteredPatients.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      if (direction === "next" && prevPage < totalPages) return prevPage + 1;
      if (direction === "prev" && prevPage > 1) return prevPage - 1;
      return prevPage;
    });
  };

  // Filter the list of CHWs based on the selected ward
  const filteredCHWs =
    newMother.ward &&
    chws &&
    chws.filter((chw) => chw.ward.toLowerCase() === newMother.ward.toLowerCase());

  // ErrorModal component
  const ErrorModal = ({ errors, onClose }) => {
    return (
      <div className="error-modal">
        <div className="modal-content">
          <div className="error-header">
            <h2>Please Fix the Following Errors</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="error-list">
            {Object.entries(errors).map(([field, error]) => (
              <div key={field} className="error-item">
                <strong>
                  {field.charAt(0).toUpperCase() +
                    field.slice(1).replace(/([A-Z])/g, " $1")}:
                </strong>
                <span>{error}</span>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-primary">
              Close
            </button>
          </div>
        </div>
        <style jsx>{`
          .error-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
           (background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
          }

          .error-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e2e8f0;
          }

          .error-header h2 {
            margin: 0;
            color: #e11d48;
            font-size: 1.25rem;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
          }

          .error-list {
            margin-bottom: 1.5rem;
          }

          .error-item {
            margin-bottom: 0.75rem;
            padding: 0.5rem;
            background-color: #fef2f2;
            border-radius: 4px;
          }

          .error-item strong {
            color: #991b1b;
            margin-right: 0.5rem;
          }

          .error-item span {
            color: #ef4444;
          }

          .modal-footer {
            display: flex;
            justify-content: flex-end;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
          }

          .btn {
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
          }

          .btn-primary {
            background-color: #3b82f6;
            color: white;
            border: none;
          }

          .btn-primary:hover {
            background-color: #2563eb;
          }
        `}</style>
      </div>
    );
  };

  ErrorModal.propTypes = {
    errors: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  return (
    <>
      {mothersLoading || chwsLoading ? (
        <PatientsSkeleton />
      ) : (
        <div className="patients">
          <h1>Patient Management</h1>

          <button className="register-btn" onClick={() => setShowRegisterForm(true)}>
            Register New Mother
          </button>

          {showRegisterForm && (
            <div className="modal">
              <div className="modal-content register-form">
                <div className="form-header">
                  <h2>Register New Mother</h2>
                  <button
                    className="close-btn"
                    onClick={() => setShowRegisterForm(false)}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleRegisterMother}>
                  <div className="form-grid">
                    <div className="form-section">
                      <h3>Personal Information</h3>
                      <div className="form-group">
                        <label>
                          First Name:
                          <input
                            type="text"
                            name="firstName"
                            value={newMother.firstName}
                            onChange={handleRegisterChange}
                            className={formErrors.firstName ? "error" : ""}
                          />
                          {formErrors.firstName && (
                            <span className="error-message">{formErrors.firstName}</span>
                          )}
                        </label>
                        <label>
                          Last Name:
                          <input
                            type="text"
                            name="lastName"
                            value={newMother.lastName}
                            onChange={handleRegisterChange}
                            className={formErrors.lastName ? "error" : ""}
                          />
                          {formErrors.lastName && (
                            <span className="error-message">{formErrors.lastName}</span>
                          )}
                        </label>
                      </div>

                      <div className="form-group">
                        <label>
                          Email:
                          <input
                            type="email"
                            name="email"
                            value={newMother.email}
                            onChange={handleRegisterChange}
                            className={formErrors.email ? "error" : ""}
                          />
                          {formErrors.email && (
                            <span className="error-message">{formErrors.email}</span>
                          )}
                        </label>
                        <label>
                          Phone Number:
                          <input
                            type="tel"
                            name="phone"
                            value={newMother.phone}
                            onChange={handleRegisterChange}
                            className={formErrors.phone ? "error" : ""}
                          />
                          {formErrors.phone && (
                            <span className="error-message">{formErrors.phone}</span>
                          )}
                        </label>
                      </div>

                      <div className="form-group">
                        <label>
                          Date of Birth:
                          <input
                            type="date"
                            name="dob"
                            value={newMother.dob}
                            onChange={handleRegisterChange}
                            className={formErrors.dob ? "error" : ""}
                          />
                          {formErrors.dob && (
                            <span className="error-message">{formErrors.dob}</span>
                          )}
                        </label>
                        <label>
                          National ID:
                          <input
                            type="text"
                            name="nationalId"
                            value={newMother.nationalId}
                            onChange={handleRegisterChange}
                            className={formErrors.nationalId ? "error" : ""}
                          />
                          {formErrors.nationalId && (
                            <span className="error-message">{formErrors.nationalId}</span>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>Emergency Contact</h3>
                      <div className="form-group">
                        <label>
                          Contact Name:
                          <input
                            type="text"
                            name="emergencyContactName"
                            value={newMother.emergencyContactName}
                            onChange={handleRegisterChange}
                            className={formErrors.emergencyContactName ? "error" : ""}
                          />
                          {formErrors.emergencyContactName && (
                            <span className="error-message">
                              {formErrors.emergencyContactName}
                            </span>
                          )}
                        </label>
                        <label>
                          Contact Phone:
                          <input
                            type="tel"
                            name="emergencyContactPhone"
                            value={newMother.emergencyContactPhone}
                            onChange={handleRegisterChange}
                            className={formErrors.emergencyContactPhone ? "error" : ""}
                          />
                          {formErrors.emergencyContactPhone && (
                            <span className="error-message">
                              {formErrors.emergencyContactPhone}
                            </span>
                          )}
                        </label>
                      </div>
                      <div className="form-group">
                        <label>
                          Relationship:
                          <input
                            type="text"
                            name="emergencyContactRelation"
                            value={newMother.emergencyContactRelation}
                            onChange={handleRegisterChange}
                            className={formErrors.emergencyContactRelation ? "error" : ""}
                          />
                          {formErrors.emergencyContactRelation && (
                            <span className="error-message">
                              {formErrors.emergencyContactRelation}
                            </span>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>Location Information</h3>
                      <div className="form-group">
                        <label>
                          County:
                          <select
                            name="county"
                            value={newMother.county}
                            onChange={handleRegisterChange}
                            className={formErrors.county ? "error" : ""}
                          >
                            <option value="">Select County</option>
                            {Object.keys(locationData).map((county) => (
                              <option key={county} value={county}>
                                {county}
                              </option>
                            ))}
                          </select>
                          {formErrors.county && (
                            <span className="error-message">{formErrors.county}</span>
                          )}
                        </label>
                        <label>
                          Constituency:
                          <select
                            name="constituency"
                            value={newMother.constituency}
                            onChange={handleRegisterChange}
                            disabled={!newMother.county}
                            className={formErrors.constituency ? "error" : ""}
                          >
                            <option value="">Select Constituency</option>
                            {newMother.county &&
                              Object.keys(locationData[newMother.county]).map(
                                (constituency) => (
                                  <option key={constituency} value={constituency}>
                                    {constituency}
                                  </option>
                                )
                              )}
                          </select>
                          {formErrors.constituency && (
                            <span className="error-message">{formErrors.constituency}</span>
                          )}
                        </label>
                      </div>
                      <div className="form-group">
                        <label>
                          Ward:
                          <select
                            name="ward"
                            value={newMother.ward}
                            onChange={handleRegisterChange}
                            disabled={!newMother.constituency}
                            className={formErrors.ward ? "error" : ""}
                          >
                            <option value="">Select Ward</option>
                            {newMother.constituency &&
                              locationData[newMother.county][newMother.constituency].map(
                                (ward) => (
                                  <option key={ward} value={ward}>
                                    {ward}
                                  </option>
                                )
                              )}
                          </select>
                          {formErrors.ward && (
                            <span className="error-message">{formErrors.ward}</span>
                          )}
                        </label>
                      </div>
                      <div className="form-group">
                        <label>
                          Community Health Worker:
                          <select
                            name="chwId"
                            value={newMother.chwId}
                            onChange={handleRegisterChange}
                            disabled={!newMother.ward || !filteredCHWs || filteredCHWs.length === 0}
                            className={formErrors.chwId ? "error" : ""}
                          >
                            <option value="">Select CHW</option>
                            {filteredCHWs && filteredCHWs.length > 0 ? (
                              filteredCHWs.map((chw) => (
                                <option key={chw.id} value={chw.id}>
                                  {chw.firstName} {chw.lastName}
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>
                                No CHWs available in this ward
                              </option>
                            )}
                          </select>
                          {formErrors.chwId && (
                            <span className="error-message">{formErrors.chwId}</span>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>Pregnancy Information</h3>
                      <div className="form-group">
                        <label>
                          Pregnancy Stage:
                          <select
                            name="pregnancyStage"
                            value={newMother.pregnancyStage}
                            onChange={handleRegisterChange}
                            className={formErrors.pregnancyStage ? "error" : ""}
                          >
                            <option value="">Select Stage</option>
                            <option value="First Trimester">First Trimester</option>
                            <option value="Second Trimester">Second Trimester</option>
                            <option value="Third Trimester">Third Trimester</option>
                          </select>
                          {formErrors.pregnancyStage && (
                            <span className="error-message">{formErrors.pregnancyStage}</span>
                          )}
                        </label>
                        <label>
                          Weeks Pregnant:
                          <input
                            type="number"
                            name="weeksPregnant"
                            value={newMother.weeksPregnant}
                            onChange={handleRegisterChange}
                            min="0"
                            max="42"
                            className={formErrors.weeksPregnant ? "error" : ""}
                          />
                          {formErrors.weeksPregnant && (
                            <span className="error-message">{formErrors.weeksPregnant}</span>
                          )}
                        </label>
                      </div>
                      <div className="form-group">
                        <label>
                          Due Date:
                          <input
                            type="date"
                            name="dueDate"
                            value={newMother.dueDate}
                            onChange={handleRegisterChange}
                            title="Automatically calculated based on weeks pregnant. You can adjust if you know the exact date."
                          />
                        </label>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>Account Setup</h3>
                      <div className="form-group">
                        <label>
                          Password:
                          <input
                            type="password"
                            name="password"
                            value={newMother.password}
                            onChange={handleRegisterChange}
                            className={formErrors.password ? "error" : ""}
                          />
                          {formErrors.password && (
                            <span className="error-message">{formErrors.password}</span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <CircularProgress size={24} /> : "Register Mother"}
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowRegisterForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showErrorModal && (
            <ErrorModal
              errors={formErrors}
              onClose={() => setShowErrorModal(false)}
            />
          )}

          <div className="filters">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="All">All Risks</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">Select Ward</option>
              {wardsList.map((ward, index) => (
                <option key={index} value={ward}>
                  {ward}
                </option>
              ))}
            </select>
            <select
              value={pregnancyStageFilter}
              onChange={(e) => setPregnancyStageFilter(e.target.value)}
            >
              <option value="All">All Stages</option>
              <option value="First Trimester">First Trimester</option>
              <option value="Second Trimester">Second Trimester</option>
              <option value="Third Trimester">Third Trimester</option>
            </select>
          </div>

          <div className="patient-list">
            <h2>Registered Patients</h2>
            {displayedMothers.length === 0 ? (
              <Skeleton variant="rectangular" height={200} />
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Risk Level</th>
                    <th>Location</th>
                    <th>Pregnancy Stage</th>
                    <th>Weeks Pregnant</th>
                    <th>Assigned CHW</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedMothers.map((mother) => (
                    <tr key={mother.id}>
                      <td>
                        {mother.firstName} {mother.lastName}
                      </td>
                      <td>{mother.riskLevel || "Not Assessed"}</td>
                      <td>{mother.ward}</td>
                      <td>{mother.pregnancyStage}</td>
                      <td>{mother.weeksPregnant}</td>
                      <td>{mother.assignedCHW || mother.chwId || "Unassigned"}</td>
                      <td>
                        <button onClick={() => handleViewPatient(mother)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange("prev")}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange("next")}
              >
                Next
              </button>
            </div>
          </div>

          {viewingPatient && (
            <div className="modal">
              <div className="modal-content">
                <h2>{viewingPatient.firstName}'s Profile</h2>
                <p>
                  <strong>Risk Level:</strong> {viewingPatient.riskLevel || "Not Assessed"}
                </p>
                <p>
                  <strong>Location:</strong> {viewingPatient.ward}
                </p>
                <p>
                  <strong>Pregnancy Stage:</strong> {viewingPatient.pregnancyStage}
                </p>
                <p>
                  <strong>Weeks Pregnant:</strong> {viewingPatient.weeksPregnant}
                </p>
                <p>
                  <strong>Assigned CHW:</strong>{" "}
                  {viewingPatient.assignedCHW || viewingPatient.chwId || "Unassigned"}
                </p>
                <h3>Health History</h3>
                <ul>{/* Additional details can be added here */}</ul>
                <button onClick={handleCloseProfile}>Close</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Patients;