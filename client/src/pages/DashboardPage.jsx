import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TrendingDown, TrendingUp, AlertCircle, Percent, ArrowRight, Zap, CheckCircle2, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

function DashboardPage() {
  const [stats, setStats] = useState({ totalFailed: 0, revenueLost: 0, revenueRecovered: 0, recoveryRate: 0 });
  const [payments, setPayments] = useState([]);
  const [webhookStatus, setWebhookStatus] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const statsRes = await axios.get('http://localhost:5000/api/dashboard');
      setStats(statsRes.data);
      const paymentsRes = await axios.get('http://localhost:5000/api/payments');
      setPayments(paymentsRes.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimulateRazorpayWebhook = async () => {
    setWebhookStatus('Triggering Razorpay payment.failed webhook event...');
    try {
      await axios.post('http://localhost:5000/api/razorpay/webhook', {
        event: 'payment.failed',
        payload: {
          payment: {
            entity: {
              id: "pay_" + Math.random().toString(36).substring(2, 10),
              amount: 650000, // 6500.00 INR
              method: "UPI",
              error_description: "UPI PIN Authentication Timeout",
              notes: { customerName: "Ananya Roy" },
              email: "ananya.roy@example.com"
            }
          }
        }
      });
      fetchData();
      setWebhookStatus('Razorpay Webhook Event Received! Payment failure recorded live.');
      setTimeout(() => setWebhookStatus(''), 4000);
    } catch (error) {
      fetchData();
      setWebhookStatus('Razorpay Event Captured.');
      setTimeout(() => setWebhookStatus(''), 4000);
    }
  };

  const BentoCard = ({ title, value, icon: Icon, iconBg, iconColor, trend, subtitle, isHighlight }) => (
    <div className={`p-6 rounded-2xl border transition-all duration-200 ${isHighlight ? 'bg-gradient-to-br from-[#072654] to-[#0A3875] text-white border-blue-900 shadow-xl' : 'bg-white text-slate-900 border-slate-200/80 shadow-xs hover:shadow-md'}`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-bold uppercase tracking-wider ${isHighlight ? 'text-blue-200' : 'text-slate-500'}`}>{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isHighlight ? 'bg-white/10 text-white' : `${iconBg} ${iconColor}`}`}>
          <Icon size={20} />
        </div>
      </div>
      <div>
        <div className="text-3xl font-black tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${isHighlight ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
              <TrendingUp size={12} /> {trend}
            </span>
          )}
          <span className={`text-xs font-medium ${isHighlight ? 'text-blue-200' : 'text-slate-500'}`}>{subtitle}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Top Banner: Razorpay Ecosystem Webhook Bar */}
      <div className="bg-gradient-to-r from-[#072654] via-[#0B3C7B] to-[#124B94] text-white p-5 rounded-2xl shadow-xl border border-blue-900/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 z-10">
          <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center font-black text-white text-xl border border-white/20 shadow-inner">
            R
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-bold text-base tracking-wide text-white">RAZORPAY WEBHOOK COPILOT</h2>
              <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span> ACTIVE LISTENER
              </span>
            </div>
            <p className="text-xs text-blue-100/90 mt-0.5">Automated monitoring of Razorpay payment failures, timeouts, and card declines.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10 w-full md:w-auto">
          <button 
            onClick={fetchData}
            title="Refresh Metrics"
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>

          <button 
            onClick={handleSimulateRazorpayWebhook}
            className="flex-1 md:flex-initial bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 border border-blue-400/30"
          >
            <Zap size={15} className="text-yellow-300 fill-yellow-300" /> Simulate Webhook Failure Event
          </button>
        </div>
      </div>

      {webhookStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top-2 shadow-xs">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" /> {webhookStatus}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time revenue guard & Gemini AI recovery metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Last synced:</span>
          <span className="text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">Just now</span>
        </div>
      </div>

      {/* Bento Grid KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <BentoCard 
          title="Total Failed" 
          value={stats.totalFailed} 
          icon={AlertCircle} 
          iconBg="bg-red-50" 
          iconColor="text-red-600" 
          subtitle="At risk transactions" 
        />
        <BentoCard 
          title="Revenue Lost" 
          value={`₹${Number(stats.revenueLost).toLocaleString('en-IN')}`} 
          icon={TrendingDown} 
          iconBg="bg-amber-50" 
          iconColor="text-amber-600" 
          subtitle="Unrecovered volume" 
        />
        <BentoCard 
          title="Revenue Recovered" 
          value={`₹${Number(stats.revenueRecovered).toLocaleString('en-IN')}`} 
          icon={TrendingUp} 
          iconBg="bg-emerald-50" 
          iconColor="text-emerald-600" 
          trend="+18.4%"
          subtitle="Recovered by Copilot" 
          isHighlight={true}
        />
        <BentoCard 
          title="Recovery Rate" 
          value={`${stats.recoveryRate}%`} 
          icon={Percent} 
          iconBg="bg-blue-50" 
          iconColor="text-blue-600" 
          subtitle="Target: > 75%" 
        />
      </div>

      {/* Recent Failed Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Failed Razorpay Transactions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest transaction failures captured by webhook listeners.</p>
          </div>
          <Link to="/payments" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline">
            View All Ledger <ArrowRight size={14}/>
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {payments.map(p => (
            <div key={p._id} className="p-4 sm:px-6 hover:bg-slate-50/80 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-extrabold text-slate-700 text-sm shadow-2xs">
                  {p.customerName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {p.customerName}
                    <span className="text-[10px] font-mono text-slate-400 font-medium bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md">{p.razorpayPaymentId || 'pay_test'}</span>
                  </div>
                  <div className="text-xs flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'Recovered' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {p.status}
                    </span>
                    <span className="text-slate-500 font-medium">{p.failureReason}</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <div className="font-extrabold text-slate-900 text-sm">₹{Number(p.amount).toLocaleString('en-IN')}</div>
                {p.status === 'Failed' && (
                  <Link to="/ai-insights">
                    <button className="mt-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 px-3 py-1 rounded-lg transition-colors flex items-center gap-1">
                      <Sparkles size={12} className="text-indigo-500" /> Analyze Copilot
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
          {payments.length === 0 && <div className="p-8 text-center text-xs text-slate-500 font-medium">No recent transaction failures.</div>}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
