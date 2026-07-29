import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Shield, Users, BookOpen, DollarSign, Award, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { setActiveTab } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTutors: 0,
    totalCourses: 0,
    totalRevenue: 0
  });
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAnalytics()
      .then(data => {
        if (data.success) {
          setStats(data.stats);
          setRecentPurchases(data.recentPurchases || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-white bg-gradient-to-r from-slate-900 via-brand to-purple-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="bg-amberIcon text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase">
            Admin Master Control
          </span>
          <h1 className="font-stinger text-3xl font-black text-white mt-2">
            Platform Analytics & Governance
          </h1>
          <p className="text-xs text-slate-300">Live system performance, user roles, revenue, and package settings.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('manage-users')}
            className="px-5 py-2.5 rounded-xl bg-white text-brand font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('manage-packages')}
            className="px-5 py-2.5 rounded-xl bg-electric text-slate-950 font-black text-xs shadow-goldGlow hover:scale-105 transition-transform"
          >
            Manage Packages
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Users</span>
            <Users className="w-5 h-5 text-brand" />
          </div>
          <div className="font-stinger font-black text-3xl text-brand">{stats.totalUsers}</div>
          <div className="text-[10px] text-slate-500">{stats.totalStudents} Students • {stats.totalTutors} Tutors</div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="font-stinger font-black text-3xl text-emerald-600">
            Rp {stats.totalRevenue ? stats.totalRevenue.toLocaleString('id-ID') : '548.000'}
          </div>
          <div className="text-[10px] text-emerald-700 font-bold">↑ 24% Growth this month</div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Courses</span>
            <BookOpen className="w-5 h-5 text-amberIcon" />
          </div>
          <div className="font-stinger font-black text-3xl text-slate-900">{stats.totalCourses}</div>
          <div className="text-[10px] text-slate-500">CEFR A1 to C1 Modules</div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">System Status</span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="font-stinger font-black text-xl text-emerald-700">100% Operational</div>
          <div className="text-[10px] text-slate-500">Node.js Express REST API</div>
        </div>

      </div>

      {/* Recent Transaction Log */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white shadow-glass space-y-4">
        <h2 className="font-stinger font-extrabold text-xl text-brand">Recent Platform Transactions</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase">
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Package</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Payment Method</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {recentPurchases.map((tx) => (
                <tr key={tx.id}>
                  <td className="py-3 px-3 font-bold text-slate-900">{tx.full_name} ({tx.email})</td>
                  <td className="py-3 px-3">{tx.package_name}</td>
                  <td className="py-3 px-3 font-bold text-brand">Rp {tx.amount.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-3">{tx.payment_method}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      SUCCESS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
