import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RecoveryCenter() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [workflowStatus, setWorkflowStatus] = useState('');

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments');
      setPayments(response.data.filter(p => p.status === 'Failed'));
    } catch (error) {
      console.error("Error fetching payments", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSelect = async (payment) => {
    setSelectedPayment(payment);
    setAnalysis(null);
    setWorkflowStatus('');
    try {
      // First try to analyze/get cached analysis
      const response = await axios.post('http://localhost:5000/api/ai/analyze', {
        paymentId: payment._id,
        amount: payment.amount,
        method: payment.method,
        failureReason: payment.failureReason,
        customerName: payment.customerName
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error getting AI analysis", error);
    }
  };

  const handleStartRecovery = () => {
    setWorkflowStatus('sending');
    setTimeout(() => {
      setWorkflowStatus('sent');
    }, 1500);
  };

  const handleMarkRecovered = async () => {
    try {
      await axios.post(`http://localhost:5000/api/payments/recover/${selectedPayment._id}`);
      setWorkflowStatus('recovered');
      setTimeout(() => {
        setSelectedPayment(null);
        fetchPayments();
      }, 2000);
    } catch (error) {
      console.error("Error recovering payment", error);
    }
  };

  return (
    <div>
      <h1>Recovery Center Workflow</h1>
      <p>Execute AI-recommended recovery actions and close the loop.</p>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div className="table-container" style={{ flex: 1, marginTop: 0 }}>
          <h2>Queue</h2>
          <table style={{ cursor: 'pointer' }}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id} onClick={() => handleSelect(p)} style={{ backgroundColor: selectedPayment?._id === p._id ? '#e8f0fe' : 'transparent' }}>
                  <td>{p.customerName}</td>
                  <td>₹{p.amount}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="2">No pending payments.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="form-container" style={{ flex: 2, marginTop: 0 }}>
          <h2>Recovery Workflow</h2>
          {!selectedPayment ? (
            <p>Select a payment from the queue to start recovery.</p>
          ) : (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <strong>Customer:</strong> {selectedPayment.customerName} | <strong>Amount:</strong> ₹{selectedPayment.amount} <br/>
                <strong>Reason:</strong> {selectedPayment.failureReason}
              </div>

              {!analysis ? (
                <p>Loading AI Strategy...</p>
              ) : (
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <h3 style={{ marginTop: 0, color: '#1a73e8' }}>AI Recommended Action</h3>
                  <p>Send message via <strong>{analysis.bestChannel}</strong> (Probability: {analysis.recoveryProbability}%)</p>
                  <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px', borderLeft: '4px solid #1a73e8', fontStyle: 'italic', marginBottom: '20px' }}>
                    {analysis.suggestedMessage}
                  </div>

                  {workflowStatus === '' && (
                    <button onClick={handleStartRecovery} style={{ width: '100%' }}>Start Recovery</button>
                  )}
                  {workflowStatus === 'sending' && (
                    <button disabled style={{ width: '100%', backgroundColor: '#aaa' }}>Executing via {analysis.bestChannel}...</button>
                  )}
                  {workflowStatus === 'sent' && (
                    <div>
                      <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px' }}>
                        Message sent successfully to {selectedPayment.customerName}!
                      </div>
                      <button onClick={handleMarkRecovered} style={{ width: '100%', backgroundColor: '#28a745' }}>Mark Payment Recovered</button>
                    </div>
                  )}
                  {workflowStatus === 'recovered' && (
                    <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', fontWeight: 'bold' }}>
                      Revenue Recovered! Refreshing queue...
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecoveryCenter;
