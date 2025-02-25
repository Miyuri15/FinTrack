// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/SignInAndSignUp/Login';
import Dashboard from './components/Dashboard';
import Budget from './components/Budget';
import Transactions from './components/Transactions';
import Report from './components/Report';
import Register from './components/SignInAndSignUp/Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} /> {/* Register Page */}
        <Route path="/register" element={<Register />} /> {/* Register Page */}
        <Route path="/login" element={<Login />} /> {/* Login Page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard Page */}
        <Route path="/budget" element={<Budget />} /> {/* Budget Page */}
        <Route path="/transaction" element={<Transactions />} /> {/* Transaction Page */}
        <Route path="/report" element={<Report />} /> {/* Report Page */}

      </Routes>
    </Router>
  );
};

export default App;
