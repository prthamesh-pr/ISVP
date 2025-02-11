import React from 'react';
import { Carousel } from 'react-bootstrap';
import { FaGraduationCap, FaBook, FaUniversity } from 'react-icons/fa';
import '../HomePage.css'; // You'll need to create this CSS file

const HomePage = () => {
  return (
    <div className="home-page">
      <Carousel fade controls={false} pause="hover" className="full-screen-carousel">
        <Carousel.Item interval={3000}> 
          <div 
            className="carousel-image"
            style={{backgroundImage: 'url("bg5.png")'}} 
          />
          <Carousel.Caption className="carousel-caption">
            <h1 className="main-title">Welcome to Scholarship Portal</h1>
            <h3>Discover Opportunities</h3>
            <p>Find scholarships that match your profile</p>

          </Carousel.Caption>
        </Carousel.Item>
        {/* Other Carousel Items */}
      </Carousel>

      <section className="features py-5"> 
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4 text-center">
              <div className="feature-box"> 
                <FaGraduationCap size={50} className="text-primary mb-3" />
                <h4>Scholarships</h4>
                <p>Browse through thousands of scholarships.</p>
              </div>
              
            </div>


           <div className="col-md-4 mb-4 text-center">
            <div className="feature-box"> 
            <FaBook size={50} className="text-success mb-3" />
            <h4>Resources</h4>
            <p>Access helpful guides and tutorials</p>
          </div>
  
              
          </div>


          <div className="col-md-4 mb-4 text-center">
            <div className="feature-box"> 
            <FaUniversity size={50} className="text-warning mb-3" />
            <h4>Universities</h4>
            <p>Explore partner institutions</p>
          </div>
  
              
          </div>

            {/* Other Feature Columns */}
          </div>
        </div>
      </section>

      {/* Other Sections */}
    </div>
  );
};

export default HomePage;
