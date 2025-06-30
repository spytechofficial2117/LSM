import React, { useState } from 'react';
import './RankingPage.css'; // Import the dedicated CSS file

const RankingPage = () => {
  const allStudents = [
    { id: 'r1', rank: 1, name: "Sophia Ramirez", university: "Stanford University", score: 98, createdAt: "2023-01-15" },
    { id: 'r2', rank: 2, name: "Liam Carter", university: "Harvard University", score: 97, createdAt: "2023-02-20" },
    { id: 'r3', rank: 3, name: "Ava Bennett", university: "MIT", score: 96, createdAt: "2023-03-10" },
    { id: 'r4', rank: 4, name: "Ethan Parker", university: "Caltech", score: 95, createdAt: "2023-04-05" },
    { id: 'r5', name: "Olivia Turner", university: "Princeton University", score: 94, createdAt: "2023-05-25" },
    { id: 'r6', name: "Noah Walker", university: "University of Chicago", score: 93, createdAt: "2024-01-01" },
    { id: 'r7', name: "Isabella Hayes", university: "Yale University", score: 92, createdAt: "2024-02-14" },
    { id: 'r8', name: "Henry Cole", university: "Columbia University", score: 91, createdAt: "2024-03-22" },
    { id: 'r9', name: "Mia Lewis", university: "Oxford University", score: 90, createdAt: "2024-04-30" },
    { id: 'r10', name: "James King", university: "Cambridge University", score: 89, createdAt: "2024-05-18" },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [subjectArea, setSubjectArea] = useState('All');

  const subjectAreas = ["All", "Mathematics", "Physics", "Chemistry", "Computer Science", "Biology"];
  const currentYear = new Date().getFullYear();
  const years = ['All'];
  for (let i = 2000; i <= currentYear + 5; i++) {
    years.push(i.toString());
  }

  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.university.toLowerCase().includes(searchTerm.toLowerCase());

    const studentYear = new Date(student.createdAt).getFullYear().toString();
    
    let matchesYear = true;
    if (selectedYear !== 'All') {
      const selected = parseInt(selectedYear, 10);
      const current = new Date().getFullYear();
      
      if (selected > current) {
        return false;
      }
      matchesYear = studentYear === selectedYear;
    }
    
    const matchesSubjectArea = subjectArea === "All" || true; // Placeholder for actual subject area filtering
    return matchesSearch && matchesYear && matchesSubjectArea;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedYear('All');
    setSubjectArea('All');
  };

  return (
    <div className="ranking-page">
      <div className="ranking-container">
        <div className="filters-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search by student name or university"
              className="input-field search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">
              <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          <div className="filter-dropdowns">
            <div className="select-wrapper filter-dropdown-wrapper">
              <select
                  className="input-field"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  title="Select Year"
              >
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
              <span className="select-arrow">
                <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            <div className="select-wrapper filter-dropdown-wrapper">
              <select className="input-field" value={subjectArea} onChange={(e) => setSubjectArea(e.target.value)}>
                {subjectAreas.map(subject => <option key={subject} value={subject}>{subject}</option>)}
              </select>
              <span className="select-arrow">
                <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            <button onClick={handleResetFilters} className="btn-secondary reset-btn">Reset Filters</button>
          </div>
        </div>

        <div className="ranking-table-container">
          {filteredStudents.length === 0 ? (
            <p className="no-data-message">No students found matching your criteria.</p>
          ) : (
            <table className="ranking-table">
              <thead><tr>
                  <th>Rank</th>
                  <th>Student Name</th>
                  <th>University</th>
                  <th>Total Score</th>
                  <th>Created At</th>
                </tr></thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.rank}</td>
                    <td>{student.name}</td>
                    <td>{student.university}</td>
                    <td>{student.score}</td>
                    <td>{student.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingPage;