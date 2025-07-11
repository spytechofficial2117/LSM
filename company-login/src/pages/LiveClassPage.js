import React, { useState, useEffect, useCallback } from 'react';
import CustomAlertDialog from '../components/CustomAlertDialog';
import RecordedVideoPlayer from '../components/RecordedVideoPlayer';
import './LiveClassPage.css'; 

// DoubtSection Component
const DoubtSection = ({ className, onSubmitDoubt }) => {
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !question.trim()) {
      alert('Please fill in both your name and your question.');
      return;
    }
    onSubmitDoubt({ name, question, className });
    setName('');
    setQuestion('');
  };

  return (
    <div className="doubt-section">
      <h3 className="doubt-title">Have a question about "{className}"?</h3>
      <p className="doubt-subtitle">Our instructors will get back to you shortly.</p>
      <form onSubmit={handleSubmit} className="doubt-form">
        <div className="form-group">
          <label htmlFor="userName" className="form-label">Your Name</label>
          <input
            type="text"
            id="userName"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="userQuestion" className="form-label">Your Question</label>
          <textarea
            id="userQuestion"
            className="input-field"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            rows="4"
            required
          />
        </div>
        <button type="submit" className="btn-primary">Submit Question</button>
      </form>
    </div>
  );
};

// LiveClassPage Component
const LiveClassPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [manualRecordingIds, setManualRecordingIds] = useState([]);
  const [manuallyStoppedRecordingIds, setManuallyStoppedRecordingIds] = useState([]);
  const [newMeetingName, setNewMeetingName] = useState('');
  const [newMeetingDate, setNewMeetingDate] = useState('');
  const [newMeetingTime, setNewMeetingTime] = useState('');
  const [newMeetingPlatform, setNewMeetingPlatform] = useState('Google Meet');
  // Separate states for duration hours and minutes
  const [newMeetingDurationHours, setNewMeetingDurationHours] = useState(1);
  const [newMeetingDurationMinutes, setNewMeetingDurationMinutes] = useState(0);
  const [newMeetingShouldRecord, setNewMeetingShouldRecord] = useState('no');
  const [scheduledMeetingLink, setScheduledMeetingLink] = useState(null);
  const [scheduledMeetingMessage, setScheduledMeetingMessage] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('All Subjects');
  const [filterDateRange, setFilterDateRange] = useState('All Dates');

  const [allClasses, setAllClasses] = useState([]);
  const [displayClasses, setDisplayClasses] = useState([]); // This will be derived from allClasses + status updates

  const [alertConfig, setAlertConfig] = useState(null);
  const [selectedRecording, setSelectedRecording] = useState(null);

  // Helper to parse duration string (e.g., "1 hr 30 mins") into milliseconds
  const parseDurationStringToMillis = useCallback((durationStr) => {
    let totalMillis = 0;
    const hoursMatch = durationStr.match(/(\d+)\s*hr/i);
    const minutesMatch = durationStr.match(/(\d+)\s*min/i);

    if (hoursMatch) {
      totalMillis += parseInt(hoursMatch[1]) * 60 * 60 * 1000;
    }
    if (minutesMatch) {
      totalMillis += parseInt(minutesMatch[1]) * 60 * 1000;
    }
    return totalMillis > 0 ? totalMillis : 60 * 60 * 1000; // Default to 1 hour if parsing fails
  }, []);

  // Helper to convert hours/minutes numbers to milliseconds
  const convertHoursMinutesToMillis = useCallback((hours, minutes) => {
    const totalHoursMillis = (hours || 0) * 60 * 60 * 1000;
    const totalMinutesMillis = (minutes || 0) * 60 * 1000;
    const totalMillis = totalHoursMillis + totalMinutesMillis;
    return totalMillis > 0 ? totalMillis : 60 * 60 * 1000; // Default to 1 hour if invalid/zero
  }, []);

  // Determines and updates class statuses (Upcoming, Ongoing, Completed)
  // This function now returns the updated array, and the useEffect will commit it.
  const getUpdatedClassesWithStatus = useCallback(() => {
    const now = Date.now();
    let updatedClassesList = []; // New list to build and return
    let changed = false; // Flag to know if any status actually changed

    allClasses.forEach(cls => {
      const classStartTime = new Date(cls.dateTime).getTime();
      // Use the class's own duration string to determine its end time
      const classDurationMillis = parseDurationStringToMillis(cls.duration);
      const classEndTime = classStartTime + classDurationMillis;

      let currentCls = { ...cls }; // Create a mutable copy for this iteration

      const wasManuallyStopped = manuallyStoppedRecordingIds.includes(currentCls.id);

      if (now < classStartTime) {
        if (currentCls.status !== "Upcoming") {
          currentCls.status = "Upcoming";
          changed = true;
        }
      } else if (now >= classStartTime && now < classEndTime) {
        if (currentCls.status !== "Ongoing") {
          currentCls.status = "Ongoing";
          changed = true;
        }
      } else { // Class is Completed (now >= classEndTime)
        if (currentCls.status !== "Completed") {
          currentCls.status = "Completed";
          changed = true;

          // If class was set to auto-record OR was manually started/stopped, assign link if not present
          const wasManuallyRecording = manualRecordingIds.includes(currentCls.id);
          if ((currentCls.shouldRecord || wasManuallyRecording || wasManuallyStopped) && !currentCls.recordedLink) {
             currentCls.recordedLink = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
             // Clean up manual recording states if the class is now naturally completed
             setManualRecordingIds(prevIds => prevIds.filter(id => id !== currentCls.id));
             setManuallyStoppedRecordingIds(prevIds => prevIds.filter(id => id !== currentCls.id));
          }
        }
      }

      // Ensure a recorded link if it was explicitly manually stopped (this overrides natural completion check temporarily)
      if (wasManuallyStopped && !currentCls.recordedLink) {
          currentCls.recordedLink = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
          // If it was manually stopped, its status should already be "Completed" from handleLiveClassAction,
          // but we ensure recordedLink here just in case.
      }
      updatedClassesList.push(currentCls);
    });

    // CRITICAL FIX: Only update allClasses if changes were detected to prevent unnecessary re-renders.
    // This is the core reason why classes weren't moving.
    if (changed) {
      setAllClasses(updatedClassesList); // This will trigger a re-render
    }
    return updatedClassesList; // Return the current state for direct use in setDisplayClasses
  }, [allClasses, manualRecordingIds, manuallyStoppedRecordingIds, parseDurationStringToMillis]); // Dependencies for useCallback

  useEffect(() => {
    const updateDisplay = () => {
      // getUpdatedClassesWithStatus might update `allClasses` internally.
      // We then use the most recent `allClasses` to derive `displayClasses`.
      const currentClasses = getUpdatedClassesWithStatus();
      setDisplayClasses(currentClasses);
    };

    updateDisplay(); // Run once immediately on mount

    // Re-evaluate every 5 seconds to catch transitions quickly
    const intervalId = setInterval(updateDisplay, 5 * 1000); // 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [getUpdatedClassesWithStatus]); // Only re-run useEffect if getUpdatedClassesWithStatus changes

  const ongoingClasses = displayClasses
    .filter(cls => cls.status === "Ongoing")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const mainLiveClass = ongoingClasses.length > 0 ? ongoingClasses[0] : null;
  const otherLiveClasses = ongoingClasses.slice(1);

  const upcomingClasses = displayClasses
    .filter(cls => cls.status === "Upcoming")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const isClassCurrentlyRecording = useCallback((clsId) => {
    const classObject = displayClasses.find(c => c.id === clsId);
    const isOngoing = ongoingClasses.some(c => c.id === clsId);
    const isManuallyRecording = manualRecordingIds.includes(clsId);

    // A class is considered recording if it's manually started OR
    // (it's configured to auto-record AND it's currently ongoing)
    return isManuallyRecording || (classObject?.shouldRecord && isOngoing);
  }, [displayClasses, ongoingClasses, manualRecordingIds]);

  const rawRecordedClasses = displayClasses
    .filter(cls =>
        (cls.status === "Completed" && cls.recordedLink) || // Class naturally completed and has a link
        (manuallyStoppedRecordingIds.includes(cls.id) && cls.recordedLink) // OR it was manually stopped and has a link
    );

  const getFilteredRecordedClasses = () => {
    let filtered = rawRecordedClasses;
    if (searchQuery) {
      filtered = filtered.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterSubject !== 'All Subjects') {
      filtered = filtered.filter(cls => cls.subject?.toLowerCase() === filterSubject.toLowerCase());
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
    if (action === 'Watch Recording' && link) {
      const classToWatch = allClasses.find(c => c.id === classId);
      setSelectedRecording(classToWatch);
      return;
    }

    let message = '';
    let isCurrentlyRecordingThisClass = false;

    if (action === 'Join Live' && link) {
      message = `Attempting to join live class: "${className}". This will open in a new window/tab.`;
      window.open(link, '_blank');
    } else if (action === 'Record') {
      isCurrentlyRecordingThisClass = isClassCurrentlyRecording(classId);

      if (isCurrentlyRecordingThisClass) {
        setAlertConfig({
          message: `Are you sure you want to stop the recording "${className}"?`,
          type: 'confirm',
          onConfirm: () => {
            setAlertConfig(null);
            setManualRecordingIds(prevIds => prevIds.filter(id => id !== classId));

            setManuallyStoppedRecordingIds(prevIds => [...prevIds, classId]);

            // Immediately update the class in allClasses to have a recordedLink and set status to completed
            setAllClasses(prevClasses => prevClasses.map(cls =>
                cls.id === classId
                ? {
                    ...cls,
                    recordedLink: cls.recordedLink || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                    status: "Completed" // Mark as completed for recording purposes
                  }
                : cls
            ));

            message = `Manual recording for "${className}" has been stopped and is now available in recordings.`;

            setAlertConfig({
              message: message,
              type: 'alert',
              onConfirm: () => setAlertConfig(null)
            });
          },
          onCancel: () => setAlertConfig(null)
        });
        return;
      } else {
        setManualRecordingIds(prevIds => [...prevIds, classId]);
        message = `Recording for "${className}" has started. (Simulated action)`;
      }
    } else {
      message = `${action} for "${className}" (ID: ${classId}) will be initiated. (Simulated action)`;
    }

    if (!alertConfig || alertConfig.type !== 'confirm') {
      if (action !== 'Record' || !isCurrentlyRecordingThisClass) {
        setAlertConfig({
          message: message,
          type: 'alert',
          onConfirm: () => setAlertConfig(null)
        });
      }
    }
  };

  const handleDoubtSubmit = ({ name, question, className }) => {
    console.log("Doubt Submitted:", { name, question, className });
    setAlertConfig({
      message: `Hi ${name}, your question about "${className}" has been submitted successfully! We'll get back to you soon.`,
      type: 'alert',
      onConfirm: () => setAlertConfig(null)
    });
  };

  const handleScheduleMeeting = (e) => {
    e.preventDefault();

    const hours = parseInt(newMeetingDurationHours);
    const minutes = parseInt(newMeetingDurationMinutes);

    if (
      !newMeetingName ||
      !newMeetingDate ||
      !newMeetingTime ||
      !newMeetingPlatform ||
      (isNaN(hours) || hours < 0) ||
      (isNaN(minutes) || minutes < 0 || minutes >= 60) ||
      (hours === 0 && minutes === 0) // Ensure duration is not 0
    ) {
      setAlertConfig({
        message: 'Please fill in all fields correctly to schedule a meeting, ensuring a valid duration (hours and minutes).',
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
        message: 'Please select a valid date and time in the future, or very near past (within 5 minutes) for an instant live session.',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
      return;
    }

    const durationMillis = convertHoursMinutesToMillis(hours, minutes);

    let durationString = '';
    if (hours > 0) {
        durationString += `${hours} hr${hours !== 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
        durationString += `${hours > 0 ? ' ' : ''}${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    if (durationString === '') {
        durationString = '0 mins'; // Should be prevented by validation above, but as a fallback
    }

    let generatedLink = '';
    let linkMessage = '';
    const actualLiveLink = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
    const simulatedRecordedLink = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";

    if (newMeetingPlatform === 'Google Meet') {
      const eventTitle = encodeURIComponent(newMeetingName);
      const startIso = meetingDateTime.toISOString().replace(/[-:]|\.\d{3}/g, '').substring(0, 15) + 'Z';
      const endIso = new Date(meetingDateTime.getTime() + durationMillis).toISOString().replace(/[-:]|\.\d{3}/g, '').substring(0, 15) + 'Z';

      generatedLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startIso}/${endIso}&details=Join your Google Meet session here: ${encodeURIComponent(actualLiveLink)}&sf=true&output=xml`;
      linkMessage = `Click to add to Google Calendar. The meeting link will be in the calendar event.`;
    } else if (newMeetingPlatform === 'Zoom') {
      generatedLink = actualLiveLink;
      linkMessage = `Your Zoom meeting link has been simulated. Actual Zoom scheduling needs to be done via Zoom's platform.`;
    }

    const newMeeting = {
      id: `lc-${Date.now()}`,
      name: newMeetingName,
      dateTime: meetingDateTime.toISOString(),
      duration: durationString, // Store the user-friendly string
      status: "Upcoming",
      liveLink: actualLiveLink,
      platform: newMeetingPlatform,
      shouldRecord: newMeetingShouldRecord === 'yes',
      recordedLink: newMeetingShouldRecord === 'yes' ? simulatedRecordedLink : null,
      subject: 'Scheduled Class'
    };

    setAllClasses(prevClasses => [...prevClasses, newMeeting]);

    setAlertConfig({
      message: `Meeting "${newMeetingName}" scheduled successfully for ${newMeetingPlatform}! Duration: ${durationString}.`,
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
    setNewMeetingDurationHours(1); // Reset duration to default
    setNewMeetingDurationMinutes(0); // Reset duration to default
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
    return false; // Record button is always enabled if displayed
  };

  const getRecordButtonText = (clsId) => {
    const isCurrentlyRecordingThisClass = isClassCurrentlyRecording(clsId);
    if (isCurrentlyRecordingThisClass) {
      return "Stop Recording";
    }
    const classObject = displayClasses.find(c => c.id === clsId);
    const isOngoing = ongoingClasses.some(c => c.id === clsId);

    if (classObject?.shouldRecord && isOngoing) {
      return "Recording (Auto)";
    }
    return 'Record';
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
                {/* MODIFIED DURATION INPUT BLOCKS AS PER FIGURE */}
                <div className="form-group duration-inputs-container">
                  <label className="form-label">Duration</label>
                  <div className="duration-inputs-wrapper">
                    <div className='duration-input-group'>
                    <input
                      type="number"
                      id="meetingDurationHours"
                      className="input-field duration-input"
                      value={newMeetingDurationHours}
                      onChange={(e) => setNewMeetingDurationHours(Math.max(0, parseInt(e.target.value) || 0))}
                      min="0"
                    />
                    <span className='unit-label'>:hrs</span>
                    </div>

                    <div className='duration-input-group'>
                    <input
                      type="number"
                      id="meetingDurationMinutes"
                      className="input-field duration-input"
                      value={newMeetingDurationMinutes}
                      onChange={(e) => setNewMeetingDurationMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      min="0"
                      max="59"
                    />
                    <span className='unit-label'>:mins</span>
                    </div>
                  </div>
                </div>
                {/* END MODIFIED DURATION INPUT BLOCKS */}
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
                    {newMeetingPlatform === 'Google Meet' ? "Add to Google Calendar" : (scheduledMeetingLink.length > 40 ? scheduledMeetingLink.substring(0, 40) + '...' : scheduledMeetingLink)}
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
              <p className="no-classes-message">No upcoming classes scheduled. Schedule one above!</p>
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
            {mainLiveClass ? (
              <div className="live-class-video-section">
                <div className="video-player">
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
                </div>
                <>
                  <p className="live-class-info">
                    This meeting is going live: <span className="font-semibold">{mainLiveClass.name}</span>
                  </p>
                  <p className="live-class-message">
                    {new Date(mainLiveClass.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {new Date(mainLiveClass.dateTime).toLocaleDateString('en-GB')}
                  </p>
                  <div className="live-class-actions-inline">
                    <button
                      onClick={() => handleLiveClassAction('Record', mainLiveClass.id, mainLiveClass.name, mainLiveClass.liveLink)}
                      className="btn-secondary"
                      disabled={isRecordButtonDisabled(mainLiveClass.id)}
                    >
                      {getRecordButtonText(mainLiveClass.id)}
                    </button>
                  </div>
                </>
              </div>
            ) : (
              <p className="no-classes-message">No Live Class Available at this moment. Schedule an "Upcoming" class for the current time to see it live!</p>
            )}

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
            {selectedRecording ? (
              <div className="video-player-view">
                <button
                  onClick={() => setSelectedRecording(null)}
                  className="btn-secondary back-to-list-btn"
                >
                  ← Back to Recordings
                </button>
                <RecordedVideoPlayer videoUrl={selectedRecording.recordedLink} />
                <DoubtSection
                  className={selectedRecording.name}
                  onSubmitDoubt={handleDoubtSubmit}
                />
              </div>
            ) : (
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
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="General">General</option>
                      <option value="Scheduled Class">Scheduled Class</option>
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
                  <p className="no-classes-message">No recordings found. Schedule and complete classes to see them here!</p>
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
          </>
        )}
      </div>
      {alertConfig && (
        <CustomAlertDialog
          message={alertConfig.message}
          type={alertConfig.type}
          onConfirm={alertConfig.onConfirm}
          onCancel={alertConfig.onCancel}
        />
      )}
    </div>
  );
};

export default LiveClassPage;