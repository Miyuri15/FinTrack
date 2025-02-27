// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/SignInAndSignUp/Login';
import Budget from './components/BudgetPlaning/Budget';
import Transactions from './components/Transactions';
import Report from './components/Report';
import Register from './components/SignInAndSignUp/Register';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import UserDashboard from './components/Dashboards/UserDashboard';
import { ThemeProvider } from './ThemeContext';
import BudgetRecommendations from './components/BudgetPlaning/BudgetRecommendations';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Default to Login Page */}
          <Route path="/register" element={<Register />} /> {/* Register Page */}
          <Route path="/login" element={<Login />} /> {/* Login Page */}
          <Route path="/admindashboard" element={<AdminDashboard />} /> {/* Admin Dashboard Page */}
          <Route path="/userdashboard" element={<UserDashboard />} /> {/* User Dashboard Page */}
          <Route path="/budget" element={<Budget />} /> {/* Budget Page */}
          <Route path="/transactions" element={<Transactions />} /> {/* Transaction Page */}
          <Route path="/reports" element={<Report />} /> {/* Report Page */}
          <Route path="/logout" element={<Login />} /> {/* Report Page */}
          <Route path="/recommendations" element={<BudgetRecommendations />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;