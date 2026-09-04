import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function AnalyticsPage() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payments');
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments", error);
      }
    };
    fetchPayments();
  }, []);

  const reasonMap = {};
  payments.forEach(p => {
    if (p.status === 'Failed') {
      reasonMap[p.failureReason] = (reasonMap[p.failureReason] || 0) + 1;
    }
  });
  const reasonData = Object.keys(reasonMap).map(key => ({ name: key, value: reasonMap[key] }));

  const revenueData = [
    {
      name: 'Total Portfolio',
      Lost: payments.filter(p => p.status === 'Failed').reduce((acc, curr) => acc + curr.amount, 0),
      Recovered: payments.filter(p => p.status === 'Recovered').reduce((acc, curr) => acc + curr.amount, 0)
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Analytics & Reports</h1>
        <p className="text-slate-500 mt-1">Deep dive into failure reasons and revenue impact.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <PieChartIcon className="text-blue-600" />
            <h3 className="font-bold text-slate-800">Current Failure Reasons</h3>
          </div>
          <div className="flex-1 p-6 flex items-center justify-center">
            {reasonData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={reasonData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" label>
                    {reasonData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip wrapperClassName="rounded-lg shadow-lg border-none" />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400">No active failure data.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <BarChart3 className="text-blue-600" />
            <h3 className="font-bold text-slate-800">Revenue Impact (Lost vs Recovered)</h3>
          </div>
          <div className="flex-1 p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barSize={80}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip cursor={{fill: 'transparent'}} wrapperClassName="rounded-lg shadow-lg border-none" />
                <Legend />
                <Bar dataKey="Lost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Recovered" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
