import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, CheckCircle2, Send, CreditCard, ShieldCheck, Calendar, ShieldAlert, Clock, PauseCircle } from 'lucide-react';
import RazorpayModal from '../components/RazorpayModal';

function RecoveryCenterPage() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [workflowStatus, setWorkflowStatus] = useState(''); // '', 'sending', 'sent', 'recovered', 'p2p'
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [p2pDate, setP2pDate] = useState('');

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
    setP2pDate('');
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
      console.error("Error getting AI analysis", error);
    }
  };

  const handleStartRecovery = () => {
    setWorkflowStatus('sending');
    setTimeout(() => setWorkflowStatus('sent'), 1200);
  };

  const handleSetPromiseToPay = () => {
    setWorkflowStatus('p2p');
  };

  const handleRazorpaySuccess = async (paymentId) => {
    setShowRazorpayModal(false);
    try {
      await axios.post(`http://localhost:5000/api/razorpay/verify-payment`, { paymentId });
      setWorkflowStatus('recovered');
      setTimeout(() => {
        setSelectedPayment(null);
        fetchPayments();
      }, 2000);
    } catch (error) {
      console.error("Error recovering payment via Razorpay", error);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Razorpay Modal */}
      {showRazorpayModal && selectedPayment && (
        <RazorpayModal 
          payment={selectedPayment} 
          onClose={() => setShowRazorpayModal(false)}
          onSuccess={handleRazorpaySuccess}
        />
      )}

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Recovery Workflow & Guardrails</h1>
          <p className="text-slate-500 mt-1">Execute AI actions with compliant stopping rules & Promise-to-Pay tracking.</p>
        </div>

        {/* Guardrail Policy Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs">
          <ShieldAlert size={16} className="text-emerald-600" />
          <span>Stopping Rule: Auto-Halt on Paid • Max 3 Retries</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[620px] flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-800 flex justify-between items-center">
            <span>Action Queue</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{payments.length} Pending</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {payments.map(p => (
              <div 
                key={p._id} 
                onClick={() => handleSelect(p)}
                className={`p-4 cursor-pointer transition-colors ${selectedPayment?._id === p._id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800">{p.customerName}</span>
                  <span className="font-bold text-slate-800">₹{Number(p.amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex justify-between items-center">
                  <span>{p.failureReason}</span>
                  <span className="text-slate-400 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{p.razorpayPaymentId || 'pay_test'}</span>
                </div>
              </div>
            ))}
            {payments.length === 0 && <div className="p-8 text-center text-slate-500">Queue is empty.</div>}
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[620px] flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-800 flex justify-between items-center">
            <span>Execution Panel & Guardrails</span>
            {selectedPayment && (
              <span className="text-xs bg-slate-200 text-slate-700 font-mono font-bold px-2 py-0.5 rounded">Retry Attempt 1 of 3</span>
            )}
          </div>
          <div className="flex-1 p-8 overflow-y-auto">
            {!selectedPayment ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Play size={48} className="mb-4 opacity-30" />
                <p>Select a payment from the queue to begin recovery execution.</p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedPayment.customerName}</h2>
                    <p className="text-slate-500 text-sm">{selectedPayment.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">₹{Number(selectedPayment.amount).toLocaleString('en-IN')}</div>
                    <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded-md mt-1">
                      <CreditCard size={12}/> {selectedPayment.failureReason}
                    </div>
                  </div>
                </div>

                {!analysis ? (
                  <div className="flex items-center gap-3 text-blue-500 p-4 bg-blue-50 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    Generating AI Strategy...
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Send size={100} />
                      </div>
                      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm"><Send size={16}/> Delivery Preview ({analysis.bestChannel})</h3>
                      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-700">
                        {analysis.suggestedMessage}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 text-sm">Action Center & Controls</h3>
                        <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                          <ShieldCheck size={14} className="text-emerald-500" /> Compliant Escalation Policy
                        </span>
                      </div>
                      
                      {workflowStatus === '' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button onClick={handleStartRecovery} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs shadow-md">
                            <Play size={16} /> Dispatch Message via {analysis.bestChannel}
                          </button>
                          
                          {/* Promise to Pay Button */}
                          <button onClick={handleSetPromiseToPay} className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs">
                            <Calendar size={16} /> Track Promise-to-Pay (P2P)
                          </button>
                        </div>
                      )}
                      
                      {workflowStatus === 'sending' && (
                        <button disabled className="w-full bg-blue-400 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-wait text-xs">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Sending via {analysis.bestChannel}...
                        </button>
                      )}
                      
                      {workflowStatus === 'sent' && (
                        <div className="space-y-3 animate-in slide-in-from-bottom-2">
                          <div className="bg-green-50 border border-green-200 text-green-700 p-3.5 rounded-xl flex items-start gap-3 text-xs">
                            <CheckCircle2 className="shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold">Message Delivered to Customer</p>
                              <p className="text-slate-600 text-[11px] mt-0.5">The customer received the recovery link. Click below to test the Razorpay payment checkout experience.</p>
                            </div>
                          </div>

                          <button 
                            onClick={() => setShowRazorpayModal(true)} 
                            className="w-full bg-[#072654] hover:bg-blue-900 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs"
                          >
                            <ShieldCheck size={18} className="text-blue-400" />
                            Launch Razorpay Retry Checkout
                          </button>
                        </div>
                      )}

                      {workflowStatus === 'p2p' && (
                        <div className="bg-purple-50 border border-purple-200 text-purple-900 p-4 rounded-xl space-y-3 animate-in fade-in duration-200">
                          <div className="flex items-center gap-2">
                            <PauseCircle size={20} className="text-purple-600 shrink-0" />
                            <div>
                              <h4 className="font-bold text-xs">Promise-to-Pay (P2P) Activated</h4>
                              <p className="text-[11px] text-purple-700">Automated reminders paused. Transaction held in warm P2P queue.</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-purple-200">
                            <Clock size={14} className="text-purple-500" />
                            <span className="text-xs font-semibold text-slate-700">Scheduled Date: Next Salary Cycle (3 Days)</span>
                          </div>
                          <button onClick={() => setShowRazorpayModal(true)} className="w-full bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold py-2.5 rounded-lg">
                            Open Razorpay Checkout Now
                          </button>
                        </div>
                      )}
                      
                      {workflowStatus === 'recovered' && (
                        <div className="bg-green-600 text-white p-6 rounded-xl text-center animate-in zoom-in-95 shadow-lg">
                          <CheckCircle2 size={48} className="mx-auto mb-2" />
                          <h3 className="text-xl font-bold">Revenue Recovered!</h3>
                          <p className="text-green-100 text-xs mt-1">Stopping rule triggered: Retries halted & Razorpay transaction verified.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecoveryCenterPage;
