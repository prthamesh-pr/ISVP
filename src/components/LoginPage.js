import React, { useState } from 'react';
import { Form, Button, Toast, ToastContainer, Image } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { getDatabase, ref, get } from 'firebase/database';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'student', // Default to student
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const db = getDatabase();
      const usersRef = ref(db, 'ScholarshipPortalDashboard/users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        let userFound = false;
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (
            userData.email === formData.email &&
            userData.password === formData.password &&
            userData.userType === formData.userType // Check user type
          ) {
            userFound = true;
            showToastMessage('Login successful!', 'success');
            // Typically, you'd set the user session or redirect to a dashboard
            console.log('Login successful!');
            return;
          }
        });

        if (!userFound) {
          showToastMessage('Invalid email, password, or user type', 'danger');
        }
      } else {
        showToastMessage('No users found', 'danger');
      }
    } catch (error) {
      showToastMessage('An error occurred during login.', 'danger');
    }
  };

  const showToastMessage = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6 d-none d-md-block">
          <Image src="login.jpg" alt="Login" fluid rounded className="" />
        </div>
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="text-center mb-4">
                <FaSignInAlt className="me-2 text-primary" />
                Login
              </h2>
              <Form onSubmit={handleSubmit}>
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
                  <Form.Label><FaLock className="me-2 text-primary" />User Type</Form.Label>
                  <Form.Select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="college">College</option>

                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3">
                  <FaSignInAlt className="me-2" /> Login
                </Button>
              </Form>
              <div className="text-center mt-3">
                <a href="#" className="text-decoration-none">Forgot Password?</a>
              </div>
            </div>
          </div>
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

export default LoginPage;
