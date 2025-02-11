// DashboardPage.js
import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { FaFileAlt, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import DashboardHeading from './DashboardHeading';

const DashboardPage = () => {
  const [appliedScholarships, setAppliedScholarships] = useState([]);
  const [scholarshipDetails, setScholarshipDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const userPhoneNumber = Cookies.get('userPhoneNumber');

  useEffect(() => {
    // Fetch applications
    const applicationsRef = ref(database, `applications/${userPhoneNumber}`);
    const scholarshipsRef = ref(database, `scholarships/${Cookies.get('collegeCenterCode')}`);
    
    // First fetch all scholarships to get details
    onValue(scholarshipsRef, (scholarshipSnapshot) => {
      if (scholarshipSnapshot.exists()) {
        const scholarshipData = scholarshipSnapshot.val();
        setScholarshipDetails(scholarshipData);
        
        // Then fetch applications and combine with scholarship details
        onValue(applicationsRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const applicationsList = Object.entries(data).map(([id, application]) => ({
              ...application,
              id,
              scholarshipDetails: scholarshipData[application.scholarshipId] || {}
            }));
            setAppliedScholarships(applicationsList);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [userPhoneNumber]);

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-success';
      case 'pending': return 'bg-warning text-dark';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return <FaCheckCircle className="me-2" />;
      case 'pending': return <FaClock className="me-2" />;
      case 'rejected': return <FaTimesCircle className="me-2" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeading text="My Scholarship Applications" />
      <div className="container" style={{ marginTop: "155px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {appliedScholarships.length === 0 ? (
            <div className="alert alert-info">
              <h5 className="mb-0">No scholarships applied yet</h5>
              <p className="mb-0">Start exploring available scholarships and submit your applications!</p>
            </div>
          ) : (
            appliedScholarships.map((application, index) => {
              const scholarship = scholarshipDetails[application.scholarshipId] || {};
              return (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card mb-4 shadow-sm"
                >
                  <div className="card-header bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">{application.scholarshipName}</h5>
                      <div className={`badge ${getStatusBadgeColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status}
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <p className="card-text text-muted">{scholarship.description}</p>
                        <div className="mt-3">
                          <h6>Benefits:</h6>
                          <p>{scholarship.benefits}</p>
                          <h6>Eligibility Criteria:</h6>
                          <p>{scholarship.eligibilityCriteria}</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-light">
                          <div className="card-header">
                            <h6 className="mb-0">
                              <FaFileAlt className="me-2" />
                              Required Documents
                            </h6>
                          </div>
                          <ul className="list-group list-group-flush">
                            {scholarship.requiredDocuments?.map((doc, idx) => (
                              <li key={idx} className="list-group-item">
                                <small>{doc}</small>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer text-muted">
                    <small>
                      Applied on: {new Date(application.appliedDate).toLocaleDateString()}
                    </small>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </>
  );
};

export default DashboardPage;
