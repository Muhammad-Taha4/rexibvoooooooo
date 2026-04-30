import { Calendar, User, DollarSign, ExternalLink } from 'lucide-react';
import { calculateCommission } from '../../utils/commission';

export const SalesLedger = ({ sales, members }) => {
  const sortedSales = [...sales].sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));

  return (
    <div className="card bg-brand-card/30 border-brand-border/20 overflow-hidden shadow-2xl flex flex-col">
      <div className="p-6 border-b border-brand-border/40 flex items-center justify-between bg-black/5">
        <div>
          <h3 className="text-lg font-black tracking-tight text-white uppercase italic">Monthly Operations Ledger</h3>
          <p className="text-[10px] font-bold text-brand-text-muted tracking-[0.2em] mt-1">CHRONOLOGICAL RECORD OF EVERY TRANSACTION</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-brand-text-muted">
          {sales.length} RECORDS LOGGED
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-brand-border/20 bg-black/20">
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Transaction Date</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Associate</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Client / Project</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Value (USD)</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Payout Rate</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Net ROI (PKR)</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/10">
            {sortedSales.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center text-brand-text-muted font-bold uppercase tracking-[0.3em] opacity-40">
                  No transaction data available for this period
                </td>
              </tr>
            ) : (
              sortedSales.map((s, i) => {
                const member = members.find(m => m.id === s.member_id);
                const exchangeRate = 280;
                const commission = calculateCommission(s.amount_usd || 0);
                const netRoi = ((s.amount_usd || 0) * exchangeRate) - commission;

                return (
                  <tr key={s.id} className="hover:bg-brand-card/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-text-muted">
                          <Calendar size={14} />
                        </div>
                        <div className="font-mono font-bold text-white/80">
                          {new Date(s.date || s.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-black text-[10px]">
                          {member?.name?.[0] || '?'}
                        </div>
                        <div className="font-bold text-white group-hover:text-brand-primary transition-colors">{member?.name || 'Unknown'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <div className="font-black text-white/90 text-[11px] leading-tight">{s.client_name || 'Generic Sale'}</div>
                        <div className="text-[9px] text-brand-text-muted uppercase tracking-tight">{s.details || 'No details specified'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-brand-primary">
                      ${(s.amount_usd || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] font-bold text-brand-text-muted uppercase">Slab System</div>
                      <div className="text-brand-secondary font-mono">PKR {commission.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-brand-success">
                      PKR {netRoi.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${s.status === 'completed' ? 'bg-brand-success/10 text-brand-success border border-brand-success/20' : 'bg-brand-warning/10 text-brand-warning border border-brand-warning/20'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'completed' ? 'bg-brand-success' : 'bg-brand-warning animate-pulse'}`}></div>
                        {s.status}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
