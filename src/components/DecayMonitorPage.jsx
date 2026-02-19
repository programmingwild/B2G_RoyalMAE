import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { computeDecayReport } from '../utils/decayDetection';
import { ArrowLeft, Activity, TrendingDown, AlertTriangle, BarChart3, Calendar, Layers } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

export default function DecayMonitorPage() {
  const navigate = useNavigate();
  const { neighborhood, events } = useData();
  const [tab, setTab] = useState('velocity');

  const report = useMemo(() => {
    if (!neighborhood) return null;
    return computeDecayReport(events, neighborhood);
  }, [events, neighborhood]);

  if (!report) return null;

  const alertColors = { critical: 'border-rose-200/50 text-rose-700', warning: 'border-amber-200/50 text-amber-700', info: 'border-blue-200/50 text-blue-700' };

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/insights')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Insights Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Activity size={20} className="text-orange-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Decay Monitor</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Detect declining reciprocity before visible collapse.</p>

      {/* Alert Banner */}
      {report.alert && (
        <div className={`p-3 rounded-xl border mb-5 ${alertColors[report.alert.level]}`} style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.6)' }}>
          <div className="flex gap-2 items-start">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold capitalize mb-0.5">{report.alert.level} Alert</p>
              <p className="text-xs leading-relaxed">{report.alert.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <p className={`text-xl font-bold ${report.isDecaying ? 'text-rose-500' : 'text-emerald-500'}`}>
            {report.decayRate}%
          </p>
          <p className="text-[10px] text-stone-400">Decay Rate</p>
        </div>
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-xl font-bold text-stone-700">{report.consecutiveDeclines}</p>
          <p className="text-[10px] text-stone-400">Decline Weeks</p>
        </div>
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-300 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <p className={`text-xl font-bold ${report.projectedChange > 0 ? 'text-emerald-500' : report.projectedChange > -15 ? 'text-amber-500' : 'text-rose-500'}`}>
            {report.projectedChange > 0 ? '+' : ''}{report.projectedChange}%
          </p>
          <p className="text-[10px] text-stone-400">3mo Projection</p>
        </div>
      </div>

      <div className="card text-center mb-5 !py-3" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          report.projectedLabel === 'Growing' ? 'bg-emerald-100 text-emerald-700' :
          report.projectedLabel === 'Stable' ? 'bg-blue-100 text-blue-700' :
          report.projectedLabel === 'Declining' ? 'bg-amber-100 text-amber-700' :
          'bg-rose-100 text-rose-700'
        }`}>
          {report.projectedLabel}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'velocity', label: 'Velocity', icon: TrendingDown },
          { id: 'diversity', label: 'Diversity', icon: Layers },
          { id: 'seasonal', label: 'Seasonal', icon: Calendar },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-[1.02] ${tab === t.id ? 'bg-orange-100 text-orange-700' : 'bg-stone-100 text-stone-500'}`}>
            <t.icon size={12} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'velocity' && report.velocity && (
        <div className="card mb-4" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Participation Velocity</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={report.velocity}>
                <defs>
                  <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="startDate" tick={{ fontSize: 10 }} stroke="#a8a29e" />
                <YAxis tick={{ fontSize: 10 }} stroke="#a8a29e" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                <Area type="monotone" dataKey="velocity" stroke="#f97316" fill="url(#velGrad)" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-1">
            {report.velocity.slice(-3).map((v) => (
              <div key={v.weekLabel} className="flex items-center justify-between text-xs">
                <span className="text-stone-400">{v.startDate}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-stone-600">{v.velocity}/day</span>
                  <span className={`text-[10px] ${v.trend === 'up' ? 'text-emerald-500' : v.trend === 'down' ? 'text-rose-500' : 'text-stone-400'}`}>
                    {v.trend === 'up' ? '↑' : v.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'diversity' && (
        <div className="card mb-4" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Category Diversity</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-3 rounded-xl text-center" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.6)' }}>
              <p className="text-lg font-bold text-stone-700">{report.centralization.recentDiversity}</p>
              <p className="text-[10px] text-stone-400">Recent (2 wks)</p>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.6)' }}>
              <p className="text-lg font-bold text-stone-700">{report.centralization.previousDiversity}</p>
              <p className="text-[10px] text-stone-400">Previous (2 wks)</p>
            </div>
          </div>
          {report.centralization.centralizing ? (
            <div className="p-2.5 rounded-xl" style={{ backdropFilter: 'blur(12px)', background: 'rgba(251,191,36,0.1)' }}>
              <p className="text-xs text-amber-700">
                ⚠️ Category diversity has decreased by {Math.abs(report.centralization.diversityChange)}%. Interactions are becoming more homogeneous.
              </p>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl" style={{ backdropFilter: 'blur(12px)', background: 'rgba(16,185,129,0.1)' }}>
              <p className="text-xs text-emerald-700">
                ✅ Category diversity is {report.centralization.diversityChange > 0 ? 'increasing' : 'stable'}. Healthy variety of interactions.
              </p>
            </div>
          )}
        </div>
      )}

      {tab === 'seasonal' && (
        <div className="card mb-4" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Seasonal Patterns</h3>
          {report.seasonal.monthly && (
            <div className="h-40 mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.seasonal.monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                  <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="#a8a29e" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#a8a29e" />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                  <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {report.seasonal.peaks.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-stone-600 mb-1">Peak months</p>
              <div className="flex gap-2 flex-wrap">
                {report.seasonal.peaks.map((p) => (
                  <span key={p.month} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    {p.month} (+{p.deviation}%)
                  </span>
                ))}
              </div>
            </div>
          )}
          {report.seasonal.troughs.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-600 mb-1">Low months</p>
              <div className="flex gap-2 flex-wrap">
                {report.seasonal.troughs.map((t) => (
                  <span key={t.month} className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                    {t.month} ({t.deviation}%)
                  </span>
                ))}
              </div>
            </div>
          )}
          {!report.seasonal.hasSeasonalPattern && (
            <div className="text-center py-4 rounded-xl" style={{ backdropFilter: 'blur(14px)', background: 'rgba(255,255,255,0.6)' }}>
              <p className="text-xs text-stone-400">No significant seasonal patterns detected yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
