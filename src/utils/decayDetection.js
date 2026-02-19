/**
 * Reciprocity Decay Detection Engine
 *
 * Models reciprocity decay curves to detect:
 * - Declining participation velocity
 * - Drop in cross-household exchanges
 * - Increasing reciprocity centralization
 * - Seasonal fluctuation patterns
 *
 * Enables early intervention BEFORE visible collapse.
 */

import { parseISO, differenceInDays, subDays, startOfDay, format, getMonth } from 'date-fns';

/**
 * Compute participation velocity (events per day) over rolling windows.
 * Returns array of { date, velocity, trend } for each week.
 */
export function computeParticipationVelocity(events, neighborhoodId, weeks = 8) {
  const hood = events.filter((e) => e.neighborhood === neighborhoodId);
  const now = new Date();
  const windows = [];

  for (let w = weeks - 1; w >= 0; w--) {
    const windowEnd = subDays(now, w * 7);
    const windowStart = subDays(windowEnd, 7);
    const windowEvents = hood.filter((e) => {
      const d = parseISO(e.timestamp);
      return d >= windowStart && d < windowEnd;
    });
    windows.push({
      weekLabel: `W-${w}`,
      startDate: format(windowStart, 'MMM d'),
      velocity: +(windowEvents.length / 7).toFixed(2),
      eventCount: windowEvents.length,
    });
  }

  // Compute trend for each window
  for (let i = 1; i < windows.length; i++) {
    const prev = windows[i - 1].velocity;
    const curr = windows[i].velocity;
    windows[i].trend = curr > prev ? 'up' : curr < prev ? 'down' : 'stable';
  }
  if (windows.length > 0) windows[0].trend = 'stable';

  return windows;
}

/**
 * Detect decay pattern — is reciprocity declining?
 * Returns { isDecaying, decayRate, consecutiveDeclines, alert }
 */
export function detectDecayPattern(events, neighborhoodId) {
  const velocity = computeParticipationVelocity(events, neighborhoodId, 6);
  if (velocity.length < 3) return { isDecaying: false, decayRate: 0, consecutiveDeclines: 0, alert: null };

  // Count consecutive declining weeks from most recent
  let consecutiveDeclines = 0;
  for (let i = velocity.length - 1; i >= 1; i--) {
    if (velocity[i].velocity < velocity[i - 1].velocity) {
      consecutiveDeclines++;
    } else {
      break;
    }
  }

  // Compute decay rate: compare most recent to peak
  const recentVelocity = velocity[velocity.length - 1].velocity;
  const peakVelocity = Math.max(...velocity.map((v) => v.velocity));
  const decayRate = peakVelocity > 0 ? +((1 - recentVelocity / peakVelocity) * 100).toFixed(1) : 0;

  const isDecaying = consecutiveDeclines >= 2 && decayRate > 20;

  let alert = null;
  if (consecutiveDeclines >= 3 && decayRate > 40) {
    alert = { level: 'critical', message: `Reciprocity has declined ${decayRate}% from peak. Immediate community action recommended.` };
  } else if (consecutiveDeclines >= 2 && decayRate > 20) {
    alert = { level: 'warning', message: `Participation velocity dropping for ${consecutiveDeclines} consecutive weeks. Consider organizing a community event.` };
  } else if (consecutiveDeclines >= 1 && decayRate > 10) {
    alert = { level: 'info', message: `Slight decline detected. This may be seasonal — keep an eye on it.` };
  }

  return { isDecaying, decayRate, consecutiveDeclines, alert, velocity };
}

/**
 * Compute category centralization — are interactions becoming less diverse?
 */
export function computeCategoryCentralization(events, neighborhoodId) {
  const hood = events.filter((e) => e.neighborhood === neighborhoodId);
  const now = new Date();

  // Recent 2 weeks vs previous 2 weeks
  const recent = hood.filter((e) => differenceInDays(now, parseISO(e.timestamp)) < 14);
  const previous = hood.filter((e) => {
    const d = differenceInDays(now, parseISO(e.timestamp));
    return d >= 14 && d < 28;
  });

  const recentCats = new Set(recent.map((e) => e.category)).size;
  const previousCats = new Set(previous.map((e) => e.category)).size;

  const centralizing = recentCats < previousCats && recentCats > 0;
  const diversityChange = previousCats > 0 ? +((recentCats - previousCats) / previousCats * 100).toFixed(0) : 0;

  return {
    recentDiversity: recentCats,
    previousDiversity: previousCats,
    centralizing,
    diversityChange,
  };
}

/**
 * Detect seasonal patterns by analyzing monthly event volumes.
 */
export function detectSeasonalPatterns(events, neighborhoodId) {
  const hood = events.filter((e) => e.neighborhood === neighborhoodId);
  const monthCounts = new Array(12).fill(0);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  hood.forEach((e) => {
    const month = getMonth(parseISO(e.timestamp));
    monthCounts[month]++;
  });

  const avg = monthCounts.reduce((s, v) => s + v, 0) / 12;
  const peaks = monthCounts
    .map((count, i) => ({ month: monthNames[i], count, deviation: avg > 0 ? +((count - avg) / avg * 100).toFixed(0) : 0 }))
    .filter((m) => m.count > avg * 1.2);

  const troughs = monthCounts
    .map((count, i) => ({ month: monthNames[i], count, deviation: avg > 0 ? +((count - avg) / avg * 100).toFixed(0) : 0 }))
    .filter((m) => m.count > 0 && m.count < avg * 0.8);

  return {
    monthly: monthCounts.map((count, i) => ({ month: monthNames[i], count })),
    peaks,
    troughs,
    hasSeasonalPattern: peaks.length > 0 || troughs.length > 0,
  };
}

/**
 * Compute full decay report.
 */
export function computeDecayReport(events, neighborhoodId) {
  const decay = detectDecayPattern(events, neighborhoodId);
  const centralization = computeCategoryCentralization(events, neighborhoodId);
  const seasonal = detectSeasonalPatterns(events, neighborhoodId);

  // Projected reciprocity in 3 months based on current velocity trend
  let projectedChange = 0;
  if (decay.velocity && decay.velocity.length >= 3) {
    const recent = decay.velocity.slice(-3);
    const avgDecline = recent.reduce((s, v, i) => {
      if (i === 0) return s;
      return s + (v.velocity - recent[i - 1].velocity);
    }, 0) / (recent.length - 1);
    projectedChange = Math.round(avgDecline * 12 / (decay.velocity[decay.velocity.length - 1].velocity || 1) * 100);
  }

  return {
    ...decay,
    centralization,
    seasonal,
    projectedChange, // percentage change in 3 months
    projectedLabel: projectedChange > 10 ? 'Growing' : projectedChange > -10 ? 'Stable' : projectedChange > -30 ? 'Declining' : 'Critical Decline',
  };
}
