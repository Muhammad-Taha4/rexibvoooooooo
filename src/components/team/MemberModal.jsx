import { useState, useEffect } from 'react';
import { X, UserPlus, Mail, Briefcase, DollarSign, Save } from 'lucide-react';
import { addTeamMember, updateTeamMember } from '../../services/api';

export const MemberModal = ({ member, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'sales_executive',
    salary_pkr: 15000,
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        role: member.role || 'sales_executive',
        salary_pkr: member.salary_pkr || 15000,
        is_active: member.is_active ?? true
      });
    }
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (member?.id) {
        await updateTeamMember(member.id, formData);
      } else {
        await addTeamMember(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Save member error:", err);
      alert("Failed to save member. Make sure email is unique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-brand-card border border-brand-border/40 rounded-3xl shadow-2xl relative overflow-hidden animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-brand-border/20 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl">
              <UserPlus size={20} />
            </div>
            <h2 className="text-xl font-black text-white">{member ? 'Edit Member' : 'Add Team Member'}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-brand-text-muted hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary transition-colors"><Briefcase size={18} /></div>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Abdullah Khan"
                  className="w-full h-12 bg-white/5 border border-brand-border/40 rounded-2xl pl-12 pr-4 text-sm text-white focus:border-brand-primary focus:bg-white/10 outline-none transition-all placeholder:text-brand-text-muted/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary transition-colors"><Mail size={18} /></div>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="member@rexivo.com"
                  className="w-full h-12 bg-white/5 border border-brand-border/40 rounded-2xl pl-12 pr-4 text-sm text-white focus:border-brand-primary focus:bg-white/10 outline-none transition-all placeholder:text-brand-text-muted/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest ml-1">Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full h-12 bg-white/5 border border-brand-border/40 rounded-2xl px-4 text-sm text-white focus:border-brand-primary outline-none appearance-none cursor-pointer"
                >
                  <option value="sales_executive">Sales Executive</option>
                  <option value="sales_lead">Sales Lead</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest ml-1">Salary (PKR)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary transition-colors"><DollarSign size={18} /></div>
                  <input 
                    required
                    type="number" 
                    value={formData.salary_pkr}
                    onChange={(e) => setFormData({...formData, salary_pkr: parseInt(e.target.value)})}
                    className="w-full h-12 bg-white/5 border border-brand-border/40 rounded-2xl pl-12 pr-4 text-sm text-white focus:border-brand-primary transition-all font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              type="submit"
              className="w-full h-14 btn-primary flex items-center justify-center gap-3 shadow-brand-primary/20 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-black uppercase tracking-[0.2em] text-xs">{member ? 'Update Staff Member' : 'Add to Team'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
