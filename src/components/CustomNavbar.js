import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
  FaGraduationCap, // Add an icon for college-related items
} from "react-icons/fa";
import "../Navbar.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CustomNavbar = (props) => {
  const navigate = useNavigate();
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

  const userType = Cookies.get("userType"); // Get user type from cookies

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <a className="navbar-brand" href="#">
          <img
            src="scholarship.png" 
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="Scholarship Portal Logo"
          />
          <span>Scholarship Portal</span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!props.islogin ? (
              // Items for not logged-in users
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    <FaHome className="nav-icon" /> Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">
                    <FaInfoCircle className="nav-icon" /> About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    <FaUserPlus className="nav-icon" /> Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    <FaSignInAlt className="nav-icon" /> Login
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
                        <FaHome className="nav-icon" /> College Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/add-scholarships" className="nav-link">
                        <FaGraduationCap className="nav-icon" /> Add Scholarships
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/view-all-scholarships" className="nav-link">
                        <FaGraduationCap className="nav-icon" /> View Scholarships
                      </Link>
                    </li>
                     <li className="nav-item">
                  <Link to="/profile-details" className="nav-link">
                    <FaEnvelope className="nav-icon" /> Profile
                  </Link>
                </li>
                  </>
                ) : (
                  // Items for student users
                  <>
                    <li className="nav-item">
                      <Link to="/dashboard-student" className="nav-link">
                        <FaHome className="nav-icon" /> Student Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/eligibility-status" className="nav-link">
                        <FaInfoCircle className="nav-icon" /> Eligibility Status
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/all-scholarships" className="nav-link">
                        <FaUserPlus className="nav-icon" /> All Scholarships
                      </Link>
                    </li> 
                    <li className="nav-item">
                  <Link to="/profile-documents" className="nav-link">
                    <FaEnvelope className="nav-icon" /> Profile
                  </Link>
                </li>
                  </>
                )}

                {/* Common items for all logged-in users */}
               
                <li className="nav-item">
                  <Link to="/login" className="nav-link" onClick={handleLogout}>
                    <FaSignOutAlt className="nav-icon" /> Logout
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
