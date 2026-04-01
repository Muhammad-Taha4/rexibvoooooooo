import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#14b8a6'];

export const SalesByMember = ({ data }) => {
  return (
    <div className="card h-80 flex flex-col relative overflow-hidden group">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold">Revenue Breakdown</h3>
          <p className="text-[10px] uppercase font-bold text-brand-text-muted tracking-widest mt-1">Contribution by Member (%)</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="110%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={85}
              paddingAngle={8}
              dataKey="value"
              strokeWidth={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f1629', 
                border: 'none', 
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#e2e8f0',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
              formatter={(v) => `$${v}`}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Centered Total Stat */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <div className="text-[9px] font-bold text-brand-text-muted uppercase tracking-[0.2em] mb-1">Total</div>
        <div className="text-xl font-black text-white font-mono">${(data?.reduce((a, b) => a + (b.value || 0), 0) || 0).toLocaleString()}</div>
      </div>
    </div>
  );
};
