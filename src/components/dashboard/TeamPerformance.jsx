import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#14b8a6'];

export const TeamPerformance = ({ data }) => {
  return (
    <div className="card h-100 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold">Team Performance Comparison</h3>
          <p className="text-[10px] uppercase font-bold text-brand-text-muted tracking-widest mt-1">Closed Deals & Revenue Growth</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b60" />
            <XAxis 
              dataKey="name" 
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
              cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
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
            <Bar 
              dataKey="value" 
              radius={[6, 6, 0, 0]}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
