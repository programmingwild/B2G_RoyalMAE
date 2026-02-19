import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { computeReinforcementReport } from '../utils/reinforcement';
import { ArrowLeft, Award, Flame, Star, Sparkles, Heart } from 'lucide-react';

export default function ReinforcementsPage() {
  const navigate = useNavigate();
  const { neighborhood, events, gratitude } = useData();

  const report = useMemo(() => {
    if (!neighborhood) return null;
    return computeReinforcementReport(events, gratitude, neighborhood);
  }, [events, gratitude, neighborhood]);

  if (!report) return null;

  const { milestones, streak, firstTimers, spotlight } = report;
  const nextMilestone = milestones.find((m) => !m.reached);
  const reachedMilestones = milestones.filter((m) => m.reached);

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/insights')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Insights Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={20} className="text-amber-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Collective Wins</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Gentle recognition — not gamification, just gratitude.</p>

      {/* Streak */}
      <div className="card text-center mb-5 opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px)', background: 'linear-gradient(to bottom, rgba(255,251,235,0.5), rgba(255,255,255,0.65))' }}>
        <p className="text-3xl mb-1">{streak.emoji}</p>
        <p className="text-4xl font-bold text-amber-600">{streak.current}</p>
        <p className="text-sm text-stone-500 font-medium">{streak.label}</p>
        <p className="text-xs text-stone-400 mt-1">Day{streak.current !== 1 ? 's' : ''} of consecutive community activity</p>
        <p className="text-[10px] text-stone-300 mt-1">Best streak: {streak.best} days</p>
      </div>

      {/* Next Milestone Progress */}
      {nextMilestone && (
        <div className="card mb-5" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <h3 className="text-sm font-semibold text-stone-700 mb-2">Next Collective Milestone</h3>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{nextMilestone.emoji}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-stone-700">{nextMilestone.label}</p>
              <p className="text-xs text-stone-400">{nextMilestone.description}</p>
            </div>
          </div>
          <div className="mb-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-400">{nextMilestone.current} acts</span>
              <span className="text-stone-500 font-medium">{nextMilestone.target} target</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700"
                style={{ width: `${nextMilestone.progress}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-stone-400 text-right">{nextMilestone.progress}%</p>
        </div>
      )}

      {/* Reached Milestones */}
      {reachedMilestones.length > 0 && (
        <div className="card mb-5" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Milestones Reached</h3>
          <div className="space-y-2">
            {reachedMilestones.map((m) => (
              <div key={m.label} className="flex items-center gap-3 p-2.5 bg-amber-50 rounded-xl hover:shadow-glass-lg hover:scale-[1.01] transition-all">
                <span className="text-xl">{m.emoji}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-stone-700">{m.label}</p>
                  <p className="text-[10px] text-stone-400">{m.description}</p>
                </div>
                <Award size={16} className="text-amber-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* First Timers */}
      <div className="card mb-5" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <h3 className="text-sm font-semibold text-stone-700 mb-2">🌟 New This Week</h3>
        {firstTimers.newCategoryCount > 0 ? (
          <div>
            <p className="text-xs text-stone-500 mb-2">
              {firstTimers.newCategoryCount} new {firstTimers.newCategoryCount === 1 ? 'type' : 'types'} of reciprocity explored!
            </p>
            <div className="flex gap-2 flex-wrap">
              {firstTimers.newCategories.map((c) => (
                <span key={c} className="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-400">All categories have been explored before — try something new this week!</p>
        )}
        <p className="text-xs text-stone-400 mt-2">{firstTimers.totalRecentEvents} total events in the last 7 days</p>
      </div>

      {/* Gratitude Spotlight */}
      {spotlight && (
        <div className="card opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px)', background: 'linear-gradient(to bottom, rgba(253,242,248,0.5), rgba(255,255,255,0.65))' }}>
          <h3 className="text-sm font-semibold text-stone-700 mb-3">
            <span className="mr-1">💛</span> Today's Gratitude Spotlight
          </h3>
          <div className="p-3 bg-white rounded-xl border border-pink-100">
            <p className="text-sm text-stone-700 leading-relaxed">"{spotlight.message}"</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-stone-400">— Anonymous neighbor</span>
              <div className="flex items-center gap-1">
                <Heart size={12} className="text-pink-400" />
                <span className="text-[10px] text-pink-500 font-medium">{spotlight.hearts || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Philosophy */}
      <div className="card mt-5" style={{ backdropFilter: 'blur(12px)', background: 'rgba(250,250,249,0.5)' }}>
        <p className="text-xs text-stone-500 leading-relaxed text-center">
          These aren't badges to compete for — they're mirrors reflecting what your community has 
          already accomplished <em>together</em>. Every act matters equally.
        </p>
      </div>
    </div>
  );
}
