import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { EVENT_CATEGORIES } from '../data/categories';
import { Send, ArrowLeft } from 'lucide-react';

export default function LogEvent() {
  const { logEvent } = useData();
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1); // 1: pick category, 2: optional note

  const handleSubmit = () => {
    if (!selectedCat) return;
    logEvent({ category: selectedCat, note: note.trim() || '' });
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-scale-in">
        <div className="text-5xl mb-4 animate-bounce drop-shadow-lg">🌿</div>
        <h2 className="text-xl font-bold text-gradient mb-2">Thank You!</h2>
        <p className="text-stone-500">Your act of reciprocity has been logged anonymously.</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-xl font-bold text-gradient mb-1">Log an Act of Reciprocity</h1>
        <p className="text-sm text-stone-400 mb-6">What kind of mutual support happened?</p>

        <div className="grid grid-cols-2 gap-3">
          {EVENT_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const active = selectedCat === cat.id;
            const delayClass = idx < 8 ? `delay-${(idx + 1) * 100}` : '';
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`card flex flex-col items-start gap-2 text-left transition-all duration-300 !p-4 opacity-0 animate-fade-up ${delayClass} hover:scale-[1.03]
                  ${active ? 'ring-2 ring-primary-400 shadow-neon-teal' : 'hover:shadow-glass-lg'}
                `}
                style={{ backdropFilter: 'blur(14px) saturate(180%)', background: active ? 'rgba(240,253,250,0.85)' : 'rgba(255,255,255,0.65)' }}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-primary-200/80 shadow-sm' : 'bg-white/50'}`}>
                  <Icon size={18} className={active ? 'text-primary-700' : 'text-stone-500'} />
                </div>
                <span className={`text-sm font-medium ${active ? 'text-gradient' : 'text-stone-600'}`}>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <button
            onClick={() => selectedCat && setStep(2)}
            disabled={!selectedCat}
            className={`btn-primary w-full text-base ${!selectedCat ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Step 2: optional note + confirm
  const cat = EVENT_CATEGORIES.find((c) => c.id === selectedCat);

  return (
    <div className="animate-fade-in">
      <button onClick={() => setStep(1)} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card mb-6 opacity-0 animate-fade-up" style={{ backdropFilter: 'blur(16px) saturate(180%)', background: 'rgba(255,255,255,0.7)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-ring" style={{ background: 'rgba(204,251,241,0.6)' }}>
            <cat.icon size={20} className="text-primary-600 drop-shadow-sm" />
          </div>
          <div>
            <h2 className="font-semibold text-gradient">{cat.label}</h2>
            <p className="text-xs text-stone-400">Anonymous reciprocity event</p>
          </div>
        </div>

        {/* Quick examples */}
        <p className="text-xs text-stone-400 mb-2">Examples:</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {cat.examples.map((ex) => (
            <button
              key={ex}
              onClick={() => setNote(ex)}
              className={`chip ${note === ex ? 'chip-active' : 'chip-inactive'} text-xs transition-all hover:scale-105`}
            >
              {ex}
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add an optional note (stays anonymous)..."
          className="input-field h-20 resize-none text-sm"
          maxLength={140}
        />
        <p className="text-xs text-stone-300 mt-1 text-right">{note.length}/140</p>
      </div>

      <div className="space-y-3 opacity-0 animate-fade-up delay-200">
        <button onClick={handleSubmit} className="btn-primary w-full flex items-center justify-center gap-2 text-base">
          <Send size={18} /> Log This Act
        </button>
        <p className="text-xs text-center text-stone-400 leading-relaxed">
          Only the category, micro-neighborhood, and date are recorded. No personal information is stored.
        </p>
      </div>
    </div>
  );
}
