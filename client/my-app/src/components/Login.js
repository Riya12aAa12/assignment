import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Custom styles including video background

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      if (response.data.token) {
        // Save token to localStorage
        localStorage.setItem('token', response.data.token);
        // Redirect to test page or another route
        window.location.href = '/test';
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <video autoPlay loop muted className="background-video">
        <source src="https://videos.pexels.com/video-files/946146/946146-sd_640_360_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="login-box">
        <h1>Login</h1>
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
          <button type="submit" className="login-button">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="register-prompt">
          Haven't registered yet? <a href="/register" className="register-link">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
