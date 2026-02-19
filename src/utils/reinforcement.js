/**
 * Behavioral Reinforcement Design Engine
 *
 * Gentle collective milestones, streaks, first-timer recognition, gratitude spotlights.
 * NOT competitive gamification — designed to increase participation without turning into points.
 */

import { parseISO, differenceInDays, startOfDay, format, subDays } from 'date-fns';

/**
 * Compute collective milestones for the neighborhood.
 */
export function computeMilestones(events, neighborhoodId) {
  const hood = events.filter((e) => e.neighborhood === neighborhoodId);
  const now = new Date();
  const thisMonth = hood.filter((e) => differenceInDays(now, parseISO(e.timestamp)) < 30);

  const milestones = [
    { target: 10, label: 'First 10 Acts', emoji: '🌱', description: 'Your community\'s first 10 acts of reciprocity' },
    { target: 25, label: '25 Helping Hands', emoji: '🤲', description: '25 acts of neighbors helping neighbors' },
    { target: 50, label: 'Half Century', emoji: '🌿', description: '50 exchanges — community is growing!' },
    { target: 100, label: 'Centurion', emoji: '🌳', description: '100 reciprocity events — remarkable!' },
    { target: 250, label: 'Quarter Thousand', emoji: '🏘️', description: '250 acts of mutual support' },
    { target: 500, label: 'Community Strong', emoji: '💪', description: '500 events! Truly resilient' },
    { target: 1000, label: 'Thousand Acts', emoji: '🌟', description: '1,000 reciprocity events. Legendary!' },
  ];

  return milestones.map((m) => ({
    ...m,
    reached: hood.length >= m.target,
    current: hood.length,
    progress: Math.min(+(hood.length / m.target * 100).toFixed(0), 100),
    monthlyProgress: thisMonth.length,
  }));
}

/**
 * Compute the current reciprocity streak for the neighborhood.
 * A streak = consecutive days with at least 1 event.
 */
export function computeStreak(events, neighborhoodId) {
  const hood = events.filter((e) => e.neighborhood === neighborhoodId);
  const now = startOfDay(new Date());

  let streak = 0;
  let day = now;

  for (let i = 0; i < 365; i++) {
    const dayStr = format(day, 'yyyy-MM-dd');
    const hasEvent = hood.some((e) => e.timestamp.startsWith(dayStr));
    if (hasEvent) {
      streak++;
      day = subDays(day, 1);
    } else {
      break;
    }
  }

  // Best streak ever
  const allDays = new Set(hood.map((e) => format(parseISO(e.timestamp), 'yyyy-MM-dd')));
  const sortedDays = Array.from(allDays).sort();
  let bestStreak = 0;
  let currentRun = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const diff = differenceInDays(parseISO(sortedDays[i]), parseISO(sortedDays[i - 1]));
    if (diff === 1) {
      currentRun++;
    } else {
      bestStreak = Math.max(bestStreak, currentRun);
      currentRun = 1;
    }
  }
  bestStreak = Math.max(bestStreak, currentRun);

  const streakEmoji = streak >= 30 ? '🔥' : streak >= 14 ? '⚡' : streak >= 7 ? '✨' : streak >= 3 ? '💫' : '🌱';

  return {
    current: streak,
    best: bestStreak,
    emoji: streakEmoji,
    label: streak >= 30 ? 'Legendary' : streak >= 14 ? 'On Fire' : streak >= 7 ? 'Rolling' : streak >= 3 ? 'Building' : streak >= 1 ? 'Started' : 'Begin Today',
  };
}

/**
 * Identify first-time helpers in recent events.
 */
export function identifyFirstTimers(events, neighborhoodId) {
  const hood = events.filter((e) => e.neighborhood === neighborhoodId);
  const now = new Date();
  const last7 = hood.filter((e) => differenceInDays(now, parseISO(e.timestamp)) < 7);
  const before7 = hood.filter((e) => differenceInDays(now, parseISO(e.timestamp)) >= 7);

  // Events from last 7 days whose category wasn't seen before
  const previousCategories = new Set(before7.map((e) => e.category));
  const newCategoryEvents = last7.filter((e) => !previousCategories.has(e.category));

  return {
    newCategoryCount: newCategoryEvents.length,
    totalRecentEvents: last7.length,
    newCategories: Array.from(new Set(newCategoryEvents.map((e) => e.category))),
  };
}

/**
 * Generate rotating gratitude spotlight.
 */
export function getGratitudeSpotlight(gratitude, neighborhoodId) {
  const hood = gratitude.filter((g) => g.neighborhood === neighborhoodId);
  if (hood.length === 0) return null;

  // Rotate daily based on date
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % hood.length;
  const sortedByHearts = [...hood].sort((a, b) => (b.hearts || 0) - (a.hearts || 0));
  const spotlight = sortedByHearts[index % sortedByHearts.length];

  return {
    ...spotlight,
    isSpotlight: true,
  };
}

/**
 * Compute full reinforcement report.
 */
export function computeReinforcementReport(events, gratitude, neighborhoodId) {
  return {
    milestones: computeMilestones(events, neighborhoodId),
    streak: computeStreak(events, neighborhoodId),
    firstTimers: identifyFirstTimers(events, neighborhoodId),
    spotlight: getGratitudeSpotlight(gratitude, neighborhoodId),
  };
}
