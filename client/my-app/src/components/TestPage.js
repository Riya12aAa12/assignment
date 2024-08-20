import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faMicrophone, faBan, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

const TestPage = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [error, setError] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const cameraStream = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        cameraStream.current = stream;
        setHasCameraPermission(true);
        setHasMicPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        handleMediaError(err);
      }
    };

    getMedia();
  }, [navigate]);

  const handleMediaError = (err) => {
    if (err.name === 'NotAllowedError') {
      if (err.message.includes('video')) {
        setHasCameraPermission(false);
      }
      if (err.message.includes('audio')) {
        setHasMicPermission(false);
      }
      setError('Please grant permission for camera and microphone access.');
    } else if (err.name === 'NotFoundError') {
      setError('Media devices not found.');
    } else {
      setError('Error accessing media devices.');
    }
    console.error('Error accessing media devices:', err);
  };

  const toggleCamera = () => {
    if (isCameraOn) {
      const tracks = cameraStream.current?.getVideoTracks();
      tracks?.forEach(track => track.stop());
      setIsCameraOn(false);
    } else {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          cameraStream.current = stream;
          setIsCameraOn(true);
        })
        .catch(err => handleMediaError(err));
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      const tracks = cameraStream.current?.getAudioTracks();
      tracks?.forEach(track => track.stop());
      setIsMicOn(false);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = cameraStream.current;
          }
          cameraStream.current.addTrack(stream.getAudioTracks()[0]);
          setIsMicOn(true);
        })
        .catch(err => handleMediaError(err));
    }
  };

  const startTest = () => {
    if (hasCameraPermission && hasMicPermission) {
      navigate('/mcq-test'); // Navigate to MCQ Test Page
    } else {
      alert("Please grant camera and microphone permissions before starting the test.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <h1>Test Environment</h1>
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      {hasCameraPermission && hasMicPermission ? (
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <video
            autoPlay
            playsInline
            muted={!isMicOn} // Ensure the video is muted if mic is off
            ref={videoRef}
            style={{ width: '80%', maxWidth: '600px', height: 'auto', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}
          />
          <p>Camera and Microphone permissions granted.</p>
          <div style={{ marginTop: '10px' }}>
            <button onClick={toggleCamera} title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'} style={{ margin: '5px' }}>
              <FontAwesomeIcon icon={isCameraOn ? faCamera : faBan} />
            </button>
            <button onClick={toggleMic} title={isMicOn ? 'Turn Microphone Off' : 'Turn Microphone On'} style={{ margin: '5px' }}>
              <FontAwesomeIcon icon={isMicOn ? faMicrophone : faVolumeMute} />
            </button>
          </div>
          {/* Start Your Test Button */}
          <button
            onClick={startTest}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(0,0,0,0.3)'
            }}
          >
            Start Your Test
          </button>
        </div>
      ) : (
        <div>
          <p>Permissions missing:</p>
          {!hasCameraPermission && <p>- Camera access is required</p>}
          {!hasMicPermission && <p>- Microphone access is required</p>}
        </div>
      )}
    </div>
  );
};

export default TestPage;
