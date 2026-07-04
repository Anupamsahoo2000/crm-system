import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, 
  UserPlus, 
  Clock, 
  UserCheck, 
  AlertCircle, 
  TrendingUp, 
  History 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/stats');
      setData(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to fetch dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
          <p className="text-slate-400 text-sm font-medium animate-pulse">Loading Statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-950/20 border border-rose-900/50 p-6 rounded-2xl text-rose-300 flex flex-col items-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-rose-400" />
        <p className="font-semibold">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-2 px-4 py-2 bg-rose-900/40 hover:bg-rose-900/60 text-white rounded-xl text-xs font-semibold transition-all border border-rose-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { stats, recentVisitors, recentCustomers } = data || {};

  const statCards = [
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      description: 'Registered companies',
      icon: Users,
      colorClass: 'from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-400',
      glowClass: 'bg-blue-500/10'
    },
    {
      title: 'Active Customers',
      value: stats?.activeCustomers || 0,
      description: 'Active engagements',
      icon: TrendingUp,
      colorClass: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400',
      glowClass: 'bg-emerald-500/10'
    },
    {
      title: 'Visitors Today',
      value: stats?.visitorsToday || 0,
      description: 'Checked-in since midnight',
      icon: Clock,
      colorClass: 'from-amber-600/20 to-orange-600/20 border-amber-500/30 text-amber-400',
      glowClass: 'bg-amber-500/10'
    },
    {
      title: 'Checked-In Visitors',
      value: stats?.checkedInVisitors || 0,
      description: 'Currently in the premises',
      icon: UserCheck,
      colorClass: 'from-violet-600/20 to-fuchsia-600/20 border-violet-500/30 text-violet-400',
      glowClass: 'bg-violet-500/10'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-violet-950/40 border border-slate-800/80 p-8 rounded-2xl shadow-xl">
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px]"></div>
        <div className="z-10 relative">
          <h3 className="text-2xl font-bold text-slate-100">Welcome to CRM Command Center</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Monitor and manage onsite visits, customer relations, and check-in logs in real-time.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index}
              className={`relative overflow-hidden bg-gradient-to-br ${card.colorClass} border p-6 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl ${card.glowClass}`}></div>
              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{card.title}</p>
                  <p className="text-3xl font-extrabold text-slate-100 mt-2">{card.value}</p>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-3 z-10 relative">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Lists / Recent Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Visitors */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-md font-bold text-slate-200 flex items-center gap-2">
                <History className="h-4 w-4 text-violet-400" />
                Recent Visitors
              </h4>
              <Link 
                to="/visitors" 
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition"
              >
                Manage Visitors
              </Link>
            </div>
            
            {recentVisitors && recentVisitors.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-slate-500 text-sm">No recent visits recorded today.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentVisitors?.map((visitor) => (
                  <div 
                    key={visitor.id} 
                    className="flex justify-between items-center p-3.5 bg-slate-950/40 border border-slate-800/50 rounded-xl hover:border-slate-800 transition"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{visitor.visitorName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Meeting: <span className="text-slate-400">{visitor.personToMeet}</span> ({visitor.purpose})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                        visitor.status === 'Checked-In'
                          ? 'bg-emerald-950/50 border border-emerald-900/50 text-emerald-400'
                          : 'bg-slate-800/80 border border-slate-700/80 text-slate-400'
                      }`}>
                        {visitor.status}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1.5">
                        {new Date(visitor.checkInTime).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-md font-bold text-slate-200 flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-emerald-400" />
                Newly Added Customers
              </h4>
              <Link 
                to="/customers" 
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition"
              >
                Manage Customers
              </Link>
            </div>

            {recentCustomers && recentCustomers.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-slate-500 text-sm">No customers registered yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCustomers?.map((customer) => (
                  <div 
                    key={customer.id} 
                    className="flex justify-between items-center p-3.5 bg-slate-950/40 border border-slate-800/50 rounded-xl hover:border-slate-800 transition"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{customer.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{customer.company}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                        customer.status === 'Active'
                          ? 'bg-emerald-950/50 border border-emerald-900/50 text-emerald-400'
                          : 'bg-rose-950/50 border border-rose-900/50 text-rose-400'
                      }`}>
                        {customer.status}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1.5">
                        {new Date(customer.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
