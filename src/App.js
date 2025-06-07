import Studentcard from './StudentCard';
import './App.css';
import Header from './header';
import SearchBar from './searchBar';
import maleprofile from './assets/images/male-profile.jpg';
import './StudentCard.css'
function App() {
  const students=[
    {
      id: '001',name: 'james', branch:'ECE',year :'3rd year',
      rank: '#1', imageUrl: maleprofile
    },
    {}, {}, {}, {}, {}, {}, {}, {}
  ];
  return (
    <div className="app-container">
      <Header />
      <h1 className='portal-title'>Student Search Portal</h1>
      <div className="main-content">
        <SearchBar />
        <div className="student-grid">
          {students.map((student,index)=>(
            <Studentcard key={index} student={student}/>
          ))
          }
        </div>
      </div>
      </div>
  );
}
export default App;
