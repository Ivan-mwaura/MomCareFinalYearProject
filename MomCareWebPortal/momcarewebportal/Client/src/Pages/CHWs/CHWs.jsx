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

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      let isMounted = true;
      try {
        const response = await axios.post("http://localhost:5000/api/v1/register-chw", newCHW);
        if (isMounted) {
          // Optionally, update Redux store or refetch data here
          setShowForm(false);
          toast({
            title: "🎉 Success!",
            description: "New CHW has been registered successfully.",
          });
        }
      } catch (err) {
        if (isMounted) {
          setShowForm(false);
          toast({
            title: "❌ Error!",
            description: err.response?.data?.msg || "An error occurred.",
          });
        }
      }
      return () => {
        isMounted = false;
      };
    },
    [newCHW, toast]
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
            <h2>{editingCHW ? "Edit CHW" : "Add New CHW"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-grid">
                {/* Left Column */}
                <div className="form-left">
                  <label>
                    First Name:
                    <input
                      type="text"
                      name="firstName"
                      value={newCHW.firstName}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Last Name:
                    <input
                      type="text"
                      name="lastName"
                      value={newCHW.lastName}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Phone:
                    <input
                      type="tel"
                      name="phone"
                      value={newCHW.phone}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      type="email"
                      name="email"
                      value={newCHW.email}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Emergency Contact Name:
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={newCHW.emergencyContactName}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Emergency Contact Phone:
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      value={newCHW.emergencyContactPhone}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Emergency Contact Relation:
                    <select
                      name="emergencyContactRelation"
                      value={newCHW.emergencyContactRelation}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Relation</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                    </select>
                  </label>
                </div>

                {/* Right Column */}
                <div className="form-right">
                  <label>
                    County:
                    <select
                      name="county"
                      value={newCHW.county}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select County</option>
                      {Object.keys(locationData).map((county) => (
                        <option key={county} value={county}>
                          {county}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Constituency:
                    <select
                      name="constituency"
                      value={newCHW.constituency}
                      onChange={handleFormChange}
                      required
                      disabled={!newCHW.county}
                    >
                      <option value="">Select Constituency</option>
                      {newCHW.county &&
                        Object.keys(locationData[newCHW.county] || {}).map((constituency) => (
                          <option key={constituency} value={constituency}>
                            {constituency}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Ward:
                    <select
                      name="ward"
                      value={newCHW.ward}
                      onChange={handleFormChange}
                      required
                      disabled={!newCHW.constituency}
                    >
                      <option value="">Select Ward</option>
                      {newCHW.constituency &&
                        (locationData[newCHW.county]?.[newCHW.constituency] || []).map((ward) => (
                          <option key={ward} value={ward}>
                            {ward}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Health Focus Area:
                    <select
                      name="healthFocusArea"
                      value={newCHW.healthFocusArea}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Health Focus Area</option>
                      <option value="Maternal Health">Maternal Health</option>
                      <option value="Child Health">Child Health</option>
                      <option value="Family Planning">Family Planning</option>
                      <option value="Infectious Diseases">Infectious Diseases</option>
                      <option value="Non-Communicable Diseases">Non-Communicable Diseases</option>
                    </select>
                  </label>
                  <label>
                    Roles and Responsibilities:
                    <select
                      name="rolesAndResponsibilities"
                      value={newCHW.rolesAndResponsibilities}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Monitoring and Evaluation">Monitoring and Evaluation</option>
                      <option value="Patient Care">Patient Care</option>
                      <option value="Community Outreach">Community Outreach</option>
                      <option value="Data Collection">Data Collection</option>
                      <option value="Health Education">Health Education</option>
                    </select>
                  </label>
                  <label>
                    Status:
                    <select
                      name="status"
                      value={newCHW.status}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </label>
                  <label>
                    Languages Spoken:
                    <select
                      name="languagesSpoken"
                      value={newCHW.languagesSpoken}
                      onChange={handleFormChange}
                      multiple
                      required
                    >
                      <option value="English">English</option>
                      <option value="Swahili">Swahili</option>
                      <option value="Kikuyu">Kikuyu</option>
                      <option value="Luhya">Luhya</option>
                      <option value="Luo">Luo</option>
                      <option value="Kalenjin">Kalenjin</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CHWs;
