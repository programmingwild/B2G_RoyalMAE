import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { buildNetworkGraph, computeNetworkDensity, computeHelperConcentration, findClusters, computeInteractionDiversity, getTopContributors, computeNetworkHealth } from '../utils/networkGraph';
import { ArrowLeft, Network, Users, BarChart3, Shield, AlertTriangle, Layers, Share2 } from 'lucide-react';

export default function NetworkHealthPage() {
  const navigate = useNavigate();
  const { neighborhood, events, skills, resources, timeBankEntries } = useData();

  const report = useMemo(() => {
    if (!neighborhood) return null;
    return computeNetworkHealth(events, skills, resources, timeBankEntries, neighborhood);
  }, [events, skills, resources, timeBankEntries, neighborhood]);

  if (!report) return null;

  const resColor = report.resilienceScore >= 70 ? 'text-emerald-600' : report.resilienceScore >= 40 ? 'text-amber-500' : 'text-rose-500';
  const resBg = report.resilienceScore >= 70 ? 'from-emerald-50' : report.resilienceScore >= 40 ? 'from-amber-50' : 'from-rose-50';

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/insights')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Insights Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Network size={20} className="text-cyan-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Network Health</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Anonymous interaction patterns — no identities stored.</p>

      {/* Resilience Score */}
      <div className="card text-center mb-5" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-2">Resilience Score</p>
        <p className={`text-5xl font-bold ${resColor}`}>{report.resilienceScore}</p>
        <p className="text-sm font-medium text-stone-500 mt-1">{report.resilienceLabel}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Nodes', value: report.nodeCount, icon: Users, desc: 'Anonymous participants', color: 'text-blue-500' },
          { label: 'Connections', value: report.edgeCount, icon: Share2, desc: 'Interaction edges', color: 'text-cyan-500' },
          { label: 'Density', value: report.density, icon: Layers, desc: 'Connection ratio', color: 'text-violet-500' },
          { label: 'Clusters', value: report.clusterCount, icon: Network, desc: `${report.isolatedNodes} isolated`, color: 'text-amber-500' },
        ].map((m, i) => (
          <div key={m.label} className="card !py-3 opacity-0 animate-fade-up hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.6)', animationDelay: `${(i + 1) * 100}ms` }}>
            <div className="flex items-center gap-2 mb-1">
              <m.icon size={14} className={m.color} />
              <p className="text-xs font-semibold text-stone-600">{m.label}</p>
            </div>
            <p className="text-xl font-bold text-stone-800">{m.value}</p>
            <p className="text-[10px] text-stone-400">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Concentration */}
      <div className="card mb-4" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <h3 className="text-sm font-semibold text-stone-700 mb-3">Helper Concentration</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-stone-400">Gini Coefficient</span>
          <span className="text-sm font-bold text-stone-700">{report.concentration}</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 rounded-full transition-all ${
              report.concentration > 0.5 ? 'bg-rose-400' : report.concentration > 0.3 ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.min(report.concentration * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-stone-400">
          <span>Distributed</span>
          <span className="font-medium">{report.concentrationLabel}</span>
          <span>Concentrated</span>
        </div>
        {report.concentration > 0.5 && (
          <div className="mt-3 p-2.5 rounded-xl flex gap-2 items-start" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,228,230,0.5)' }}>
            <AlertTriangle size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-rose-600">High concentration — the network depends on a few super-helpers. This is fragile.</p>
          </div>
        )}
      </div>

      {/* Top Contributors (Anonymous) */}
      <div className="card mb-4" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <h3 className="text-sm font-semibold text-stone-700 mb-3">Top Anonymous Contributors</h3>
        <div className="space-y-2">
          {report.topContributors.map((c, i) => (
            <div key={c.id} className="flex items-center justify-between p-2 bg-stone-50 rounded-lg hover:shadow-glass-lg hover:scale-[1.01] transition-all">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-400 w-4">{i + 1}</span>
                <span className="text-xs font-mono text-stone-500">{c.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-stone-400">{c.categoryCount} categories</span>
                <span className="text-xs font-semibold text-stone-700">{c.eventCount} acts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interaction Diversity */}
      <div className="card mb-4" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-stone-700">Interaction Diversity</h3>
          <div className="flex items-center gap-1">
            <BarChart3 size={14} className="text-violet-400" />
            <span className="text-lg font-bold text-violet-600">{report.diversityCount}</span>
          </div>
        </div>
        <p className="text-xs text-stone-400 mt-1">Different categories of interaction across the network</p>
      </div>

      {/* Privacy Notice */}
      <div className="card" style={{ backdropFilter: 'blur(12px)', background: 'rgba(207,250,254,0.5)' }}>
        <div className="flex gap-2 items-start">
          <Shield size={14} className="text-cyan-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-cyan-700 leading-relaxed">
            All network analysis is computed locally using anonymized participant IDs. 
            No real identities are stored or transmitted. The graph reveals <em>patterns</em>, not <em>people</em>.
          </p>
        </div>
      </div>
    </div>
  );
}
