import React, { useState, useEffect } from 'react';
import Studentcard from './StudentCard';
import './App.css';
import SearchBar from './searchBar';
import StudentDashboard from './StudentDashboard';

function SearchPortalApp() {
  const [students, setStudents] = useState([]); // Data is now empty
  const [appliedBranch, setAppliedBranch] = useState('All');
  const [appliedYear, setAppliedYear] = useState('All');
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // In a real app, you might fetch this from an API or get it from parent state
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const studentUsers = users.filter(user => user.role === 'Student');
    setStudents(studentUsers);
  }, []);

  useEffect(() => {
    let filtered = students;
    if (appliedBranch !== 'All') {
      filtered = filtered.filter(student => student.branch === appliedBranch);
    }
    if (appliedYear !== 'All') {
      filtered = filtered.filter(student => student.year === appliedYear);
    }
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(lowerCaseQuery) ||
        (student.id && student.id.toLowerCase().includes(lowerCaseQuery))
      );
    }
    setSearchResults(filtered);
  }, [appliedBranch, appliedYear, searchQuery, students]);

  const handleResetFilters = () => {
    setAppliedBranch('All');
    setAppliedYear('All');
    setSearchQuery('');
  };

  const handleApplyFilters = (branch, year) => {
    setAppliedBranch(branch);
    setAppliedYear(year);
  };

  const handleStudentCardClick = (student) => {
    setSelectedStudent(student);
  }

  const handleBackToList = () => {
    setSelectedStudent(null);
  }

  return (
    <div className="search-portal-container">
      {selectedStudent ? (
        <StudentDashboard student={selectedStudent} onBackClick={handleBackToList} />
      ) : (
        <>
          <div className="main-content-search">
            <SearchBar
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              currentBranch={appliedBranch}
              currentYear={appliedYear}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <div className="student-grid">
              {searchResults.length > 0 ? (
                searchResults.map((student, index) => (
                  <Studentcard key={student.id || index} student={student} onClick={handleStudentCardClick} />
                ))
              ) : (
                <div className="no-results-message">
                  <p>No students found. Add students via the User Management section.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default SearchPortalApp;