import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FailedPayments() {
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    amount: '',
    method: 'UPI',
    failureReason: ''
  });

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments');
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/payments/fail', {
        ...formData,
        amount: Number(formData.amount)
      });
      fetchPayments();
      setFormData({ customerName: '', email: '', amount: '', method: 'UPI', failureReason: '' });
    } catch (error) {
      console.error("Error creating payment", error);
    }
  };

  return (
    <div>
      <h1>Failed Payment Management</h1>
      
      <div className="form-container">
        <h2>Report Failed Payment</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Customer Name" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} required />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="number" placeholder="Amount (₹)" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
          <select value={formData.method} onChange={(e) => setFormData({...formData, method: e.target.value})}>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>
          <input type="text" placeholder="Failure Reason (e.g. Timeout)" value={formData.failureReason} onChange={(e) => setFormData({...formData, failureReason: e.target.value})} required />
          <button type="submit">Save to MongoDB</button>
        </form>
      </div>

      <div className="table-container">
        <h2>Recent Failures</h2>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id}>
                <td>{p.customerName}</td>
                <td>₹{p.amount}</td>
                <td>{p.method}</td>
                <td>{p.failureReason}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FailedPayments;
