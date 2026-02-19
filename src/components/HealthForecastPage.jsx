import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { forecastReciprocity, projectHealthScore } from '../utils/forecasting';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Eye, BarChart3, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, ComposedChart, Line, Bar } from 'recharts';

export default function HealthForecastPage() {
  const navigate = useNavigate();
  const { neighborhood, events } = useData();

  const report = useMemo(() => {
    if (!neighborhood) return null;
    return projectHealthScore(events, neighborhood);
  }, [events, neighborhood]);

  if (!report) return null;

  const trendIcon = report.trendDirection === 'growing' ? TrendingUp : report.trendDirection === 'declining' ? TrendingDown : Minus;
  const TrendIcon = trendIcon;
  const trendColor = report.trendDirection === 'growing' ? 'text-emerald-500' : report.trendDirection === 'declining' ? 'text-rose-500' : 'text-blue-500';
  const trendBg = report.trendDirection === 'growing' ? 'from-emerald-50' : report.trendDirection === 'declining' ? 'from-rose-50' : 'from-blue-50';

  // Combine historical + projections for chart
  const chartData = [
    ...report.historical.map((h) => ({ label: h.label, actual: h.count, type: 'historical' })),
    ...report.projections.map((p) => ({ label: p.label, projected: p.projected, confidence: p.confidence, type: 'forecast' })),
  ];

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/insights')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Insights Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Eye size={20} className="text-teal-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Health Forecast</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Time-series modeling — power stays local.</p>

      {/* Direction Card */}
      <div className="card text-center mb-5 opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(255,255,255,0.55)' }}>
        <TrendIcon size={28} className={`mx-auto mb-2 ${trendColor}`} />
        <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-1">12-Week Outlook</p>
        <p className={`text-3xl font-bold ${trendColor}`}>
          {report.percentChange > 0 ? '+' : ''}{report.percentChange}%
        </p>
        <p className="text-sm text-stone-500 mt-1 capitalize">{report.trendDirection}</p>
      </div>

      {/* Score Impact */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-xs text-stone-400 mb-1">Current Rate</p>
          <p className="text-2xl font-bold text-stone-700">{report.currentRate}</p>
          <p className="text-[10px] text-stone-400">events/week</p>
        </div>
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-300 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-xs text-stone-400 mb-1">Projected Rate</p>
          <p className={`text-2xl font-bold ${trendColor}`}>{report.projectedRate}</p>
          <p className="text-[10px] text-stone-400">events/week (12w)</p>
        </div>
      </div>

      {/* Regression Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card !py-3 text-center opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-sm font-bold text-stone-700">{report.regression.slope}</p>
          <p className="text-[10px] text-stone-400">Trend Slope</p>
        </div>
        <div className="card !py-3 text-center opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-sm font-bold text-stone-700">{report.regression.r2}</p>
          <p className="text-[10px] text-stone-400">R² Fit</p>
        </div>
        <div className="card !py-3 text-center opacity-0 animate-fade-up delay-300 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-sm font-bold text-stone-700">{report.scoreChange > 0 ? '+' : ''}{report.scoreChange}</p>
          <p className="text-[10px] text-stone-400">Score Impact</p>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="card mb-5" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <h3 className="text-sm font-semibold text-stone-700 mb-3">Historical + Projection</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="label" tick={{ fontSize: 9 }} stroke="#a8a29e" />
              <YAxis tick={{ fontSize: 10 }} stroke="#a8a29e" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
              <Area type="monotone" dataKey="actual" stroke="#14b8a6" fill="url(#histGrad)" strokeWidth={2} dot={{ r: 3 }} name="Actual" />
              <Area type="monotone" dataKey="projected" stroke="#8b5cf6" fill="url(#projGrad)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 2 }} name="Projected" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 justify-center mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-teal-500" />
            <span className="text-[10px] text-stone-400">Historical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-violet-500 border-dashed" style={{ borderBottom: '1px dashed #8b5cf6' }} />
            <span className="text-[10px] text-stone-400">Projected</span>
          </div>
        </div>
      </div>

      {/* Confidence Breakdown */}
      <div className="card mb-5" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <h3 className="text-sm font-semibold text-stone-700 mb-3">Projection Confidence</h3>
        <div className="space-y-2">
          {report.projections.filter((_, i) => i % 3 === 0).map((p) => (
            <div key={p.label} className="flex items-center gap-3 hover:shadow-glass-lg hover:scale-[1.01] transition-all">
              <span className="text-xs text-stone-400 w-8">{p.label}</span>
              <div className="flex-1 bg-stone-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    p.confidence > 70 ? 'bg-emerald-400' : p.confidence > 40 ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${p.confidence}%` }}
                />
              </div>
              <span className="text-xs font-medium text-stone-600 w-8 text-right">{p.confidence}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="card" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(204,251,241,0.45)' }}>
        <div className="flex gap-2 items-start">
          <Target size={14} className="text-teal-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-teal-700 leading-relaxed">{report.summary}</p>
        </div>
      </div>
    </div>
  );
}
