import React, { useState, useEffect, useCallback } from 'react';
import CustomAlertDialog from '../components/CustomAlertDialog';
import './LiveClassPage.css';

const LiveClassPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [manualRecordingId, setManualRecordingId] = useState(null);
  const [newMeetingName, setNewMeetingName] = useState('');
  const [newMeetingDate, setNewMeetingDate] = useState('');
  const [newMeetingTime, setNewMeetingTime] = useState('');
  const [newMeetingPlatform, setNewMeetingPlatform] = useState('Google Meet');
  const [newMeetingShouldRecord, setNewMeetingShouldRecord] = useState('no');
  const [scheduledMeetingLink, setScheduledMeetingLink] = useState(null);
  const [scheduledMeetingMessage, setScheduledMeetingMessage] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('All Subjects');
  const [filterDateRange, setFilterDateRange] = useState('All Dates');

  const [allClasses, setAllClasses] = useState([
    { id: 'lc1', name: "Introduction to AI", dateTime: new Date(Date.now() + 86400000).toISOString(), duration: "1 hr", status: "Upcoming", liveLink: "https://example.com/dummy-video-link", shouldRecord: false, platform: 'Google Meet' },
    { id: 'lc2', name: "Advanced Calculus", dateTime: new Date(Date.now() + 5 * 86400000).toISOString(), duration: "1.5 hr", status: "Upcoming", liveLink: "https://example.com/dummy-video-link", shouldRecord: true, platform: 'Google Meet' },
    { id: 'lc3', name: "Web Development Basics", dateTime: new Date(Date.now() - 2 * 86400000).toISOString(), duration: "2 hr", status: "Completed", recordedLink: "https://example.com/dummy-recorded-link", shouldRecord: true, platform: 'Google Meet' },
    { id: 'lc4', name: "Data Structures & Algorithms", dateTime: new Date(Date.now() + 2 * 86400000).toISOString(), duration: "1 hr 15 min", status: "Upcoming", liveLink: "https://example.com/dummy-video-link", platform: 'Zoom' },
    { id: 'lc5', name: "Machine Learning Fundamentals", dateTime: new Date(Date.now() + 10 * 86400000).toISOString(), duration: "2 hr", status: "Upcoming", liveLink: "https://example.com/dummy-video-link", shouldRecord: true, platform: 'Google Meet' },
    { id: 'lc6', name: "Cybersecurity Essentials", dateTime: new Date(Date.now() - 5 * 86400000).toISOString(), duration: "1 hr", status: "Completed", shouldRecord: false, platform: 'Google Meet' },
    { id: 'lc7', name: "Active Session 1", dateTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), duration: "1 hr", status: "Ongoing", liveLink: "https://example.com/dummy-video-link", shouldRecord: false, platform: 'Google Meet' },
    { id: 'lc8', name: "Active Session 2 (Recorded)", dateTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), duration: "45 min", status: "Ongoing", liveLink: "https://example.com/dummy-video-link", shouldRecord: true, platform: 'Zoom' },
    { id: 'lc9', name: "Python Programming Intro", dateTime: new Date(Date.now() - 15 * 86400000).toISOString(), duration: "1.5 hr", status: "Completed", recordedLink: "https://example.com/dummy-recorded-link", shouldRecord: true, platform: 'Google Meet' },
  ]);

  const [alertConfig, setAlertConfig] = useState(null);

  const parseDurationToMillis = (durationStr) => {
    let totalMillis = 0;
    const parts = durationStr.split(' ');
    for (let i = 0; i < parts.length; i++) {
      const value = parseFloat(parts[i]);
      if (isNaN(value)) continue;
      const unit = parts[i + 1] || '';
      if (unit.toLowerCase().startsWith('hr')) {
        totalMillis += value * 60 * 60 * 1000;
        i++;
      } else if (unit.toLowerCase().startsWith('min')) {
        totalMillis += value * 60 * 1000;
        i++;
      }
    }
    return totalMillis;
  };

  // Ensure this function is memoized and correctly updates statuses
  const getFilteredClasses = useCallback(() => {
    const now = Date.now();
    let updatedClasses = allClasses.map(cls => {
      const classStartTime = new Date(cls.dateTime).getTime();
      const classDurationMillis = parseDurationToMillis(cls.duration);
      const actualClassDuration = classDurationMillis > 0 ? classDurationMillis : 60 * 60 * 1000;
      const classEndTime = classStartTime + actualClassDuration;

      let newStatus = cls.status;
      if (now < classStartTime) {
        newStatus = "Upcoming";
      } else if (now >= classStartTime && now < classEndTime) {
        newStatus = "Ongoing";
      } else {
        newStatus = "Completed";
      }
      return { ...cls, status: newStatus };
    });
    return updatedClasses;
  }, [allClasses]); // `allClasses` is correctly a dependency here

  // Use a state to hold the actively filtered and sorted classes
  const [displayClasses, setDisplayClasses] = useState([]);

  useEffect(() => {
    // This effect will run whenever allClasses changes, or on initial mount
    setDisplayClasses(getFilteredClasses());
    // In a real application, you might use a setInterval to periodically update statuses
    // const interval = setInterval(() => {
    //   setDisplayClasses(getFilteredClasses());
    // }, 60 * 1000); // Update every minute

    // return () => clearInterval(interval); // Clear interval on unmount
  }, [allClasses, getFilteredClasses]); // Both are dependencies now

  // Filter based on `displayClasses` which is always up-to-date
  const ongoingClasses = displayClasses
    .filter(cls => cls.status === "Ongoing")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const mainLiveClass = ongoingClasses.length > 0 ? ongoingClasses[0] : null;
  const otherLiveClasses = ongoingClasses.slice(1);

  const upcomingClasses = displayClasses
    .filter(cls => cls.status === "Upcoming")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const isClassCurrentlyRecording = useCallback((clsId) => {
    const classObject = displayClasses.find(c => c.id === clsId); // Use displayClasses for current status
    const isOngoing = ongoingClasses.some(c => c.id === clsId);
    return (manualRecordingId === clsId) || (classObject?.shouldRecord && isOngoing);
  }, [displayClasses, ongoingClasses, manualRecordingId]);

  const rawRecordedClasses = displayClasses
    .filter(cls => cls.status === "Completed" && cls.shouldRecord && cls.recordedLink);

  const getFilteredRecordedClasses = () => {
    let filtered = rawRecordedClasses;
    if (searchQuery) {
      filtered = filtered.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterSubject !== 'All Subjects') {
      filtered = filtered.filter(cls => cls.name.toLowerCase().includes(filterSubject.toLowerCase()));
    }
    if (filterDateRange !== 'All Dates') {
      const now = Date.now();
      filtered = filtered.filter(cls => {
        const classTime = new Date(cls.dateTime).getTime();
        switch (filterDateRange) {
          case 'Last 7 Days': return (now - classTime) <= (7 * 24 * 60 * 60 * 1000);
          case 'Last 30 Days': return (now - classTime) <= (30 * 24 * 60 * 60 * 1000);
          default: return true;
        }
      });
    }
    return filtered.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  };

  const recordedClasses = getFilteredRecordedClasses();

  const handleLiveClassAction = (action, classId, className, link = null) => {
    let message = '';
    if (action === 'Join Live' && link) {
      message = `Attempting to join live class: "${className}". This will open in a new window/tab.`;
      window.open(link, '_blank');
    } else if (action === 'Record') {
      const classToRecord = allClasses.find(c => c.id === classId);
      const isOngoing = ongoingClasses.some(c => c.id === classId);

      if (classToRecord?.shouldRecord && isOngoing) {
        message = `This session ("${className}") is already being automatically recorded.`;
      } else if (manualRecordingId === classId) {
        setManualRecordingId(null);
        message = `Recording for "${className}" has been stopped.`;
      } else if (manualRecordingId) {
        const currentlyRecordingClass = allClasses.find(c => c.id === manualRecordingId);
        message = `Already manually recording "${currentlyRecordingClass?.name || 'another session'}". Please stop the current recording first to record "${className}".`;
      } else {
        setManualRecordingId(classId);
        message = `Recording for "${className}" has started. (Simulated action)`;
      }
    } else if (action === 'Watch Recording' && link) {
      message = `Opening recorded session for "${className}".`;
      window.open(link, '_blank');
    } else {
      message = `${action} for "${className}" (ID: ${classId}) will be initiated. (Simulated action)`;
    }

    setAlertConfig({
      message: message,
      type: 'alert',
      onConfirm: () => setAlertConfig(null)
    });
  };

  const handleScheduleMeeting = (e) => {
    e.preventDefault();

    if (!newMeetingName || !newMeetingDate || !newMeetingTime || !newMeetingPlatform) {
      setAlertConfig({
        message: 'Please fill in all fields to schedule a meeting.',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
      return;
    }

    const meetingDateTime = new Date(`${newMeetingDate}T${newMeetingTime}`);
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    if (isNaN(meetingDateTime.getTime()) || meetingDateTime.getTime() < fiveMinutesAgo) {
      setAlertConfig({
        message: 'Please select a valid date and time. For instant live, select current time or a time in the very recent past (within 5 minutes).',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
      return;
    }

    let generatedLink = '';
    let linkMessage = '';
    const actualLiveLink = 'https://example.com/dummy-video-link'; // Dummy link
    const recordedLink = 'https://example.com/dummy-recorded-link'; // Dummy link

    if (newMeetingPlatform === 'Google Meet') {
      const eventTitle = encodeURIComponent(newMeetingName);
      const startIso = meetingDateTime.toISOString().replace(/[-:]|\.\d{3}/g, '').substring(0, 15) + 'Z';
      const endIso = new Date(meetingDateTime.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]|\.\d{3}/g, '').substring(0, 15) + 'Z';

      generatedLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startIso}/${endIso}&details=Join your Google Meet session here: ${encodeURIComponent(actualLiveLink)}&sf=true&output=xml`;
      linkMessage = `Click to add to Google Calendar. The meeting link will be in the calendar event.`;
    } else if (newMeetingPlatform === 'Zoom') {
      generatedLink = actualLiveLink;
      linkMessage = `Your Zoom meeting has been simulated. Actual Zoom scheduling needs to be done via Zoom's platform.`;
    }

    const newMeeting = {
      id: `lc-${Date.now()}`,
      name: newMeetingName,
      dateTime: meetingDateTime.toISOString(),
      duration: "1 hr",
      // **IMPORTANT CHANGE HERE**: Explicitly set the status of the new meeting based on time.
      status: meetingDateTime.getTime() < now ? "Ongoing" : "Upcoming",
      liveLink: actualLiveLink,
      platform: newMeetingPlatform,
      shouldRecord: newMeetingShouldRecord === 'yes',
      recordedLink: newMeetingShouldRecord === 'yes' ? recordedLink : null,
    };

    // Update allClasses. This will trigger the useEffect to re-filter displayClasses.
    setAllClasses(prevClasses => [...prevClasses, newMeeting]);

    setAlertConfig({
      message: `Meeting "${newMeetingName}" scheduled successfully for ${newMeetingPlatform}!`,
      type: 'alert',
      onConfirm: () => setAlertConfig(null)
    });

    setScheduledMeetingLink(generatedLink);
    setScheduledMeetingMessage(linkMessage);
    setTimeout(() => {
      setScheduledMeetingLink(null);
      setScheduledMeetingMessage(null);
    }, 15000);

    setNewMeetingName('');
    setNewMeetingDate('');
    setNewMeetingTime('');
    setNewMeetingPlatform('Google Meet');
    setNewMeetingShouldRecord('no');
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      setAlertConfig({
        message: 'Meeting link copied to clipboard!',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setAlertConfig({
        message: 'Failed to copy link. Please copy manually.',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
    });
  };

  const isRecordButtonDisabled = (clsId) => {
    const classObject = displayClasses.find(c => c.id === clsId); // Use displayClasses
    const isOngoing = ongoingClasses.some(c => c.id === clsId);
    return (classObject?.shouldRecord && isOngoing) || (manualRecordingId && manualRecordingId !== clsId);
  };

  const getRecordButtonText = (clsId) => {
    const classObject = displayClasses.find(c => c.id === clsId); // Use displayClasses
    const isOngoing = ongoingClasses.some(c => c.id === clsId);
    if (classObject?.shouldRecord && isOngoing) {
      return "Recording (Auto)";
    }
    return manualRecordingId === clsId ? 'Stop Recording' : 'Record';
  };

  return (
    <div className="live-class-page">
      <div className="live-class-container">
        <div className="tab-navigation">
          <div
            className={`tab-item ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Class
          </div>
          <div
            className={`tab-item ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            Live Class
          </div>
          <div
            className={`tab-item ${activeTab === 'recordings' ? 'active' : ''}`}
            onClick={() => setActiveTab('recordings')}
          >
            Recordings
          </div>
        </div>

        {activeTab === 'upcoming' && (
          <>
            <h2 className="live-class-title">Schedule a New Meeting</h2>
            <div className="schedule-meeting-section">
              <form onSubmit={handleScheduleMeeting} className="schedule-form-grid">
                <div className="form-group">
                  <label htmlFor="meetingName" className="form-label">Meeting Name</label>
                  <input
                    type="text"
                    id="meetingName"
                    className="input-field"
                    placeholder="e.g., Project Discussion"
                    value={newMeetingName}
                    onChange={(e) => setNewMeetingName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="meetingDate" className="form-label">Date</label>
                  <input
                    type="date"
                    id="meetingDate"
                    className="input-field"
                    value={newMeetingDate}
                    onChange={(e) => setNewMeetingDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="meetingTime" className="form-label">Time</label>
                  <input
                    type="time"
                    id="meetingTime"
                    className="input-field"
                    value={newMeetingTime}
                    onChange={(e) => setNewMeetingTime(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="meetingPlatform" className="form-label">Platform</label>
                  <div className="select-wrapper">
                    <select
                      id="meetingPlatform"
                      className="input-field"
                      value={newMeetingPlatform}
                      onChange={(e) => setNewMeetingPlatform(e.target.value)}
                      required
                    >
                      <option value="Google Meet">Google Meet</option>
                      <option value="Zoom">Zoom</option>
                    </select>
                    <span className="select-arrow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="recordSession" className="form-label">Record Session?</label>
                  <div className="select-wrapper">
                    <select
                      id="recordSession"
                      className="input-field"
                      value={newMeetingShouldRecord}
                      onChange={(e) => setNewMeetingShouldRecord(e.target.value)}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                    <span className="select-arrow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="schedule-button-container">
                  <button type="submit" className="btn-primary">Schedule Meeting</button>
                </div>
              </form>
              {scheduledMeetingLink && (
                <div className="scheduled-link-display">
                  <span>{scheduledMeetingMessage || "Meeting Link:"} </span>
                  <a href={scheduledMeetingLink} target="_blank" rel="noopener noreferrer" className="meeting-link-text">
                    {newMeetingPlatform === 'Google Meet' ? "Add to Google Calendar" : scheduledMeetingLink.substring(0, 40) + '...'}
                  </a>
                  <button onClick={() => handleCopyLink(scheduledMeetingLink)} className="copy-link-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="copy-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125H9.375a1.125 1.125 0 01-1.125-1.125V17.25m12-10.5V1.25c0-.621-.504-1.125-1.125-1.125H7.875A1.125 1.125 0 006.75 1.25v5.063M15.75 17.25H4.5A2.25 2.25 0 012.25 15V3.75a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25V15a2.25 2.25 0 01-2.25 2.25zm0 0H7.875" />
                    </svg>
                    Copy Link
                  </button>
                </div>
              )}
            </div>
            <h2 className="live-class-title">Upcoming Scheduled Classes</h2>
            {upcomingClasses.length === 0 ? (
              <p className="no-classes-message">No upcoming classes scheduled.</p>
            ) : (
              <div className="upcoming-class-list">
                {upcomingClasses.map(cls => (
                  <div key={cls.id} className="upcoming-class-card">
                    <h3 className="upcoming-class-header">{cls.name}</h3>
                    <p className="upcoming-class-details">
                      {new Date(cls.dateTime).toLocaleString()}
                    </p>
                    <p className="upcoming-class-details">
                      Duration: {cls.duration}
                    </p>
                    {cls.platform && <p className="upcoming-class-details">Platform: {cls.platform}</p>}
                    <div className="upcoming-class-actions">
                      <button onClick={() => handleLiveClassAction('Join Live', cls.id, cls.name, cls.liveLink)} className="btn-primary">Join Live</button>
                      <button
                        onClick={() => handleLiveClassAction('Record', cls.id, cls.name, cls.liveLink)}
                        className="btn-secondary"
                        disabled={isRecordButtonDisabled(cls.id)}
                      >
                        {getRecordButtonText(cls.id)}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'live' && (
          <>
            <h2 className="live-class-title">Live Classes</h2>
            <div className="live-class-video-section">
              <div className="video-player">
                {mainLiveClass && mainLiveClass.liveLink ? (
                  <>
                    <iframe
                      width="100%"
                      height="100%"
                      src={mainLiveClass.liveLink}
                      title={`Live Class: ${mainLiveClass.name}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onError={(e) => { e.target.src = "https://placehold.co/640x360/cccccc/333333?text=Video+Unavailable"; }}
                    ></iframe>
                    {isClassCurrentlyRecording(mainLiveClass.id) && (
                      <div className="record-indicator">
                        <span className="record-dot"></span>
                        RECORDING
                      </div>
                    )}
                  </>
                ) : (
                  <p className="no-classes-message">No Live Class Available at this moment.</p>
                )}
              </div>
              {mainLiveClass && (
                <>
                  <p className="live-class-info">
                    This meeting is going live: <span className="font-semibold">{mainLiveClass.name}</span>
                  </p>
                  <p className="live-class-message">
                    {new Date(mainLiveClass.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {new Date(mainLiveClass.dateTime).toLocaleDateString('en-GB')}
                  </p>
                </>
              )}
            </div>
            {otherLiveClasses.length > 0 && (
              <div className="other-live-classes-section">
                <h3 className="other-live-classes-title">Other Ongoing Classes</h3>
                <div className="other-live-classes-list">
                  {otherLiveClasses.map(cls => (
                    <div key={cls.id} className="other-live-class-card">
                      <h4 className="other-live-class-name">{cls.name}</h4>
                      <p className="other-live-class-details">
                        {new Date(cls.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({cls.duration})
                      </p>
                      {cls.platform && <p className="other-live-class-details">Platform: {cls.platform}</p>}
                      <div className="other-live-class-actions">
                        <button onClick={() => handleLiveClassAction('Join Live', cls.id, cls.name, cls.liveLink)} className="btn-primary">Join Live</button>
                        <button
                          onClick={() => handleLiveClassAction('Record', cls.id, cls.name, cls.liveLink)}
                          className="btn-secondary"
                          disabled={isRecordButtonDisabled(cls.id)}
                        >
                          {getRecordButtonText(cls.id)}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'recordings' && (
          <>
            <h2 className="live-class-title">Recorded Classes & Sessions</h2>
            <div className="recordings-filter-section">
              <input
                type="text"
                placeholder="Search Recordings..."
                className="input-field search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="select-wrapper">
                <select
                  className="input-field"
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                >
                  <option value="All Subjects">All Subjects</option>
                  <option value="AI">AI</option>
                  <option value="Calculus">Calculus</option>
                  <option value="Development">Development</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Python">Python</option>
                </select>
                <span className="select-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
              <div className="select-wrapper">
                <select
                  className="input-field"
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                >
                  <option value="All Dates">All Dates</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                </select>
                <span className="select-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {recordedClasses.length === 0 ? (
              <p className="no-classes-message">No recordings found matching your criteria.</p>
            ) : (
              <div className="recordings-list">
                {recordedClasses.map(cls => (
                  <div key={cls.id} className="recording-card">
                    <h3 className="recording-header">{cls.name}</h3>
                    <p className="recording-details">
                      Recorded on: {new Date(cls.dateTime).toLocaleString()}
                    </p>
                    <p className="recording-details">
                      Duration: {cls.duration}
                    </p>
                    {cls.platform && <p className="recording-details">Platform: {cls.platform}</p>}
                    <div className="recording-actions">
                      <button
                        onClick={() => handleLiveClassAction('Watch Recording', cls.id, cls.name, cls.recordedLink)}
                        className="btn-primary watch-recording-btn"
                      >
                        Watch Recording
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {recordedClasses.length > 5 && (
              <div className="pagination">
                <button className="pagination-btn" disabled>Previous</button>
                <span className="pagination-info">Page 1 of X</span>
                <button className="pagination-btn" disabled>Next</button>
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