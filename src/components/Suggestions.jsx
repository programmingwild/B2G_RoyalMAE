import { useData } from '../contexts/DataContext';
import { Lightbulb } from 'lucide-react';

export default function Suggestions() {
  const { suggestions } = useData();

  if (!suggestions.length) return null;

  return (
    <div className="card border-warm-100 hover:scale-[1.01] hover:shadow-glass-lg transition-all" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(255, 247, 237, 0.6)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-warm-500" />
        <h3 className="text-sm font-semibold text-warm-700">Suggestions</h3>
      </div>
      <ul className="space-y-3">
        {suggestions.map((s, i) => (
          <li key={i} className="hover:scale-[1.01] transition-all">
            <p className="text-sm font-medium text-stone-700">{s.title}</p>
            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{s.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
