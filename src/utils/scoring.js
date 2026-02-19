import { startOfDay, subDays, differenceInDays, parseISO } from 'date-fns';

/**
 * Compute the Reciprocity Density Score (0–100) for a micro-neighborhood.
 *
 * Formula:
 *   base = (events in last 7 days) / target_per_week  => clamp 0–1
 *   diversity = unique categories used / total categories => 0–1
 *   consistency = days with at least 1 event in last 14 / 14 => 0–1
 *   score = round((0.45 * base + 0.30 * diversity + 0.25 * consistency) * 100)
 *
 * The target_per_week scales with rough neighborhood size (~20 households = 10 events/week feels healthy).
 */
const TARGET_PER_WEEK = 10;
const TOTAL_CATEGORIES = 12;

export function computeScore(events, neighborhoodId) {
  const now = new Date();
  const hood = events.filter((e) => e.neighborhood === neighborhoodId);

  // Last 7 days
  const last7 = hood.filter((e) => differenceInDays(now, parseISO(e.timestamp)) < 7);
  const base = Math.min(last7.length / TARGET_PER_WEEK, 1);

  // Category diversity in last 14 days
  const last14 = hood.filter((e) => differenceInDays(now, parseISO(e.timestamp)) < 14);
  const uniqueCats = new Set(last14.map((e) => e.category));
  const diversity = uniqueCats.size / TOTAL_CATEGORIES;

  // Consistency: days with events in last 14
  const dayBuckets = new Set();
  last14.forEach((e) => {
    dayBuckets.add(startOfDay(parseISO(e.timestamp)).toISOString());
  });
  const consistency = dayBuckets.size / 14;

  const score = Math.round((0.45 * base + 0.3 * diversity + 0.25 * consistency) * 100);
  return Math.min(100, Math.max(0, score));
}

/**
 * Compute daily event counts for the last N days.
 * Returns [{ date, count }] sorted ascending.
 */
export function dailyCounts(events, neighborhoodId, days = 30) {
  const now = new Date();
  const hood = events.filter((e) => e.neighborhood === neighborhoodId);
  const buckets = {};

  for (let i = days - 1; i >= 0; i--) {
    const d = startOfDay(subDays(now, i)).toISOString().slice(0, 10);
    buckets[d] = 0;
  }

  hood.forEach((e) => {
    const d = parseISO(e.timestamp).toISOString().slice(0, 10);
    if (d in buckets) buckets[d]++;
  });

  return Object.entries(buckets)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, count]) => ({ date, count }));
}

/**
 * Category breakdown for last 14 days.
 * Returns [{ category, count }] sorted descending.
 */
export function categoryBreakdown(events, neighborhoodId) {
  const now = new Date();
  const last14 = events.filter(
    (e) => e.neighborhood === neighborhoodId && differenceInDays(now, parseISO(e.timestamp)) < 14
  );
  const map = {};
  last14.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + 1;
  });
  return Object.entries(map)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Trend direction: compare last 7 days to previous 7 days.
 * Returns 'up' | 'down' | 'stable'
 */
export function trend(events, neighborhoodId) {
  const now = new Date();
  const hood = events.filter((e) => e.neighborhood === neighborhoodId);

  const thisWeek = hood.filter((e) => {
    const d = differenceInDays(now, parseISO(e.timestamp));
    return d >= 0 && d < 7;
  }).length;

  const lastWeek = hood.filter((e) => {
    const d = differenceInDays(now, parseISO(e.timestamp));
    return d >= 7 && d < 14;
  }).length;

  if (thisWeek > lastWeek + 1) return 'up';
  if (thisWeek < lastWeek - 1) return 'down';
  return 'stable';
}

/**
 * Score health label.
 */
export function scoreLabel(score) {
  if (score >= 70) return { label: 'Thriving', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  if (score >= 40) return { label: 'Growing', color: 'text-amber-600', bg: 'bg-amber-50' };
  return { label: 'Needs Attention', color: 'text-rose-600', bg: 'bg-rose-50' };
}
