import React from 'react';
import { Carousel } from 'react-bootstrap';
import { FaGraduationCap, FaBook, FaUniversity } from 'react-icons/fa';
import '../HomePage.css'; // You'll need to create this CSS file

const HomePage = () => {
  return (
    <div className="home-page">
      <Carousel fade className="full-screen-carousel">
        <Carousel.Item>
          <div 
            className="carousel-image"
            style={{backgroundImage: `url('bg5.png')`}}
          />
          <Carousel.Caption>
            <h1 className="main-title">Welcome to Scholarship Portal</h1>
            <h3>Discover Opportunities</h3>
            <p>Find scholarships that match your profile</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div 
            className="carousel-image"
            style={{backgroundImage: `url('bg4.jpg')`}}
          />
          <Carousel.Caption>
            <h1 className="main-title">Welcome to Scholarship Portal</h1>
            <h3>Apply with Ease</h3>
            <p>Streamlined application process for your convenience</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div 
            className="carousel-image"
            style={{backgroundImage: `url('bg3.jpg')`}}
          />
          <Carousel.Caption>
            <h1 className="main-title">Welcome to Scholarship Portal</h1>
            <h3>Track Your Progress</h3>
            <p>Stay updated on your scholarship applications</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-md-4 text-center">
            <FaGraduationCap size={50} className="text-primary mb-3" />
            <h4>Scholarships</h4>
            <p>Browse through thousands of scholarships</p>
          </div>
          <div className="col-md-4 text-center">
            <FaBook size={50} className="text-success mb-3" />
            <h4>Resources</h4>
            <p>Access helpful guides and tutorials</p>
          </div>
          <div className="col-md-4 text-center">
            <FaUniversity size={50} className="text-warning mb-3" />
            <h4>Universities</h4>
            <p>Explore partner institutions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
