import React from 'react';
import { FaUsers, FaChartLine, FaHandshake } from 'react-icons/fa';

const AboutUsPage = () => {
  return (
    <div className="container mt-5 shadow-lg border p-2" style={{marginTop:"20px"}}>
      <br></br>
      <br></br>
      <div className="row">
        <div className="col-md-6">
          <img
            src="bg1.png"
            alt="About Us"
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <p className="lead">
            The Scholarship Portal Dashboard is dedicated to connecting students with educational opportunities. Our mission is to make the scholarship application process easier and more accessible for everyone.
          </p>
          <div className="mt-4">
            <h4><FaUsers className="text-primary me-2" /> Our Team</h4>
            <p>We are a group of passionate educators and technologists committed to helping students achieve their academic goals.</p>
          </div>
          <div className="mt-4">
            <h4><FaChartLine className="text-success me-2" /> Our Impact</h4>
            <p>Since our inception, we've helped thousands of students secure scholarships and further their education.</p>
          </div>
          <div className="mt-4">
            <h4><FaHandshake className="text-warning me-2" /> Our Partners</h4>
            <p>We collaborate with universities, organizations, and foundations to bring you the best scholarship opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
