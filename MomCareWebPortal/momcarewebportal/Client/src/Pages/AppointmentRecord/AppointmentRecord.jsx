
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMother) {
      toast({ title: 'Error', description: 'Please select a mother before submitting.' });
      return;
    }
    if (!formData.appointmentTime) {
      toast({ title: 'Error', description: 'Appointment Time is required.' });
      return;
    }
    setSubmitting(true);
    const recordData = { ...formData, motherId: selectedMother.id };
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/appointmentRecords`, recordData, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      })
      .then((response) => {
        toast({ title: 'Success', description: 'Appointment record saved successfully.' });
        setAppointmentRecords((prev) => [...prev, response.data.data]);
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
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to save appointment record.',
        });
      })
      .finally(() => setSubmitting(false));
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
              <p>Enter a name or email to start recording a mother’s appointment details.</p>
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
                          required
                        />
                      </label>
                      <label>
                        Appointment Time
                        <input
                          type="time"
                          name="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                      <label>
                        Visit Type
                        <select
                          name="visitType"
                          value={formData.visitType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="Routine">Routine Check-Up</option>
                          <option value="Emergency">Emergency Visit</option>
                          <option value="Follow-up">Follow-Up</option>
                        </select>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="attended"
                          checked={formData.attended}
                          onChange={handleInputChange}
                        />
                        <span className="checkbox-indicator"></span>
                        <span>Attended</span>
                      </label>
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
                          placeholder="e.g., 120/80"
                          required
                        />
                      </label>
                      <label>
                        Heart Rate (bpm)
                        <input
                          type="number"
                          name="heartRate"
                          value={formData.heartRate}
                          onChange={handleInputChange}
                          placeholder="e.g., 78"
                          required
                        />
                      </label>
                      <label>
                        Temperature (°C)
                        <input
                          type="number"
                          step="0.1"
                          name="temperature"
                          value={formData.temperature}
                          onChange={handleInputChange}
                          placeholder="e.g., 36.5"
                          required
                        />
                      </label>
                      <label>
                        Weight (kg)
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          placeholder="e.g., 65"
                          required
                        />
                      </label>
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
                          placeholder="e.g., 30"
                          required
                        />
                      </label>
                      <label>
                        Fetal Heart Rate (bpm)
                        <input
                          type="number"
                          name="fetalHeartRate"
                          value={formData.fetalHeartRate}
                          onChange={handleInputChange}
                          placeholder="e.g., 140"
                          required
                        />
                      </label>
                      <label>
                        Gestational Age (weeks)
                        <input
                          type="number"
                          name="gestationalAge"
                          value={formData.gestationalAge}
                          onChange={handleInputChange}
                          placeholder="e.g., 28"
                          required
                        />
                      </label>
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
                          placeholder="Describe findings..."
                          required
                        />
                      </label>
                      <label>
                        Symptom Review
                        <textarea
                          name="symptoms"
                          value={formData.symptoms}
                          onChange={handleInputChange}
                          placeholder="Patient-reported symptoms..."
                          required
                        />
                      </label>
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
                          placeholder="e.g., Hemoglobin, blood glucose..."
                          required
                        />
                      </label>
                      <label>
                        Ultrasound Summary
                        <textarea
                          name="ultrasoundSummary"
                          value={formData.ultrasoundSummary}
                          onChange={handleInputChange}
                          placeholder="Summary of ultrasound findings..."
                          required
                        />
                      </label>
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
                          placeholder="Medications, dosage and frequency..."
                          required
                        />
                      </label>
                      <label>
                        Interventions
                        <textarea
                          name="interventions"
                          value={formData.interventions}
                          onChange={handleInputChange}
                          placeholder="Treatments or procedures performed..."
                          required
                        />
                      </label>
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
                          required
                        />
                      </label>
                      <label>
                        Care Recommendations
                        <textarea
                          name="careRecommendations"
                          value={formData.careRecommendations}
                          onChange={handleInputChange}
                          placeholder="Advice on lifestyle, diet, additional tests..."
                          required
                        />
                      </label>
                      <label>
                        Notes on Adherence
                        <textarea
                          name="adherenceNotes"
                          value={formData.adherenceNotes}
                          onChange={handleInputChange}
                          placeholder="Comments on patient compliance..."
                          required
                        />
                      </label>
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
                          placeholder="Any further observations or concerns..."
                          required
                        />
                      </label>
                      <label>
                        Patient Concerns
                        <textarea
                          name="patientConcerns"
                          value={formData.patientConcerns}
                          onChange={handleInputChange}
                          placeholder="Patient's questions or concerns..."
                          required
                        />
                      </label>
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
    </div>
  );
};

export default AppointmentRecord;
