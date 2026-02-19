import { useData } from '../contexts/DataContext';
import { Trophy, TrendingUp, Flame } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

export default function CommunityChallenge() {
  const { challenges } = useData();

  if (!challenges || challenges.length === 0) return null;

  return (
    <div className="card !border-orange-200 hover:scale-[1.01] hover:shadow-glass-lg transition-all" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'linear-gradient(to bottom right, rgba(255,251,235,0.65), rgba(255,237,213,0.65), rgba(255,228,230,0.65))' }}>
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={16} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-stone-700">Active Challenges</h3>
      </div>

      <div className="space-y-3">
        {challenges.slice(0, 3).map((challenge) => {
          const progress = Math.min((challenge.current / challenge.target) * 100, 100);
          const daysLeft = challenge.endDate
            ? Math.max(0, differenceInDays(parseISO(challenge.endDate), new Date()))
            : null;
          const isComplete = progress >= 100;

          return (
            <div key={challenge.id} className="bg-white/70 rounded-xl p-3">
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{challenge.emoji || '🎯'}</span>
                  <span className="text-xs font-semibold text-stone-700">{challenge.title}</span>
                </div>
                {isComplete ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">✓ Done!</span>
                ) : daysLeft !== null ? (
                  <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                    <Flame size={10} className="text-orange-400" /> {daysLeft}d left
                  </span>
                ) : null}
              </div>

              {challenge.description && (
                <p className="text-[10px] text-stone-400 mb-2 line-clamp-1">{challenge.description}</p>
              )}

              {/* Progress bar */}
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-stone-400">{challenge.current} / {challenge.target} {challenge.unit || 'acts'}</span>
                <span className="text-[10px] font-semibold" style={{ color: isComplete ? '#059669' : '#f59e0b' }}>{Math.round(progress)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
