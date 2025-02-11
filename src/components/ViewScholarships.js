import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, off, remove, update } from 'firebase/database';
import { FaTrashAlt, FaEdit, FaGraduationCap } from 'react-icons/fa';
import Cookies from 'js-cookie'; 
import { Modal, Button, Form } from 'react-bootstrap'; 
import DashboardHeading from './DashboardHeading';

const ViewScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
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
    });

    return () => unsubscribe();
  }, [collegeCode]); 

  const handleDelete = (scholarshipId) => {
    const db = getDatabase();
    const scholarshipRef = ref(db, `scholarships/${collegeCode}/${scholarshipId}`);
    remove(scholarshipRef)
      .then(() => {
        console.log('Scholarship deleted successfully!');
        // You might want to display a success message to the user
      })
      .catch((error) => {
        console.error('Error deleting scholarship:', error);
        // Handle the error appropriately, e.g., display an error message
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
        // Optionally show a success message to the user
      })
      .catch((error) => {
        console.error('Error updating scholarship:', error);
        // Handle the error, e.g., display an error message
      });
  };

  const handleChange = (e) => {
    setSelectedScholarship({ 
      ...selectedScholarship, 
      [e.target.name]: e.target.value 
    });
  };

  return (
    <>
      <DashboardHeading text={"View Scholarships"} />
      <div className="container" style={{ marginTop: "120px" }}>
        <div className="card shadow-lg border">
          <div className="card-body">
            <h4 className="text-center mb-4">
              <FaGraduationCap className="me-2" />

            </h4>

            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Benefits</th>
                    <th>Documents</th>
                    <th>End Date</th>
                    <th>Eligibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarships.map((scholarship) => (
                    <tr key={scholarship.id}>
                      <td>{scholarship.name}</td>
                      <td>{scholarship.description}</td>
                      <td>{scholarship.benefits}</td>
                      <td>
                        <ul>
                          {scholarship.requiredDocuments &&
                            scholarship.requiredDocuments.map((doc, index) => (
                              <li key={index}>{doc}</li>
                            ))}
                        </ul>
                      </td>
                      <td>{scholarship.endDate}</td>
                      <td>{scholarship.eligibilityCriteria}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-warning me-2" 
                          onClick={() => handleEdit(scholarship)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleDelete(scholarship.id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal  */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Scholarship</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedScholarship && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={selectedScholarship.name}
                onChange={handleChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="description" 
                value={selectedScholarship.description}
                onChange={handleChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Benefits</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="benefits" 
                value={selectedScholarship.benefits}
                onChange={handleChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Required Documents</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="requiredDocuments" 
                value={selectedScholarship.requiredDocuments.join('\n')} // Display documents as separate lines
                onChange={(e) => {
                  const documents = e.target.value.split('\n'); // Split input into an array
                  setSelectedScholarship({
                    ...selectedScholarship,
                    requiredDocuments: documents,
                  });
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control 
                type="date" 
                name="endDate" 
                value={selectedScholarship.endDate}
                onChange={handleChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Eligibility Criteria</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="eligibilityCriteria" 
                value={selectedScholarship.eligibilityCriteria}
                onChange={handleChange} 
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSaveEdits}>
              Save Changes
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
    </>
  );
};

export default ViewScholarships;
