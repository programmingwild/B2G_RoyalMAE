import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { GARDEN_PLOT_TYPES } from '../data/features';
import { ArrowLeft, Leaf, Plus, X, Droplets, Sun, Sprout, TreeDeciduous } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

const GROWTH_STAGES = [
  { id: 'seedling', label: 'Seedling', emoji: '🌱', color: '#84cc16' },
  { id: 'growing', label: 'Growing', emoji: '🌿', color: '#22c55e' },
  { id: 'flowering', label: 'Flowering', emoji: '🌸', color: '#ec4899' },
  { id: 'harvesting', label: 'Harvesting', emoji: '🥬', color: '#f59e0b' },
  { id: 'dormant', label: 'Dormant', emoji: '🍂', color: '#a8a29e' },
];

export default function CommunityGarden() {
  const navigate = useNavigate();
  const { gardenItems, addGardenEntry, updateGardenEntry, removeGardenEntry, neighborhood } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', plotType: GARDEN_PLOT_TYPES[0].id, stage: 'seedling', notes: '' });

  const hoodGarden = gardenItems
    .filter((g) => g.neighborhood === neighborhood)
    .sort((a, b) => new Date(b.updatedAt || b.timestamp) - new Date(a.updatedAt || a.timestamp));

  const activePlots = hoodGarden.filter((g) => g.stage !== 'dormant');
  const harvestReady = hoodGarden.filter((g) => g.stage === 'harvesting');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addGardenEntry({ name: form.name.trim(), plotType: form.plotType, stage: form.stage, notes: form.notes.trim() });
    setForm({ name: '', plotType: GARDEN_PLOT_TYPES[0].id, stage: 'seedling', notes: '' });
    setShowForm(false);
  };

  const cycleStage = (item) => {
    const stageIds = GROWTH_STAGES.map((s) => s.id);
    const current = stageIds.indexOf(item.stage);
    const next = (current + 1) % stageIds.length;
    updateGardenEntry(item.id, { stage: stageIds[next], updatedAt: new Date().toISOString() });
  };

  const getStageInfo = (stageId) => GROWTH_STAGES.find((s) => s.id === stageId) || GROWTH_STAGES[0];
  const getPlotInfo = (typeId) => GARDEN_PLOT_TYPES.find((t) => t.id === typeId) || GARDEN_PLOT_TYPES[0];

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/community')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Community Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Leaf size={20} className="text-lime-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Community Garden</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Grow together — coordinate plots, share harvests.</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(236,252,203,0.55)' }}>
          <p className="text-lg font-bold text-lime-600">{activePlots.length}</p>
          <p className="text-[10px] text-stone-400">Active Plots</p>
        </div>
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(254,243,199,0.55)' }}>
          <p className="text-lg font-bold text-amber-600">{harvestReady.length}</p>
          <p className="text-[10px] text-stone-400">Harvest Ready</p>
        </div>
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-300 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px) saturate(180%)', background: 'rgba(255,255,255,0.55)' }}>
          <p className="text-lg font-bold text-stone-600">{hoodGarden.length}</p>
          <p className="text-[10px] text-stone-400">Total Entries</p>
        </div>
      </div>

      {/* Harvest alert */}
      {harvestReady.length > 0 && (
        <div className="card mb-5 border border-white/40 shadow-glass" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'linear-gradient(to right, rgba(254,243,199,0.5), rgba(255,237,213,0.5))' }}>
          <p className="text-sm font-semibold text-amber-700">🥬 Harvest Available!</p>
          <p className="text-xs text-amber-600 mt-1">{harvestReady.map((h) => h.name).join(', ')} — check by the garden to share!</p>
        </div>
      )}

      {/* Growth overview */}
      <div className="card mb-5" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <h3 className="text-sm font-semibold text-stone-600 mb-3">Growth Overview</h3>
        <div className="flex gap-1 items-end h-12">
          {GROWTH_STAGES.map((stage) => {
            const count = hoodGarden.filter((g) => g.stage === stage.id).length;
            const pct = hoodGarden.length > 0 ? (count / hoodGarden.length) * 100 : 0;
            return (
              <div key={stage.id} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md transition-all duration-500" style={{ height: `${Math.max(pct * 0.4, 4)}px`, backgroundColor: stage.color }} />
                <span className="text-[10px]">{stage.emoji}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add button + form */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-stone-600">Garden Entries</h3>
        <button onClick={() => setShowForm(!showForm)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg ${showForm ? 'bg-red-100 text-red-500' : 'bg-lime-500 text-white'}`}>
          {showForm ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-5 border border-white/40 shadow-glass space-y-3 animate-scale-in" style={{ backdropFilter: 'blur(16px) saturate(180%)', background: 'rgba(255,255,255,0.75)' }}>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Plant or project name" maxLength={60} className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lime-300" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.plotType} onChange={(e) => setForm({ ...form, plotType: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lime-300">
              {GARDEN_PLOT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
              ))}
            </select>
            <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lime-300">
              {GROWTH_STAGES.map((s) => (
                <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>
              ))}
            </select>
          </div>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes (optional)" rows={2} maxLength={200} className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lime-300 resize-none" />
          <button type="submit" disabled={!form.name.trim()} className="w-full py-2.5 rounded-xl bg-lime-500 text-white text-sm font-semibold disabled:opacity-40 hover:bg-lime-600 transition-all active:scale-[0.98] hover:scale-[1.02]">
            Add to Garden
          </button>
        </form>
      )}

      {/* Garden items */}
      {hoodGarden.length === 0 ? (
        <div className="text-center py-12 text-stone-400 rounded-2xl" style={{ backdropFilter: 'blur(14px)', background: 'rgba(255,255,255,0.6)' }}>
          <Sprout size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No garden entries yet. Plant something!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hoodGarden.map((item) => {
            const stageInfo = getStageInfo(item.stage);
            const plotInfo = getPlotInfo(item.plotType);
            return (
              <div key={item.id} className="card !p-0 overflow-hidden hover:shadow-glass-lg hover:scale-[1.01] transition-all" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
                <div className="flex">
                  {/* Stage indicator */}
                  <div className="w-14 flex-shrink-0 flex flex-col items-center justify-center p-2" style={{ backgroundColor: stageInfo.color + '15' }}>
                    <span className="text-xl">{stageInfo.emoji}</span>
                    <span className="text-[9px] font-medium mt-0.5" style={{ color: stageInfo.color }}>{stageInfo.label}</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-stone-800">{item.name}</p>
                        <span className="text-[10px] bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded mt-0.5 inline-block">{plotInfo.emoji} {plotInfo.label}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => cycleStage(item)} className="text-[10px] text-lime-600 bg-lime-50 px-2 py-1 rounded-lg hover:bg-lime-100 transition-colors hover:scale-[1.02]" title="Advance growth stage">
                          <Sprout size={12} />
                        </button>
                        <button onClick={() => removeGardenEntry(item.id)} className="text-[10px] text-red-400 bg-red-50 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors hover:scale-[1.02]">
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                    {item.notes && <p className="text-xs text-stone-400 mt-1">{item.notes}</p>}
                    <p className="text-[10px] text-stone-300 mt-1.5">Updated {formatDistanceToNow(parseISO(item.updatedAt || item.timestamp), { addSuffix: true })}</p>
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
