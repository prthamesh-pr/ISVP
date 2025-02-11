import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import AboutUsPage from './components/AboutUsPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import CustomNavbar from './components/CustomNavbar';
import DashboardPage from './components/DashboardPage';
import EligibilityStatusPage from './components/EligibilityStatusPage';
import AllScholarships from './components/AllScholarships';
import ProfileDocuments from './components/ProfileDocuments';
import Cookies from 'js-cookie'; 
import AddScholarships from './components/AddScholarships';
import StudentsDetails from './components/StudentsDetails';
import ViewScholarships from './components/ViewScholarships';
import ProfileCollege from './components/ProfileCollege';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CollegeDashboardPage from './components/CollegeDashboardPage';

function App() {
  const [islogin,setlogin] = useState(false);

  const [userData, setUserData] = useState([]);

  const getCookies = () => {
    const allCookies = Cookies.get(); 
    return allCookies;
  };

  useEffect(() => {
    if (islogin) {
      const cookies = getCookies();
      const userInfo = {
        userName: cookies.userName || '',
        userEmail: cookies.userEmail || '',
        userPhoneNumber: cookies.userPhoneNumber || '',
        userType: cookies.userType || '',
        collegeName: cookies.collegeName || '',
        collegeCenterCode: cookies.collegeCenterCode || ''
      };
      setUserData(userInfo);

    }
    else{
      const cookies = getCookies();
      if (cookies.userPhoneNumber) {
      
        const userInfo = {
          userName: cookies.userName || '',
          userEmail: cookies.userEmail || '',
          userPhoneNumber: cookies.userPhoneNumber || '',
          userType: cookies.userType || '',
          collegeName: cookies.collegeName || '',
          collegeCenterCode: cookies.collegeCenterCode || ''
        };
        setUserData(userInfo);
        setlogin(true);
      }else{
        Cookies.remove('userName');
        Cookies.remove('userEmail');
        Cookies.remove('userPhoneNumber');
        Cookies.remove('userType');
        Cookies.remove('collegeName');
        Cookies.remove('collegeCenterCode');
      }
     
    }
  }, [islogin]);

  useEffect(() => {
    
    
  }, []);

  return (
    <Router>
      
      <div className="App d-flex flex-column min-vh-100">
    
        <main className="flex-grow-1">
        <CustomNavbar islogin={islogin} setlogin={setlogin}></CustomNavbar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage islogin={islogin} setlogin={setlogin} />} />

          <Route path="/dashboard-student" element={<DashboardPage />} />
          <Route path="/eligibility-status" element={<EligibilityStatusPage />} />
          <Route path="/all-scholarships" element={<AllScholarships />} />
          <Route path="/profile-documents" element={<ProfileDocuments />} />

          <Route path="/add-scholarships" element={<AddScholarships />} />
          <Route path="/students-details" element={<StudentsDetails />} />
          <Route path="/view-all-scholarships" element={<ViewScholarships />} />
          <Route path="/profile-details" element={<ProfileCollege />} />
          <Route path="/dashboard-college" element={<CollegeDashboardPage />} />


        </Routes>
        </main>
        <footer className="footer mt-auto py-3 bg-dark text-light">
        <div className="container text-center">
          <p className="mb-0">&copy; 2023 Scholarship Portal. All rights reserved.</p>
        </div>
      </footer>
      <ToastContainer position="top-right" />
      </div>
    </Router>
  );
}

export default App;
