import { useData } from '../contexts/DataContext';
import { Zap, Heart, Users, BookOpen, Timer, Hand } from 'lucide-react';

export default function ImpactRipple() {
  const { events, skills, resources, gratitude, timeBankEntries, timeBankBalance, calEvents, safetyCheckins, gardenItems } = useData();

  const totalActs = events.length;
  const totalSkills = skills.length;
  const totalResources = resources.length;
  const totalGratitude = gratitude.length;
  const totalHours = timeBankBalance.given;
  const totalEvents = calEvents.length;
  const totalSafety = safetyCheckins.length;
  const totalGarden = gardenItems.length;

  const totalImpact = totalActs + totalSkills + totalResources + totalGratitude + totalEvents + totalSafety + totalGarden;
  const rippleMultiplier = 2.5; // Each act ripples to ~2.5 more people
  const estimatedLives = Math.round(totalImpact * rippleMultiplier);

  // Ripple rings data
  const rings = [
    { label: 'Direct Acts', value: totalActs, icon: Hand, color: '#14b8a6', size: 80 },
    { label: 'Skills Shared', value: totalSkills, icon: BookOpen, color: '#8b5cf6', size: 56 },
    { label: 'Items Shared', value: totalResources, icon: Users, color: '#3b82f6', size: 44 },
    { label: 'Thanks Given', value: totalGratitude, icon: Heart, color: '#ec4899', size: 36 },
    { label: 'Hours Given', value: totalHours, icon: Timer, color: '#f59e0b', size: 28 },
  ];

  return (
    <div className="card !border-indigo-200 hover:scale-[1.01] hover:shadow-glass-lg transition-all" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'linear-gradient(to bottom right, rgba(237,233,254,0.6), rgba(224,231,255,0.6), rgba(207,250,254,0.6))' }}>
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-indigo-500" />
        <h3 className="text-sm font-semibold text-stone-700">Your Impact Ripple</h3>
      </div>

      {/* Ripple visualization */}
      <div className="relative flex items-center justify-center py-4">
        {/* Concentric rings */}
        {[120, 96, 72, 48].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-indigo-200/40"
            style={{ width: size, height: size, animation: `pulse ${2 + i * 0.5}s infinite ease-out`, opacity: 0.3 + (i * 0.15) }}
          />
        ))}
        {/* Center number */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-white shadow-lg flex flex-col items-center justify-center">
          <p className="text-xl font-bold text-indigo-700">{totalImpact}</p>
          <p className="text-[8px] text-indigo-400 font-medium uppercase tracking-wider">Total Acts</p>
        </div>
      </div>

      {/* Estimated reach */}
      <div className="text-center mb-4">
        <p className="text-xs text-stone-400">Estimated community reach</p>
        <p className="text-2xl font-bold text-indigo-600">{estimatedLives}</p>
        <p className="text-[10px] text-stone-400">lives potentially touched</p>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        {rings.map((ring) => (
          <div key={ring.label} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: ring.color + '18' }}>
              <ring.icon size={12} style={{ color: ring.color }} />
            </div>
            <span className="text-xs text-stone-600 flex-1">{ring.label}</span>
            <span className="text-xs font-bold text-stone-700">{ring.value}</span>
            <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${totalImpact > 0 ? Math.max((ring.value / totalImpact) * 100, 5) : 0}%`, backgroundColor: ring.color }} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.06); opacity: 0.15; }
          100% { transform: scale(1); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
