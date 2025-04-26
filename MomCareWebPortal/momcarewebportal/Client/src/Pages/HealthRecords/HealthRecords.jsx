
import React, { useState, useEffect, useRef } from 'react';
import axios from '../../utils/axiosConfig';
import { useToast } from '../../Components/ui/use-toast';
import Cookies from 'js-cookie';
import HealthRecordsSkeleton from '../../Components/Skeletons/HealthRecordsSkeleton';
import CircularProgress from '@mui/material/CircularProgress';
import './HealthRecords.scss';

const HealthRecords = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [motherResults, setMotherResults] = useState([]);
  const [selectedMother, setSelectedMother] = useState(null);
  const [showSearch, setShowSearch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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
  });
  const [activeTab, setActiveTab] = useState('maternal');
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
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMother) {
      toast({ title: 'Error', description: 'Please select a mother before submitting.' });
      return;
    }
    setSubmitting(true);
    const recordData = { ...formData, motherId: selectedMother.id };
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/healthrecords`, recordData, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      })
      .then(() => {
        toast({ title: 'Success', description: 'Health record saved successfully.' });
        setFormData({
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
        });
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to save health record.',
        });
      })
      .finally(() => setSubmitting(false));
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

 /* if (loading && !motherResults.length) {
    return <HealthRecordsSkeleton />;
  }*/

  return (
    <div className={`health-records ${darkMode ? 'dark-mode' : ''}`}>
      <div className="health-records-header">
        <div className="user-info">
          <div className="user-initials">IM</div>
          <div className="user-welcome">
            <p>Welcome, Ivy Mitchelle</p>
          </div>
        </div>
        <h1>Health Records</h1>
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
          <h2>Welcome to Health Records</h2>
          <p>
            Track and manage maternal health records with ease. Search for a mother by name or email
            to update her medical, infectious, mental, or obstetric history.
          </p>
          <div className="tip-cards">
            <div className="tip-card">
              <span className="tip-icon">📋</span>
              <h3>Quick Start</h3>
              <p>Enter a name or email to begin recording a mother’s health journey.</p>
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
                        />
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
                        />
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
                        />
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
                          />
                        </label>
                        <label>
                          Gravidity (Pregnancies)
                          <input
                            type="number"
                            name="gravidity"
                            value={formData.gravidity}
                            onChange={handleInputChange}
                            min="0"
                          />
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
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;
