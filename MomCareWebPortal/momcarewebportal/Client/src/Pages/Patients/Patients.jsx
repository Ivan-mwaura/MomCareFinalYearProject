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
    chwId: "", // Will be selected from the filtered CHWs list
    dob: "",
    nationalId: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    dueDate: "",
    password: ""
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
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
  };

  // Register new mother function with token included in headers
  const handleRegisterMother = (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/mothers/register`, newMother, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        console.log("New mother registered:", response.data);
        toast({
          title: "✅ Mother Registered",
          description: "The mother has been successfully registered.",
        });
        setShowRegisterForm(false);
        dispatch(fetchMothers()); // Refresh mothers list after registration
      })
      .catch((error) => {
        console.error("Error registering new mother:", error);
        toast({
          title: "❌ Registration Failed",
          description: error.response?.data?.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      });
  };

  // Apply filters on mothers
  const filteredPatients = mothers
    ? mothers
        .filter((mother) =>
          mother.firstName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((mother) =>
          riskFilter === "All" || mother.risk === riskFilter
        )
        .filter((mother) =>
          locationFilter === "All" || mother.ward === locationFilter
        )
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

  // Filter the list of CHWs based on the selected ward (and optionally, county/constituency)
  const filteredCHWs = newMother.ward && chws && chws.filter((chw) => {
    return chw.ward.toLowerCase() === newMother.ward.toLowerCase();
  });

  return (
    <>
      {mothersLoading || chwsLoading ? (
        // Skeleton placeholder for the whole Patients page while loading
        <div className="loading-overlay">
          <Skeleton variant="rectangular" width="100%" height={400} />
        </div>
      ) : (
        <div className="patients">
          <h1>Patient Management</h1>

          <button className="register-btn" onClick={() => setShowRegisterForm(true)}>
            Register New Mother
          </button>

          {showRegisterForm && (
            <div className="modal">
              <div className="modal-content">
                <h2>Register New Mother</h2>
                <form onSubmit={handleRegisterMother}>
                  <div className="form-grid">
                    <div className="form-left">
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
                        Date of Birth (DOB):
                        <input
                          type="date"
                          name="dob"
                          value={newMother.dob}
                          onChange={handleRegisterChange}
                          required
                        />
                      </label>
                      <label>
                        National ID or Passport Number:
                        <input
                          type="text"
                          name="nationalId"
                          value={newMother.nationalId}
                          onChange={handleRegisterChange}
                          required
                        />
                      </label>
                      <label>
                        Emergency Contact Name:
                        <input
                          type="text"
                          name="emergencyContactName"
                          value={newMother.emergencyContactName}
                          onChange={handleRegisterChange}
                          required
                        />
                      </label>
                      <label>
                        Emergency Contact Phone:
                        <input
                          type="tel"
                          name="emergencyContactPhone"
                          value={newMother.emergencyContactPhone}
                          onChange={handleRegisterChange}
                          required
                        />
                      </label>
                      <label>
                        Emergency Contact Relation:
                        <input
                          type="text"
                          name="emergencyContactRelation"
                          value={newMother.emergencyContactRelation}
                          onChange={handleRegisterChange}
                          required
                        />
                      </label>
                      <label>
                        Password:
                        <input
                          type="password"
                          name="password"
                          value={newMother.password}
                          onChange={handleRegisterChange}
                          required
                        />
                      </label>
                    </div>
                    <div className="form-right">
                      <label>
                        County:
                        <select
                          name="county"
                          value={newMother.county}
                          onChange={handleRegisterChange}
                          required
                        >
                          <option value="">Select County</option>
                          {Object.keys(locationData).map((county, index) => (
                            <option key={index} value={county}>
                              {county}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Constituency:
                        <select
                          name="constituency"
                          value={newMother.constituency}
                          onChange={handleRegisterChange}
                          required
                          disabled={!newMother.county}
                        >
                          <option value="">Select Constituency</option>
                          {newMother.county &&
                            Object.keys(locationData[newMother.county]).map(
                              (constituency, index) => (
                                <option key={index} value={constituency}>
                                  {constituency}
                                </option>
                              )
                            )}
                        </select>
                      </label>
                      <label>
                        Ward:
                        <select
                          name="ward"
                          value={newMother.ward}
                          onChange={handleRegisterChange}
                          required
                          disabled={!newMother.constituency}
                        >
                          <option value="">Select Ward</option>
                          {newMother.constituency &&
                            locationData[newMother.county][newMother.constituency].map(
                              (ward, index) => (
                                <option key={index} value={ward}>
                                  {ward}
                                </option>
                              )
                            )}
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
                        Weeks Pregnant:
                        <input
                          type="number"
                          name="weeksPregnant"
                          value={newMother.weeksPregnant}
                          onChange={handleRegisterChange}
                          required
                        />
                      </label>
                      <label>
                        Assigned CHW:
                        <select
                          name="chwId"
                          value={newMother.chwId}
                          onChange={handleRegisterChange}
                          disabled={!newMother.ward || chwsLoading}
                        >
                          <option value="">Select CHW</option>
                          {newMother.ward && chws && filteredCHWs.map((chw) => (
                            <option key={chw.id} value={chw.id}>
                              {chw.firstName} {chw.lastName}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Expected Due Date:
                        <input
                          type="date"
                          name="dueDate"
                          value={newMother.dueDate}
                          onChange={handleRegisterChange}
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <button type="submit" disabled={mothersLoading || chwsLoading}>
                      {mothersLoading || chwsLoading ? <CircularProgress size={24} /> : "Register"}
                    </button>
                    <button type="button" onClick={() => setShowRegisterForm(false)}>
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="All">All Risks</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="">Select Ward</option>
              {wardsList.map((ward, index) => (
                <option key={index} value={ward}>
                  {ward}
                </option>
              ))}
            </select>
            <select value={pregnancyStageFilter} onChange={(e) => setPregnancyStageFilter(e.target.value)}>
              <option value="All">All Stages</option>
              <option value="First Trimester">First Trimester</option>
              <option value="Second Trimester">Second Trimester</option>
              <option value="Third Trimester">Third Trimester</option>
            </select>
          </div>

          {/* Patient List */}
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
                      <td>{mother.firstName} {mother.lastName}</td>
                      <td>{mother.risk || "High"}</td>
                      <td>{mother.ward}</td>
                      <td>{mother.pregnancyStage}</td>
                      <td>{mother.weeksPregnant}</td>
                      <td>{mother.assignedCHW || mother.chwId}</td>
                      <td>
                        <button onClick={() => handleViewPatient(mother)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

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
                <h2>{viewingPatient.firstName}&apos;s Profile</h2>
                <p><strong>Risk Level:</strong> {viewingPatient.risk || "High"}</p>
                <p><strong>Location:</strong> {viewingPatient.ward}</p>
                <p><strong>Pregnancy Stage:</strong> {viewingPatient.pregnancyStage}</p>
                <p><strong>Weeks Pregnant:</strong> {viewingPatient.weeksPregnant}</p>
                <p>
                  <strong>Assigned CHW:</strong>{" "}
                  {viewingPatient.assignedCHW || viewingPatient.chwId}
                </p>
                <h3>Health History</h3>
                <ul>
                  {/* Additional details can be added here */}
                </ul>
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
