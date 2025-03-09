// AllScholarships.js
import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import Cookies from 'js-cookie';
import { 
  FaSearch, 
  FaInfoCircle, 
  FaGift, 
  FaCheckCircle, 
  FaClock, 
  FaFileAlt, 
  FaCheckSquare, 
  FaCalendarAlt,
  FaFilter,
  FaSortAmountDown,
  FaGraduationCap
} from 'react-icons/fa';
import '../AllScholarship.css'; 

const AllScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline', 'name', 'posted'
  const [isLoading, setIsLoading] = useState(true);
  const collegeCode = Cookies.get('collegeCenterCode');

  useEffect(() => {
    const scholarshipsRef = ref(database, `scholarships/${collegeCode}`);
    onValue(scholarshipsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const scholarshipsList = Object.entries(data).map(([id, details]) => ({
          id,
          ...details
        }));
        setScholarships(scholarshipsList);
      }
      setIsLoading(false);
    });
  }, [collegeCode]);

  // Filter scholarships based on search term
  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort scholarships
  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.endDate) - new Date(b.endDate);
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'posted') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // Calculate days remaining until deadline
  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const deadline = new Date(endDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get badge color based on days remaining
  const getDeadlineBadgeColor = (days) => {
    if (days < 0) return 'expired';
    if (days <= 7) return 'urgent';
    if (days <= 30) return 'soon';
    return 'plenty';
  };

  return (
    <div className="scholarships-page mt-5">
     

      <div className="container scholarship-container">
        {/* Search and Filter Bar */}
        <div className="search-filter-container">
          <div className="search-container">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search scholarships by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="filter-container">
            <button 
              className="filter-button" 
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FaFilter /> Filter & Sort
            </button>
            
            {filterOpen && (
              <div className="filter-dropdown">
                <div className="sort-options">
                  <h6>Sort By</h6>
                  <div className="sort-buttons">
                    <button 
                      className={`sort-button ${sortBy === 'deadline' ? 'active' : ''}`} 
                      onClick={() => setSortBy('deadline')}
                    >
                      <FaClock /> Deadline
                    </button>
                    <button 
                      className={`sort-button ${sortBy === 'name' ? 'active' : ''}`} 
                      onClick={() => setSortBy('name')}
                    >
                      <FaSortAmountDown /> Name
                    </button>
                    <button 
                      className={`sort-button ${sortBy === 'posted' ? 'active' : ''}`} 
                      onClick={() => setSortBy('posted')}
                    >
                      <FaCalendarAlt /> Recently Posted
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scholarship Stats */}
        <div className="scholarship-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FaGraduationCap />
            </div>
            <div className="stat-info">
              <h3>{scholarships.length}</h3>
              <p>Total Scholarships</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaClock />
            </div>
            <div className="stat-info">
              <h3>{scholarships.filter(s => getDaysRemaining(s.endDate) <= 7 && getDaysRemaining(s.endDate) >= 0).length}</h3>
              <p>Closing This Week</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="stat-info">
              <h3>{scholarships.filter(s => {
                const posted = new Date(s.createdAt);
                const now = new Date();
                const diffTime = now - posted;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 30;
              }).length}</h3>
              <p>Recently Added</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading scholarships...</p>
          </div>
        )}

        {/* Scholarships Grid */}
        {!isLoading && (
          <div className="scholarships-grid">
            {sortedScholarships.map((scholarship) => {
              const daysRemaining = getDaysRemaining(scholarship.endDate);
              const deadlineClass = getDeadlineBadgeColor(daysRemaining);
              
              return (
                <div key={scholarship.id} className="scholarship-card">
                  <div className="scholarship-header">
                    <h2>{scholarship.name}</h2>
                    <div className={`deadline-badge ${deadlineClass}`}>
                      {daysRemaining < 0 ? (
                        'Expired'
                      ) : daysRemaining === 0 ? (
                        'Last Day'
                      ) : (
                        `${daysRemaining} days left`
                      )}
                    </div>
                  </div>
                  
                  <div className="scholarship-content">
                    <div className="scholarship-main">
                      <div className="scholarship-section">
                        <h6>
                          <FaInfoCircle className="section-icon" />
                          Description
                        </h6>
                        <p>{scholarship.description}</p>
                      </div>
                      
                      <div className="scholarship-section">
                        <h6>
                          <FaGift className="section-icon" />
                          Benefits
                        </h6>
                        <p>{scholarship.benefits}</p>
                      </div>
                      
                      <div className="scholarship-section">
                        <h6>
                          <FaCheckCircle className="section-icon" />
                          Eligibility Criteria
                        </h6>
                        <p>{scholarship.eligibilityCriteria}</p>
                      </div>
                    </div>
                    
                    <div className="scholarship-sidebar">
                      <div className="deadline-container">
                        <h6>
                          <FaClock className="section-icon" />
                          Application Deadline
                        </h6>
                        <p className="deadline-date">
                          {new Date(scholarship.endDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      <div className="documents-container">
                        <h6>
                          <FaFileAlt className="section-icon" />
                          Required Documents
                        </h6>
                        <ul className="documents-list">
                          {scholarship.requiredDocuments?.map((doc, index) => (
                            <li key={index}>
                              <FaCheckSquare className="document-icon" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="scholarship-footer">
                    <div className="posted-date">
                      <FaCalendarAlt className="footer-icon" />
                      Posted on: {new Date(scholarship.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && sortedScholarships.length === 0 && (
          <div className="no-scholarships">
            <div className="no-scholarships-icon">
              <FaInfoCircle />
            </div>
            <h3>No Scholarships Found</h3>
            <p>
              {searchTerm 
                ? `No scholarships match your search term "${searchTerm}"`
                : "No scholarships are currently available from your college"}
            </p>
            {searchTerm && (
              <button 
                className="clear-search-button"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllScholarships;