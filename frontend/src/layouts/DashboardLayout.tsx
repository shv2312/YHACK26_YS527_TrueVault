import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, FileUp, Users, History, LogOut } from 'lucide-react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { institutionName, role, walletAddress, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // If somehow landed here without auth, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Asset', path: '/upload', icon: FileUp },
    { name: 'Role Access', path: '/roles', icon: Users },
    { name: 'Audit Trail', path: '/audit', icon: History },
  ];

  if (!isAuthenticated) return null; // Avoid flicker

  return (
    <div className="flex h-screen bg-[var(--color-bg-navy)] overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-64 glass-panel border-r-0 flex flex-col z-20">
        <div className="p-6 flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
          <span className="text-xl font-bold tracking-tight text-white">TrueVault</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'glass-card border-primary/50 text-white font-medium' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]' : 'text-gray-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-3 w-full rounded-lg text-gray-400 hover:text-white hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span>Logout Session</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Top Header */}
        <header className="glass-panel border-b-0 px-8 py-4 flex justify-between items-center z-20 sticky top-0">
          <h1 className="text-xl font-semibold text-white tracking-wide">
            {navItems.find(i => i.path === location.pathname)?.name || 'TrueVault'}
          </h1>
          
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-primary uppercase tracking-wider font-bold mb-0.5">{institutionName}</span>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-400 font-mono">{walletAddress}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/20 text-accent border border-accent/30">
                  {role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-8 relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
