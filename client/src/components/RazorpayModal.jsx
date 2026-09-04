import React, { useState } from 'react';
import { ShieldCheck, Lock, QrCode, CreditCard, Landmark, CheckCircle2, X, Sparkles } from 'lucide-react';

function RazorpayModal({ payment, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [upiId, setUpiId] = useState('customer@okaxis');

  if (!payment) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(payment._id);
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 relative animate-in zoom-in-95 duration-200">
        
        {/* Razorpay Brand Header */}
        <div className="bg-[#072654] text-white p-5 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center font-bold text-xs">R</div>
            <span className="font-bold tracking-tight text-sm text-slate-100">RAZORPAY CHECKOUT</span>
            <span className="ml-auto flex items-center gap-1 text-[10px] bg-blue-900/60 px-2 py-0.5 rounded text-blue-200 font-medium">
              <Lock size={10} /> Test Mode
            </span>
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-300">RecoverAI Retry Payment</p>
              <h3 className="font-bold text-lg text-white">{payment.customerName}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-300 block">Amount to Pay</span>
              <span className="text-2xl font-black text-white">₹{Number(payment.amount).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-8 text-center bg-green-50/50 flex flex-col items-center justify-center min-h-[320px] animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">Payment Successful!</h3>
            <p className="text-sm text-slate-600 mb-4">Razorpay Payment ID: <span className="font-mono text-slate-800 font-semibold">{payment.razorpayPaymentId || "pay_" + Math.random().toString(36).substring(2,10)}</span></p>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Sparkles size={14} /> Revenue Recovered Successfully
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Payment Method Selector Tabs */}
            <div className="flex border-b border-slate-200 mb-5">
              <button
                onClick={() => setActiveTab('upi')}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors ${activeTab === 'upi' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <QrCode size={16} /> UPI / QR
              </button>
              <button
                onClick={() => setActiveTab('card')}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors ${activeTab === 'card' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <CreditCard size={16} /> Card
              </button>
              <button
                onClick={() => setActiveTab('netbanking')}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors ${activeTab === 'netbanking' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <Landmark size={16} /> Netbanking
              </button>
            </div>

            {/* UPI Tab */}
            {activeTab === 'upi' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <div className="w-32 h-32 bg-white p-2 mx-auto rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                    <QrCode size={90} className="text-slate-800" />
                    <span className="text-[10px] text-slate-400 font-medium mt-1">Scan with any UPI App</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Or Enter VPA / UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="user@upi"
                  />
                </div>
              </div>
            )}

            {/* Card Tab */}
            {activeTab === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4111 2222 3333 4444"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Expiry</label>
                    <input
                      type="text"
                      defaultValue="12/28"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">CVV</label>
                    <input
                      type="password"
                      defaultValue="123"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Netbanking Tab */}
            {activeTab === 'netbanking' && (
              <div className="grid grid-cols-2 gap-2 my-4">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-blue-500 cursor-pointer text-center">
                    {bank}
                  </div>
                ))}
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full mt-6 bg-[#072654] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Processing with Razorpay...
                </div>
              ) : (
                <>Pay ₹{Number(payment.amount).toLocaleString('en-IN')}</>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck size={14} className="text-green-600" />
              Secured by 256-bit Razorpay Encryption
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RazorpayModal;
