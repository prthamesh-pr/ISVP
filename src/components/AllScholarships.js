// AllScholarships.js
import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import Cookies from 'js-cookie';
import DashboardHeading from './DashboardHeading';
import '../AllScholarship.css'; 

const AllScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    });
  }, [collegeCode]);

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <DashboardHeading text="Available Scholarships" />

      <div className="container" style={{marginTop:"135px"}}>
        {/* Search Bar */}
        <div className="row mb-4">
          <div className="col-md-6 mx-auto">
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="row">
          {filteredScholarships.map((scholarship) => (
            <div key={scholarship.id} className="col-lg-12 mb-4">
              <div className="card shadow-sm hover-shadow transition-all">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">{scholarship.name}</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-4">
                        <h6 className="text-primary">
                          <i className="fas fa-info-circle me-2"></i>Description
                        </h6>
                        <p className="card-text text-muted">{scholarship.description}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h6 className="text-success">
                          <i className="fas fa-gift me-2"></i>Benefits
                        </h6>
                        <p className="card-text text-muted">{scholarship.benefits}</p>
                      </div>

                      <div>
                        <h6 className="text-info">
                          <i className="fas fa-check-circle me-2"></i>Eligibility Criteria
                        </h6>
                        <p className="card-text text-muted">{scholarship.eligibilityCriteria}</p>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="alert alert-warning">
                        <h6 className="alert-heading">
                          <i className="fas fa-clock me-2"></i>Application Deadline
                        </h6>
                        <hr />
                        <strong>{new Date(scholarship.endDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</strong>
                      </div>

                      <div className="card border-info">
                        <div className="card-header bg-info text-white">
                          <h6 className="mb-0">
                            <i className="fas fa-file-alt me-2"></i>Required Documents
                          </h6>
                        </div>
                        <ul className="list-group list-group-flush">
                          {scholarship.requiredDocuments?.map((doc, index) => (
                            <li key={index} className="list-group-item">
                              <i className="fas fa-check-square me-2 text-success"></i>
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-light">
                  <small className="text-muted">
                    <i className="fas fa-calendar-alt me-2"></i>
                    Posted on: {new Date(scholarship.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="alert alert-info text-center">
            <i className="fas fa-info-circle me-2"></i>
            No scholarships are currently available from your college.
          </div>
        )}
      </div>

    </>
  );
};

export default AllScholarships;
