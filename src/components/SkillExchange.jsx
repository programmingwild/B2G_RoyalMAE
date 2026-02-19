import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { SKILL_CATEGORIES } from '../data/features';
import { ArrowLeft, Plus, Send, Repeat, X, Search } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function SkillExchange() {
  const navigate = useNavigate();
  const { skills, addSkill, removeSkill, neighborhood } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('offer');
  const [formSkill, setFormSkill] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [filter, setFilter] = useState('all'); // all | offer | request
  const [search, setSearch] = useState('');

  const hoodSkills = skills
    .filter((s) => s.neighborhood === neighborhood && s.status === 'active')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const filtered = hoodSkills
    .filter((s) => filter === 'all' || s.type === filter)
    .filter((s) => !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = () => {
    if (!formSkill || !formTitle.trim()) return;
    addSkill({ type: formType, skill: formSkill, title: formTitle.trim(), description: formDesc.trim() });
    setShowForm(false);
    setFormSkill('');
    setFormTitle('');
    setFormDesc('');
  };

  // Find potential matches (offers matching requests and vice versa)
  const matches = [];
  const offers = hoodSkills.filter((s) => s.type === 'offer');
  const requests = hoodSkills.filter((s) => s.type === 'request');
  requests.forEach((req) => {
    const match = offers.find((o) => o.skill === req.skill);
    if (match) matches.push({ request: req, offer: match });
  });

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/community')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Community Hub
      </button>

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Repeat size={20} className="text-violet-500 drop-shadow-sm" />
          <h1 className="text-xl font-bold text-gradient">Skill Exchange</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-violet-600 hover:bg-violet-700 text-white p-2 rounded-xl transition-all active:scale-95 hover:scale-110 hover:shadow-lg">
          <Plus size={18} />
        </button>
      </div>
      <p className="text-sm text-stone-400 mb-5">Teach what you know. Learn what you need.</p>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills..."
          className="input-field pl-9 text-sm"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[['all', 'All'], ['offer', '🎓 Offering'], ['request', '🙋 Seeking']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`chip text-xs ${filter === key ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-300' : 'chip-inactive'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Matches banner */}
      {matches.length > 0 && (
        <div className="card mb-4" style={{ background: 'rgba(237,233,254,0.7)', backdropFilter: 'blur(12px)' }}>
          <p className="text-sm font-semibold text-violet-700 mb-1">✨ {matches.length} Potential Match{matches.length !== 1 ? 'es' : ''}</p>
          <p className="text-xs text-violet-500">Some skill offers align with requests in your neighborhood!</p>
          <div className="mt-2 space-y-1.5">
            {matches.slice(0, 3).map((m, i) => (
              <div key={i} className="text-xs text-stone-600 flex items-center gap-2">
                <span className="bg-violet-200 text-violet-700 px-2 py-0.5 rounded-full">{SKILL_CATEGORIES.find((c) => c.id === m.request.skill)?.emoji}</span>
                <span>"{m.request.title}" ↔ "{m.offer.title}"</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card mb-4 border border-white/40 shadow-glass animate-scale-in" style={{ backdropFilter: 'blur(16px) saturate(180%)', background: 'rgba(255,255,255,0.75)' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-stone-700">New Listing</h3>
            <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600"><X size={18} /></button>
          </div>

          <div className="flex gap-2 mb-4">
            {[['offer', '🎓 I Can Teach'], ['request', '🙋 I Want to Learn']].map(([t, l]) => (
              <button
                key={t}
                onClick={() => setFormType(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${formType === t ? 'text-white' : 'bg-stone-100 text-stone-600'}`}
                style={formType === t ? { background: 'rgba(124,58,237,0.9)', backdropFilter: 'blur(8px)' } : undefined}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFormSkill(cat.id)}
                className={`chip text-xs ${formSkill === cat.id ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-300' : 'chip-inactive'}`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="What can you teach/learn? (e.g., 'Sourdough baking')"
            className="input-field text-sm mb-3"
            maxLength={80}
          />
          <textarea
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            placeholder="A bit more detail (optional)..."
            className="input-field h-16 resize-none text-sm mb-3"
            maxLength={200}
          />
          <button
            onClick={handleSubmit}
            disabled={!formSkill || !formTitle.trim()}
            className={`w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm ${(!formSkill || !formTitle.trim()) ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <Send size={16} /> Post Listing
          </button>
        </div>
      )}

      {/* Listings */}
      {filtered.length === 0 ? (
        <div className="card text-center py-8" style={{ backdropFilter: 'blur(14px)', background: 'rgba(255,255,255,0.6)' }}>
          <p className="text-3xl mb-2">🎓</p>
          <p className="text-sm text-stone-400">No skill listings yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s, index) => {
            const cat = SKILL_CATEGORIES.find((c) => c.id === s.skill);
            const isOffer = s.type === 'offer';
            const delayClass = index < 8 ? `opacity-0 animate-fade-up delay-${index + 1}00` : '';
            return (
              <div key={s.id} className={`card !p-4 !border-l-4 ${isOffer ? '!border-l-violet-400' : '!border-l-amber-400'} hover:shadow-glass-lg hover:scale-[1.01] transition-all ${delayClass}`} style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold uppercase tracking-wide ${isOffer ? 'text-violet-600' : 'text-amber-600'}`}>
                        {isOffer ? 'OFFERING' : 'SEEKING'}
                      </span>
                      <span className="text-xs text-stone-300">•</span>
                      <span className="text-xs text-stone-400">{cat?.emoji} {cat?.label}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-stone-700">{s.title}</h4>
                    {s.description && <p className="text-xs text-stone-500 mt-1">{s.description}</p>}
                    <p className="text-xs text-stone-300 mt-1.5">{formatDistanceToNow(parseISO(s.timestamp), { addSuffix: true })}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-center text-stone-400 mt-6 pb-4">All listings are anonymous. Connect through the skill, not the person.</p>
    </div>
  );
}
