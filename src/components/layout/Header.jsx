import { Search, Bell, Settings, User } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

export const Header = () => {
  const { user, isAdmin } = useAuth();

  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-brand-border/20 bg-brand-bg/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
        <input 
          type="text" 
          placeholder="Search for sales, members, or reports..." 
          className="w-full bg-brand-card/50 border border-brand-border/40 rounded-xl pl-10 pr-4 py-2 text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:border-brand-primary outline-none transition-all shadow-inner shadow-black/10"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2 text-brand-text-muted hover:text-brand-text-primary transition-colors"><Bell size={18} /></button>
          <button className="p-2 text-brand-text-muted hover:text-brand-text-primary transition-colors"><Settings size={18} /></button>
        </div>
        
        <div className="h-8 w-[1px] bg-brand-border/30"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <div className="text-xs font-bold text-brand-text-primary truncate max-w-[150px]">{user?.email?.split('@')[0]}</div>
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${isAdmin ? 'text-brand-primary' : 'text-brand-success'}`}>
              {isAdmin ? 'Administrator' : 'Sales Executive'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-card border border-brand-border/40 flex items-center justify-center text-brand-primary shadow-lg shadow-black/20">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};
