import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AIInsights() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch only failed payments for analysis
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payments');
        setPayments(response.data.filter(p => p.status === 'Failed'));
      } catch (error) {
        console.error("Error fetching payments", error);
      }
    };
    fetchPayments();
  }, []);

  const handleAnalyze = async (payment) => {
    setSelectedPayment(payment);
    setLoading(true);
    setAnalysis(null);
    try {
      const response = await axios.post('http://localhost:5000/api/ai/analyze', {
        paymentId: payment._id,
        amount: payment.amount,
        method: payment.method,
        failureReason: payment.failureReason,
        customerName: payment.customerName
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error analyzing with AI", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Insights & Strategy</h1>
      <p>Select a failed payment to let Gemini analyze the best recovery approach and generate a message.</p>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div className="table-container" style={{ flex: 1, marginTop: 0 }}>
          <h2>Pending Failures</h2>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id}>
                  <td>{p.customerName}</td>
                  <td>₹{p.amount}</td>
                  <td>{p.failureReason}</td>
                  <td>
                    <button onClick={() => handleAnalyze(p)}>Analyze</button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="4">No pending failed payments to analyze.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="form-container" style={{ flex: 1, marginTop: 0 }}>
          <h2>Gemini Analysis</h2>
          {!selectedPayment && !loading && <p>Select a payment to view analysis.</p>}
          {loading && <p>Gemini is analyzing...</p>}
          
          {analysis && (
            <div>
              <h3>Recovery Strategy</h3>
              <p><strong>Probability:</strong> {analysis.recoveryProbability}%</p>
              <p><strong>Best Channel:</strong> {analysis.bestChannel}</p>
              <p><strong>Retry Time:</strong> {analysis.retryTime}</p>
              
              <h3 style={{ marginTop: '20px' }}>Generated Message</h3>
              <div style={{ padding: '15px', backgroundColor: '#f0f4f8', borderRadius: '4px', fontStyle: 'italic' }}>
                {analysis.suggestedMessage}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIInsights;
