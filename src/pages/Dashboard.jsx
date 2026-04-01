import { useState, useEffect } from 'react';
import { Calendar, Download, FileText, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { StatCards } from '../components/dashboard/StatCards';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { SalesByMember } from '../components/dashboard/SalesByMember';
import { TeamPerformance } from '../components/dashboard/TeamPerformance';
import { getMonthlySummary, getMemberStats, getYearlyTrend } from '../services/api';

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    upfront: 0,
    profit: 0,
    netProfit: 0,
    salesCount: 0,
    pendingCount: 0
  });

  const [charts, setCharts] = useState({
    revenueTrend: [],
    salesByMember: [],
    teamPerformance: []
  });

  const [date, setDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch real data from Supabase RPCs
        const [sumRes, memRes, trendRes] = await Promise.all([
          getMonthlySummary(date.month, date.year),
          getMemberStats(date.month, date.year),
          getYearlyTrend(date.year)
        ]);

        setStats(sumRes.data || {
          revenue: 0,
          upfront: 0,
          profit: 0,
          netProfit: 0,
          salesCount: 0,
          pendingCount: 0
        });

        setCharts({
          revenueTrend: trendRes.data || [],
          salesByMember: memRes.data?.map(m => ({ name: m.name, value: m.revenue })) || [],
          teamPerformance: memRes.data?.map(m => ({ name: m.name, value: m.sales_count })) || []
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date.month, date.year]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2 underline decoration-brand-primary/30 decoration-4 underline-offset-8">Executive Overview</h1>
          <p className="text-brand-text-muted text-sm max-w-lg mt-4">
            Real-time financial performance analytics. Data shown is for the current selection and cumulative metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-brand-card/40 border border-brand-border/40 rounded-2xl px-4 py-2.5 shadow-lg">
            <Calendar size={16} className="text-brand-primary" />
            <select 
              value={date.month}
              onChange={(e) => setDate(p => ({ ...p, month: parseInt(e.target.value) }))}
              className="bg-transparent text-xs font-bold text-brand-text-primary outline-none uppercase tracking-widest cursor-pointer"
            >
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          </div>
          <button className="p-2.5 bg-brand-card border border-brand-border/40 rounded-2xl text-brand-text-muted hover:text-brand-primary transition-all shadow-lg active:scale-95"><FileText size={18} /></button>
          <button className="p-2.5 bg-brand-card border border-brand-border/40 rounded-2xl text-brand-text-muted hover:text-brand-primary transition-all shadow-lg active:scale-95"><Download size={18} /></button>
        </div>
      </div>

      <StatCards stats={stats} />

      <div className="grid grid-cols-2 gap-8">
        <RevenueChart data={charts.revenueTrend} />
        <SalesByMember data={charts.salesByMember} />
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <TeamPerformance data={charts.teamPerformance} />
        </div>
        <div className="card flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4">Financial Status</h3>
            <div className="space-y-6">
              {[
                { label: 'Platform ROI', value: '450%', icon: TrendingUp, color: 'text-brand-success' },
                { label: 'Lead Conversion', value: '18.4%', icon: Users, color: 'text-brand-primary' },
                { label: 'Avg Sale Value', value: `$${(stats.revenue / (stats.salesCount || 1)).toFixed(0)}`, icon: DollarSign, color: 'text-brand-secondary' },
                { label: 'Collection Rate', value: `${((stats.upfront / (stats.revenue || 1)) * 100).toFixed(1)}%`, icon: Clock, color: 'text-brand-warning' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg text-brand-text-muted group-hover:text-brand-primary transition-colors"><item.icon size={16} /></div>
                    <span className="text-xs font-bold text-brand-text-muted uppercase tracking-widest">{item.label}</span>
                  </div>
                  <span className={`text-sm font-black font-mono ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full h-12 btn-primary flex items-center justify-center gap-2 mt-8 text-xs uppercase tracking-widest font-black shadow-brand-primary/20 shadow-xl">
            View Operations Detail
          </button>
        </div>
      </div>
    </div>
  );
};
