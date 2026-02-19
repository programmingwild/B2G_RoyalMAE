import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Heart, Send, MessageSquare } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function GratitudeWall() {
  const navigate = useNavigate();
  const { gratitude, addGratitudePost, toggleHeart, neighborhood } = useData();
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const posts = gratitude
    .filter((g) => g.neighborhood === neighborhood)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const totalHearts = posts.reduce((s, p) => s + (p.hearts || 0), 0);

  const quickPrompts = [
    'Thank you for helping with...',
    'I\'m grateful for the neighbor who...',
    'A small act that made my day:',
    'This neighborhood is special because...',
  ];

  const handleSubmit = () => {
    if (!message.trim()) return;
    addGratitudePost({ message: message.trim() });
    setMessage('');
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/community')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Community Hub
      </button>

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-pink-500 drop-shadow-sm" />
          <h1 className="text-xl font-bold text-gradient">Gratitude Wall</h1>
        </div>
      </div>
      <p className="text-sm text-stone-400 mb-5">Anonymous thank-yous that ripple through the neighborhood</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="card !p-3 text-center opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ background: 'rgba(252,231,243,0.7)', backdropFilter: 'blur(12px)' }}>
          <p className="text-xl font-bold text-pink-700">{posts.length}</p>
          <p className="text-xs text-pink-500 font-medium">Notes Shared</p>
        </div>
        <div className="card !p-3 text-center opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ background: 'rgba(254,226,226,0.7)', backdropFilter: 'blur(12px)' }}>
          <p className="text-xl font-bold text-red-600">{totalHearts}</p>
          <p className="text-xs text-red-500 font-medium">Hearts Given</p>
        </div>
      </div>

      {/* Add post */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm mb-5 hover:scale-[1.02] hover:shadow-lg"
        >
          <Heart size={16} /> Share Gratitude
        </button>
      ) : (
        <div className="card mb-5 border border-white/40 shadow-glass animate-scale-in" style={{ backdropFilter: 'blur(16px) saturate(180%)', background: 'rgba(255,255,255,0.75)' }}>
          <h3 className="text-sm font-semibold text-stone-700 mb-3">💛 Write a Thank You</h3>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setMessage(prompt + ' ')}
                className="chip chip-inactive text-xs"
              >
                {prompt.slice(0, 30)}...
              </button>
            ))}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What are you grateful for today?"
            className="input-field h-20 resize-none text-sm mb-3"
            maxLength={280}
          />
          <p className="text-xs text-stone-300 text-right mb-3">{message.length}/280</p>

          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 btn-secondary text-sm !py-2.5">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={!message.trim()}
              className={`flex-1 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm ${!message.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Send size={14} /> Post
            </button>
          </div>
        </div>
      )}

      {/* Wall */}
      {posts.length === 0 ? (
        <div className="card text-center py-8" style={{ backdropFilter: 'blur(14px)', background: 'rgba(255,255,255,0.6)' }}>
          <p className="text-3xl mb-2">💛</p>
          <p className="text-sm text-stone-400">The wall is empty. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="card !p-4 hover:shadow-glass-lg hover:scale-[1.01] transition-all" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
              {/* User info */}
              {post.userName && (
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: post.userAvatar?.color ? post.userAvatar.color + '20' : '#f5f5f4' }}
                  >
                    {post.userAvatar?.emoji || '👤'}
                  </div>
                  <span className="text-xs font-semibold text-stone-600">{post.userName}</span>
                </div>
              )}
              <p className="text-sm text-stone-700 leading-relaxed mb-3">"{post.message}"</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  {formatDistanceToNow(parseISO(post.timestamp), { addSuffix: true })}
                </span>
                <button
                  onClick={() => toggleHeart(post.id)}
                  className="flex items-center gap-1 text-pink-400 hover:text-pink-600 transition-colors active:scale-110 hover:scale-125"
                >
                  <Heart size={14} fill={post.hearts > 0 ? 'currentColor' : 'none'} />
                  <span className="text-xs font-medium">{post.hearts || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-center text-stone-400 mt-6 pb-4">All posts are anonymous. Kindness needs no signature.</p>
    </div>
  );
}
