import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Toast, ToastContainer, Image } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaSignInAlt, FaUser, FaUniversity } from 'react-icons/fa';
import { getDatabase, ref, get } from 'firebase/database';
import Cookies from 'js-cookie'; 
import 'animate.css';
import '../LoginPage.css';

const LoginPage = (props) => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    userType: 'student',
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const db = getDatabase();
      const usersRef = ref(db, 'ScholarshipPortalDashboard/users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        let userFound = false;
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (
            userData.phoneNumber === formData.phoneNumber &&
            userData.password === formData.password &&
            userData.userType === formData.userType
          ) {
            userFound = true;
            showToastMessage('Login successful! Redirecting...', 'success');

            // Set cookies for user data
            Cookies.set('userName', userData.name);
            Cookies.set('userEmail', userData.email);
            Cookies.set('userPhoneNumber', userData.phoneNumber);
            Cookies.set('userType', userData.userType);
            Cookies.set('collegeName', userData.collegeName || ''); 
            Cookies.set('collegeCenterCode', userData.collegeCenterCode || '');

            // Update login state and navigate based on user type after a short delay
            setTimeout(() => {
              props.setlogin(true);
              if (userData.userType === 'college') {
                navigate('/dashboard-college');
              } else {
                navigate('/dashboard-student');
              }
            }, 1500);
          }
        });

        if (!userFound) {
          showToastMessage('Invalid phone number, password, or user type', 'danger');
        }
      } else {
        showToastMessage('No users found', 'danger');
      }
    } catch (error) {
      showToastMessage('An error occurred during login.', 'danger');
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showToastMessage = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="container login-content">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 d-none d-md-block">
            <div className={`login-image-container ${animate ? 'animate__animated animate__fadeInLeft' : ''}`}>
              <Image src="login.jpg" alt="Login" fluid className="login-image" />
              <div className="login-image-overlay">
                <h2 className="overlay-title">Welcome Back!</h2>
                <p className="overlay-text">Access your account to explore thousands of scholarship opportunities</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`login-card ${animate ? 'animate__animated animate__fadeInRight' : ''}`}>
              <div className="login-card-header">
                <div className="header-icon">
                  <FaSignInAlt />
                </div>
                <h2>Login to Your Account</h2>
                <p>Enter your credentials to access your account</p>
              </div>
              <div className="login-card-body">
                <Form onSubmit={handleSubmit}>
                  <div className="user-type-toggle mb-4">
                    <div 
                      className={`toggle-option ${formData.userType === 'student' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, userType: 'student'})}
                    >
                      <FaUser className="toggle-icon" />
                      <span>Student</span>
                    </div>
                    <div 
                      className={`toggle-option ${formData.userType === 'college' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, userType: 'college'})}
                    >
                      <FaUniversity className="toggle-icon" />
                      <span>College</span>
                    </div>
                  </div>
                
                  <Form.Group className="mb-4 form-floating">
                    <div className="input-with-icon">
                      
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        placeholder="Enter your phone number"
                        className="form-input"
                      />
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-4 form-floating">
                    <div className="input-with-icon">
                      
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                        className="form-input"
                      />
                    </div>
                  </Form.Group>
                  
               
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="login-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <FaSignInAlt className="me-2" />
                    )}
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </Form>
                
                <div className="mt-4 text-center">
                  <p className="mb-0">Don't have an account? <a href="#" className="register-link">Register Now</a></p>
                </div>
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
          className={`custom-toast ${toastVariant}`}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">
              {toastVariant === 'success' ? 'Success' : 'Error'}
            </strong>
          </Toast.Header>
          <Toast.Body>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default LoginPage;