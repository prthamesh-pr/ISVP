import React, { useState } from 'react';
import { Form, Button, Toast, ToastContainer, Image } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus, FaBuilding } from 'react-icons/fa';
import { register } from "../firebase";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    userType: '', // Added userType field
    collegeName: '', // College name for College userType
  });

  const [collegeList, setCollegeList] = useState([
    'Harvard University',
    'Stanford University',
    'MIT',
    'Oxford University',
    // Add more colleges here
  ]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToastMessage('Passwords do not match', 'danger');
      return;
    }

    if (formData.password.length < 6) {
      showToastMessage('Password must be at least 6 characters long', 'danger');
      return;
    }

    try {
      const result = await register(formData);
      if (result) {
        showToastMessage('Registration successful!', 'success');
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          userType: '',
          collegeName: '',
        });
      } else {
        showToastMessage('Registration failed. Please try again.', 'danger');
      }
    } catch (error) {
      showToastMessage('An error occurred during registration.', 'danger');
    }
  };

  const showToastMessage = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="text-center mb-4">
                <FaUserPlus className="me-2 text-primary" />
                Register
              </h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label><FaUser className="me-2 text-primary" />Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><FaEnvelope className="me-2 text-primary" />Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><FaPhone className="me-2 text-primary" />Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><FaUser className="me-2 text-primary" />User Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select User Type</option>
                    <option value="college">College</option>
                    <option value="student">Student</option>
                  </Form.Control>
                </Form.Group>

                {formData.userType === 'college' && (
                  <Form.Group className="mb-3">
                    <Form.Label><FaBuilding className="me-2 text-primary" />College Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your college name"
                    />
                  </Form.Group>
                )}

                {formData.userType === 'student' && (
                  <Form.Group className="mb-3">
                    <Form.Label><FaBuilding className="me-2 text-primary" />Select College</Form.Label>
                    <Form.Control
                      as="select"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select your college</option>
                      {collegeList.map((college, index) => (
                        <option key={index} value={college}>{college}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label><FaLock className="me-2 text-primary" />Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><FaLock className="me-2 text-primary" />Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  <FaUserPlus className="me-2" /> Register
                </Button>
              </Form>
            </div>
          </div>
        </div>

        <div className="col-md-6 d-none d-md-block">
          <Image src="register1.png" alt="Registration" fluid rounded />
        </div>
      </div>

      <ToastContainer position="top-end" className="p-3">
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={3000} 
          autohide 
          bg={toastVariant}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">
              {toastVariant === 'success' ? 'Success' : 'Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'success' ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default RegisterPage;
