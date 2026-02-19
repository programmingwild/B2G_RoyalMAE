import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { PULSE_QUESTIONS, PULSE_LABELS } from '../data/features';
import { ArrowLeft, BarChart3, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { differenceInDays, parseISO, startOfDay, subDays } from 'date-fns';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#059669'];

export default function CommunityPulse() {
  const navigate = useNavigate();
  const { pulseEntries, addPulseResponse, pulseAvg, neighborhood } = useData();
  const [currentQ, setCurrentQ] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const hoodPulse = pulseEntries.filter((e) => e.neighborhood === neighborhood);

  // Weekly averages for chart
  const now = new Date();
  const weeklyData = [];
  for (let w = 3; w >= 0; w--) {
    const weekStart = subDays(now, (w + 1) * 7);
    const weekEnd = subDays(now, w * 7);
    const weekEntries = hoodPulse.filter((e) => {
      const d = parseISO(e.timestamp);
      return d >= weekStart && d < weekEnd;
    });
    const avg = weekEntries.length > 0 ? +(weekEntries.reduce((s, e) => s + e.rating, 0) / weekEntries.length).toFixed(1) : 0;
    weeklyData.push({ week: `W-${w}`, avg, label: w === 0 ? 'This Week' : `${w}w ago` });
  }

  // Per-question averages
  const questionAvgs = PULSE_QUESTIONS.map((q) => {
    const entries = hoodPulse.filter((e) => e.questionId === q.id);
    return {
      ...q,
      avg: entries.length > 0 ? +(entries.reduce((s, e) => s + e.rating, 0) / entries.length).toFixed(1) : 0,
      count: entries.length,
    };
  });

  const handleRate = (rating) => {
    addPulseResponse({ questionId: PULSE_QUESTIONS[currentQ].id, rating });
    if (currentQ < PULSE_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/community')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Community Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <BarChart3 size={20} className="text-emerald-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Community Pulse</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">How connected does your neighborhood feel?</p>

      {/* Overall score */}
      <div className="card text-center mb-5 opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(16,185,129,0.08)' }}>
        <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-2">Overall Pulse</p>
        <p className="text-4xl font-bold text-emerald-700">{pulseAvg}</p>
        <p className="text-sm text-emerald-500 font-medium">{pulseAvg >= 4 ? 'Strong' : pulseAvg >= 3 ? 'Growing' : pulseAvg >= 2 ? 'Building' : 'Getting Started'}</p>
        <p className="text-xs text-stone-400 mt-1">{hoodPulse.length} responses</p>
      </div>

      {/* Quick survey */}
      {!submitted ? (
        <div className="card mb-5 border-2 border-emerald-100 animate-scale-in" style={{ backdropFilter: 'blur(16px) saturate(180%)', background: 'rgba(255,255,255,0.75)' }}>
          <h3 className="text-sm font-semibold text-stone-700 mb-1">Quick Pulse Check</h3>
          <p className="text-xs text-stone-400 mb-4">Question {currentQ + 1} of {PULSE_QUESTIONS.length}</p>

          <div className="text-center mb-5">
            <span className="text-2xl mb-2 block">{PULSE_QUESTIONS[currentQ].emoji}</span>
            <p className="text-sm font-medium text-stone-700">{PULSE_QUESTIONS[currentQ].question}</p>
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95`} style={{ backgroundColor: COLORS[rating - 1] + '22', border: `2px solid ${COLORS[rating - 1]}44` }}>
                  <Star size={18} style={{ color: COLORS[rating - 1] }} />
                </div>
                <span className="text-[10px] text-stone-400">{PULSE_LABELS[rating - 1]}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-1 justify-center mt-4">
            {PULSE_QUESTIONS.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentQ ? 'bg-emerald-500 w-4' : i < currentQ ? 'bg-emerald-300' : 'bg-stone-200'}`} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card mb-5 text-center opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(16,185,129,0.1)' }}>
          <p className="text-2xl mb-2">💓</p>
          <p className="text-sm font-semibold text-emerald-700">Thank you for checking in!</p>
          <p className="text-xs text-emerald-500 mt-1">Your pulse helps the community understand itself.</p>
          <button onClick={() => { setSubmitted(false); setCurrentQ(0); }} className="mt-3 text-xs text-emerald-600 underline hover:scale-[1.02] transition-transform">Take again</button>
        </div>
      )}

      {/* Per-question breakdown */}
      <div className="card mb-5" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <h3 className="text-sm font-semibold text-stone-600 mb-3">By Question</h3>
        <div className="space-y-3">
          {questionAvgs.map((q) => (
            <div key={q.id} className="hover:shadow-glass-lg hover:scale-[1.01] transition-all">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-stone-600">{q.emoji} {q.question.slice(0, 40)}...</span>
                <span className="font-semibold text-stone-700">{q.avg}/5</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(q.avg / 5) * 100}%`, backgroundColor: COLORS[Math.floor(q.avg) - 1] || '#e7e5e4' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly trend */}
      <div className="card" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <h3 className="text-sm font-semibold text-stone-600 mb-4">Weekly Trend</h3>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#292524', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
                formatter={(v) => [v, 'Avg Rating']}
              />
              <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {weeklyData.map((entry, index) => (
                  <Cell key={index} fill={entry.avg >= 4 ? '#059669' : entry.avg >= 3 ? '#eab308' : '#ef4444'} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
