import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaHome, FaInfoCircle, FaEnvelope, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import '../Navbar.css';

const CustomNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          <img
            src="scholarship.png" 
            width="30"
            height="30"
            className="d-inline-block align-top mr-2"
            alt="Scholarship Portal Logo"
          />
          <span >Scholarship Portal</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/" className="nav-item">
              <FaHome className="nav-icon" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-item">
              <FaInfoCircle className="nav-icon" /> About Us
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-item">
              <FaEnvelope className="nav-icon" /> Contact Us
            </Nav.Link>
            <Nav.Link as={Link} to="/register" className="nav-item">
              <FaUserPlus className="nav-icon" /> Register
            </Nav.Link>
            <Nav.Link as={Link} to="/login" className="nav-item">
              <FaSignInAlt className="nav-icon" /> Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
