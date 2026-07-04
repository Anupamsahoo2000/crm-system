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
  Target 
} from 'lucide-react';

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/visitors/history');
      setVisitors(response.data);
    } catch (err) {
      console.error('Error fetching visitors:', err);
      setError('Failed to fetch visitor records.');
    } finally {
      setLoading(false);
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
      fetchVisitors();
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
      fetchVisitors();
    } catch (err) {
      console.error('Check-out error:', err);
      setError('Failed to check-out visitor.');
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const activeVisitors = visitors.filter(v => v.status === 'Checked-In');
  const pastVisitors = visitors.filter(v => v.status === 'Checked-Out');

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
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold text-slate-200 flex items-center gap-2 mb-6">
              <UserCheck className="h-5 w-5 text-violet-400" />
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
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                    className={`block w-full pl-9 pr-3.5 py-2 bg-slate-950 border rounded-xl text-slate-200 placeholder-slate-650 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition ${
                      formErrors.visitorName ? 'border-rose-900/80 focus:border-rose-500' : 'border-slate-800 focus:border-violet-500'
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
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                    className={`block w-full pl-9 pr-3.5 py-2 bg-slate-950 border rounded-xl text-slate-200 placeholder-slate-650 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition ${
                      formErrors.phone ? 'border-rose-900/80 focus:border-rose-500' : 'border-slate-800 focus:border-violet-500'
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
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                    className={`block w-full pl-9 pr-3.5 py-2 bg-slate-950 border rounded-xl text-slate-200 placeholder-slate-650 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition ${
                      formErrors.personToMeet ? 'border-rose-900/80 focus:border-rose-500' : 'border-slate-800 focus:border-violet-500'
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
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                    className={`block w-full pl-9 pr-3.5 py-2 bg-slate-950 border rounded-xl text-slate-200 placeholder-slate-650 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition ${
                      formErrors.purpose ? 'border-rose-900/80 focus:border-rose-500' : 'border-slate-800 focus:border-violet-500'
                    }`}
                    placeholder="Interview, Delivery, Meeting, etc."
                  />
                </div>
                {formErrors.purpose && (
                  <p className="text-rose-400 text-xs mt-1 font-medium">{formErrors.purpose}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 focus:outline-none transition shadow-lg shadow-violet-500/10 disabled:opacity-50 mt-6"
              >
                {submitting ? 'Processing...' : 'Submit Check-In'}
              </button>
            </form>
          </div>
        </div>

        {/* Active Visitors (Col span 3) */}
        <div className="lg:col-span-3 bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold text-slate-200 flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-emerald-400 animate-pulse" />
              Active Visitors Inside ({activeVisitors.length})
            </h3>
            
            {loading && visitors.length === 0 ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
              </div>
            ) : activeVisitors.length === 0 ? (
              <div className="py-12 text-center bg-slate-950/20 rounded-xl border border-slate-800/20">
                <p className="text-slate-500 text-sm">No active visitors currently checked-in.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {activeVisitors.map((visitor) => (
                  <div 
                    key={visitor.id} 
                    className="flex justify-between items-center p-4 bg-slate-950/60 border border-slate-800 rounded-xl hover:border-slate-700 transition"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{visitor.visitorName}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Meeting: <span className="text-slate-400 font-semibold">{visitor.personToMeet}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Purpose: <span className="text-slate-400">{visitor.purpose}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2 font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-600" />
                        In: {new Date(visitor.checkInTime).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCheckOut(visitor.id, visitor.visitorName)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 rounded-xl text-xs font-semibold transition border border-rose-900/50"
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
      <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl shadow-xl">
        <h3 className="text-md font-bold text-slate-200 flex items-center gap-2 mb-6">
          <History className="h-5 w-5 text-slate-400" />
          Visitor Log History ({pastVisitors.length})
        </h3>
        
        {loading && visitors.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
          </div>
        ) : pastVisitors.length === 0 ? (
          <div className="py-8 text-center bg-slate-950/20 rounded-xl border border-slate-850">
            <p className="text-slate-500 text-sm">No visitor history records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  <th className="px-6 py-4">Visitor</th>
                  <th className="px-6 py-4">Host / Purpose</th>
                  <th className="px-6 py-4">Check-In</th>
                  <th className="px-6 py-4">Check-Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {pastVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-slate-900/20 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200">{visitor.visitorName}</div>
                      <div className="text-slate-500 mt-0.5">{visitor.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-350 font-medium">To meet: {visitor.personToMeet}</div>
                      <div className="text-slate-500 mt-0.5">Purpose: {visitor.purpose}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {new Date(visitor.checkInTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Visitors;
