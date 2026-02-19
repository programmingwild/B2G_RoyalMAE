import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { EVENT_TYPES } from '../data/features';
import { ArrowLeft, CalendarDays, Plus, X, MapPin, Users, Heart, Clock } from 'lucide-react';
import { format, parseISO, isAfter } from 'date-fns';

export default function NeighborhoodEvents() {
  const navigate = useNavigate();
  const { calEvents, addEvent, markInterested, neighborhood } = useData();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('upcoming');
  const [form, setForm] = useState({ title: '', type: EVENT_TYPES[0].id, date: '', time: '10:00', location: '', description: '' });

  const hoodEvents = calEvents
    .filter((e) => e.neighborhood === neighborhood)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const now = new Date();
  const upcoming = hoodEvents.filter((e) => isAfter(parseISO(e.date), now));
  const past = hoodEvents.filter((e) => !isAfter(parseISO(e.date), now));
  const displayed = filter === 'upcoming' ? upcoming : past;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    addEvent({ ...form, title: form.title.trim(), location: form.location.trim(), description: form.description.trim() });
    setForm({ title: '', type: EVENT_TYPES[0].id, date: '', time: '10:00', location: '', description: '' });
    setShowForm(false);
  };

  const getTypeInfo = (typeId) => EVENT_TYPES.find((t) => t.id === typeId) || EVENT_TYPES[0];

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/community')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Community Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <CalendarDays size={20} className="text-blue-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Neighborhood Events</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Bring the community together, one gathering at a time.</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-lg font-bold text-blue-600">{upcoming.length}</p>
          <p className="text-[10px] text-stone-400">Upcoming</p>
        </div>
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-lg font-bold text-stone-600">{past.length}</p>
          <p className="text-[10px] text-stone-400">Past</p>
        </div>
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-300 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <p className="text-lg font-bold text-purple-600">{hoodEvents.reduce((s, e) => s + (e.interested || 0), 0)}</p>
          <p className="text-[10px] text-stone-400">Interested</p>
        </div>
      </div>

      {/* Filter + Add */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {['upcoming', 'past'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
              {f === 'upcoming' ? 'Upcoming' : 'Past'}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg ${showForm ? 'bg-red-100 text-red-500' : 'bg-blue-500 text-white'}`}>
          {showForm ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-5 border border-white/40 shadow-glass space-y-3 animate-scale-in" style={{ backdropFilter: 'blur(16px) saturate(180%)', background: 'rgba(255,255,255,0.75)' }}>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" maxLength={60} className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            {EVENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location (optional)" maxLength={60} className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" rows={2} maxLength={200} className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
          <button type="submit" disabled={!form.title.trim() || !form.date} className="w-full py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold disabled:opacity-40 hover:bg-blue-600 transition-all active:scale-[0.98] hover:scale-[1.02]">
            Create Event
          </button>
        </form>
      )}

      {/* Events list */}
      {displayed.length === 0 ? (
        <div className="text-center py-12 text-stone-400" style={{ backdropFilter: 'blur(14px)', background: 'rgba(255,255,255,0.6)' }}>
          <CalendarDays size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No {filter} events yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((evt) => {
            const typeInfo = getTypeInfo(evt.type);
            const isPast = !isAfter(parseISO(evt.date), now);
            return (
              <div key={evt.id} className={`card !p-0 overflow-hidden hover:shadow-glass-lg hover:scale-[1.01] transition-all ${isPast ? 'opacity-60' : ''}`} style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
                <div className="flex">
                  {/* Date badge */}
                  <div className="w-16 flex-shrink-0 bg-blue-50 flex flex-col items-center justify-center p-2 border-r border-stone-100">
                    <span className="text-[10px] font-semibold text-blue-400 uppercase">{format(parseISO(evt.date), 'MMM')}</span>
                    <span className="text-xl font-bold text-blue-700">{format(parseISO(evt.date), 'd')}</span>
                    {evt.time && <span className="text-[10px] text-blue-400">{evt.time}</span>}
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">{typeInfo.emoji} {typeInfo.label}</span>
                        <p className="text-sm font-semibold text-stone-800 mt-1">{evt.title}</p>
                      </div>
                    </div>
                    {evt.location && (
                      <p className="text-xs text-stone-400 flex items-center gap-1 mt-1.5"><MapPin size={10} /> {evt.location}</p>
                    )}
                    {evt.description && (
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">{evt.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      {!isPast && (
                        <button onClick={() => markInterested(evt.id)} className="flex items-center gap-1 text-xs text-pink-500 hover:text-pink-600 transition-colors">
                          <Heart size={12} fill={evt.interested > 0 ? 'currentColor' : 'none'} /> {evt.interested || 0} interested
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
