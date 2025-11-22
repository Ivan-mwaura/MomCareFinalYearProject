import { useState, useEffect, useRef } from 'react';
import axios from '../../utils/axiosConfig';
import { useToast } from '../../Components/ui/use-toast';
import Cookies from 'js-cookie';
import CircularProgress from '@mui/material/CircularProgress';
import './HealthRecords.scss';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const INITIAL_FORM_STATE = {
    hypertension: false,
    diabetes: false,
    thyroidDisorders: false,
    obesity: false,
    hiv: false,
    syphilis: false,
    malaria: false,
    uti: false,
    depression: '',
    anxiety: '',
    stressLevel: '',
    previousComplications: [],
    parity: '',
    gravidity: '',
};

const HealthRecords = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [motherResults, setMotherResults] = useState([]);
  const [selectedMother, setSelectedMother] = useState(null);
  const [showSearch, setShowSearch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [activeTab, setActiveTab] = useState('maternal');
  const searchRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [healthRecords, setHealthRecords] = useState([]);
  const [viewedRecord, setViewedRecord] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        setLoading(true);
        axios
          .get(
            `${import.meta.env.VITE_BACKEND_URL}/mothers/search?search=${encodeURIComponent(searchQuery)}`,
            {
              headers: { Authorization: `Bearer ${Cookies.get('token')}` },
            }
          )
          .then((response) => {
            setMotherResults(response.data.data || []);
          })
          .catch(() => {
            toast({ title: 'Error', description: 'Failed to fetch mothers.' });
          })
          .finally(() => setLoading(false));
      } else {
        setMotherResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, toast]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setMotherResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMotherSelect = async (mother) => {
    setSelectedMother(mother);
    setShowSearch(false);
    setSearchQuery('');
    setMotherResults([]);
    setLoading(true);
    try {
      // Fetch health records for the selected mother
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/healthRecords/mother/${mother.id}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        }
      );
      setHealthRecords(response.data.records || []);
    } catch (error) {
      console.error('Error fetching health records:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch health records.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSelectedMother(null);
    setSearchQuery('');
    setShowSearch(true);
    setMotherResults([]);
    setFormData(INITIAL_FORM_STATE);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleComplicationChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      previousComplications: checked
        ? [...prev.previousComplications, value]
        : prev.previousComplications.filter((comp) => comp !== value),
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate Medical History (maternal tab)
    if (activeTab === 'maternal') {
      // No required fields in medical history as they are all checkboxes with default false values
      errors.general = 'Please fill in all fields before submitting.';
    }
    
    // Validate Infectious Diseases
    if (activeTab === 'infectious') {
      // No required fields in infectious diseases as they are all checkboxes with default false values
      errors.general = 'Please fill in all fields before submitting.';
    }
    
    // Validate Mental Health
    if (activeTab === 'mental') {
      if (!formData.depression && formData.depression !== 0) {
        errors.depression = 'Depression score is required';
      } else if (isNaN(formData.depression) || formData.depression < 0 || formData.depression > 27) {
        errors.depression = 'Depression score must be between 0 and 27';
      }
      
      if (!formData.anxiety && formData.anxiety !== 0) {
        errors.anxiety = 'Anxiety score is required';
      } else if (isNaN(formData.anxiety) || formData.anxiety < 0 || formData.anxiety > 21) {
        errors.anxiety = 'Anxiety score must be between 0 and 21';
      }
      
      if (!formData.stressLevel && formData.stressLevel !== 0) {
        errors.stressLevel = 'Stress level is required';
      } else if (isNaN(formData.stressLevel) || formData.stressLevel < 1 || formData.stressLevel > 10) {
        errors.stressLevel = 'Stress level must be between 1 and 10';
      }
    }
    
    // Validate Obstetric History
    if (activeTab === 'obstetric') {
      if (!formData.parity && formData.parity !== 0) {
        errors.parity = 'Parity is required';
      } else if (isNaN(formData.parity) || formData.parity < 0) {
        errors.parity = 'Parity must be a non-negative number';
      }
      
      if (!formData.gravidity && formData.gravidity !== 0) {
        errors.gravidity = 'Gravidity is required';
      } else if (isNaN(formData.gravidity) || formData.gravidity < 0) {
        errors.gravidity = 'Gravidity must be a non-negative number';
      }
      
      if (formData.previousComplications && !Array.isArray(formData.previousComplications)) {
        errors.previousComplications = 'Previous complications must be an array';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all sections before submitting
    let isValid = true;
    const allTabs = ['maternal', 'infectious', 'mental', 'obstetric'];
    const currentTab = activeTab;
    
    // Temporarily switch to each tab to validate its fields
    for (const tab of allTabs) {
      setActiveTab(tab);
      if (!validateForm()) {
        isValid = false;
        break;
      }
    }
    
    // Restore the original active tab
    setActiveTab(currentTab);
    
    if (!isValid) {
      setShowErrorModal(true);
      return;
    }
    
    setSubmitting(true);
    setFormErrors({});

    try {
      // Add motherId to the form data
      const dataToSubmit = {
        ...formData,
        motherId: selectedMother.id
      };

      // Fix the API endpoint URL by removing the duplicate /api/
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/healthrecords`, dataToSubmit);
      
      toast({
        title: '✅ Success',
        description: 'Health record saved successfully.',
        variant: 'default',
      });
      setShowSearch(true);
      setFormData(INITIAL_FORM_STATE);
    } catch (err) {
      console.error('Error saving health record:', err);
      
      if (err.response) {
        const { status, data } = err.response;
        
        // Handle validation errors (400)
        if (status === 400) {
          if (data.errors) {
            // Handle multiple validation errors
            setFormErrors(data.errors);
            setShowErrorModal(true);
          } else if (data.message) {
            // Handle single error message
            setFormErrors({ general: data.message });
            setShowErrorModal(true);
          }
          return;
        }
        
        // Handle duplicate record errors (409)
        if (status === 409) {
          setFormErrors({ general: data.message || 'A health record already exists for this mother.' });
          setShowErrorModal(true);
          return;
        }
        
        // Handle unauthorized errors (401)
        if (status === 401) {
          toast({
            title: '❌ Unauthorized',
            description: 'You are not authorized to perform this action.',
            variant: 'destructive',
          });
          return;
        }
        
        // Handle server errors (500)
        if (status === 500) {
          toast({
            title: '❌ Server Error',
            description: data.message || 'An unexpected error occurred. Please try again later.',
            variant: 'destructive',
          });
          return;
        }
        
        // Handle other errors with messages
        toast({
          title: '❌ Save Failed',
          description: data.message || 'Failed to save health record. Please try again.',
          variant: 'destructive',
        });
      } else if (err.request) {
        // Handle network errors
        toast({
          title: '❌ Network Error',
          description: 'No response from server. Please check your internet connection.',
          variant: 'destructive',
        });
      } else {
        // Handle any other errors
        toast({
          title: '❌ Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'maternal', label: 'Medical History', icon: '🩺' },
    { id: 'infectious', label: 'Infectious Diseases', icon: '🦠' },
    { id: 'mental', label: 'Mental Health', icon: '🧠' },
    { id: 'obstetric', label: 'Obstetric History', icon: '🤰' },
  ];

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  const ErrorModal = ({ errors, onClose }) => {
    return (
      <div className="error-modal">
        <div className="modal-content">
          <div className="error-header">
            <h2>Required Fields Missing</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
          <div className="error-list">
            {Object.entries(errors).map(([field, error]) => (
              <div key={field} className="error-item">
                <strong>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:</strong>
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
        <style>{`
          .error-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
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
    onClose: PropTypes.func.isRequired
  };

  const handleViewRecord = (record) => {
    setViewedRecord(record);
    setEditMode(false);
    setEditData(null);
  };

  const handleCloseModal = () => {
    setViewedRecord(null);
    setEditMode(false);
    setEditData(null);
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditData({ ...viewedRecord });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleComplicationEdit = (complication) => {
    setEditData((prev) => {
      const arr = prev.previousComplications || [];
      return {
        ...prev,
        previousComplications: arr.includes(complication)
          ? arr.filter((c) => c !== complication)
          : [...arr, complication],
      };
    });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/healthRecords/${editData.id}`,
        editData,
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
      );
      toast({ title: 'Success', description: 'Record updated successfully.' });
      // Update the healthRecords state in-place
      setHealthRecords((prev) => prev.map((rec) => rec.id === editData.id ? response.data.record : rec));
      setViewedRecord(null);
    } catch {
      toast({ title: 'Error', description: 'Failed to update record.', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={`health-records ${darkMode ? 'dark-mode' : ''}`}>
      <div className="health-records-header">
        <div className="user-info">
          <h1 style={{textAlign: 'center'}}>Health Records</h1>
        </div>


      </div>

      {showSearch && (
        <div className="search-bar" ref={searchRef}>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by mother's name or email..."
              autoFocus
            />
            {loading && <div className="search-loading">Searching...</div>}
            {motherResults.length > 0 && (
              <ul className="search-suggestions">
                {motherResults.slice(0, 5).map((mother) => (
                  <li
                    key={mother.id}
                    onClick={() => handleMotherSelect(mother)}
                    dangerouslySetInnerHTML={{
                      __html: `${highlightMatch(
                        `${mother.firstName} ${mother.lastName}`,
                        searchQuery
                      )} <span class="email">${highlightMatch(mother.email, searchQuery)}</span>`,
                    }}
                  />
                ))}
              </ul>
            )}
            {!loading && searchQuery.trim() && !motherResults.length && (
              <div className="no-results">No mothers found</div>
            )}
          </form>
        </div>
      )}

      {!selectedMother ? (
        <div className="welcome-section">
          <h2>Welcome to Health Records</h2>
          <p>
            Track and manage maternal health records with ease. Search for a mother by name or email
            to update her medical, infectious, mental, or obstetric history.
          </p>
          <div className="tip-cards">
            <div className="tip-card">
              <span className="tip-icon">📋</span>
              <h3>Quick Start</h3>
              <p>Enter a name or email to begin recording a mother&apos;s health journey.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🕒</span>
              <h3>Save Time</h3>
              <p>Use checkboxes for conditions and numeric inputs for mental health scores.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🤰</span>
              <h3>Focus on Care</h3>
              <p>Monitor key stats like gestational age and provide personalized notes.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="records-content">
          <div className="sidebar">
            <div className="mother-profile">
              <h2>
                {selectedMother.firstName} {selectedMother.lastName}
              </h2>
              <div className="profile-details">
                <p>
                  <strong>Email:</strong> {selectedMother.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedMother.phone || 'N/A'}
                </p>
                <p>
                  <strong>Location:</strong> {selectedMother.ward}, {selectedMother.constituency},{' '}
                  {selectedMother.county}
                </p>
                <p>
                  <strong>Assigned CHW:</strong> {selectedMother.assignedCHW || 'Not assigned'}
                </p>
                <p>
                  <strong>Due Date:</strong>{' '}
                  {new Date(selectedMother.dueDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Pregnancy Stage:</strong> {selectedMother.pregnancyStage || 'N/A'}
                </p>
                <p>
                  <strong>Weeks Pregnant:</strong> {selectedMother.weeksPregnant || 'N/A'}
                </p>
              </div>
              <button className="reset-btn" onClick={handleResetSearch}>
                Change Mother
              </button>
            </div>
            <nav className="sidebar-nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="icon">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="main-content">
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                {activeTab === 'maternal' && (
                  <div className="form-content medical-history">
                    <h3>Medical History</h3>
                    <div className="condition-grid">
                      {[
                        { name: 'hypertension', label: 'Hypertension', icon: '🩺', tooltip: 'High blood pressure' },
                        { name: 'diabetes', label: 'Diabetes', icon: '💉', tooltip: 'Blood sugar disorder' },
                        { name: 'thyroidDisorders', label: 'Thyroid Disorders', icon: '🦋', tooltip: 'Thyroid gland issues' },
                        { name: 'obesity', label: 'Obesity', icon: '⚖️', tooltip: 'Excessive body weight' },
                      ].map((item) => (
                        <div key={item.name} className="condition-card" title={item.tooltip}>
                          <label className="condition-checkbox">
                            <input
                              type="checkbox"
                              name={item.name}
                              checked={formData[item.name]}
                              onChange={handleCheckboxChange}
                            />
                            <span className="checkbox-indicator"></span>
                          </label>
                          <span className="condition-icon">{item.icon}</span>
                          <span className="condition-label">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'infectious' && (
                  <div className="form-content">
                    <h3>Infectious Diseases</h3>
                    <div className="checkbox-grid">
                      {[
                        { name: 'hiv', label: 'HIV/AIDS' },
                        { name: 'syphilis', label: 'Syphilis' },
                        { name: 'malaria', label: 'Malaria' },
                        { name: 'uti', label: 'Urinary Infections' },
                      ].map((item) => (
                        <label key={item.name} className="checkbox-item">
                          <input
                            type="checkbox"
                            name={item.name}
                            checked={formData[item.name]}
                            onChange={handleCheckboxChange}
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'mental' && (
                  <div className="form-content">
                    <h3>Mental Health</h3>
                    <div className="input-group">
                      <label>
                        Depression (PHQ-9)
                        <input
                          type="number"
                          name="depression"
                          value={formData.depression}
                          onChange={handleInputChange}
                          placeholder="0-27"
                          min="0"
                          max="27"
                          className={formErrors.depression ? 'error' : ''}
                        />
                        {formErrors.depression && <span className="error-message">{formErrors.depression}</span>}
                      </label>
                      <label>
                        Anxiety (GAD-7)
                        <input
                          type="number"
                          name="anxiety"
                          value={formData.anxiety}
                          onChange={handleInputChange}
                          placeholder="0-21"
                          min="0"
                          max="21"
                          className={formErrors.anxiety ? 'error' : ''}
                        />
                        {formErrors.anxiety && <span className="error-message">{formErrors.anxiety}</span>}
                      </label>
                      <label>
                        Stress Level
                        <input
                          type="number"
                          name="stressLevel"
                          value={formData.stressLevel}
                          onChange={handleInputChange}
                          placeholder="1-10"
                          min="1"
                          max="10"
                          className={formErrors.stressLevel ? 'error' : ''}
                        />
                        {formErrors.stressLevel && <span className="error-message">{formErrors.stressLevel}</span>}
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'obstetric' && (
                  <div className="form-content">
                    <h3>Obstetric History</h3>
                    <div className="obstetric-content">
                      <div className="checkbox-grid complications">
                        <h4>Previous Complications</h4>
                        {[
                          'Preeclampsia',
                          'Eclampsia',
                          'Gestational Diabetes',
                          'Miscarriage',
                          'Stillbirth',
                          'Preterm Birth',
                        ].map((comp) => (
                          <label key={comp} className="checkbox-item">
                            <input
                              type="checkbox"
                              value={comp}
                              onChange={handleComplicationChange}
                              checked={formData.previousComplications.includes(comp)}
                            />
                            <span>{comp}</span>
                          </label>
                        ))}
                      </div>
                      <div className="numeric-inputs">
                        <label>
                          Parity (Live Births)
                          <input
                            type="number"
                            name="parity"
                            value={formData.parity}
                            onChange={handleInputChange}
                            min="0"
                            className={formErrors.parity ? 'error' : ''}
                          />
                          {formErrors.parity && <span className="error-message">{formErrors.parity}</span>}
                        </label>
                        <label>
                          Gravidity (Pregnancies)
                          <input
                            type="number"
                            name="gravidity"
                            value={formData.gravidity}
                            onChange={handleInputChange}
                            min="0"
                            className={formErrors.gravidity ? 'error' : ''}
                          />
                          {formErrors.gravidity && <span className="error-message">{formErrors.gravidity}</span>}
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                {submitting ? (
                  <div className="loader-container">
                    <CircularProgress size={32} sx={{ color: '#FF6B8A' }} />
                  </div>
                ) : (
                  <>
                    <button type="submit" className="submit-btn" disabled={submitting}>
                      Save Record
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={handleResetSearch}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>

            {/* Health Records Display Section */}
            <div className="detailed-records">
              <h3>Health Records History</h3>
              {loading ? (
                <div className="loading-container">
                  <CircularProgress />
                </div>
              ) : healthRecords.length > 0 ? (
                <div className="records-grid">
                  {healthRecords.map((record) => (
                    <div key={record.id} className="record-card">
                      <div className="record-header">
                        <h4>Record Date: {new Date(record.createdAt).toLocaleDateString()}</h4>
                        <Button variant="contained" color="info" onClick={() => handleViewRecord(record)}>
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-records">No health records found for this mother.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <ErrorModal 
          errors={formErrors} 
          onClose={() => setShowErrorModal(false)} 
        />
      )}

      {/* Modal for viewing/editing record */}
      <Modal open={!!viewedRecord} onClose={handleCloseModal}>
        <Box className="modal-box">
          {viewedRecord && !editMode ? (
            <>
              <h2>Health Record Details</h2>
              <div className="modal-section">
                <strong>Date:</strong> {new Date(viewedRecord.createdAt).toLocaleDateString()}
              </div>
              <div className="modal-section">
                <strong>Medical Conditions:</strong>
                <ul>
                  <li>Hypertension: {viewedRecord.hypertension ? 'Yes' : 'No'}</li>
                  <li>Diabetes: {viewedRecord.diabetes ? 'Yes' : 'No'}</li>
                  <li>Thyroid Disorders: {viewedRecord.thyroidDisorders ? 'Yes' : 'No'}</li>
                  <li>Obesity: {viewedRecord.obesity ? 'Yes' : 'No'}</li>
                  <li>HIV: {viewedRecord.hiv ? 'Yes' : 'No'}</li>
                  <li>Syphilis: {viewedRecord.syphilis ? 'Yes' : 'No'}</li>
                  <li>Malaria: {viewedRecord.malaria ? 'Yes' : 'No'}</li>
                  <li>UTI: {viewedRecord.uti ? 'Yes' : 'No'}</li>
                </ul>
              </div>
              <div className="modal-section">
                <strong>Mental Health:</strong>
                <ul>
                  <li>Depression Score: {viewedRecord.depression || 'N/A'}</li>
                  <li>Anxiety Score: {viewedRecord.anxiety || 'N/A'}</li>
                  <li>Stress Level: {viewedRecord.stressLevel || 'N/A'}</li>
                </ul>
              </div>
              <div className="modal-section">
                <strong>Obstetric History:</strong>
                <ul>
                  <li>Parity: {viewedRecord.parity || 'N/A'}</li>
                  <li>Gravidity: {viewedRecord.gravidity || 'N/A'}</li>
                  {viewedRecord.previousComplications && viewedRecord.previousComplications.length > 0 && (
                    <li>
                      Previous Complications:
                      <ul>
                        {viewedRecord.previousComplications.map((comp, idx) => (
                          <li key={idx}>{comp}</li>
                        ))}
                      </ul>
                    </li>
                  )}
                </ul>
              </div>
              <div className="modal-actions">
                <Button variant="contained" color="primary" onClick={handleEdit}>
                  Edit
                </Button>
                <Button variant="outlined" onClick={handleCloseModal} sx={{ ml: 2 }}>
                  Close
                </Button>
              </div>
            </>
          ) : viewedRecord && editMode ? (
            <>
              <h2>Edit Health Record</h2>
              <div className="modal-section">
                <label>
                  Hypertension
                  <input type="checkbox" name="hypertension" checked={!!editData.hypertension} onChange={handleEditChange} />
                </label>
                <label>
                  Diabetes
                  <input type="checkbox" name="diabetes" checked={!!editData.diabetes} onChange={handleEditChange} />
                </label>
                <label>
                  Thyroid Disorders
                  <input type="checkbox" name="thyroidDisorders" checked={!!editData.thyroidDisorders} onChange={handleEditChange} />
                </label>
                <label>
                  Obesity
                  <input type="checkbox" name="obesity" checked={!!editData.obesity} onChange={handleEditChange} />
                </label>
                <label>
                  HIV
                  <input type="checkbox" name="hiv" checked={!!editData.hiv} onChange={handleEditChange} />
                </label>
                <label>
                  Syphilis
                  <input type="checkbox" name="syphilis" checked={!!editData.syphilis} onChange={handleEditChange} />
                </label>
                <label>
                  Malaria
                  <input type="checkbox" name="malaria" checked={!!editData.malaria} onChange={handleEditChange} />
                </label>
                <label>
                  UTI
                  <input type="checkbox" name="uti" checked={!!editData.uti} onChange={handleEditChange} />
                </label>
              </div>
              <div className="modal-section">
                <label>
                  Depression
                  <input type="number" name="depression" value={editData.depression || ''} onChange={handleEditChange} min="0" max="27" />
                </label>
                <label>
                  Anxiety
                  <input type="number" name="anxiety" value={editData.anxiety || ''} onChange={handleEditChange} min="0" max="21" />
                </label>
                <label>
                  Stress Level
                  <input type="number" name="stressLevel" value={editData.stressLevel || ''} onChange={handleEditChange} min="1" max="10" />
                </label>
              </div>
              <div className="modal-section">
                <label>Parity
                  <input type="number" name="parity" value={editData.parity || ''} onChange={handleEditChange} min="0" />
                </label>
                <label>Gravidity
                  <input type="number" name="gravidity" value={editData.gravidity || ''} onChange={handleEditChange} min="0" />
                </label>
                <div>
                  <strong>Previous Complications:</strong>
                  {['Preeclampsia','Eclampsia','Gestational Diabetes','Miscarriage','Stillbirth','Preterm Birth'].map((comp) => (
                    <label key={comp}>
                      <input
                        type="checkbox"
                        checked={editData.previousComplications?.includes(comp) || false}
                        onChange={() => handleComplicationEdit(comp)}
                      />
                      {comp}
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <Button variant="contained" color="success" onClick={handleUpdate} disabled={updating}>
                  {updating ? 'Updating...' : 'Save Changes'}
                </Button>
                <Button variant="outlined" onClick={handleCloseModal} sx={{ ml: 2 }}>
                  Cancel
                </Button>
              </div>
            </>
          ) : null}
        </Box>
      </Modal>
    </div>
  );
};

export default HealthRecords;
