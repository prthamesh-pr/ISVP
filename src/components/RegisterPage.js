import React, { useState, useEffect } from 'react';
import { Form, Button, Toast, ToastContainer, Image } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus, FaBuilding, FaUniversity, FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import { collegeListUpdate, getAllColleges, register } from "../firebase";
import 'animate.css';
import '../RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    userType: '',
    collegeName: '',
    collegeCenterCode: ''
  });

  const [collegeList, setCollegeList] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [animate, setAnimate] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimate(true);
    }, 100);

    const fetchColleges = async () => {
      const colleges = await getAllColleges();
      setCollegeList(colleges);
    };

    fetchColleges();
  }, []);

  useEffect(() => {
    // Calculate password strength
    if (formData.password) {
      let strength = 0;
      
      // Length check
      if (formData.password.length >= 8) strength += 25;
      else if (formData.password.length >= 6) strength += 15;
      
      // Contains uppercase
      if (/[A-Z]/.test(formData.password)) strength += 25;
      
      // Contains number
      if (/[0-9]/.test(formData.password)) strength += 25;
      
      // Contains special character
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
      
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCollegeChange = (e) => {
    const selectedCollege = e.target.value;
    const centerCode = Object.keys(collegeList).find(key => collegeList[key] === selectedCollege);
    setFormData({ ...formData, collegeName: selectedCollege, collegeCenterCode: centerCode });
  };

  const nextStep = () => {
    // Validate first step
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phoneNumber) {
        showToastMessage('Please fill in all required fields', 'danger');
        return;
      }
      
      if (!/^[A-Za-z\s]+$/.test(formData.name) || formData.name.length < 6) {
        showToastMessage('Name must be at least 6 characters long and contain only alphabetic characters', 'danger');
        return;
      }
      
      if (!/^\d{10}$/.test(formData.phoneNumber)) {
        showToastMessage('Phone Number should be 10 digits long and contain only numbers', 'danger');
        return;
      }
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      showToastMessage('Passwords do not match', 'danger');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      showToastMessage('Password must be at least 6 characters long', 'danger');
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(formData);
      if (result) {
        if (formData.userType === 'college') {
          await collegeListUpdate(formData.collegeName, formData.collegeCenterCode);
          const colleges = await getAllColleges();
          setCollegeList(colleges);
        }
        showToastMessage('Registration successful!', 'success');
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          userType: '',
          collegeName: '',
          collegeCenterCode: ''
        });
        setStep(1);
      } else {
        showToastMessage('Registration failed. Please try again.', 'danger');
      }
    } catch (error) {
      showToastMessage('An error occurred during registration.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const showToastMessage = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return '#dc3545'; // Weak - red
    if (passwordStrength < 50) return '#fd7e14'; // Fair - orange
    if (passwordStrength < 75) return '#ffc107'; // Good - yellow
    return '#28a745'; // Strong - green
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="register-container">
      <div className="register-background"></div>
      <div className="container register-content">
        <div className="row justify-content-center align-items-stretch">
          <div className="col-md-6 order-md-2">
            <div className={`register-image-container ${animate ? 'animate__animated animate__fadeInRight' : ''}`}>
              <Image src="register1.png" alt="Registration" className="register-image" />
              <div className="register-image-overlay">
                <h2 className="overlay-title">Join Our Community</h2>
                <p className="overlay-text">Create an account to access exclusive scholarship opportunities</p>
                
                <div className="registration-steps">
                  <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-text">Personal Info</div>
                  </div>
                  <div className="step-connector"></div>
                  <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-text">Account Setup</div>
                  </div>
                  <div className="step-connector"></div>
                  <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-text">Institution</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 order-md-1">
            <div className={`register-card ${animate ? 'animate__animated animate__fadeInLeft' : ''}`}>
              <div className="register-card-header">
                <div className="header-icon">
                  <FaUserPlus />
                </div>
                <h2>Create Your Account</h2>
                <p>Fill in your information to get started</p>
              </div>
              
              <div className="register-card-body">
                <Form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="animate__animated animate__fadeIn">
                      <div className="user-type-toggle mb-4">
                        <div 
                          className={`toggle-option ${formData.userType === 'student' ? 'active' : ''}`}
                          onClick={() => setFormData({...formData, userType: 'student'})}
                        >
                          <FaGraduationCap className="toggle-icon" />
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
                      
                      <Form.Group className="mb-4">
                        <div className="input-with-icon">
                         
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                            className="form-input"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <div className="input-with-icon">
                        
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email address"
                            className="form-input"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-4">
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
                      
                      <Button 
                        type="button" 
                        className="next-button" 
                        onClick={nextStep}
                      >
                        Next Step <FaArrowRight className="ms-2" />
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="animate__animated animate__fadeIn">
                      <Form.Group className="mb-4">
                        <div className="input-with-icon">
                          
                          <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password"
                            className="form-input"
                          />
                        </div>
                        {formData.password && (
                          <div className="password-strength mt-2">
                            <div className="strength-bar-container">
                              <div 
                                className="strength-bar" 
                                style={{ 
                                  width: `${passwordStrength}%`,
                                  backgroundColor: getPasswordStrengthColor()
                                }}
                              ></div>
                            </div>
                            <div className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                              {getPasswordStrengthText()} Password
                            </div>
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <div className="input-with-icon">
                          
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                            className="form-input"
                          />
                        </div>
                        {formData.password && formData.confirmPassword && (
                          <div className="password-match mt-2">
                            {formData.password === formData.confirmPassword ? (
                              <div className="text-success">Passwords match</div>
                            ) : (
                              <div className="text-danger">Passwords do not match</div>
                            )}
                          </div>
                        )}
                      </Form.Group>
                      
                      <div className="d-flex justify-content-between mt-4">
                        <Button 
                          type="button" 
                          className="back-button" 
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button 
                          type="button" 
                          className="next-button" 
                          onClick={nextStep}
                        >
                          Next Step <FaArrowRight className="ms-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="animate__animated animate__fadeIn">
                      {formData.userType === 'college' && (
                        <>
                          <Form.Group className="mb-4">
                            <div className="input-with-icon">
                             
                              <Form.Control
                                type="text"
                                name="collegeName"
                                value={formData.collegeName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your college name"
                                className="form-input"
                              />
                            </div>
                          </Form.Group>

                          <Form.Group className="mb-4">
                            <div className="input-with-icon">
                            
                              <Form.Control
                                type="text"
                                name="collegeCenterCode"
                                value={formData.collegeCenterCode}
                                onChange={handleChange}
                                required
                                placeholder="Enter college center code"
                                className="form-input"
                              />
                            </div>
                          </Form.Group>
                        </>
                      )}

                      {formData.userType === 'student' && (
                        <>
                          <Form.Group className="mb-4">
                            <Form.Label className="form-label">Select Your College</Form.Label>
                            <div className="input-with-icon">
                              
                              <Form.Select
                                name="collegeName"
                                value={formData.collegeName}
                                onChange={handleCollegeChange}
                                required
                                className="form-input"
                              >
                                <option value="">Select your college</option>
                                {Object.entries(collegeList).map(([centerCode, name], index) => (
                                  <option key={index} value={name}>{name}</option>
                                ))}
                              </Form.Select>
                            </div>
                          </Form.Group>

                          {formData.collegeCenterCode && (
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label">College Center Code</Form.Label>
                              <div className="input-with-icon">
                              
                                <Form.Control
                                  type="text"
                                  value={formData.collegeCenterCode}
                                  readOnly
                                  className="form-input bg-light"
                                />
                              </div>
                            </Form.Group>
                          )}
                        </>
                      )}
                      
                      <div className="d-flex justify-content-between mt-4">
                        <Button 
                          type="button" 
                          className="back-button" 
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          className="register-button"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          ) : (
                            <FaUserPlus className="me-2" />
                          )}
                          {isLoading ? 'Registering...' : 'Complete Registration'}
                        </Button>
                      </div>
                    </div>
                  )}
                </Form>
                
                <div className="mt-4 text-center">
                  <p className="mb-0">Already have an account? <a href="/login" className="login-link">Login</a></p>
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

export default RegisterPage;