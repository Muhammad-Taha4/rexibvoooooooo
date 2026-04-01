import { Eye, Edit3, Trash2, Calendar, User } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { updateSaleStatus } from '../../services/api';

export const SalesTable = ({ sales, onEdit, onDelete, onViewScreenshot, loading }) => {
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateSaleStatus(id, newStatus);
      // In a real app, you'd trigger a re-fetch or update local state
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-brand-card/20 rounded-2xl border border-brand-border/20 p-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
        <p className="text-brand-text-muted text-sm font-medium">Fetching sales data...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-brand-card/30 rounded-2xl border border-brand-border/20 overflow-hidden shadow-2xl shadow-black/40">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-brand-border/30 bg-brand-card/50">
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[10px]">Date</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[10px]">Client / Member</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[10px]">Amount</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[10px]">Upfront</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[10px]">Remaining</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[10px]">Profit (PKR)</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[10px]">Status</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[10px]">Proof</th>
              <th className="px-6 py-4 font-bold text-brand-text-muted uppercase tracking-widest text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/10">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center text-brand-text-muted italic">
                  No sales found matching your filters.
                </td>
              </tr>
            ) : sales.map((sale, i) => (
              <tr key={sale.id} className="hover:bg-brand-card/40 transition-colors group">
                <td className="px-6 py-4 font-mono text-[11px] text-brand-text-secondary">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-brand-text-muted" />
                    {new Date(sale.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                      <User size={14} />
                    </div>
                    <div>
                      <div className="font-bold text-brand-text-primary capitalize">{sale.client_name || 'Generic Client'}</div>
                      <div className="text-[10px] text-brand-text-muted font-medium">{sale.member_name || sale.member_id || 'Unknown Member'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold font-mono text-brand-text-primary">${sale.amount_usd}</td>
                <td className="px-6 py-4 font-mono text-brand-success">${sale.upfront_usd}</td>
                <td className="px-6 py-4 font-mono text-brand-warning">
                  ${(sale.amount_usd - (sale.upfront_usd || 0))}
                </td>
                <td className="px-6 py-4 font-bold font-mono text-brand-secondary">
                  {(sale.amount_usd * 50).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={sale.status}
                    onChange={(e) => handleStatusChange(sale.id, e.target.value)}
                    className="bg-transparent text-[11px] font-bold h-7 focus:ring-0 outline-none cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="received">Received</option>
                    <option value="completed">Completed</option>
                  </select>
                  <StatusBadge status={sale.status} />
                </td>
                <td className="px-6 py-4">
                  {sale.screenshot_url ? (
                    <button 
                      onClick={() => onViewScreenshot(sale.screenshot_url)}
                      className="p-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/20 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
                    >
                      <Eye size={12} />
                      View
                    </button>
                  ) : (
                    <span className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider">No Proof</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(sale)}
                      className="p-2 rounded-xl bg-white/5 border border-brand-border/40 text-brand-text-muted hover:text-brand-text-primary hover:border-brand-primary/40 transition-all shadow-lg active:scale-95"
                      title="Edit Sale"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => onDelete(sale)}
                      className="p-2 rounded-xl bg-brand-error/10 border border-brand-error/20 text-brand-text-muted hover:text-brand-error hover:border-brand-error/40 transition-all shadow-lg active:scale-95"
                      title="Delete Sale"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-brand-card/50 border-t border-brand-border/20 flex items-center justify-between">
        <div className="text-[11px] text-brand-text-muted font-medium font-mono uppercase tracking-widest">
          Showing {sales.length} record{sales.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-4 text-[11px] font-bold">
          <div className="flex items-center gap-2">
            <span className="text-brand-text-muted">Total Revenue:</span>
            <span className="text-brand-text-primary font-mono">${(sales?.reduce((acc, sale) => acc + (sale.amount_usd || 0), 0) || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
