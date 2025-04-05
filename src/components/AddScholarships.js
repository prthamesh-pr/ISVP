// AddScholarships.js with Dynamic Fields
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
  FaLightbulb,
  FaClipboardList
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
    eligibilityCriteria: '',
    dynamicFields: [] // New state for dynamic fields
  });
  const [showToast, setShowToast] = useState(false);
  const [newDocument, setNewDocument] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const collegeCode = Cookies.get('collegeCenterCode');
  
  // State for new dynamic field
  const [newField, setNewField] = useState({ 
    name: '', 
    label: '',
    type: 'text',
    required: true 
  });

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
        eligibilityCriteria: '',
        dynamicFields: []
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

  // Handler for adding a new dynamic field
  const addDynamicField = () => {
    if (newField.name.trim() && newField.label.trim()) {
      // Create field ID from name (lowercase, no spaces)
      const fieldId = newField.name.toLowerCase().replace(/\s+/g, '_');
      
      setScholarship({
        ...scholarship,
        dynamicFields: [
          ...scholarship.dynamicFields, 
          { 
            id: fieldId,
            label: newField.label,
            type: newField.type,
            required: newField.required
          }
        ]
      });
      
      // Reset new field form
      setNewField({ 
        name: '', 
        label: '',
        type: 'text',
        required: true 
      });
    }
  };

  // Remove a dynamic field
  const removeDynamicField = (index) => {
    const updatedFields = scholarship.dynamicFields.filter((_, i) => i !== index);
    setScholarship({ ...scholarship, dynamicFields: updatedFields });
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

              {/* Dynamic Fields Section */}
              <div className="dynamic-fields-section">
                <div className="section-header">
                  <FaClipboardList className="section-icon" />
                  <h3>Custom Application Fields</h3>
                  <p className="section-description">
                    Add custom fields that students need to fill when applying for this scholarship
                  </p>
                </div>

                <div className="dynamic-fields-container">
                  <div className="dynamic-fields-form">
                    <div className="dynamic-field-input-group">
                      <div className="field-input">
                        <label>Field Name</label>
                        <input
                          type="text"
                          placeholder="e.g., 10th_Marks"
                          value={newField.name}
                          onChange={(e) => setNewField({...newField, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="field-input">
                        <label>Display Label</label>
                        <input
                          type="text"
                          placeholder="e.g., 10th Standard Marks"
                          value={newField.label}
                          onChange={(e) => setNewField({...newField, label: e.target.value})}
                        />
                      </div>
                      
                      <div className="field-input">
                        <label>Field Type</label>
                        <select
                          value={newField.type}
                          onChange={(e) => setNewField({...newField, type: e.target.value})}
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                        </select>
                      </div>
                      
                      <div className="field-input field-required">
                        <label>
                          <input
                            type="checkbox"
                            checked={newField.required}
                            onChange={(e) => setNewField({...newField, required: e.target.checked})}
                          />
                          Required Field
                        </label>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className="add-field-button"
                      onClick={addDynamicField}
                    >
                      <FaPlus /> Add Field
                    </button>
                  </div>
                  
                  <div className="dynamic-fields-list">
                    <h4>Added Custom Fields:</h4>
                    
                    {scholarship.dynamicFields.length > 0 ? (
                      <div className="fields-table">
                        <div className="fields-header">
                          <div className="field-cell">Field ID</div>
                          <div className="field-cell">Display Label</div>
                          <div className="field-cell">Type</div>
                          <div className="field-cell">Required</div>
                          <div className="field-cell">Action</div>
                        </div>
                        
                        {scholarship.dynamicFields.map((field, index) => (
                          <div key={index} className="field-row">
                            <div className="field-cell">{field.id}</div>
                            <div className="field-cell">{field.label}</div>
                            <div className="field-cell">{field.type}</div>
                            <div className="field-cell">{field.required ? 'Yes' : 'No'}</div>
                            <div className="field-cell">
                              <button
                                type="button"
                                className="remove-field-button"
                                onClick={() => removeDynamicField(index)}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-fields">
                        <FaInfoCircle className="empty-icon" />
                        <span>No custom fields added yet</span>
                      </div>
                    )}
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