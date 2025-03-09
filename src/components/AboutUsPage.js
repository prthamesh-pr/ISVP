import React from 'react';
import { FaUsers, FaChartLine, FaHandshake, FaGraduationCap, FaLightbulb, FaStar } from 'react-icons/fa';
import '../AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-header">
        <div className="container">
          <h1 className="display-4 text-center mb-4">About Us</h1>
          <div className="header-underline"></div>
          <p className="lead text-center">
            Connecting ambitious students with life-changing scholarship opportunities
          </p>
        </div>
      </div>

      <div className="container about-us-content">
        <div className="row align-items-center mission-section">
          <div className="col-lg-6">
            <div className="about-image-container">
              <img
                src="bg1.png"
                alt="About Us"
                className="img-fluid about-image"
              />
              <div className="image-shape-1"></div>
              <div className="image-shape-2"></div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-text-container">
              <h2 className="section-title">Our Mission</h2>
              <div className="section-underline"></div>
              <p className="mission-text">
                The FundMyFuture Dashboard is dedicated to connecting students with educational opportunities. 
                Our mission is to make the scholarship application process easier, more transparent, and more 
                accessible for everyone, regardless of their background or circumstances.
              </p>
              <div className="mission-stats">
                <div className="stat-item">
                  <div className="stat-number">5000+</div>
                  <div className="stat-label">Scholarships</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">1200+</div>
                  <div className="stat-label">Universities</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">25K+</div>
                  <div className="stat-label">Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row values-section">
          <div className="col-12 text-center mb-5">
            <h2 className="section-title">Our Core Values</h2>
            <div className="section-underline mx-auto"></div>
          </div>
          <div className="col-md-4">
            <div className="value-card">
              <div className="icon-container">
                <FaGraduationCap className="value-icon" />
              </div>
              <h3>Education Access</h3>
              <p>We believe that quality education should be accessible to all, regardless of financial circumstances.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="value-card">
              <div className="icon-container">
                <FaLightbulb className="value-icon" />
              </div>
              <h3>Innovation</h3>
              <p>We continuously improve our platform to make the scholarship discovery process smarter and simpler.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="value-card">
              <div className="icon-container">
                <FaStar className="value-icon" />
              </div>
              <h3>Excellence</h3>
              <p>We strive for excellence in all aspects of our service, from user experience to scholarship curation.</p>
            </div>
          </div>
        </div>

        <div className="row about-details-section">
          <div className="col-md-4">
            <div className="about-card">
              <div className="about-card-icon">
                <FaUsers />
              </div>
              <h4>Our Team</h4>
              <p>We are a diverse group of passionate educators, technologists, and former scholarship recipients committed to helping students achieve their academic dreams and professional goals.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="about-card">
              <div className="about-card-icon">
                <FaChartLine />
              </div>
              <h4>Our Impact</h4>
              <p>Since our inception, we've helped thousands of students secure over $50 million in scholarship funding, enabling them to pursue higher education without the burden of excessive debt.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="about-card">
              <div className="about-card-icon">
                <FaHandshake />
              </div>
              <h4>Our Partners</h4>
              <p>We collaborate with universities, non-profit organizations, and corporate foundations worldwide to bring you exclusive scholarship opportunities and ensure educational dreams become reality.</p>
            </div>
          </div>
        </div>

        <div className="cta-section text-center">
          <h2>Ready to Find Your Perfect Scholarship?</h2>
          <p>Join thousands of students who have successfully funded their education through our platform.</p>
         
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;