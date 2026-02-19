import { useData } from '../contexts/DataContext';
import { EVENT_CATEGORIES } from '../data/categories';

export default function CategoryBar() {
  const { catBreakdown } = useData();

  if (catBreakdown.length === 0) {
    return (
      <div className="card" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <h3 className="text-sm font-semibold text-stone-600 mb-3">Category Breakdown</h3>
        <p className="text-sm text-stone-400">No events in the last 14 days.</p>
      </div>
    );
  }

  const maxCount = Math.max(...catBreakdown.map((c) => c.count));

  return (
    <div className="card hover:scale-[1.01] hover:shadow-glass-lg transition-all" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
      <h3 className="text-sm font-semibold text-stone-600 mb-4">Last 14 Days by Category</h3>
      <div className="space-y-2.5">
        {catBreakdown.map(({ category, count }) => {
          const cat = EVENT_CATEGORIES.find((c) => c.id === category);
          if (!cat) return null;
          const pct = (count / maxCount) * 100;
          return (
            <div key={category} className="flex items-center gap-3">
              <span className="text-base w-6 text-center">{cat.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <span className="text-stone-600 font-medium">{cat.label}</span>
                  <span className="text-stone-400">{count}</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-400 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
