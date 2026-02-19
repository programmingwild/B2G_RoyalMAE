import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { MICRO_NEIGHBORHOODS } from '../data/categories';
import { AVATAR_COLORS, AVATAR_EMOJIS } from '../utils/auth';
import { ArrowLeft, LogOut, Edit3, Check, X, Calendar, BarChart3, Heart, Users, Award } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function UserProfile() {
  const navigate = useNavigate();
  const { currentUser, logout, updateProfile, events, gratitude, timeBankEntries, skills, communityMembers, neighborhood } = useData();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editColor, setEditColor] = useState(currentUser?.avatar?.color || AVATAR_COLORS[0]);
  const [editEmoji, setEditEmoji] = useState(currentUser?.avatar?.emoji || AVATAR_EMOJIS[0]);

  if (!currentUser) return null;

  const hood = MICRO_NEIGHBORHOODS.find((h) => h.id === currentUser.neighborhood);
  const myEvents = events.filter((e) => e.userId === currentUser.id || e.neighborhood === neighborhood).length;
  const myGratitude = gratitude.filter((g) => g.userId === currentUser.id).length;
  const myTimeBankHours = timeBankEntries.filter((t) => t.userId === currentUser.id && t.type === 'given').reduce((s, t) => s + t.hours, 0);
  const mySkills = skills.filter((s) => s.userId === currentUser.id).length;
  const onlineMembers = communityMembers.filter((m) => m.online);

  const handleSave = () => {
    if (!editName.trim()) return;
    updateProfile({ name: editName.trim(), avatar: { color: editColor, emoji: editEmoji } });
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <button onClick={() => navigate('/')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 text-sm transition-colors">
        <ArrowLeft size={16} /> Dashboard
      </button>

      {/* Profile Card */}
      <div className="card opacity-0 animate-fade-up" style={{ backdropFilter: 'blur(20px) saturate(180%)', background: 'linear-gradient(135deg, rgba(240,253,250,0.85), rgba(255,255,255,0.75))' }}>
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 glow-ring shadow-glass transition-transform hover:scale-110"
            style={{ backgroundColor: currentUser.avatar.color + '20', borderColor: currentUser.avatar.color, borderWidth: 2 }}
          >
            {currentUser.avatar.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gradient truncate">{currentUser.name}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: hood?.color }} />
              <span className="text-sm text-stone-500">{hood?.name}</span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Joined {formatDistanceToNow(parseISO(currentUser.joinedAt), { addSuffix: true })}
            </p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="p-2 rounded-lg hover:bg-white/50 text-stone-400 hover:text-primary-600 transition-all hover:scale-110 hover:shadow-glass"
          >
            <Edit3 size={16} />
          </button>
        </div>

        {/* Edit form */}
        {editing && (
          <div className="mt-4 pt-4 border-t border-white/40 space-y-4 animate-fade-up">
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1 block">Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 mb-2 block">Icon</label>
              <div className="flex flex-wrap gap-1.5">
                {AVATAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setEditEmoji(emoji)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all hover:scale-110
                      ${editEmoji === emoji ? 'bg-primary-100/80 ring-2 ring-primary-400 shadow-neon-teal scale-110' : 'bg-white/40 hover:bg-white/70'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 mb-2 block">Color</label>
              <div className="flex flex-wrap gap-1.5">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditColor(color)}
                    className={`w-7 h-7 rounded-full transition-all hover:scale-125 ${editColor === color ? 'ring-2 ring-offset-2 ring-primary-400 scale-125' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="flex-1 btn-secondary flex items-center justify-center gap-1 text-sm !py-2">
                <X size={14} /> Cancel
              </button>
              <button onClick={handleSave} className="flex-1 btn-primary flex items-center justify-center gap-1 text-sm !py-2">
                <Check size={14} /> Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card !p-3 text-center opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ background: 'rgba(240,253,250,0.7)', backdropFilter: 'blur(12px)' }}>
          <BarChart3 size={18} className="text-primary-600 mx-auto mb-1 drop-shadow-sm" />
          <p className="text-lg font-bold text-gradient">{myEvents}</p>
          <p className="text-xs text-primary-500">Acts Logged</p>
        </div>
        <div className="card !p-3 text-center opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ background: 'rgba(253,242,248,0.7)', backdropFilter: 'blur(12px)' }}>
          <Heart size={18} className="text-pink-600 mx-auto mb-1 drop-shadow-sm" />
          <p className="text-lg font-bold text-pink-700">{myGratitude}</p>
          <p className="text-xs text-pink-500">Gratitude Posts</p>
        </div>
        <div className="card !p-3 text-center opacity-0 animate-fade-up delay-300 hover:scale-105 transition-transform" style={{ background: 'rgba(255,251,235,0.7)', backdropFilter: 'blur(12px)' }}>
          <Calendar size={18} className="text-amber-600 mx-auto mb-1 drop-shadow-sm" />
          <p className="text-lg font-bold text-amber-700">{myTimeBankHours}h</p>
          <p className="text-xs text-amber-500">Hours Given</p>
        </div>
        <div className="card !p-3 text-center opacity-0 animate-fade-up delay-400 hover:scale-105 transition-transform" style={{ background: 'rgba(245,243,255,0.7)', backdropFilter: 'blur(12px)' }}>
          <Award size={18} className="text-violet-600 mx-auto mb-1 drop-shadow-sm" />
          <p className="text-lg font-bold text-violet-700">{mySkills}</p>
          <p className="text-xs text-violet-500">Skills Shared</p>
        </div>
      </div>

      {/* Community Members */}
      <div className="card opacity-0 animate-fade-up delay-500" style={{ backdropFilter: 'blur(16px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-stone-800 flex items-center gap-2">
            <Users size={16} className="text-primary-600" />
            Neighbors in {hood?.name}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(209,250,229,0.7)', backdropFilter: 'blur(8px)', color: '#047857' }}>
            {onlineMembers.length} online
          </span>
        </div>

        <div className="space-y-2">
          {communityMembers.slice(0, 10).map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-all hover:shadow-glass">
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-transform hover:scale-110"
                  style={{ backgroundColor: member.avatar.color + '20' }}
                >
                  {member.avatar.emoji}
                </div>
                {member.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-700 truncate">
                  {member.name}
                  {member.id === currentUser.id && <span className="text-primary-500 text-xs ml-1">(you)</span>}
                </p>
                <p className="text-xs text-stone-400">
                  {member.isDemo
                    ? 'Community member'
                    : `Joined ${formatDistanceToNow(parseISO(member.joinedAt), { addSuffix: true })}`}
                </p>
              </div>
              {member.online && (
                <span className="text-[10px] text-emerald-600 font-medium px-1.5 py-0.5 rounded" style={{ background: 'rgba(209,250,229,0.6)' }}>
                  online
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-rose-200/60 text-rose-600 font-medium text-sm transition-all hover:scale-[1.02] hover:shadow-neon-pink opacity-0 animate-fade-up delay-600"
        style={{ background: 'rgba(255,241,242,0.5)', backdropFilter: 'blur(12px)' }}
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );
}
