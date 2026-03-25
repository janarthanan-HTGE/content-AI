import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Sparkles, Library, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export const Layout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/generate', icon: Sparkles, label: 'Generate' },
    { path: '/library', icon: Library, label: 'Library' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r-2 border-black flex flex-col" style={{ position: 'sticky', top: 0, height: '100vh' }}>
        <div className="p-6 border-b-2 border-black">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Outfit' }} data-testid="app-logo">
            Campaign<span className="text-[#FF5722]">AI</span>
          </h1>
          <p className="text-sm text-[#52525B] mt-1" style={{ fontFamily: 'Manrope' }}>Marketing Made Easy</p>
        </div>

        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                data-testid={`nav-${item.label.toLowerCase()}`}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-md border-2 border-black transition-all ${
                  isActive
                    ? 'bg-[#FF5722] text-white'
                    : 'bg-white hover:bg-[#F3F4F6]'
                }`}
                style={{
                  boxShadow: isActive ? '3px 3px 0px 0px #0A0A0A' : '2px 2px 0px 0px #0A0A0A',
                  fontFamily: 'Manrope',
                  fontWeight: '600'
                }}
              >
                <Icon strokeWidth={2.5} className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t-2 border-black">
          <div className="mb-4 p-4 bg-[#F3F4F6] rounded-md border-2 border-black">
            <p className="text-xs font-semibold mb-1" style={{ fontFamily: 'Manrope' }}>Logged in as</p>
            <p className="text-sm font-bold truncate" style={{ fontFamily: 'Outfit' }} data-testid="user-name">
              {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-[#52525B] truncate" data-testid="user-email">{user?.email}</p>
          </div>
          <button
            data-testid="logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-black rounded-md brutalist-btn font-semibold"
            style={{ boxShadow: '2px 2px 0px 0px #0A0A0A', fontFamily: 'Manrope' }}
          >
            <LogOut strokeWidth={2.5} className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
