import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, ShieldCheck, Network, Activity, Waypoints, Siren, Sparkles, Eye, Lightbulb, Coins, FlaskConical, Brain, ChevronRight } from 'lucide-react';

const INSIGHT_FEATURES = [
  {
    id: 'verification',
    name: 'Reciprocity Verification',
    description: 'Privacy-first dual-confirmation trust system',
    icon: ShieldCheck,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    route: '/insights/verification',
  },
  {
    id: 'network',
    name: 'Network Health',
    description: 'Anonymous interaction graph & resilience metrics',
    icon: Network,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
    route: '/insights/network',
  },
  {
    id: 'decay',
    name: 'Decay Monitor',
    description: 'Detect declining reciprocity early',
    icon: Activity,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    route: '/insights/decay',
  },
  {
    id: 'bridging',
    name: 'Bridging Index',
    description: 'Cross-demographic inclusion measurement',
    icon: Waypoints,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    route: '/insights/bridging',
  },
  {
    id: 'crisis',
    name: 'Crisis Activation',
    description: 'Rapid-response mutual aid mode',
    icon: Siren,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    route: '/insights/crisis',
  },
  {
    id: 'reinforcements',
    name: 'Collective Wins',
    description: 'Milestones, streaks & gratitude spotlights',
    icon: Sparkles,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    route: '/insights/reinforcements',
  },
  {
    id: 'forecast',
    name: 'Health Forecast',
    description: 'Time-series projections & trend analysis',
    icon: Eye,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    route: '/insights/forecast',
  },
  {
    id: 'nudges',
    name: 'Diversity Nudges',
    description: 'Behavioral suggestions for broader connections',
    icon: Lightbulb,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    route: '/insights/nudges',
  },
  {
    id: 'coop',
    name: 'Cooperative Budget',
    description: 'Micro-grants & community fund management',
    icon: Coins,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    route: '/insights/coop',
  },
  {
    id: 'research',
    name: 'Urban Research',
    description: 'Opt-in anonymized data for city planners',
    icon: FlaskConical,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    route: '/insights/research',
  },
];

export default function InsightsHub() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Dashboard
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Brain size={20} className="text-primary-600 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Advanced Insights</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Deep analytics & systemic intelligence for your community.</p>

      <div className="space-y-2.5">
        {INSIGHT_FEATURES.map((feature, idx) => {
          const delayClass = idx < 10 ? `delay-${(idx + 1) * 100}` : '';
          return (
            <button
              key={feature.id}
              onClick={() => navigate(feature.route)}
              className={`w-full card !p-3 flex items-center gap-3 hover:scale-[1.02] hover:shadow-glass-lg transition-all active:scale-[0.99] text-left opacity-0 animate-fade-up ${delayClass} group`}
              style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ background: `rgba(${feature.color.includes('indigo') ? '224,231,255' : feature.color.includes('cyan') ? '207,250,254' : feature.color.includes('orange') ? '255,237,213' : feature.color.includes('violet') ? '237,233,254' : feature.color.includes('rose') ? '255,228,230' : feature.color.includes('amber') ? '254,243,199' : feature.color.includes('teal') ? '204,251,241' : feature.color.includes('yellow') ? '254,249,195' : feature.color.includes('emerald') ? '209,250,229' : '243,232,255'},0.7)` }}>
                <feature.icon size={18} className={feature.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-700">{feature.name}</p>
                <p className="text-[10px] text-stone-400 truncate">{feature.description}</p>
              </div>
              <ChevronRight size={16} className="text-stone-300 flex-shrink-0 group-hover:text-primary-400 transition-colors" />
            </button>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="text-center mt-6 pb-4">
        <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
          All analytics are computed locally on your device. No personal data is ever collected, 
          transmitted, or stored on external servers.
        </p>
      </div>
    </div>
  );
}
