import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { getUserById } from '../utils/auth';
import { ArrowLeft, Heart, Wrench, Clock, MessageSquare, Calendar, Shield, Flower2, Users, Zap } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

const ACTIVITY_TYPES = {
  event: { icon: Zap, color: 'text-primary-600', bg: 'bg-primary-50', label: 'logged an act of reciprocity' },
  gratitude: { icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50', label: 'shared gratitude' },
  skill: { icon: Wrench, color: 'text-violet-600', bg: 'bg-violet-50', label: 'shared a skill' },
  timebank: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'logged time bank hours' },
  emergency: { icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50', label: 'posted in emergency mode' },
  calEvent: { icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', label: 'created an event' },
  safety: { icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'checked in on safety net' },
  garden: { icon: Flower2, color: 'text-green-600', bg: 'bg-green-50', label: 'added a garden entry' },
};

const DEMO_ACTIVITY = [
  { type: 'gratitude', userName: 'Alice Chen', userAvatar: { color: '#0d9488', emoji: '🌿' }, message: 'Thank you neighbor for the fresh cookies yesterday!', ago: 2 },
  { type: 'skill', userName: 'Raj Patel', userAvatar: { color: '#e28320', emoji: '🌻' }, message: 'Offering: Basic bike repair & maintenance', ago: 5 },
  { type: 'event', userName: 'Maria Santos', userAvatar: { color: '#7c3aed', emoji: '🏡' }, message: 'Helped a neighbor carry groceries', ago: 8 },
  { type: 'timebank', userName: 'Kenji Tanaka', userAvatar: { color: '#2563eb', emoji: '🤝' }, message: 'Gave 2 hours of tutoring help', ago: 12 },
  { type: 'calEvent', userName: 'Sarah Johnson', userAvatar: { color: '#dc2626', emoji: '🌳' }, message: 'Created: Weekend Block Cleanup', ago: 18 },
  { type: 'gratitude', userName: 'Omar Hassan', userAvatar: { color: '#059669', emoji: '⭐' }, message: 'This neighborhood is special because everyone watches out for each other', ago: 25 },
  { type: 'skill', userName: 'Lily Wong', userAvatar: { color: '#d946ef', emoji: '🎨' }, message: 'Offering: Watercolor painting lessons', ago: 35 },
  { type: 'event', userName: 'Carlos Rivera', userAvatar: { color: '#ea580c', emoji: '🌊' }, message: 'Shared homemade soup with a sick neighbor', ago: 45 },
  { type: 'garden', userName: 'Nina Kowalski', userAvatar: { color: '#0284c7', emoji: '🦋' }, message: 'Planted tomatoes in the community plot', ago: 60 },
  { type: 'timebank', userName: 'James Wright', userAvatar: { color: '#4f46e5', emoji: '🌺' }, message: 'Gave 1 hour of dog walking help', ago: 90 },
];

export default function ActivityFeed() {
  const navigate = useNavigate();
  const { events, gratitude, skills, timeBankEntries, calEvents, safetyCheckins, gardenItems, neighborhood, currentUser } = useData();

  // Build activity feed from real data + demo data
  const feed = useMemo(() => {
    const items = [];

    // Real gratitude posts
    gratitude.filter((g) => g.neighborhood === neighborhood).forEach((g) => {
      const user = g.userId ? getUserById(g.userId) : null;
      items.push({
        id: g.id,
        type: 'gratitude',
        userName: user?.name || g.userName || 'A neighbor',
        userAvatar: user?.avatar || g.userAvatar || { color: '#9ca3af', emoji: '👤' },
        message: g.message,
        timestamp: g.timestamp,
        isReal: true,
      });
    });

    // Real skills
    skills.filter((s) => s.neighborhood === neighborhood).forEach((s) => {
      const user = s.userId ? getUserById(s.userId) : null;
      items.push({
        id: s.id,
        type: 'skill',
        userName: user?.name || s.userName || 'A neighbor',
        userAvatar: user?.avatar || s.userAvatar || { color: '#9ca3af', emoji: '👤' },
        message: `${s.type === 'offer' ? 'Offering' : 'Looking for'}: ${s.title}`,
        timestamp: s.timestamp,
        isReal: true,
      });
    });

    // Real events
    events.filter((e) => e.neighborhood === neighborhood).slice(-5).forEach((e) => {
      const user = e.userId ? getUserById(e.userId) : null;
      items.push({
        id: e.id,
        type: 'event',
        userName: user?.name || e.userName || 'A neighbor',
        userAvatar: user?.avatar || e.userAvatar || { color: '#9ca3af', emoji: '👤' },
        message: e.note || `${e.category} act of reciprocity`,
        timestamp: e.timestamp,
        isReal: true,
      });
    });

    // If not enough real items, fill with demo activity
    if (items.length < 5) {
      DEMO_ACTIVITY.forEach((d, i) => {
        const ts = new Date(Date.now() - d.ago * 60 * 1000);
        items.push({
          id: `demo-feed-${i}`,
          type: d.type,
          userName: d.userName,
          userAvatar: d.userAvatar,
          message: d.message,
          timestamp: ts.toISOString(),
          isReal: false,
        });
      });
    }

    // Sort by timestamp desc
    items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return items.slice(0, 20);
  }, [events, gratitude, skills, timeBankEntries, calEvents, neighborhood]);

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Dashboard
      </button>

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-primary-600 drop-shadow-sm" />
          <h1 className="text-xl font-bold text-gradient">Community Feed</h1>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(209,250,229,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-emerald-700 font-medium">Live</span>
        </div>
      </div>
      <p className="text-sm text-stone-400 mb-5">See what your neighbors are up to in real time</p>

      {/* Feed */}
      <div className="space-y-3">
        {feed.map((item, idx) => {
          const actType = ACTIVITY_TYPES[item.type] || ACTIVITY_TYPES.event;
          const Icon = actType.icon;
          const isMe = item.userName === currentUser?.name;
          const delayClass = idx < 8 ? `delay-${(idx + 1) * 100}` : '';

          return (
            <div key={item.id} className={`card !p-3 flex gap-3 items-start opacity-0 animate-fade-up ${delayClass} hover:shadow-glass-lg transition-all hover:scale-[1.01]`} style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform hover:scale-110"
                  style={{ backgroundColor: item.userAvatar.color + '20' }}
                >
                  {item.userAvatar.emoji}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${actType.bg}`}>
                  <Icon size={10} className={actType.color} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-sm font-semibold truncate ${isMe ? 'text-gradient' : 'text-stone-800'}`}>
                    {isMe ? 'You' : item.userName}
                  </span>
                  <span className="text-xs text-stone-400">{actType.label}</span>
                </div>
                <p className="text-sm text-stone-600 leading-snug">{item.message}</p>
                <p className="text-[10px] text-stone-400 mt-1">
                  {formatDistanceToNow(parseISO(item.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {feed.length === 0 && (
        <div className="card text-center py-12 opacity-0 animate-fade-up" style={{ backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.6)' }}>
          <Users size={32} className="mx-auto mb-2 text-stone-300" />
          <p className="text-sm text-stone-400">No activity yet. Be the first!</p>
        </div>
      )}
    </div>
  );
}
