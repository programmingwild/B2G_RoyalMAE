import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import {
  CONSENT_CATEGORIES,
  getResearchConsent,
  toggleResearchConsent,
  toggleConsentCategory,
  generateResearchExport,
  getExportHistory,
} from '../utils/researchLayer';
import { ArrowLeft, FlaskConical, Download, Shield, Eye, EyeOff, Clock, Check } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function ResearchLayerPage() {
  const navigate = useNavigate();
  const { neighborhood, events, score, trendDir } = useData();
  const [refresh, setRefresh] = useState(0);

  const consent = useMemo(() => getResearchConsent(neighborhood), [neighborhood, refresh]);
  const history = useMemo(() => getExportHistory(neighborhood), [neighborhood, refresh]);

  const handleToggleConsent = useCallback(() => {
    toggleResearchConsent(neighborhood);
    setRefresh((r) => r + 1);
  }, [neighborhood]);

  const handleToggleCategory = useCallback((catId) => {
    toggleConsentCategory(neighborhood, catId);
    setRefresh((r) => r + 1);
  }, [neighborhood]);

  const handleExport = useCallback(() => {
    const result = generateResearchExport(neighborhood, events, score, trendDir);
    if (result) {
      // In production, this would submit to a research endpoint
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `research-export-${result.exportId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setRefresh((r) => r + 1);
  }, [neighborhood, events, score, trendDir]);

  const consentedCount = Object.values(consent.categories || {}).filter(Boolean).length;

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/insights')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Insights Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <FlaskConical size={20} className="text-purple-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Urban Research Layer</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Opt-in anonymized data that helps planners build better cities.</p>

      {/* Consent Toggle */}
      <div className={`card mb-5`} style={{ backdropFilter: 'blur(12px)', background: consent.enabled ? 'rgba(147,51,234,0.08)' : 'rgba(255,255,255,0.65)' }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-semibold text-stone-700">Research Participation</p>
            <p className="text-xs text-stone-400">{consent.enabled ? 'Sharing anonymized data' : 'Not participating'}</p>
          </div>
          <button
            onClick={handleToggleConsent}
            className={`w-12 h-6 rounded-full transition-all relative hover:scale-105 ${consent.enabled ? 'bg-purple-500' : 'bg-stone-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${consent.enabled ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
        {consent.consentDate && (
          <p className="text-[10px] text-stone-400">
            Consented {formatDistanceToNow(parseISO(consent.consentDate), { addSuffix: true })} • {consentedCount} categories active
          </p>
        )}
      </div>

      {/* Privacy Promise */}
      <div className="card mb-5" style={{ backdropFilter: 'blur(12px)', background: 'rgba(147,51,234,0.08)' }}>
        <div className="flex gap-2 items-start">
          <Shield size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-purple-700 mb-1">Our Privacy Promise</p>
            <ul className="text-[10px] text-purple-600 space-y-1 leading-relaxed">
              <li>• 100% voluntary — withdraw at any time</li>
              <li>• No individual data ever leaves your device</li>
              <li>• Only aggregate, anonymized statistics shared</li>
              <li>• Neighborhood identity is hashed — untraceable</li>
              <li>• You choose exactly which data categories to share</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Consent Categories */}
      {consent.enabled && (
        <div className="card mb-5" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <h3 className="text-sm font-semibold text-stone-700 mb-3">What do you consent to share?</h3>
          <div className="space-y-2.5">
            {CONSENT_CATEGORIES.map((cat) => {
              const isOn = consent.categories?.[cat.id] || false;
              return (
                <div key={cat.id} className={`p-3 rounded-xl transition-all hover:shadow-glass-lg hover:scale-[1.01] ${isOn ? 'bg-purple-50 ring-1 ring-purple-200' : 'bg-stone-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span>
                      <p className="text-xs font-semibold text-stone-700">{cat.label}</p>
                    </div>
                    <button
                      onClick={() => handleToggleCategory(cat.id)}
                      className={`w-10 h-5 rounded-full transition-all relative hover:scale-105 ${isOn ? 'bg-purple-500' : 'bg-stone-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${isOn ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-400 ml-7">{cat.description}</p>
                  {isOn && (
                    <div className="mt-1.5 ml-7 flex items-center gap-1">
                      <Eye size={10} className="text-purple-400" />
                      <span className="text-[10px] text-purple-400">Sharing: {cat.dataShared}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Export Data */}
      {consent.enabled && consentedCount > 0 && (
        <div className="card mb-5" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <h3 className="text-sm font-semibold text-stone-700 mb-2">Export Anonymized Data</h3>
          <p className="text-xs text-stone-400 mb-3">
            Generate a JSON snapshot of consented anonymized data. In production, this would be submitted to urban research partners.
          </p>
          <button
            onClick={handleExport}
            className="w-full py-2.5 rounded-xl bg-purple-500 text-white text-sm font-semibold hover:bg-purple-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <Download size={16} /> Generate Research Export
          </button>
        </div>
      )}

      {/* Export History */}
      {history.length > 0 && (
        <div className="card" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Export History</h3>
          <div className="space-y-2">
            {history.slice().reverse().map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg hover:shadow-glass-lg hover:scale-[1.01] transition-all">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-purple-400" />
                  <div>
                    <p className="text-xs font-mono text-stone-500">{exp.id}</p>
                    <p className="text-[10px] text-stone-400">{exp.datasetCount} datasets</p>
                  </div>
                </div>
                <span className="text-[10px] text-stone-400">{formatDistanceToNow(parseISO(exp.timestamp), { addSuffix: true })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not participating view */}
      {!consent.enabled && (
        <div className="card text-center py-8" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
          <EyeOff size={32} className="mx-auto mb-2 text-stone-300" />
          <p className="text-sm text-stone-500 mb-1">Not participating</p>
          <p className="text-xs text-stone-400">
            Toggle participation above to help urban planners build better, more inclusive communities.
          </p>
        </div>
      )}
    </div>
  );
}
