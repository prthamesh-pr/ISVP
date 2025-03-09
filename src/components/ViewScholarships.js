import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { 
  FaTrashAlt, 
  FaEdit, 
  FaGraduationCap, 
  FaSearch, 
  FaCalendarAlt, 
  FaListAlt, 
  FaGift, 
  FaFileAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaPlus,
  FaSave,
  FaTimes,
  FaFilter,
  FaSortAmountDown
} from 'react-icons/fa';
import Cookies from 'js-cookie'; 
import { Modal, Button, Form } from 'react-bootstrap'; 
import '../ViewScholarships.css';

const ViewScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('endDate'); // 'endDate', 'name', 'createdAt'
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [scholarshipToDelete, setScholarshipToDelete] = useState(null);
  const collegeCode = Cookies.get('collegeCenterCode');

  useEffect(() => {
    const db = getDatabase();
    const scholarshipsRef = ref(db, `scholarships/${collegeCode}`);

    const unsubscribe = onValue(scholarshipsRef, (snapshot) => {
      const scholarshipData = [];
      snapshot.forEach((childSnapshot) => {
        const scholarship = childSnapshot.val();
        scholarshipData.push({
          id: childSnapshot.key,
          ...scholarship
        });
      });
      setScholarships(scholarshipData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [collegeCode]); 

  // Confirm deletion
  const confirmDelete = (scholarship) => {
    setScholarshipToDelete(scholarship);
    setShowDeleteConfirm(true);
  };

  // Handle actual deletion
  const handleDelete = () => {
    if (!scholarshipToDelete) return;
    
    const db = getDatabase();
    const scholarshipRef = ref(db, `scholarships/${collegeCode}/${scholarshipToDelete.id}`);
    
    remove(scholarshipRef)
      .then(() => {
        console.log('Scholarship deleted successfully!');
        setShowDeleteConfirm(false);
        setScholarshipToDelete(null);
      })
      .catch((error) => {
        console.error('Error deleting scholarship:', error);
      });
  };

  const handleEdit = (scholarship) => {
    setSelectedScholarship({ ...scholarship }); // Create a copy for editing
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedScholarship(null);
    setShowModal(false);
  };

  const handleSaveEdits = () => {
    const db = getDatabase();
    const scholarshipRef = ref(db, `scholarships/${collegeCode}/${selectedScholarship.id}`);

    update(scholarshipRef, selectedScholarship)
      .then(() => {
        console.log('Scholarship updated successfully!');
        handleCloseModal();
      })
      .catch((error) => {
        console.error('Error updating scholarship:', error);
      });
  };

  const handleChange = (e) => {
    setSelectedScholarship({ 
      ...selectedScholarship, 
      [e.target.name]: e.target.value 
    });
  };

  // Filter scholarships based on search term
  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort scholarships
  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    if (sortBy === 'endDate') {
      return new Date(a.endDate) - new Date(b.endDate);
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // Calculate days until deadline
  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const deadline = new Date(endDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="view-scholarships-page">
   

      <div className="container scholarship-manager-container">
        {/* Search and Filter Bar */}
        <div className="admin-header">
          <h2 className="admin-title">
            <FaGraduationCap className="admin-icon" />
            Your Scholarships
          </h2>
          
          <div className="admin-actions">
            <div className="search-filter-container">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search scholarships..."
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
                          className={`sort-button ${sortBy === 'endDate' ? 'active' : ''}`} 
                          onClick={() => setSortBy('endDate')}
                        >
                          <FaCalendarAlt /> Deadline
                        </button>
                        <button 
                          className={`sort-button ${sortBy === 'name' ? 'active' : ''}`} 
                          onClick={() => setSortBy('name')}
                        >
                          <FaSortAmountDown /> Name
                        </button>
                        <button 
                          className={`sort-button ${sortBy === 'createdAt' ? 'active' : ''}`} 
                          onClick={() => setSortBy('createdAt')}
                        >
                          <FaCalendarAlt /> Recently Added
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
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
              <FaCalendarAlt />
            </div>
            <div className="stat-info">
              <h3>{scholarships.filter(s => getDaysRemaining(s.endDate) <= 7 && getDaysRemaining(s.endDate) >= 0).length}</h3>
              <p>Ending This Week</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaExclamationCircle />
            </div>
            <div className="stat-info">
              <h3>{scholarships.filter(s => getDaysRemaining(s.endDate) < 0).length}</h3>
              <p>Expired Scholarships</p>
            </div>
          </div>
        </div>

        {/* Scholarships Table */}
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading scholarships...</p>
          </div>
        ) : (
          <div className="scholarships-table-container">
            {sortedScholarships.length > 0 ? (
              <div className="scholarships-table-responsive">
                <table className="scholarships-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Benefits</th>
                      <th>Documents</th>
                      <th>Deadline</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedScholarships.map((scholarship) => {
                      const daysRemaining = getDaysRemaining(scholarship.endDate);
                      let statusClass = "status-active";
                      let statusText = `${daysRemaining} days left`;
                      
                      if (daysRemaining < 0) {
                        statusClass = "status-expired";
                        statusText = "Expired";
                      } else if (daysRemaining <= 7) {
                        statusClass = "status-urgent";
                        statusText = daysRemaining === 0 ? "Last day" : `${daysRemaining} days left`;
                      }
                      
                      return (
                        <tr key={scholarship.id}>
                          <td className="scholarship-name-cell">{scholarship.name}</td>
                          <td className="scholarship-description-cell">{scholarship.description.length > 100 ? `${scholarship.description.substring(0, 100)}...` : scholarship.description}</td>
                          <td className="scholarship-benefits-cell">{scholarship.benefits.length > 100 ? `${scholarship.benefits.substring(0, 100)}...` : scholarship.benefits}</td>
                          <td className="scholarship-documents-cell">
                            <ul className="documents-list">
                              {scholarship.requiredDocuments &&
                                scholarship.requiredDocuments.map((doc, index) => (
                                  <li key={index}><FaFileAlt className="document-icon" /> {doc}</li>
                                ))}
                            </ul>
                          </td>
                          <td className="scholarship-date-cell">{formatDate(scholarship.endDate)}</td>
                          <td className="scholarship-status-cell">
                            <span className={`status-badge ${statusClass}`}>{statusText}</span>
                          </td>
                          <td className="scholarship-actions-cell">
                            <button 
                              className="action-button edit-button" 
                              onClick={() => handleEdit(scholarship)}
                              title="Edit Scholarship"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="action-button delete-button" 
                              onClick={() => confirmDelete(scholarship)}
                              title="Delete Scholarship"
                            >
                              <FaTrashAlt />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-scholarships">
                <div className="no-scholarships-icon">
                  <FaExclamationCircle />
                </div>
                <h3>No Scholarships Found</h3>
                <p>
                  {searchTerm 
                    ? `No scholarships match your search term "${searchTerm}"`
                    : "You haven't added any scholarships yet. Click the button below to add your first scholarship."}
                </p>
                {searchTerm ? (
                  <button 
                    className="clear-search-button"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                ) : (
                  <button className="add-scholarship-button">
                    <FaPlus /> Add New Scholarship
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" className="scholarship-modal">
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">
            <FaEdit className="modal-icon" /> Edit Scholarship
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedScholarship && (
            <Form className="scholarship-form">
              <Form.Group className="mb-3">
                <Form.Label><FaGraduationCap className="form-icon" /> Scholarship Name</Form.Label>
                <Form.Control 
                  type="text" 
                  name="name" 
                  value={selectedScholarship.name}
                  onChange={handleChange} 
                  className="form-input"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label><FaListAlt className="form-icon" /> Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  name="description" 
                  value={selectedScholarship.description}
                  onChange={handleChange} 
                  className="form-input"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label><FaGift className="form-icon" /> Benefits</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  name="benefits" 
                  value={selectedScholarship.benefits}
                  onChange={handleChange} 
                  className="form-input"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label><FaFileAlt className="form-icon" /> Required Documents</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  name="requiredDocuments" 
                  value={selectedScholarship.requiredDocuments.join('\n')} // Display documents as separate lines
                  onChange={(e) => {
                    const documents = e.target.value.split('\n').filter(doc => doc.trim() !== ''); // Split input into an array and remove empty lines
                    setSelectedScholarship({
                      ...selectedScholarship,
                      requiredDocuments: documents,
                    });
                  }}
                  className="form-input"
                  placeholder="Enter each document on a new line"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label><FaCalendarAlt className="form-icon" /> Application Deadline</Form.Label>
                <Form.Control 
                  type="date" 
                  name="endDate" 
                  value={selectedScholarship.endDate}
                  onChange={handleChange} 
                  className="form-input"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label><FaCheckCircle className="form-icon" /> Eligibility Criteria</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  name="eligibilityCriteria" 
                  value={selectedScholarship.eligibilityCriteria}
                  onChange={handleChange} 
                  className="form-input"
                />
              </Form.Group>
              
              <div className="form-actions">
                <Button variant="secondary" onClick={handleCloseModal} className="cancel-button">
                  <FaTimes /> Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveEdits} className="save-button">
                  <FaSave /> Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered className="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">
            <FaExclamationCircle className="modal-icon delete-icon" /> Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this scholarship?</p>
          {scholarshipToDelete && (
            <div className="scholarship-to-delete">
              <h5>{scholarshipToDelete.name}</h5>
              <p>{scholarshipToDelete.description}</p>
            </div>
          )}
          <p className="delete-warning">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} className="cancel-button">
            <FaTimes /> Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} className="confirm-delete-button">
            <FaTrashAlt /> Delete Scholarship
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewScholarships;