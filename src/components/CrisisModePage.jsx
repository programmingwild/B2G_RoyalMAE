import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Siren, Radio, Shield, Phone, MapPin, Clock, CheckCircle2, AlertTriangle, Users, Heart, Zap } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

const CRISIS_CATEGORIES = [
  { id: 'medical', label: 'Medical', emoji: '🏥', color: 'bg-rose-100 text-rose-700' },
  { id: 'fire', label: 'Fire', emoji: '🔥', color: 'bg-orange-100 text-orange-700' },
  { id: 'weather', label: 'Weather', emoji: '🌪️', color: 'bg-blue-100 text-blue-700' },
  { id: 'power', label: 'Power Out', emoji: '⚡', color: 'bg-amber-100 text-amber-700' },
  { id: 'water', label: 'Water', emoji: '💧', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'safety', label: 'Safety', emoji: '🛡️', color: 'bg-violet-100 text-violet-700' },
];

const HELP_SKILLS = [
  { id: 'firstaid', label: 'First Aid', emoji: '🩹' },
  { id: 'transport', label: 'Transport', emoji: '🚗' },
  { id: 'shelter', label: 'Shelter', emoji: '🏠' },
  { id: 'food', label: 'Food/Water', emoji: '🍲' },
  { id: 'tools', label: 'Tools', emoji: '🔧' },
  { id: 'childcare', label: 'Childcare', emoji: '👶' },
  { id: 'petcare', label: 'Pet Care', emoji: '🐾' },
  { id: 'comms', label: 'Communications', emoji: '📡' },
];

const STORAGE_KEY = 'nrn_crisis';

