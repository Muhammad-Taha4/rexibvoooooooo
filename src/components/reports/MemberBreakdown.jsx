import { User } from 'lucide-react';

export const MemberBreakdown = ({ data, totalSalaries }) => {
  return (
    <div className="card h-full bg-brand-card/30 border-brand-border/20 overflow-hidden shadow-2xl flex flex-col">
      <div className="p-6 border-b border-brand-border/40">
        <h3 className="text-lg font-bold">Member-wise Breakdown</h3>
        <p className="text-[10px] uppercase font-bold text-brand-text-muted tracking-widest mt-1">Detailed productivity analysis per agent</p>
      </div>

      <div className="flex-1 overflow-x-auto min-h-0">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-brand-border/20 bg-black/10">
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Member</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Sales</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Revenue ($)</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Commission (PKR)</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Base Salary (PKR)</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Total Pay (PKR)</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[9px]">Net Profit (PKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/10">
            {data.map((m, i) => (
              <tr key={m.id} className="hover:bg-brand-card/40 transition-colors group">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-lg font-bold text-[10px]">
                    {m.name[0]}
                  </div>
                  <div className="font-bold text-white group-hover:text-brand-primary transition-colors">{m.name}</div>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-brand-text-primary uppercase">{m.salesCount}</td>
                <td className="px-6 py-4 font-mono text-brand-text-primary">${(m.revenue || 0).toLocaleString()}</td>
                <td className="px-6 py-4 font-mono text-brand-secondary">PKR {(m.commission || 0).toLocaleString()}</td>
                <td className="px-6 py-4 font-mono text-brand-text-muted">PKR {(m.salary || 15000).toLocaleString()}</td>
                <td className="px-6 py-4 font-mono text-brand-error">PKR {(m.totalPayable || 0).toLocaleString()}</td>
                <td className="px-6 py-4 font-mono font-bold text-brand-success">PKR {(m.profit || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-brand-primary/5 font-bold sticky bottom-0 border-t-2 border-brand-primary/20">
            <tr className="text-white">
              <td className="px-6 py-4 uppercase tracking-[0.2em] font-black">TOTAL BUSINESS ANALYTICS</td>
              <td className="px-6 py-4 font-mono">{data.reduce((a, b) => a + (b.salesCount || 0), 0)}</td>
              <td className="px-6 py-4 font-mono text-brand-primary">${(data.reduce((a, b) => a + (b.revenue || 0), 0) || 0).toLocaleString()}</td>
              <td className="px-6 py-4 font-mono text-brand-secondary">PKR {(data.reduce((a, b) => a + (b.commission || 0), 0) || 0).toLocaleString()}</td>
              <td className="px-6 py-4 font-mono text-brand-text-muted">PKR {(data.reduce((a, b) => a + (b.salary || 15000), 0) || 0).toLocaleString()}</td>
              <td className="px-6 py-4 font-mono text-brand-error">PKR {(data.reduce((a, b) => a + (b.totalPayable || 0), 0) || 0).toLocaleString()}</td>
              <td className="px-6 py-4 font-mono text-brand-success bg-brand-success/10 border-l border-brand-success/20">PKR {(data.reduce((a, b) => a + (b.profit || 0), 0) || 0).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
