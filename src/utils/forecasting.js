/**
 * Reciprocity Health Forecasting Engine
 *
 * Time-series modeling that estimates future reciprocity strength.
 * Forecasts shown ONLY to the neighborhood — power stays local.
 *
 * Uses simple linear regression + exponential smoothing for projections.
 */

import { parseISO, differenceInDays, subDays, format, startOfDay } from 'date-fns';

/**
 * Compute weekly event counts for the last N weeks.
 */
function weeklyVolumes(events, neighborhoodId, weeks = 12) {
  const hood = events.filter((e) => e.neighborhood === neighborhoodId);
  const now = new Date();
  const volumes = [];

  for (let w = weeks - 1; w >= 0; w--) {
    const end = subDays(now, w * 7);
    const start = subDays(end, 7);
    const count = hood.filter((e) => {
      const d = parseISO(e.timestamp);
      return d >= start && d < end;
    }).length;
    volumes.push({ week: weeks - w, label: `W-${w}`, count });
  }
  return volumes;
}

/**
 * Simple linear regression on weekly volumes.
 * Returns slope, intercept, r-squared.
 */
function linearRegression(volumes) {
  const n = volumes.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 };

  const xs = volumes.map((_, i) => i);
  const ys = volumes.map((v) => v.count);
  const xMean = xs.reduce((s, v) => s + v, 0) / n;
  const yMean = ys.reduce((s, v) => s + v, 0) / n;

  let ssXY = 0, ssXX = 0, ssTot = 0, ssRes = 0;
  for (let i = 0; i < n; i++) {
    ssXY += (xs[i] - xMean) * (ys[i] - yMean);
    ssXX += (xs[i] - xMean) ** 2;
    ssTot += (ys[i] - yMean) ** 2;
  }

  const slope = ssXX > 0 ? ssXY / ssXX : 0;
  const intercept = yMean - slope * xMean;

  for (let i = 0; i < n; i++) {
    const predicted = slope * xs[i] + intercept;
    ssRes += (ys[i] - predicted) ** 2;
  }

  const r2 = ssTot > 0 ? +(1 - ssRes / ssTot).toFixed(3) : 0;
  return { slope: +slope.toFixed(3), intercept: +intercept.toFixed(3), r2 };
}

/**
 * Exponential moving average (smoothing factor alpha).
 */
function ema(values, alpha = 0.3) {
  if (values.length === 0) return [];
  const result = [values[0]];
  for (let i = 1; i < values.length; i++) {
    result.push(+(alpha * values[i] + (1 - alpha) * result[i - 1]).toFixed(2));
  }
  return result;
}

/**
 * Forecast reciprocity strength for the next N weeks.
 */
export function forecastReciprocity(events, neighborhoodId, forecastWeeks = 12) {
  const historical = weeklyVolumes(events, neighborhoodId, 12);
  const reg = linearRegression(historical);
  const smoothed = ema(historical.map((v) => v.count));

  // Project forward
  const projections = [];
  const lastWeekNum = historical.length;
  for (let fw = 1; fw <= forecastWeeks; fw++) {
    const linearProjection = Math.max(0, Math.round(reg.slope * (lastWeekNum + fw - 1) + reg.intercept));
    // Blend linear with EMA trend
    const emaLast = smoothed[smoothed.length - 1] || 0;
    const emaTrend = smoothed.length >= 2 ? smoothed[smoothed.length - 1] - smoothed[smoothed.length - 2] : 0;
    const emaProjection = Math.max(0, Math.round(emaLast + emaTrend * fw));
    const blended = Math.round(linearProjection * 0.6 + emaProjection * 0.4);

    projections.push({
      week: lastWeekNum + fw,
      label: `+${fw}w`,
      projected: blended,
      linearProjection,
      emaProjection,
      confidence: Math.max(0, Math.round((1 - fw * 0.06) * 100)), // decreasing confidence
    });
  }

  // Compute overall direction
  const currentRate = historical.length > 0 ? historical[historical.length - 1].count : 0;
  const projectedRate = projections.length > 0 ? projections[projections.length - 1].projected : currentRate;
  const percentChange = currentRate > 0 ? Math.round((projectedRate - currentRate) / currentRate * 100) : 0;

  return {
    historical,
    smoothed: historical.map((v, i) => ({ ...v, smoothed: smoothed[i] })),
    projections,
    regression: reg,
    currentRate,
    projectedRate,
    percentChange,
    trendDirection: percentChange > 5 ? 'growing' : percentChange < -5 ? 'declining' : 'stable',
    summary: _generateSummary(percentChange, reg, forecastWeeks),
  };
}

function _generateSummary(percentChange, reg, weeks) {
  if (percentChange > 20) {
    return `If current trends continue, reciprocity events will increase by ~${percentChange}% over the next ${weeks} weeks. Great momentum!`;
  } else if (percentChange > 5) {
    return `Modest growth projected: ~${percentChange}% increase over ${weeks} weeks. Keep organizing communal events.`;
  } else if (percentChange > -5) {
    return `Participation is projected to remain stable over the next ${weeks} weeks. Stability is strength.`;
  } else if (percentChange > -20) {
    return `Reciprocity strength may drop ~${Math.abs(percentChange)}% in ${weeks} weeks. Consider a community gathering to re-energize.`;
  } else {
    return `Warning: If current trends persist, reciprocity could decline ${Math.abs(percentChange)}% in ${weeks} weeks. Immediate community action recommended.`;
  }
}

/**
 * Compute health score projection.
 */
export function projectHealthScore(events, neighborhoodId) {
  const forecast = forecastReciprocity(events, neighborhoodId, 12);
  const { projections, currentRate } = forecast;

  // Estimate score impact
  const TARGET_PER_WEEK = 10;
  const currentScore = Math.min(Math.round((currentRate / TARGET_PER_WEEK) * 45), 45);
  const projectedScore = projections.length > 0
    ? Math.min(Math.round((projections[projections.length - 1].projected / TARGET_PER_WEEK) * 45), 45)
    : currentScore;

  return {
    ...forecast,
    currentScore,
    projectedScore,
    scoreChange: projectedScore - currentScore,
  };
}
