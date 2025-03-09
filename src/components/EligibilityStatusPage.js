// EligibilityStatusPage.js
import React, { useEffect, useState } from "react";
import { ref, onValue, push, set } from "firebase/database";
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
    debugger;
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
    setShowApplyModal(true);
    setApplySuccess(false);
    setApplyError("");
  };

  const handleApplySubmit = async () => {
    if (!currentScholarship) return;

    setIsSubmitting(true);

    try {
      const applicationData = {
        scholarshipId: currentScholarship.id,
        scholarshipName: currentScholarship.name,
        status: "pending",
        appliedDate: new Date().toISOString(),
        userName,
        userEmail,
        userPhoneNumber,
        collegeName,
        collegeCode,
        documents: userData?.documents || {},
      };

      const applicationRef = ref(
        database,
        `applications/${userPhoneNumber.replace(".", "_")}`
      );
      const newAppRef = push(applicationRef);
      await set(newAppRef, applicationData);

      setApplySuccess(true);

      // Update local applications state
      setApplications((prev) => ({
        ...prev,
        [currentScholarship.id]: {
          id: newAppRef.key,
          ...applicationData,
        },
      }));

      setTimeout(() => {
        setShowApplyModal(false);
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
                <div className="summary-count">
                  <span className="count-number">
                    {Object.keys(applications).length}
                  </span>
                  <span className="count-text">Applied</span>
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

                      return (
                        <motion.div
                          key={scholarship.id}
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`scholarship-card ${
                            expired ? "expired" : ""
                          }`}
                        >
                          {expired && (
                            <div className="expired-badge">
                              <FaClock />
                              <span>Expired</span>
                            </div>
                          )}

                          {hasApplied(scholarship.id) && (
                            <div className="applied-badge">
                              <FaCheck />
                              <span>Applied</span>
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

                              <div className="scholarship-actions">
                                {hasApplied(scholarship.id) ? (
                                  <button
                                    className="already-applied-button"
                                    disabled
                                  >
                                    <FaCheck /> Already Applied
                                  </button>
                                ) : (
                                  <button
                                    className="apply-button"
                                    onClick={() =>
                                      handleApplyClick(scholarship)
                                    }
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
                <h3>Application Submitted!</h3>
                <p>Your application has been successfully submitted.</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h3>Apply for Scholarship</h3>
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
