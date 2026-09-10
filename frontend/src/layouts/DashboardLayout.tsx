import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, FileUp, Users, History, LogOut } from 'lucide-react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { StatusBadge } from '../components/ui/StatusBadge';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { institutionName, role, walletAddress, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); }
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

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ===== DARK SIDEBAR ===== */}
      <aside className="w-[240px] bg-[#0B0F17] border-r border-white/8 flex flex-col shrink-0">
        <div className="p-5 flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-white">TrueVault</span>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary/10 text-white'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}>
                <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-primary' : 'text-gray-600'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/8">
          <button onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2.5 w-full rounded-xl text-[14px] font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-[18px] h-[18px]" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* ===== LIGHT MAIN WORKSPACE ===== */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F7F8FA]">

        {/* Header */}
        <header className="bg-white border-b border-border-light px-8 py-4 flex justify-between items-center shrink-0">
          <h1 className="text-[20px] font-bold text-text-primary tracking-tight">
            {navItems.find(i => i.path === location.pathname)?.name || 'TrueVault'}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-text-secondary">{institutionName}</span>
            <span className="text-xs text-text-muted font-mono bg-[#F4F6F8] px-2 py-1 rounded">{walletAddress}</span>
            <StatusBadge status="info" text={role || 'N/A'} />
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
