import React, { useState, useEffect, useRef } from 'react';
import axios from '../../utils/axiosConfig';
import { useToast } from '../../Components/ui/use-toast';
import Cookies from 'js-cookie';
import AppointmentRecordSkeleton from '../../Components/Skeletons/AppointmentRecordSkeleton';
import CircularProgress from '@mui/material/CircularProgress';
import './AppointmentRecord.scss';

const AppointmentRecord = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [motherResults, setMotherResults] = useState([]);
  const [selectedMother, setSelectedMother] = useState(null);
  const [showSearch, setShowSearch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    visitType: '',
    attended: false,
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    fundalHeight: '',
    fetalHeartRate: '',
    gestationalAge: '',
    physicalFindings: '',
    symptoms: '',
    labResults: '',
    ultrasoundSummary: '',
    prescribedMedications: '',
    interventions: '',
    nextAppointmentDate: '',
    careRecommendations: '',
    adherenceNotes: '',
    doctorsObservations: '',
    patientConcerns: '',
  });
  const [activeTab, setActiveTab] = useState('visitDetails');
  const [appointmentRecords, setAppointmentRecords] = useState([]);
  const [expandedRecords, setExpandedRecords] = useState({});
  const searchRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);

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
          .catch((error) => {
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
    if (selectedMother) {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/appointmentRecords/mother/${selectedMother.id}`,
          {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` },
          }
        )
        .then((response) => {
          setAppointmentRecords(response.data.records || []);
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: 'Failed to fetch appointment records.',
          });
        });
    }
  }, [selectedMother, toast]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setMotherResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMotherSelect = (mother) => {
    setSelectedMother(mother);
    setShowSearch(false);
    setSearchQuery('');
    setMotherResults([]);
  };

  const handleResetSearch = () => {
    setSelectedMother(null);
    setSearchQuery('');
    setShowSearch(true);
    setMotherResults([]);
    setFormData({
      appointmentDate: '',
      appointmentTime: '',
      visitType: '',
      attended: false,
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      fundalHeight: '',
      fetalHeartRate: '',
      gestationalAge: '',
      physicalFindings: '',
      symptoms: '',
      labResults: '',
      ultrasoundSummary: '',
      prescribedMedications: '',
      interventions: '',
      nextAppointmentDate: '',
      careRecommendations: '',
      adherenceNotes: '',
      doctorsObservations: '',
      patientConcerns: '',
    });
    setAppointmentRecords([]);
    setExpandedRecords({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Visit Details validation
    if (!formData.appointmentDate) {
      errors.appointmentDate = 'Appointment date is required';
    } else {
      const appointmentDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (appointmentDate < today) {
        errors.appointmentDate = 'Appointment date cannot be in the past';
      }
    }

    if (!formData.appointmentTime) {
      errors.appointmentTime = 'Appointment time is required';
    } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.appointmentTime)) {
      errors.appointmentTime = 'Invalid time format (use HH:mm)';
    }

    if (!formData.visitType) {
      errors.visitType = 'Visit type is required';
    }

    // Vital Signs validation
    if (activeTab === 'vitalSigns') {
      if (formData.bloodPressure && !/^\d{2,3}\/\d{2,3}$/.test(formData.bloodPressure)) {
        errors.bloodPressure = 'Invalid blood pressure format (e.g., 120/80)';
      }

      if (formData.heartRate) {
        const hr = Number(formData.heartRate);
        if (isNaN(hr) || hr < 40 || hr > 200) {
          errors.heartRate = 'Heart rate must be between 40 and 200 bpm';
        }
      }

      if (formData.temperature) {
        const temp = Number(formData.temperature);
        if (isNaN(temp) || temp < 35 || temp > 42) {
          errors.temperature = 'Temperature must be between 35°C and 42°C';
        }
      }

      if (formData.weight) {
        const weight = Number(formData.weight);
        if (isNaN(weight) || weight < 30 || weight > 200) {
          errors.weight = 'Weight must be between 30 and 200 kg';
        }
      }
    }

    // Obstetric validation
    if (activeTab === 'obstetric') {
      if (formData.fundalHeight) {
        const fh = Number(formData.fundalHeight);
        if (isNaN(fh) || fh < 0 || fh > 50) {
          errors.fundalHeight = 'Fundal height must be between 0 and 50 cm';
        }
      }

      if (formData.fetalHeartRate) {
        const fhr = Number(formData.fetalHeartRate);
        if (isNaN(fhr) || fhr < 110 || fhr > 160) {
          errors.fetalHeartRate = 'Fetal heart rate must be between 110 and 160 bpm';
        }
      }

      if (formData.gestationalAge) {
        const ga = Number(formData.gestationalAge);
        if (isNaN(ga) || ga < 0 || ga > 45) {
          errors.gestationalAge = 'Gestational age must be between 0 and 45 weeks';
        }
      }
    }

    // Clinical Observations validation
    if (activeTab === 'clinical') {
      if (!formData.physicalFindings?.trim()) {
        errors.physicalFindings = 'Physical findings are required';
      }
      if (!formData.symptoms?.trim()) {
        errors.symptoms = 'Symptoms are required';
      }
    }

    // Lab & Diagnostics validation
    if (activeTab === 'lab' && formData.labResults?.trim()) {
      if (formData.labResults.length > 1000) {
        errors.labResults = 'Lab results must not exceed 1000 characters';
      }
    }

    // Medications validation
    if (activeTab === 'medications' && formData.prescribedMedications?.trim()) {
      if (formData.prescribedMedications.length > 1000) {
        errors.prescribedMedications = 'Prescribed medications must not exceed 1000 characters';
      }
    }

    // Follow-Up validation
    if (activeTab === 'followUp') {
      if (formData.nextAppointmentDate) {
        const nextDate = new Date(formData.nextAppointmentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (nextDate < today) {
          errors.nextAppointmentDate = 'Next appointment date cannot be in the past';
        }
      }
      if (!formData.careRecommendations?.trim()) {
        errors.careRecommendations = 'Care recommendations are required';
      }
    }

    // Notes validation
    if (activeTab === 'notes') {
      if (!formData.doctorsObservations?.trim()) {
        errors.doctorsObservations = 'Doctor\'s observations are required';
      }
      if (!formData.patientConcerns?.trim()) {
        errors.patientConcerns = 'Patient concerns are required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMother) {
      toast({
        title: '❌ Error',
        description: 'Please select a mother before submitting.',
        variant: 'destructive',
      });
      return;
    }

    // Validate all sections before submitting
    let isValid = true;
    const allTabs = ['visitDetails', 'vitalSigns', 'obstetric', 'clinical', 'lab', 'medications', 'followUp', 'notes'];
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
    const recordData = { ...formData, motherId: selectedMother.id };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/appointmentRecords`,
        recordData,
        {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        }
      );

      toast({
        title: '✅ Success',
        description: 'Appointment record saved successfully.',
        variant: 'default',
      });

      // Update the records list with the new record
      setAppointmentRecords((prev) => [response.data.data, ...prev]);

      // Reset form
      setFormData({
        appointmentDate: '',
        appointmentTime: '',
        visitType: '',
        attended: false,
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        weight: '',
        fundalHeight: '',
        fetalHeartRate: '',
        gestationalAge: '',
        physicalFindings: '',
        symptoms: '',
        labResults: '',
        ultrasoundSummary: '',
        prescribedMedications: '',
        interventions: '',
        nextAppointmentDate: '',
        careRecommendations: '',
        adherenceNotes: '',
        doctorsObservations: '',
        patientConcerns: '',
      });
      setFormErrors({});
    } catch (error) {
      console.error('Error saving appointment record:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        // Handle validation errors (400)
        if (status === 400) {
          if (data.errors) {
            setFormErrors(data.errors);
            setShowErrorModal(true);
          } else {
            toast({
              title: '❌ Validation Error',
              description: data.message || 'Please check all required fields.',
              variant: 'destructive',
            });
          }
          return;
        }
        
        // Handle duplicate appointment errors (409)
        if (status === 409) {
          toast({
            title: '❌ Duplicate Appointment',
            description: data.message || 'An appointment already exists at this time.',
            variant: 'destructive',
          });
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
        
        // Handle other errors
        toast({
          title: '❌ Error',
          description: data.message || 'Failed to save appointment record.',
          variant: 'destructive',
        });
      } else if (error.request) {
        // Handle network errors
        toast({
          title: '❌ Network Error',
          description: 'No response from server. Please check your internet connection.',
          variant: 'destructive',
        });
      } else {
        // Handle other errors
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

  const toggleRecordExpansion = (recordId) => {
    setExpandedRecords((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  };

  const tabs = [
    { id: 'visitDetails', label: 'Visit Details', icon: '📅' },
    { id: 'vitalSigns', label: 'Vital Signs', icon: '❤️' },
    { id: 'obstetric', label: 'Obstetric Assessments', icon: '👶' },
    { id: 'clinical', label: 'Clinical Observations', icon: '🩺' },
    { id: 'lab', label: 'Lab & Diagnostics', icon: '🧪' },
    { id: 'medications', label: 'Medications', icon: '💊' },
    { id: 'followUp', label: 'Follow-Up', icon: '📅' },
    { id: 'notes', label: 'Notes', icon: '📝' },
  ];

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
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

  if (loading && !motherResults.length) {
    return <AppointmentRecordSkeleton />;
  }

  return (
    <div className={`appointment-record-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="page-header">
        <div className="user-info">
          <div className="user-initials">IM</div>
          <div className="user-welcome">
            <p>Welcome, Ivy Mitchelle</p>
          </div>
        </div>
        <h1>Appointment Records</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
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
          <h2>Welcome to Appointment Records</h2>
          <p>
            Manage and record appointments for expectant mothers with ease. Search for a mother by name or email
            to document her visit details, vital signs, and more.
          </p>
          <div className="tip-cards">
            <div className="tip-card">
              <span className="tip-icon">📅</span>
              <h3>Schedule Visits</h3>
              <p>Enter a name or email to start recording a mother's appointment details.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🩺</span>
              <h3>Track Health</h3>
              <p>Record vital signs, obstetric assessments, and clinical observations efficiently.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">📝</span>
              <h3>Stay Organized</h3>
              <p>View past records and add follow-up notes to ensure continuity of care.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="appointment-record-container">
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
                {activeTab === 'visitDetails' && (
                  <div className="form-content">
                    <h3>Visit Details</h3>
                    <div className="form-grid">
                      <label>
                        Appointment Date
                        <input
                          type="date"
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleInputChange}
                          className={formErrors.appointmentDate ? 'error' : ''}
                          required
                        />
                      </label>
                      {formErrors.appointmentDate && <span className="error-message">{formErrors.appointmentDate}</span>}
                      <label>
                        Appointment Time
                        <input
                          type="time"
                          name="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleInputChange}
                          className={formErrors.appointmentTime ? 'error' : ''}
                          required
                        />
                      </label>
                      {formErrors.appointmentTime && <span className="error-message">{formErrors.appointmentTime}</span>}
                      <label>
                        Visit Type
                        <select
                          name="visitType"
                          value={formData.visitType}
                          onChange={handleInputChange}
                          className={formErrors.visitType ? 'error' : ''}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="Routine">Routine Check-Up</option>
                          <option value="Emergency">Emergency Visit</option>
                          <option value="Follow-up">Follow-Up</option>
                        </select>
                      </label>
                      {formErrors.visitType && <span className="error-message">{formErrors.visitType}</span>}
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="attended"
                          checked={formData.attended}
                          onChange={handleInputChange}
                          className={formErrors.attended ? 'error' : ''}
                        />
                        <span className="checkbox-indicator"></span>
                        <span>Attended</span>
                      </label>
                      {formErrors.attended && <span className="error-message">{formErrors.attended}</span>}
                    </div>
                  </div>
                )}

                {activeTab === 'vitalSigns' && (
                  <div className="form-content">
                    <h3>Vital Signs</h3>
                    <div className="form-grid">
                      <label>
                        Blood Pressure (mmHg)
                        <input
                          type="text"
                          name="bloodPressure"
                          value={formData.bloodPressure}
                          onChange={handleInputChange}
                          className={formErrors.bloodPressure ? 'error' : ''}
                          placeholder="e.g., 120/80"
                          required
                        />
                      </label>
                      {formErrors.bloodPressure && <span className="error-message">{formErrors.bloodPressure}</span>}
                      <label>
                        Heart Rate (bpm)
                        <input
                          type="number"
                          name="heartRate"
                          value={formData.heartRate}
                          onChange={handleInputChange}
                          className={formErrors.heartRate ? 'error' : ''}
                          placeholder="e.g., 78"
                          required
                        />
                      </label>
                      {formErrors.heartRate && <span className="error-message">{formErrors.heartRate}</span>}
                      <label>
                        Temperature (°C)
                        <input
                          type="number"
                          step="0.1"
                          name="temperature"
                          value={formData.temperature}
                          onChange={handleInputChange}
                          className={formErrors.temperature ? 'error' : ''}
                          placeholder="e.g., 36.5"
                          required
                        />
                      </label>
                      {formErrors.temperature && <span className="error-message">{formErrors.temperature}</span>}
                      <label>
                        Weight (kg)
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className={formErrors.weight ? 'error' : ''}
                          placeholder="e.g., 65"
                          required
                        />
                      </label>
                      {formErrors.weight && <span className="error-message">{formErrors.weight}</span>}
                    </div>
                  </div>
                )}

                {activeTab === 'obstetric' && (
                  <div className="form-content">
                    <h3>Obstetric Assessments</h3>
                    <div className="form-grid">
                      <label>
                        Fundal Height (cm)
                        <input
                          type="number"
                          name="fundalHeight"
                          value={formData.fundalHeight}
                          onChange={handleInputChange}
                          className={formErrors.fundalHeight ? 'error' : ''}
                          placeholder="e.g., 30"
                          required
                        />
                      </label>
                      {formErrors.fundalHeight && <span className="error-message">{formErrors.fundalHeight}</span>}
                      <label>
                        Fetal Heart Rate (bpm)
                        <input
                          type="number"
                          name="fetalHeartRate"
                          value={formData.fetalHeartRate}
                          onChange={handleInputChange}
                          className={formErrors.fetalHeartRate ? 'error' : ''}
                          placeholder="e.g., 140"
                          required
                        />
                      </label>
                      {formErrors.fetalHeartRate && <span className="error-message">{formErrors.fetalHeartRate}</span>}
                      <label>
                        Gestational Age (weeks)
                        <input
                          type="number"
                          name="gestationalAge"
                          value={formData.gestationalAge}
                          onChange={handleInputChange}
                          className={formErrors.gestationalAge ? 'error' : ''}
                          placeholder="e.g., 28"
                          required
                        />
                      </label>
                      {formErrors.gestationalAge && <span className="error-message">{formErrors.gestationalAge}</span>}
                    </div>
                  </div>
                )}

                {activeTab === 'clinical' && (
                  <div className="form-content">
                    <h3>Clinical Observations</h3>
                    <div className="form-grid">
                      <label>
                        Physical Examination Findings
                        <textarea
                          name="physicalFindings"
                          value={formData.physicalFindings}
                          onChange={handleInputChange}
                          className={formErrors.physicalFindings ? 'error' : ''}
                          placeholder="Describe findings..."
                          required
                        />
                      </label>
                      {formErrors.physicalFindings && <span className="error-message">{formErrors.physicalFindings}</span>}
                      <label>
                        Symptom Review
                        <textarea
                          name="symptoms"
                          value={formData.symptoms}
                          onChange={handleInputChange}
                          className={formErrors.symptoms ? 'error' : ''}
                          placeholder="Patient-reported symptoms..."
                          required
                        />
                      </label>
                      {formErrors.symptoms && <span className="error-message">{formErrors.symptoms}</span>}
                    </div>
                  </div>
                )}

                {activeTab === 'lab' && (
                  <div className="form-content">
                    <h3>Lab & Diagnostics</h3>
                    <div className="form-grid">
                      <label>
                        Lab Results
                        <textarea
                          name="labResults"
                          value={formData.labResults}
                          onChange={handleInputChange}
                          className={formErrors.labResults ? 'error' : ''}
                          placeholder="e.g., Hemoglobin, blood glucose..."
                          required
                        />
                      </label>
                      {formErrors.labResults && <span className="error-message">{formErrors.labResults}</span>}
                      <label>
                        Ultrasound Summary
                        <textarea
                          name="ultrasoundSummary"
                          value={formData.ultrasoundSummary}
                          onChange={handleInputChange}
                          className={formErrors.ultrasoundSummary ? 'error' : ''}
                          placeholder="Summary of ultrasound findings..."
                          required
                        />
                      </label>
                      {formErrors.ultrasoundSummary && <span className="error-message">{formErrors.ultrasoundSummary}</span>}
                    </div>
                  </div>
                )}

                {activeTab === 'medications' && (
                  <div className="form-content">
                    <h3>Medications & Treatments</h3>
                    <div className="form-grid">
                      <label>
                        Prescribed Medications
                        <textarea
                          name="prescribedMedications"
                          value={formData.prescribedMedications}
                          onChange={handleInputChange}
                          className={formErrors.prescribedMedications ? 'error' : ''}
                          placeholder="Medications, dosage and frequency..."
                          required
                        />
                      </label>
                      {formErrors.prescribedMedications && <span className="error-message">{formErrors.prescribedMedications}</span>}
                      <label>
                        Interventions
                        <textarea
                          name="interventions"
                          value={formData.interventions}
                          onChange={handleInputChange}
                          className={formErrors.interventions ? 'error' : ''}
                          placeholder="Treatments or procedures performed..."
                          required
                        />
                      </label>
                      {formErrors.interventions && <span className="error-message">{formErrors.interventions}</span>}
                    </div>
                  </div>
                )}

                {activeTab === 'followUp' && (
                  <div className="form-content">
                    <h3>Follow-Up & Recommendations</h3>
                    <div className="form-grid">
                      <label>
                        Next Appointment Date
                        <input
                          type="date"
                          name="nextAppointmentDate"
                          value={formData.nextAppointmentDate}
                          onChange={handleInputChange}
                          className={formErrors.nextAppointmentDate ? 'error' : ''}
                          required
                        />
                      </label>
                      {formErrors.nextAppointmentDate && <span className="error-message">{formErrors.nextAppointmentDate}</span>}
                      <label>
                        Care Recommendations
                        <textarea
                          name="careRecommendations"
                          value={formData.careRecommendations}
                          onChange={handleInputChange}
                          className={formErrors.careRecommendations ? 'error' : ''}
                          placeholder="Advice on lifestyle, diet, additional tests..."
                          required
                        />
                      </label>
                      {formErrors.careRecommendations && <span className="error-message">{formErrors.careRecommendations}</span>}
                      <label>
                        Notes on Adherence
                        <textarea
                          name="adherenceNotes"
                          value={formData.adherenceNotes}
                          onChange={handleInputChange}
                          className={formErrors.adherenceNotes ? 'error' : ''}
                          placeholder="Comments on patient compliance..."
                          required
                        />
                      </label>
                      {formErrors.adherenceNotes && <span className="error-message">{formErrors.adherenceNotes}</span>}
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="form-content">
                    <h3>Additional Notes</h3>
                    <div className="form-grid">
                      <label>
                        Doctor's Observations
                        <textarea
                          name="doctorsObservations"
                          value={formData.doctorsObservations}
                          onChange={handleInputChange}
                          className={formErrors.doctorsObservations ? 'error' : ''}
                          placeholder="Any further observations or concerns..."
                          required
                        />
                      </label>
                      {formErrors.doctorsObservations && <span className="error-message">{formErrors.doctorsObservations}</span>}
                      <label>
                        Patient Concerns
                        <textarea
                          name="patientConcerns"
                          value={formData.patientConcerns}
                          onChange={handleInputChange}
                          className={formErrors.patientConcerns ? 'error' : ''}
                          placeholder="Patient's questions or concerns..."
                          required
                        />
                      </label>
                      {formErrors.patientConcerns && <span className="error-message">{formErrors.patientConcerns}</span>}
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

            <div className="detailed-records">
              <h3>Detailed Appointment Records</h3>
              {appointmentRecords.length > 0 ? (
                <div className="records-grid">
                  {appointmentRecords
                    .filter((record) => record && record.appointmentDate)
                    .map((record) => (
                      <div key={record.id} className="record-card">
                        <div className="record-header">
                          <div className="record-info">
                            <span className="record-date">
                              {new Date(record.appointmentDate).toLocaleDateString()} at{' '}
                              {record.appointmentTime || 'N/A'}
                            </span>
                            <span className="record-type">{record.visitType || 'N/A'}</span>
                          </div>
                          <button
                            className="toggle-details-btn"
                            onClick={() => toggleRecordExpansion(record.id)}
                          >
                            {expandedRecords[record.id] ? 'Hide' : 'View'}
                          </button>
                        </div>
                        {expandedRecords[record.id] && (
                          <div className="record-details">
                            <div className="details-grid">
                              <div>
                                <strong>Attended:</strong> {record.attended ? 'Yes' : 'No'}
                              </div>
                              <div>
                                <strong>Blood Pressure:</strong> {record.bloodPressure || 'N/A'}
                              </div>
                              <div>
                                <strong>Heart Rate:</strong> {record.heartRate || 'N/A'}
                              </div>
                              <div>
                                <strong>Temperature:</strong> {record.temperature || 'N/A'}
                              </div>
                              <div>
                                <strong>Weight:</strong> {record.weight || 'N/A'}
                              </div>
                              <div>
                                <strong>Fundal Height:</strong> {record.fundalHeight || 'N/A'}
                              </div>
                              <div>
                                <strong>Fetal Heart Rate:</strong> {record.fetalHeartRate || 'N/A'}
                              </div>
                              <div>
                                <strong>Gestational Age:</strong> {record.gestationalAge || 'N/A'}
                              </div>
                              <div>
                                <strong>Physical Findings:</strong>{' '}
                                {record.physicalFindings || 'N/A'}
                              </div>
                              <div>
                                <strong>Symptoms:</strong> {record.symptoms || 'N/A'}
                              </div>
                              <div>
                                <strong>Lab Results:</strong> {record.labResults || 'N/A'}
                              </div>
                              <div>
                                <strong>Ultrasound Summary:</strong>{' '}
                                {record.ultrasoundSummary || 'N/A'}
                              </div>
                              <div>
                                <strong>Prescribed Medications:</strong>{' '}
                                {record.prescribedMedications || 'N/A'}
                              </div>
                              <div>
                                <strong>Interventions:</strong> {record.interventions || 'N/A'}
                              </div>
                              <div>
                                <strong>Next Appointment Date:</strong>{' '}
                                {record.nextAppointmentDate
                                  ? new Date(record.nextAppointmentDate).toLocaleDateString()
                                  : 'N/A'}
                              </div>
                              <div>
                                <strong>Care Recommendations:</strong>{' '}
                                {record.careRecommendations || 'N/A'}
                              </div>
                              <div>
                                <strong>Adherence Notes:</strong> {record.adherenceNotes || 'N/A'}
                              </div>
                              <div>
                                <strong>Doctor's Observations:</strong>{' '}
                                {record.doctorsObservations || 'N/A'}
                              </div>
                              <div>
                                <strong>Patient Concerns:</strong> {record.patientConcerns || 'N/A'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="no-records">No appointment records found for this mother.</p>
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
    </div>
  );
};

export default AppointmentRecord;
