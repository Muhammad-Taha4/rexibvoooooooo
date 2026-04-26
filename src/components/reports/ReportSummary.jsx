import { TrendingUp, Users, Wallet } from 'lucide-react';

export const ReportSummary = ({ stats }) => {
  const summaryCards = [
    { label: 'Total Salaries', value: `PKR ${(stats?.totalSalaries || 0).toLocaleString()}`, sub: `${stats?.memberCount || 0} members active`, icon: Users, color: 'text-brand-error', bg: 'bg-brand-error/10' },
    { label: 'Total Commissions', value: `PKR ${(stats?.grossProfit || 0).toLocaleString()}`, sub: `From $${(stats?.revenue || 0).toLocaleString()} revenue`, icon: Wallet, color: 'text-brand-warning', bg: 'bg-brand-warning/10' },
    { label: 'Company Net Profit', value: `PKR ${(stats?.netProfit || 0).toLocaleString()}`, sub: `Approx. $${(stats?.companyProfitUSD || 0).toFixed(2)}`, icon: TrendingUp, color: (stats?.netProfit || 0) >= 0 ? 'text-brand-success' : 'text-brand-error', bg: (stats?.netProfit || 0) >= 0 ? 'bg-brand-success/10' : 'bg-brand-error/10' },
  ];

  return (
    <div className="grid grid-cols-3 gap-8 p-1">
      {summaryCards.map((c, i) => (
        <div key={i} className="card group relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <div className={`p-2.5 rounded-xl ${c.bg} ${c.color} shadow-lg shadow-black/20`}>
              <c.icon size={20} />
            </div>
            <div className="text-[9px] font-bold text-brand-text-muted uppercase tracking-[0.2em]">{c.label}</div>
          </div>
          
          <div className="space-y-1">
            <div className={`text-2xl font-black font-mono transition-all group-hover:scale-105 origin-left ${c.color}`}>{c.value}</div>
            <div className="text-[10px] text-brand-text-muted/60 font-medium tracking-wide">{c.sub}</div>
          </div>
          
          <div className={`absolute bottom-0 left-0 w-full h-1 ${c.bg} opacity-20`}></div>
          <div className={`absolute bottom-0 left-0 h-1 ${c.color} bg-current opacity-40 transition-all duration-1000`} style={{ width: '40%' }}></div>
        </div>
      ))}
    </div>
  );
};
