import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Custom styles including video background

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', { email, password });
      // Redirect to login page on successful registration
      window.location.href = '/login';
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <video autoPlay loop muted className="background-video">
        <source src="https://videos.pexels.com/video-files/946146/946146-sd_640_360_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="register-box">
        <h1>Register</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
        <p className="login-prompt">
          Already have an account? <a href="/login" className="login-link">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
