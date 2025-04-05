// EligibilityStatusPage.js with dynamic fields and improved re-application
import React, { useEffect, useState } from "react";
import { ref, onValue, push, set, update } from "firebase/database";
import { database } from "../firebase";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaUserGraduate,
  FaCalendarAlt,
  FaEnvelope,
  FaUniversity,
  FaPaperPlane,
  FaExclamationCircle,
  FaClock,
  FaInfoCircle,
  FaCheck,
  FaTimes,
  FaDownload,
  FaStar,
  FaRedo,
  FaClipboardList
} from "react-icons/fa";
import "../EligibilityStatus.css";

const EligibilityStatusPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState({});
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [currentScholarship, setCurrentScholarship] = useState(null);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicFieldValues, setDynamicFieldValues] = useState({});
  const [isReapplying, setIsReapplying] = useState(false);
  const [currentApplicationId, setCurrentApplicationId] = useState(null);

  const userPhoneNumber = Cookies.get("userPhoneNumber");
  const collegeCode = Cookies.get("collegeCenterCode");
  const userName = Cookies.get("userName") || "";
  const userEmail = Cookies.get("userEmail") || "";
  const collegeName = Cookies.get("collegeName") || "";

  useEffect(() => {
    setIsLoading(true);

    // Fetch scholarships
    const scholarshipsRef = ref(database, `scholarships/${collegeCode}`);
    const unsubscribeScholarships = onValue(scholarshipsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const scholarshipsList = Object.entries(data).map(([id, details]) => ({
          id,
          ...details,
        }));
        setScholarships(scholarshipsList);
      } else {
        setScholarships([]);
      }
    });

    // Fetch user data
    const userRef = ref(
      database,
      `ScholarshipPortalDashboard/users/${userPhoneNumber.replace(".", "_")}`
    );
    const unsubscribeUser = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }
    });

    // Fetch user documents
    const docsRef = ref(database, `userDocuments/${userPhoneNumber}`);
    const unsubscribeDocs = onValue(docsRef, (snapshot) => {
      if (snapshot.exists()) {
        const docsData = snapshot.val();
        setUserData((prevData) => ({
          ...prevData,
          documents: docsData,
        }));
      }
    });

    // Fetch existing applications
    const applicationsRef = ref(
      database,
      `applications/${userPhoneNumber.replace(".", "_")}`
    );
    const unsubscribeApplications = onValue(applicationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const applicationsData = snapshot.val();

        // Convert to an object with scholarshipId as key for easier lookup
        const applicationsMap = {};
        Object.entries(applicationsData).forEach(([appId, appData]) => {
          applicationsMap[appData.scholarshipId] = {
            id: appId,
            ...appData,
          };
        });

        setApplications(applicationsMap);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribeScholarships();
      unsubscribeUser();
      unsubscribeDocs();
      unsubscribeApplications();
    };
  }, [collegeCode, userPhoneNumber]);

  const handleApplyClick = (scholarship) => {
    setCurrentScholarship(scholarship);
    const existingApplication = applications[scholarship.id];
    
    setIsReapplying(!!existingApplication);
    
    if (existingApplication) {
      setCurrentApplicationId(existingApplication.id);
      
      // Pre-fill existing dynamic field values if any
      if (existingApplication.dynamicFieldValues) {
        setDynamicFieldValues(existingApplication.dynamicFieldValues);
      } else {
        setDynamicFieldValues({});
      }
    } else {
      setCurrentApplicationId(null);
      setDynamicFieldValues({});
    }
    
    setShowApplyModal(true);
    setApplySuccess(false);
    setApplyError("");
  };

  const handleDynamicFieldChange = (fieldId, value) => {
    setDynamicFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleApplySubmit = async () => {
    if (!currentScholarship) return;

    setIsSubmitting(true);

    try {
      const applicationData = {
        scholarshipId: currentScholarship.id,
        scholarshipName: currentScholarship.name,
        status: isReapplying ? "pending" : "pending", // Reset to pending if reapplying
        appliedDate: new Date().toISOString(),
        userName,
        userEmail,
        userPhoneNumber,
        collegeName,
        collegeCode,
        documents: userData?.documents || {},
        dynamicFieldValues: dynamicFieldValues,
        reapplied: isReapplying,
        reappliedDate: isReapplying ? new Date().toISOString() : null
      };

      const applicationRef = ref(
        database,
        `applications/${userPhoneNumber.replace(".", "_")}`
      );

      if (isReapplying && currentApplicationId) {
        // Update existing application
        await update(ref(database, `applications/${userPhoneNumber.replace(".", "_")}/${currentApplicationId}`), applicationData);
      } else {
        // Create new application
        const newAppRef = push(applicationRef);
        await set(newAppRef, {
          ...applicationData,
          id: newAppRef.key
        });
        
        setCurrentApplicationId(newAppRef.key);
      }

      setApplySuccess(true);

      // Update local applications state
      setApplications((prev) => ({
        ...prev,
        [currentScholarship.id]: {
          id: isReapplying ? currentApplicationId : currentApplicationId || "new",
          ...applicationData,
        },
      }));

      setTimeout(() => {
        setShowApplyModal(false);
        setDynamicFieldValues({});
      }, 2000);
    } catch (error) {
      console.error("Error applying for scholarship:", error);
      setApplyError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if a scholarship is expired
  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  // Calculate days remaining until deadline
  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const deadline = new Date(endDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format a date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if user has already applied for a scholarship
  const hasApplied = (scholarshipId) => {
    return applications[scholarshipId] !== undefined;
  };

  // Check if application was rejected
  const isRejected = (scholarshipId) => {
    return applications[scholarshipId]?.status === "rejected";
  };

  // Render dynamic field input based on field type
  const renderDynamicFieldInput = (field) => {
    const value = dynamicFieldValues[field.id] || "";
    
    switch(field.type) {
      case 'text':
        return (
          <input
            type="text"
            className="form-input"
            value={value}
            onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className="form-input"
            value={value}
            onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            className="form-input"
            value={value}
            onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );
      case 'select':
        return (
          <select
            className="form-input"
            value={value}
            onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option.value}>{option.label}</option>
            )) || <option value="option">Option</option>}
          </select>
        );
      case 'file':
        return (
          <div className="file-upload-field">
            <input
              type="file"
              id={`file-${field.id}`}
              className="file-input"
              onChange={(e) => {
                // In a real implementation, you would handle file upload
                // For now, we just store the file name
                if (e.target.files && e.target.files[0]) {
                  handleDynamicFieldChange(field.id, e.target.files[0].name);
                }
              }}
              required={field.required}
            />
            <label htmlFor={`file-${field.id}`} className="file-label">
              {value ? value : "Choose file"}
            </label>
          </div>
        );
      default:
        return (
          <input
            type="text"
            className="form-input"
            value={value}
            onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="eligibility-status-page">
      <div className="container eligibility-container">
        <div className="page-intro">
          <h2 className="intro-title">Find Your Perfect Scholarship</h2>
          <p className="intro-text">
            Browse available scholarships, check requirements, and apply
            directly from this dashboard.
          </p>
        </div>

        <div className="main-content">
          {/* User Profile Section */}
          <div className="profile-sidebar">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="profile-card"
            >
              <div className="profile-header">
                <div className="profile-avatar">
                  <FaUserGraduate />
                </div>
                <h3 className="profile-name">{userData?.name || userName}</h3>
              </div>

              <div className="profile-details">
                <div className="profile-info">
                  <FaEnvelope className="info-icon" />
                  <span>{userData?.email || userEmail}</span>
                </div>

                <div className="profile-info">
                  <FaUniversity className="info-icon" />
                  <span>{userData?.collegeName || collegeName}</span>
                </div>
              </div>

              <div className="profile-documents">
                <h4 className="documents-title">
                  <FaFileAlt className="title-icon" />
                  Your Documents
                </h4>

                {userData?.documents &&
                Object.keys(userData.documents).length > 0 ? (
                  <ul className="documents-list">
                    {Object.entries(userData.documents).map(
                      ([docKey, docData]) => (
                        <li key={docKey} className="document-item">
                          <FaFileAlt className="document-icon" />

                          <a
                            href={docData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="document-link"
                            title="View document"
                          >
                            <FaDownload />{" "}
                            <span className="document-name">
                              {docData.name || docKey}
                            </span>
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <div className="no-documents">
                    <FaExclamationCircle className="warning-icon" />
                    <p>No documents uploaded yet</p>
                  </div>
                )}
              </div>

              <div className="applications-summary">
                <h4 className="summary-title">Your Applications</h4>
                <div className="applications-status">
                  <div className="status-item">
                    <span className="count-number">
                      {Object.keys(applications).length}
                    </span>
                    <span className="count-text">Total</span>
                  </div>
                  <div className="status-item pending">
                    <span className="count-number">
                      {Object.values(applications).filter(app => app.status === 'pending').length}
                    </span>
                    <span className="count-text">Pending</span>
                  </div>
                  <div className="status-item approved">
                    <span className="count-number">
                      {Object.values(applications).filter(app => app.status === 'approved').length}
                    </span>
                    <span className="count-text">Approved</span>
                  </div>
                  <div className="status-item rejected">
                    <span className="count-number">
                      {Object.values(applications).filter(app => app.status === 'rejected').length}
                    </span>
                    <span className="count-text">Rejected</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scholarships List */}
          <div className="scholarships-content">
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading scholarships...</p>
              </div>
            ) : (
              <>
                {scholarships.length > 0 ? (
                  <div className="scholarships-list">
                    {scholarships.map((scholarship, index) => {
                      const expired = isExpired(scholarship.endDate);
                      const daysRemaining = getDaysRemaining(
                        scholarship.endDate
                      );
                      const rejected = isRejected(scholarship.id);

                      return (
                        <motion.div
                          key={scholarship.id}
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`scholarship-card ${
                            expired ? "expired" : ""
                          } ${rejected ? "rejected" : ""}`}
                        >
                          {expired && (
                            <div className="expired-badge">
                              <FaClock />
                              <span>Expired</span>
                            </div>
                          )}

                          {hasApplied(scholarship.id) && (
                            <div className={`applied-badge ${applications[scholarship.id].status}`}>
                              {applications[scholarship.id].status === 'approved' ? (
                                <><FaCheck /> <span>Approved</span></>
                              ) : applications[scholarship.id].status === 'rejected' ? (
                                <><FaTimes /> <span>Rejected</span></>
                              ) : (
                                <><FaClock /> <span>Pending</span></>
                              )}
                            </div>
                          )}

                          <div className="scholarship-header">
                            <h3 className="scholarship-name">
                              {scholarship.name}
                            </h3>
                            {!expired && (
                              <div
                                className={`deadline-badge ${
                                  daysRemaining <= 7 ? "urgent" : ""
                                }`}
                              >
                                <FaCalendarAlt className="badge-icon" />
                                <span>
                                  {daysRemaining <= 0
                                    ? "Last day"
                                    : `${daysRemaining} days left`}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="scholarship-body">
                            <div className="scholarship-description">
                              <p>{scholarship.description}</p>

                              <div className="scholarship-details">
                                <div className="details-section">
                                  <h4>
                                    <FaStar className="section-icon" />
                                    Benefits
                                  </h4>
                                  <p>{scholarship.benefits}</p>
                                </div>

                                <div className="details-section">
                                  <h4>
                                    <FaInfoCircle className="section-icon" />
                                    Eligibility
                                  </h4>
                                  <p>{scholarship.eligibilityCriteria}</p>
                                </div>
                              </div>
                            </div>

                            <div className="scholarship-sidebar">
                              <div className="deadline-box">
                                <h4>Application Deadline</h4>
                                <p className="deadline-date">
                                  {formatDate(scholarship.endDate)}
                                </p>
                              </div>

                              <div className="documents-box">
                                <h4>Required Documents</h4>
                                <ul className="required-docs">
                                  {scholarship.requiredDocuments?.map(
                                    (doc, idx) => (
                                      <li key={idx}>
                                        <FaFileAlt className="doc-icon" />
                                        <span>{doc}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>

                              {/* Custom Fields Section */}
                              {scholarship.dynamicFields && scholarship.dynamicFields.length > 0 && (
                                <div className="custom-fields-box">
                                  <h4>
                                    <FaClipboardList className="fields-icon" />
                                    Additional Information Required
                                  </h4>
                                  <ul className="custom-fields-list">
                                    {scholarship.dynamicFields.map((field, idx) => (
                                      <li key={idx}>
                                        <span className="field-label">{field.label}</span>
                                        {field.required && <span className="required-marker">*</span>}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="scholarship-actions">
                                {hasApplied(scholarship.id) ? (
                                  <button
                                    className={`application-button ${applications[scholarship.id].status}`}
                                    onClick={() => handleApplyClick(scholarship)}
                                    disabled={expired || applications[scholarship.id].status === 'approved'}
                                  >
                                    {applications[scholarship.id].status === 'rejected' ? (
                                      <>
                                        <FaRedo /> Re-Apply
                                      </>
                                    ) : applications[scholarship.id].status === 'approved' ? (
                                      <>
                                        <FaCheck /> Approved
                                      </>
                                    ) : (
                                      <>
                                        <FaCheck /> Applied
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    className="apply-button"
                                    onClick={() => handleApplyClick(scholarship)}
                                    disabled={expired}
                                  >
                                    <FaPaperPlane /> Apply Now
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-scholarships">
                    <FaExclamationCircle className="icon" />
                    <h3>No Scholarships Available</h3>
                    <p>
                      There are currently no scholarships available from your
                      college.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="apply-modal-backdrop">
          <div className="apply-modal">
            {applySuccess ? (
              <div className="apply-success">
                <div className="success-icon">
                  <FaCheck />
                </div>
                <h3>{isReapplying ? "Application Updated!" : "Application Submitted!"}</h3>
                <p>{isReapplying 
                    ? "Your application has been successfully updated and will be reviewed again."
                    : "Your application has been successfully submitted."}</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h3>{isReapplying ? "Re-Apply for Scholarship" : "Apply for Scholarship"}</h3>
                  <button
                    className="close-button"
                    onClick={() => setShowApplyModal(false)}
                    disabled={isSubmitting}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="scholarship-summary">
                    <h4>{currentScholarship?.name}</h4>
                    <p>Deadline: {formatDate(currentScholarship?.endDate)}</p>
                  </div>

                  <div className="applicant-details">
                    <h4>Your Application Details</h4>

                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{userName}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{userEmail}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Phone Number:</span>
                      <span className="detail-value">{userPhoneNumber}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">College:</span>
                      <span className="detail-value">{collegeName}</span>
                    </div>
                  </div>

                  {/* Dynamic Fields Section */}
                  {currentScholarship?.dynamicFields && currentScholarship.dynamicFields.length > 0 && (
                    <div className="dynamic-fields-form">
                      <h4>
                        <FaClipboardList className="form-section-icon" />
                        Additional Information
                      </h4>
                      
                      <div className="dynamic-fields-container">
                        {currentScholarship.dynamicFields.map((field, index) => (
                          <div key={index} className="dynamic-field-item">
                            <label className="dynamic-field-label">
                              {field.label}
                              {field.required && <span className="required-marker">*</span>}
                            </label>
                            {renderDynamicFieldInput(field)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="documents-summary">
                    <h4>
                      <FaFileAlt className="summary-icon" />
                      Attached Documents
                    </h4>

                    {userData?.documents &&
                    Object.keys(userData.documents).length > 0 ? (
                      <ul className="document-summary-list">
                        {Object.keys(userData.documents).map((docName) => (
                          <li key={docName}>
                            <FaCheck className="check-icon" />
                            <span>{docName}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="no-documents-warning">
                        <FaExclamationCircle className="warning-icon" />
                        <p>
                          You haven't uploaded any documents yet. This may
                          affect your application.
                        </p>
                      </div>
                    )}
                  </div>

                  {applyError && (
                    <div className="error-message">
                      <FaExclamationCircle className="error-icon" />
                      <span>{applyError}</span>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    className="cancel-button"
                    onClick={() => setShowApplyModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    className="confirm-button"
                    onClick={handleApplySubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="button-spinner"></div>
                        <span>Submitting...</span>
                      </>
                    ) : isReapplying ? (
                      <>
                        <FaRedo />
                        <span>Submit Updated Application</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default EligibilityStatusPage;