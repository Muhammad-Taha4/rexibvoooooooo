import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, DollarSign, BarChart3, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../../services/supabase';

export const Sidebar = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/', adminOnly: true },
    { id: 'sales', label: 'Sales', icon: DollarSign, path: '/sales', adminOnly: false },
    { id: 'team', label: 'Team', icon: Users, path: '/team', adminOnly: true },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports', adminOnly: true },
  ];

  return (
    <div className="w-60 h-screen bg-brand-card/30 border-r border-brand-border/20 flex flex-col shrink-0">
      <div className="p-6 border-b border-brand-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-linear-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-brand-primary/20">F</div>
          <div>
            <div className="font-bold text-sm tracking-wide">Finance Hub</div>
            <div className="text-[10px] text-brand-text-muted uppercase tracking-widest font-semibold">Sales Tracker</div>
          </div>
        </div>
      </div>

      <nav className="p-4 flex-1 space-y-1">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${isActive 
                  ? 'bg-brand-primary/10 text-white font-semibold' 
                  : 'text-brand-text-secondary hover:bg-brand-card/50 hover:text-brand-text-primary'}
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-brand-primary' : 'text-brand-text-muted'} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="text-brand-primary" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-brand-border/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-error hover:bg-brand-error/10 transition-all font-medium"
        >
          <LogOut size={18} />
          <span>Logout Account</span>
        </button>
      </div>
    </div>
  );
};
