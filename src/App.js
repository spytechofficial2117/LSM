import React, {useState, useEffect} from 'react';
import Studentcard from './StudentCard';
import './App.css';
import Header from './header';
import SearchBar from './searchBar';
import maleprofile from './assets/images/male-profile.jpg';
import './StudentCard.css';
import './FilterPanel.css';
import StudentDashboard from './StudentDashboardcom';
import './StudentDashboard.css';

const students=[
  {
    id: '001',name: 'james', branch:'ECE',year :'3rd year',
    rank: '#1', imageUrl: maleprofile
  },
  {id : '009', name: 'jose', branch: 'EEE',year: '4th year',
    rank:'#3',imageUrl:maleprofile
  }, 
  { id: '003', name: 'Bob', branch: 'MECH', year: '4th year',
     rank: '#3', imageUrl: maleprofile 
  },

   { id: '005', name: 'Diana', branch: 'CSE', year: '1st year', 
    rank: '#5', imageUrl: maleprofile},

   {id:'123', name:'ramesh' , branch:'CSE', year:'2nd year',
      rank: '#10', imageUrl:maleprofile},
    {id: '021', name: 'Harry', branch: 'CSE', year: '4th year', 
        rank: '#9', imageUrl: maleprofile}, 
    { id: '008', name: 'Grace', branch: 'ECE', year: '1st year',
     rank: '#8', imageUrl: maleprofile}, 
     {id: '007', name: 'Frank', branch: 'MECH', year: '3rd year',
       rank: '#7', imageUrl: maleprofile },
     {id: '002', name: 'Alice', branch: 'CSE', year: '2nd year', rank: '#2', imageUrl: maleprofile }
];

function App() {
  const [appliedBranch, setAppliedBranch]= useState('All');
  const [appliedYear, setAppliedYear]= useState('All');
  const [searchResults, setSearchResults]=useState([]);
  const [searchQuery, setSearchQuery]= useState('');

  const [selectedStudent, setselectedStudent]= useState(null);

  useEffect(()=>{
    let filtered= students;
    if(appliedBranch !== 'All'){
      filtered = filtered.filter(student => student.branch === appliedBranch);
    }
    if(appliedYear !== 'All'){
      filtered = filtered.filter(student => student.year === appliedYear);
    }
    if(searchQuery){
      const lowerCaseQuery= searchQuery.toLowerCase();
      filtered=filtered.filter(student => 
                student.name.toLowerCase().includes(lowerCaseQuery) ||
                student.id.toLowerCase().includes(lowerCaseQuery)
      );
    }
   setSearchResults(filtered);
 } , [appliedBranch, appliedYear , searchQuery]);

 const handleresetFilters= ()=> {
        setAppliedBranch('All');
        setAppliedYear('All');
        setSearchQuery('');
};
const handleApplyFilters= (branch, year)=>{
  setAppliedBranch(branch);
  setAppliedYear(year);
};

const handleStudentCardClick= (student)=> {
  setselectedStudent(student);
}

const handleBackToList =() =>{
  setselectedStudent(null);
}

  return (
    <div className="app-container">
      {selectedStudent ? (
        <>
        <button onClick={handleBackToList} className='back-button'>
          &larr;
        </button>
        <StudentDashboard />
        </>
      ): (
        <>
        <Header />
      <h1 className='portal-title'>Student Search Portal</h1>
      <div className="main-content">
        <SearchBar 
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleresetFilters}
        currentBranch={appliedBranch}
        currentYear={appliedYear}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        />
        <div className="student-grid">
          { searchResults.length >0 ? (
             searchResults.map((student,index)=>(
            <Studentcard key={student.id || index} student={student} onClick={handleStudentCardClick}/>
          ))
        ):(
          <div className="no-results-message">
            <p>No students found matching the applied filters.</p>
          </div>
        )}
        </div>
      </div>
      </>
      )}
      </div>
  );
}
export default App;
