import React from 'react';
import './HomePage.css'; // Import the dedicated CSS file

const HomePage = ({ setCurrentPage }) => {
  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="home-title">Grow your institution with us</h1>
        <button onClick={() => setCurrentPage('about')} className="btn-primary">GET IN TOUCH</button>
      </div>
    </div>
  );
};

export default HomePage;