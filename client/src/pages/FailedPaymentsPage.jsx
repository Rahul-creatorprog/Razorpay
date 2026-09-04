import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, CheckCircle2, Search, Filter, Download } from 'lucide-react';

function FailedPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({ customerName: '', email: '', amount: '', method: 'UPI', failureReason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments');
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments", error);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    try {
      const res = await axios.post('http://localhost:5000/api/payments/fail', { ...formData, amount: Number(formData.amount) });
      if (res.data) {
        setPayments(prev => [res.data, ...prev]);
        setSuccessMsg(`Simulated payment failure for ${res.data.customerName}!`);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
      setFormData({ customerName: '', email: '', amount: '', method: 'UPI', failureReason: '' });
    } catch (error) {
      console.error("Error creating payment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = "Razorpay Payment ID,Customer Name,Email,Amount (INR),Method,Failure Reason,Status,Date\n";
    const rows = payments.map(p => 
      `"${p.razorpayPaymentId || 'pay_test'}","${p.customerName}","${p.email}",${p.amount},"${p.method}","${p.failureReason}","${p.status}","${new Date(p.createdAt).toLocaleDateString()}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RecoverAI_Audit_Trail_${Date.now()}.csv`;
    a.click();
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAtRisk = payments.filter(p => p.status === 'Failed').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Failed Transactions Ledger</h1>
          <p className="text-slate-500 mt-1">Real-time Razorpay payment failure records and manual simulations.</p>
        </div>

        {/* Export Audit Trail CSV */}
        <button
          onClick={handleExportCSV}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-xs flex items-center gap-2"
        >
          <Download size={15} className="text-blue-600" /> Export Audit Trail (CSV)
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
          <CheckCircle2 size={20} className="text-green-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -z-10"></div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total At Risk</span>
          <div className="text-3xl font-bold text-slate-800 mt-2">₹{totalAtRisk.toLocaleString('en-IN')}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Recovery</span>
          <div className="text-3xl font-bold text-slate-800 mt-2">{payments.filter(p => p.status === 'Failed').length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Successfully Recovered</span>
          <div className="text-3xl font-bold text-green-600 mt-2">{payments.filter(p => p.status === 'Recovered').length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Report / Test Failure</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                <input type="text" required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Rahul Sharma" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. rahul@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 2500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                <select value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Failure Reason</label>
                <input type="text" required placeholder="e.g. Insufficient Funds" value={formData.failureReason} onChange={e => setFormData({...formData, failureReason: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                {isSubmitting ? 'Simulating...' : <><Plus size={18}/> Simulate Payment Failure</>}
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Search & Filter Bar */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, email, Payment ID..."
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Failed">Failed Only</option>
                  <option value="Recovered">Recovered Only</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Razorpay ID</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount (₹)</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Method</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredPayments.map(p => (
                    <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900">
                        <div>{p.customerName}</div>
                        <div className="text-xs text-slate-400 font-normal">{p.email}</div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-500">
                        {p.razorpayPaymentId || 'pay_NkJ' + p._id.substring(0,6)}
                      </td>
                      <td className="py-4 px-6 text-right font-semibold">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                      <td className="py-4 px-6 text-slate-600"><span className="px-2 py-1 bg-slate-100 rounded text-xs">{p.method}</span></td>
                      <td className="py-4 px-6 text-slate-500">{p.failureReason}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === 'Recovered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredPayments.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-slate-500">No matching failed transactions found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FailedPaymentsPage;
