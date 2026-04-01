import { useState, useEffect, useCallback } from 'react';
import { Plus, Download, Filter, Search, RotateCw } from 'lucide-react';
import { SalesTable } from '../components/sales/SalesTable';
import { SaleModal } from '../components/sales/SaleModal';
import { SaleFilters } from '../components/sales/SaleFilters';
import { ScreenshotViewer } from '../components/sales/ScreenshotViewer';
import { getSales, getTeamMembers, deleteSale } from '../services/api';
import { useAuth } from '../components/auth/AuthProvider';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export const Sales = () => {
  const { user, isAdmin } = useAuth();
  const [sales, setSales] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editSale, setEditSale] = useState(null);
  const [viewScreenshot, setViewScreenshot] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    month: 'all',
    member: 'all',
    status: 'all'
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [salesRes, membersRes] = await Promise.all([
        getSales(filters.month, new Date().getFullYear()),
        getTeamMembers()
      ]);
      setSales(salesRes.data || []);
      setMembers(membersRes.data || []);
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters.month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = (sale) => {
    setSaleToDelete(sale);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSale = async () => {
    if (!saleToDelete) return;
    try {
      await deleteSale(saleToDelete.id);
      fetchData();
    } catch (err) {
      console.error("Error deleting sale:", err);
    } finally {
      setShowDeleteConfirm(false);
      setSaleToDelete(null);
    }
  };

  const filteredSales = sales.map(s => {
    const member = members.find(m => m.id === s.member_id);
    return { ...s, member_name: member?.name || 'Unknown' };
  }).filter(s => {
    if (filters.search && !s.client_name?.toLowerCase().includes(filters.search.toLowerCase()) && !s.notes?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.member !== 'all' && s.member_id !== filters.member) return false;
    if (filters.status !== 'all' && s.status !== filters.status) return false;
    // If not admin, only show their own sales
    if (!isAdmin && s.member_id !== user?.id && s.member_id !== user?.user_metadata?.member_id) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Sales Repository</h1>
          <p className="text-brand-text-muted text-sm max-w-lg">
            Manage your sales funnel, track upfront payments, and verify transaction proofs.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-3 bg-brand-card/50 border border-brand-border/40 rounded-2xl text-brand-text-muted hover:text-brand-primary hover:border-brand-primary/40 transition-all shadow-lg active:scale-95"
          >
            <RotateCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => { setEditSale(null); setShowAdd(true); }}
            className="btn-primary h-12 px-6 flex items-center gap-2 shadow-brand-primary/20 shadow-xl"
          >
            <Plus size={20} />
            <span className="font-bold">Register New Sale</span>
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'This Month Revenue', value: `$${(filteredSales?.reduce((a, s) => a + (s.amount_usd || 0), 0) || 0).toLocaleString()}`, color: 'text-brand-primary', icon: Filter },
          { label: 'Upfront Received', value: `$${(filteredSales?.reduce((a, s) => a + (s.upfront_usd || 0), 0) || 0).toLocaleString()}`, color: 'text-brand-success', icon: Download },
          { label: 'Est. Gross Profit', value: `PKR ${((filteredSales?.reduce((a, s) => a + (s.amount_usd || 0), 0) || 0) * 50).toLocaleString()}`, color: 'text-brand-secondary', icon: Plus },
          { label: 'Pending Sales', value: filteredSales.filter(s => s.status === 'pending').length, color: 'text-brand-warning', icon: Search }
        ].map((stat, i) => (
          <div key={i} className="card bg-brand-card/20 backdrop-blur-md border-brand-border/10 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-brand-primary/5 transition-all"></div>
            <div className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.2em]">{stat.label}</div>
            <div className={`text-2xl font-black font-mono ${stat.color}`}>{stat.value}</div>
            <div className="flex items-center justify-between mt-2">
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-current opacity-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <SaleFilters filters={filters} setFilters={setFilters} members={members} />
        
        <SalesTable 
          sales={filteredSales} 
          loading={loading}
          onEdit={(s) => { setEditSale(s); setShowAdd(true); }}
          onDelete={handleDelete}
          onViewScreenshot={setViewScreenshot}
        />
      </div>

      {showAdd && (
        <SaleModal 
          sale={editSale} 
          onClose={() => { setShowAdd(false); setEditSale(null); }}
          onSave={fetchData}
        />
      )}

      {viewScreenshot && (
        <ScreenshotViewer 
          url={viewScreenshot} 
          onClose={() => setViewScreenshot(null)} 
        />
      )}

      <ConfirmDialog 
        isOpen={showDeleteConfirm}
        title="Delete Sales Record?"
        message={`Are you sure you want to delete the sale for "${saleToDelete?.client_name || 'this client'}"? This will remove all associated financial data.`}
        onConfirm={confirmDeleteSale}
        onCancel={() => { setShowDeleteConfirm(false); setSaleToDelete(null); }}
      />
    </div>
  );
};
