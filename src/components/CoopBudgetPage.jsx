import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { COOP_PROGRAMS, computeEligibility, getCoopBudget, addCoopContribution, addCoopProposal, voteProposal, seedCoopData } from '../utils/cooperativeBudget';
import { ArrowLeft, Coins, Lock, CheckCircle2, ChevronUp, Vote, PlusCircle } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function CoopBudgetPage() {
  const navigate = useNavigate();
  const { neighborhood, events, score } = useData();
  const [tab, setTab] = useState('programs');
  const [contribAmount, setContribAmount] = useState('');
  const [contribNote, setContribNote] = useState('');
  const [proposalForm, setProposalForm] = useState({ title: '', amount: '', description: '' });
  const [refresh, setRefresh] = useState(0);

  // Seed demo data
  useMemo(() => { if (neighborhood) seedCoopData(neighborhood); }, [neighborhood]);

  const totalEvents = events.filter((e) => e.neighborhood === neighborhood).length;
  const programs = useMemo(() => computeEligibility(score, totalEvents), [score, totalEvents]);
  const budget = useMemo(() => getCoopBudget(neighborhood), [neighborhood, refresh]);

  // Determine tier
  const eligibleCount = programs.filter((p) => p.eligible).length;
  const tier = eligibleCount >= 5 ? 'Platinum' : eligibleCount >= 3 ? 'Gold' : eligibleCount >= 2 ? 'Silver' : eligibleCount >= 1 ? 'Bronze' : 'Starter';
  const tierColors = {
    Starter: 'text-stone-500 bg-stone-100',
    Bronze: 'text-amber-700 bg-amber-100',
    Silver: 'text-slate-600 bg-slate-100',
    Gold: 'text-yellow-700 bg-yellow-100',
    Platinum: 'text-violet-700 bg-violet-100',
  };

  const handleContribute = useCallback(() => {
    const amount = parseFloat(contribAmount);
    if (!amount || amount <= 0) return;
    addCoopContribution(neighborhood, amount, contribNote);
    setContribAmount('');
    setContribNote('');
    setRefresh((r) => r + 1);
  }, [neighborhood, contribAmount, contribNote]);

  const handlePropose = useCallback(() => {
    if (!proposalForm.title || !proposalForm.amount) return;
    addCoopProposal(neighborhood, proposalForm.title, parseFloat(proposalForm.amount), proposalForm.description);
    setProposalForm({ title: '', amount: '', description: '' });
    setRefresh((r) => r + 1);
  }, [neighborhood, proposalForm]);

  const handleVote = useCallback((proposalId) => {
    voteProposal(neighborhood, proposalId);
    setRefresh((r) => r + 1);
  }, [neighborhood]);

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/insights')} className="flex items-center gap-1 text-stone-400 hover:text-stone-600 mb-4 text-sm transition-colors">
        <ArrowLeft size={16} /> Insights Hub
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Coins size={20} className="text-emerald-500 drop-shadow-sm" />
        <h1 className="text-xl font-bold text-gradient">Cooperative Budget</h1>
      </div>
      <p className="text-sm text-stone-400 mb-5">Reciprocity becomes economic leverage.</p>

      {/* Tier + Fund */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="card text-center opacity-0 animate-fade-up delay-100 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px)', background: 'rgba(16,185,129,0.08)' }}>
          <p className="text-xs text-stone-400 mb-1">Community Tier</p>
          <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${tierColors[tier]}`}>{tier}</span>
          <p className="text-[10px] text-stone-400 mt-1">{eligibleCount} programs unlocked</p>
        </div>
        <div className="card text-center opacity-0 animate-fade-up delay-200 hover:scale-105 transition-transform" style={{ backdropFilter: 'blur(12px)', background: 'rgba(16,185,129,0.08)' }}>
          <p className="text-xs text-stone-400 mb-1">Community Fund</p>
          <p className="text-2xl font-bold text-emerald-600">${budget.totalFund || 0}</p>
          <p className="text-[10px] text-stone-400 mt-1">{(budget.contributions || []).length} contributions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {['programs', 'fund', 'proposals'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${tab === t ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
            {t === 'programs' ? 'Programs' : t === 'fund' ? 'Fund' : 'Proposals'}
          </button>
        ))}
      </div>

      {tab === 'programs' && (
        <div className="space-y-3">
          {programs.map((p) => (
            <div key={p.id} className={`card !p-0 overflow-hidden hover:shadow-glass-lg hover:scale-[1.01] transition-all ${p.eligible ? 'ring-1 ring-emerald-200' : 'opacity-80'}`} style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{p.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold text-stone-700">{p.name}</h3>
                      {p.eligible ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : (
                        <Lock size={14} className="text-stone-300" />
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mb-2">{p.description}</p>
                    <p className={`text-xs font-medium ${p.eligible ? 'text-emerald-600' : 'text-stone-400'}`}>{p.benefit}</p>
                    
                    {/* Progress bars */}
                    {!p.eligible && (
                      <div className="mt-3 space-y-2">
                        <div>
                          <div className="flex justify-between text-[10px] mb-0.5">
                            <span className="text-stone-400">Score: {score}/{p.minScore}</span>
                            <span className={p.scoreEligible ? 'text-emerald-500' : 'text-stone-400'}>{p.scoreProgress}%</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${p.scoreEligible ? 'bg-emerald-400' : 'bg-stone-300'}`} style={{ width: `${p.scoreProgress}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] mb-0.5">
                            <span className="text-stone-400">Events: {totalEvents}/{p.minEvents}</span>
                            <span className={p.eventsEligible ? 'text-emerald-500' : 'text-stone-400'}>{p.eventsProgress}%</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${p.eventsEligible ? 'bg-emerald-400' : 'bg-stone-300'}`} style={{ width: `${p.eventsProgress}%` }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 py-1.5 border-t border-stone-100 bg-stone-50 flex justify-between items-center">
                <span className="text-[10px] font-medium capitalize" style={{ color: p.color }}>{p.tier} tier</span>
                <span className={`text-[10px] font-medium ${p.eligible ? 'text-emerald-600' : 'text-stone-400'}`}>
                  {p.eligible ? '✓ Eligible' : `${p.overallProgress}% progress`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'fund' && (
        <div className="space-y-4">
          {/* Contribute */}
          <div className="card animate-scale-in" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
            <h3 className="text-sm font-semibold text-stone-700 mb-3">Contribute to Fund</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-sm text-stone-400">$</span>
                  <input
                    type="number"
                    value={contribAmount}
                    onChange={(e) => setContribAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
                <button onClick={handleContribute} disabled={!contribAmount} className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold disabled:opacity-40 hover:bg-emerald-600 hover:scale-[1.02]">
                  Add
                </button>
              </div>
              <input
                value={contribNote}
                onChange={(e) => setContribNote(e.target.value)}
                placeholder="Note (optional)"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          </div>

          {/* History */}
          <div className="card" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
            <h3 className="text-sm font-semibold text-stone-700 mb-3">Contribution History</h3>
            <div className="space-y-2">
              {(budget.contributions || []).slice().reverse().map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg hover:shadow-glass-lg hover:scale-[1.01] transition-all">
                  <div>
                    <p className="text-xs font-medium text-stone-700">${c.amount}</p>
                    {c.note && <p className="text-[10px] text-stone-400">{c.note}</p>}
                  </div>
                  <span className="text-[10px] text-stone-400">{formatDistanceToNow(parseISO(c.timestamp), { addSuffix: true })}</span>
                </div>
              ))}
              {(!budget.contributions || budget.contributions.length === 0) && (
                <p className="text-xs text-stone-400 text-center py-4">No contributions yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'proposals' && (
        <div className="space-y-4">
          {/* New Proposal */}
          <div className="card animate-scale-in" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
            <h3 className="text-sm font-semibold text-stone-700 mb-3">New Proposal</h3>
            <div className="space-y-2">
              <input
                value={proposalForm.title}
                onChange={(e) => setProposalForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="What do you propose?"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-stone-400">$</span>
                <input
                  type="number"
                  value={proposalForm.amount}
                  onChange={(e) => setProposalForm((f) => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <textarea
                value={proposalForm.description}
                onChange={(e) => setProposalForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe the proposal..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
              />
              <button onClick={handlePropose} disabled={!proposalForm.title || !proposalForm.amount} className="w-full py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold disabled:opacity-40 hover:bg-emerald-600 hover:scale-[1.02]">
                Submit Proposal
              </button>
            </div>
          </div>

          {/* Existing Proposals */}
          <div className="space-y-2">
            {(budget.proposals || []).slice().reverse().map((p) => (
              <div key={p.id} className="card !p-3 hover:shadow-glass-lg hover:scale-[1.01] transition-all" style={{ backdropFilter: 'blur(14px) saturate(180%)', background: 'rgba(255,255,255,0.65)' }}>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-700">{p.title}</h4>
                    <p className="text-xs text-stone-400">${p.amount} requested</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : p.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {p.status}
                  </span>
                </div>
                {p.description && <p className="text-xs text-stone-500 mb-2">{p.description}</p>}
                <div className="flex items-center justify-between">
                  <button onClick={() => handleVote(p.id)} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 hover:scale-[1.02]">
                    <ChevronUp size={14} /> <span className="font-semibold">{p.votes}</span> votes
                  </button>
                  <span className="text-[10px] text-stone-400">{formatDistanceToNow(parseISO(p.timestamp), { addSuffix: true })}</span>
                </div>
              </div>
            ))}
            {(!budget.proposals || budget.proposals.length === 0) && (
              <div className="text-center py-8 text-stone-400">
                <Vote size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No proposals yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
