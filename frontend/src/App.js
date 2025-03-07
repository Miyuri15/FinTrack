// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/SignInAndSignUp/Login';
import Budget from './components/BudgetPlaning/Budget';
import Register from './components/SignInAndSignUp/Register';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import UserDashboard from './components/Dashboards/UserDashboard';
import { ThemeProvider } from './ThemeContext';
import BudgetRecommendations from './components/BudgetPlaning/BudgetRecommendations';
import AdminTransactions from './components/Transactions/AdminTransactions';
import UserTransactions from './components/Transactions/UserTransactions';
import { AuthProvider } from './context/AuthContext';
import TransactionsPage from './components/Transactions/TransactionsPage';
import UserReports from './components/Reports/UserReports';
import AdminReports from './components/Reports/AdminReports';
import Analytics from './components/Analytics/Analytics';
import AllUsers from './components/AllUsers/AllUsers';
import Goals from './components/Goals/Goals';

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
          <Route path="/logout" element={<Login />} /> {/* Report Page */}
          <Route path="/recommendations" element={<BudgetRecommendations />} />
          <Route path="/adminTransactions" element={<AdminTransactions />} />
          <Route path="/userTransactions" element={<UserTransactions />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/userReports" element={<UserReports />} /> {/* Report Page */}
          <Route path="/adminReports" element={<AdminReports />} /> {/* Report Page */}
          <Route path="/analytics" element={<Analytics />} /> {/* Analytics Page */}
          <Route path="/allUsers" element={<AllUsers />} /> {/* All users Page */}
          <Route path="/goal" element={<Goals />} /> {/* Goal Page */}
          <Route path="/currency" element={<Goals />} /> {/* Goal Page */}

        </Routes>
      </Router>
    </ThemeProvider>
    </AuthProvider>
  );
};

export default App;