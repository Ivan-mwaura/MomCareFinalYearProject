import React, { useState } from "react";
import "./Profile.scss";
import { FaSave } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    location: "Nairobi",
    role: "Admin",
    hospital: "Nairobi Central Hospital",
  });

  const handleEditToggle = () => setEditMode(!editMode);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditMode(false);
    console.log("Profile Saved:", profileData);
  };

  return (
    <div className="profile-settings">
      <h1>Profile and Settings</h1>

      <div className="profile-container">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-picture">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
            />
          </div>
          <div className="profile-info">
            {editMode ? (
              <>
                <label>
                  First Name:
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Last Name:
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Location:
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Hospital:
                  <input
                    type="text"
                    name="hospital"
                    value={profileData.hospital}
                    onChange={handleInputChange}
                  />
                </label>
                <button className="save-btn" onClick={handleSave}>
                  <FaSave /> Save
                </button>
              </>
            ) : (
              <>
                <p>
                  <strong>First Name: </strong> {profileData.firstName}
                </p>
                <p>
                  <strong>Last Name: </strong> {profileData.lastName}
                </p>
                <p>
                  <strong>Email: </strong> {profileData.email}
                </p>
                <p>
                  <strong>Phone: </strong> {profileData.phone}
                </p>
                <p>
                  <strong>Location: </strong> {profileData.location}
                </p>
                <p>
                  <strong>Role: </strong> {profileData.role}
                </p>
                <p>
                  <strong>Hospital: </strong> {profileData.hospital}
                </p>
                <button className="edit-btn" onClick={handleEditToggle}>
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
