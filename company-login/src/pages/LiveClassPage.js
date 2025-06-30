import React, { useState } from 'react';
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

  const [allClasses, setAllClasses] = useState([
    { id: 'lc1', name: "Introduction to AI", dateTime: new Date(Date.now() + 86400000).toISOString(), duration: "1 hr", status: "Upcoming", liveLink: "https://www.youtube.com/embed/g2qJkGk1D9A?autoplay=1&mute=1", shouldRecord: false },
    { id: 'lc2', name: "Advanced Calculus", dateTime: new Date(Date.now() + 5 * 86400000).toISOString(), duration: "1.5 hr", status: "Upcoming", liveLink: "https://www.youtube.com/embed/C-C-t6-cI4g?autoplay=1&mute=1", shouldRecord: true },
    { id: 'lc3', name: "Web Development Basics", dateTime: new Date(Date.now() - 2 * 86400000).toISOString(), duration: "2 hr", status: "Completed", shouldRecord: false },
    { id: 'lc4', name: "Data Structures & Algorithms", dateTime: new Date(Date.now() + 2 * 86400000).toISOString(), duration: "1 hr 15 min", status: "Upcoming", liveLink: "https://www.youtube.com/embed/pkSMi2lG6qU?autoplay=1&mute=1", shouldRecord: false },
    { id: 'lc5', name: "Machine Learning Fundamentals", dateTime: new Date(Date.now() + 10 * 86400000).toISOString(), duration: "2 hr", status: "Upcoming", liveLink: "https://www.youtube.com/embed/J_B8K2NlP_g?autoplay=1&mute=1", shouldRecord: true },
    { id: 'lc6', name: "Cybersecurity Essentials", dateTime: new Date(Date.now() - 5 * 86400000).toISOString(), duration: "1 hr", status: "Completed", shouldRecord: false },
    { id: 'lc7', name: "Active Session 1", dateTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), duration: "1 hr", status: "Upcoming", liveLink: "https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1", shouldRecord: false },
    { id: 'lc8', name: "Active Session 2 (Recorded)", dateTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), duration: "45 min", status: "Upcoming", liveLink: "https://www.youtube.com/embed/g2qJkGk1D9A?autoplay=1&mute=1", shouldRecord: true },
  ]);

  const [alertConfig, setAlertConfig] = useState(null);

  const parseDurationToMillis = (durationStr) => {
    let totalMillis = 0;
    const parts = durationStr.split(' ');
    for (let i = 0; i < parts.length; i++) {
      const value = parseInt(parts[i]);
      if (isNaN(value)) continue;
      const unit = parts[i + 1];
      if (unit && unit.toLowerCase().startsWith('hr')) {
        totalMillis += value * 60 * 60 * 1000;
        i++;
      } else if (unit && unit.toLowerCase().startsWith('min')) {
        totalMillis += value * 60 * 1000;
        i++;
      }
    }
    return totalMillis;
  };

  const getOngoingClasses = () => {
    const now = Date.now();
    return allClasses.filter(cls => {
      const classStartTime = new Date(cls.dateTime).getTime();
      const classDurationMillis = parseDurationToMillis(cls.duration);
      const actualClassDuration = classDurationMillis > 0 ? classDurationMillis : 60 * 60 * 1000;
      const classEndTime = classStartTime + actualClassDuration;
      return classStartTime <= now && now < classEndTime;
    }).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  };

  const ongoingClasses = getOngoingClasses();
  const mainLiveClass = ongoingClasses.length > 0 ? ongoingClasses[0] : null;
  const otherLiveClasses = ongoingClasses.slice(1);

  const upcomingClasses = allClasses
    .filter(cls => new Date(cls.dateTime).getTime() > Date.now())
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const handleLiveClassAction = (action, classId, className, liveLink = null, classShouldRecord = false) => {
    let message = '';
    if (action === 'Join Live' && liveLink) {
      message = `Attempting to join live class: "${className}". This will open in a new window/tab.`;
      window.open(liveLink, '_blank');
    } else if (action === 'Record') {
        if (classShouldRecord && ongoingClasses.some(c => c.id === classId)) {
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
    } else if (action === 'View Details') {
        message = `Viewing details for "${className}". (Simulated action)`;
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
    let actualLiveLink = '';

    if (newMeetingPlatform === 'Google Meet') {
      const eventTitle = encodeURIComponent(newMeetingName);
      const startTime = newMeetingDate.replace(/-/g, '') + newMeetingTime.replace(/:/g, '') + '00';
      const endTime = new Date(meetingDateTime.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]|\.\d{3}/g, '').substring(0, 15) + 'Z';
      actualLiveLink = `https://meet.google.com/lookup/${Math.random().toString(36).substring(2, 10)}`;
      generatedLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startTime}/${endTime}&details=Join your Google Meet session here: ${encodeURIComponent(actualLiveLink)}&sf=true&output=xml`;
      linkMessage = `Click to add to Google Calendar. The meeting link will be in the calendar event.`;
    } else if (newMeetingPlatform === 'Zoom') {
      actualLiveLink = `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      generatedLink = actualLiveLink;
      linkMessage = `Your Zoom meeting has been simulated. Actual Zoom scheduling needs to be done via Zoom's platform.`;
    }

    const newMeeting = {
      id: `lc-${Date.now()}`,
      name: newMeetingName,
      dateTime: meetingDateTime.toISOString(),
      duration: "1 hr",
      status: "Upcoming",
      liveLink: actualLiveLink,
      platform: newMeetingPlatform,
      shouldRecord: newMeetingShouldRecord === 'yes',
    };

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
    const textarea = document.createElement('textarea');
    textarea.value = link;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setAlertConfig({
        message: 'Meeting link copied to clipboard!',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setAlertConfig({
        message: 'Failed to copy link. Please copy manually.',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
    }
    document.body.removeChild(textarea);
  };

  const isClassCurrentlyRecording = (clsId) => {
      const classObject = allClasses.find(c => c.id === clsId);
      if (!classObject) return false;
      const isOngoing = ongoingClasses.some(c => c.id === clsId);
      return manualRecordingId === clsId || (classObject.shouldRecord && isOngoing);
  };

  const getRecordButtonText = (clsId, classShouldRecord) => {
      if (classShouldRecord && ongoingClasses.some(c => c.id === clsId)) {
          return "Recording";
      }
      return manualRecordingId === clsId ? 'Stop Recording' : 'Record';
  };

  const isRecordButtonDisabled = (clsId, classShouldRecord) => {
      const isOngoing = ongoingClasses.some(c => c.id === clsId);
      return (classShouldRecord && isOngoing) || (manualRecordingId && manualRecordingId !== clsId);
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
            <h2 className="live-class-title">Already Scheduled Meetings</h2>
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
                        onClick={() => handleLiveClassAction('Record', cls.id, cls.name, cls.liveLink, cls.shouldRecord)}
                        className="btn-secondary"
                        disabled={isRecordButtonDisabled(cls.id, cls.shouldRecord)}
                      >
                        {getRecordButtonText(cls.id, cls.shouldRecord)}
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
            <h2 className="live-class-title">Live Class</h2>
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
                            {(isClassCurrentlyRecording(mainLiveClass.id)) && (
                                <div className="record-indicator">
                                    <span className="record-dot"></span>
                                    Record
                                </div>
                            )}
                        </>
                    ) : (
                        <p>No Live Class Available at this moment.</p>
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
                      <p className="other-live-class-details">Platform: {cls.platform}</p>
                      <div className="other-live-class-actions">
                          <button onClick={() => handleLiveClassAction('Join Live', cls.id, cls.name, cls.liveLink)} className="btn-primary">Join Live</button>
                          <button
                            onClick={() => handleLiveClassAction('Record', cls.id, cls.name, cls.liveLink, cls.shouldRecord)}
                            className="btn-secondary"
                            disabled={isRecordButtonDisabled(cls.id, cls.shouldRecord)}
                          >
                            {getRecordButtonText(cls.id, cls.shouldRecord)}
                          </button>
                      </div>
                    </div>
                  ))}
                </div>
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
