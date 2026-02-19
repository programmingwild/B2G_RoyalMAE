import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { getVerificationStats, createVerification, confirmVerification, proximityVerification, seedVerificationData, getVerifications } from '../utils/verification';
import { ArrowLeft, ShieldCheck, Lock, Bluetooth, Key, CheckCircle2, Clock, Copy, Zap } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function VerificationPage() {
  const navigate = useNavigate();
  const { neighborhood, events } = useData();
  const [stats, setStats] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [tab, setTab] = useState('overview'); // overview | verify | history
  const [token, setToken] = useState('');
  const [confirmToken, setConfirmToken] = useState('');
  const [lastCreated, setLastCreated] = useState(null);
  const [confirmResult, setConfirmResult] = useState(null);

  useEffect(() => {
    seedVerificationData(neighborhood);
    setStats(getVerificationStats(neighborhood));
    setVerifications(getVerifications(neighborhood).sort((a, b) => new Date(b.initiatedAt) - new Date(a.initiatedAt)));
  }, [neighborhood]);

  const handleCreateToken = () => {
    const recentEvent = events.filter((e) => e.neighborhood === neighborhood).slice(-1)[0];
    if (!recentEvent) return;
    const v = createVerification(recentEvent.id, neighborhood);
    setLastCreated(v);
    setStats(getVerificationStats(neighborhood));
    setVerifications(getVerifications(neighborhood).sort((a, b) => new Date(b.initiatedAt) - new Date(a.initiatedAt)));
  };

  const handleConfirm = () => {
    if (!confirmToken.trim()) return;
    const result = confirmVerification(confirmToken.trim().toUpperCase(), neighborhood);
    setConfirmResult(result);
    setConfirmToken('');
    setStats(getVerificationStats(neighborhood));
    setVerifications(getVerifications(neighborhood).sort((a, b) => new Date(b.initiatedAt) - new Date(a.initiatedAt)));
  };

  const handleProximity = () => {
    const recentEvent = events.filter((e) => e.neighborhood === neighborhood).slice(-1)[0];
    if (!recentEvent) return;
    proximityVerification(recentEvent.id, neighborhood);
    setStats(getVerificationStats(neighborhood));
    setVerifications(getVerifications(neighborhood).sort((a, b) => new Date(b.initiatedAt) - new Date(a.initiatedAt)));
  };

  if (!stats) return null;

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/insights')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Insights Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={20} className="text-indigo-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Reciprocity Verification</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Privacy-first trust — verify without surveillance.</p>

      {/* Trust Score */}
      <div className="card text-center mb-5" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
        <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-2">Trust Rate</p>
        <p className="text-4xl font-bold text-indigo-700">{stats.trustRate}%</p>
        <p className="text-xs text-stone-400 mt-1">{stats.confirmed} of {stats.total} exchanges verified</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.6)' }}>
          <p className="text-lg font-bold text-emerald-600">{stats.confirmed}</p>
          <p className="text-[10px] text-stone-400">Confirmed</p>
        </div>
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.6)' }}>
          <p className="text-lg font-bold text-amber-500">{stats.pending}</p>
          <p className="text-[10px] text-stone-400">Pending</p>
        </div>
        <div className="card text-center !py-3 opacity-0 animate-fade-up delay-300 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.6)' }}>
          <p className="text-lg font-bold text-blue-500">{stats.byProximity}</p>
          <p className="text-[10px] text-stone-400">Proximity</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {['overview', 'verify', 'history'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === t ? 'bg-indigo-100 text-indigo-700' : 'bg-stone-100 text-stone-500'}`}>
            {t === 'overview' ? 'How It Works' : t === 'verify' ? 'Verify Now' : 'History'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-3">
          <div className="card" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
            <h3 className="text-sm font-semibold text-stone-700 mb-3">Zero-Knowledge Verification</h3>
            <div className="space-y-3">
              {[
                { icon: Key, title: 'Token Exchange', desc: 'Both parties share a one-time code to confirm an exchange happened. No details stored.' },
                { icon: Bluetooth, title: 'Proximity Handshake', desc: 'For in-person exchanges, a local Bluetooth-like confirmation. No location history.' },
                { icon: Lock, title: 'Zero-Knowledge Proof', desc: 'System verifies reciprocity occurred without revealing identities.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 p-3 bg-stone-50 rounded-xl hover:shadow-glass-lg hover:scale-[1.01] transition-all">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon size={14} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-700">{item.title}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ backdropFilter: 'blur(12px)', background: 'rgba(224,231,255,0.5)' }}>
            <p className="text-xs text-indigo-700 leading-relaxed">
              <strong>Privacy guarantee:</strong> Only proof hashes are stored — never who, where, or what. 
              The system knows <em>that</em> reciprocity happened, not <em>what</em> happened.
            </p>
          </div>
        </div>
      )}

      {tab === 'verify' && (
        <div className="space-y-4">
          {/* Token generation */}
          <div className="card" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
            <h3 className="text-sm font-semibold text-stone-700 mb-2">🔑 Generate Token</h3>
            <p className="text-xs text-stone-400 mb-3">Share this code with the other participant to verify your exchange.</p>
            <button onClick={handleCreateToken} className="w-full py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 hover:scale-[1.02] transition-all active:scale-[0.98]">
              Generate Verification Token
            </button>
            {lastCreated && (
              <div className="mt-3 p-3 bg-indigo-50 rounded-xl text-center">
                <p className="text-xs text-stone-400 mb-1">Share this code:</p>
                <p className="text-2xl font-mono font-bold text-indigo-700 tracking-wider">{lastCreated.token}</p>
                <p className="text-[10px] text-stone-400 mt-1">Valid for 48 hours</p>
              </div>
            )}
          </div>

          {/* Token confirmation */}
          <div className="card" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
            <h3 className="text-sm font-semibold text-stone-700 mb-2">✅ Confirm Token</h3>
            <p className="text-xs text-stone-400 mb-3">Enter the code shared by the other participant.</p>
            <div className="flex gap-2">
              <input
                value={confirmToken}
                onChange={(e) => setConfirmToken(e.target.value.toUpperCase())}
                placeholder="Enter 6-char code"
                maxLength={6}
                className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm font-mono tracking-wider text-center focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button onClick={handleConfirm} disabled={confirmToken.length < 6} className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold disabled:opacity-40 hover:bg-emerald-600 hover:scale-[1.02] transition-transform">
                Confirm
              </button>
            </div>
            {confirmResult && (
              <div className={`mt-3 p-3 rounded-xl text-xs text-center ${confirmResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {confirmResult.success ? '✅ Exchange verified! Trust recorded.' : `❌ ${confirmResult.reason}`}
              </div>
            )}
          </div>

          {/* Proximity */}
          <div className="card" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
            <h3 className="text-sm font-semibold text-stone-700 mb-2">📡 Proximity Verify</h3>
            <p className="text-xs text-stone-400 mb-3">For in-person exchanges — simulates a local Bluetooth handshake.</p>
            <button onClick={handleProximity} className="w-full py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-semibold hover:bg-cyan-600 hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <Bluetooth size={16} /> Proximity Handshake
            </button>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-2">
          {verifications.length === 0 ? (
            <div className="text-center py-12 text-stone-400" style={{ backdropFilter: 'blur(14px)', background: 'rgba(255,255,255,0.6)' }}>
              <ShieldCheck size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No verifications yet.</p>
            </div>
          ) : (
            verifications.map((v) => (
              <div key={v.id} className="card !p-3 hover:shadow-glass-lg hover:scale-[1.01] transition-all" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {v.status === 'confirmed' ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : v.status === 'pending' ? (
                      <Clock size={16} className="text-amber-500" />
                    ) : (
                      <Clock size={16} className="text-stone-300" />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-stone-700">
                        {v.method === 'proximity' ? '📡 Proximity' : '🔑 Token'} — {v.status}
                      </p>
                      <p className="text-[10px] text-stone-400">{formatDistanceToNow(parseISO(v.initiatedAt), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-stone-300">{v.proofHash?.slice(0, 12)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
