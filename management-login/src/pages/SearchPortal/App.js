import React, { useState, useEffect } from 'react';
import Studentcard from './StudentCard';
import './App.css';
import SearchBar from './searchBar';
import StudentDashboard from './StudentDashboard';
import { useUsers } from '../../context/UserContext';

function SearchPortalApp() {
  const { users } = useUsers();
  const [students, setStudents] = useState([]);
  const [appliedBranch, setAppliedBranch] = useState('All');
  const [appliedYear, setAppliedYear] = useState('All');
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const studentUsers = users.filter(user => user.role === 'Student');
    setStudents(studentUsers);
  }, [users]);

  useEffect(() => {
    let filtered = students;
    if (appliedBranch !== 'All') {
      filtered = filtered.filter(student => student.department === appliedBranch);
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
  }, [students, appliedBranch, appliedYear, searchQuery]);

  const handleStudentCardClick = (student) => {
    setSelectedStudent(student);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
  };

  const handleApplyFilters = (branch, year) => {
    setAppliedBranch(branch);
    setAppliedYear(year);
  };

  const handleResetFilters = () => {
    setAppliedBranch('All');
    setAppliedYear('All');
    setSearchQuery('');
  };

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
