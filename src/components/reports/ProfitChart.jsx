import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ProfitChart = ({ data }) => {
  return (
    <div className="card h-80 flex flex-col p-6 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold">Monthly Profitability (PKR)</h3>
          <p className="text-[10px] uppercase font-bold text-brand-text-muted tracking-widest mt-1">Gross Profit Evolution • Current Year</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b60" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f1629', 
                border: '1px solid rgba(30, 41, 59, 0.5)', 
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#e2e8f0',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="profit" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorProfit)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