function _get() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function _set(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

export default function CrisisModePage() {
  const navigate = useNavigate();
  const { neighborhood, emergencyMode, toggleEmergencyMode, emergencyPosts, addEmergencyPost } = useData();
  const [tab, setTab] = useState('status');

  // Crisis helpers state
  const stored = _get();
  const [availableToHelp, setAvailableToHelp] = useState(stored[neighborhood]?.available || false);
  const [mySkills, setMySkills] = useState(stored[neighborhood]?.skills || []);
  const [needForm, setNeedForm] = useState({ category: '', description: '', urgency: 'moderate' });

  const toggleAvailable = useCallback(() => {
    const next = !availableToHelp;
    setAvailableToHelp(next);
    const data = _get();
    data[neighborhood] = { ...(data[neighborhood] || {}), available: next, skills: mySkills, lastToggle: new Date().toISOString() };
    _set(data);
  }, [availableToHelp, neighborhood, mySkills]);

  const toggleSkill = useCallback((skillId) => {
    setMySkills((prev) => {
      const next = prev.includes(skillId) ? prev.filter((s) => s !== skillId) : [...prev, skillId];
      const data = _get();
      data[neighborhood] = { ...(data[neighborhood] || {}), skills: next };
      _set(data);
      return next;
    });
  }, [neighborhood]);

  const submitNeed = useCallback(() => {
    if (!needForm.category || !needForm.description) return;
    addEmergencyPost({ type: 'need', category: needForm.category, text: needForm.description, urgency: needForm.urgency });
    setNeedForm({ category: '', description: '', urgency: 'moderate' });
  }, [needForm, addEmergencyPost]);

  // Simulated demand heat (based on number of needs in emergency posts)
  const crisisNeeds = emergencyPosts.filter((p) => p.type === 'need');
  const crisisOffers = emergencyPosts.filter((p) => p.type === 'offer');
  const heatLevel = crisisNeeds.length > 5 ? 'high' : crisisNeeds.length > 2 ? 'moderate' : 'low';

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/insights')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Insights Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Siren size={20} className="text-rose-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Crisis Activation</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Rapid-response mutual aid when it matters most.</p>

      {/* Emergency Toggle */}
      <div className="card mb-5 opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px)', background: emergencyMode.active ? 'rgba(255,228,230,0.5)' : 'rgba(255,255,255,0.65)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-stone-700">Emergency Mode</p>
            <p className="text-xs text-stone-400">{emergencyMode.active ? 'Active — community alerted' : 'Inactive'}</p>
          </div>
          <button
            onClick={toggleEmergencyMode}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] ${
              emergencyMode.active ? 'bg-rose-500 text-white animate-pulse' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
          >
            {emergencyMode.active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      {/* Available to Help Toggle */}
      <div className="card mb-5 opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px)', background: availableToHelp ? 'rgba(209,250,229,0.5)' : 'rgba(255,255,255,0.65)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart size={16} className={availableToHelp ? 'text-emerald-500' : 'text-stone-300'} />
            <div>
              <p className="text-sm font-semibold text-stone-700">Available to Help</p>
              <p className="text-[10px] text-stone-400">Let neighbors know you can assist</p>
            </div>
          </div>
          <button
            onClick={toggleAvailable}
            className={`w-12 h-6 rounded-full transition-all relative ${availableToHelp ? 'bg-emerald-500' : 'bg-stone-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${availableToHelp ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
        {availableToHelp && (
          <div>
            <p className="text-xs text-stone-500 mb-2">I can help with:</p>
            <div className="flex flex-wrap gap-2">
              {HELP_SKILLS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleSkill(s.id)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg transition-all ${
                    mySkills.includes(s.id) ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Demand Heat */}
      <div className="card mb-5" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <h3 className="text-sm font-semibold text-stone-700 mb-3">Demand Heat</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2.5 bg-stone-50 rounded-xl">
            <p className="text-lg font-bold text-rose-500">{crisisNeeds.length}</p>
            <p className="text-[10px] text-stone-400">Active Needs</p>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl">
            <p className="text-lg font-bold text-emerald-500">{crisisOffers.length}</p>
            <p className="text-[10px] text-stone-400">Offers</p>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-xl">
            <p className={`text-xs font-semibold px-2 py-1 rounded-full ${
              heatLevel === 'high' ? 'bg-rose-100 text-rose-700' :
              heatLevel === 'moderate' ? 'bg-amber-100 text-amber-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              {heatLevel === 'high' ? '🔴 High' : heatLevel === 'moderate' ? '🟡 Moderate' : '🟢 Low'}
            </p>
            <p className="text-[10px] text-stone-400 mt-1">Heat Level</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {['status', 'report', 'feed'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === t ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-500'}`}>
            {t === 'status' ? 'Report Need' : t === 'report' ? 'Emergency Info' : 'Live Feed'}
          </button>
        ))}
      </div>

      {tab === 'status' && (
        <div className="card" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Report a Need</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-stone-500 mb-1.5 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {CRISIS_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setNeedForm((f) => ({ ...f, category: c.id }))}
                    className={`text-xs px-2.5 py-1.5 rounded-lg transition-all ${
                      needForm.category === c.id ? c.color + ' ring-1' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-stone-500 mb-1.5 block">Description</label>
              <textarea
                value={needForm.description}
                onChange={(e) => setNeedForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What do you need help with?"
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 mb-1.5 block">Urgency</label>
              <div className="flex gap-2">
                {['low', 'moderate', 'critical'].map((u) => (
                  <button
                    key={u}
                    onClick={() => setNeedForm((f) => ({ ...f, urgency: u }))}
                    className={`flex-1 text-xs py-2 rounded-lg capitalize ${
                      needForm.urgency === u
                        ? u === 'critical' ? 'bg-rose-100 text-rose-700' : u === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={submitNeed}
              disabled={!needForm.category || !needForm.description}
              className="w-full py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold disabled:opacity-40 hover:bg-rose-600 active:scale-[0.98] transition-all hover:scale-[1.02]"
            >
              Submit Need
            </button>
          </div>
        </div>
      )}

      {tab === 'report' && (
        <div className="space-y-3">
          <div className="card" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,228,230,0.5)' }}>
            <h3 className="text-sm font-semibold text-rose-700 mb-2">🚨 Emergency Numbers</h3>
            <div className="space-y-2">
              {[
                { label: 'Emergency Services', number: '911' },
                { label: 'Poison Control', number: '1-800-222-1222' },
                { label: 'Crisis Hotline', number: '988' },
              ].map((n) => (
                <div key={n.number} className="flex items-center justify-between p-2 bg-white rounded-lg hover:shadow-glass-lg hover:scale-[1.01] transition-all">
                  <span className="text-xs text-stone-600">{n.label}</span>
                  <span className="text-xs font-mono font-bold text-rose-600">{n.number}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
            <h3 className="text-sm font-semibold text-stone-700 mb-2">📋 Crisis Checklist</h3>
            <div className="space-y-1.5 text-xs text-stone-600">
              {['Check on elderly and vulnerable neighbors', 'Share water and food supplies', 'Keep phones charged', 'Stay near shelter if advised', 'Document damage for insurance'].map((item, i) => (
                <div key={i} className="flex gap-2 items-center p-2 bg-stone-50 rounded-lg hover:shadow-glass-lg hover:scale-[1.01] transition-all">
                  <CheckCircle2 size={14} className="text-stone-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'feed' && (
        <div className="space-y-2">
          {emergencyPosts.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <Radio size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No emergency posts yet.</p>
            </div>
          ) : (
            [...emergencyPosts].reverse().map((post) => (
              <div key={post.id} className={`card !p-3 hover:shadow-glass-lg hover:scale-[1.01] transition-all ${post.type === 'need' ? '!border-l-2 !border-l-rose-300' : '!border-l-2 !border-l-emerald-300'}`} style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${post.type === 'need' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {post.type === 'need' ? '🆘 Need' : '🤝 Offer'}
                  </span>
                  <span className="text-[10px] text-stone-400">{formatDistanceToNow(parseISO(post.timestamp), { addSuffix: true })}</span>
                </div>
                <p className="text-xs text-stone-600">{post.text}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
