import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Shield, Plus, X, AlertTriangle, CheckCircle2, Heart, Phone, Eye } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

const SAFETY_TYPES = [
  { id: 'checkin', label: 'Check-in', emoji: '✅', desc: 'Let neighbors know you\'re OK' },
  { id: 'need-help', label: 'Need Help', emoji: '🆘', desc: 'Request assistance from neighbors' },
  { id: 'offering', label: 'Offering Help', emoji: '🤝', desc: 'Volunteer to help a neighbor' },
  { id: 'watch', label: 'Neighborhood Watch', emoji: '👁️', desc: 'Report something to be aware of' },
  { id: 'wellness', label: 'Wellness Check', emoji: '💝', desc: 'Request a check on a neighbor' },
];

export default function SafetyNet() {
  const navigate = useNavigate();
  const { safetyCheckins, addSafetyPost, resolveSafetyPost, neighborhood } = useData();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ type: 'checkin', message: '' });

  const hoodPosts = safetyCheckins
    .filter((p) => p.neighborhood === neighborhood)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const activeNeeds = hoodPosts.filter((p) => p.type === 'need-help' && !p.resolved);
  const checkins = hoodPosts.filter((p) => p.type === 'checkin');
  const displayed = filter === 'all' ? hoodPosts : hoodPosts.filter((p) => p.type === filter);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    addSafetyPost({ type: form.type, message: form.message.trim() });
    setForm({ type: 'checkin', message: '' });
    setShowForm(false);
  };

  const getTypeInfo = (typeId) => SAFETY_TYPES.find((t) => t.id === typeId) || SAFETY_TYPES[0];

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/community')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Community Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Shield size={20} className="text-red-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Safety Net</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Look out for each other — no one faces tough times alone.</p>

      {/* Quick check-in banner */}
      <div className="card mb-5 border border-white/40 shadow-glass" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Quick Check-in</p>
            <p className="text-xs text-emerald-500 mt-0.5">Let neighbors know you're safe</p>
          </div>
          <button onClick={() => { addSafetyPost({ type: 'checkin', message: 'All good here! 👋' }); }} className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-all active:scale-95 hover:scale-[1.02]">
            ✅ I'm OK
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-lg font-bold text-emerald-600">{checkins.length}</p>
          <p className="text-[10px] text-stone-400">Check-ins</p>
        </div>
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-lg font-bold text-red-500">{activeNeeds.length}</p>
          <p className="text-[10px] text-stone-400">Active Needs</p>
        </div>
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-300 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-lg font-bold text-blue-600">{hoodPosts.filter((p) => p.resolved).length}</p>
          <p className="text-[10px] text-stone-400">Resolved</p>
        </div>
      </div>

      {/* Filter + Add */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[{ id: 'all', label: 'All' }, ...SAFETY_TYPES.slice(0, 3)].map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filter === f.id ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)} className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${showForm ? 'bg-red-100 text-red-500' : 'bg-red-500 text-white'}`}>
          {showForm ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-5 border border-white/40 shadow-glass space-y-3 animate-scale-in" style={{ backdropFilter: 'blur(16px) saturate(180%)', background: 'rgba(255,255,255,0.75)' }}>
          <div className="grid grid-cols-2 gap-2">
            {SAFETY_TYPES.map((t) => (
              <button key={t.id} type="button" onClick={() => setForm({ ...form, type: t.id })} className={`text-left px-3 py-2 rounded-xl text-xs transition-all ${form.type === t.id ? 'bg-white ring-2 ring-red-300 shadow-sm' : 'bg-white/60 hover:bg-white'}`}>
                <span className="text-sm">{t.emoji}</span>
                <span className="ml-1.5 font-medium text-stone-700">{t.label}</span>
              </button>
            ))}
          </div>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={getTypeInfo(form.type).desc}
            rows={3}
            maxLength={300}
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
          />
          <button type="submit" disabled={!form.message.trim()} className="w-full py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold disabled:opacity-40 hover:bg-red-600 transition-all active:scale-[0.98] hover:scale-[1.02]">
            Post to Safety Net
          </button>
        </form>
      )}

      {/* Posts feed */}
      {displayed.length === 0 ? (
        <div className="text-center py-12 text-stone-400 rounded-2xl" style={{ backdropFilter: 'blur(14px)', background: 'rgba(255,255,255,0.6)' }}>
          <Shield size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No safety posts yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((post) => {
            const typeInfo = getTypeInfo(post.type);
            const isNeed = post.type === 'need-help' && !post.resolved;
            return (
              <div key={post.id} className={`card hover:shadow-glass-lg hover:scale-[1.01] transition-all ${isNeed ? '!border-red-200 !bg-red-50/50' : ''} ${post.resolved ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{typeInfo.emoji}</span>
                    <div>
                      <span className="text-xs font-semibold text-stone-700">{typeInfo.label}</span>
                      <p className="text-[10px] text-stone-400">{formatDistanceToNow(parseISO(post.timestamp), { addSuffix: true })}</p>
                    </div>
                  </div>
                  {post.resolved && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 size={12} /> Resolved</span>
                  )}
                </div>
                <p className="text-sm text-stone-700">{post.message}</p>
                {isNeed && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => resolveSafetyPost(post.id)} className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors hover:scale-110">
                      <CheckCircle2 size={12} /> Mark Resolved
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-[10px] text-stone-300 mt-6">For real emergencies, always call local emergency services first.</p>
    </div>
  );
}
