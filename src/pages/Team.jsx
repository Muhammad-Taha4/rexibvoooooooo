import { useState, useEffect, useCallback } from 'react';
import { Users, Filter, Plus, RotateCw } from 'lucide-react';
import { TeamGrid } from '../components/team/TeamGrid';
import { MemberModal } from '../components/team/MemberModal';
import { getTeamMembers, getMemberStats, deleteTeamMember } from '../services/api';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export const Team = () => {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [statsByMember, setStatsByMember] = useState({});
  const [month, setMonth] = useState(new Date().getMonth());
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const handleEdit = (member) => {
    setEditMember(member);
    setShowAdd(true);
  };

  const handleDelete = (member) => {
    setMemberToDelete(member);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      await deleteTeamMember(memberToDelete.id);
      fetchData();
    } catch (err) {
      console.error("Error deleting member:", err);
    } finally {
      setShowDeleteConfirm(false);
      setMemberToDelete(null);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [membersRes, statsRes] = await Promise.all([
        getTeamMembers(),
        getMemberStats(month, new Date().getFullYear())
      ]);

      setMembers(membersRes.data || []);

      if (statsRes.data) {
        const statsMap = {};
        statsRes.data.forEach(s => {
          statsMap[s.id] = {
            revenue: s.revenue,
            profit: s.profit,
            salesCount: s.sales_count,
            pendingCount: s.pending_count
          };
        });
        setStatsByMember(statsMap);
      } else {
        setStatsByMember({});
      }
    } catch (err) {
      console.error("Team fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-[0.2em] mb-1">
            <Users size={14} /> Team Performance Overview
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white underline underline-offset-8 decoration-4 decoration-brand-secondary/30">Sales Executives</h1>
          <p className="text-brand-text-muted text-sm max-w-lg mt-6">
            Compare member contributions, track profitability vs salary, and adjust roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-3 bg-brand-card/50 border border-brand-border/40 rounded-2xl text-brand-text-muted hover:text-brand-primary hover:border-brand-primary/40 transition-all shadow-lg active:scale-95"
          >
            <RotateCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="flex items-center gap-2 bg-brand-card/40 border border-brand-border/40 rounded-2xl px-4 py-2.5 shadow-lg">
            <Filter size={16} className="text-brand-text-muted" />
            <select 
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="bg-transparent text-xs font-bold text-brand-text-primary outline-none uppercase tracking-widest cursor-pointer"
            >
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => { setEditMember(null); setShowAdd(true); }}
            className="btn-primary h-12 px-6 flex items-center gap-2 shadow-brand-primary/20 shadow-xl"
          >
            <Plus size={20} />
            <span className="font-bold">Add Team Member</span>
          </button>
        </div>
      </div>

      <TeamGrid 
        members={members} 
        statsByMember={statsByMember} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showAdd && (
        <MemberModal 
          member={editMember}
          onClose={() => { setShowAdd(false); setEditMember(null); }}
          onSave={fetchData}
        />
      )}

      <ConfirmDialog 
        isOpen={showDeleteConfirm}
        title="Delete Team Member?"
        message={`Are you sure you want to delete ${memberToDelete?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => { setShowDeleteConfirm(false); setMemberToDelete(null); }}
      />
    </div>
  );
};
