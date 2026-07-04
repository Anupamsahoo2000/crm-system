import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertTriangle, CalendarCheck2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { login, theme } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!validate()) return;
    
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
 
    if (result.success) {
      navigate('/');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className={`flex min-h-screen w-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 z-10 animate-in fade-in-50 duration-300">
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-3 rounded-2xl text-white shadow-2xl shadow-violet-500/30 mb-4 animate-bounce">
            <CalendarCheck2 className="h-8 w-8" />
          </div>
          <h2 className={`text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Welcome Back</h2>
          <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Sign in to access your Visitor CRM Dashboard
          </p>
        </div>

        {/* Card */}
        <div className={`backdrop-blur-md border p-8 rounded-2xl shadow-2xl transition duration-200 ${
          theme === 'dark' 
            ? 'bg-slate-900/60 border-slate-800/80 shadow-black/40' 
            : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Global API Error */}
            {errorMsg && (
              <div className="bg-rose-950/30 border border-rose-900/50 p-4 rounded-xl text-rose-300 flex items-start gap-3 text-sm">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className={`block text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition-all duration-200 ${
                    theme === 'dark'
                      ? errors.email ? 'border-rose-900/85 focus:border-rose-500 bg-slate-950/80 text-slate-200 placeholder-slate-600' : 'border-slate-800 focus:border-violet-500 bg-slate-950/80 text-slate-200 placeholder-slate-600'
                      : errors.email ? 'border-rose-350 focus:border-rose-500 bg-slate-50/50 text-slate-800 placeholder-slate-400' : 'border-slate-250 focus:border-violet-500 bg-slate-50/50 text-slate-800 placeholder-slate-400'
                  }`}
                  placeholder="admin@crm.com"
                />
              </div>
              {errors.email && (
                <p className="text-rose-400 text-xs mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className={`block text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/25 transition-all duration-200 ${
                    theme === 'dark'
                      ? errors.password ? 'border-rose-900/85 focus:border-rose-500 bg-slate-950/80 text-slate-200 placeholder-slate-600' : 'border-slate-800 focus:border-violet-500 bg-slate-950/80 text-slate-200 placeholder-slate-600'
                      : errors.password ? 'border-rose-350 focus:border-rose-500 bg-slate-50/50 text-slate-800 placeholder-slate-450' : 'border-slate-250 focus:border-violet-500 bg-slate-50/50 text-slate-800 placeholder-slate-450'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-rose-400 text-xs mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Info hint */}
            <div className={`text-center p-2.5 rounded-lg border transition ${
              theme === 'dark' ? 'bg-slate-950/40 border-slate-800/30' : 'bg-slate-100/60 border-slate-200/50'
            }`}>
              <p className="text-[11px] text-slate-500">
                Demo Credentials:{' '}
                <span className={theme === 'dark' ? 'text-violet-400 font-semibold' : 'text-violet-650 font-semibold'}>
                  admin@crm.com
                </span>{' '}
                /{' '}
                <span className={theme === 'dark' ? 'text-violet-400 font-semibold' : 'text-violet-650 font-semibold'}>
                  password123
                </span>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-violet-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 cursor-pointer"
            >
              {submitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
