import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalFailed: 0,
    revenueLost: 0,
    revenueRecovered: 0,
    recoveryRate: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h1>Revenue Recovery Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Failed Payments</h3>
          <p>{stats.totalFailed}</p>
        </div>
        <div className="stat-card">
          <h3>Revenue Lost</h3>
          <p>₹{stats.revenueLost.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card">
          <h3>Revenue Recovered</h3>
          <p>₹{stats.revenueRecovered.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card">
          <h3>Recovery Rate</h3>
          <p>{stats.recoveryRate}%</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
