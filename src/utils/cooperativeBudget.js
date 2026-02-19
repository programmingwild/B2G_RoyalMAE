/**
 * Cooperative Budgeting Integration
 *
 * Neighborhoods with strong Reciprocity Density Scores gain eligibility for:
 * - Micro-grants
 * - Cooperative funding pools
 * - Shared tool libraries
 * - Collective insurance discounts
 *
 * Reciprocity becomes economic leverage.
 */

const STORAGE_KEY = 'nrn_coop_budget';

function _get() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function _set(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

/**
 * Program eligibility tiers based on reciprocity score & activity.
 */
export const COOP_PROGRAMS = [
  {
    id: 'micro-grant',
    name: 'Community Micro-Grant',
    emoji: '💰',
    description: 'Small-scale funding for neighborhood improvement projects',
    minScore: 30,
    minEvents: 20,
    tier: 'bronze',
    benefit: 'Up to $250 for community projects',
    color: '#cd7f32',
  },
  {
    id: 'tool-library',
    name: 'Shared Tool Library Fund',
    emoji: '🔧',
    description: 'Collective purchasing for community-shared tools and equipment',
    minScore: 40,
    minEvents: 40,
    tier: 'silver',
    benefit: 'Access to community tool purchasing pool',
    color: '#9ca3af',
  },
  {
    id: 'funding-pool',
    name: 'Cooperative Funding Pool',
    emoji: '🏦',
    description: 'Neighborhood-managed pool for larger initiatives',
    minScore: 55,
    minEvents: 75,
    tier: 'silver',
    benefit: 'Participate in collective budgeting decisions',
    color: '#9ca3af',
  },
  {
    id: 'insurance-discount',
    name: 'Collective Insurance Discount',
    emoji: '🛡️',
    description: 'Group rates for home/renters insurance through proven community support',
    minScore: 65,
    minEvents: 100,
    tier: 'gold',
    benefit: 'Up to 15% group discount eligibility',
    color: '#f59e0b',
  },
  {
    id: 'impact-grant',
    name: 'Impact Innovation Grant',
    emoji: '🌟',
    description: 'Major funding for model neighborhood programs',
    minScore: 80,
    minEvents: 200,
    tier: 'platinum',
    benefit: 'Up to $5,000 for scalable community innovation',
    color: '#818cf8',
  },
];

/**
 * Compute eligibility for all programs.
 */
export function computeEligibility(score, totalEvents) {
  return COOP_PROGRAMS.map((program) => {
    const scoreEligible = score >= program.minScore;
    const eventsEligible = totalEvents >= program.minEvents;
    const eligible = scoreEligible && eventsEligible;
    const scoreProgress = Math.min(Math.round((score / program.minScore) * 100), 100);
    const eventsProgress = Math.min(Math.round((totalEvents / program.minEvents) * 100), 100);

    return {
      ...program,
      eligible,
      scoreEligible,
      eventsEligible,
      scoreProgress,
      eventsProgress,
      overallProgress: Math.round((scoreProgress + eventsProgress) / 2),
    };
  });
}

/**
 * Get cooperative budget state (contributions, proposals, etc).
 */
export function getCoopBudget(neighborhoodId) {
  const data = _get();
  const hoodData = data[neighborhoodId] || { contributions: [], proposals: [], totalFund: 0 };
  return hoodData;
}

/**
 * Add a contribution to the cooperative fund.
 */
export function addCoopContribution(neighborhoodId, amount, note) {
  const data = _get();
  if (!data[neighborhoodId]) data[neighborhoodId] = { contributions: [], proposals: [], totalFund: 0 };
  const contribution = {
    id: `coop-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    amount,
    note: note || '',
    timestamp: new Date().toISOString(),
  };
  data[neighborhoodId].contributions.push(contribution);
  data[neighborhoodId].totalFund += amount;
  _set(data);
  return data[neighborhoodId];
}

/**
 * Add a proposal for fund usage.
 */
export function addCoopProposal(neighborhoodId, title, amount, description) {
  const data = _get();
  if (!data[neighborhoodId]) data[neighborhoodId] = { contributions: [], proposals: [], totalFund: 0 };
  const proposal = {
    id: `prop-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    title,
    amount,
    description,
    votes: 0,
    status: 'open', // open | approved | completed
    timestamp: new Date().toISOString(),
  };
  data[neighborhoodId].proposals.push(proposal);
  _set(data);
  return data[neighborhoodId];
}

/**
 * Vote on a proposal.
 */
export function voteProposal(neighborhoodId, proposalId) {
  const data = _get();
  if (!data[neighborhoodId]) return null;
  const idx = data[neighborhoodId].proposals.findIndex((p) => p.id === proposalId);
  if (idx !== -1) {
    data[neighborhoodId].proposals[idx].votes++;
    _set(data);
  }
  return data[neighborhoodId];
}

/**
 * Seed demo cooperative data.
 */
export function seedCoopData(neighborhoodId) {
  const data = _get();
  if (data[neighborhoodId]) return;
  data[neighborhoodId] = {
    totalFund: 185,
    contributions: [
      { id: 'coop-d1', amount: 50, note: 'Seed funding', timestamp: new Date(Date.now() - 20 * 86400000).toISOString() },
      { id: 'coop-d2', amount: 75, note: 'Monthly pooling', timestamp: new Date(Date.now() - 10 * 86400000).toISOString() },
      { id: 'coop-d3', amount: 60, note: 'Event proceeds', timestamp: new Date(Date.now() - 5 * 86400000).toISOString() },
    ],
    proposals: [
      { id: 'prop-d1', title: 'Community Tool Shed', amount: 150, description: 'Build a small shared tool shed near the garden', votes: 8, status: 'open', timestamp: new Date(Date.now() - 7 * 86400000).toISOString() },
      { id: 'prop-d2', title: 'Welcome Kits for New Residents', amount: 30, description: 'Small welcome packages with local info and treats', votes: 12, status: 'approved', timestamp: new Date(Date.now() - 15 * 86400000).toISOString() },
    ],
  };
  _set(data);
}
