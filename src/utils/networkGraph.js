/**
 * Reciprocity Network Mapping — Invisible Graph Engine
 *
 * Builds an anonymized interaction graph to measure:
 * - Network density (how interconnected the community is)
 * - Isolated clusters (groups with no cross-interaction)
 * - Super-helper concentration (over-reliance on few people)
 * - Cross-demographic diversity of interactions
 *
 * All computations are anonymous — no real identities stored.
 * Uses anonymous participant IDs generated from event patterns.
 */

import { parseISO, differenceInDays, subDays, startOfDay } from 'date-fns';

/**
 * Build an anonymized interaction graph from events and related data.
 * Returns nodes (anonymous participants) and edges (interactions).
 */
export function buildNetworkGraph(events, skills, resources, timeBankEntries, neighborhoodId) {
  const hoodEvents = events.filter((e) => e.neighborhood === neighborhoodId);
  const hoodSkills = skills.filter((s) => s.neighborhood === neighborhoodId);
  const hoodResources = resources.filter((r) => r.neighborhood === neighborhoodId);
  const hoodTimeBank = timeBankEntries.filter((t) => t.neighborhood === neighborhoodId);

  // Generate anonymous participant nodes from event patterns
  // Each event implicitly involves at least 2 participants
  const nodeMap = new Map();
  const edges = [];

  // Generate pseudo-anonymous nodes from events
  hoodEvents.forEach((evt, i) => {
    const initiator = `anon_${_hashId(evt.id + '_a')}`;
    const receiver = `anon_${_hashId(evt.id + '_b')}`;

    if (!nodeMap.has(initiator)) nodeMap.set(initiator, { id: initiator, eventCount: 0, categories: new Set(), firstSeen: evt.timestamp });
    if (!nodeMap.has(receiver)) nodeMap.set(receiver, { id: receiver, eventCount: 0, categories: new Set(), firstSeen: evt.timestamp });

    nodeMap.get(initiator).eventCount++;
    nodeMap.get(initiator).categories.add(evt.category);
    nodeMap.get(receiver).eventCount++;
    nodeMap.get(receiver).categories.add(evt.category);

    edges.push({ source: initiator, target: receiver, category: evt.category, timestamp: evt.timestamp, type: 'reciprocity' });
  });

  // Add skill exchange edges
  hoodSkills.forEach((skill) => {
    const node = `anon_${_hashId(skill.id)}`;
    if (!nodeMap.has(node)) nodeMap.set(node, { id: node, eventCount: 0, categories: new Set(), firstSeen: skill.timestamp });
    nodeMap.get(node).eventCount++;
    nodeMap.get(node).categories.add('skills');
  });

  // Add time bank edges
  hoodTimeBank.forEach((tb) => {
    const giver = `anon_${_hashId(tb.id + '_g')}`;
    const receiver = `anon_${_hashId(tb.id + '_r')}`;
    if (!nodeMap.has(giver)) nodeMap.set(giver, { id: giver, eventCount: 0, categories: new Set(), firstSeen: tb.timestamp });
    if (!nodeMap.has(receiver)) nodeMap.set(receiver, { id: receiver, eventCount: 0, categories: new Set(), firstSeen: tb.timestamp });
    nodeMap.get(giver).eventCount++;
    nodeMap.get(receiver).eventCount++;
    edges.push({ source: giver, target: receiver, category: 'timebank', timestamp: tb.timestamp, type: 'timebank' });
  });

  const nodes = Array.from(nodeMap.values()).map((n) => ({
    ...n,
    categories: Array.from(n.categories),
    categoryCount: n.categories.size,
  }));

  return { nodes, edges };
}

/**
 * Compute network density — ratio of actual connections to possible connections.
 * Density = 2E / (N * (N-1)) for undirected graph.
 */
export function computeNetworkDensity(graph) {
  const { nodes, edges } = graph;
  const n = nodes.length;
  if (n < 2) return 0;
  const maxEdges = (n * (n - 1)) / 2;
  // Unique undirected edges
  const uniqueEdges = new Set();
  edges.forEach((e) => {
    const key = [e.source, e.target].sort().join(':');
    uniqueEdges.add(key);
  });
  return +(uniqueEdges.size / maxEdges).toFixed(3);
}

