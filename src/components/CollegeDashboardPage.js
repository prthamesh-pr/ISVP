// CollegeDashboardPage.js
import React, { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase';
import Cookies from 'js-cookie';
import DashboardHeading from './DashboardHeading';

const CollegeDashboardPage = () => {
  const [applications, setApplications] = useState([]);
  const collegeCode = Cookies.get('collegeCenterCode');

  useEffect(() => {
    // Fetch all applications for scholarships of this college
    const applicationsRef = ref(database, 'applications');
    onValue(applicationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allApplications = [];
       
        // Process applications
        Object.entries(data).forEach(([userPhoneNumber, userApplications]) => {
          Object.entries(userApplications).forEach(([applicationId, application]) => {
            if (application.collegeCode !== collegeCode) {
              allApplications.push({
                id: applicationId,
                userPhoneNumber: userPhoneNumber.replace('_', '.'),
                ...application
              });
            }
          });
        });
        console.log(allApplications)
        setApplications(allApplications);
      }
    });
  }, [collegeCode]);

  const handleStatusUpdate = async (applicationId, userPhoneNumber, status, message = '') => {
    const applicationRef = ref(
      database, 
      `applications/${userPhoneNumber.replace('.', '_')}/${applicationId}`
    );
    
    await update(applicationRef, {
      status: status,
      reviewDate: new Date().toISOString(),
      reviewMessage: message
    });
  };

  return (
    <>
    <DashboardHeading text="Scholarship Applications" />
    <div className="container" style={{marginTop:"155px"}}>
      
      
      {applications.map((application) => (
        <div key={application.id} className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              Application for {application.scholarshipName}
            </h5>
            <span className={`badge ${
              application.status === 'pending' ? 'bg-warning' :
              application.status === 'approved' ? 'bg-success' :
              'bg-danger'
            }`}>
              {application.status}
            </span>
          </div>
          
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Student Details:</h6>
                <p><strong>Email:</strong> {application.userPhoneNumber}</p>
                <p><strong>Applied Date:</strong> {new Date(application.appliedDate).toLocaleDateString()}</p>
                
                <h6 className="mt-3">Submitted Documents:</h6>
                <ul className="list-group">
                  {application.documents?.map((doc, index) => (
                    <li key={index} className="list-group-item">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <i className="fas fa-file-alt me-2"></i>
                        {doc.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="col-md-6">
                {application.status === 'pending' ? (
                  <div className="card">
                    <div className="card-body">
                      <h6>Review Application</h6>
                      <textarea
                        className="form-control mb-3"
                        placeholder="Add review message (optional)"
                        id={`message-${application.id}`}
                      ></textarea>
                      
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleStatusUpdate(
                          application.id,
                          application.userPhoneNumber,
                          'approved',
                          document.getElementById(`message-${application.id}`).value
                        )}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleStatusUpdate(
                          application.id,
                          application.userPhoneNumber,
                          'rejected',
                          document.getElementById(`message-${application.id}`).value
                        )}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="card">
                    <div className="card-body">
                      <h6>Review Details</h6>
                      <p><strong>Status:</strong> {application.status}</p>
                      <p><strong>Review Date:</strong> {new Date(application.reviewDate).toLocaleDateString()}</p>
                      {application.reviewMessage && (
                        <div>
                          <strong>Message:</strong>
                          <p>{application.reviewMessage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {applications.length === 0 && (
        <div className="alert alert-info">
          No applications have been submitted yet.
        </div>
      )}
    </div>
    </>
  );
};

export default CollegeDashboardPage;
