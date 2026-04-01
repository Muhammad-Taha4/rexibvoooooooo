import { useState, useRef, useEffect } from 'react';
import { X, Plus, Upload, DollarSign, User, FileText, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { addSale, updateSale, uploadScreenshot, getTeamMembers } from '../../services/api';

export const SaleModal = ({ sale = null, onClose, onSave }) => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    member_id: sale?.member_id || '',
    amount_usd: sale?.amount_usd || '',
    upfront_usd: sale?.upfront_usd || '',
    client_name: sale?.client_name || '',
    notes: sale?.notes || '',
    date: sale?.date || new Date().toISOString().split('T')[0],
    status: sale?.status || 'pending',
    screenshot_url: sale?.screenshot_url || null,
  });

  const [screenshotFile, setScreenshotFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(sale?.screenshot_url || null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (isAdmin) {
      getTeamMembers().then(({ data }) => setMembers(data || []));
    }
  }, [isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalScreenshotUrl = formData.screenshot_url;
      
      // 1. Upload screenshot with safety catch (Don't let image failure block the sale)
      if (screenshotFile) {
        try {
          const tempId = sale?.id || `new_${Date.now()}`;
          finalScreenshotUrl = await uploadScreenshot(screenshotFile, tempId);
        } catch (imgErr) {
          console.warn("Screenshot upload failed, proceeding with sale only:", imgErr);
        }
      }

      // 2. Prepare data with owner bypass
      const ownerId = user?.id; // Taha's actual UID
      const saleData = {
        ...formData,
        amount_usd: Number(formData.amount_usd),
        upfront_usd: Number(formData.upfront_usd || 0),
        screenshot_url: finalScreenshotUrl,
        member_id: isAdmin ? (formData.member_id || ownerId) : (user?.user_metadata?.member_id || ownerId)
      };

      // 3. Save Sale
      if (sale) {
        await updateSale(sale.id, saleData);
      } else {
        await addSale(saleData);
      }

      onSave();
      onClose();
    } catch (err) {
      console.error("Critical submission error:", err);
      // Give a more helpful error
      alert(`System Error: ${err.message || 'Check your database connection'}`);
    } finally {
      setLoading(false);
    }
  };

  const remaining = Number(formData.amount_usd) - Number(formData.upfront_usd || 0);
  const profit = Number(formData.amount_usd) * 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl bg-brand-card border border-brand-border/40 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden animate-slide-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-brand-border/20 flex items-center justify-between bg-brand-card/50">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{sale ? 'Edit Sale Entry' : 'Register New Sale'}</h2>
            <p className="text-xs text-brand-text-muted mt-1">Transaction details & proof of payment.</p>
          </div>
          <button onClick={onClose} className="p-2 text-brand-text-muted hover:text-brand-text-primary transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          {/* Member & Date */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest pl-1">Assign To</label>
              <div className="relative group">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary" />
                <select 
                  name="member_id"
                  value={formData.member_id}
                  onChange={handleChange}
                  disabled={!isAdmin}
                  className="w-full h-11 bg-black/20 border border-brand-border/40 rounded-xl pl-10 pr-4 text-sm text-brand-text-primary outline-none focus:border-brand-primary transition-all disabled:opacity-50"
                  required
                >
                  <option value="">Select Member</option>
                  {isAdmin ? members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  )) : (
                    <option value={user?.id}>{user?.email?.split('@')[0]}</option>
                  )}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest pl-1">Date</label>
              <div className="relative group">
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full h-11 bg-black/20 border border-brand-border/40 rounded-xl px-4 text-sm text-brand-text-primary outline-none focus:border-brand-primary transition-all font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Amount & Upfront */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest pl-1">Sale Amount (USD)</label>
              <div className="relative group">
                <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary" />
                <input 
                  type="number" 
                  name="amount_usd"
                  placeholder="e.g. 500"
                  value={formData.amount_usd}
                  onChange={handleChange}
                  className="w-full h-11 bg-black/20 border border-brand-border/40 rounded-xl pl-10 pr-4 text-sm text-brand-text-primary outline-none focus:border-brand-primary transition-all font-mono"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest pl-1">Upfront Received</label>
              <div className="relative group">
                <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary" />
                <input 
                  type="number" 
                  name="upfront_usd"
                  placeholder="e.g. 100"
                  value={formData.upfront_usd}
                  onChange={handleChange}
                  className="w-full h-11 bg-black/20 border border-brand-border/40 rounded-xl pl-10 pr-4 text-sm text-brand-text-primary outline-none focus:border-brand-primary transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Real-time Calculations */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-primary/10 p-4 rounded-2xl border border-brand-primary/20">
              <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest block mb-1">Estimated Profit (PKR)</label>
              <div className="text-xl font-black font-mono text-brand-primary">PKR {(profit || 0).toLocaleString()}</div>
            </div>
            <div className="bg-brand-warning/10 p-4 rounded-2xl border border-brand-warning/20">
              <label className="text-[10px] font-bold text-brand-warning uppercase tracking-widest block mb-1">Remaining Balance</label>
              <div className="text-xl font-black font-mono text-brand-warning">${(remaining || 0).toLocaleString()}</div>
            </div>
          </div>

          {/* Client & Status */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest pl-1">Client Name / Project</label>
              <div className="relative group">
                <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary" />
                <input 
                  type="text" 
                  name="client_name"
                  placeholder="Acme Corp / Website"
                  value={formData.client_name}
                  onChange={handleChange}
                  className="w-full h-11 bg-black/20 border border-brand-border/40 rounded-xl pl-10 pr-4 text-sm text-brand-text-primary outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest pl-1">Current Status</label>
              <div className="flex gap-2 h-11">
                {[
                  { id: 'pending', color: 'text-brand-warning', bg: 'bg-brand-warning/10', icon: Clock },
                  { id: 'received', color: 'text-brand-primary', bg: 'bg-brand-primary/10', icon: CheckCircle },
                  { id: 'completed', color: 'text-brand-success', bg: 'bg-brand-success/10', icon: CheckCircle }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, status: opt.id }))}
                    className={`flex-1 rounded-xl border flex items-center justify-center transition-all ${formData.status === opt.id ? `${opt.bg} ${opt.color} border-${opt.id}-500/50 ring-2 ring-${opt.id}-500/10 scale-105` : 'bg-black/20 border-brand-border/40 text-brand-text-muted opacity-50'}`}
                  >
                    <opt.icon size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest pl-1">Payment Proof (Screenshot)</label>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {previewUrl ? (
              <div className="relative group aspect-video bg-black/40 rounded-2xl border border-brand-border/40 overflow-hidden">
                <img src={previewUrl} className="w-full h-full object-contain" alt="Payment proof preview" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-4">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all border border-white/20">Change Photo</button>
                  <button type="button" onClick={() => { setPreviewUrl(null); setScreenshotFile(null); setFormData(p => ({ ...p, screenshot_url: null })); }} className="px-4 py-2 bg-brand-error/20 hover:bg-brand-error text-white rounded-lg text-xs font-bold transition-all border border-brand-error/40">Remove</button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[2/1] border-2 border-dashed border-brand-border/60 hover:border-brand-primary/50 bg-black/10 rounded-2xl flex flex-col items-center justify-center gap-3 group cursor-pointer transition-all"
              >
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-brand-text-primary">Click to upload screenshot</div>
                  <div className="text-[10px] text-brand-text-muted mt-1 uppercase tracking-widest">PNG, JPG, WEBP — Max 5MB</div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 sticky bottom-0 bg-brand-card pb-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-brand-text-muted hov:text-brand-text-primary rounded-xl font-bold transition-all border border-white/10"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[2] btn-primary h-12 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus size={20} />
                  <span>{sale ? 'Update Sale Record' : 'Log Sale Entry'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
