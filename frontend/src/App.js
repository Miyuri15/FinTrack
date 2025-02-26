// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/SignInAndSignUp/Login';
import Budget from './components/Budget';
import Transactions from './components/Transactions';
import Report from './components/Report';
import Register from './components/SignInAndSignUp/Register';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import UserDashboard from './components/Dashboards/UserDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} /> {/* Register Page */}
        <Route path="/register" element={<Register />} /> {/* Register Page */}
        <Route path="/login" element={<Login />} /> {/* Login Page */}
        <Route path="/admindashboard" element={<AdminDashboard />} /> {/* Admin Dashboard Page */}
        <Route path="/userdashboard" element={<UserDashboard />} /> {/*User  Dashboard Page */}
        <Route path="/budget" element={<Budget />} /> {/* Budget Page */}
        <Route path="/transaction" element={<Transactions />} /> {/* Transaction Page */}
        <Route path="/report" element={<Report />} /> {/* Report Page */}

      </Routes>
    </Router>
  );
};

export default App;
