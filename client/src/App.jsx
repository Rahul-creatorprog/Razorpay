import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, BrainCircuit, Activity, BarChart3, Bell, Search, UserCircle, LogOut, ShieldCheck, Zap, Layers } from 'lucide-react';
import DashboardPage from './pages/DashboardPage';
import FailedPaymentsPage from './pages/FailedPaymentsPage';
import AIInsightsPage from './pages/AIInsightsPage';
import RecoveryCenterPage from './pages/RecoveryCenterPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';

function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
    { path: '/payments', label: 'Failed Transactions', icon: Receipt },
    { path: '/ai-insights', label: 'AI Copilot Engine', icon: BrainCircuit, badge: 'Gemini' },
    { path: '/recovery', label: 'Recovery Workflow', icon: Activity },
    { path: '/analytics', label: 'Revenue Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-[#071A2F] h-screen fixed left-0 top-0 text-slate-300 flex flex-col shadow-2xl z-50 border-r border-slate-800/60">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/20">
            R
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white">RecoverAI</span>
              <span className="text-[9px] bg-blue-500/20 text-blue-400 font-bold px-1.5 py-0.2 rounded border border-blue-500/30">COPILOT</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Razorpay Revenue Guard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Navigation</div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400 transition-colors'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Environment Status & User Footer */}
      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#051323]">
        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Razorpay Webhook</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">ONLINE</span>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-600">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="text-xs truncate">
              <p className="font-semibold text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-slate-400 text-[10px] truncate">{user?.role || 'Razorpay Merchant'}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ user }) {
  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-8 sticky top-0 z-40 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-400 bg-slate-100/80 px-3.5 py-1.5 rounded-xl border border-slate-200 w-80 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <Search size={16} />
          <input type="text" placeholder="Search payments, customers, Payment IDs..." className="bg-transparent border-none outline-none w-full text-xs text-slate-700 placeholder-slate-400" />
        </div>
      </div>

      <div className="flex items-center gap-4 text-slate-600">
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
          <ShieldCheck size={14} className="text-blue-600" /> Razorpay Test Environment
        </div>
        
        <button className="hover:text-blue-600 transition-colors p-2 rounded-xl hover:bg-slate-100 relative">
          <Bell size={18} />
          <span className="w-2 h-2 bg-blue-600 rounded-full absolute top-1.5 right-1.5"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <span className="text-xs font-semibold text-slate-700 hidden md:block">{user?.name || 'Razorpay Merchant'}</span>
        </div>
      </div>
    </header>
  );
}

function ProtectedLayout({ user, onLogout, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans antialiased">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Topbar user={user} />
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('recoverai_user');
    return saved ? JSON.parse(saved) : { name: 'Demo Merchant', email: 'merchant@razorpay.com', role: 'Razorpay Partner' };
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('recoverai_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('recoverai_user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        
        <Route path="/" element={<ProtectedLayout user={user} onLogout={handleLogout}><DashboardPage /></ProtectedLayout>} />
        <Route path="/payments" element={<ProtectedLayout user={user} onLogout={handleLogout}><FailedPaymentsPage /></ProtectedLayout>} />
        <Route path="/ai-insights" element={<ProtectedLayout user={user} onLogout={handleLogout}><AIInsightsPage /></ProtectedLayout>} />
        <Route path="/recovery" element={<ProtectedLayout user={user} onLogout={handleLogout}><RecoveryCenterPage /></ProtectedLayout>} />
        <Route path="/analytics" element={<ProtectedLayout user={user} onLogout={handleLogout}><AnalyticsPage /></ProtectedLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;