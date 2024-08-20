import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TestPage from './components/TestPage';
import MCQTestPage from './components/MCQTestPage';
import FinishTestPage from './components/FinishTestPage'; // Import FinishTestPage

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route
          path="/test"
          element={isAuthenticated ? <TestPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/mcq-test"
          element={isAuthenticated ? <MCQTestPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/finish-test"
          element={isAuthenticated ? <FinishTestPage /> : <Navigate to="/login" />}
        />
        
        {/* Redirect unknown routes to /login */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/test" : "/login"} />} />
      </Routes>
    </div>
  );
};

export default App;
