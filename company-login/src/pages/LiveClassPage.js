import React, { useState } from 'react';
import CustomAlertDialog from '../components/CustomAlertDialog';
import './LiveClassPage.css'; // Import the dedicated CSS file

const LiveClassPage = () => {
  const [upcomingClasses, setUpcomingClasses] = useState([
    { id: 'lc1', name: "Introduction to AI", dateTime: new Date(Date.now() + 86400000).toISOString(), duration: "1 hr", status: "Upcoming" },
    { id: 'lc2', name: "Advanced Calculus", dateTime: new Date(Date.now() + 5 * 86400000).toISOString(), duration: "1.5 hr", status: "Upcoming" },
    { id: 'lc3', name: "Web Development Basics", dateTime: new Date(Date.now() - 2 * 86400000).toISOString(), duration: "2 hr", status: "Completed" },
  ]);
  const [alertConfig, setAlertConfig] = useState(null);

  const handleLiveClassAction = (action, classId, className) => {
    setAlertConfig({
      message: `${action} for ${className} (ID: ${classId}) will be initiated. (Simulated action)`,
      type: 'alert',
      onConfirm: () => setAlertConfig(null)
    });
  };

  const now = Date.now();
  const filteredUpcomingClasses = upcomingClasses.filter(cls => new Date(cls.dateTime).getTime() > now)
                                                 .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());


  return (
    <div className="live-class-page">
      <div className="live-class-container">
        <h2 className="live-class-title">Upcoming class</h2>

        {filteredUpcomingClasses.length === 0 ? (
          <p className="no-classes-message">No upcoming classes scheduled.</p>
        ) : (
          <>
            {filteredUpcomingClasses[0] && (
              <div className="upcoming-class-card">
                <h3 className="upcoming-class-header">This meeting is going live: {filteredUpcomingClasses[0].name}</h3>
                <p className="upcoming-class-details">
                  {new Date(filteredUpcomingClasses[0].dateTime).toLocaleString()} ({filteredUpcomingClasses[0].duration})
                </p>
                <div className="upcoming-class-actions">
                  <button onClick={() => handleLiveClassAction('Live class', filteredUpcomingClasses[0].id, filteredUpcomingClasses[0].name)} className="btn-primary">Live class</button>
                  <button onClick={() => handleLiveClassAction('Record', filteredUpcomingClasses[0].id, filteredUpcomingClasses[0].name)} className="btn-secondary">Record</button>
                </div>
              </div>
            )}

            {filteredUpcomingClasses.length > 1 && (
              <div className="other-classes-section">
                <h3 className="other-classes-title">Other Scheduled Classes</h3>
                <ul className="other-classes-list">
                  {filteredUpcomingClasses.slice(1).map(cls => (
                    <li key={cls.id} className="other-class-item">
                      <span className="other-class-name">{cls.name} - {new Date(cls.dateTime).toLocaleString()}</span>
                      <button onClick={() => handleLiveClassAction('View Details', cls.id, cls.name)} className="btn-secondary other-class-details-button">View Details</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
      {alertConfig && (
        <CustomAlertDialog
          message={alertConfig.message}
          type={alertConfig.type}
          onConfirm={alertConfig.onConfirm}
        />
      )}
    </div>
  );
};

export default LiveClassPage;