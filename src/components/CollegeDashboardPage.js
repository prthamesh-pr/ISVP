// CollegeDashboardPage.js
import React, { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase';
import Cookies from 'js-cookie';
import { 
  FaGraduationCap, 
  FaUserGraduate, 
  FaCalendarAlt, 
  FaFileAlt,
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock,
  FaSearch,
  FaFilter,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaSort,
  FaThumbsUp,
  FaThumbsDown,
  FaEye,
  FaExclamationCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../CollegeDashboard.css';

const CollegeDashboardPage = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [reviewMessage, setReviewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');
  const collegeCode = Cookies.get('collegeCenterCode');
  const collegeName = Cookies.get('collegeName') || '';

  useEffect(() => {
    // Fetch all applications for scholarships of this college
    const applicationsRef = ref(database, 'applications');
    const unsubscribe = onValue(applicationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allApplications = [];
       
        // Process applications
        Object.entries(data).forEach(([userPhoneNumber, userApplications]) => {
          Object.entries(userApplications).forEach(([applicationId, application]) => {
            if (application.collegeCode === collegeCode) {
              allApplications.push({
                id: applicationId,
                userPhoneNumber: userPhoneNumber.replace('_', '.'),
                ...application
              });
            }
          });
        });
        
        setApplications(allApplications);
        setFilteredApplications(allApplications);
      } else {
        setApplications([]);
        setFilteredApplications([]);
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [collegeCode]);

  // Handle application status update
  const handleStatusUpdate = async (status) => {
    if (!currentApplication) return;
    
    setReviewStatus('loading');
    
    try {
      const applicationRef = ref(
        database, 
        `applications/${currentApplication.userPhoneNumber.replace('.', '_')}/${currentApplication.id}`
      );
      
      await update(applicationRef, {
        status: status,
        reviewDate: new Date().toISOString(),
        reviewMessage: reviewMessage
      });
      
      setReviewStatus('success');
      
      // Update local state
      const updatedApplications = applications.map(app => {
        if (app.id === currentApplication.id) {
          return {
            ...app,
            status: status,
            reviewDate: new Date().toISOString(),
            reviewMessage: reviewMessage
          };
        }
        return app;
      });
      
      setApplications(updatedApplications);
      applyFilters(updatedApplications);
      
      // Close modal after a delay
      setTimeout(() => {
        setShowReviewModal(false);
        setCurrentApplication(null);
        setReviewMessage('');
        setReviewStatus('');
      }, 1500);
    } catch (error) {
      console.error("Error updating application status:", error);
      setReviewStatus('error');
    }
  };

  // Open review modal for an application
  const openReviewModal = (application) => {
    setCurrentApplication(application);
    setReviewMessage(application.reviewMessage || '');
    setShowReviewModal(true);
  };

  // Apply filters and search
  const applyFilters = (apps = applications) => {
    let filtered = [...apps];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.scholarshipName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0);
      } else if (sortBy === 'name') {
        return (a.scholarshipName || '').localeCompare(b.scholarshipName || '');
      } else if (sortBy === 'status') {
        return (a.status || '').localeCompare(b.status || '');
      }
      return 0;
    });
    
    setFilteredApplications(filtered);
  };

  // Get counts by status
  const getStatusCounts = () => {
    return {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
  };
  
  const statusCounts = getStatusCounts();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle search and filter changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, sortBy]);

  return (
    <div className="college-dashboard-page">
     
      
      <div className="container dashboard-container">
        {/* College Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="college-info-banner"
        >
          <div className="college-icon">
            <FaUniversity />
          </div>
          <div className="college-details">
            <h2>{collegeName}</h2>
            <p className="college-code">College Code: {collegeCode}</p>
          </div>
        </motion.div>
        
        {/* Application Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="stats-cards"
        >
          <div className="stat-card">
            <div className="stat-icon total-icon">
              <FaGraduationCap />
            </div>
            <div className="stat-content">
              <div className="stat-value">{statusCounts.total}</div>
              <div className="stat-label">Total Applications</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon pending-icon">
              <FaClock />
            </div>
            <div className="stat-content">
              <div className="stat-value">{statusCounts.pending}</div>
              <div className="stat-label">Pending Review</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon approved-icon">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <div className="stat-value">{statusCounts.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon rejected-icon">
              <FaTimesCircle />
            </div>
            <div className="stat-content">
              <div className="stat-value">{statusCounts.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </motion.div>
        
        {/* Applications management section */}
        <div className="applications-management">
          <div className="management-header">
            <h3 className="section-title">
              <FaUserGraduate className="section-icon" />
              Student Applications
            </h3>
            
            <div className="management-tools">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filter-container">
                <button 
                  className="filter-button"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  <FaFilter /> Filter & Sort
                </button>
                
                {showFilterDropdown && (
                  <div className="filter-dropdown">
                    <div className="filter-section">
                      <h4>Filter by Status</h4>
                      <div className="status-filters">
                        <button 
                          className={`status-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                          onClick={() => setStatusFilter('all')}
                        >
                          All Applications
                        </button>
                        <button 
                          className={`status-filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                          onClick={() => setStatusFilter('pending')}
                        >
                          <FaClock className="btn-icon" /> Pending
                        </button>
                        <button 
                          className={`status-filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
                          onClick={() => setStatusFilter('approved')}
                        >
                          <FaCheckCircle className="btn-icon" /> Approved
                        </button>
                        <button 
                          className={`status-filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
                          onClick={() => setStatusFilter('rejected')}
                        >
                          <FaTimesCircle className="btn-icon" /> Rejected
                        </button>
                      </div>
                    </div>
                    
                    <div className="filter-section">
                      <h4>Sort by</h4>
                      <div className="sort-options">
                        <button 
                          className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`}
                          onClick={() => setSortBy('date')}
                        >
                          <FaCalendarAlt className="btn-icon" /> Date Applied
                        </button>
                        <button 
                          className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
                          onClick={() => setSortBy('name')}
                        >
                          <FaSort className="btn-icon" /> Scholarship Name
                        </button>
                        <button 
                          className={`sort-btn ${sortBy === 'status' ? 'active' : ''}`}
                          onClick={() => setSortBy('status')}
                        >
                          <FaFilter className="btn-icon" /> Status
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Application List */}
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading applications...</p>
            </div>
          ) : (
            <div className="applications-container">
              {filteredApplications.length > 0 ? (
                <div className="applications-list">
                  {filteredApplications.map((application, index) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="application-card"
                    >
                      <div className="application-header">
                        <h3 className="application-name">{application.scholarshipName}</h3>
                        <div className={`status-badge ${application.status}`}>
                          {application.status === 'pending' ? <FaClock /> : 
                           application.status === 'approved' ? <FaCheckCircle /> : 
                           <FaTimesCircle />}
                          <span>{application.status || 'Pending'}</span>
                        </div>
                      </div>
                      
                      <div className="application-body">
                        <div className="applicant-details">
                          <h4>
                            <FaUserGraduate className="details-icon" />
                            Applicant Information
                          </h4>
                          
                          <div className="detail-item">
                            <span className="detail-label">Name:</span>
                            <span className="detail-value">{application.userName || 'Not provided'}</span>
                          </div>
                          
                          <div className="detail-item">
                            <span className="detail-label">
                              <FaEnvelope className="item-icon" /> Email:
                            </span>
                            <span className="detail-value">{application.userEmail || 'Not provided'}</span>
                          </div>
                          
                          <div className="detail-item">
                            <span className="detail-label">
                              <FaPhone className="item-icon" /> Phone:
                            </span>
                            <span className="detail-value">{application.userPhoneNumber || 'Not provided'}</span>
                          </div>
                          
                          <div className="detail-item">
                            <span className="detail-label">
                              <FaCalendarAlt className="item-icon" /> Applied:
                            </span>
                            <span className="detail-value">{formatDate(application.appliedDate)}</span>
                          </div>
                        </div>
                        
                        <div className="documents-section">
                          <h4>
                            <FaFileAlt className="details-icon" />
                            Submitted Documents
                          </h4>
                          
                          {application.documents && Object.keys(application.documents).length > 0 ? (
                            <ul className="documents-list">
                              {Object.entries(application.documents).map(([docKey, docData]) => (
                                <li key={docKey} className="document-item">
                                  <FaFileAlt className="doc-icon" />
                                  <span className="doc-name">{docData.name || docKey}</span>
                                  <a 
                                    href={docData.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="view-doc-btn"
                                  >
                                    <FaEye />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="no-documents">No documents submitted</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="application-footer">
                        {application.status === 'pending' ? (
                          <div className="review-actions">
                            <button 
                              className="review-btn"
                              onClick={() => openReviewModal(application)}
                            >
                              <FaEdit /> Review Application
                            </button>
                          </div>
                        ) : (
                          <div className="review-summary">
                            <h4>Review Information</h4>
                            <div className="detail-item">
                              <span className="detail-label">Status:</span>
                              <span className={`detail-value status-text ${application.status}`}>
                                {application.status}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Review Date:</span>
                              <span className="detail-value">{formatDate(application.reviewDate)}</span>
                            </div>
                            {application.reviewMessage && (
                              <div className="review-message">
                                <h5>Message:</h5>
                                <p>{application.reviewMessage}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="no-applications">
                  <FaExclamationCircle className="no-apps-icon" />
                  <h3>No Applications Found</h3>
                  <p>
                    {statusFilter !== 'all' 
                      ? `There are no ${statusFilter} applications.` 
                      : searchTerm 
                        ? `No applications match your search for "${searchTerm}".`
                        : "No applications have been submitted yet."}
                  </p>
                  {(statusFilter !== 'all' || searchTerm) && (
                    <button 
                      className="clear-filters-btn"
                      onClick={() => {
                        setStatusFilter('all');
                        setSearchTerm('');
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-backdrop">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="review-modal"
          >
            <div className="modal-header">
              <h3>Review Application</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  if (reviewStatus !== 'loading') {
                    setShowReviewModal(false);
                    setCurrentApplication(null);
                    setReviewMessage('');
                    setReviewStatus('');
                  }
                }}
                disabled={reviewStatus === 'loading'}
              >
                &times;
              </button>
            </div>
            
            {reviewStatus === 'success' ? (
              <div className="success-message">
                <FaCheckCircle className="success-icon" />
                <h3>Application Updated Successfully</h3>
                <p>The application status has been updated.</p>
              </div>
            ) : reviewStatus === 'error' ? (
              <div className="error-message">
                <FaExclamationCircle className="error-icon" />
                <h3>Error Updating Application</h3>
                <p>There was a problem updating the application status. Please try again.</p>
                <button 
                  className="try-again-btn"
                  onClick={() => setReviewStatus('')}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="modal-body">
                  <div className="application-summary">
                    <h4>Application Details</h4>
                    <p><strong>Scholarship:</strong> {currentApplication?.scholarshipName}</p>
                    <p><strong>Applicant:</strong> {currentApplication?.userName || currentApplication?.userEmail || currentApplication?.userPhoneNumber}</p>
                    <p><strong>Applied On:</strong> {formatDate(currentApplication?.appliedDate)}</p>
                  </div>
                  
                  <div className="review-form">
                    <label htmlFor="reviewMessage">Review Message (Optional)</label>
                    <textarea
                      id="reviewMessage"
                      value={reviewMessage}
                      onChange={(e) => setReviewMessage(e.target.value)}
                      placeholder="Add comments or feedback for the applicant..."
                      disabled={reviewStatus === 'loading'}
                    ></textarea>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button 
                    className="reject-btn"
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={reviewStatus === 'loading'}
                  >
                    {reviewStatus === 'loading' ? (
                      <span className="btn-spinner"></span>
                    ) : (
                      <>
                        <FaThumbsDown /> Reject Application
                      </>
                    )}
                  </button>
                  
                  <button 
                    className="approve-btn"
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={reviewStatus === 'loading'}
                  >
                    {reviewStatus === 'loading' ? (
                      <span className="btn-spinner"></span>
                    ) : (
                      <>
                        <FaThumbsUp /> Approve Application
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CollegeDashboardPage;