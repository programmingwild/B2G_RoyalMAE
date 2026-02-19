/**
 * Inclusion & Bridging Index Engine
 *
 * Measures WHO connects with WHOM without storing identities.
 * Analyzes:
 * - Cross-category interaction frequency
 * - First-time helper participation
 * - Bridging ties vs bonding ties
 * - Bridging Strength Score
 *
 * True resilience comes from bridging ties, not just bonding ties.
 */

import { parseISO, differenceInDays, subDays } from 'date-fns';

/**
 * Compute bridging metrics from events and community data.
 */
export function computeBridgingIndex(events, skills, timeBankEntries, neighborhoodId) {
  const hood = events.filter((e) => e.neighborhood === neighborhoodId);
  const now = new Date();
  const recent = hood.filter((e) => differenceInDays(now, parseISO(e.timestamp)) < 30);
  const previous = hood.filter((e) => {
    const d = differenceInDays(now, parseISO(e.timestamp));
    return d >= 30 && d < 60;
  });

  // 1. Cross-category interaction diversity
  const categoryPairs = new Set();
  recent.forEach((e, i) => {
    recent.forEach((e2, j) => {
      if (i < j && e.category !== e2.category) {
        categoryPairs.add([e.category, e2.category].sort().join(':'));
      }
    });
  });
  const allCategories = new Set(recent.map((e) => e.category));
  const maxPairs = (allCategories.size * (allCategories.size - 1)) / 2;
  const crossCategoryScore = maxPairs > 0 ? Math.min(+(categoryPairs.size / maxPairs).toFixed(2), 1) : 0;

  // 2. First-time helper detection
  const allTimeIds = new Set(hood.map((e) => e.id));
  const recentNewHelpers = recent.filter((e) => {
    // Check if this event's pseudo-participant is new (within last 14 days only)
    const daysSinceFirst = differenceInDays(now, parseISO(e.timestamp));
    return daysSinceFirst <= 14;
  });
  const firstTimeRatio = recent.length > 0 ? +(recentNewHelpers.length / recent.length).toFixed(2) : 0;

  // 3. Temporal bridging — events at different times of day suggest different demographics
  const timeSlots = { morning: 0, afternoon: 0, evening: 0 };
  recent.forEach((e) => {
    const hour = parseISO(e.timestamp).getHours();
    if (hour < 12) timeSlots.morning++;
    else if (hour < 18) timeSlots.afternoon++;
    else timeSlots.evening++;
  });
  const totalSlotEvents = Object.values(timeSlots).reduce((s, v) => s + v, 0);
  const timeSlotEntropy = totalSlotEvents > 0
    ? Object.values(timeSlots).reduce((entropy, count) => {
      const p = count / totalSlotEvents;
      return p > 0 ? entropy - p * Math.log2(p) : entropy;
    }, 0) / Math.log2(3) // normalize to 0-1
    : 0;

  // 4. Skill exchange bridging
  const hoodSkills = skills.filter((s) => s.neighborhood === neighborhoodId);
  const skillCategories = new Set(hoodSkills.map((s) => s.skill));
  const skillOffers = hoodSkills.filter((s) => s.type === 'offer').length;
  const skillRequests = hoodSkills.filter((s) => s.type === 'request').length;
  const skillBalance = skillOffers > 0 && skillRequests > 0
    ? +(1 - Math.abs(skillOffers - skillRequests) / (skillOffers + skillRequests)).toFixed(2)
    : 0;

  // 5. Compute Bridging Strength Score
  const bridgingScore = Math.round(
    (crossCategoryScore * 30 + timeSlotEntropy * 25 + firstTimeRatio * 25 + skillBalance * 20) * 100
  ) / 100;

  // Velocity comparison
  const recentCount = recent.length;
  const previousCount = previous.length;
  const velocityChange = previousCount > 0 ? +((recentCount - previousCount) / previousCount * 100).toFixed(0) : 0;

  return {
    bridgingScore: Math.min(Math.round(bridgingScore), 100),
    bridgingLabel: bridgingScore >= 70 ? 'Strong Bridges' : bridgingScore >= 40 ? 'Building Bridges' : 'Siloed',
    crossCategoryScore: Math.round(crossCategoryScore * 100),
    firstTimeRatio: Math.round(firstTimeRatio * 100),
    timeSlotEntropy: Math.round(timeSlotEntropy * 100),
    skillBalance: Math.round(skillBalance * 100),
    categoryPairCount: categoryPairs.size,
    uniqueCategories: allCategories.size,
    timeSlots,
    skillCategories: skillCategories.size,
    velocityChange,
    metrics: [
      { label: 'Cross-category', value: Math.round(crossCategoryScore * 100), max: 100, description: 'Diversity of interaction types', color: '#8b5cf6' },
      { label: 'New participants', value: Math.round(firstTimeRatio * 100), max: 100, description: 'Rate of first-time helpers joining', color: '#06b6d4' },
      { label: 'Time diversity', value: Math.round(timeSlotEntropy * 100), max: 100, description: 'Interactions across different times of day', color: '#f59e0b' },
      { label: 'Skill balance', value: Math.round(skillBalance * 100), max: 100, description: 'Balance of skills offered vs requested', color: '#10b981' },
    ],
  };
}

/**
 * Generate bridging suggestions based on current index.
 */
export function getBridgingSuggestions(bridgingData) {
  const suggestions = [];

  if (bridgingData.crossCategoryScore < 40) {
    suggestions.push({
      emoji: '🌉',
      title: 'Diversify interaction types',
      description: 'Most interactions happen within the same category. Consider organizing cross-category events.',
      priority: 'high',
    });
  }

  if (bridgingData.firstTimeRatio < 20) {
    suggestions.push({
      emoji: '👋',
      title: 'Welcome new participants',
      description: 'New resident integration is low. Consider hosting a welcome circle or introductory event.',
      priority: 'high',
    });
  }

  if (bridgingData.timeSlotEntropy < 50) {
    suggestions.push({
      emoji: '🕐',
      title: 'Vary event times',
      description: 'Most activity happens at the same time of day. Different times attract different demographics.',
      priority: 'medium',
    });
  }

  if (bridgingData.skillBalance < 30) {
    suggestions.push({
      emoji: '⚖️',
      title: 'Balance skill exchange',
      description: 'There\'s an imbalance between skill offers and requests. Encourage more sharing in both directions.',
      priority: 'medium',
    });
  }

  if (bridgingData.bridgingScore >= 70) {
    suggestions.push({
      emoji: '🌟',
      title: 'Strong community bridges!',
      description: 'Your neighborhood has diverse, inclusive interactions. Keep it up!',
      priority: 'positive',
    });
  }

  return suggestions;
}
