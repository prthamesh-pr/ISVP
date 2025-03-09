// AddScholarships.js
import React, { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '../firebase';
import Cookies from 'js-cookie';
import { 
  FaGraduationCap, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaList, 
  FaCheckCircle,
  FaMoneyBillWave, 
  FaPlus, 
  FaTimes, 
  FaSave,
  FaInfoCircle,
  FaLightbulb
} from 'react-icons/fa';
import { Toast, ToastContainer } from 'react-bootstrap';
import '../AddScholar.css'; 


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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const collegeCode = Cookies.get('collegeCenterCode');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
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
    } finally {
      setIsSubmitting(false);
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDocument();
    }
  };

  return (
    <div className="add-scholarship-page">
     
      
      <div className="container scholarship-form-container">
        <div className="scholarship-form-card">
          <div className="scholarship-form-header">
            <div className="header-icon">
              <FaGraduationCap />
            </div>
            <h2>Create Scholarship</h2>
            <p>Fill in the details to create a new scholarship opportunity</p>
          </div>
          
          <div className="scholarship-form-body">
            <form onSubmit={handleSubmit} className="scholarship-form">
              <div className="form-grid">
                {/* Left Column */}
                <div className="form-column">
                  <div className="form-group">
                    <label className="form-label">
                      <FaGraduationCap className="form-icon" />
                      Scholarship Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={scholarship.name}
                      onChange={(e) => setScholarship({...scholarship, name: e.target.value})}
                      placeholder="Enter scholarship name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaFileAlt className="form-icon" />
                      Description
                    </label>
                    <textarea
                      className="form-input"
                      rows="4"
                      required
                      value={scholarship.description}
                      onChange={(e) => setScholarship({...scholarship, description: e.target.value})}
                      placeholder="Enter a detailed description of the scholarship"
                    />
                    <div className="form-tip">
                      <FaLightbulb className="tip-icon" />
                      <span>Provide clear details about the scholarship purpose and background</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaMoneyBillWave className="form-icon" />
                      Benefits
                    </label>
                    <textarea
                      className="form-input"
                      rows="3"
                      required
                      value={scholarship.benefits}
                      onChange={(e) => setScholarship({...scholarship, benefits: e.target.value})}
                      placeholder="Describe what students will receive (financial aid, mentorship, etc.)"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="form-column">
                  <div className="form-group">
                    <label className="form-label">
                      <FaList className="form-icon" />
                      Required Documents
                    </label>
                    <div className="document-input-group">
                      <input
                        type="text"
                        className="form-input"
                        value={newDocument}
                        onChange={(e) => setNewDocument(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter document name and press Enter or Add"
                      />
                      <button
                        type="button"
                        className="add-document-button"
                        onClick={addDocument}
                      >
                        <FaPlus /> Add
                      </button>
                    </div>
                    
                    <div className="document-list">
                      {scholarship.requiredDocuments.length > 0 ? (
                        scholarship.requiredDocuments.map((doc, index) => (
                          <div key={index} className="document-badge">
                            <FaFileAlt className="document-icon" />
                            <span>{doc}</span>
                            <button
                              type="button"
                              className="remove-document-button"
                              onClick={() => removeDocument(index)}
                              aria-label="Remove document"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="empty-documents">
                          <FaInfoCircle className="empty-icon" />
                          <span>No documents added yet</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaCalendarAlt className="form-icon" />
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={scholarship.endDate}
                      onChange={(e) => setScholarship({...scholarship, endDate: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaCheckCircle className="form-icon" />
                      Eligibility Criteria
                    </label>
                    <textarea
                      className="form-input"
                      rows="3"
                      required
                      value={scholarship.eligibilityCriteria}
                      onChange={(e) => setScholarship({...scholarship, eligibilityCriteria: e.target.value})}
                      placeholder="Specify who can apply (academic requirements, demographics, etc.)"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="button-spinner"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="button-icon" />
                      <span>Save Scholarship</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          className="success-toast"
        >
          <Toast.Header closeButton={false}>
            <div className="toast-icon">
              <FaCheckCircle />
            </div>
            <strong className="me-auto">Success</strong>
            <button 
              type="button" 
              className="toast-close-button" 
              onClick={() => setShowToast(false)}
            >
              <FaTimes />
            </button>
          </Toast.Header>
          <Toast.Body>
            <div className="toast-message">
              Scholarship added successfully!
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default AddScholarships;