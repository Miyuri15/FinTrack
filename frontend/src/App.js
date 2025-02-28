// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/SignInAndSignUp/Login';
import Budget from './components/BudgetPlaning/Budget';
import Report from './components/Report';
import Register from './components/SignInAndSignUp/Register';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import UserDashboard from './components/Dashboards/UserDashboard';
import { ThemeProvider } from './ThemeContext';
import BudgetRecommendations from './components/BudgetPlaning/BudgetRecommendations';
import AdminTransactions from './components/Transactions/AdminTransactions';
import UserTransactions from './components/Transactions/UserTransactions';
import { AuthProvider } from './context/AuthContext';
import TransactionsPage from './components/Transactions/TransactionsPage';

const App = () => {
  const isAdmin = true;

  return (
    <AuthProvider>
    <ThemeProvider>
      <Router>
        
        <Routes>
          <Route path="/" element={<Login />} /> {/* Default to Login Page */}
          <Route path="/register" element={<Register />} /> {/* Register Page */}
          <Route path="/login" element={<Login />} /> {/* Login Page */}
          <Route path="/admindashboard" element={<AdminDashboard />} /> {/* Admin Dashboard Page */}
          <Route path="/userdashboard" element={<UserDashboard />} /> {/* User Dashboard Page */}
          <Route path="/budget" element={<Budget />} /> {/* Budget Page */}
          <Route path="/reports" element={<Report />} /> {/* Report Page */}
          <Route path="/logout" element={<Login />} /> {/* Report Page */}
          <Route path="/recommendations" element={<BudgetRecommendations />} />
          <Route path="/adminTransactions" element={<AdminTransactions />} />
          <Route path="/userTransactions" element={<UserTransactions />} />
          <Route path="/transactions" element={<TransactionsPage />} />


        </Routes>
      </Router>
    </ThemeProvider>
    </AuthProvider>
  );
};

export default App;