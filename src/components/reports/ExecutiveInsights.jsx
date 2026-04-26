import { Trophy, AlertCircle, TrendingUp, TrendingDown, Percent } from 'lucide-react';

export const ExecutiveInsights = ({ stats }) => {
  const { bestPerformer, worstPerformer, profitMargin, revenue, totalExpense, netProfit, companyProfitUSD } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Best Performer */}
      <div className="card bg-linear-to-br from-brand-success/10 to-transparent border-brand-success/20 overflow-hidden relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-brand-success/20 text-brand-success">
            <Trophy size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Best Performer</h4>
            <p className="text-lg font-black text-white leading-tight">{bestPerformer?.name || 'N/A'}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-brand-text-muted">Revenue Generated</span>
            <span className="text-brand-success">${(bestPerformer?.revenue || 0).toLocaleString()}</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-success h-full" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div className="absolute top-2 right-2 opacity-10">
          <TrendingUp size={60} />
        </div>
      </div>

      {/* Worst Performer / Needs Attention */}
      <div className="card bg-linear-to-br from-brand-error/10 to-transparent border-brand-error/20 overflow-hidden relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-brand-error/20 text-brand-error">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Needs Attention</h4>
            <p className="text-lg font-black text-white leading-tight">{worstPerformer?.name || 'N/A'}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-brand-text-muted">Lowest Contribution</span>
            <span className="text-brand-error">${(worstPerformer?.revenue || 0).toLocaleString()}</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-error h-full" style={{ width: `${(worstPerformer?.revenue / (bestPerformer?.revenue || 1)) * 100}%` }}></div>
          </div>
        </div>
        <div className="absolute top-2 right-2 opacity-10">
          <TrendingDown size={60} />
        </div>
      </div>

      {/* Business Efficiency */}
      <div className="card bg-linear-to-br from-brand-primary/10 to-transparent border-brand-primary/20 overflow-hidden relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-brand-primary/20 text-brand-primary">
            <Percent size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Profit Margin</h4>
            <p className="text-lg font-black text-white leading-tight">{profitMargin.toFixed(1)}% Efficiency</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
           <div className="space-y-0.5">
             <div className="text-[8px] font-bold text-brand-text-muted uppercase tracking-widest">Total Expense</div>
             <div className="text-[11px] font-bold text-white font-mono leading-none">PKR {totalExpense.toLocaleString()}</div>
           </div>
           <div className="space-y-0.5">
             <div className="text-[8px] font-bold text-brand-text-muted uppercase tracking-widest">Final Save (PKR)</div>
             <div className="text-[11px] font-bold text-brand-success font-mono leading-none">PKR {netProfit.toLocaleString()}</div>
           </div>
        </div>
        <div className="absolute top-2 right-2 opacity-10 font-black text-4xl font-mono text-brand-primary select-none">
          {profitMargin > 50 ? 'EX' : 'OP'}
        </div>
      </div>
    </div>
  );
};
