import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { MICRO_NEIGHBORHOODS } from '../data/categories';
import { TrendingUp, TrendingDown, Minus, PlusCircle, AlertTriangle, Users, Timer, BarChart3, Heart, Brain, ShieldCheck, Eye, Sparkles, Rss } from 'lucide-react';
import ScoreRing from './ScoreRing';
import TrendChart from './TrendChart';
import CategoryBar from './CategoryBar';
import Suggestions from './Suggestions';
import CommunityChallenge from './CommunityChallenge';
import ImpactRipple from './ImpactRipple';

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendLabels = {
  up: 'Trending Up',
  down: 'Declining',
  stable: 'Stable',
};

const trendColors = {
  up: 'text-emerald-600',
  down: 'text-rose-500',
  stable: 'text-stone-400',
};

export default function Dashboard() {
  const { neighborhood, trendDir, events, emergencyMode, score, timeBankBalance, pulseAvg, currentUser, communityMembers } = useData();
  const navigate = useNavigate();

  const hood = MICRO_NEIGHBORHOODS.find((h) => h.id === neighborhood);
  const TrendIcon = trendIcons[trendDir];
  const totalEvents = events.filter((e) => e.neighborhood === neighborhood).length;
  const onlineCount = communityMembers.filter((m) => m.online).length;

  return (
    <div className="space-y-5">
      {/* Header with user greeting */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg hover:scale-110 transition-all duration-300 glow-ring"
              style={{ backgroundColor: currentUser?.avatar?.color + '20', borderColor: currentUser?.avatar?.color, borderWidth: 1.5, boxShadow: `0 4px 14px ${currentUser?.avatar?.color}25` }}
            >
              {currentUser?.avatar?.emoji || '👤'}
            </button>
            <div>
              <h1 className="text-lg font-bold text-gradient">Hey, {currentUser?.name?.split(' ')[0] || 'Neighbor'}!</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: hood?.color }} />
                <span className="text-xs text-stone-400 font-medium">{hood?.name}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/feed')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:scale-105 transition-all duration-300"
              style={{ background: 'rgba(209, 250, 229, 0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-emerald-700 font-bold">{onlineCount} online</span>
            </button>
          </div>
        </div>
      </div>

      {/* Community Activity Banner */}
      <button
        onClick={() => navigate('/feed')}
        className="w-full card !border-primary-200/40 flex items-center gap-3 opacity-0 animate-fade-up delay-100 hover:!shadow-neon-teal"
        style={{ background: 'linear-gradient(135deg, rgba(204,251,241,0.5), rgba(209,250,229,0.4))' }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(20,184,166,0.15)', boxShadow: '0 0 12px rgba(20,184,166,0.15)' }}>
          <Rss size={18} className="text-primary-600" />
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-semibold text-stone-700">Community Feed</p>
          <p className="text-xs text-stone-400">See what your neighbors are up to</p>
        </div>
        <div className="flex -space-x-2">
          {communityMembers.filter(m => m.online).slice(0, 4).map((m) => (
            <div key={m.id} className="w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 border-white/70 transition-transform hover:scale-110" style={{ backgroundColor: m.avatar.color + '30' }}>
              {m.avatar.emoji}
            </div>
          ))}
        </div>
      </button>

      {/* Emergency banner */}
      {emergencyMode.active && (
        <button
          onClick={() => navigate('/emergency')}
          className="w-full card !border-rose-300/50 flex items-center gap-3 animate-fade-up"
          style={{ background: 'linear-gradient(135deg, rgba(255,228,230,0.7), rgba(254,205,211,0.5))' }}
        >
          <AlertTriangle size={20} className="text-rose-500 animate-pulse" />
          <div className="text-left">
            <p className="text-sm font-semibold text-rose-700">Emergency Mode Active</p>
            <p className="text-xs text-rose-500">Tap to view needs &amp; offers</p>
          </div>
        </button>
      )}

      {/* Score card */}
      <div className="card flex flex-col items-center py-8 opacity-0 animate-fade-up delay-200" style={{ background: 'rgba(255,255,255,0.65)' }}>
        <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-5">
          Reciprocity Density Score
        </p>
        <ScoreRing />
        <div className="flex items-center gap-1.5 mt-5">
          <TrendIcon size={14} className={trendColors[trendDir]} />
          <span className={`text-xs font-medium ${trendColors[trendDir]}`}>
            {trendLabels[trendDir]} this week
          </span>
        </div>
        <p className="text-xs text-stone-400 mt-2">{totalEvents} total acts logged</p>
      </div>

      {/* Quick log CTA */}
      <button
        onClick={() => navigate('/log')}
        className="w-full btn-primary flex items-center justify-center gap-2 text-base opacity-0 animate-fade-up delay-300 py-4"
      >
        <PlusCircle size={20} /> Log an Act of Reciprocity
      </button>

      {/* Community Challenges */}
      <CommunityChallenge />

      {/* Quick Links */}
      <div className="card opacity-0 animate-fade-up delay-400">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-stone-700">Community Hub</h3>
          <button onClick={() => navigate('/community')} className="text-xs text-primary-600 font-semibold hover:text-primary-700 transition-colors">View All →</button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Users, label: 'Skills', to: '/community/skills', color: 'text-violet-500', gradient: 'from-violet-100/70 to-violet-50/50' },
            { icon: Timer, label: 'Time Bank', to: '/community/timebank', color: 'text-amber-500', gradient: 'from-amber-100/70 to-amber-50/50' },
            { icon: Heart, label: 'Gratitude', to: '/community/gratitude', color: 'text-pink-500', gradient: 'from-pink-100/70 to-pink-50/50' },
            { icon: BarChart3, label: 'Pulse', to: '/community/pulse', color: 'text-emerald-500', gradient: 'from-emerald-100/70 to-emerald-50/50' },
          ].map((item, i) => (
            <button key={item.label} onClick={() => navigate(item.to)} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} hover:scale-110 transition-all duration-300 active:scale-95`} style={{ backdropFilter: 'blur(8px)' }}>
              <item.icon size={18} className={`${item.color} drop-shadow-sm`} />
              <span className="text-[10px] font-semibold text-stone-600">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Impact Ripple */}
      <ImpactRipple />

      {/* Advanced Insights */}
      <div className="card opacity-0 animate-fade-up delay-500">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-stone-700">Advanced Insights</h3>
          <button onClick={() => navigate('/insights')} className="text-xs text-primary-600 font-semibold hover:text-primary-700 transition-colors">View All →</button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: ShieldCheck, label: 'Verify', to: '/insights/verification', color: 'text-indigo-500', gradient: 'from-indigo-100/70 to-indigo-50/50' },
            { icon: Eye, label: 'Forecast', to: '/insights/forecast', color: 'text-teal-500', gradient: 'from-teal-100/70 to-teal-50/50' },
            { icon: Sparkles, label: 'Wins', to: '/insights/reinforcements', color: 'text-amber-500', gradient: 'from-amber-100/70 to-amber-50/50' },
            { icon: Brain, label: 'Network', to: '/insights/network', color: 'text-cyan-500', gradient: 'from-cyan-100/70 to-cyan-50/50' },
          ].map((item) => (
            <button key={item.label} onClick={() => navigate(item.to)} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} hover:scale-110 transition-all duration-300 active:scale-95`} style={{ backdropFilter: 'blur(8px)' }}>
              <item.icon size={18} className={`${item.color} drop-shadow-sm`} />
              <span className="text-[10px] font-semibold text-stone-600">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trend chart */}
      <TrendChart />

      {/* Category breakdown */}
      <CategoryBar />

      {/* Suggestions */}
      <Suggestions />

      {/* Info footer */}
      <div className="text-center pb-4 opacity-0 animate-fade-in delay-700">
        <p className="text-xs text-stone-400/80 leading-relaxed max-w-xs mx-auto">
          This score is a mirror, not a competition. It reflects the strength of mutual support
          your community has built — nothing moves without your participation.
        </p>
      </div>
    </div>
  );
}
