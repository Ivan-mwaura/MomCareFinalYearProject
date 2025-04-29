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
    appointmentId: '',
  });
  const [activeTab, setActiveTab] = useState('visitDetails');
  const [appointmentRecords, setAppointmentRecords] = useState([]);
  const [expandedRecords, setExpandedRecords] = useState({});
  const searchRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [visitTypeOptions, setVisitTypeOptions] = useState([
    { value: 'Initial Visit', label: 'Initial Visit' },
    { value: 'Follow-up', label: 'Follow-up' },
    { value: 'Emergency', label: 'Emergency' },
    { value: 'Routine Check-up', label: 'Routine Check-up' },
    { value: 'Labor', label: 'Labor' },
    { value: 'Postpartum', label: 'Postpartum' },
  ]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
    const fetchAppointmentRecords = async () => {
      if (!selectedMother) return;

      try {
        console.log('Fetching appointment records for mother:', selectedMother.id);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/appointmentRecords/mother/${selectedMother.id}`,
          {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` },
          }
        );

        //console.log('Appointment records response:', response.data);

        if (response.data && response.data.data) {
          // Sort records by date and time in descending order
          const sortedRecords = response.data.data.sort((a, b) => {
            const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
            const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
            return dateB - dateA;
          });
          
          console.log('Setting appointment records:', sortedRecords);
          setAppointmentRecords(sortedRecords);
        } else {
          console.warn('No appointment records found in response:', response.data);
          setAppointmentRecords([]);
        }
      } catch (error) {
        console.error('Error fetching appointment records:', error);
          toast({
            title: 'Error',
          description: 'Failed to fetch appointment records. Please try again.',
          variant: 'destructive',
        });
        setAppointmentRecords([]);
      }
    };

    fetchAppointmentRecords();
  }, [selectedMother, toast]);

  useEffect(() => {
    const fetchScheduledAppointments = async () => {
      if (!selectedMother) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/appointments/mother/${selectedMother.id}`,
          {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` },
          }
        );

        console.log("Scheduled appointments response:", response.data);

        if (response.data.success) {
          const allAppointments = response.data.data;
          const today = new Date().toISOString().split('T')[0];
          
          // Filter today's appointments
          const todayAppointments = allAppointments.filter(
            appointment => appointment.date === today && appointment.status === "Scheduled"
          );
          
          setScheduledAppointments(todayAppointments);
          
          // Update visit type options to include both scheduled appointments and regular visit types
          setVisitTypeOptions([
            { value: '', label: 'Select Visit Type' },
            // Add scheduled appointments first
            ...todayAppointments.map(appointment => ({
              value: `scheduled:${appointment.id}`,
              label: `Scheduled: ${appointment.type} - ${appointment.time}`
            })),
            // Add regular visit types
            { value: 'Follow-up', label: 'Follow-up Visit' },
            { value: 'Emergency', label: 'Emergency Visit' },
            { value: 'Routine Check-up', label: 'Routine Check-up' },
            { value: 'Initial Visit', label: 'Initial Visit' },
            { value: 'Labor', label: 'Labor' },
            { value: 'Postpartum', label: 'Postpartum' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: '❌ Error',
          description: 'Failed to fetch appointments.',
          variant: 'destructive',
        });
      }
    };
    
    fetchScheduledAppointments();
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
      appointmentId: '',
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

  const handleVisitTypeChange = (e) => {
    const selectedValue = e.target.value;
    console.log('Selected visit type value:', selectedValue);
    
    if (selectedValue.startsWith('scheduled:')) {
      // Handle scheduled appointment selection
      const appointmentId = selectedValue.split(':')[1];
      console.log('Extracted appointmentId:', appointmentId);
      
      const appointment = scheduledAppointments.find(a => a.id === appointmentId);
      console.log('Found appointment:', appointment);
      
      if (appointment) {
        setSelectedAppointment(appointment);
        const updatedFormData = {
          ...formData,
          visitType: appointment.type,
          appointmentDate: appointment.date,
          appointmentTime: appointment.time,
          appointmentId: appointment.id
        };
        console.log('Setting form data with appointmentId:', updatedFormData.appointmentId);
        setFormData(updatedFormData);
      }
    } else {
      // Handle regular visit type selection
      console.log('Regular visit type selected, setting appointmentId to empty string');
      setSelectedAppointment(null);
      setFormData(prev => ({
        ...prev,
        visitType: selectedValue,
        appointmentDate: '',
        appointmentTime: '',
        appointmentId: '' // Set to empty string instead of null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const tabErrors = {
      visitDetails: [],
      vitalSigns: [],
      obstetric: [],
      clinical: [],
      lab: [],
      medications: [],
      followUp: [],
      notes: []
    };
    
    // Visit Details validation
    if (!formData.visitType) {
      errors.visitType = 'Visit type is required';
      tabErrors.visitDetails.push('Visit type is required');
    }

    if (!formData.appointmentDate) {
      errors.appointmentDate = 'Appointment date is required';
      tabErrors.visitDetails.push('Appointment date is required');
    } else if (!selectedAppointment) {
      // Only validate date format for non-scheduled appointments
      const appointmentDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (appointmentDate < today) {
        errors.appointmentDate = 'Appointment date cannot be in the past';
        tabErrors.visitDetails.push('Appointment date cannot be in the past');
      }
    }

    if (!formData.appointmentTime) {
      errors.appointmentTime = 'Appointment time is required';
      tabErrors.visitDetails.push('Appointment time is required');
    } else if (!selectedAppointment && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.appointmentTime)) {
      errors.appointmentTime = 'Invalid time format (use HH:mm)';
      tabErrors.visitDetails.push('Invalid time format (use HH:mm)');
    }

    // Vital Signs validation
    if (formData.bloodPressure && !/^\d{2,3}\/\d{2,3}$/.test(formData.bloodPressure)) {
      errors.bloodPressure = 'Invalid blood pressure format (e.g., 120/80)';
      tabErrors.vitalSigns.push('Invalid blood pressure format (e.g., 120/80)');
    }

    if (formData.heartRate) {
      const hr = Number(formData.heartRate);
      if (isNaN(hr) || hr < 40 || hr > 200) {
        errors.heartRate = 'Heart rate must be between 40 and 200 bpm';
        tabErrors.vitalSigns.push('Heart rate must be between 40 and 200 bpm');
      }
    }

    if (formData.temperature) {
      const temp = Number(formData.temperature);
      if (isNaN(temp) || temp < 35 || temp > 46) {
        errors.temperature = 'Temperature must be between 35°C and 46°C';
        tabErrors.vitalSigns.push('Temperature must be between 35°C and 46°C');
      }
    }

    if (formData.weight) {
      const weight = Number(formData.weight);
      if (isNaN(weight) || weight < 30 || weight > 250) {
        errors.weight = 'Weight must be between 30 and 250 kg';
        tabErrors.vitalSigns.push('Weight must be between 30 and 250 kg');
      }
    }

    // Obstetric validation
    if (formData.fundalHeight) {
      const fh = Number(formData.fundalHeight);
      if (isNaN(fh) || fh < 0 || fh > 250) {
        errors.fundalHeight = 'Fundal height must be between 0 and 250 cm';
        tabErrors.obstetric.push('Fundal height must be between 0 and 250 cm');
      }
    }

    if (formData.fetalHeartRate) {
      const fhr = Number(formData.fetalHeartRate);
      if (isNaN(fhr) || fhr < 80 || fhr > 160) {
        errors.fetalHeartRate = 'Fetal heart rate must be between 80 and 160 bpm';
        tabErrors.obstetric.push('Fetal heart rate must be between 80 and 160 bpm');
      }
    }

    if (formData.gestationalAge) {
      const ga = Number(formData.gestationalAge);
      if (isNaN(ga) || ga < 0 || ga > 45) {
        errors.gestationalAge = 'Gestational age must be between 0 and 45 weeks';
        tabErrors.obstetric.push('Gestational age must be between 0 and 45 weeks');
      }
    }

    // Clinical Observations validation
    if (!formData.physicalFindings?.trim()) {
      errors.physicalFindings = 'Physical findings are required';
      tabErrors.clinical.push('Physical findings are required');
    }
    if (!formData.symptoms?.trim()) {
      errors.symptoms = 'Symptoms are required';
      tabErrors.clinical.push('Symptoms are required');
    }

    // Lab & Diagnostics validation
    if (formData.labResults?.trim() && formData.labResults.length > 1000) {
      errors.labResults = 'Lab results must not exceed 1000 characters';
      tabErrors.lab.push('Lab results must not exceed 1000 characters');
    }

    // Medications validation
    if (formData.prescribedMedications?.trim() && formData.prescribedMedications.length > 1000) {
      errors.prescribedMedications = 'Prescribed medications must not exceed 1000 characters';
      tabErrors.medications.push('Prescribed medications must not exceed 1000 characters');
    }

    // Follow-Up validation
    if (formData.nextAppointmentDate) {
      const nextDate = new Date(formData.nextAppointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (nextDate < today) {
        errors.nextAppointmentDate = 'Next appointment date cannot be in the past';
        tabErrors.followUp.push('Next appointment date cannot be in the past');
      }
    }
    if (!formData.careRecommendations?.trim()) {
      errors.careRecommendations = 'Care recommendations are required';
      tabErrors.followUp.push('Care recommendations are required');
    }

    // Notes validation
    if (!formData.doctorsObservations?.trim()) {
      errors.doctorsObservations = 'Doctor\'s observations are required';
      tabErrors.notes.push('Doctor\'s observations are required');
    }
    if (!formData.patientConcerns?.trim()) {
      errors.patientConcerns = 'Patient concerns are required';
      tabErrors.notes.push('Patient concerns are required');
    }

    // Add tab errors to the main errors object
    Object.keys(tabErrors).forEach(tab => {
      if (tabErrors[tab].length > 0) {
        errors[`${tab}Tab`] = tabErrors[tab];
      }
    });

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
    if (!validateForm()) {
      setShowErrorModal(true);
      return;
    }

    setSubmitting(true);
    
    // Create recordData object with all form data
    const recordData = { 
      ...formData,
      motherId: selectedMother.id,
      // Set attended to true if there's a scheduled appointment
      attended: selectedAppointment ? true : formData.attended,
      // Only include appointmentId if there's a selected appointment
      appointmentId: selectedAppointment ? selectedAppointment.id : null
    };

    // Log the data being sent
    console.log('Sending appointment record data:', recordData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/appointmentRecords`,
        recordData,
        {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        }
      );

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
        appointmentId: '',
      });
      
      // Reset selected appointment
      setSelectedAppointment(null);
      
      // Reset to first tab
      setActiveTab('visitDetails');
      
      // Show success message
        toast({
        title: '✅ Success',
        description: 'Appointment record saved successfully.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving appointment record:', error);
      
      // Extract error message from response
      let errorMessage = 'An error occurred while saving the appointment record.';
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid data provided. Please check your inputs.';
        } else if (error.response.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (error.response.status === 404) {
          errorMessage = 'The requested resource was not found.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      }
      
      toast({
        title: '❌ Error',
        description: errorMessage,
        variant: 'destructive',
      });
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
    // Group errors by tab
    const tabErrors = {};
    const fieldErrors = {};
    
    Object.entries(errors).forEach(([key, value]) => {
      if (key.endsWith('Tab')) {
        const tabName = key.replace('Tab', '');
        tabErrors[tabName] = value;
      } else {
        fieldErrors[key] = value;
      }
    });
    
    // Format tab names for display
    const formatTabName = (tab) => {
      return tab
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
    };
    
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
        <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
          <div className="error-header">
            <h2>Please Fix the Following Errors</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
          
          {Object.keys(tabErrors).length > 0 && (
            <div className="tab-errors">
              <h3>Tab Errors</h3>
              {Object.entries(tabErrors).map(([tab, errors]) => (
                <div key={tab} className="tab-error-group">
                  <h4>{formatTabName(tab)} Tab</h4>
                  <ul>
                    {Array.isArray(errors) ? errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    )) : (
                      <li>{errors}</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
          
          {Object.keys(fieldErrors).length > 0 && (
            <div className="field-errors">
              <h3>Field Errors</h3>
              <div className="error-list">
                {Object.entries(fieldErrors).map(([field, error]) => (
                  <div key={field} className="error-item">
                    <strong>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> {error}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="error-actions">
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  /*if (loading && !motherResults.length) {
    return <AppointmentRecordSkeleton />;
  }*/

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
                      <div className="form-group">
                        <label htmlFor="visitType">Select Scheduled Appointment</label>
                        <select
                          id="visitType"
                          name="visitType"
                          value={formData.appointmentId ? `scheduled:${formData.appointmentId}` : formData.visitType}
                          onChange={handleVisitTypeChange}
                          className={formErrors.visitType ? 'error' : ''}
                          required
                        >
                          <option value="">Select Appointment</option>
                          {visitTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {formErrors.visitType && <span className="error-message">{formErrors.visitType}</span>}
                      </div>

                      {selectedAppointment ? (
                        <>
                      <label>
                        Appointment Date
                        <input
                          type="date"
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleInputChange}
                              className={formErrors.appointmentDate ? 'error' : ''}
                          required
                              disabled
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
                              disabled
                        />
                      </label>
                          {formErrors.appointmentTime && <span className="error-message">{formErrors.appointmentTime}</span>}
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                      
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
