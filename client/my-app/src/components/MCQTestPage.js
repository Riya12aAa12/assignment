import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const MCQTestPage = () => {
  const [questions, setQuestions] = useState([
    { id: 1, text: 'What is React?', options: ['Library', 'Framework', 'Language'], answer: null },
    { id: 2, text: 'What is JSX?', options: ['Syntax Extension', 'Framework', 'Library'], answer: null },
    { id: 3, text: 'What is the use of useState in React?', options: ['State Management', 'Routing', 'Component Styling'], answer: null },
    { id: 4, text: 'Which of the following is a React lifecycle method?', options: ['componentDidMount', 'renderToString', 'useEffect'], answer: null },
    { id: 5, text: 'What does the "key" prop do in React?', options: ['Identifies list items', 'Applies styles', 'Handles state'], answer: null },
    { id: 6, text: 'What is a higher-order component in React?', options: ['A component that renders another component', 'A component that manages state', 'A component that handles routing'], answer: null },
    { id: 7, text: 'Which hook is used to manage side effects in functional components?', options: ['useEffect', 'useState', 'useContext'], answer: null },
    { id: 8, text: 'What is the virtual DOM in React?', options: ['A lightweight representation of the real DOM', 'A tool for debugging', 'A server-side technology'], answer: null },
    { id: 9, text: 'Which company developed React?', options: ['Facebook', 'Google', 'Microsoft'], answer: null },
    { id: 10, text: 'What is the purpose of prop drilling in React?', options: ['Passing data from parent to child components', 'Rendering components', 'Handling events'], answer: null }
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const cameraStream = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        cameraStream.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error('Error accessing media devices:', err));

    return () => {
      const tracks = cameraStream.current?.getTracks();
      tracks?.forEach(track => track.stop());
    };
  }, []);

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
        .catch(err => console.error('Error accessing media devices:', err));
    }
  };

  const handleOptionChange = (questionId, option) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, answer: option } : q
    ));
  };

  const handleNavigation = (direction) => {
    if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    navigate('/finish-test');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1>MCQ Test</h1>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', maxWidth: '800px' }}>
        <div style={{ flex: 1, padding: '10px' }}>
          <video
            autoPlay
            playsInline
            muted
            ref={videoRef}
            style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}
          />
          <button onClick={toggleCamera} title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'} style={{ margin: '10px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={isCameraOn ? faCamera : faVolumeMute} />
          </button>
        </div>
        <div style={{ flex: 2, padding: '10px' }}>
          <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
          <p>{questions[currentQuestionIndex].text}</p>
          <div>
            {questions[currentQuestionIndex].options.map(option => (
              <div key={option}>
                <input
                  type="radio"
                  id={option}
                  name="options"
                  checked={questions[currentQuestionIndex].answer === option}
                  onChange={() => handleOptionChange(questions[currentQuestionIndex].id, option)}
                />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => handleNavigation('prev')} disabled={currentQuestionIndex === 0}>Previous</button>
            <button onClick={() => handleNavigation('next')} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                boxShadow: '0 0 10px rgba(0,0,0,0.3)',
              }}
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQTestPage;
