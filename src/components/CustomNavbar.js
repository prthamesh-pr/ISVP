import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaGraduationCap,
  FaUser,
  FaBars
} from "react-icons/fa";
import "../Navbar.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CustomNavbar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    props.setlogin(false);
    Cookies.remove("userName");
    Cookies.remove("userEmail");
    Cookies.remove("userPhoneNumber");
    Cookies.remove("userType");
    Cookies.remove("collegeName");
    Cookies.remove("collegeCenterCode");
    navigate("/");
  };

  const userType = Cookies.get("userType");

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img
            src="scholarship.png"
            className="navbar-logo"
            alt="FundMyFuture Logo"
          />
          <div className="brand-text">
            <span className="brand-name">FundMyFuture</span>
            <span className="brand-portal"></span>
          </div>
        </Link>

        <button
          className="mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>

        <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="navbar-nav">
            {!props.islogin ? (
              // Items for not logged-in users
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    <FaHome className="nav-icon" /> 
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">
                    <FaInfoCircle className="nav-icon" /> 
                    About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link register-link">
                    <FaUserPlus className="nav-icon" /> 
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link login-btn">
                    <FaSignInAlt className="nav-icon" /> 
                    Login
                  </Link>
                </li>
              </>
            ) : (
              // Items for logged-in users based on user type
              <>
                {userType === 'college' ? (
                  // Items for college users
                  <>
                    <li className="nav-item">
                      <Link to="/dashboard-college" className="nav-link">
                        <FaHome className="nav-icon" /> 
                        College Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/add-scholarships" className="nav-link">
                        <FaGraduationCap className="nav-icon" /> 
                        Add Scholarships
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/view-all-scholarships" className="nav-link">
                        <FaGraduationCap className="nav-icon" /> 
                        View Scholarships
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/profile-details" className="nav-link">
                        <FaUser className="nav-icon" /> 
                        Profile
                      </Link>
                    </li>
                  </>
                ) : (
                  // Items for student users
                  <>
                    <li className="nav-item">
                      <Link to="/dashboard-student" className="nav-link">
                        <FaHome className="nav-icon" /> 
                        Student Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/eligibility-status" className="nav-link">
                        <FaInfoCircle className="nav-icon" /> 
                        Eligibility Status
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/all-scholarships" className="nav-link">
                        <FaGraduationCap className="nav-icon" /> 
                        All Scholarships
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/profile-documents" className="nav-link">
                        <FaUser className="nav-icon" /> 
                        Profile
                      </Link>
                    </li>
                  </>
                )}

                {/* Logout button for all logged-in users */}
                <li className="nav-item">
                  <Link to="/login" className="nav-link" onClick={handleLogout}>
                    <FaSignOutAlt className="nav-icon" /> 
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;