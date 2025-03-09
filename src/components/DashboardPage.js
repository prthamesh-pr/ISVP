// DashboardPage.js
import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { 
  FaFileAlt, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaGraduationCap,
  FaCalendarAlt,
  FaUniversity,
  FaUserGraduate,
  FaPaperPlane,
  FaInfoCircle,
  FaStar,
  FaFilter,
  FaSortAmountDown
} from 'react-icons/fa';
import '../Dashboard.css';

const DashboardPage = () => {
  const [appliedScholarships, setAppliedScholarships] = useState([]);
  const [scholarshipDetails, setScholarshipDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilter, setShowFilter] = useState(false);
  
  const userPhoneNumber = Cookies.get('userPhoneNumber');
  const userName = Cookies.get('userName') || '';
  const collegeCode = Cookies.get('collegeCenterCode');
  const collegeName = Cookies.get('collegeName') || '';

  useEffect(() => {
    // Fetch applications
    const applicationsRef = ref(database, `applications/${userPhoneNumber.replace('.', '_')}`);
    const scholarshipsRef = ref(database, `scholarships/${collegeCode}`);
    
    // First fetch all scholarships to get details
    const unsubscribeScholarships = onValue(scholarshipsRef, (scholarshipSnapshot) => {
      if (scholarshipSnapshot.exists()) {
        const scholarshipData = scholarshipSnapshot.val();
        setScholarshipDetails(scholarshipData);
        
        // Then fetch applications and combine with scholarship details
        const unsubscribeApplications = onValue(applicationsRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const applicationsList = Object.entries(data).map(([id, application]) => ({
              ...application,
              id,
              scholarshipDetails: scholarshipData[application.scholarshipId] || {}
            }));
            setAppliedScholarships(applicationsList);
          } else {
            setAppliedScholarships([]);
          }
          setLoading(false);
        });
        
        return () => unsubscribeApplications();
      } else {
        setScholarshipDetails({});
        setLoading(false);
      }
    });
    
    return () => unsubscribeScholarships();
  }, [userPhoneNumber, collegeCode]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return <FaCheckCircle />;
      case 'pending': return <FaClock />;
      case 'rejected': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Filter applications by status
  const filteredApplications = appliedScholarships.filter(app => {
    if (filterStatus === 'all') return true;
    return app.status?.toLowerCase() === filterStatus.toLowerCase();
  });
  
  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0);
    } else if (sortBy === 'name') {
      return (a.scholarshipName || '').localeCompare(b.scholarshipName || '');
    } else if (sortBy === 'status') {
      return (a.status || '').localeCompare(b.status || '');
    }
    return 0;
  });
  
  // Count applications by status
  const getStatusCounts = () => {
    const counts = {
      total: appliedScholarships.length,
      approved: 0,
      pending: 0,
      rejected: 0
    };
    
    appliedScholarships.forEach(app => {
      const status = app.status?.toLowerCase() || 'pending';
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });
    
    return counts;
  };
  
  const statusCounts = getStatusCounts();

  return (
    <div className="dashboard-page">
     

      <div className="container dashboard-container">
        <div className="dashboard-intro">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="user-welcome"
          >
            <div className="welcome-header">
              <div className="user-avatar">
                <FaUserGraduate />
              </div>
              <div className="welcome-text">
                <h2>Welcome, {userName}</h2>
                <p>
                  <FaUniversity className="welcome-icon" />
                  {collegeName}
                </p>
              </div>
            </div>
          </motion.div>
          
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
                <div className="stat-label">Pending</div>
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
        </div>
        
        <div className="dashboard-content">
          <div className="applications-header">
            <h3 className="section-title">
              <FaPaperPlane className="section-icon" />
              My Scholarship Applications
            </h3>
            
            <div className="filter-container">
              <button 
                className="filter-button"
                onClick={() => setShowFilter(!showFilter)}
              >
                <FaFilter /> Filter & Sort
              </button>
              
              {showFilter && (
                <div className="filter-dropdown">
                  <div className="filter-section">
                    <h4>Filter by Status</h4>
                    <div className="status-filters">
                      <button 
                        className={`status-filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('all')}
                      >
                        All
                      </button>
                      <button 
                        className={`status-filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('pending')}
                      >
                        <FaClock className="btn-icon" /> Pending
                      </button>
                      <button 
                        className={`status-filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('approved')}
                      >
                        <FaCheckCircle className="btn-icon" /> Approved
                      </button>
                      <button 
                        className={`status-filter-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('rejected')}
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
                        <FaSortAmountDown className="btn-icon" /> Name
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
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading your applications...</p>
            </div>
          ) : (
            <div className="applications-list">
              {sortedApplications.length > 0 ? (
                sortedApplications.map((application, index) => {
                  const scholarship = scholarshipDetails[application.scholarshipId] || {};
                  return (
                    <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="application-card"
                  >
                    <div className="application-header">
                      <h3 className="application-name">{application.scholarshipName}</h3>
                      <div className={`status-badge ${getStatusBadgeClass(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span>{application.status || 'Pending'}</span>
                      </div>
                    </div>
                    
                    <div className="application-content">
                      <div className="application-details">
                        <div className="details-section">
                          <h4>
                            <FaInfoCircle className="details-icon" />
                            Description
                          </h4>
                          <p>{scholarship.description || 'No description available'}</p>
                        </div>
                        
                        <div className="details-section">
                          <h4>
                            <FaStar className="details-icon" />
                            Benefits
                          </h4>
                          <p>{scholarship.benefits || 'No benefits information available'}</p>
                        </div>
                        
                        <div className="details-section">
                          <h4>
                            <FaCheckCircle className="details-icon" />
                            Eligibility
                          </h4>
                          <p>{scholarship.eligibilityCriteria || 'No eligibility information available'}</p>
                        </div>
                        
                        {/* Review Message Section - Added this section */}
                        {application.reviewMessage && (
                          <div className="details-section review-message-section">
                            <h4>
                              <FaInfoCircle className="details-icon" />
                              Review Message
                            </h4>
                            <div className="review-message-content">
                              <p>{application.reviewMessage}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="application-sidebar">
                        <div className="sidebar-section docs-section">
                          <h4>
                            <FaFileAlt className="sidebar-icon" />
                            Required Documents
                          </h4>
                          
                          {scholarship.requiredDocuments && scholarship.requiredDocuments.length > 0 ? (
                            <ul className="documents-list">
                              {scholarship.requiredDocuments.map((doc, idx) => (
                                <li key={idx} className="document-item">
                                  <FaFileAlt className="doc-icon" />
                                  <span>{doc}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="no-docs-message">No document requirements available</p>
                          )}
                        </div>
                        
                        <div className="application-date">
                          <FaCalendarAlt className="date-icon" />
                          <div>
                            <span className="date-label">Applied on:</span>
                            <span className="date-value">{formatDate(application.appliedDate)}</span>
                          </div>
                        </div>
                        
                        {/* Review Date Section - Added this section */}
                        {application.reviewDate && (
                          <div className="application-date review-date">
                            <FaCalendarAlt className="date-icon" />
                            <div>
                              <span className="date-label">Reviewed on:</span>
                              <span className="date-value">{formatDate(application.reviewDate)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="no-applications"
                >
                  <div className="no-apps-icon">
                    <FaPaperPlane />
                  </div>
                  <h3>No Applications Found</h3>
                  <p>
                    {filterStatus !== 'all' 
                      ? `You don't have any ${filterStatus} applications.` 
                      : "You haven't applied to any scholarships yet. Start exploring available scholarships and submit your applications!"}
                  </p>
                  <button className="explore-btn">Explore Scholarships</button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;