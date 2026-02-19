import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { computeBridgingIndex, getBridgingSuggestions } from '../utils/bridgingIndex';
import { ArrowLeft, Waypoints, ChevronRight } from 'lucide-react';

export default function BridgingIndexPage() {
  const navigate = useNavigate();
  const { neighborhood, events, skills, timeBankEntries } = useData();

  const data = useMemo(() => {
    if (!neighborhood) return null;
    return computeBridgingIndex(events, skills, timeBankEntries, neighborhood);
  }, [events, skills, timeBankEntries, neighborhood]);

  const suggestions = useMemo(() => data ? getBridgingSuggestions(data) : [], [data]);

  if (!data) return null;

  const labelColor = data.bridgingLabel === 'Strong Bridges' ? 'text-emerald-600 bg-emerald-50' : data.bridgingLabel === 'Building Bridges' ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/insights')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Insights Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Waypoints size={20} className="text-violet-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Bridging Index</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Who connects with whom — cross-demographic inclusion.</p>

      {/* Main Score */}
      <div className="card text-center mb-5" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'linear-gradient(to bottom, rgba(139,92,246,0.1), rgba(255,255,255,0.65))' }}>
        <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-2">Bridging Strength</p>
        <p className="text-5xl font-bold text-violet-700">{data.bridgingScore}</p>
        <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${labelColor}`}>{data.bridgingLabel}</span>
        {data.velocityChange !== 0 && (
          <p className={`text-xs mt-2 ${data.velocityChange > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {data.velocityChange > 0 ? '↑' : '↓'} {Math.abs(data.velocityChange)}% vs previous month
          </p>
        )}
      </div>

      {/* Metric Bars */}
      <div className="card mb-4" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <h3 className="text-sm font-semibold text-stone-700 mb-3">Inclusion Dimensions</h3>
        <div className="space-y-4">
          {data.metrics.map((m) => (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-stone-600">{m.label}</span>
                <span className="text-xs font-bold" style={{ color: m.color }}>{m.value}%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${m.value}%`, backgroundColor: m.color }}
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Time Distribution */}
      <div className="card mb-4" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <h3 className="text-sm font-semibold text-stone-700 mb-3">Activity Time Distribution</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Morning', value: data.timeSlots.morning, emoji: '🌅' },
            { label: 'Afternoon', value: data.timeSlots.afternoon, emoji: '☀️' },
            { label: 'Evening', value: data.timeSlots.evening, emoji: '🌙' },
          ].map((slot) => (
            <div key={slot.label} className="text-center p-3 rounded-xl" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.6)' }}>
              <p className="text-lg mb-0.5">{slot.emoji}</p>
              <p className="text-lg font-bold text-stone-700">{slot.value}</p>
              <p className="text-[10px] text-stone-400">{slot.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="card !py-3 text-center opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-lg font-bold text-violet-600">{data.categoryPairCount}</p>
          <p className="text-[10px] text-stone-400">Cross-category pairs</p>
        </div>
        <div className="card !py-3 text-center opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-lg font-bold text-cyan-600">{data.uniqueCategories}</p>
          <p className="text-[10px] text-stone-400">Active categories</p>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="card" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Bridge-Building Suggestions</h3>
          <div className="space-y-2.5">
            {suggestions.map((s, i) => (
              <div key={i} className={`p-3 rounded-xl hover:shadow-glass-lg hover:scale-[1.01] transition-all`} style={{ backdropFilter: 'blur(12px)', background: s.priority === 'positive' ? 'rgba(16,185,129,0.1)' : s.priority === 'high' ? 'rgba(244,63,94,0.1)' : 'rgba(255,255,255,0.6)' }}>
                <div className="flex gap-2 items-start">
                  <span className="text-base">{s.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold text-stone-700">{s.title}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{s.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
