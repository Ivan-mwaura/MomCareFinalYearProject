import React, { useState } from "react";
import "./CHWs.scss";

const CHWs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingCHW, setViewingCHW] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCHW, setEditingCHW] = useState(null);

  const CHWsPerPage = 10;

  // Dummy Data
  const CHWList = [
    { id: 1, name: "Susan", location: "Nairobi", hospital: "Kenyatta Hospital", contact: "0723456789", assignedPatients: 20 },
    { id: 2, name: "John", location: "Mombasa", hospital: "Coast General Hospital", contact: "0712345678", assignedPatients: 25 },
    { id: 3, name: "Lucy", location: "Nakuru", hospital: "Nakuru County Hospital", contact: "0734567890", assignedPatients: 15 },
    { id: 4, name: "Mary", location: "Kisumu", hospital: "Jaramogi Oginga Odinga Hospital", contact: "0701234567", assignedPatients: 10 },
    { id: 5, name: "David", location: "Eldoret", hospital: "Moi Teaching and Referral Hospital", contact: "0756789012", assignedPatients: 18 },
  ];

  const totalPages = Math.ceil(CHWList.length / CHWsPerPage);

  const filteredCHWs = CHWList.filter((chw) =>
    chw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chw.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chw.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentCHWs = filteredCHWs.slice(
    (currentPage - 1) * CHWsPerPage,
    currentPage * CHWsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleViewCHW = (chw) => {
    setViewingCHW(chw);
  };

  const handleCloseProfile = () => {
    setViewingCHW(null);
  };

  const handleAddCHW = () => {
    setShowForm(true);
    setEditingCHW(null);
  };

  const handleEditCHW = (chw) => {
    setShowForm(true);
    setEditingCHW(chw);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingCHW) {
      console.log("CHW Updated:", editingCHW);
    } else {
      console.log("New CHW Added");
    }
    setShowForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditingCHW((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="chw-management">
      <h1>CHW Management</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search CHWs by name, location, or hospital..."
          value={searchQuery}
          onChange={handleSearch}
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
              <th>Location</th>
              <th>Hospital</th>
              <th>Contact</th>
              <th>Assigned Patients</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCHWs.map((chw) => (
              <tr key={chw.id}>
                <td>{chw.name}</td>
                <td>{chw.location}</td>
                <td>{chw.hospital}</td>
                <td>{chw.contact}</td>
                <td>{chw.assignedPatients}</td>
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
            <h2>{viewingCHW.name}&apos;s Profile</h2>
            <p>
              <strong>Location:</strong> {viewingCHW.location}
            </p>
            <p>
              <strong>Hospital:</strong> {viewingCHW.hospital}
            </p>
            <p>
              <strong>Contact:</strong> {viewingCHW.contact}
            </p>
            <p>
              <strong>Assigned Patients:</strong> {viewingCHW.assignedPatients}
            </p>
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
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={editingCHW?.name || ""}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={editingCHW?.location || ""}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Hospital:
                <input
                  type="text"
                  name="hospital"
                  value={editingCHW?.hospital || ""}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Contact:
                <input
                  type="text"
                  name="contact"
                  value={editingCHW?.contact || ""}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <button type="submit">Save</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CHWs;
