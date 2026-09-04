import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, BarChart3, Activity } from 'lucide-react';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@recoverai.io');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({ name: 'Admin Merchant', email, role: 'Merchant Admin' });
      navigate('/');
    }, 500);
  };

  const handleRoleDemoLogin = (roleName, roleTitle, targetPath = '/') => {
    setLoading(true);
    setTimeout(() => {
      onLogin({ name: roleName, email: `${roleName.toLowerCase().replace(' ', '')}@recoverai.io`, role: roleTitle });
      navigate(targetPath);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              R
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">RecoverAI</h1>
              <p className="text-xs text-blue-600 font-medium tracking-wide uppercase">Revenue Recovery Platform</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Unified Role Access Portal</h2>
            <p className="text-sm text-slate-500 mt-1">Select a role or enter credentials to sign in.</p>
          </div>

          {/* Quick Demo Role Switcher Cards */}
          <div className="mb-6 space-y-2">
            <div className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Quick Role Access</div>
            
            <button
              onClick={() => handleRoleDemoLogin('Vikram Merchant', 'Merchant Admin', '/')}
              className="w-full bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 p-3 rounded-xl flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">👑</div>
                <div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-blue-700">Merchant Admin</div>
                  <div className="text-[10px] text-slate-500">Full Access • Executive Dashboard</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-600" />
            </button>

            <button
              onClick={() => handleRoleDemoLogin('Ananya Roy', 'RevOps Lead', '/recovery')}
              className="w-full bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 p-3 rounded-xl flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">📈</div>
                <div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-purple-700">RevOps Manager</div>
                  <div className="text-[10px] text-slate-500">Recovery Workflows & P2P Tracker</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-purple-600" />
            </button>

            <button
              onClick={() => handleRoleDemoLogin('Karan Sharma', 'Finance Lead', '/payments')}
              className="w-full bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 p-3 rounded-xl flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">🧾</div>
                <div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-700">Finance & Audit Lead</div>
                  <div className="text-[10px] text-slate-500">Transactions Ledger & CSV Export</div>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-emerald-600" />
            </button>
          </div>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <span className="relative bg-white px-3 text-[10px] text-slate-400 uppercase tracking-wider">or sign in with password</span>
          </div>

          <form onSubmit={handleSignIn} className="space-y-3">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@recoverai.io"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md text-xs"
            >
              {loading ? 'Authenticating...' : 'Sign In as Custom User'}
            </button>
          </form>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
          Powered by <span className="font-semibold text-slate-700">Gemini AI</span> & <span className="font-semibold text-slate-700">Razorpay RBAC</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
