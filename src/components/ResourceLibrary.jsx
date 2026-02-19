import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { RESOURCE_CATEGORIES } from '../data/features';
import { ArrowLeft, Plus, Library, Search, Package, X, Send, CheckCircle } from 'lucide-react';

export default function ResourceLibrary() {
  const navigate = useNavigate();
  const { resources, addResource, updateResource, neighborhood } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCat, setFormCat] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [search, setSearch] = useState('');

  const hoodResources = resources
    .filter((r) => r.neighborhood === neighborhood)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const filtered = hoodResources
    .filter((r) => filterCat === 'all' || r.category === filterCat)
    .filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()));

  const available = hoodResources.filter((r) => r.status === 'available').length;
  const borrowed = hoodResources.filter((r) => r.status === 'borrowed').length;

  const handleSubmit = () => {
    if (!formName.trim() || !formCat) return;
    addResource({ name: formName.trim(), category: formCat, description: formDesc.trim() });
    setShowForm(false);
    setFormName('');
    setFormCat('');
    setFormDesc('');
  };

  const toggleBorrow = (id, currentStatus) => {
    updateResource(id, { status: currentStatus === 'available' ? 'borrowed' : 'available' });
  };

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/community')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Community Hub
      </button>

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Library size={20} className="text-blue-500 drop-shadow-sm" />
          <h1 className="text-xl font-bold text-gradient">Resource Library</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-all active:scale-95 hover:scale-110 hover:shadow-lg">
          <Plus size={18} />
        </button>
      </div>
      <p className="text-sm text-stone-400 mb-5">Borrow & lend items in your neighborhood</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="card !p-3 text-center hover:scale-105 transition-transform opacity-0 animate-fade-up delay-100" style={{ background: 'rgba(219,234,254,0.7)', backdropFilter: 'blur(12px)' }}>
          <p className="text-xl font-bold text-blue-700">{available}</p>
          <p className="text-xs text-blue-500 font-medium">Available</p>
        </div>
        <div className="card !p-3 text-center hover:scale-105 transition-transform opacity-0 animate-fade-up delay-200" style={{ background: 'rgba(254,243,199,0.7)', backdropFilter: 'blur(12px)' }}>
          <p className="text-xl font-bold text-amber-700">{borrowed}</p>
          <p className="text-xs text-amber-500 font-medium">Borrowed</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." className="input-field pl-9 text-sm" />
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        <button onClick={() => setFilterCat('all')} className={`chip text-xs ${filterCat === 'all' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'chip-inactive'}`}>
          All
        </button>
        {RESOURCE_CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setFilterCat(cat.id)} className={`chip text-xs ${filterCat === cat.id ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'chip-inactive'}`}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-4 border border-white/40 shadow-glass animate-scale-in" style={{ backdropFilter: 'blur(16px) saturate(180%)', background: 'rgba(255,255,255,0.75)' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-stone-700">Add Item to Library</h3>
            <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600"><X size={18} /></button>
          </div>
          <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Item name (e.g., 'Power Drill')" className="input-field text-sm mb-3" maxLength={60} />
          <div className="flex flex-wrap gap-2 mb-3">
            {RESOURCE_CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setFormCat(cat.id)} className={`chip text-xs ${formCat === cat.id ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'chip-inactive'}`}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
          <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Brief description (optional)..." className="input-field h-16 resize-none text-sm mb-3" maxLength={150} />
          <button onClick={handleSubmit} disabled={!formName.trim() || !formCat} className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm ${(!formName.trim() || !formCat) ? 'opacity-40 cursor-not-allowed' : ''}`}>
            <Send size={16} /> Add to Library
          </button>
        </div>
      )}

      {/* Items list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-8" style={{ backdropFilter: 'blur(14px)', background: 'rgba(255,255,255,0.6)' }}>
          <Package size={32} className="text-stone-300 mx-auto mb-2" />
          <p className="text-sm text-stone-400">No items found. Add the first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((res) => {
            const cat = RESOURCE_CATEGORIES.find((c) => c.id === res.category);
            const isAvailable = res.status === 'available';
            return (
              <div key={res.id} className="card !p-4 hover:shadow-glass-lg hover:scale-[1.01] transition-all" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{cat?.emoji || '📦'}</span>
                      <h4 className="text-sm font-semibold text-stone-700">{res.name}</h4>
                    </div>
                    {res.description && <p className="text-xs text-stone-500 mt-0.5">{res.description}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isAvailable ? '✓ Available' : '⏳ Borrowed'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBorrow(res.id, res.status)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:scale-105 ${isAvailable ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                  >
                    {isAvailable ? 'Borrow' : 'Return'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-center text-stone-400 mt-6 pb-4">Items belong to the community. Handle with care, return promptly.</p>
    </div>
  );
}
