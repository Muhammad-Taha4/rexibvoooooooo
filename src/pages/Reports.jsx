import { useState, useEffect } from 'react';
import { Calendar, BarChart3, TrendingUp, DollarSign, Wallet, FileText } from 'lucide-react';
import { ReportSummary } from '../components/reports/ReportSummary';
import { ProfitChart } from '../components/reports/ProfitChart';
import { MemberBreakdown } from '../components/reports/MemberBreakdown';
import { ExportButtons } from '../components/reports/ExportButtons';
import { getMonthlySummary, getMemberStats, getYearlyTrend } from '../services/api';

export const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  
  const [stats, setStats] = useState({
    revenue: 0,
    upfront: 0,
    grossProfit: 0,
    totalSalaries: 0,
    netProfit: 0,
    memberCount: 0
  });

  const [profitTrend, setProfitTrend] = useState([]);
  const [memberBreakdown, setMemberBreakdown] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sumRes, memRes, trendRes] = await Promise.all([
          getMonthlySummary(month, year),
          getMemberStats(month, year),
          getYearlyTrend(year)
        ]);

        if (sumRes.data) {
          setStats({
            revenue: sumRes.data.revenue || 0,
            upfront: sumRes.data.upfront || 0,
            grossProfit: sumRes.data.profit || 0,
            totalSalaries: sumRes.data.total_salaries || 0,
            netProfit: (sumRes.data.profit || 0) - (sumRes.data.total_salaries || 0),
            memberCount: memRes.data?.length || 0
          });
          setProfitTrend(trendRes.data || []);
          setMemberBreakdown(memRes.data || []);
        } else {
          setStats({
            revenue: 0,
            upfront: 0,
            grossProfit: 0,
            totalSalaries: 0,
            netProfit: 0,
            memberCount: 0
          });
          setProfitTrend([]);
          setMemberBreakdown([]);
        }
      } catch (err) {
        console.error("Reports fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year]);

  const handleExportCSV = () => {
    const header = "Member,Sales,Revenue (USD),Profit (PKR),Salary (PKR),Pending\n";
    const rows = memberBreakdown.map(m => `${m.name},${m.salesCount},${m.revenue},${m.profit},${m.salary || 15000},${m.pendingCount}`).join("\n");
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance_report_${month+1}_${year}.csv`;
    link.click();
  };

  const handleExportMonthly = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let content = `MONTHLY FINANCIAL REPORT - ${months[month]} ${year}\n`;
    content += "=".repeat(50) + "\n\n";
    content += `Total Revenue: $${(stats?.revenue || 0).toLocaleString()}\n`;
    content += `Upfront Received: $${(stats?.upfront || 0).toLocaleString()}\n`;
    content += `Gross Profit (PKR): ${(stats?.grossProfit || 0).toLocaleString()}\n`;
    content += `Total Salaries (PKR): ${(stats?.totalSalaries || 0).toLocaleString()}\n`;
    content += `Net Profit (PKR): ${(stats?.netProfit || 0).toLocaleString()}\n`;
    content += `Active Members: ${stats.memberCount}\n\n`;
    content += `MEMBER BREAKDOWN\n` + "-".repeat(50) + "\n";
    memberBreakdown.forEach(m => {
      content += `${m.name || 'Unknown'}: ${m.salesCount || 0} sales | $${(m.revenue || 0).toLocaleString()} | PKR ${(m.profit || 0).toLocaleString()} | Salary: PKR ${(m.salary || 15000).toLocaleString()}\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monthly_summary_${months[month]}_${year}.txt`;
    link.click();
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in print:p-0">
      <div className="flex items-end justify-between print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-secondary uppercase tracking-[0.2em] mb-1">
            <BarChart3 size={14} /> Analytics & Reporting Engine
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white underline underline-offset-8 decoration-4 decoration-brand-success/30">Financial Analytics</h1>
          <p className="text-brand-text-muted text-sm max-w-lg mt-6">
            Detailed profitability analysis, expense tracking (salaries), and export-ready summaries.
          </p>
        </div>

        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-brand-card/40 border border-brand-border/40 rounded-2xl px-4 py-2.5 shadow-lg">
              <Calendar size={16} className="text-brand-text-muted" />
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
            <div className="flex items-center gap-2 bg-brand-card/40 border border-brand-border/40 rounded-2xl px-4 py-2.5 shadow-lg">
              <select 
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="bg-transparent text-xs font-bold text-brand-text-primary outline-none uppercase tracking-widest cursor-pointer"
              >
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <ExportButtons 
            onExportCSV={handleExportCSV}
            onExportMonthly={handleExportMonthly}
          />
        </div>
      </div>

      {/* Main Report Content */}
      <ReportSummary stats={stats} />

      <div className="grid grid-cols-2 gap-8 h-[450px]">
        <MemberBreakdown 
          data={memberBreakdown} 
          totalSalaries={stats.totalSalaries}
        />
        <div className="space-y-8 h-full flex flex-col">
          <ProfitChart data={profitTrend} />
          <div className="card flex-1 flex flex-col justify-center gap-4 bg-linear-to-br from-brand-primary/5 to-brand-secondary/5 border-brand-primary/10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-brand-success/10 text-brand-success shadow-lg shadow-black/20"><TrendingUp size={24} /></div>
              <div>
                <div className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Active Members</div>
                <div className="text-2xl font-black text-brand-success font-mono">{stats.memberCount} Team</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary shadow-lg shadow-black/20"><DollarSign size={24} /></div>
              <div>
                <div className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Contribution per Member</div>
                <div className="text-2xl font-black text-white font-mono">PKR {Math.round(stats.grossProfit / (stats.memberCount || 1)).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
