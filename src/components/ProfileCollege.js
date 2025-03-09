// ProfileCollege.js
import React, { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebase";
import Cookies from "js-cookie";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaKey,
  FaBuilding,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ProfileCollege = () => {
  const [collegeData, setCollegeData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    collegeName: "",
    collegeCenterCode: "",
    userType: "",
    password: ""
  });
  

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const userPhoneNumber = Cookies.get("userPhoneNumber");

  useEffect(() => {
    const collegeRef = ref(database, `ScholarshipPortalDashboard/users/${userPhoneNumber.replace(".", "_")}`);
    onValue(collegeRef, (snapshot) => {
      if (snapshot.exists()) {
        setCollegeData(snapshot.val());
      }
    });
  }, [userPhoneNumber]);

  const handleUpdate = async () => {
    try {
      const collegeRef = ref(database, `ScholarshipPortalDashboard/users/${userPhoneNumber.replace(".", "_")}`);
      await update(collegeRef, collegeData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.oldPassword !== collegeData.password) {
      toast.error("Current password is incorrect");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const collegeRef = ref(database, `ScholarshipPortalDashboard/users//${userPhoneNumber.replace(".", "_")}`);
      await update(collegeRef, { password: passwordData.newPassword });
      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  return (
    <>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mt-4"
    >
      <div className="card shadow-lg" style={{marginTop:"155px"}}>
        <div className="card-header bg-primary text-white">
          <h2 className="card-title mb-0">
            <FaBuilding className="me-2" />
            College Profile
          </h2>
        </div>
        <div className="card-body">
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <FaBuilding className="me-2" />
                  College Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={collegeData.collegeName}
                  onChange={(e) =>
                    setCollegeData({ ...collegeData, collegeName: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <FaUser className="me-2" />
                  Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={collegeData.name}
                  onChange={(e) =>
                    setCollegeData({ ...collegeData, name: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <FaEnvelope className="me-2" />
                  Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  value={collegeData.email}
                  onChange={(e) =>
                    setCollegeData({ ...collegeData, email: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <FaPhone className="me-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control form-control-lg"
                  value={collegeData.phoneNumber}
                  onChange={(e) =>
                    setCollegeData({ ...collegeData, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <FaKey className="me-2" />
                  College Center Code
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={collegeData.collegeCenterCode}
                  onChange={(e) =>
                    setCollegeData({ ...collegeData, collegeCenterCode: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <FaUser className="me-2" />
                  User Type
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={collegeData.userType}
                  disabled
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                className="btn btn-success btn-lg me-2"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
            <div className="row g-4">
            <div className="col-md-6">
              <div className="p-3 border rounded bg-light">
                <p className="mb-2">
                  <FaBuilding className="me-2 text-primary" />
                  <strong>College Name:</strong>
                </p>
                <h5>{collegeData.collegeName}</h5>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 border rounded bg-light">
                <p className="mb-2">
                  <FaUser className="me-2 text-primary" />
                  <strong>Name:</strong>
                </p>
                <h5>{collegeData.name}</h5>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 border rounded bg-light">
                <p className="mb-2">
                  <FaEnvelope className="me-2 text-primary" />
                  <strong>Email:</strong>
                </p>
                <h5>{collegeData.email}</h5>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 border rounded bg-light">
                <p className="mb-2">
                  <FaPhone className="me-2 text-primary" />
                  <strong>Phone Number:</strong>
                </p>
                <h5>{collegeData.phoneNumber}</h5>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 border rounded bg-light">
                <p className="mb-2">
                  <FaKey className="me-2 text-primary" />
                  <strong>College Center Code:</strong>
                </p>
                <h5>{collegeData.collegeCenterCode}</h5>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 border rounded bg-light">
                <p className="mb-2">
                  <FaUser className="me-2 text-primary" />
                  <strong>User Type:</strong>
                </p>
                <h5>{collegeData.userType}</h5>
              </div>
            </div>
          </div>
          
              <div className="mt-4">
                <button
                  className="btn btn-primary btn-lg me-2"
                  onClick={() => setIsEditing(true)}
                >
                  <FaUser className="me-2" />
                  Edit Profile
                </button>
                <button
                  className="btn btn-warning btn-lg"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <FaKey className="me-2" />
                  Change Password
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <motion.div
              className="modal-content"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaKey className="me-2" />
                  Change Password
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPasswordModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handlePasswordChange}
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
    </>
  );
};

export default ProfileCollege;
