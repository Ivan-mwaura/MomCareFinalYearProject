import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import "./Doctors.scss";
import { useToast } from "../../Components/ui/use-toast";
import Cookies from "js-cookie";
import DoctorsSkeleton from "../../Components/Skeletons/DoctorsSkeleton"; // Import the skeleton

const INITIAL_DOCTOR_STATE = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  hospitalName: "",
  department: "",
  licenseNumber: "",
  yearsOfExperience: "",
  qualifications: "",
  status: "Active",
  searchQuery: ""
};

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Add loading state
  const { toast } = useToast();
  const [newDoctor, setNewDoctor] = useState(INITIAL_DOCTOR_STATE);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true); // Set loading to true
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/doctors`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        setDoctors(response.data.doctors || []);
      } catch (error) {
        toast({
          title: "❌ Error",
          description: "Failed to fetch doctors."
        });
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchDoctors();
  }, [toast]);

  const doctorsPerPage = 10;
  const totalPages = useMemo(() => Math.ceil(doctors.length / doctorsPerPage), [doctors.length]);
  const filteredDoctors = useMemo(() => {
    if (newDoctor.searchQuery) {
      return doctors.filter((doc) =>
        `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(newDoctor.searchQuery.toLowerCase()) ||
        doc.hospitalName.toLowerCase().includes(newDoctor.searchQuery.toLowerCase())
      );
    }
    return doctors;
  }, [doctors, newDoctor.searchQuery]);

  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * doctorsPerPage;
    return filteredDoctors.slice(start, start + doctorsPerPage);
  }, [filteredDoctors, currentPage, doctorsPerPage]);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const response = editingDoctor
          ? await axios.put(`${import.meta.env.VITE_BACKEND_URL}/doctors/${editingDoctor.id}`, newDoctor, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`
                }
          })
          : await axios.post(`${import.meta.env.VITE_BACKEND_URL}/doctors`, newDoctor, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`
                }
          });
        toast({
          title: "✅ Success",
          description: editingDoctor ? "Doctor updated successfully." : "Doctor registered successfully."
        });
        setDoctors((prev) => {
          if (editingDoctor) {
            return prev.map((doc) => (doc.id === editingDoctor.id ? response.data.doctor : doc));
          }
          return [...prev, response.data.doctor];
        });
        setShowForm(false);
        setNewDoctor(INITIAL_DOCTOR_STATE);
        setEditingDoctor(null);
      } catch (err) {
        toast({
          title: "❌ Error",
          description: err.response?.data?.message || "An error occurred."
        });
      }
    },
    [newDoctor, editingDoctor, toast]
  );

  const handleViewDoctor = useCallback((doctor) => {
    setViewingDoctor(doctor);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setViewingDoctor(null);
  }, []);

  const handleAddDoctor = useCallback(() => {
    setShowForm(true);
    setEditingDoctor(null);
    setNewDoctor(INITIAL_DOCTOR_STATE);
  }, []);

  const handleEditDoctor = useCallback((doctor) => {
    setShowForm(true);
    setEditingDoctor(doctor);
    setNewDoctor({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      phone: doctor.phone,
      email: doctor.email,
      password: doctor.password,
      hospitalName: doctor.hospitalName,
      department: doctor.department,
      licenseNumber: doctor.licenseNumber,
      yearsOfExperience: doctor.yearsOfExperience,
      qualifications: doctor.qualifications,
      status: doctor.status,
      searchQuery: ""
    });
  }, []);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  }, [currentPage, totalPages]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  }, [currentPage]);

  if (loading) {
    return <DoctorsSkeleton />;
  }

  return (
    <div className="doctor-management">
      <header className="page-header">
        <h1>Doctor Management</h1>
        <button className="add-doctor-btn" onClick={handleAddDoctor}>
          Add New Doctor
        </button>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search doctors by name or hospital..."
          value={newDoctor.searchQuery || ""}
          onChange={(e) =>
            setNewDoctor((prev) => ({ ...prev, searchQuery: e.target.value }))
          }
        />
      </div>

      <div className="doctor-list">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Hospital</th>
              <th>Department</th>
              <th>License</th>
              <th>Experience</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDoctors.map((doc) => (
              <tr key={doc.id}>
                <td>{`${doc.firstName} ${doc.lastName}`}</td>
                <td>{doc.hospitalName}</td>
                <td>{doc.department}</td>
                <td>{doc.licenseNumber}</td>
                <td>{doc.yearsOfExperience} years</td>
                <td>{doc.phone}</td>
                <td>{doc.status}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleViewDoctor(doc)}>View</button>
                    <button onClick={() => handleEditDoctor(doc)}>Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDoctors.length > doctorsPerPage && (
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal: Doctor Profile */}
      {viewingDoctor && (
        <div className="modal">
          <div className="modal-content">
            <h2>{viewingDoctor.firstName} {viewingDoctor.lastName}'s Profile</h2>
            <div className="profile-details">
              <p><strong>Email:</strong> {viewingDoctor.email}</p>
              <p><strong>Phone:</strong> {viewingDoctor.phone}</p>
              <p><strong>Hospital:</strong> {viewingDoctor.hospitalName}</p>
              <p><strong>Department:</strong> {viewingDoctor.department}</p>
              <p><strong>License Number:</strong> {viewingDoctor.licenseNumber}</p>
              <p><strong>Years of Experience:</strong> {viewingDoctor.yearsOfExperience}</p>
              <p><strong>Qualifications:</strong> {viewingDoctor.qualifications}</p>
              <p><strong>Status:</strong> {viewingDoctor.status}</p>
            </div>
            <div className="modal-actions">
              <button onClick={handleCloseProfile}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Doctor */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-grid">
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <label>
                    First Name
                    <input
                      type="text"
                      name="firstName"
                      value={newDoctor.firstName}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Last Name
                    <input
                      type="text"
                      name="lastName"
                      value={newDoctor.lastName}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      type="tel"
                      name="phone"
                      value={newDoctor.phone}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      name="email"
                      value={newDoctor.email}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Password
                    <input
                      type="password"
                      name="password"
                      value={newDoctor.password}
                      onChange={handleFormChange}
                      required
                      minLength="8"
                      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                      title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
                    />
                  </label>
                </div>
                <div className="form-section">
                  <h3>Professional Details</h3>
                  <label>
                    Hospital Name
                    <input
                      type="text"
                      name="hospitalName"
                      value={newDoctor.hospitalName}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Department
                    <input
                      type="text"
                      name="department"
                      value={newDoctor.department}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    License Number
                    <input
                      type="text"
                      name="licenseNumber"
                      value={newDoctor.licenseNumber}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Years of Experience
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={newDoctor.yearsOfExperience}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Qualifications
                    <textarea
                      name="qualifications"
                      value={newDoctor.qualifications}
                      onChange={handleFormChange}
                      required
                    />
                  </label>
                  <label>
                    Status
                    <select
                      name="status"
                      value={newDoctor.status}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
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

export default Doctors;