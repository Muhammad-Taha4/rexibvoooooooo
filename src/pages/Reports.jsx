import { useState, useEffect } from 'react';
import { Calendar, BarChart3, TrendingUp, DollarSign, Wallet, FileText } from 'lucide-react';
import { ReportSummary } from '../components/reports/ReportSummary';
import { ProfitChart } from '../components/reports/ProfitChart';
import { MemberBreakdown } from '../components/reports/MemberBreakdown';
import { ExportButtons } from '../components/reports/ExportButtons';
import { ExecutiveInsights } from '../components/reports/ExecutiveInsights';
import { SalesLedger } from '../components/reports/SalesLedger';
import { getSales, getTeamMembers } from '../services/api';
import { calculateTotalCommission } from '../utils/commission';

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
    memberCount: 0,
    profitMargin: 0,
    bestPerformer: null,
    worstPerformer: null
  });

  const [profitTrend, setProfitTrend] = useState([]);
  const [memberBreakdown, setMemberBreakdown] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [allMembers, setAllMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch raw data instead of RPCs for robustness
        const [salesRes, membersRes] = await Promise.all([
          getSales(),
          getTeamMembers()
        ]);

        const allSales = salesRes.data || [];
        const allMembers = membersRes.data || [];

        // Filter by month/year for the current summary
        const filteredSales = allSales.filter(s => {
          const d = new Date(s.date || s.created_at);
          return d.getMonth() === month && d.getFullYear() === year;
        });

        // Calculate Monthly Summary Stats
        const revenue = filteredSales.reduce((a, s) => a + (s.amount_usd || 0), 0);
        const upfront = filteredSales.reduce((a, s) => a + (s.upfront_usd || 0), 0);
        
        // PAYOUTS (per-sale slab commission engine)
        const totalCommissions = calculateTotalCommission(filteredSales);
        const totalBaseSalaries = allMembers.reduce((a, m) => a + (m.salary_pkr || 15000), 0);
        const totalExpense = totalCommissions + totalBaseSalaries;
        
        // COMPANY PROFIT (Assuming 280 PKR/USD exchange rate)
        const exchangeRate = 280;
        const totalRevenuePKR = revenue * exchangeRate;
        const netBusinessProfitPKR = totalRevenuePKR - totalExpense;
        const profitMargin = totalRevenuePKR > 0 ? (netBusinessProfitPKR / totalRevenuePKR) * 100 : 0;
        
        // Prepare Member Breakdown
        const breakdown = allMembers.map(m => {
          const mSales = filteredSales.filter(s => s.member_id === m.id);
          const mRev = mSales.reduce((a, s) => a + (s.amount_usd || 0), 0);
          const mComm = calculateTotalCommission(mSales);
          const mSalary = m.salary_pkr || 15000;
          const mNetProfit = (mRev * exchangeRate) - (mComm + mSalary);
          
          return {
            id: m.id,
            name: m.name,
            salesCount: mSales.length,
            revenue: mRev,
            commission: mComm,
            profit: mNetProfit,
            salary: mSalary,
            totalPayable: mComm + mSalary,
            pendingCount: mSales.filter(s => s.status === 'pending').length
          };
        });

        // Insights
        const sortedMembers = [...breakdown].sort((a, b) => b.revenue - a.revenue);
        const bestPerformer = sortedMembers[0]?.revenue > 0 ? sortedMembers[0] : null;
        const worstPerformer = sortedMembers[sortedMembers.length - 1]?.revenue >= 0 ? sortedMembers[sortedMembers.length - 1] : null;

        setStats({
          revenue,
          upfront,
          grossProfit: totalCommissions, 
          totalSalaries: totalBaseSalaries,
          totalExpense,
          netProfit: netBusinessProfitPKR,
          companyProfitUSD: netBusinessProfitPKR / exchangeRate,
          profitMargin,
          bestPerformer,
          worstPerformer,
          memberCount: allMembers.length,
          salesCount: filteredSales.length
        });
        setMemberBreakdown(breakdown);
        setAllMembers(allMembers);
        setFilteredSales(filteredSales);

        // Prepare Profit Trend (PKR) for the year
        const yearlyTrend = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => {
          const monthSales = allSales.filter(s => {
            const d = new Date(s.date || s.created_at);
            return d.getMonth() === i && d.getFullYear() === year;
          });
          return {
            month: m,
            profit: calculateTotalCommission(monthSales)
          };
        });
        setProfitTrend(yearlyTrend);

      } catch (err) {
        console.error("Reports fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year]);

  const handleExportCSV = () => {
    const header = "Member,Sales,Revenue (USD),Commission (PKR),Base Salary (PKR),Total Payable (PKR),Net Profit (PKR),Pending\n";
    let rows = memberBreakdown.map(m => `${m.name},${m.salesCount},${m.revenue},${m.commission},${m.salary},${m.totalPayable},${m.profit},${m.pendingCount}`).join("\n");
    
    // Total Row
    const totals = {
      sales: memberBreakdown.reduce((a, b) => a + (b.salesCount || 0), 0),
      rev: memberBreakdown.reduce((a, b) => a + (b.revenue || 0), 0),
      comm: memberBreakdown.reduce((a, b) => a + (b.commission || 0), 0),
      sal: memberBreakdown.reduce((a, b) => a + (b.salary || 15000), 0),
      pay: memberBreakdown.reduce((a, b) => a + (b.totalPayable || 0), 0),
      profit: memberBreakdown.reduce((a, b) => a + (b.profit || 0), 0),
    };
    rows += `\nTOTAL,${totals.sales},${totals.rev},${totals.comm},${totals.sal},${totals.pay},${totals.profit},`;

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
    content += `Total Commissions (PKR): ${(stats?.grossProfit || 0).toLocaleString()}\n`;
    content += `Total Base Salaries (PKR): ${(stats?.totalSalaries || 0).toLocaleString()}\n`;
    content += `Total Net Payout (PKR): ${(stats?.grossProfit + stats?.totalSalaries || 0).toLocaleString()}\n`;
    content += `Active Members: ${stats.memberCount}\n\n`;
    content += `MEMBER BREAKDOWN\n` + "-".repeat(50) + "\n";
    memberBreakdown.forEach(m => {
      content += `${m.name || 'Unknown'}: ${m.salesCount || 0} sales | $${(m.revenue || 0).toLocaleString()} | Comm: PKR ${(m.commission || 0).toLocaleString()} | Base Salary: PKR ${(m.salary || 0).toLocaleString()} | Total Pay: PKR ${(m.totalPayable || 0).toLocaleString()} | Net Profit: PKR ${(m.profit || 0).toLocaleString()}\n`;
    });
    
    const totals = {
      sales: memberBreakdown.reduce((a, b) => a + (b.salesCount || 0), 0),
      rev: memberBreakdown.reduce((a, b) => a + (b.revenue || 0), 0),
      comm: memberBreakdown.reduce((a, b) => a + (b.commission || 0), 0),
      sal: memberBreakdown.reduce((a, b) => a + (b.salary || 15000), 0),
      pay: memberBreakdown.reduce((a, b) => a + (b.totalPayable || 0), 0),
      profit: memberBreakdown.reduce((a, b) => a + (b.profit || 0), 0),
    };
    
    content += "-".repeat(50) + "\n";
    content += `OVERALL TOTALS: ${totals.sales} sales | $${totals.rev.toLocaleString()} Revenue | Total Commission: PKR ${totals.comm.toLocaleString()} | Total Salaries: PKR ${totals.sal.toLocaleString()} | TOTAL PAYOUT: PKR ${totals.pay.toLocaleString()} | TOTAL COMPANY PROFIT: PKR ${totals.profit.toLocaleString()}\n`;
    
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

      <ExecutiveInsights stats={stats} />
      <ReportSummary stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[450px]">
        <MemberBreakdown 
          data={memberBreakdown} 
          totalSalaries={stats.totalSalaries}
        />
        <ProfitChart data={profitTrend} />
      </div>

      <SalesLedger sales={filteredSales} members={allMembers} />
    </div>
  );
};
