import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  LogOut, 
  User, 
  CalendarCheck2,
  Sun,
  Moon
} from 'lucide-react';

const Layout = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
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
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r flex flex-col justify-between shrink-0 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          {/* Logo Section */}
          <div className={`h-16 flex items-center px-6 border-b gap-3 transition-colors duration-200 ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-2 rounded-lg text-white shadow-lg shadow-violet-500/25">
              <CalendarCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-md font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                Visitor CRM
              </h1>
              <p className={`text-[10px] font-semibold tracking-wider uppercase ${
                theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
              }`}>
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
                      : theme === 'dark'
                        ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile / Logout bottom panel */}
        <div className={`p-4 border-t transition-colors duration-200 ${
          theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'
        }`}>
          <div className="flex items-center gap-3 px-2 py-1 mb-3">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center border ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              <User className="h-4 w-4 text-violet-500" />
            </div>
            <div className="overflow-hidden">
              <p className={`text-xs font-semibold truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-750'}`}>{user?.name}</p>
              <p className={`text-[10px] truncate ${theme === 'dark' ? 'text-slate-500' : 'text-slate-450'}`}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all duration-200 ${
              theme === 'dark'
                ? 'border-slate-850 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 hover:bg-rose-950/20'
                : 'border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50'
            }`}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className={`h-16 border-b flex items-center justify-between px-8 shrink-0 transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-slate-900/40 backdrop-blur-md border-slate-800/80' 
            : 'bg-white border-slate-250/80 shadow-sm'
        }`}>
          <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
            {navItems.find(item => item.path === location.pathname)?.label || 'Mini CRM'}
          </h2>
          <div className="flex items-center gap-5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-violet-600 hover:bg-slate-100 hover:shadow-sm'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <span className={`h-4 w-[1px] ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></span>
            
            <div className={`flex items-center gap-4 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}`}>
              <span>Server: <span className="text-emerald-500 font-bold">Online</span></span>
              <span className={`h-4 w-[1px] ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></span>
              <span>Local Time: {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
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
