import React, { useState } from "react";
import "./Patients.scss";

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [pregnancyStageFilter, setPregnancyStageFilter] = useState("All");
  const [viewingPatient, setViewingPatient] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const chwList = {
    Nairobi: ["Susan", "Peter"],
    Mombasa: ["John", "Lucy"],
    Kisumu: ["Mary", "David"],
  };

  const [newMother, setNewMother] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    pregnancyStage: "",
    chw: "",
  });

  const patients = [
    {
      id: 1,
      name: "Jane Doe",
      risk: "High",
      location: "Nairobi",
      stage: "First Trimester",
      chw: "Susan",
      history: {
        visits: ["2024-11-15 - Follow-up required", "2024-10-20 - Routine check"],
        labResults: ["Blood pressure normal", "Hemoglobin slightly low"],
        riskAssessments: ["Requires nutritional support"],
      },
    },
    {
      id: 2,
      name: "Mary Wanjiru",
      risk: "Medium",
      location: "Mombasa",
      stage: "Second Trimester",
      chw: "John",
      history: {
        visits: ["2024-10-25 - Routine check"],
        labResults: ["All normal"],
        riskAssessments: ["No major concerns"],
      },
    },
    {
      id: 3,
      name: "Grace Akinyi",
      risk: "Low",
      location: "Kisumu",
      stage: "Third Trimester",
      chw: "Mary",
      history: {
        visits: ["2024-10-10 - Routine check"],
        labResults: ["All normal"],
        riskAssessments: ["No major concerns"],
      },
    },
    {
      id: 4,
      name: "Alice Njeri",
      risk: "High",
      location: "Nairobi",
      stage: "First Trimester",
      chw: "Peter",
      history: {
        visits: ["2024-11-05 - Follow-up required", "2024-10-10 - Routine check"],
        labResults: ["Blood pressure high", "Hemoglobin low"],
        riskAssessments: ["Requires immediate attention"],
      },
    },

    {
      id: 5,
      name: "Sarah Adhiambo",
      risk: "Medium",
      location: "Mombasa",
      stage: "Second Trimester",
      chw: "Lucy",
      history: {
        visits: ["2024-11-10 - Routine check"],
        labResults: ["All normal"],
        riskAssessments: ["No major concerns"],
      },
    },
    {
      id: 6,
      name: "Lilian Achieng",
      risk: "Low",
      location: "Kisumu",
      stage: "Third Trimester",
      chw: "David",
      history: {
        visits: ["2024-10-15 - Routine check"],
        labResults: ["All normal"],
        riskAssessments: ["No major concerns"],
      },
    },

    {
        id: 7,
        name: "Jane Doe",
        risk: "High",
        location: "Nairobi",
        stage: "First Trimester",
        chw: "Susan",
        history: {
          visits: ["2024-11-15 - Follow-up required", "2024-10-20 - Routine check"],
          labResults: ["Blood pressure normal", "Hemoglobin slightly low"],
          riskAssessments: ["Requires nutritional support"],
        },
    },
    {
        id: 8,
        name: "Mary Wanjiru",
        risk: "Medium",
        location: "Mombasa",
        stage: "Second Trimester",
        chw: "John",
        history: {
          visits: ["2024-10-25 - Routine check"],
          labResults: ["All normal"],
          riskAssessments: ["No major concerns"],
        },
    },
    {
        id: 9,
        name: "Grace Akinyi",
        risk: "Low",
        location: "Kisumu",
        stage: "Third Trimester",
        chw: "Mary",
        history: {
          visits: ["2024-10-10 - Routine check"],
          labResults: ["All normal"],
          riskAssessments: ["No major concerns"],
        },
    },
    {
        id: 10,
        name: "Alice Njeri",
        risk: "High",
        location: "Nairobi",
        stage: "First Trimester",
        chw: "Peter",
        history: {
          visits: ["2024-11-05 - Follow-up required", "2024-10-10 - Routine check"],
          labResults: ["Blood pressure high", "Hemoglobin low"],
          riskAssessments: ["Requires immediate attention"],
        },
    },
    {
        id: 11,
        name: "Sarah Adhiambo",
        risk: "Medium",
        location: "Mombasa",
        stage: "Second Trimester",
        chw: "Lucy",
        history: {
          visits: ["2024-11-10 - Routine check"],
          labResults: ["All normal"],
          riskAssessments: ["No major concerns"],
        },
    },
    {
        id: 12,
        name: "Lilian Achieng",
        risk: "Low",
        location: "Kisumu",
        stage: "Third Trimester",
        chw: "David",
        history: {
          visits: ["2024-10-15 - Routine check"],
          labResults: ["All normal"],
          riskAssessments: ["No major concerns"],
        },
    },
        
  ];

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleRiskFilter = (event) => {
    setRiskFilter(event.target.value);
  };

  const handleLocationFilter = (event) => {
    setLocationFilter(event.target.value);
  };

  const handlePregnancyStageFilter = (event) => {
    setPregnancyStageFilter(event.target.value);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setNewMother((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "location") {
      setNewMother((prev) => ({
        ...prev,
        chw: "",
      }));
    }
  };

  const handleRegisterMother = (e) => {
    e.preventDefault();
    console.log("New Mother Registered:", newMother);
    setShowRegisterForm(false);
    setNewMother({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      pregnancyStage: "",
      chw: "",
    });
  };

  const filteredPatients = patients
    .filter((patient) =>
      patient.name.toLowerCase().includes(searchQuery)
    )
    .filter((patient) =>
      riskFilter === "All" || patient.risk === riskFilter
    )
    .filter((patient) =>
      locationFilter === "All" || patient.location === locationFilter
    )
    .filter((patient) =>
      pregnancyStageFilter === "All" || patient.stage === pregnancyStageFilter
    );

  const handleViewPatient = (patient) => {
    setViewingPatient(patient);
  };

  const handleCloseProfile = () => {
    setViewingPatient(null);
  };

  const entriesPerPage = 10;

  const totalPages = Math.ceil(filteredPatients.length / entriesPerPage);
  const displayedPatients = filteredPatients.slice(
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

  return (
    <div className="patients">
      <h1>Patient Management</h1>

      {/* Register New Patient */}
      <button
        className="register-btn"
        onClick={() => setShowRegisterForm(true)}
      >
        Register New Mother
      </button>

      {/* Modal: Register New Patient */}
      {showRegisterForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Register New Mother</h2>
            <form onSubmit={handleRegisterMother}>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={newMother.firstName}
                  onChange={handleRegisterChange}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={newMother.lastName}
                  onChange={handleRegisterChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={newMother.email}
                  onChange={handleRegisterChange}
                  required
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="tel"
                  name="phone"
                  value={newMother.phone}
                  onChange={handleRegisterChange}
                  required
                />
              </label>
              <label>
                Location (District):
                <select
                  name="location"
                  value={newMother.location}
                  onChange={handleRegisterChange}
                  required
                >
                  <option value="">Select Location</option>
                  <option value="Nairobi">Nairobi</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Kisumu">Kisumu</option>
                </select>
              </label>
              <label>
                Pregnancy Stage:
                <select
                  name="pregnancyStage"
                  value={newMother.pregnancyStage}
                  onChange={handleRegisterChange}
                  required
                >
                  <option value="">Select Stage</option>
                  <option value="First Trimester">First Trimester</option>
                  <option value="Second Trimester">Second Trimester</option>
                  <option value="Third Trimester">Third Trimester</option>
                </select>
              </label>
              <label>
                Assigned CHW:
                <select
                  name="chw"
                  value={newMother.chw}
                  onChange={handleRegisterChange}
                  required
                  disabled={!newMother.location}
                >
                  <option value="">Select CHW</option>
                  {newMother.location &&
                    chwList[newMother.location]?.map((chw, index) => (
                      <option key={index} value={chw}>
                        {chw}
                      </option>
                    ))}
                </select>
              </label>

              <div>
              <button type="submit">Register</button>
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
              >
                Cancel
              </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearch}
        />
        <select value={riskFilter} onChange={handleRiskFilter}>
          <option value="All">All Risks</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select value={locationFilter} onChange={handleLocationFilter}>
          <option value="All">All Locations</option>
          <option value="Nairobi">Nairobi</option>
          <option value="Mombasa">Mombasa</option>
          <option value="Kisumu">Kisumu</option>
        </select>
        <select value={pregnancyStageFilter} onChange={handlePregnancyStageFilter}>
          <option value="All">All Stages</option>
          <option value="First Trimester">First Trimester</option>
          <option value="Second Trimester">Second Trimester</option>
          <option value="Third Trimester">Third Trimester</option>
        </select>
      </div>

      {/* Patient List */}
      <div className="patient-list">
        <h2>Registered Patients</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Risk Level</th>
              <th>Location</th>
              <th>Pregnancy Stage</th>
              <th>Assigned CHW</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td className={`${patient.risk.toLowerCase()}-risk`}>{patient.risk}</td>
                <td>{patient.location}</td>
                <td>{patient.stage}</td>
                <td>{patient.chw}</td>
                <td><button onClick={() => handleViewPatient(patient)}>View</button></td>
                
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => handlePageChange("prev")}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button disabled={currentPage === totalPages} onClick={() => handlePageChange("next")}>
            Next
          </button>
        </div>
      </div>

      {/* Modal: Patient Profile */}
      {viewingPatient && (
        <div className="modal">
          <div className="modal-content">
            <h2>{viewingPatient.name}'s Profile</h2>
            <p><strong>Risk Level:</strong> {viewingPatient.risk}</p>
            <p><strong>Location:</strong> {viewingPatient.location}</p>
            <p><strong>Pregnancy Stage:</strong> {viewingPatient.stage}</p>
            <p><strong>Assigned CHW:</strong> {viewingPatient.chw}</p>
            <h3>Health History</h3>
            <p><strong>Visits:</strong></p>
            <ul>
              {viewingPatient.history.visits.map((visit, index) => (
                <li key={index}>{visit}</li>
              ))}
            </ul>
            <p><strong>Lab Results:</strong></p>
            <ul>
              {viewingPatient.history.labResults.map((result, index) => (
                <li key={index}>{result}</li>
              ))}
            </ul>
            <p><strong>Risk Assessments:</strong></p>
            <ul>
              {viewingPatient.history.riskAssessments.map((assessment, index) => (
                <li key={index}>{assessment}</li>
              ))}
            </ul>
            <button onClick={handleCloseProfile}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
