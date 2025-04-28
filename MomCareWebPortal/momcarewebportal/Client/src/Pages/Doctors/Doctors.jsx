import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import "./Doctors.scss";
import { useToast } from "../../Components/ui/use-toast";
import Cookies from "js-cookie";
import DoctorsSkeleton from "../../Components/Skeletons/DoctorsSkeleton"; // Import the skeleton
// Add an import for a spinner or loading indicator if you have one, e.g.:
// import { Spinner } from "../../Components/ui/Spinner"; 

const INITIAL_DOCTOR_STATE = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  hospitalName: "",
  department: "",
  licenseNumber: "",
  yearsOfExperience: "",
  qualifications: "",
  status: "Active",
  searchQuery: ""
};

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false); // <-- Add this state
  const { toast } = useToast();
  const [newDoctor, setNewDoctor] = useState(INITIAL_DOCTOR_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true); // Set loading to true
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/doctors`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        setDoctors(response.data.doctors || []);
      } catch (error) {
        toast({
          title: "❌ Error",
          description: "Failed to fetch doctors."
        });
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchDoctors();
  }, [toast]);

  const doctorsPerPage = 10;
  const totalPages = useMemo(() => Math.ceil(doctors.length / doctorsPerPage), [doctors.length]);
  const filteredDoctors = useMemo(() => {
    if (newDoctor.searchQuery) {
      return doctors.filter((doc) =>
        `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(newDoctor.searchQuery.toLowerCase()) ||
        doc.hospitalName.toLowerCase().includes(newDoctor.searchQuery.toLowerCase())
      );
    }
    return doctors;
  }, [doctors, newDoctor.searchQuery]);

  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * doctorsPerPage;
    return filteredDoctors.slice(start, start + doctorsPerPage);
  }, [filteredDoctors, currentPage, doctorsPerPage]);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({ ...prev, [name]: value }));
  }, []);

  //console.log(newDoctor)

  const validateForm = () => {
    const errors = {};
    
    // Personal Information validation
    if (!newDoctor.firstName?.trim()) {
      errors.firstName = 'First name is required';
    } else if (newDoctor.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!newDoctor.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    } else if (newDoctor.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!newDoctor.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(newDoctor.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!newDoctor.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newDoctor.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!editingDoctor && !newDoctor.password?.trim()) {
      errors.password = 'Password is required';
    } else if (newDoctor.password && newDoctor.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (newDoctor.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(newDoctor.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
    }
    
    // Professional Details validation
    if (!newDoctor.hospitalName?.trim()) {
      errors.hospitalName = 'Hospital name is required';
    }
    
    if (!newDoctor.department?.trim()) {
      errors.department = 'Department is required';
    }
    
    if (!newDoctor.licenseNumber?.trim()) {
      errors.licenseNumber = 'License number is required';
    }
    
    if (!newDoctor.yearsOfExperience) {
      errors.yearsOfExperience = 'Years of experience is required';
    } else if (isNaN(newDoctor.yearsOfExperience) || newDoctor.yearsOfExperience < 0) {
      errors.yearsOfExperience = 'Years of experience must be a positive number';
    }
    
    if (!newDoctor.qualifications?.trim()) {
      errors.qualifications = 'Qualifications are required';
    }
    
    if (!newDoctor.status) {
      errors.status = 'Status is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        setShowErrorModal(true);
        return;
      }
      
      setIsSubmitting(true);
      try {
        const response = editingDoctor
          ? await axios.put(`${import.meta.env.VITE_BACKEND_URL}/doctors/${editingDoctor.id}`, newDoctor, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`
                }
          })
          : await axios.post(`${import.meta.env.VITE_BACKEND_URL}/doctors`, newDoctor, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`
                }
          });
        toast({
          title: "✅ Success",
          description: editingDoctor ? "Doctor updated successfully." : "Doctor registered successfully."
        });
        setDoctors((prev) => {
          if (editingDoctor) {
            return prev.map((doc) => (doc.id === editingDoctor.id ? response.data.doctor : doc));
          }
          return [...prev, response.data.doctor];
        });
        setShowForm(false);
        setNewDoctor(INITIAL_DOCTOR_STATE);
        setEditingDoctor(null);
        setFormErrors({});
        setCurrentStep(1);
      } catch (err) {
        console.error("Error submitting form:", err);
        const backendErrors = {};
        
        // Handle specific error cases
        if (err.response?.status === 400) {
          // Handle validation errors from backend
          if (err.response.data.errors) {
            Object.entries(err.response.data.errors).forEach(([field, message]) => {
              backendErrors[field] = message;
            });
          } else {
            backendErrors.general = err.response.data.message || 'Please check your input and try again.';
          }
        } else if (err.response?.status === 401) {
          backendErrors.auth = 'Your session has expired. Please log in again.';
        } else if (err.response?.status === 403) {
          backendErrors.auth = 'You do not have permission to perform this action.';
        } else if (err.response?.status === 409) {
          // Handle duplicate email/license number errors
          if (err.response.data.errors) {
            Object.entries(err.response.data.errors).forEach(([field, message]) => {
              backendErrors[field] = message;
            });
          } else {
            backendErrors.general = err.response.data.message || 'A duplicate record was found.';
          }
        } else {
          backendErrors.general = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
        }
        
        setFormErrors(backendErrors);
        setShowErrorModal(true);
        
        toast({
          title: "❌ Error",
          description: err.response?.data?.message || "An error occurred while saving the doctor's information."
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [newDoctor, editingDoctor, toast]
  );

  const handleViewDoctor = useCallback((doctor) => {
    setViewingDoctor(doctor);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setViewingDoctor(null);
  }, []);

  const handleAddDoctor = useCallback(() => {
    setShowForm(true);
    setEditingDoctor(null);
    setNewDoctor(INITIAL_DOCTOR_STATE);
    setCurrentStep(1);
  }, []);

  const handleEditDoctor = useCallback((doctor) => {
    setShowForm(true);
    setEditingDoctor(doctor);
    setNewDoctor({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      phone: doctor.phone,
      email: doctor.email,
      password: doctor.password,
      hospitalName: doctor.hospitalName,
      department: doctor.department,
      licenseNumber: doctor.licenseNumber,
      yearsOfExperience: doctor.yearsOfExperience,
      qualifications: doctor.qualifications,
      status: doctor.status,
      searchQuery: ""
    });
    setCurrentStep(1);
  }, []);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  }, [currentPage, totalPages]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  }, [currentPage]);

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
                <strong>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> {error}
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

  if (loading) {
    return <DoctorsSkeleton />;
  }

  return (
    <div className="doctor-management">
      <header className="page-header">
        <h1>Doctor Management</h1>
        <button className="add-doctor-btn" onClick={handleAddDoctor}>
          Add New Doctor
        </button>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search doctors by name or hospital..."
          value={newDoctor.searchQuery || ""}
          onChange={(e) =>
            setNewDoctor((prev) => ({ ...prev, searchQuery: e.target.value }))
          }
        />
      </div>

      <div className="doctor-list">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Hospital</th>
              <th>Department</th>
              <th>License</th>
              <th>Experience</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDoctors.map((doc) => (
              <tr key={doc.id}>
                <td>{`${doc.firstName} ${doc.lastName}`}</td>
                <td>{doc.hospitalName}</td>
                <td>{doc.department}</td>
                <td>{doc.licenseNumber}</td>
                <td>{doc.yearsOfExperience} years</td>
                <td>{doc.phone}</td>
                <td>{doc.status}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleViewDoctor(doc)}>View</button>
                    <button onClick={() => handleEditDoctor(doc)}>Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDoctors.length > doctorsPerPage && (
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal: Doctor Profile */}
      {viewingDoctor && (
        <div className="modal">
          <div className="modal-content">
            <h2>{viewingDoctor.firstName} {viewingDoctor.lastName}'s Profile</h2>
            <div className="profile-details">
              <p><strong>Email:</strong> {viewingDoctor.email}</p>
              <p><strong>Phone:</strong> {viewingDoctor.phone}</p>
              <p><strong>Hospital:</strong> {viewingDoctor.hospitalName}</p>
              <p><strong>Department:</strong> {viewingDoctor.department}</p>
              <p><strong>License Number:</strong> {viewingDoctor.licenseNumber}</p>
              <p><strong>Years of Experience:</strong> {viewingDoctor.yearsOfExperience}</p>
              <p><strong>Qualifications:</strong> {viewingDoctor.qualifications}</p>
              <p><strong>Status:</strong> {viewingDoctor.status}</p>
            </div>
            <div className="modal-actions">
              <button onClick={handleCloseProfile}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Doctor */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</h2>
              <button className="close-button" onClick={() => {
                setShowForm(false);
                setNewDoctor(INITIAL_DOCTOR_STATE);
                setEditingDoctor(null);
                setFormErrors({});
                setCurrentStep(1);
              }}>×</button>
            </div>
            <form onSubmit={handleFormSubmit} className="doctor-form">
              <div className="form-steps">
                <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                  <h3>Personal Information</h3>
                  <div className="form-section">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={newDoctor.firstName}
                          onChange={handleFormChange}
                          className={formErrors.firstName ? "error" : ""}
                        />
                        {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={newDoctor.lastName}
                          onChange={handleFormChange}
                          className={formErrors.lastName ? "error" : ""}
                        />
                        {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={newDoctor.email}
                          onChange={handleFormChange}
                          className={formErrors.email ? "error" : ""}
                        />
                        {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={newDoctor.phone}
                          onChange={handleFormChange}
                          className={formErrors.phone ? "error" : ""}
                        />
                        {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                      </div>
                    </div>
                    {!editingDoctor && (
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="password">Password *</label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={newDoctor.password}
                            onChange={handleFormChange}
                            className={formErrors.password ? "error" : ""}
                          />
                          {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                  <h3>Professional Information</h3>
                  <div className="form-section">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="hospitalName">Hospital Name *</label>
                        <input
                          type="text"
                          id="hospitalName"
                          name="hospitalName"
                          value={newDoctor.hospitalName}
                          onChange={handleFormChange}
                          className={formErrors.hospitalName ? "error" : ""}
                        />
                        {formErrors.hospitalName && <span className="error-message">{formErrors.hospitalName}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="department">Department *</label>
                        <input
                          type="text"
                          id="department"
                          name="department"
                          value={newDoctor.department}
                          onChange={handleFormChange}
                          className={formErrors.department ? "error" : ""}
                        />
                        {formErrors.department && <span className="error-message">{formErrors.department}</span>}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="licenseNumber">License Number *</label>
                        <input
                          type="text"
                          id="licenseNumber"
                          name="licenseNumber"
                          value={newDoctor.licenseNumber}
                          onChange={handleFormChange}
                          className={formErrors.licenseNumber ? "error" : ""}
                        />
                        {formErrors.licenseNumber && <span className="error-message">{formErrors.licenseNumber}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="yearsOfExperience">Years of Experience</label>
                        <input
                          type="number"
                          id="yearsOfExperience"
                          name="yearsOfExperience"
                          value={newDoctor.yearsOfExperience}
                          onChange={handleFormChange}
                          min="0"
                          className={formErrors.yearsOfExperience ? "error" : ""}
                        />
                        {formErrors.yearsOfExperience && <span className="error-message">{formErrors.yearsOfExperience}</span>}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group full-width">
                        <label htmlFor="qualifications">Qualifications</label>
                        <textarea
                          id="qualifications"
                          name="qualifications"
                          value={newDoctor.qualifications}
                          onChange={handleFormChange}
                          rows="3"
                          className={formErrors.qualifications ? "error" : ""}
                        />
                        {formErrors.qualifications && <span className="error-message">{formErrors.qualifications}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-navigation">
                <button 
                  type="button" 
                  className="prev-step" 
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>
                <div className="step-indicators">
                  <span className={`step-indicator ${currentStep === 1 ? 'active' : ''}`}></span>
                  <span className={`step-indicator ${currentStep === 2 ? 'active' : ''}`}></span>
                </div>
                <button 
                  type="button" 
                  className="next-step"
                  onClick={handleNextStep}
                  disabled={currentStep === totalSteps}
                >
                  Next
                </button>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  disabled={isSubmitting || currentStep !== totalSteps}
                >
                  {isSubmitting ? "Saving..." : (editingDoctor ? "Update Doctor" : "Add Doctor")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setNewDoctor(INITIAL_DOCTOR_STATE);
                    setEditingDoctor(null);
                    setFormErrors({});
                    setCurrentStep(1);
                  }}
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
    </div>
  );
};

export default Doctors;