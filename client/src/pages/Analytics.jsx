import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a28bfe'];

function Analytics() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payments');
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments", error);
      }
    };
    fetchPayments();
  }, []);

  // Prepare data for Failure Reasons Pie Chart
  const reasonMap = {};
  payments.forEach(p => {
    if (p.status === 'Failed') {
      reasonMap[p.failureReason] = (reasonMap[p.failureReason] || 0) + 1;
    }
  });
  const reasonData = Object.keys(reasonMap).map(key => ({
    name: key,
    value: reasonMap[key]
  }));

  // Prepare data for Revenue Chart
  const revenueData = [
    {
      name: 'Total Tracked',
      Lost: payments.filter(p => p.status === 'Failed').reduce((acc, curr) => acc + curr.amount, 0),
      Recovered: payments.filter(p => p.status === 'Recovered').reduce((acc, curr) => acc + curr.amount, 0)
    }
  ];

  return (
    <div>
      <h1>Analytics</h1>
      <p>Visualize failure reasons and revenue recovery trends.</p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        
        <div className="stat-card" style={{ flex: 1, minWidth: '400px' }}>
          <h3>Failure Reasons</h3>
          {reasonData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={reasonData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                  {reasonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No failed payments data available.</p>
          )}
        </div>

        <div className="stat-card" style={{ flex: 1, minWidth: '400px' }}>
          <h3>Revenue Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Lost" fill="#ff4d4f" />
              <Bar dataKey="Recovered" fill="#52c41a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Analytics;
