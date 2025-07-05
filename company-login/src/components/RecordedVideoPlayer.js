import React, { useRef } from 'react'; 

const RecordedVideoPlayer = ({ videoUrl }) => { // Removed fileName prop as it's only for download
  const videoRef = useRef(null); 

  // No handleDownload function anymore

  return (
    <div className="recorded-video-player-container">
      {videoUrl ? (
        <>
          <h3>Recorded Class Playback</h3>
          <video
            ref={videoRef}
            controls // Show default video controls (play, pause, volume, fullscreen)
            src={videoUrl}
            className="custom-video-player"
            style={{ width: '100%', maxWidth: '800px', height: 'auto' }} // Basic styling
          >
            Your browser does not support the video tag.
          </video>
          {/* Removed the entire video-controls div which contained the download button and status */}
        </>
      ) : (
        <p>No recorded video available for playback.</p>
      )}
    </div>
  );
};

export default RecordedVideoPlayer;