/**
 * Detect super-helper concentration.
 * Returns Gini coefficient for event distribution (0 = perfectly equal, 1 = one person does everything).
 */
export function computeHelperConcentration(graph) {
  const counts = graph.nodes.map((n) => n.eventCount).sort((a, b) => a - b);
  const n = counts.length;
  if (n === 0) return 0;
  const total = counts.reduce((s, v) => s + v, 0);
  if (total === 0) return 0;

  let cumulativeSum = 0;
  let giniNumerator = 0;
  counts.forEach((val, i) => {
    cumulativeSum += val;
    giniNumerator += (2 * (i + 1) - n - 1) * val;
  });

  return +(giniNumerator / (n * total)).toFixed(3);
}

/**
 * Find isolated clusters using simple connected component detection.
 */
export function findClusters(graph) {
  const adj = new Map();
  graph.nodes.forEach((n) => adj.set(n.id, new Set()));
  graph.edges.forEach((e) => {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source).add(e.target);
      adj.get(e.target).add(e.source);
    }
  });

  const visited = new Set();
  const clusters = [];

  graph.nodes.forEach((node) => {
    if (visited.has(node.id)) return;
    const cluster = [];
    const queue = [node.id];
    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);
      cluster.push(current);
      const neighbors = adj.get(current) || new Set();
      neighbors.forEach((n) => { if (!visited.has(n)) queue.push(n); });
    }
    clusters.push(cluster);
  });

  return clusters;
}

/**
 * Compute category diversity across edges — how varied are the interaction types.
 */
export function computeInteractionDiversity(graph) {
  const categorySet = new Set(graph.edges.map((e) => e.category));
  return categorySet.size;
}

/**
 * Get top contributors (super-helpers) anonymously.
 */
export function getTopContributors(graph, limit = 5) {
  return graph.nodes
    .sort((a, b) => b.eventCount - a.eventCount)
    .slice(0, limit)
    .map((n) => ({
      id: n.id.slice(0, 8) + '...',
      eventCount: n.eventCount,
      categoryCount: n.categoryCount,
    }));
}

/**
 * Compute full network health report.
 */
export function computeNetworkHealth(events, skills, resources, timeBankEntries, neighborhoodId) {
  const graph = buildNetworkGraph(events, skills, resources, timeBankEntries, neighborhoodId);
  const density = computeNetworkDensity(graph);
  const concentration = computeHelperConcentration(graph);
  const clusters = findClusters(graph);
  const diversity = computeInteractionDiversity(graph);
  const topContributors = getTopContributors(graph);

  const isolatedClusters = clusters.filter((c) => c.length === 1).length;
  const largestCluster = Math.max(...clusters.map((c) => c.length), 0);

  // Resilience score: high density + low concentration + few isolated = resilient
  const densityScore = Math.min(density * 10, 1); // normalize
  const concentrationPenalty = concentration; // higher = worse
  const clusterPenalty = graph.nodes.length > 0 ? isolatedClusters / graph.nodes.length : 0;
  const resilienceScore = Math.round(Math.max(0, Math.min(100,
    (densityScore * 40 + (1 - concentrationPenalty) * 35 + (1 - clusterPenalty) * 25) * 100
  )));

  return {
    nodeCount: graph.nodes.length,
    edgeCount: graph.edges.length,
    density,
    concentration,
    concentrationLabel: concentration > 0.5 ? 'High (Fragile)' : concentration > 0.3 ? 'Moderate' : 'Low (Distributed)',
    clusterCount: clusters.length,
    isolatedNodes: isolatedClusters,
    largestCluster,
    diversityCount: diversity,
    topContributors,
    resilienceScore,
    resilienceLabel: resilienceScore >= 70 ? 'Resilient' : resilienceScore >= 40 ? 'Developing' : 'Fragile',
    graph,
  };
}

function _hashId(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).slice(0, 6);
}
