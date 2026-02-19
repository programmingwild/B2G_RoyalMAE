import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { EMERGENCY_CATEGORIES, MICRO_NEIGHBORHOODS } from '../data/categories';
import {
  AlertTriangle,
  ShieldCheck,
  Hand,
  Megaphone,
  Clock,
  Send,
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function EmergencyMode() {
  const {
    neighborhood,
    emergencyMode,
    toggleEmergencyMode,
    emergencyPosts,
    addEmergencyPost,
  } = useData();

  const [showForm, setShowForm] = useState(false);
  const [postType, setPostType] = useState('need'); // 'need' | 'offer'
  const [postCategory, setPostCategory] = useState(null);
  const [postNote, setPostNote] = useState('');

  const hood = MICRO_NEIGHBORHOODS.find((h) => h.id === neighborhood);
  const hoodPosts = emergencyPosts
    .filter((p) => p.neighborhood === neighborhood)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const needs = hoodPosts.filter((p) => p.type === 'need');
  const offers = hoodPosts.filter((p) => p.type === 'offer');

  const handleSubmitPost = () => {
    if (!postCategory) return;
    addEmergencyPost({
      type: postType,
      category: postCategory,
      note: postNote.trim(),
      neighborhood,
    });
    setPostCategory(null);
    setPostNote('');
    setShowForm(false);
  };

  // Inactive state
  if (!emergencyMode.active) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div>
          <h1 className="text-xl font-bold text-gradient mb-1">Emergency Mode</h1>
          <p className="text-sm text-stone-400">
            Rapid mutual support when your neighborhood needs it most
          </p>
        </div>

        <div className="card flex flex-col items-center py-8 text-center opacity-0 animate-fade-up" style={{ backdropFilter: 'blur(18px) saturate(180%)', background: 'rgba(255,255,255,0.7)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 glow-ring" style={{ background: 'rgba(241,245,249,0.6)' }}>
            <ShieldCheck size={32} className="text-stone-400" />
          </div>
          <h2 className="text-lg font-semibold text-gradient mb-2">All Clear</h2>
          <p className="text-sm text-stone-400 max-w-xs leading-relaxed mb-6">
            Emergency mode is currently off. When activated, residents can quickly post needs
            and offers to help neighbors during a crisis.
          </p>
          <button onClick={toggleEmergencyMode} className="btn-emergency flex items-center gap-2">
            <AlertTriangle size={18} /> Activate Emergency Mode
          </button>
        </div>

        <div className="card opacity-0 animate-fade-up delay-200" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <h3 className="text-sm font-semibold text-stone-600 mb-3">How It Works</h3>
          <ol className="space-y-3 text-sm text-stone-500">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(255,228,230,0.7)', color: '#e11d48' }}>1</span>
              Any resident can activate emergency mode for their micro-neighborhood.
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(255,228,230,0.7)', color: '#e11d48' }}>2</span>
              Post a <strong>need</strong> (e.g., "Need drinking water") or an <strong>offer</strong> (e.g., "Have extra blankets").
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(255,228,230,0.7)', color: '#e11d48' }}>3</span>
              Needs and offers are visible to your micro-neighborhood. No personal info is shared.
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(255,228,230,0.7)', color: '#e11d48' }}>4</span>
              When the crisis passes, deactivate to return to normal mode.
            </li>
          </ol>
        </div>
      </div>
    );
  }

  // Active state
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={18} className="text-rose-500 animate-pulse drop-shadow-sm" />
            <h1 className="text-xl font-bold text-gradient-warm">Emergency Mode</h1>
          </div>
          <p className="text-sm text-stone-400">{hood?.name} — active support network</p>
        </div>
        <button
          onClick={toggleEmergencyMode}
          className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:scale-105"
          style={{ background: 'rgba(241,245,249,0.7)', backdropFilter: 'blur(8px)', color: '#475569' }}
        >
          Deactivate
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ background: 'rgba(255,241,242,0.7)', backdropFilter: 'blur(12px)' }}>
          <Megaphone size={20} className="text-rose-500 mx-auto mb-1 drop-shadow-sm" />
          <p className="text-2xl font-bold text-rose-700">{needs.length}</p>
          <p className="text-xs text-rose-500 font-medium">Open Needs</p>
        </div>
        <div className="card text-center opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ background: 'rgba(209,250,229,0.7)', backdropFilter: 'blur(12px)' }}>
          <Hand size={20} className="text-emerald-500 mx-auto mb-1 drop-shadow-sm" />
          <p className="text-2xl font-bold text-emerald-700">{offers.length}</p>
          <p className="text-xs text-emerald-500 font-medium">Offers</p>
        </div>
      </div>

      {/* Post form toggle */}
      {!showForm ? (
        <div className="grid grid-cols-2 gap-3 opacity-0 animate-fade-up delay-300">
          <button
            onClick={() => { setPostType('need'); setShowForm(true); }}
            className="btn-emergency flex items-center justify-center gap-2 text-sm"
          >
            <Megaphone size={16} /> I Need Help
          </button>
          <button
            onClick={() => { setPostType('offer'); setShowForm(true); }}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm hover:shadow-lg"
          >
            <Hand size={16} /> I Can Help
          </button>
        </div>
      ) : (
        <div className="card animate-scale-in" style={{ backdropFilter: 'blur(16px) saturate(180%)', background: 'rgba(255,255,255,0.75)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-stone-700">
              {postType === 'need' ? '🆘 Post a Need' : '🤝 Post an Offer'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {EMERGENCY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setPostCategory(cat.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left text-sm transition-all hover:scale-[1.03]
                  ${postCategory === cat.id
                    ? postType === 'need'
                      ? 'border-rose-400 shadow-neon-pink'
                      : 'border-emerald-400 shadow-glass'
                    : 'border-white/40 hover:border-stone-200'
                  }
                `}
                style={{ backdropFilter: 'blur(8px)', background: postCategory === cat.id ? (postType === 'need' ? 'rgba(255,241,242,0.7)' : 'rgba(209,250,229,0.7)') : 'rgba(255,255,255,0.4)' }}
              >
                <span>{cat.emoji}</span>
                <span className="font-medium text-stone-700 text-xs">{cat.label}</span>
              </button>
            ))}
          </div>

          <textarea
            value={postNote}
            onChange={(e) => setPostNote(e.target.value)}
            placeholder={postType === 'need' ? 'Brief description of what you need...' : 'What can you offer?'}
            className="input-field h-16 resize-none text-sm mb-3"
            maxLength={200}
          />

          <button
            onClick={handleSubmitPost}
            disabled={!postCategory}
            className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all active:scale-95
              ${postType === 'need' ? 'btn-emergency' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}
              ${!postCategory ? 'opacity-40 cursor-not-allowed' : ''}
            `}
          >
            <Send size={16} /> Post {postType === 'need' ? 'Need' : 'Offer'}
          </button>
        </div>
      )}

      {/* Feed */}
      <div>
        <h3 className="text-sm font-semibold text-stone-600 mb-3">Recent Activity</h3>
        {hoodPosts.length === 0 ? (
          <div className="card text-center py-8" style={{ backdropFilter: 'blur(14px)', background: 'rgba(255,255,255,0.6)' }}>
            <p className="text-sm text-stone-400">No needs or offers posted yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {hoodPosts.map((post, idx) => {
              const cat = EMERGENCY_CATEGORIES.find((c) => c.id === post.category);
              const isNeed = post.type === 'need';
              const delayClass = idx < 8 ? `delay-${(idx + 1) * 100}` : '';
              return (
                <div
                  key={post.id}
                  className={`card !p-4 opacity-0 animate-fade-up ${delayClass} hover:shadow-glass-lg transition-all ${isNeed ? '!border-l-4 !border-l-rose-400' : '!border-l-4 !border-l-emerald-400'}`}
                  style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{cat?.emoji || '📋'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-semibold uppercase tracking-wide ${isNeed ? 'text-rose-500' : 'text-emerald-600'}`}>
                          {isNeed ? 'NEED' : 'OFFER'}
                        </span>
                        <span className="text-xs text-stone-400 font-medium">{cat?.label}</span>
                      </div>
                      {post.note && <p className="text-sm text-stone-600">{post.note}</p>}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {post.userName && (
                          <>
                            <span className="text-xs font-medium text-stone-500">{post.userName}</span>
                            <span className="text-stone-300">·</span>
                          </>
                        )}
                        <Clock size={12} className="text-stone-300" />
                        <span className="text-xs text-stone-400">
                          {formatDistanceToNow(parseISO(post.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-xs text-center text-stone-400 pb-4 leading-relaxed">
        All posts are anonymous. Only your micro-neighborhood can see them.
      </p>
    </div>
  );
}
