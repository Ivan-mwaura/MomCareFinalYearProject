import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "../../utils/axiosConfig";
import locationData from './Kenya_Counties_Constituencies_Wards.json';
import "./CHWs.scss";
import { useToast } from "../../Components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchCHWs } from "../../Redux/getAllChwsSlice";
import CHWsSkeleton from "../../Components/Skeletons/CHWsSkeleton";

const INITIAL_CHW_STATE = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  county: "",
  constituency: "",
  ward: "",
  healthFocusArea: "",
  rolesAndResponsibilities: "",
  status: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  languagesSpoken: [],
  searchQuery: ""
};

const CHWs = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewingCHW, setViewingCHW] = useState(null);
  const [editingCHW, setEditingCHW] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { data: chws, loading: chwsLoading } = useSelector((state) => state.chws);
  const [newCHW, setNewCHW] = useState(INITIAL_CHW_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch CHWs only once if not available

  useEffect(() => {
    if (!chws || chws.length === 0) {
      dispatch(fetchCHWs());
    }
  }, [dispatch, chws]);

  // Compute wards list once using useMemo (locationData is static)
  const wardsList = useMemo(() => {
    let wards = [];
    Object.keys(locationData).forEach((county) => {
      if (locationData[county] && typeof locationData[county] === "object") {
        Object.keys(locationData[county]).forEach((constituency) => {
          if (Array.isArray(locationData[county][constituency])) {
            wards = wards.concat(locationData[county][constituency]);
          }
        });
      }
    });
    return wards;
  }, []);

  const CHWsPerPage = 10;
  const CHWList = chws || [];

  // Memoize pagination values to avoid recalculations on each render
  const totalPages = useMemo(() => Math.ceil(CHWList.length / CHWsPerPage), [CHWList.length]);
  const filteredCHWs = useMemo(() => {
    return CHWList.slice((currentPage - 1) * CHWsPerPage, currentPage * CHWsPerPage);
  }, [CHWList, currentPage]);

  const handleFormChange = useCallback((e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple" && name === "languagesSpoken") {
      const selectedLanguages = Array.from(selectedOptions, (option) => option.value);
      setNewCHW((prev) => ({ ...prev, [name]: selectedLanguages }));
    } else {
      setNewCHW((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    
    // Personal Information validation
    if (!newCHW.firstName?.trim()) {
      errors.firstName = 'First name is required';
    } else if (newCHW.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!newCHW.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    } else if (newCHW.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!newCHW.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(newCHW.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!newCHW.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCHW.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!newCHW.password?.trim()) {
      errors.password = 'Password is required';
    } else if (newCHW.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    } else if (!/(?=.*[a-z])/.test(newCHW.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(newCHW.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(newCHW.password)) {
      errors.password = 'Password must contain at least one number';
    }
    
    // Emergency Contact validation
    if (!newCHW.emergencyContactName?.trim()) {
      errors.emergencyContactName = 'Emergency contact name is required';
    }
    
    if (!newCHW.emergencyContactPhone?.trim()) {
      errors.emergencyContactPhone = 'Emergency contact phone is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(newCHW.emergencyContactPhone)) {
      errors.emergencyContactPhone = 'Please enter a valid phone number';
    }
    
    if (!newCHW.emergencyContactRelation) {
      errors.emergencyContactRelation = 'Emergency contact relation is required';
    }
    
    // Location validation
    if (!newCHW.county) {
      errors.county = 'County is required';
    }
    
    if (!newCHW.constituency) {
      errors.constituency = 'Constituency is required';
    }
    
    if (!newCHW.ward) {
      errors.ward = 'Ward is required';
    }
    
    // Professional Details validation
    if (!newCHW.healthFocusArea) {
      errors.healthFocusArea = 'Health focus area is required';
    }
    
    if (!newCHW.rolesAndResponsibilities) {
      errors.rolesAndResponsibilities = 'Roles and responsibilities are required';
    }
    
    if (!newCHW.status) {
      errors.status = 'Status is required';
    }
    
    if (!newCHW.languagesSpoken || newCHW.languagesSpoken.length === 0) {
      errors.languagesSpoken = 'At least one language must be selected';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
        const response = editingCHW
          ? await axios.put(`${import.meta.env.VITE_BACKEND_URL}/chws/${editingCHW.id}`, newCHW)
          : await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chws/register`, newCHW);
        
        toast({
          title: "✅ Success",
          description: editingCHW ? "CHW updated successfully." : "CHW registered successfully."
        });
        
        setShowForm(false);
        setNewCHW(INITIAL_CHW_STATE);
        setEditingCHW(null);
        setFormErrors({});
        
        // Refresh CHWs list
        dispatch(fetchCHWs());
      } catch (err) {
        // Handle email uniqueness error
        if (err.response?.status === 400 && err.response?.data?.message?.includes('Email already exists')) {
          setFormErrors({
            email: err.response.data.message
          });
          setShowErrorModal(true);
        } else {
          toast({
            title: "❌ Error",
            description: err.response?.data?.message || "An error occurred."
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [newCHW, editingCHW, toast, dispatch]
  );

  const handleViewCHW = useCallback((chw) => {
    setViewingCHW(chw);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setViewingCHW(null);
  }, []);

  const handleAddCHW = useCallback(() => {
    setShowForm(true);
    setEditingCHW(null);
    setNewCHW(INITIAL_CHW_STATE);
  }, []);

  const handleEditCHW = useCallback((chw) => {
    setShowForm(true);
    setEditingCHW(chw);
    setNewCHW({
      firstName: chw.firstName,
      lastName: chw.lastName,
      phone: chw.phone,
      email: chw.email,
      county: chw.county,
      constituency: chw.constituency,
      ward: chw.ward,
      healthFocusArea: chw.healthFocusArea,
      rolesAndResponsibilities: chw.rolesAndResponsibilities,
      status: chw.status,
      emergencyContactName: chw.emergencyContactName,
      emergencyContactPhone: chw.emergencyContactPhone,
      emergencyContactRelation: chw.emergencyContactRelation,
      languagesSpoken: chw.languagesSpoken,
      searchQuery: ""
    });
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

  if (chwsLoading) {
    return <CHWsSkeleton />;
  }

  return (
    <div className="chw-management">
      <h1>CHW Management</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search CHWs by name, location, or hospital..."
          value={newCHW.searchQuery || ""}
          onChange={(e) => setNewCHW((prev) => ({ ...prev, searchQuery: e.target.value }))}
        />
      </div>

      {/* Add New CHW */}
      <button className="add-chw-btn" onClick={handleAddCHW}>
        Add New CHW
      </button>

      {/* CHW List */}
      <div className="chw-list">
        <h2>CHWs List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>County/Constituency/Ward</th>
              <th>Contact</th>
              <th>Assigned Patients</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCHWs.map((chw) => (
              <tr key={chw.id}>
                <td>{`${chw.firstName} ${chw.lastName}`}</td>
                <td>{`${chw.county}/${chw.constituency}/${chw.ward}`}</td>
                <td>{chw.phone}</td>
                <td>{chw.assignedPatients || 0}</td>
                <td>{chw.status}</td>
                <td>
                  <button onClick={() => handleViewCHW(chw)}>View</button>
                  <button onClick={() => handleEditCHW(chw)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>

      {/* Modal: CHW Profile */}
      {viewingCHW && (
        <div className="modal">
          <div className="modal-content">
            <h2>{viewingCHW.firstName}&apos;s Profile</h2>
            <p><strong>Name:</strong> {`${viewingCHW.firstName} ${viewingCHW.lastName}`}</p>
            <p><strong>Contact:</strong> {viewingCHW.contact || viewingCHW.phone}</p>
            <p><strong>County:</strong> {viewingCHW.county}</p>
            <p><strong>Constituency:</strong> {viewingCHW.constituency}</p>
            <p><strong>Ward:</strong> {viewingCHW.ward}</p>
            <p><strong>Languages Spoken:</strong> {viewingCHW.languagesSpoken.join(", ")}</p>
            <p><strong>Health Focus Area:</strong> {viewingCHW.healthFocusArea}</p>
            <p><strong>Roles and Responsibilities:</strong> {viewingCHW.rolesAndResponsibilities}</p>
            <p><strong>Status:</strong> {viewingCHW.status}</p>
            <p><strong>Assigned Patients:</strong> {viewingCHW.assignedPatients}</p>
            <button onClick={handleCloseProfile}>Close</button>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit CHW */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="form-title">{editingCHW ? "Edit CHW" : "Register New CHW"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-grid">
                  <label>
                    <span>First Name</span>
                    <input
                      type="text"
                      name="firstName"
                      value={newCHW.firstName}
                      onChange={handleFormChange}
                      className={formErrors.firstName ? 'error' : ''}
                      required
                    />
                    {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
                  </label>
                  <label>
                    <span>Last Name</span>
                    <input
                      type="text"
                      name="lastName"
                      value={newCHW.lastName}
                      onChange={handleFormChange}
                      className={formErrors.lastName ? 'error' : ''}
                      required
                    />
                    {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
                  </label>
                  <label>
                    <span>Email</span>
                    <input
                      type="email"
                      name="email"
                      value={newCHW.email}
                      onChange={handleFormChange}
                      className={formErrors.email ? 'error' : ''}
                      required
                    />
                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                  </label>
                  <label>
                    <span>Password</span>
                    <input
                      type="password"
                      name="password"
                      value={newCHW.password}
                      onChange={handleFormChange}
                      className={formErrors.password ? 'error' : ''}
                      required
                    />
                    {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                  </label>
                  <label>
                    <span>Phone</span>
                    <input
                      type="tel"
                      name="phone"
                      value={newCHW.phone}
                      onChange={handleFormChange}
                      className={formErrors.phone ? 'error' : ''}
                      required
                    />
                    {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Emergency Contact</h3>
                <div className="form-grid">
                  <label>
                    <span>Emergency Contact Name</span>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={newCHW.emergencyContactName}
                      onChange={handleFormChange}
                      className={formErrors.emergencyContactName ? 'error' : ''}
                      required
                    />
                    {formErrors.emergencyContactName && <span className="error-message">{formErrors.emergencyContactName}</span>}
                  </label>
                  <label>
                    <span>Emergency Contact Phone</span>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      value={newCHW.emergencyContactPhone}
                      onChange={handleFormChange}
                      className={formErrors.emergencyContactPhone ? 'error' : ''}
                      required
                    />
                    {formErrors.emergencyContactPhone && <span className="error-message">{formErrors.emergencyContactPhone}</span>}
                  </label>
                  <label>
                    <span>Emergency Contact Relation</span>
                    <select
                      name="emergencyContactRelation"
                      value={newCHW.emergencyContactRelation}
                      onChange={handleFormChange}
                      className={formErrors.emergencyContactRelation ? 'error' : ''}
                      required
                    >
                      <option value="">Select Relation</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.emergencyContactRelation && <span className="error-message">{formErrors.emergencyContactRelation}</span>}
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Location Information</h3>
                <div className="form-grid">
                  <label>
                    <span>County</span>
                    <select
                      name="county"
                      value={newCHW.county}
                      onChange={handleFormChange}
                      className={formErrors.county ? 'error' : ''}
                      required
                    >
                      <option value="">Select County</option>
                      {Object.keys(locationData).map((county) => (
                        <option key={county} value={county}>
                          {county}
                        </option>
                      ))}
                    </select>
                    {formErrors.county && <span className="error-message">{formErrors.county}</span>}
                  </label>
                  <label>
                    <span>Constituency</span>
                    <select
                      name="constituency"
                      value={newCHW.constituency}
                      onChange={handleFormChange}
                      className={formErrors.constituency ? 'error' : ''}
                      required
                      disabled={!newCHW.county}
                    >
                      <option value="">Select Constituency</option>
                      {newCHW.county &&
                        Object.keys(locationData[newCHW.county]).map((constituency) => (
                          <option key={constituency} value={constituency}>
                            {constituency}
                          </option>
                        ))}
                    </select>
                    {formErrors.constituency && <span className="error-message">{formErrors.constituency}</span>}
                  </label>
                  <label>
                    <span>Ward</span>
                    <select
                      name="ward"
                      value={newCHW.ward}
                      onChange={handleFormChange}
                      className={formErrors.ward ? 'error' : ''}
                      required
                      disabled={!newCHW.constituency}
                    >
                      <option value="">Select Ward</option>
                      {newCHW.county &&
                        newCHW.constituency &&
                        locationData[newCHW.county][newCHW.constituency].map((ward) => (
                          <option key={ward} value={ward}>
                            {ward}
                          </option>
                        ))}
                    </select>
                    {formErrors.ward && <span className="error-message">{formErrors.ward}</span>}
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Professional Details</h3>
                <div className="form-grid">
                  <label>
                    <span>Health Focus Area</span>
                    <select
                      name="healthFocusArea"
                      value={newCHW.healthFocusArea}
                      onChange={handleFormChange}
                      className={formErrors.healthFocusArea ? 'error' : ''}
                      required
                    >
                      <option value="">Select Focus Area</option>
                      <option value="Maternal Health">Maternal Health</option>
                      <option value="Child Health">Child Health</option>
                      <option value="Family Planning">Family Planning</option>
                      <option value="Nutrition">Nutrition</option>
                      <option value="General Health">General Health</option>
                    </select>
                    {formErrors.healthFocusArea && <span className="error-message">{formErrors.healthFocusArea}</span>}
                  </label>
                  <label>
                    <span>Roles and Responsibilities</span>
                    <select
                      name="rolesAndResponsibilities"
                      value={newCHW.rolesAndResponsibilities}
                      onChange={handleFormChange}
                      className={formErrors.rolesAndResponsibilities ? 'error' : ''}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Community Health Worker">Community Health Worker</option>
                      <option value="Health Educator">Health Educator</option>
                      <option value="Maternal Health Specialist">Maternal Health Specialist</option>
                      <option value="Nutritionist">Nutritionist</option>
                      <option value="General Health Worker">General Health Worker</option>
                    </select>
                    {formErrors.rolesAndResponsibilities && <span className="error-message">{formErrors.rolesAndResponsibilities}</span>}
                  </label>
                  <label>
                    <span>Status</span>
                    <select
                      name="status"
                      value={newCHW.status}
                      onChange={handleFormChange}
                      className={formErrors.status ? 'error' : ''}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Training">Training</option>
                    </select>
                    {formErrors.status && <span className="error-message">{formErrors.status}</span>}
                  </label>
                  <label>
                    <span>Languages Spoken</span>
                    <select
                      name="languagesSpoken"
                      value={newCHW.languagesSpoken}
                      onChange={handleFormChange}
                      className={formErrors.languagesSpoken ? 'error' : ''}
                      multiple
                      required
                    >
                      <option value="English">English</option>
                      <option value="Swahili">Swahili</option>
                      <option value="Kikuyu">Kikuyu</option>
                      <option value="Luo">Luo</option>
                      <option value="Kamba">Kamba</option>
                      <option value="Kisii">Kisii</option>
                      <option value="Meru">Meru</option>
                      <option value="Luhya">Luhya</option>
                      <option value="Kalenjin">Kalenjin</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.languagesSpoken && <span className="error-message">{formErrors.languagesSpoken}</span>}
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : (editingCHW ? "Update" : "Save")}
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

export default CHWs;
