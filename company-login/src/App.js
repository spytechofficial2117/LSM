import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RankingPage from './pages/RankingPage';
import CollegePage from './pages/CollegePage';
import CreateTestPage from './pages/CreateTestPage';
import LiveClassPage from './pages/LiveClassPage';
import AboutPage from './pages/AboutPage';
import UploadDocumentModal from './components/UploadDocumentModal';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userId, setUserId] = useState("demo-user-id");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const openUploadModal = () => setShowUploadModal(true);
  const closeUploadModal = () => setShowUploadModal(false);

  return (
    <div className="min-h-screen flex-col">
      {currentPage !== 'login' && <Navbar setCurrentPage={setCurrentPage} userId={userId} openUploadModal={openUploadModal} currentPage={currentPage} />}
      <main>
        {currentPage === 'login' && <LoginPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
        {currentPage === 'ranking' && <RankingPage />}
        {currentPage === 'college' && <CollegePage />}
        {currentPage === 'createTest' && <CreateTestPage />}
        {currentPage === 'liveClass' && <LiveClassPage />}
        {currentPage === 'about' && <AboutPage />}
        {showUploadModal && <UploadDocumentModal showModal={showUploadModal} closeModal={closeUploadModal} />}
      </main>
    </div>
  );
}

export default App;