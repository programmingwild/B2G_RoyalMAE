import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../contexts/DataContext';
import { format, parseISO } from 'date-fns';

export default function TrendChart() {
  const { daily } = useData();

  const data = daily.map((d) => ({
    ...d,
    label: format(parseISO(d.date), 'MMM d'),
  }));

  return (
    <div className="card hover:scale-[1.01] hover:shadow-glass-lg transition-all" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
      <h3 className="text-sm font-semibold text-stone-600 mb-4">Activity — Last 30 Days</h3>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#a8a29e' }}
              tickLine={false}
              axisLine={false}
              interval={6}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#a8a29e' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: '#292524',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
                padding: '6px 12px',
              }}
              labelStyle={{ color: '#a8a29e', fontSize: 11 }}
              itemStyle={{ color: '#5eead4' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#0d9488"
              strokeWidth={2}
              fill="url(#grad)"
              name="Events"
              dot={false}
              activeDot={{ r: 4, fill: '#0d9488' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
