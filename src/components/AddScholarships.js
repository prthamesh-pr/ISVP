// AddScholarships.js
import React, { useState } from 'react';
import { ref, push ,set} from 'firebase/database';
import { database } from '../firebase';
import Cookies from 'js-cookie';
import { FaGraduationCap, FaFileAlt, FaCalendarAlt, FaList, 
         FaMoneyBillWave, FaPlus, FaTimes, FaSave } from 'react-icons/fa';
import { Toast, ToastContainer } from 'react-bootstrap';
import '../AddScholar.css'; 
import DashboardHeading from './DashboardHeading';

const AddScholarships = () => {
  const [scholarship, setScholarship] = useState({
    name: '',
    description: '',
    benefits: '',
    requiredDocuments: [],
    endDate: '',
    eligibilityCriteria: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [newDocument, setNewDocument] = useState('');
  const collegeCode = Cookies.get('collegeCenterCode');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scholarshipRef = ref(database, `scholarships/${collegeCode}`);
      const newScholarshipRef = push(scholarshipRef); // Get reference with auto-generated ID
      await set(newScholarshipRef, {
        ...scholarship,
        id: newScholarshipRef.key, // Save the auto-generated ID
        collegeCode,
        createdAt: new Date().toISOString()
      });
      setShowToast(true);
      setScholarship({
        name: '',
        description: '',
        benefits: '',
        requiredDocuments: [],
        endDate: '',
        eligibilityCriteria: ''
      });
    } catch (error) {
      console.error('Error adding scholarship:', error);
    }
  };

  const addDocument = () => {
    if (newDocument.trim()) {
      setScholarship({
        ...scholarship,
        requiredDocuments: [...scholarship.requiredDocuments, newDocument.trim()]
      });
      setNewDocument('');
    }
  };

  const removeDocument = (index) => {
    const updatedDocs = scholarship.requiredDocuments.filter((_, i) => i !== index);
    setScholarship({ ...scholarship, requiredDocuments: updatedDocs });
  };

  return (
    <>
    <DashboardHeading text={"Add New Scholarship"}></DashboardHeading>
    <div className="container mb-4" style={{marginTop:"70px"}}>
  
    <div className="card shadow-lg border">
      <div className="card-body">
        <h4 className="text-center mb-4">
          <FaGraduationCap className="me-2" />
          
        </h4>

        <form onSubmit={handleSubmit} className="needs-validation">
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">
                  <FaGraduationCap className="me-2" />
                  Scholarship Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-md"
                  required
                  value={scholarship.name}
                  onChange={(e) => setScholarship({...scholarship, name: e.target.value})}
                  placeholder="Enter scholarship name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <FaFileAlt className="me-2" />
                  Description
                </label>
                <textarea
                  className="form-control form-control-md"
                  rows="4"
                  required
                  value={scholarship.description}
                  onChange={(e) => setScholarship({...scholarship, description: e.target.value})}
                  placeholder="Enter scholarship description"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <FaMoneyBillWave className="me-2" />
                  Benefits
                </label>
                <textarea
                  className="form-control form-control-md"
                  rows="3"
                  required
                  value={scholarship.benefits}
                  onChange={(e) => setScholarship({...scholarship, benefits: e.target.value})}
                  placeholder="Enter scholarship benefits"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">
                  <FaList className="me-2" />
                  Required Documents
                </label>
                <div className="input-group input-group-md mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    placeholder="Enter document name"
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-md"
                    onClick={addDocument}
                  >
                    <FaPlus className="me-1" /> Add
                  </button>
                </div>
                <div className="document-list p-2" style={{ minHeight: "100px", maxHeight: "150px", overflowY: "auto" }}>
                  {scholarship.requiredDocuments.map((doc, index) => (
                    <div key={index} className="badge bg-light text-dark me-2 mb-2 p-2">
                      {doc}
                      <button
                        type="button"
                        className="btn btn-link btn-sm text-danger p-0 ms-2"
                        onClick={() => removeDocument(index)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <FaCalendarAlt className="me-2" />
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control form-control-md"
                  required
                  value={scholarship.endDate}
                  onChange={(e) => setScholarship({...scholarship, endDate: e.target.value})}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <FaList className="me-2" />
                  Eligibility Criteria
                </label>
                <textarea
                  className="form-control form-control-md"
                  rows="3"
                  required
                  value={scholarship.eligibilityCriteria}
                  onChange={(e) => setScholarship({...scholarship, eligibilityCriteria: e.target.value})}
                  placeholder="Enter eligibility criteria"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-3">
            <button type="submit" className="btn btn-primary">
              <FaSave className="me-2" />
              Save Scholarship
            </button>
          </div>
        </form>
      </div>
    </div>

    <ToastContainer position="bottom-end" className="p-3">
      <Toast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        delay={3000} 
        autohide
        bg="success"
      >
        <Toast.Header closeButton={false}>
          <FaGraduationCap className="me-2" />
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body className="text-white">
          Scholarship added successfully!
        </Toast.Body>
      </Toast>
    </ToastContainer>
  </div>
  </>
  );
};

export default AddScholarships;
