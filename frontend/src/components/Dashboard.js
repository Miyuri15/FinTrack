// src/components/DashboardPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleBudgetClick = () => {
    navigate('/budget');
  };
  const handleTransactionClick = () => {
    navigate('/transaction');
  };
  const handleReportClick = () => {
    navigate('/report');
  };


  return (
    <div>
      <h1>Dashboard</h1>
      <div>
      <button onClick={handleBudgetClick}>Go to Budget Page</button>
      </div>
      <div>
      <button onClick={handleTransactionClick}>Go to Transaction Page</button>
      </div>
      <div>
      <button onClick={handleReportClick}>Go to Report Page</button>
      </div>


    </div>
  );
};

export default Dashboard;
