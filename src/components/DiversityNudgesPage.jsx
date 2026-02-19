import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { generateDiversityNudges } from '../utils/diversityOptimizer';
import { ArrowLeft, Lightbulb, ChevronRight } from 'lucide-react';

const priorityColors = {
  high: 'border-l-rose-400 bg-rose-50',
  medium: 'border-l-amber-400 bg-amber-50',
  low: 'border-l-blue-400 bg-blue-50',
  positive: 'border-l-emerald-400 bg-emerald-50',
};

const priorityLabels = {
  high: { text: 'High Priority', color: 'text-rose-600 bg-rose-100' },
  medium: { text: 'Consider This', color: 'text-amber-600 bg-amber-100' },
  low: { text: 'Gentle Idea', color: 'text-blue-600 bg-blue-100' },
  positive: { text: 'Celebration!', color: 'text-emerald-600 bg-emerald-100' },
};

export default function DiversityNudgesPage() {
  const navigate = useNavigate();
  const { neighborhood, events, skills, timeBankEntries, resources } = useData();

  const nudges = useMemo(() => {
    if (!neighborhood) return [];
    return generateDiversityNudges(events, skills, timeBankEntries, resources, neighborhood);
  }, [events, skills, timeBankEntries, resources, neighborhood]);

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/insights')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Insights Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Lightbulb size={20} className="text-yellow-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Diversity Nudges</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Behavioral suggestions to broaden community connections.</p>

      {/* Summary */}
      <div className="card text-center mb-5 opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(255,255,255,0.55)' }}>
        <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-2">Active Suggestions</p>
        <p className="text-4xl font-bold text-yellow-600">{nudges.length}</p>
        <p className="text-xs text-stone-400 mt-1">
          {nudges.filter((n) => n.priority === 'high').length} high priority • {nudges.filter((n) => n.priority === 'positive').length} celebrations
        </p>
      </div>

      {/* Nudge Cards */}
      {nudges.length === 0 ? (
        <div className="card text-center py-12" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <Lightbulb size={32} className="mx-auto mb-2 text-stone-300" />
          <p className="text-sm text-stone-400">No nudges right now — your community has great diversity!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {nudges.map((nudge) => (
            <div key={nudge.id} className={`card !p-0 overflow-hidden border-l-4 ${priorityColors[nudge.priority]} hover:shadow-glass-lg hover:scale-[1.01] transition-all`} style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{nudge.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-stone-700">{nudge.title}</h3>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed mb-2">{nudge.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityLabels[nudge.priority].color}`}>
                        {priorityLabels[nudge.priority].text}
                      </span>
                      <span className="text-[10px] text-stone-400 capitalize">{nudge.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* How it works */}
      <div className="card mt-5" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(254,249,195,0.4)' }}>
        <h3 className="text-xs font-semibold text-yellow-700 mb-2">How nudges work</h3>
        <p className="text-[10px] text-yellow-600 leading-relaxed">
          These suggestions are generated from interaction patterns — not tracking individuals. 
          They're gentle ideas, not mandates. Your community decides what fits.
          Nudges refresh automatically as activity patterns change.
        </p>
      </div>
    </div>
  );
}
