import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './CollegePage.css'; // Import the dedicated CSS file

const CollegePage = () => {
  const allStudents = useMemo(() =>[
    { id: 's1', name: "John Doe", college: "Example University", department: "Computer Science", year: "3rd Year", section: "A" },
    { id: 's2', name: "Jane Smith", college: "Another College", department: "Electrical Engineering", year: "2nd Year", section: "B" },
    { id: 's3', name: "Peter Jones", college: "Example University", department: "Computer Science", year: "4th Year", section: "C" },
    { id: 's4', name: "Alice Brown", college: "State College", department: "Mechanical Engineering", year: "1st Year", section: "A" },
    { id: 's5', name: "Bob White", college: "Example University", department: "Civil Engineering", year: "3rd Year", section: "B" },
  ], []);

  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('Select department');
  const [year, setYear] = useState('Select year');
  const [section, setSection] = useState('Select section');
  const [students, setStudents] = useState(allStudents);

  const departments = ["Select department", "Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"];
  const years = ["Select year", "1st Year", "2nd Year", "3rd Year", "4th Year"];
  const sections = ["Select section", "A", "B", "C"];

  const handleApplyFilters = useCallback(() => {
    let filteredStudents = allStudents.filter(student => {
      const matchesSearchTerm = searchTerm ? 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.college.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesDepartment = department && department !== "Select department" ? student.department === department : true;
      const matchesYear = year && year !== "Select year" ? student.year === year : true;
      const matchesSection = section && section !== "Select section" ? student.section === section : true;
      return matchesSearchTerm && matchesDepartment && matchesYear && matchesSection;
    });
    setStudents(filteredStudents);
  }, [searchTerm, department, year, section, allStudents]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDepartment('Select department');
    setYear('Select year');
    setSection('Select section');
    setStudents(allStudents); 
  };

  useEffect(() => {
    handleApplyFilters();
  }, [handleApplyFilters]);

  return (
    <div className="college-page">
      <div className="college-container">
        <h2 className="college-title">Search students by name or ID</h2>

        <div className="filter-grid">
          <div className="form-field">
            <label htmlFor="collegeName" className="form-label">Search</label>
            <input
              type="text"
              id="collegeName"
              className="input-field"
              placeholder="Student name, ID or college"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="select-wrapper form-field">
            <label htmlFor="department" className="form-label">Department</label>
            <select
              id="department"
              className="input-field"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
              <span className="select-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>

          </div>
          <div className="select-wrapper form-field">
            <label htmlFor="year" className="form-label">Year</label>
            <select
              id="year"
              className="input-field"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          <span className="select-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>

          </div>
          <div className="select-wrapper form-field">
            <label htmlFor="section" className="form-label">Section</label>
            <select
              id="section"
              className="input-field"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              {sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
            </select>
            <span className="select-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>

          </div>
        </div>

        <div className="filter-buttons">
          <button onClick={handleResetFilters} className="btn-secondary">Reset</button>
          <button onClick={handleApplyFilters} className="btn-primary">Apply</button>
        </div>

        {students.length === 0 ? (
          <p className="no-results-message">No students found matching your criteria.</p>
        ) : (
          <div className="search-results-section">
            <h3 className="results-title">Search Results</h3>
            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>College</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>Section</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.college}</td>
                      <td>{student.department}</td>
                      <td>{student.year}</td>
                      <td>{student.section}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegePage;