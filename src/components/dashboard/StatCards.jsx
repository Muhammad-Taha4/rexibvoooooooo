import { DollarSign, TrendingUp, BarChart3, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCards = ({ stats }) => {
  const cards = [
    { label: 'Total Revenue', value: `$${(stats?.revenue || 0).toLocaleString()}`, sub: `${stats?.salesCount || 0} deals closed`, icon: DollarSign, color: 'text-brand-primary', bg: 'bg-brand-primary/10', trend: true },
    { label: 'Upfront Received', value: `$${(stats?.upfront || 0).toLocaleString()}`, sub: `$${((stats?.revenue || 0) - (stats?.upfront || 0)).toLocaleString()} outstanding`, icon: TrendingUp, color: 'text-brand-secondary', bg: 'bg-brand-secondary/10', trend: true },
    { label: 'Total Profit', value: `PKR ${(stats?.profit || 0).toLocaleString()}`, sub: `Net: PKR ${(stats?.netProfit || 0).toLocaleString()}`, icon: BarChart3, color: 'text-brand-success', bg: 'bg-brand-success/10', trend: (stats?.netProfit || 0) > 0 },
    { label: 'Pending Sales', value: stats?.pendingCount || 0, sub: 'Awaiting verification', icon: Clock, color: 'text-brand-warning', bg: 'bg-brand-warning/10', trend: false },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 animate-fade-in">
      {cards.map((c, i) => (
        <div key={i} className="card relative group overflow-hidden hover:translate-y-[-4px] transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${c.bg} ${c.color} shadow-lg shadow-black/20`}>
              <c.icon size={22} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold ${c.trend ? 'text-brand-success' : 'text-brand-text-muted'}`}>
              {c.trend ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{c.trend ? '+12%' : 'Active'}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-3xl font-black font-mono text-white tracking-tight">{c.value}</div>
            <div className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">{c.label}</div>
            <div className="text-[10px] text-brand-text-muted/60 font-medium mt-2">{c.sub}</div>
          </div>

          <div className={`absolute bottom-0 left-0 w-full h-[2px] ${c.bg} opacity-20`}></div>
          <div className={`absolute bottom-0 left-0 h-[2px] transition-all duration-1000 ${c.color} bg-current`} style={{ width: '60%' }}></div>
        </div>
      ))}
    </div>
  );
};
