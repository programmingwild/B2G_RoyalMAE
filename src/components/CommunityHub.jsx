import { useNavigate } from 'react-router-dom';
import { HUB_FEATURES } from '../data/features';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function CommunityHub() {
  const navigate = useNavigate();
  const { timeBankBalance, pulseAvg, skills, resources, gratitude, calEvents, safetyCheckins, gardenItems, neighborhood } = useData();

  const badges = {
    skills: skills.filter((s) => s.neighborhood === neighborhood && s.status === 'active').length,
    library: resources.filter((r) => r.neighborhood === neighborhood && r.status === 'available').length,
    gratitude: gratitude.filter((g) => g.neighborhood === neighborhood).length,
    timebank: timeBankBalance.given > 0 ? `${timeBankBalance.given}h` : null,
    pulse: pulseAvg > 0 ? pulseAvg : null,
    events: calEvents.filter((e) => e.neighborhood === neighborhood).length,
    safety: safetyCheckins.filter((s) => s.neighborhood === neighborhood && s.status === 'open').length,
    garden: gardenItems.filter((g) => g.neighborhood === neighborhood).length,
  };

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Dashboard
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={20} className="text-primary-500 drop-shadow-sm animate-glow" />
        <h1 className="text-xl font-bold text-gradient">Community Hub</h1>
      </div>
      <p className="text-sm text-stone-400 mb-6">Everything your neighborhood needs to thrive</p>

      <div className="grid grid-cols-2 gap-3">
        {HUB_FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          const badge = badges[feature.id];
          const delayClass = idx < 8 ? `delay-${(idx + 1) * 100}` : '';
          return (
            <button
              key={feature.id}
              onClick={() => navigate(feature.route)}
              className={`card text-left transition-all duration-300 !p-4 relative opacity-0 animate-fade-up ${delayClass} hover:scale-[1.04] hover:shadow-glass-lg group`}
              style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110 group-hover:shadow-sm`} style={{ background: `rgba(${feature.color.includes('primary') ? '204,251,241' : feature.color.includes('pink') ? '252,231,243' : feature.color.includes('amber') ? '254,243,199' : feature.color.includes('violet') ? '237,233,254' : feature.color.includes('blue') ? '219,234,254' : feature.color.includes('emerald') ? '209,250,229' : feature.color.includes('rose') ? '255,228,230' : '209,250,229'},0.7)` }}>
                <Icon size={20} className={feature.iconColor} />
              </div>
              <h3 className="text-sm font-semibold text-stone-700 mb-0.5 group-hover:text-gradient transition-colors">{feature.label}</h3>
              <p className="text-xs text-stone-400 leading-relaxed">{feature.description}</p>
              {badge !== null && badge !== undefined && badge !== 0 && (
                <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm" style={{ background: 'rgba(204,251,241,0.7)', backdropFilter: 'blur(4px)', color: '#0f766e' }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
