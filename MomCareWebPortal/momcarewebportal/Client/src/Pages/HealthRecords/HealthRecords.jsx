import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HealthRecords.scss";
import { useToast } from "../../Components/ui/use-toast";
import Cookies from "js-cookie";

const HealthRecords = () => {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [motherResults, setMotherResults] = useState([]);
  const [selectedMother, setSelectedMother] = useState(null);
  const [showSearch, setShowSearch] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    hypertension: false,
    diabetes: false,
    thyroidDisorders: false,
    obesity: false,
    hiv: false,
    syphilis: false,
    malaria: false,
    uti: false,
    depression: "",
    anxiety: "",
    stressLevel: "",
    previousComplications: [],
    parity: "",
    gravidity: ""
  });

  const [activeTab, setActiveTab] = useState("maternal");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        setLoading(true);
        axios
          .get(
            `http://localhost:5000/api/mothers/search?search=${encodeURIComponent(searchQuery)}`,
            {
              headers: { Authorization: `Bearer ${Cookies.get("token")}` }
            }
          )
          .then((response) => {
            setMotherResults(response.data.data || []);
          })
          .catch((error) => {
            toast({ title: "Error", description: "Failed to fetch mothers." });
          })
          .finally(() => setLoading(false));
      } else {
        setMotherResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, toast]);

  const handleMotherSelect = (mother) => {
    setSelectedMother(mother);
    setShowSearch(false);
  };

  const handleResetSearch = () => {
    setSelectedMother(null);
    setSearchQuery("");
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
      depression: "",
      anxiety: "",
      stressLevel: "",
      previousComplications: [],
      parity: "",
      gravidity: ""
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
        : prev.previousComplications.filter((comp) => comp !== value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMother) {
      toast({ title: "Error", description: "Please select a mother before submitting." });
      return;
    }
    const recordData = { ...formData, motherId: selectedMother.id };
    axios
      .post("http://localhost:5000/api/healthrecords", recordData, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` }
      })
      .then(() => {
        toast({ title: "Success", description: "Health record saved successfully." });
        setFormData({
          hypertension: false,
          diabetes: false,
          thyroidDisorders: false,
          obesity: false,
          hiv: false,
          syphilis: false,
          malaria: false,
          uti: false,
          depression: "",
          anxiety: "",
          stressLevel: "",
          previousComplications: [],
          parity: "",
          gravidity: ""
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to save health record."
        });
      });
  };

  const tabs = [
    { id: "maternal", label: "Medical History", icon: "🩺" },
    { id: "infectious", label: "Infectious Diseases", icon: "🦠" },
    { id: "mental", label: "Mental Health", icon: "🧠" },
    { id: "obstetric", label: "Obstetric History", icon: "🤰" }
  ];

  return (
    <div className="health-records-page">
      <header className="page-header">
        <div className="search-container">
          {showSearch && (
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search for a mother by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {loading && <div className="loading">Searching...</div>}
              {!loading && searchQuery.trim() !== "" && motherResults.length === 0 && (
                <div className="no-results">No mothers found</div>
              )}
              {motherResults.length > 0 && (
                <ul className="search-results">
                  {motherResults.map((mother) => (
                    <li key={mother.id} onClick={() => handleMotherSelect(mother)}>
                      <span>{mother.firstName} {mother.lastName}</span>
                      <span className="email">{mother.email}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </header>

      {!selectedMother && (
        <div className="welcome-section">
          <div className="welcome-card">
            <h1>Welcome to Health Records</h1>
            <p>
              Track and manage maternal health records with ease. Use the search bar above to find a mother by name or email, then update her medical, infectious, mental, and obstetric history.
            </p>
            <div className="tips-grid">
              <div className="tip-card">
                <span className="tip-icon">📋</span>
                <h3>Quick Start</h3>
                <p>Enter a mother’s name or email to begin recording her health journey.</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🕒</span>
                <h3>Save Time</h3>
                <p>Use checkboxes for common conditions and numeric inputs for mental health scores.</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🤰</span>
                <h3>Focus on Care</h3>
                <p>Monitor key stats like gestational age and provide personalized notes.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMother && (
        <div className="health-records-container">
          <div className="sidebar">
            <h1>Health Records</h1>
            <div className="mother-profile">
              <h2>{selectedMother.firstName} {selectedMother.lastName}</h2>
              <div className="profile-details">
                <p><strong>Email:</strong> {selectedMother.email}</p>
                <p><strong>Phone:</strong> {selectedMother.phone}</p>
                <p><strong>Location:</strong> {selectedMother.ward}, {selectedMother.constituency}, {selectedMother.county}</p>
                <p><strong>Assigned CHW:</strong> {selectedMother.assignedCHW || "Not assigned"}</p>
                <p><strong>Due Date:</strong> {new Date(selectedMother.dueDate).toDateString()}</p>
                <p><strong>Pregnancy Stage:</strong> {selectedMother.pregnancyStage}</p>
                <p><strong>Weeks Pregnant:</strong> {selectedMother.weeksPregnant}</p>
              </div>
            </div>
            <nav className="sidebar-nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
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
                {activeTab === "maternal" && (
                  <div className="form-content">
                    <h3>Medical History</h3>
                    <div className="checkbox-grid">
                      {[
                        { name: "hypertension", label: "Hypertension" },
                        { name: "diabetes", label: "Diabetes" },
                        { name: "thyroidDisorders", label: "Thyroid Disorders" },
                        { name: "obesity", label: "Obesity" }
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

                {activeTab === "infectious" && (
                  <div className="form-content">
                    <h3>Infectious Diseases</h3>
                    <div className="checkbox-grid">
                      {[
                        { name: "hiv", label: "HIV/AIDS" },
                        { name: "syphilis", label: "Syphilis" },
                        { name: "malaria", label: "Malaria" },
                        { name: "uti", label: "Urinary Infections" }
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

                {activeTab === "mental" && (
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

                {activeTab === "obstetric" && (
                  <div className="form-content">
                    <h3>Obstetric History</h3>
                    <div className="obstetric-content">
                      <div className="checkbox-grid complications">
                        <h4>Previous Complications</h4>
                        {[
                          "Preeclampsia",
                          "Eclampsia",
                          "Gestational Diabetes",
                          "Miscarriage",
                          "Stillbirth",
                          "Preterm Birth"
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
                <button type="submit" className="submit-btn">
                  Save Record
                </button>
                <button type="button" className="cancel-btn" onClick={handleResetSearch}>
                  Cancel
                </button>
              </div>
            </form>

            <div className="additional-content">
              <div className="quick-stats">
                <h3>Quick Stats</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-icon">🩺</span>
                    <p>Blood Pressure</p>
                    <h4>120/80 mmHg</h4>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">⚖️</span>
                    <p>Weight</p>
                    <h4>65 kg</h4>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">🤰</span>
                    <p>Gestational Age</p>
                    <h4>28 weeks</h4>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">❤️</span>
                    <p>Heart Rate</p>
                    <h4>78 bpm</h4>
                  </div>
                </div>
              </div>
              <div className="notes-section">
                <h3>Doctor’s Notes</h3>
                <p>
                  You mentioned mild fatigue last visit. We recommend more hydration and a follow-up in 2 weeks. We’re watching for gestational diabetes due to your family history—stay strong!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;