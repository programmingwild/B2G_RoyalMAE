import { useState } from 'react';
import { MICRO_NEIGHBORHOODS } from '../data/categories';
import { registerUser, loginUser, AVATAR_COLORS, AVATAR_EMOJIS } from '../utils/auth';
import { Users, LogIn, UserPlus, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('welcome'); // welcome | login | register
  const [name, setName] = useState('');
  const [selectedHood, setSelectedHood] = useState(null);
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [avatarEmoji, setAvatarEmoji] = useState(AVATAR_EMOJIS[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!name.trim()) return setError('Please enter your name');
    setLoading(true);
    const result = loginUser(name);
    setLoading(false);
    if (result.success) {
      onLogin(result.user);
    } else {
      setError(result.error);
    }
  };

  const handleRegister = () => {
    if (!name.trim()) return setError('Please enter your name');
    if (!selectedHood) return setError('Please select your neighborhood');
    setLoading(true);
    const result = registerUser({ name, neighborhood: selectedHood, avatarColor, avatarEmoji });
    setLoading(false);
    if (result.success) {
      onLogin(result.user);
    } else {
      setError(result.error);
    }
  };

  // ─── Welcome Screen ─────────────────────────────────────
  if (mode === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #fdf8f0 25%, #f0fdfa 50%, #ede9fe 75%, #f0fdfa 100%)', backgroundSize: '400% 400%', animation: 'gradient 15s ease infinite' }}>
        {/* Decorative blobs */}
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-30 animate-float" style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
        <div className="absolute bottom-32 -right-20 w-72 h-72 rounded-full blur-3xl opacity-20 animate-float-slow" style={{ background: 'radial-gradient(circle, #e28320, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

        <div className="flex flex-col items-center text-center max-w-sm relative z-10">
          {/* Logo */}
          <div className="relative mb-8 animate-bounce-in">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-neon-teal" style={{ background: 'rgba(204, 251, 241, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
              <Users size={48} className="text-primary-600 drop-shadow-sm" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-warm-400 rounded-xl flex items-center justify-center text-lg shadow-lg animate-float">
              🤝
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gradient mb-2 opacity-0 animate-fade-up delay-100">Neighborhood</h1>
          <h2 className="text-xl font-semibold text-primary-600 mb-4 opacity-0 animate-fade-up delay-200">Reciprocity Network</h2>
          <p className="text-stone-500 leading-relaxed mb-10 opacity-0 animate-fade-up delay-300">
            Join your neighbors in building a stronger, more connected community through everyday acts of kindness.
          </p>

          {/* Online members indicator */}
          <div className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full opacity-0 animate-fade-up delay-400" style={{ background: 'rgba(209, 250, 229, 0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-700 font-medium">12+ neighbors active now</span>
          </div>

          <div className="w-full space-y-3 opacity-0 animate-fade-up delay-500">
            <button
              onClick={() => setMode('login')}
              className="w-full btn-primary flex items-center justify-center gap-2 text-base py-3.5"
            >
              <LogIn size={20} />
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className="w-full btn-secondary flex items-center justify-center gap-2 text-base py-3.5"
            >
              <UserPlus size={20} />
              Create Account
            </button>
          </div>

          <p className="text-xs text-stone-400/70 mt-6 opacity-0 animate-fade-in delay-700">No email required • Privacy-first • 100% local</p>
        </div>
      </div>
    );
  }

  // ─── Login Screen ────────────────────────────────────────
  if (mode === 'login') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #fdf8f0 50%, #f0fdfa 100%)' }}>
        <div className="absolute top-32 -right-16 w-48 h-48 rounded-full blur-3xl opacity-25 animate-float" style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />
        <div className="absolute bottom-40 -left-16 w-56 h-56 rounded-full blur-3xl opacity-15 animate-float-slow" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

        <div className="flex flex-col items-center max-w-sm w-full relative z-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 animate-bounce-in" style={{ background: 'rgba(204, 251, 241, 0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
            <LogIn size={32} className="text-primary-600 drop-shadow-sm" />
          </div>
          <h1 className="text-2xl font-bold text-gradient mb-2 opacity-0 animate-fade-up delay-100">Welcome Back</h1>
          <p className="text-stone-500 mb-8 text-center opacity-0 animate-fade-up delay-200">Sign in with your community name</p>

          {error && (
            <div className="w-full text-rose-700 text-sm px-4 py-3 rounded-xl mb-4 animate-fade-down" style={{ background: 'rgba(255, 228, 230, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(225, 29, 72, 0.2)' }}>
              {error}
            </div>
          )}

          <div className="w-full card space-y-4 mb-6 opacity-0 animate-fade-up delay-300">
            <div>
              <label className="text-sm font-semibold text-stone-600 mb-1.5 block">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter your community name"
                className="input-field text-base"
                autoFocus
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !name.trim()}
            className={`w-full btn-primary text-base py-3.5 flex items-center justify-center gap-2 opacity-0 animate-fade-up delay-400 ${(!name.trim() || loading) ? '!opacity-40 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight size={18} />
          </button>

          <div className="flex items-center gap-2 mt-6 opacity-0 animate-fade-in delay-500">
            <span className="text-sm text-stone-400">New here?</span>
            <button onClick={() => { setMode('register'); setError(''); }} className="text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              Create Account
            </button>
          </div>

          <button onClick={() => { setMode('welcome'); setError(''); }} className="mt-4 text-xs text-stone-400 hover:text-stone-600 transition-colors">
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // ─── Register Screen ─────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 overflow-y-auto relative" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #fdf8f0 50%, #f0fdfa 100%)' }}>
      <div className="absolute top-16 -left-20 w-52 h-52 rounded-full blur-3xl opacity-20 animate-float" style={{ background: 'radial-gradient(circle, #e28320, transparent)' }} />
      <div className="absolute bottom-20 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 animate-float-slow" style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />

      <div className="flex flex-col items-center max-w-sm w-full relative z-10">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 animate-bounce-in" style={{ background: 'rgba(250, 236, 213, 0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(226, 131, 32, 0.3)' }}>
          <Sparkles size={32} className="text-warm-500 drop-shadow-sm" />
        </div>
        <h1 className="text-2xl font-bold text-gradient mb-2 opacity-0 animate-fade-up delay-100">Join the Community</h1>
        <p className="text-stone-500 mb-8 text-center opacity-0 animate-fade-up delay-200">Set up your profile and pick your neighborhood</p>

        {error && (
          <div className="w-full bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="w-full space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-stone-600 mb-1.5 block">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="How should neighbors know you?"
              className="input-field text-base"
              autoFocus
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="text-sm font-medium text-stone-600 mb-3 block">Choose Your Avatar</label>
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300"
                style={{ backgroundColor: avatarColor + '20', borderColor: avatarColor, borderWidth: 2, boxShadow: `0 4px 20px ${avatarColor}30` }}
              >
                {avatarEmoji}
              </div>
              <div>
                <p className="font-medium text-stone-700">{name || 'Your Name'}</p>
                <p className="text-xs text-stone-400">This is how you'll appear</p>
              </div>
            </div>

            {/* Emoji selection */}
            <p className="text-xs text-stone-500 mb-2">Pick an icon</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {AVATAR_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setAvatarEmoji(emoji)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all duration-200
                    ${avatarEmoji === emoji ? 'ring-2 ring-primary-400 scale-110' : 'hover:scale-105'}`}
                  style={{ background: avatarEmoji === emoji ? 'rgba(204, 251, 241, 0.6)' : 'rgba(245, 245, 244, 0.6)', backdropFilter: 'blur(4px)' }}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Color selection */}
            <p className="text-xs text-stone-500 mb-2">Pick a color</p>
            <div className="flex flex-wrap gap-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setAvatarColor(color)}
                  className={`w-8 h-8 rounded-full transition-all ${avatarColor === color ? 'ring-2 ring-offset-2 ring-primary-400 scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Neighborhood */}
          <div>
            <label className="text-sm font-medium text-stone-600 mb-3 block">Your Neighborhood</label>
            <div className="space-y-2">
              {MICRO_NEIGHBORHOODS.map((hood) => (
                <button
                  key={hood.id}
                  onClick={() => { setSelectedHood(hood.id); setError(''); }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-300 text-left
                    ${selectedHood === hood.id ? 'border-primary-500 scale-[1.01]' : 'border-white/50 hover:border-stone-200 hover:scale-[1.01]'}`}
                  style={{ background: selectedHood === hood.id ? 'rgba(204, 251, 241, 0.4)' : 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' }}
                >
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: hood.color }} />
                  <span className="font-medium text-stone-700 text-sm">{hood.name}</span>
                  {selectedHood === hood.id && (
                    <span className="ml-auto text-primary-600 text-xs font-medium">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading || !name.trim() || !selectedHood}
          className={`w-full btn-primary text-base py-3.5 flex items-center justify-center gap-2 mt-8 ${(!name.trim() || !selectedHood || loading) ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Creating...' : 'Join My Neighborhood'}
          <ArrowRight size={18} />
        </button>

        <div className="flex items-center gap-2 mt-6">
          <span className="text-sm text-stone-400">Already have an account?</span>
          <button onClick={() => { setMode('login'); setError(''); }} className="text-sm text-primary-600 font-medium hover:text-primary-700">
            Sign In
          </button>
        </div>

        <button onClick={() => { setMode('welcome'); setError(''); }} className="mt-3 text-xs text-stone-400 hover:text-stone-600">
          ← Back
        </button>
      </div>
    </div>
  );
}
