import React from 'react';
import './Navbar.css'; // Import the dedicated CSS file

const Navbar = ({ setCurrentPage, userId, openUploadModal, currentPage }) => {
  const getDisplayUserId = (id) => {
    if (!id) return '';
    return id.length > 6 ? id.substring(0, 6) + '...' : id;
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo-container">
          <svg className="logo-icon" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 16l-8-4v-4l8 4 8-4v4l-8 4zm0 2l-8-4v-4l8 4 8-4v4l-8 4z" />
          </svg>
          <span>University</span>
        </div>
        <ul className="nav-links">
          <li><button onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'active-nav-link' : ''}>Home</button></li>
          <li><button onClick={() => setCurrentPage('ranking')} className={currentPage === 'ranking' ? 'active-nav-link' : ''}>Ranking</button></li>
          <li><button onClick={() => setCurrentPage('college')} className={currentPage === 'college' ? 'active-nav-link' : ''}>College</button></li>
          <li><button onClick={() => setCurrentPage('createTest')} className={currentPage === 'createTest' ? 'active-nav-link' : ''}>Create Test</button></li>
          <li><button onClick={() => setCurrentPage('liveClass')} className={currentPage === 'liveClass' ? 'active-nav-link' : ''}>Live Class</button></li>
          <li><button onClick={() => setCurrentPage('about')} className={currentPage === 'about' ? 'active-nav-link' : ''}>About</button></li>
        </ul>
      </div>
      <div className="nav-right">
        <button onClick={openUploadModal} className="upload-btn">
          <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="sr-only">Upload Document</span>
        </button>
        {userId && (
          <div className="profile-group">
            <div className="profile-circle">
              {userId.substring(0, 2).toUpperCase()}
            </div>
            <span className="display-user-id">
              {getDisplayUserId(userId)}
            </span>
            <span className="full-user-id">
              {userId}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;