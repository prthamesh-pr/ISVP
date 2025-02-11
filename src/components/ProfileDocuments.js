// ProfileDocuments.js
import React, { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  ref as dbRef,
  set,
  onValue,
  get,
  update,
  remove,
} from "firebase/database";
import { storage, database } from "../firebase";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaIdCard,
  FaFileUpload,
  FaPlus,
  FaFileAlt,
  FaEdit,
  FaTrash,
  FaUpload,
  FaDownload
} from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardHeading from "./DashboardHeading";

const ProfileDocuments = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({});
  const [documents, setDocuments] = useState([
    { name: "Aadhar Card", file: null },
    { name: "PAN Card", file: null },
    { name: "College Allotment Letter", file: null },
    { name: "Birth Certificate", file: null },
  ]);
  const [newDocName, setNewDocName] = useState("");
  const userPhoneNumber = Cookies.get("userPhoneNumber");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editableUserData, setEditableUserData] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState({});

  const handleFileUpload = async (file, docName) => {
    try {
      const storageRef = ref(storage, `documents/${userPhoneNumber}/${docName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      await set(dbRef(database, `userDocuments/${userPhoneNumber.replace('.', '_')}/${docName}`), {
        name: docName,
        url: url,
        uploadDate: new Date().toISOString()
      });
      
      toast.success('Document uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading document');
    }
  };

  useEffect(() => {
    const documentsRef = dbRef(
      database,
      `userDocuments/${userPhoneNumber.replace(".", "_")}`
    );
    onValue(documentsRef, (snapshot) => {
      if (snapshot.exists()) {
        setUploadedDocuments(snapshot.val());
      }
    });
  }, [userPhoneNumber]);

  useEffect(() => {
    // Fetch user data
    const userRef = dbRef(
      database,
      `ScholarshipPortalDashboard/users/${userPhoneNumber.replace(".", "_")}`
    );
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }
    });
  }, [userPhoneNumber]);

  const handleFileChange = (index, file) => {
    const newDocs = [...documents];
    newDocs[index].file = file;
    setDocuments(newDocs);
  };

  const handleAddDocument = () => {
    if (newDocName.trim()) {
      setDocuments([...documents, { name: newDocName, file: null }]);
      setNewDocName("");
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const handleProfileUpdate = async () => {
    try {
      const userRef = dbRef(
        database,
        `ScholarshipPortalDashboard/users/${userPhoneNumber.replace(".", "_")}`
      );
      await update(userRef, editableUserData);
      setUserData(editableUserData);
      setIsEditingProfile(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleDeleteDocument = async (docName) => {
    try {
      // Delete from storage
      const storageRef = ref(
        storage,
        `documents/${userPhoneNumber}/${docName}`
      );
      await deleteObject(storageRef);

      // Delete from database
      const docRef = dbRef(
        database,
        `userDocuments/${userPhoneNumber.replace(".", "_")}/${docName}`
      );
      await remove(docRef);

      toast.success("Document deleted successfully!");
    } catch (error) {
      toast.error("Error deleting document");
    }
  };

  const handleUpdateDocument = async (docName, newFile) => {
    try {
      const storageRef = ref(
        storage,
        `documents/${userPhoneNumber}/${docName}`
      );
      await uploadBytes(storageRef, newFile);
      const url = await getDownloadURL(storageRef);

      await update(
        dbRef(
          database,
          `userDocuments/${userPhoneNumber.replace(".", "_")}/${docName}`
        ),
        {
          url: url,
          uploadDate: new Date().toISOString(),
        }
      );

      toast.success("Document updated successfully!");
    } catch (error) {
      toast.error("Error updating document");
    }
  };

  const handleUpload = async () => {
    try {
      for (const doc of documents) {
        if (doc.file) {
          const storageRef = ref(
            storage,
            `documents/${userPhoneNumber}/${doc.name}`
          );
          await uploadBytes(storageRef, doc.file);
          const url = await getDownloadURL(storageRef);

          await set(
            dbRef(
              database,
              `userDocuments/${userPhoneNumber.replace(".", "_")}/${doc.name}`
            ),
            {
              name: doc.name,
              url: url,
              uploadDate: new Date().toISOString(),
            }
          );
        }
      }
      toast.success("Documents uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading documents");
    }
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async () => {
    if (passwordData.oldPassword !== userData.password) {
      toast.error("Current password is incorrect");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const collegeRef = ref(
        database,
        `ScholarshipPortalDashboard/users//${userPhoneNumber.replace(".", "_")}`
      );
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
      <DashboardHeading text="Manage Profile" />
      <motion.div
        className="container mt-4 mb-5 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Tab Navigation */}
        <div
          className="d-flex justify-content-center mb-4"
          style={{ marginTop: "135px" }}
        >
          <ul className="nav nav-pills">
            <li className="nav-item me-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`nav-link ${
                  activeTab === "profile" ? "active" : ""
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <FaUser className="me-2" />
                Profile
              </motion.button>
            </li>
            <li className="nav-item">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`nav-link ${
                  activeTab === "documents" ? "active" : ""
                }`}
                onClick={() => setActiveTab("documents")}
              >
                <FaFileAlt className="me-2" />
                Documents
              </motion.button>
            </li>
          </ul>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div className="card shadow-lg" {...fadeIn}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title text-primary">
                  <FaUser className="me-2" />
                  Profile Information
                </h4>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setIsEditingProfile(!isEditingProfile);
                    setEditableUserData(userData);
                  }}
                >
                  {isEditingProfile ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {isEditingProfile ? (
                <div className="row g-4">
                  {/* Editable Fields */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editableUserData.name || ""}
                        onChange={(e) =>
                          setEditableUserData({
                            ...editableUserData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editableUserData.email || ""}
                        onChange={(e) =>
                          setEditableUserData({
                            ...editableUserData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={editableUserData.phoneNumber || ""}
                        onChange={(e) =>
                          setEditableUserData({
                            ...editableUserData,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>College Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editableUserData.collegeName || ""}
                        onChange={(e) =>
                          setEditableUserData({
                            ...editableUserData,
                            collegeName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12 mt-3">
                    <button
                      className="btn btn-primary"
                      onClick={handleProfileUpdate}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* Display Profile Info */
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                      <FaUser className="text-primary mb-2" />
                      <h6>Name</h6>
                      <p className="mb-0">{userData.name}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                      <FaEnvelope className="text-primary mb-2" />
                      <h6>Email</h6>
                      <p className="mb-0">{userData.email}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                      <FaPhone className="text-primary mb-2" />
                      <h6>Phone</h6>
                      <p className="mb-0">{userData.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                      <FaUniversity className="text-primary mb-2" />
                      <h6>College</h6>
                      <p className="mb-0">{userData.collegeName}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Password Change Section */}
              <div className="mt-4 pt-4 border-top">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <motion.div className="card shadow-lg" {...fadeIn}>
            <div className="card-body">
              <h4 className="card-title text-primary mb-4">
                <FaFileUpload className="me-2" />
                Required Documents
              </h4>
        
              {/* Required Documents Section */}
              <div className="mb-4">
                <h5>Mandatory Documents</h5>
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center justify-content-between p-3 border rounded mb-2"
                  >
                    <div>
                      <FaFileAlt className="me-2 text-danger" />
                      {doc.name} <span className="text-danger">*</span>
                    </div>
                    <div>
                      {uploadedDocuments[doc.name] ? (
                        <>
                          <input
                            type="file"
                            className="d-none"
                            id={`update-${doc.name}`}
                            onChange={(e) => handleUpdateDocument(doc.name, e.target.files[0])}
                          />
                          <a 
                          href={uploadedDocuments[doc.name].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-success btn-sm me-2"
                        >
                          <FaDownload className="me-1" /> Download
                        </a>
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => document.getElementById(`update-${doc.name}`).click()}
                          >
                            <FaEdit /> Update
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteDocument(doc.name)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </>
                      ) : (
                        <div className="input-group">
                          <input
                            type="file"
                            className="form-control"
                            onChange={(e) => handleFileChange(index, e.target.files[0])}
                          />
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleFileUpload(doc.file, doc.name)}
                            disabled={!doc.file}
                          >
                            <FaUpload className="me-2" />
                            Upload
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
        
              {/* Additional Documents Section */}
              <div className="mb-4">
                <h5>Additional Documents</h5>
                {Object.entries(uploadedDocuments)
                  .filter(([docName]) => !documents.find(doc => doc.name === docName))
                  .map(([docName, doc]) => (
                    <div
                      key={docName}
                      className="d-flex align-items-center justify-content-between p-3 border rounded mb-2"
                    >
                      <div>
                        <FaFileAlt className="me-2" />
                        {docName}
                      </div>
                      <div>
                        <input
                          type="file"
                          className="d-none"
                          id={`update-${docName}`}
                          onChange={(e) => handleUpdateDocument(docName, e.target.files[0])}
                        />
                        <a 
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success btn-sm me-2"
                      >
                        <FaDownload className="me-1" /> Download
                      </a>
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => document.getElementById(`update-${docName}`).click()}
                        >
                          <FaEdit /> Update
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteDocument(docName)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
        
              {/* Upload New Document */}
              <div className="mb-4">
                <h5>Upload Additional Document</h5>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Document Name"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                  />
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => handleFileUpload(e.target.files[0], newDocName)}
                  />
                  <button 
                    className="btn btn-primary"
                    disabled={!newDocName.trim()}
                  >
                    <FaUpload className="me-2" />
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Change Password</h5>
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
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePasswordChange}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default ProfileDocuments;
