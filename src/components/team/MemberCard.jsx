import { User, DollarSign, BarChart3, Clock, MoreHorizontal, Settings, Edit2, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const MemberCard = ({ member, stats, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const isProfitable = (stats?.profit || 0) >= (member.salary_pkr || 15000);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="card group relative overflow-hidden flex flex-col h-full bg-brand-card/40 hover:bg-brand-card/60 transition-all border-brand-border/20 hover:border-brand-primary/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl bg-linear-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-xl group-hover:scale-110 transition-transform`}>
              <User size={24} />
            </div>
            {isProfitable && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-success rounded-full border-2 border-brand-card shadow-lg animate-pulse"></div>
            )}
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-brand-primary transition-colors">{member.name}</h3>
            <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">{member.role || 'Sales Executive'}</p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-brand-text-muted hover:text-brand-text-primary transition-colors bg-white/5 rounded-xl hover:bg-white/10"
          >
            <MoreHorizontal size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-32 bg-brand-card border border-brand-border/40 rounded-2xl shadow-2xl z-50 overflow-hidden animate-zoom-in">
              <button 
                onClick={() => { onEdit(member); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-bold text-brand-text-primary hover:bg-white/5 transition-colors text-left uppercase tracking-widest"
              >
                <Edit2 size={14} className="text-brand-primary" /> Edit
              </button>
              <button 
                onClick={() => { onDelete(member); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-bold text-brand-error hover:bg-brand-error/10 transition-colors text-left uppercase tracking-widest border-t border-brand-border/20"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {[
          { label: 'Revenue', value: `$${(stats?.revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-brand-primary' },
          { label: 'Profit', value: `PKR ${(stats?.profit || 0).toLocaleString()}`, icon: BarChart3, color: 'text-brand-success' },
          { label: 'Sales', value: (stats?.salesCount || 0).toLocaleString(), icon: Clock, color: 'text-brand-secondary' },
          { label: 'Pending', value: (stats?.pendingCount || 0).toLocaleString(), icon: Clock, color: 'text-brand-warning' },
        ].map((s, i) => (
          <div key={i} className="p-3 bg-black/20 rounded-xl border border-white/5 space-y-1">
            <div className="text-[8px] font-bold text-brand-text-muted uppercase tracking-[0.2em]">{s.label}</div>
            <div className={`text-sm font-black font-mono ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-brand-border/20 flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-[9px] font-bold text-brand-text-muted uppercase tracking-widest leading-none">Monthly Salary</div>
          <div className="text-sm font-black text-white font-mono leading-none">PKR {(member.salary_pkr || 15000).toLocaleString()}</div>
        </div>
        <div className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${isProfitable ? 'bg-brand-success/10 text-brand-success border-brand-success/20' : 'bg-brand-error/10 text-brand-error border-brand-error/20'} uppercase tracking-widest`}>
          {isProfitable ? 'Profitable' : 'Net Loss'}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute right-[-10%] bottom-[-10%] opacity-5 group-hover:opacity-10 transition-opacity">
        <Settings size={120} />
      </div>
    </div>
  );
};
