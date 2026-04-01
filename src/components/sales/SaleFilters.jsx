import { Search, Filter, Calendar, Users, Target } from 'lucide-react';

export const SaleFilters = ({ filters, setFilters, members }) => {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-wrap items-center gap-4 animate-fade-in">
      {/* Search */}
      <div className="flex-[2] min-w-[300px] relative group">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary transition-colors" />
        <input 
          type="text" 
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search client names or project details..."
          className="w-full h-11 bg-brand-card/40 border border-brand-border/40 rounded-2xl pl-11 pr-4 text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:border-brand-primary outline-none transition-all shadow-inner shadow-black/10"
        />
      </div>

      {/* Month */}
      <div className="flex-1 min-w-[140px] relative group">
        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary" />
        <select 
          name="month"
          value={filters.month}
          onChange={handleChange}
          className="w-full h-11 bg-brand-card/40 border border-brand-border/40 rounded-2xl pl-11 pr-4 text-xs font-bold text-brand-text-primary outline-none focus:border-brand-primary transition-all appearance-none uppercase tracking-widest cursor-pointer"
        >
          <option value="all">All Time</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
      </div>

      {/* Member */}
      <div className="flex-1 min-w-[160px] relative group">
        <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary" />
        <select 
          name="member"
          value={filters.member}
          onChange={handleChange}
          className="w-full h-11 bg-brand-card/40 border border-brand-border/40 rounded-2xl pl-11 pr-4 text-xs font-bold text-brand-text-primary outline-none focus:border-brand-primary transition-all appearance-none uppercase tracking-widest cursor-pointer"
        >
          <option value="all">All Members</option>
          {members.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="flex-1 min-w-[140px] relative group">
        <Target size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary text-brand-success" />
        <select 
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full h-11 bg-brand-card/40 border border-brand-border/40 rounded-2xl pl-11 pr-8 text-xs font-bold text-brand-text-primary outline-none focus:border-brand-primary transition-all appearance-none uppercase tracking-widest cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="received">Received</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};
