import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  UserCheck, 
  Clock, 
  LogOut, 
  History, 
  Check, 
  AlertCircle, 
  User, 
  Phone, 
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Visitors = () => {
  const [history, setHistory] = useState([]);
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingActive, setLoadingActive] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { theme } = useAuth();

  // Pagination State for History Table
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 5; // 5 items per page for clear demonstration

  // Check-In Form State
  const [formData, setFormData] = useState({
    visitorName: '',
    phone: '',
    personToMeet: '',
    purpose: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchActiveVisitors();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchActiveVisitors = async () => {
    try {
      setLoadingActive(true);
      const response = await api.get('/visitors/history');
      const active = response.data.filter(v => v.status === 'Checked-In');
      setActiveVisitors(active);
    } catch (err) {
      console.error('Error fetching active visitors:', err);
    } finally {
      setLoadingActive(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await api.get('/visitors/history', {
        params: {
          page,
          limit
        }
      });
      if (response.data.visitors) {
        setHistory(response.data.visitors);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.total || 0);
      } else {
        setHistory(response.data);
        setTotalPages(1);
        setTotalItems(response.data.length);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to fetch visitor records.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.visitorName.trim()) errors.visitorName = 'Visitor name is required';
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$|^[0-9]{10}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.personToMeet.trim()) errors.personToMeet = 'Person to meet is required';
    if (!formData.purpose.trim()) errors.purpose = 'Purpose of visit is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await api.post('/visitors/checkin', formData);
      showSuccess('Visitor checked in successfully!');
      setFormData({ visitorName: '', phone: '', personToMeet: '', purpose: '' });
      
      // Refresh state
      fetchActiveVisitors();
      setPage(1); // Reset to first page of log history
      fetchHistory();
    } catch (err) {
      console.error('Check-in error:', err);
      const errMsg = err.response?.data?.message || 'Failed to check-in visitor.';
      setFormErrors({ global: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckOut = async (id, name) => {
    try {
      await api.put(`/visitors/checkout/${id}`);
      showSuccess(`${name} checked out successfully!`);
      fetchActiveVisitors();
      fetchHistory();
    } catch (err) {
      console.error('Check-out error:', err);
      setError('Failed to check-out visitor.');
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-8">
      
      {/* Messages */}
      {successMsg && (
        <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl text-emerald-300 flex items-center gap-3 text-sm animate-pulse">
          <Check className="h-5 w-5 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="bg-rose-950/30 border border-rose-900/50 p-4 rounded-xl text-rose-300 flex items-center gap-3 text-sm">
          <AlertCircle className="h-5 w-5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Top Split View: Check-In Form & Active Visitors */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Check-In Form (Col span 2) */}
        <div className={`lg:col-span-2 border p-6 rounded-2xl shadow-md flex flex-col justify-between transition duration-200 ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80 shadow-xl' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h3 className={`text-md font-bold flex items-center gap-2 mb-6 transition ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
              <UserCheck className="h-5 w-5 text-violet-500" />
              Visitor Check-In
            </h3>
            
            <form onSubmit={handleCheckIn} className="space-y-4">
              {formErrors.global && (
                <div className="bg-rose-950/30 border border-rose-900/50 p-3.5 rounded-xl text-rose-300 flex items-start gap-2.5 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{formErrors.global}</span>
                </div>
              )}

              {/* Visitor Name */}
              <div className="space-y-1">
                <label className={`block text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Visitor Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="visitorName"
                    value={formData.visitorName}
                    onChange={handleInputChange}
                    className={`block w-full pl-9 pr-3.5 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition ${
                      theme === 'dark'
                        ? formErrors.visitorName ? 'border-rose-900/80 focus:border-rose-500 bg-slate-950 text-slate-250' : 'border-slate-800 focus:border-violet-500 bg-slate-950 text-slate-250'
                        : formErrors.visitorName ? 'border-rose-350 focus:border-rose-500 bg-white text-slate-800' : 'border-slate-300 focus:border-violet-500 bg-white text-slate-800'
                    }`}
                    placeholder="Guest Name"
                  />
                </div>
                {formErrors.visitorName && (
                  <p className="text-rose-400 text-xs mt-1 font-medium">{formErrors.visitorName}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className={`block text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`block w-full pl-9 pr-3.5 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition ${
                      theme === 'dark'
                        ? formErrors.phone ? 'border-rose-900/80 focus:border-rose-500 bg-slate-950 text-slate-250' : 'border-slate-800 focus:border-violet-500 bg-slate-950 text-slate-250'
                        : formErrors.phone ? 'border-rose-350 focus:border-rose-500 bg-white text-slate-800' : 'border-slate-300 focus:border-violet-500 bg-white text-slate-800'
                    }`}
                    placeholder="10-digit number"
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-rose-400 text-xs mt-1 font-medium">{formErrors.phone}</p>
                )}
              </div>

              {/* Person to Meet */}
              <div className="space-y-1">
                <label className={`block text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Person to Meet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="personToMeet"
                    value={formData.personToMeet}
                    onChange={handleInputChange}
                    className={`block w-full pl-9 pr-3.5 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition ${
                      theme === 'dark'
                        ? formErrors.personToMeet ? 'border-rose-900/80 focus:border-rose-500 bg-slate-950 text-slate-250' : 'border-slate-800 focus:border-violet-500 bg-slate-950 text-slate-250'
                        : formErrors.personToMeet ? 'border-rose-350 focus:border-rose-500 bg-white text-slate-800' : 'border-slate-300 focus:border-violet-500 bg-white text-slate-800'
                    }`}
                    placeholder="Staff/Host Name"
                  />
                </div>
                {formErrors.personToMeet && (
                  <p className="text-rose-400 text-xs mt-1 font-medium">{formErrors.personToMeet}</p>
                )}
              </div>

              {/* Purpose */}
              <div className="space-y-1">
                <label className={`block text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Purpose of Visit
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Target className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className={`block w-full pl-9 pr-3.5 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition ${
                      theme === 'dark'
                        ? formErrors.purpose ? 'border-rose-900/80 focus:border-rose-500 bg-slate-950 text-slate-250' : 'border-slate-800 focus:border-violet-500 bg-slate-950 text-slate-250'
                        : formErrors.purpose ? 'border-rose-350 focus:border-rose-500 bg-white text-slate-800' : 'border-slate-300 focus:border-violet-500 bg-white text-slate-800'
                    }`}
                    placeholder="Meeting, Interview, Delivery, etc."
                  />
                </div>
                {formErrors.purpose && (
                  <p className="text-rose-400 text-xs mt-1 font-medium">{formErrors.purpose}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 focus:outline-none transition shadow-lg shadow-violet-500/10 disabled:opacity-50 mt-6 cursor-pointer"
              >
                {submitting ? 'Processing...' : 'Submit Check-In'}
              </button>
            </form>
          </div>
        </div>

        {/* Active Visitors (Col span 3) */}
        <div className={`lg:col-span-3 border p-6 rounded-2xl shadow-md flex flex-col justify-between transition duration-200 ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80 shadow-xl' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h3 className={`text-md font-bold flex items-center gap-2 mb-6 transition ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
              <Clock className="h-5 w-5 text-emerald-500 animate-pulse" />
              Active Visitors Inside ({activeVisitors.length})
            </h3>
            
            {loadingActive ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
              </div>
            ) : activeVisitors.length === 0 ? (
              <div className={`py-12 text-center rounded-xl border transition ${
                theme === 'dark' ? 'bg-slate-950/20 border-slate-800/20' : 'bg-slate-50/50 border-slate-200'
              }`}>
                <p className="text-slate-500 text-sm">No active visitors currently checked-in.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {activeVisitors.map((visitor) => (
                  <div 
                    key={visitor.id} 
                    className={`flex justify-between items-center p-4 border rounded-xl transition duration-150 ${
                      theme === 'dark' 
                        ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700' 
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-250 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-850'}`}>{visitor.visitorName}</p>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-450' : 'text-slate-600'}`}>
                        Meeting: <span className={theme === 'dark' ? 'text-slate-350 font-semibold' : 'text-slate-700 font-semibold'}>{visitor.personToMeet}</span>
                      </p>
                      <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>
                        Purpose: <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{visitor.purpose}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2 font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        In: {new Date(visitor.checkInTime).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCheckOut(visitor.id, visitor.visitorName)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-rose-950/40 hover:bg-rose-900/40 text-rose-450 border-rose-900/50'
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-650 border-rose-150'
                      }`}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Check Out
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Log: Visitor History */}
      <div className={`border p-6 rounded-2xl shadow-md transition duration-200 ${
        theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80 shadow-xl' : 'bg-white border-slate-200'
      }`}>
        <h3 className={`text-md font-bold flex items-center gap-2 mb-6 transition ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
          <History className="h-5 w-5 text-slate-500" />
          Visitor Log History
        </h3>
        
        {loadingHistory && history.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
          </div>
        ) : history.length === 0 ? (
          <div className={`py-8 text-center rounded-xl border transition ${
            theme === 'dark' ? 'bg-slate-950/20 border-slate-850' : 'bg-slate-50 border-slate-200'
          }`}>
            <p className="text-slate-500 text-sm">No visitor history records found.</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-xs font-semibold uppercase tracking-wider transition ${
                    theme === 'dark' ? 'border-slate-800 bg-slate-900/50 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}>
                    <th className="px-6 py-4">Visitor</th>
                    <th className="px-6 py-4">Host / Purpose</th>
                    <th className="px-6 py-4">Check-In</th>
                    <th className="px-6 py-4">Check-Out</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs transition ${theme === 'dark' ? 'divide-slate-800/60' : 'divide-slate-200/60'}`}>
                  {history.map((visitor) => (
                    <tr key={visitor.id} className={`transition ${
                      theme === 'dark' ? 'hover:bg-slate-900/20 text-slate-350' : 'hover:bg-slate-50/50 text-slate-700'
                    }`}>
                      <td className="px-6 py-4">
                        <div className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-850'}`}>{visitor.visitorName}</div>
                        <div className="text-slate-500 mt-0.5">{visitor.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-750'}`}>To meet: {visitor.personToMeet}</div>
                        <div className="text-slate-500 mt-0.5 font-medium">Purpose: {visitor.purpose}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {new Date(visitor.checkInTime).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {visitor.checkOutTime 
                          ? new Date(visitor.checkOutTime).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) 
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          visitor.status === 'Checked-In'
                            ? theme === 'dark'
                              ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400'
                              : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                            : theme === 'dark'
                              ? 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                              : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                          {visitor.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={`flex items-center justify-between px-5 py-4 border-t mt-4 transition ${
                theme === 'dark' ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50/50'
              }`}>
                <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>
                  Showing page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span> ({totalItems} total)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className={`p-2 rounded-xl border transition flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed ${
                      theme === 'dark'
                        ? 'border-slate-850 hover:bg-slate-800 text-slate-300'
                        : 'border-slate-200 hover:bg-white text-slate-650 hover:shadow-sm'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`p-2 rounded-xl border transition flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed ${
                      theme === 'dark'
                        ? 'border-slate-850 hover:bg-slate-800 text-slate-300'
                        : 'border-slate-200 hover:bg-white text-slate-650 hover:shadow-sm'
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Visitors;
