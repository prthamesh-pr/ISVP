// EligibilityStatusPage.js
import React, { useEffect, useState } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { database } from '../firebase';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion'; // For animations
import { FaFileAlt, FaUserGraduate, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Icons
import DashboardHeading from './DashboardHeading';

const EligibilityStatusPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [userData, setUserData] = useState(null);
  const userPhoneNumber = Cookies.get('userPhoneNumber');
  const collegeCode = Cookies.get('collegeCenterCode');

  useEffect(() => {
    // Fetch scholarships
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
    });

    // Fetch user data
    const userRef = ref(database, `ScholarshipPortalDashboard/users/${userPhoneNumber.replace('.', '_')}`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }
    });

    // Fetch user documents
    const docsRef = ref(database, `userDocuments/${userPhoneNumber}`);
    onValue(docsRef, (snapshot) => {
      if (snapshot.exists()) {
        const docsData = snapshot.val();
        setUserData(prevData => ({
          ...prevData,
          documents: docsData
        }));
      }
    });

  }, [collegeCode, userPhoneNumber]);

  const handleApply = async (scholarship) => {
    const applicationRef = ref(database, `applications/${userPhoneNumber.replace('.', '_')}`);
    await push(applicationRef, {
      scholarshipId: scholarship.id,
      scholarshipName: scholarship.name,
      status: 'pending',
      appliedDate: new Date().toISOString(),
      documents: userData.documents || {}
    });
  };

  const isEligible = (scholarship) => {
    return userData?.eligibleScholarships?.includes(scholarship.id);
  };

  return (
    <>
    <DashboardHeading text="Eligible Scholarships Details" />
    <div className="container shadow-lg p-2" style={{ marginTop: "155px" }}>
      <div className="row">
        {/* User Profile Section */}
        <div className="col-md-3">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="card sticky-top" 
            style={{ top: '1rem' }}
          >
            <div className="card-body">
              <div className="text-center mb-3">
                <FaUserGraduate size={50} className="text-primary" />
                <h5 className="mt-2">{userData?.name}</h5>
              </div>
              <div className="border-top pt-3">
                <p><strong>Email:</strong> {userData?.email}</p>
                <p><strong>College:</strong> {userData?.collegeName}</p>
                
                <div className="mt-4">
                  <h6 className="mb-3">
                    <FaFileAlt className="me-2" />
                    Uploaded Documents
                  </h6>
                 <div className="list-group">
                        {userData?.documents && Object.entries(userData.documents).map(([name, url]) => (
                          <a 
                            key={name}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="list-group-item list-group-item-action"
                          >
                            <small>{name}</small>
                          </a>
                        ))}
                      </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scholarships List Section */}
        <div className="col-md-9">
        <div class="alert alert-success" role="alert">
  Available Scholarships
</div>
       
          {scholarships.map((scholarship, index) => (
            <motion.div 
              key={scholarship.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`card mb-4 ${isEligible(scholarship) ? 'border-success' : 'border-secondary'}`}
            >
              <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{scholarship.name}</h5>
                {isEligible(scholarship) ? (
                  <span className="badge bg-success">
                    <FaCheckCircle className="me-1" />
                    Eligible
                  </span>
                ) : (
                  <span className="badge bg-secondary">
                    <FaTimesCircle className="me-1" />
                    Not Eligible
                  </span>
                )}
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <p className="card-text">{scholarship.description}</p>
                    <h6 className="mt-3">Benefits:</h6>
                    <p>{scholarship.benefits}</p>
                    <h6>Eligibility Criteria:</h6>
                    <p>{scholarship.eligibilityCriteria}</p>
                  </div>
                  <div className="col-md-4">
                    <div className="alert alert-info">
                      <FaCalendarAlt className="me-2" />
                      <strong>Deadline:</strong>
                      <br />
                      {new Date(scholarship.endDate).toLocaleDateString()}
                    </div>

                    {isEligible(scholarship) && (
                      <button
                        className="btn btn-primary w-100 mb-2"
                        onClick={() => handleApply(scholarship)}
                      >
                        Apply Now
                      </button>
                    )}

                    <button
                      className="btn btn-outline-secondary w-100"
                      data-bs-toggle="modal"
                      data-bs-target={`#docs-${scholarship.id}`}
                    >
                      <FaFileAlt className="me-2" />
                      Required Documents
                    </button>
                  </div>
                </div>
              </div>

              {/* Documents Modal */}
              <div className="modal fade" id={`docs-${scholarship.id}`}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Required Documents</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                      <ul className="list-group">
                        {scholarship.requiredDocuments?.map((doc, idx) => (
                          <li key={idx} className="list-group-item">
                            <FaFileAlt className="me-2 text-primary" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default EligibilityStatusPage;
