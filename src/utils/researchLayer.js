/**
 * Long-Term Urban Research Layer (Opt-In Only)
 *
 * If communities consent, anonymized trend data can:
 * - Help urban planners identify social isolation zones
 * - Inform public space design
 * - Guide community investment
 *
 * All participation is voluntary, decentralized, and privacy-first.
 */

const STORAGE_KEY = 'nrn_research_consent';
const EXPORT_KEY = 'nrn_research_exports';

function _get(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}
function _set(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

/**
 * Consent categories that can be individually toggled.
 */
export const CONSENT_CATEGORIES = [
  {
    id: 'aggregate-trends',
    label: 'Aggregate Activity Trends',
    description: 'Share total event counts and category distribution (no individual data)',
    icon: '📊',
    dataShared: 'Weekly event totals, category percentages',
  },
  {
    id: 'isolation-mapping',
    label: 'Social Isolation Indicators',
    description: 'Help identify areas that may need more community investment',
    icon: '🗺️',
    dataShared: 'Anonymous neighborhood-level engagement scores',
  },
  {
    id: 'public-space',
    label: 'Public Space Usage Patterns',
    description: 'Inform where community spaces would have most impact',
    icon: '🏗️',
    dataShared: 'Event type frequencies, time-of-day patterns',
  },
  {
    id: 'investment-signals',
    label: 'Community Investment Signals',
    description: 'Help direct resources to neighborhoods that need them',
    icon: '💡',
    dataShared: 'Reciprocity density scores, trend directions',
  },
];

/**
 * Get consent state for a neighborhood.
 */
export function getResearchConsent(neighborhoodId) {
  const data = _get(STORAGE_KEY);
  return data[neighborhoodId] || {
    enabled: false,
    categories: {},
    consentDate: null,
    lastExport: null,
  };
}

/**
 * Toggle overall research participation.
 */
export function toggleResearchConsent(neighborhoodId) {
  const data = _get(STORAGE_KEY);
  const current = data[neighborhoodId] || { enabled: false, categories: {}, consentDate: null, lastExport: null };
  current.enabled = !current.enabled;
  current.consentDate = current.enabled ? new Date().toISOString() : null;
  if (!current.enabled) current.categories = {}; // revoke all
  data[neighborhoodId] = current;
  _set(STORAGE_KEY, data);
  return current;
}

/**
 * Toggle a specific consent category.
 */
export function toggleConsentCategory(neighborhoodId, categoryId) {
  const data = _get(STORAGE_KEY);
  const current = data[neighborhoodId] || { enabled: true, categories: {}, consentDate: new Date().toISOString(), lastExport: null };
  current.categories[categoryId] = !current.categories[categoryId];
  if (!current.enabled) current.enabled = true;
  data[neighborhoodId] = current;
  _set(STORAGE_KEY, data);
  return current;
}

/**
 * Generate an anonymized data export based on consent.
 */
export function generateResearchExport(neighborhoodId, events, score, trendDir) {
  const consent = getResearchConsent(neighborhoodId);
  if (!consent.enabled) return null;

  const hoodEvents = events.filter((e) => e.neighborhood === neighborhoodId);
  const exportData = {
    exportId: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    timestamp: new Date().toISOString(),
    neighborhoodHash: _hashNeighborhood(neighborhoodId), // anonymized
    datasets: [],
  };

  if (consent.categories['aggregate-trends']) {
    const catCounts = {};
    hoodEvents.forEach((e) => { catCounts[e.category] = (catCounts[e.category] || 0) + 1; });
    exportData.datasets.push({
      type: 'aggregate-trends',
      totalEvents: hoodEvents.length,
      categoryDistribution: catCounts,
      period: 'all-time',
    });
  }

  if (consent.categories['isolation-mapping']) {
    exportData.datasets.push({
      type: 'isolation-mapping',
      engagementScore: score,
      trend: trendDir,
    });
  }

  if (consent.categories['public-space']) {
    const hourDist = new Array(24).fill(0);
    hoodEvents.forEach((e) => {
      try { hourDist[new Date(e.timestamp).getHours()]++; } catch {}
    });
    const typeCounts = {};
    hoodEvents.forEach((e) => { typeCounts[e.category] = (typeCounts[e.category] || 0) + 1; });
    exportData.datasets.push({
      type: 'public-space',
      hourDistribution: hourDist,
      eventTypes: typeCounts,
    });
  }

  if (consent.categories['investment-signals']) {
    exportData.datasets.push({
      type: 'investment-signals',
      reciprocityDensity: score,
      trendDirection: trendDir,
      totalEvents: hoodEvents.length,
    });
  }

  // Store export record
  const exports = _get(EXPORT_KEY);
  if (!exports[neighborhoodId]) exports[neighborhoodId] = [];
  exports[neighborhoodId].push({
    id: exportData.exportId,
    timestamp: exportData.timestamp,
    datasetCount: exportData.datasets.length,
  });
  _set(EXPORT_KEY, exports);

  // Update last export date
  const consentData = _get(STORAGE_KEY);
  if (consentData[neighborhoodId]) {
    consentData[neighborhoodId].lastExport = exportData.timestamp;
    _set(STORAGE_KEY, consentData);
  }

  return exportData;
}

/**
 * Get export history.
 */
export function getExportHistory(neighborhoodId) {
  const exports = _get(EXPORT_KEY);
  return exports[neighborhoodId] || [];
}

function _hashNeighborhood(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return 'hood_' + Math.abs(h).toString(16).padStart(8, '0');
}
