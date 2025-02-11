// StudentsDetails.js
import React, { useEffect, useState } from "react";
import { ref, onValue, update, get } from "firebase/database";
import { database } from "../firebase";
import Cookies from "js-cookie";
import { motion,AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaFile,
  FaMedal,
  FaComment,
  FaDownload,
  FaTimes,
  FaInfoCircle
} from "react-icons/fa";
import "../StudentsDetails.css";
import DashboardHeading from "./DashboardHeading";

const StudentsDetails = () => {
  const [students, setStudents] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const collegeCode = Cookies.get("collegeCenterCode");
  const [userDetails, setUserDetails] = useState({});


  const [studentDocuments, setStudentDocuments] = useState({});
  const [selectedScholarships, setSelectedScholarships] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    setLoading(true);
    // First useEffect code for fetching students
    const studentsRef = ref(database, `ScholarshipPortalDashboard/users`);
    const unsubscribeStudents = onValue(studentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const studentsList = Object.values(data).filter(
          (user) =>
            user.userType === "student" &&
            user.collegeCenterCode === collegeCode
        );
        setStudents(studentsList);
      }
    });

    return () => unsubscribeStudents();
  }, [collegeCode]);

  useEffect(() => {
    setLoading(true);
    // Fetch students with their comments and eligible scholarships
    const studentsRef = ref(database, `ScholarshipPortalDashboard/users`);
    const unsubscribeStudents = onValue(studentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const studentsList = Object.values(data).filter(
          (user) =>
            user.userType === "student" &&
            user.collegeCenterCode === collegeCode
        );
        
        // Initialize comments and selectedScholarships from fetched data
        const initialComments = {};
        const initialScholarships = {};
        
        studentsList.forEach(student => {
          initialComments[student.phoneNumber] = student.collegeComment || '';
          initialScholarships[student.phoneNumber] = student.eligibleScholarships || [];
        });

        setStudents(studentsList);
        setComments(initialComments);
        setSelectedScholarships(initialScholarships);
      }
      setLoading(false);
    });

    return () => unsubscribeStudents();
  }, [collegeCode]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        // Create a map to store all document fetch promises
        const documentPromises = students.map(async (student) => {
          const docsRef = ref(database, `userDocuments/${student.phoneNumber}`); // Fixed template literal
          const snapshot = await get(docsRef);
          if (snapshot.exists() && isMounted) {
            return { [student.phoneNumber]: snapshot.val() };
          }
          return null;
        });

        // Wait for all document fetches to complete
        const documents = await Promise.all(documentPromises);
        if (isMounted) {
          const documentMap = documents.reduce(
            (acc, doc) => ({
              ...acc,
              ...(doc || {}),
            }),
            {}
          );
          setStudentDocuments(documentMap);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    // Fetch scholarships
    const scholarshipsRef = ref(database, `scholarships/${collegeCode}`);
    const unsubscribeScholarships = onValue(scholarshipsRef, (snapshot) => {
      if (snapshot.exists() && isMounted) {
        const data = snapshot.val();
        setScholarships(Object.values(data));
      }
      setLoading(false);
    });

    if (students.length > 0) {
      fetchData();
    }

    return () => {
      isMounted = false;
      unsubscribeScholarships();
    };
  }, [collegeCode, students]);

  const handleUpdateEligibility = async (phoneNumber) => {
    try {
      const studentRef = ref(
        database,
        `ScholarshipPortalDashboard/users/${phoneNumber}`
      );
      await update(studentRef, {
        eligibleScholarships: selectedScholarships[phoneNumber] || [],
      });
      alert("Scholarships updated successfully!");
    } catch (error) {
      console.error("Error updating eligibility:", error);
      alert("Failed to update scholarships. Please try again.");
    }
  };

  const handleUpdateComment = async (phoneNumber) => {
    try {
      const studentRef = ref(
        database,
        `ScholarshipPortalDashboard/users/${phoneNumber}`
      );
      await update(studentRef, {
        collegeComment: comments[phoneNumber] || "",
      });
      alert("Comment updated successfully!");
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment. Please try again.");
    }
  };

  const handleDocumentDownload = async (url, docName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = docName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download document. Please try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

    // Student Details Modal Component
    const StudentDetailsModal = ({ student }) => {
      if (!student) return null;
  
      return (
        <AnimatePresence>
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="modal-header">
                <h4>Student Details</h4>
                <button 
                  className="close-button"
                  onClick={() => setSelectedStudent(null)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <div className="student-info-grid">
                  <div className="info-item">
                    <FaUser className="icon" />
                    <div>
                      <h6>Name</h6>
                      <p>{student.name}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaEnvelope className="icon" />
                    <div>
                      <h6>Email</h6>
                      <p>{student.email}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaPhone className="icon" />
                    <div>
                      <h6>Phone</h6>
                      <p>{student.phoneNumber}</p>
                    </div>
                  </div>
                  {/* Add more student details as needed */}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      );
    };

  return (
    <>
      <DashboardHeading text="Students Details" />
      <motion.div
        className="container mt-4 students-details"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {students.map((student, index) => (
          <motion.div
            key={student.email}
            className="card mb-4 student-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            style={{ marginTop: "155px" }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="card-header bg-primary text-white">
            <h5 
            className="card-title mb-0 d-flex align-items-center justify-content-between"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedStudent(student)}
          >
            <span>
              <FaUser className="me-2" />
              {student.name}
            </span>
            <FaInfoCircle />
          </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <h6>
                    <FaFile className="me-2" />
                    Documents
                  </h6>
                  <div className="documents-container">
                    {studentDocuments[student.phoneNumber] &&
                      Object.entries(studentDocuments[student.phoneNumber]).map(
                        ([docName, doc]) => (
                          <div
                            key={docName}
                            className="document-item p-2 border rounded mb-2"
                          >
                            <span>{docName}</span>
                            <div className="btn-group float-end">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() =>
                                  handleDocumentDownload(doc.url, docName)
                                }
                              >
                                <FaDownload /> Download
                              </button>
                              <a
                                className="btn btn-sm btn-secondary"
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View
                              </a>
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>

                {/* Scholarships Section */}
                <div className="col-md-6">
                  <div className="scholarship-selection mb-4">
                    <h6>
                      <FaMedal className="me-2" />
                      Eligible Scholarships
                    </h6>
                    <div className="scholarship-list border rounded p-3">
                      {scholarships.map((scholarship) => (
                        <div key={scholarship.id} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`scholarship-${scholarship.id}-${student.phoneNumber}`}
                            checked={selectedScholarships[
                              student.phoneNumber
                            ]?.includes(scholarship.id)}
                            onChange={(e) => {
                              const current =
                                selectedScholarships[student.phoneNumber] || [];
                              setSelectedScholarships({
                                ...selectedScholarships,
                                [student.phoneNumber]: e.target.checked
                                  ? [...current, scholarship.id]
                                  : current.filter(
                                      (id) => id !== scholarship.id
                                    ),
                              });
                            }}
                          />
                          <label className="form-check-label">
                            {scholarship.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() =>
                        handleUpdateEligibility(student.phoneNumber)
                      }
                    >
                      Update Scholarships
                    </button>
                  </div>

                  {/* Comments Section */}
                  <div className="comments-section">
                    <h6>
                      <FaComment className="me-2" />
                      Comments
                    </h6>
                    <textarea
                      className="form-control mb-2"
                      rows="3"
                      value={comments[student.phoneNumber] || ""}
                      onChange={(e) =>
                        setComments({
                          ...comments,
                          [student.phoneNumber]: e.target.value,
                        })
                      }
                      placeholder="Add your comments here..."
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleUpdateComment(student.phoneNumber)}
                    >
                      Update Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

         {selectedStudent && (
          <StudentDetailsModal student={selectedStudent} />
        )}

        {students.length === 0 && (
          <div className="alert alert-info text-center">
            No students found for your college.
          </div>
        )}
      </motion.div>
    </>
  );
};

export default StudentsDetails;
