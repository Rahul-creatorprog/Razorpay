import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Bot, Clock, MessageSquare, ShieldCheck, Target, Award, Gift, Languages } from 'lucide-react';

function AIInsightsPage() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English'); // 'English' or 'Hinglish'

  useEffect(() => {
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

  const handleAnalyze = async (payment, lang = language) => {
    setSelectedPayment(payment);
    setLoading(true);
    setAnalysis(null);
    try {
      const response = await axios.post('http://localhost:5000/api/ai/analyze', {
        paymentId: payment._id,
        amount: payment.amount,
        method: payment.method,
        failureReason: payment.failureReason,
        customerName: payment.customerName,
        language: lang
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error analyzing with AI", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageToggle = (lang) => {
    setLanguage(lang);
    if (selectedPayment) {
      handleAnalyze(selectedPayment, lang);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI Revenue Recovery Copilot</h1>
          <p className="text-slate-500 mt-1">Predict recovery likelihood, customer intent, and optimal re-engagement strategy.</p>
        </div>

        {/* Hinglish / English Toggle */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl shadow-xs">
          <Languages size={16} className="text-slate-400 ml-2" />
          <button
            onClick={() => handleLanguageToggle('English')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${language === 'English' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageToggle('Hinglish')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${language === 'Hinglish' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Hinglish 🇮🇳
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800">Pending Failures Queue</h3>
              <p className="text-sm text-slate-500">Select a payment to run the Copilot decision engine.</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">{payments.length} Pending</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {payments.map(p => (
              <div 
                key={p._id} 
                onClick={() => handleAnalyze(p, language)}
                className={`p-4 m-2 rounded-xl border cursor-pointer transition-all ${selectedPayment?._id === p._id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-800">{p.customerName}</div>
                    <div className="text-xs text-slate-500 mt-1">{p.failureReason}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800">₹{Number(p.amount).toLocaleString('en-IN')}</div>
                    <div className="text-xs text-slate-400 mt-1">{p.method}</div>
                  </div>
                </div>
              </div>
            ))}
            {payments.length === 0 && (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                <ShieldCheck size={48} className="text-green-400 mb-4" />
                <p>No pending failed payments.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-[650px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-blue-50 opacity-50 pointer-events-none -mt-4 -mr-4">
            <Sparkles size={120} />
          </div>
          
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="text-blue-600" />
              <h3 className="font-bold text-slate-800">Gemini Copilot Insights</h3>
            </div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              Mode: {language}
            </span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {!selectedPayment && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <Bot size={48} className="mb-4 opacity-50" />
                <p>Select a payment from the queue to run the AI Copilot.</p>
              </div>
            )}
            
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-blue-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="animate-pulse font-medium">Gemini Copilot is generating {language} strategy...</p>
              </div>
            )}
            
            {analysis && !loading && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-center">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">Recovery Score</span>
                    <div className="text-xl font-black text-blue-900">{analysis.recoveryProbability}%</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-center">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Customer Intent</span>
                    <div className="text-sm font-bold text-emerald-900 flex items-center justify-center gap-1 mt-1">
                      <Target size={14} /> {analysis.customerIntent || "High Intent"}
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 text-center">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mb-1">Customer Value</span>
                    <div className="text-sm font-bold text-purple-900 flex items-center justify-center gap-1 mt-1">
                      <Award size={14} /> {analysis.customerValue || "Tier 1 High Value"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Recommended Channel</span>
                    <div className="text-base font-bold text-slate-800 mt-1">{analysis.bestChannel}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Optimal Retry Time</span>
                    <div className="text-base font-bold text-slate-800 mt-1 flex items-center gap-1">
                      <Clock size={14} className="text-blue-600" /> {analysis.retryTime}
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3">
                  <Gift size={20} className="text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Incentive Strategy</span>
                    <div className="text-sm font-bold text-amber-900">{analysis.incentiveStrategy || "No Discount Required (High Intent)"}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-2 flex items-center gap-2">
                    <MessageSquare size={16}/> AI Message ({language})
                  </h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 italic shadow-inner relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl"></div>
                    "{language === 'Hinglish' && !analysis.suggestedMessage.includes('Aapka') 
                      ? `Hi ${selectedPayment.customerName}, Aapka ₹${selectedPayment.amount} ka payment ${selectedPayment.failureReason} ki wajah se fail ho gaya. Abhi click karke Razorpay se securely complete karein: https://rzp.io/l/recoverai-retry`
                      : analysis.suggestedMessage}"
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIInsightsPage;
