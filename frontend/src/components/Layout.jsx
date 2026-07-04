import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  LogOut, 
  User, 
  CalendarCheck2 
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/visitors', label: 'Visitors', icon: UserCheck },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Section */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
            <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-2 rounded-lg text-white shadow-lg shadow-violet-500/25">
              <CalendarCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-md font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Visitor CRM
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                Management System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/90 to-fuchsia-600/90 text-white shadow-lg shadow-violet-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-100'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile / Logout bottom panel */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 px-2 py-1 mb-3">
            <div className="bg-slate-800 h-9 w-9 rounded-full flex items-center justify-center border border-slate-700">
              <User className="h-4 w-4 text-violet-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 hover:bg-rose-950/20 text-xs font-semibold transition-all duration-200"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/40 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-bold text-slate-100">
            {navItems.find(item => item.path === location.pathname)?.label || 'Mini CRM'}
          </h2>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Server: <span className="text-emerald-400 font-semibold">Online</span></span>
            <span className="h-4 w-[1px] bg-slate-800"></span>
            <span>Local Time: {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
