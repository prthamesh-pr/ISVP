import React, { useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { FaGraduationCap, FaBook, FaUniversity, FaSearch, FaUserGraduate, FaAward } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css'; 
import '../HomePage.css'


const HomePage = () => {
  useEffect(() => {
  
    const animateStats = () => {
      const statCounters = document.querySelectorAll('.stat-counter');
      statCounters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        
        let count = 0;
        const updateCounter = () => {
          if (count < target) {
            count += increment;
            counter.innerText = Math.ceil(count).toLocaleString();
            setTimeout(updateCounter, 10);
          } else {
            counter.innerText = target.toLocaleString();
          }
        };
        
        updateCounter();
      });
    };
    
    // Run animations when elements are in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('stats-section')) {
            animateStats();
          }
          entry.target.classList.add('animate__animated', entry.target.dataset.animation);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home-page">
      {/* Enhanced Carousel with Multiple Slides */}
      <Carousel fade controls={true} indicators={true} pause="hover" className="full-screen-carousel">
        <Carousel.Item interval={5000}> 
          <div 
            className="carousel-image"
            style={{backgroundImage: 'url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080")'}}>
          </div>
          <Carousel.Caption className="carousel-caption animate__animated animate__fadeInUp">
            <h1 className="main-title">Welcome to Inter State Student Verification Portal</h1>
            <h3>Discover Opportunities</h3>
            <p>Find scholarships that match your profile and take your education to the next level</p>
            
      
          </Carousel.Caption>
        </Carousel.Item>
        
        <Carousel.Item interval={5000}>
          <div 
            className="carousel-image"
            style={{backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080")'}}>
          </div>
          <Carousel.Caption className="carousel-caption animate__animated animate__fadeInUp">
            <h1 className="main-title">Educational Excellence</h1>
            <h3>Partner with Top Universities</h3>
            <p>Access exclusive scholarships from our partner institutions worldwide</p>
            
          </Carousel.Caption>
        </Carousel.Item>
        
        <Carousel.Item interval={5000}>
          <div 
            className="carousel-image"
            style={{backgroundImage: 'url("https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080")'}}>
          </div>
          <Carousel.Caption className="carousel-caption animate__animated animate__fadeInUp">
            <h1 className="main-title">Success Stories</h1>
            <h3>Join Thousands of Achievers</h3>
            <p>Learn from past scholarship recipients and their journey to success</p>
            
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Enhanced Features Section with Gradients and Animations */}
      <section className="features py-5 animate-on-scroll" data-animation="animate__fadeIn">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold">What We Offer</h2>
            <p className="lead">Everything you need to succeed in your educational journey</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4 mb-4">
              <div className="feature-box animate-on-scroll" data-animation="animate__fadeInUp">
                <div className="text-center">
                  <div className="feature-icon icon-grad-1 mb-4">
                    <FaGraduationCap size={50} className="text-white" />
                  </div>
                  <h4>Scholarships Database</h4>
                  <p>Browse through thousands of scholarships from around the world, updated daily with new opportunities.</p>
                  
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="feature-box animate-on-scroll" data-animation="animate__fadeInUp" data-delay="200">
                <div className="text-center">
                  <div className="feature-icon icon-grad-2 mb-4">
                    <FaBook size={50} className="text-white" />
                  </div>
                  <h4>Learning Resources</h4>
                  <p>Access helpful guides, tutorials, and expert advice on application processes and scholarship interviews.</p>
       
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="feature-box animate-on-scroll" data-animation="animate__fadeInUp" data-delay="400">
                <div className="text-center">
                  <div className="feature-icon icon-grad-3 mb-4">
                    <FaUniversity size={50} className="text-white" />
                  </div>
                  <h4>Partner Universities</h4>
                  <p>Explore our network of partner institutions offering exclusive scholarships to our members.</p>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Animation */}
      <section className="stats-section py-5 animate-on-scroll" data-animation="animate__fadeIn">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3 col-6">
              <div className="stat-item animate-on-scroll" data-animation="animate__fadeInUp">
                <h2><span className="stat-counter" data-target="5000">0</span>+</h2>
                <p>Scholarships Available</p>
              </div>
            </div>
            
            <div className="col-md-3 col-6">
              <div className="stat-item animate-on-scroll" data-animation="animate__fadeInUp" data-delay="200">
                <h2><span className="stat-counter" data-target="1200">0</span>+</h2>
                <p>Partner Universities</p>
              </div>
            </div>
            
            <div className="col-md-3 col-6">
              <div className="stat-item animate-on-scroll" data-animation="animate__fadeInUp" data-delay="400">
                <h2><span className="stat-counter" data-target="25000">0</span>+</h2>
                <p>Success Stories</p>
              </div>
            </div>
            
            <div className="col-md-3 col-6">
              <div className="stat-item animate-on-scroll" data-animation="animate__fadeInUp" data-delay="600">
                <h2>$<span className="stat-counter" data-target="50">0</span>M+</h2>
                <p>Scholarship Funding</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works py-5 bg-light animate-on-scroll" data-animation="animate__fadeIn">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold">How It Works</h2>
            <p className="lead">Three simple steps to find your perfect scholarship</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm animate-on-scroll" data-animation="animate__fadeInUp">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-primary text-white fs-1 d-inline-flex align-items-center justify-content-center mb-3" style={{width: "80px", height: "80px"}}>1</div>
                  <h4 className="card-title">Create Your Profile</h4>
                  <p className="card-text">Fill in your academic background, interests, and qualifications to help us match you with the right scholarships.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 shadow-sm animate-on-scroll" data-animation="animate__fadeInUp" data-delay="200">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-success text-white fs-1 d-inline-flex align-items-center justify-content-center mb-3" style={{width: "80px", height: "80px"}}>2</div>
                  <h4 className="card-title">Browse Opportunities</h4>
                  <p className="card-text">Explore our database of scholarships filtered according to your profile and preferences.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 shadow-sm animate-on-scroll" data-animation="animate__fadeInUp" data-delay="400">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-warning text-white fs-1 d-inline-flex align-items-center justify-content-center mb-3" style={{width: "80px", height: "80px"}}>3</div>
                  <h4 className="card-title">Apply with Confidence</h4>
                  <p className="card-text">Use our resources and guidance to submit strong applications and increase your chances of success.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="cta-section animate-on-scroll" data-animation="animate__fadeIn">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Scholarship Journey?</h2>
            <p className="lead mb-4">Join thousands of students who have found their perfect educational funding through our platform.</p>
           
          
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;