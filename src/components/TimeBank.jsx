import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { SKILL_CATEGORIES } from '../data/features';
import { ArrowLeft, Clock, Plus, Send, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function TimeBank() {
  const navigate = useNavigate();
  const { timeBankEntries, addTimeBankLog, timeBankBalance, neighborhood } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('given');
  const [formHours, setFormHours] = useState('1');
  const [formCat, setFormCat] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const entries = timeBankEntries
    .filter((e) => e.neighborhood === neighborhood)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const handleSubmit = () => {
    const hours = parseFloat(formHours);
    if (!hours || hours <= 0 || !formCat) return;
    addTimeBankLog({ type: formType, hours, category: formCat, description: formDesc.trim() });
    setShowForm(false);
    setFormHours('1');
    setFormCat('');
    setFormDesc('');
  };

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/community')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Community Hub
      </button>

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-amber-500 drop-shadow-sm" />
          <h1 className="text-xl font-bold text-gradient">Time Bank</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-xl transition-all active:scale-95 hover:scale-110 hover:shadow-lg">
          <Plus size={18} />
        </button>
      </div>
      <p className="text-sm text-stone-400 mb-5">1 hour given = 1 hour earned. Everyone's time has equal value.</p>

      {/* Balance */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card !p-3 text-center opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ background: 'rgba(209,250,229,0.7)', backdropFilter: 'blur(12px)' }}>
          <ArrowUpRight size={16} className="text-emerald-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-emerald-700">{timeBankBalance.given}h</p>
          <p className="text-[10px] text-emerald-500 font-medium">Given</p>
        </div>
        <div className="card !p-3 text-center opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ background: 'rgba(219,234,254,0.7)', backdropFilter: 'blur(12px)' }}>
          <ArrowDownLeft size={16} className="text-blue-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-blue-700">{timeBankBalance.received}h</p>
          <p className="text-[10px] text-blue-500 font-medium">Received</p>
        </div>
        <div className="card !p-3 text-center opacity-0 animate-fade-up delay-300 hover:scale-105 transition-transform" style={{ background: 'rgba(254,243,199,0.7)', backdropFilter: 'blur(12px)' }}>
          <Clock size={16} className="text-amber-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-amber-700">{timeBankBalance.net > 0 ? '+' : ''}{timeBankBalance.net}h</p>
          <p className="text-[10px] text-amber-500 font-medium">Balance</p>
        </div>
      </div>

      {/* How it works */}
      <div className="card mb-5 opacity-0 animate-fade-up delay-400" style={{ background: 'rgba(254,243,199,0.6)', backdropFilter: 'blur(12px)' }}>
        <h3 className="text-sm font-semibold text-amber-700 mb-2">⏳ How it works</h3>
        <p className="text-xs text-amber-600 leading-relaxed">
          Every hour you give to a neighbor earns you an hour. Need help later? Use your banked time.
          A handyperson's hour equals a tutor's hour — all skills are equally valued.
        </p>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-4 border border-white/40 shadow-glass animate-scale-in" style={{ backdropFilter: 'blur(16px) saturate(180%)', background: 'rgba(255,255,255,0.75)' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-stone-700">Log Time</h3>
            <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600"><X size={18} /></button>
          </div>

          <div className="flex gap-2 mb-4">
            {[['given', '⬆ Time Given'], ['received', '⬇ Time Received']].map(([t, l]) => (
              <button key={t} onClick={() => setFormType(t)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${formType === t ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600'}`}>
                {l}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="text-xs text-stone-500 mb-1 block">Hours</label>
            <div className="flex gap-2">
              {['0.5', '1', '1.5', '2', '3', '4'].map((h) => (
                <button key={h} onClick={() => setFormHours(h)} className={`chip text-xs ${formHours === h ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300' : 'chip-inactive'}`}>
                  {h}h
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {SKILL_CATEGORIES.slice(0, 8).map((cat) => (
              <button key={cat.id} onClick={() => setFormCat(cat.id)} className={`chip text-xs ${formCat === cat.id ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300' : 'chip-inactive'}`}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          <input value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="What did you do?" className="input-field text-sm mb-3" maxLength={100} />

          <button onClick={handleSubmit} disabled={!formCat} className={`w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm ${!formCat ? 'opacity-40 cursor-not-allowed' : ''}`}>
            <Send size={16} /> Log Time
          </button>
        </div>
      )}

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="card text-center py-8" style={{ backdropFilter: 'blur(14px)', background: 'rgba(255,255,255,0.6)' }}>
          <p className="text-3xl mb-2">⏳</p>
          <p className="text-sm text-stone-400">No time logged yet. Start banking!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {entries.map((entry) => {
            const cat = SKILL_CATEGORIES.find((c) => c.id === entry.category);
            const isGiven = entry.type === 'given';
            return (
              <div key={entry.id} className={`card !p-3 !border-l-4 hover:shadow-glass-lg hover:scale-[1.01] transition-all ${isGiven ? '!border-l-emerald-400' : '!border-l-blue-400'}`} style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{cat?.emoji || '⏳'}</span>
                    <div>
                      <p className="text-sm font-medium text-stone-700">{entry.description || cat?.label}</p>
                      <p className="text-xs text-stone-400">{formatDistanceToNow(parseISO(entry.timestamp), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${isGiven ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {isGiven ? '+' : '-'}{entry.hours}h
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
