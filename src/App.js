import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import AboutUsPage from './components/AboutUsPage';
import ContactUsPage from './components/ContactUsPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import CustomNavbar from './components/CustomNavbar';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <CustomNavbar></CustomNavbar>
        <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        </main>
        <footer className="footer mt-auto py-3 bg-dark text-light">
        <div className="container text-center">
          <p className="mb-0">&copy; 2023 Scholarship Portal. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </Router>
  );
}

export default App;
