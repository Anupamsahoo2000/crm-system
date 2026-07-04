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
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useAuth();

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
      <div className={`border p-6 rounded-2xl flex flex-col items-center gap-3 text-center ${
        theme === 'dark' ? 'bg-rose-950/20 border-rose-900/50 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
      }`}>
        <AlertCircle className="h-10 w-10 text-rose-500" />
        <p className="font-semibold">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className={`mt-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
            theme === 'dark' 
              ? 'bg-rose-900/40 hover:bg-rose-900/60 text-white border-rose-800' 
              : 'bg-white hover:bg-rose-100 text-rose-700 border-rose-300 shadow-sm'
          }`}
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
      colorClass: theme === 'dark' 
        ? 'from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-400 bg-slate-900/45' 
        : 'from-blue-50 to-cyan-50 border-blue-200 text-blue-600 bg-white',
      glowClass: 'bg-blue-500/10'
    },
    {
      title: 'Active Customers',
      value: stats?.activeCustomers || 0,
      description: 'Active engagements',
      icon: TrendingUp,
      colorClass: theme === 'dark' 
        ? 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400 bg-slate-900/45' 
        : 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-600 bg-white',
      glowClass: 'bg-emerald-500/10'
    },
    {
      title: 'Visitors Today',
      value: stats?.visitorsToday || 0,
      description: 'Checked-in since midnight',
      icon: Clock,
      colorClass: theme === 'dark' 
        ? 'from-amber-600/20 to-orange-600/20 border-amber-500/30 text-amber-400 bg-slate-900/45' 
        : 'from-amber-50 to-orange-50 border-amber-200 text-amber-600 bg-white',
      glowClass: 'bg-amber-500/10'
    },
    {
      title: 'Checked-In Visitors',
      value: stats?.checkedInVisitors || 0,
      description: 'Currently in the premises',
      icon: UserCheck,
      colorClass: theme === 'dark' 
        ? 'from-violet-600/20 to-fuchsia-600/20 border-violet-500/30 text-violet-400 bg-slate-900/45' 
        : 'from-violet-50 to-fuchsia-50 border-violet-200 text-violet-600 bg-white',
      glowClass: 'bg-violet-500/10'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className={`relative overflow-hidden border p-8 rounded-2xl transition-all duration-200 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-violet-950/40 border-slate-800/80 shadow-xl' 
          : 'bg-gradient-to-r from-white via-white to-violet-50/20 border-slate-200 shadow-md'
      }`}>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px]"></div>
        <div className="z-10 relative">
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-850'}`}>Welcome to CRM Command Center</h3>
          <p className={`text-sm mt-1 max-w-xl ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
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
              className={`relative overflow-hidden border p-6 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 ${card.colorClass}`}
            >
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl ${card.glowClass}`}></div>
              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{card.title}</p>
                  <p className={`text-3xl font-extrabold mt-2 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{card.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100/60 border-slate-200'}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className={`text-[11px] font-medium mt-3 z-10 relative ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Lists / Recent Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Visitors */}
        <div className={`border rounded-2xl p-6 shadow-md flex flex-col justify-between transition-all duration-200 ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80 shadow-xl' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className={`text-md font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-slate-250' : 'text-slate-800'}`}>
                <History className="h-4 w-4 text-violet-500" />
                Recent Visitors
              </h4>
              <Link 
                to="/visitors" 
                className="text-xs text-violet-500 hover:text-violet-600 font-semibold transition"
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
                    className={`flex justify-between items-center p-3.5 border rounded-xl transition ${
                      theme === 'dark' 
                        ? 'bg-slate-950/40 border-slate-800/50 hover:border-slate-800' 
                        : 'bg-slate-50/50 border-slate-200/60 hover:border-slate-250 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-850'}`}>{visitor.visitorName}</p>
                      <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                        Meeting: <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}>{visitor.personToMeet}</span> ({visitor.purpose})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                        visitor.status === 'Checked-In'
                          ? theme === 'dark'
                            ? 'bg-emerald-950/50 border border-emerald-900/50 text-emerald-400'
                            : 'bg-emerald-50 border border-emerald-100 text-emerald-600'
                          : theme === 'dark'
                            ? 'bg-slate-800/80 border border-slate-700/80 text-slate-400'
                            : 'bg-slate-100 border border-slate-200 text-slate-500'
                      }`}>
                        {visitor.status}
                      </span>
                      <p className={`text-[10px] mt-1.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-450'}`}>
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
        <div className={`border rounded-2xl p-6 shadow-md flex flex-col justify-between transition-all duration-200 ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80 shadow-xl' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className={`text-md font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-slate-250' : 'text-slate-800'}`}>
                <UserPlus className="h-4 w-4 text-emerald-500" />
                Newly Added Customers
              </h4>
              <Link 
                to="/customers" 
                className="text-xs text-emerald-500 hover:text-emerald-600 font-semibold transition"
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
                    className={`flex justify-between items-center p-3.5 border rounded-xl transition ${
                      theme === 'dark' 
                        ? 'bg-slate-950/40 border-slate-800/50 hover:border-slate-800' 
                        : 'bg-slate-50/50 border-slate-200/60 hover:border-slate-250 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-850'}`}>{customer.name}</p>
                      <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{customer.company}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                        customer.status === 'Active'
                          ? theme === 'dark'
                            ? 'bg-emerald-950/50 border border-emerald-900/50 text-emerald-400'
                            : 'bg-emerald-50 border border-emerald-100 text-emerald-600'
                          : theme === 'dark'
                            ? 'bg-rose-950/50 border border-rose-900/50 text-rose-400'
                            : 'bg-rose-50 border border-rose-100 text-rose-600'
                      }`}>
                        {customer.status}
                      </span>
                      <p className={`text-[10px] mt-1.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-450'}`}>
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
