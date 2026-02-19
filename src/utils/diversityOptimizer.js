/**
 * Reciprocity Diversity Optimizer
 *
 * Generates behavioral nudges (not alerts) suggesting:
 * - Cross-building gatherings when interactions cluster
 * - Welcome circles for new residents with low integration
 * - Youth volunteer programs for elderly net receivers
 * - Time-of-day diversification
 */

import { parseISO, differenceInDays } from 'date-fns';

/**
 * Analyze interaction patterns and generate diversity nudges.
 */
export function generateDiversityNudges(events, skills, timeBankEntries, resources, neighborhoodId) {
  const hood = events.filter((e) => e.neighborhood === neighborhoodId);
  const now = new Date();
  const recent = hood.filter((e) => differenceInDays(now, parseISO(e.timestamp)) < 30);
  const nudges = [];

  // 1. Category clustering analysis
  const categoryCounts = {};
  recent.forEach((e) => { categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1; });
  const sortedCats = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const totalRecent = recent.length;

  if (sortedCats.length > 0 && sortedCats[0][1] / totalRecent > 0.4) {
    nudges.push({
      id: 'category-cluster',
      emoji: '🔄',
      title: 'Diversify exchange types',
      description: `Most interactions are "${sortedCats[0][0]}" (${Math.round(sortedCats[0][1] / totalRecent * 100)}%). Try organizing different types of community events.`,
      priority: 'medium',
      type: 'diversity',
    });
  }

  // 2. Time-of-day analysis
  const hours = recent.map((e) => parseISO(e.timestamp).getHours());
  const morningPct = hours.filter((h) => h < 12).length / (hours.length || 1);
  const eveningPct = hours.filter((h) => h >= 18).length / (hours.length || 1);
  if (morningPct > 0.6) {
    nudges.push({
      id: 'time-morning',
      emoji: '🌙',
      title: 'Evening events could reach more neighbors',
      description: 'Most activity happens in the morning. Evening or weekend events may attract working residents and different demographics.',
      priority: 'low',
      type: 'temporal',
    });
  } else if (eveningPct > 0.6) {
    nudges.push({
      id: 'time-evening',
      emoji: '☀️',
      title: 'Morning activities could include more groups',
      description: 'Most activity is in evenings. Morning events may include retirees, parents, and shift workers.',
      priority: 'low',
      type: 'temporal',
    });
  }

  // 3. Skill exchange balance
  const hoodSkills = skills.filter((s) => s.neighborhood === neighborhoodId);
  const offers = hoodSkills.filter((s) => s.type === 'offer').length;
  const requests = hoodSkills.filter((s) => s.type === 'request').length;
  if (offers > 0 && requests === 0) {
    nudges.push({
      id: 'skill-no-requests',
      emoji: '🎓',
      title: 'Encourage skill requests',
      description: 'Many skills are offered, but no one has requested help yet. Normalizing "asking" strengthens community bonds.',
      priority: 'medium',
      type: 'skills',
    });
  } else if (requests > offers * 2) {
    nudges.push({
      id: 'skill-imbalance',
      emoji: '⚖️',
      title: 'More skill offerings needed',
      description: 'Many residents are seeking help, but few are offering. A "skills showcase" event could inspire sharing.',
      priority: 'medium',
      type: 'skills',
    });
  }

  // 4. Time bank imbalance
  const hoodTB = timeBankEntries.filter((t) => t.neighborhood === neighborhoodId);
  const given = hoodTB.filter((t) => t.type === 'given').reduce((s, t) => s + t.hours, 0);
  const received = hoodTB.filter((t) => t.type === 'received').reduce((s, t) => s + t.hours, 0);
  if (given > 0 && received === 0) {
    nudges.push({
      id: 'tb-unbalanced',
      emoji: '⏰',
      title: 'Accept help too!',
      description: 'Your neighborhood gives generously, but no hours have been "received" yet. Reciprocity flows both ways.',
      priority: 'low',
      type: 'timebank',
    });
  }

  // 5. Resource availability
  const hoodRes = resources.filter((r) => r.neighborhood === neighborhoodId);
  const borrowed = hoodRes.filter((r) => r.status === 'borrowed').length;
  if (hoodRes.length > 5 && borrowed === 0) {
    nudges.push({
      id: 'res-unused',
      emoji: '📦',
      title: 'Shared items going unused',
      description: `${hoodRes.length} items available but nothing borrowed. Consider promoting your lending library at the next gathering.`,
      priority: 'low',
      type: 'resources',
    });
  }

  // 6. Low participation nudge
  if (recent.length < 5) {
    nudges.push({
      id: 'low-activity',
      emoji: '🌱',
      title: 'Community is just getting started',
      description: 'Activity is low. A simple coffee meetup or potluck could spark much more interaction.',
      priority: 'high',
      type: 'participation',
    });
  }

  // 7. Welcome circle suggestion (simulated new residents)
  const veryRecent = hood.filter((e) => differenceInDays(now, parseISO(e.timestamp)) < 7);
  const older = hood.filter((e) => differenceInDays(now, parseISO(e.timestamp)) >= 14);
  if (veryRecent.length > 0 && older.length > 10 && veryRecent.length < older.length * 0.1) {
    nudges.push({
      id: 'welcome-circle',
      emoji: '👋',
      title: 'New residents may need integration',
      description: 'Recent participation is low compared to overall activity. A welcome circle could help newer neighbors feel included.',
      priority: 'medium',
      type: 'inclusion',
    });
  }

  // 8. Positive reinforcement
  if (nudges.length === 0 || (recent.length > 20 && sortedCats.length >= 5)) {
    nudges.push({
      id: 'strong-diversity',
      emoji: '🌈',
      title: 'Wonderful diversity!',
      description: 'Your community has a healthy mix of interaction types, times, and participants. Keep cultivating these connections!',
      priority: 'positive',
      type: 'celebration',
    });
  }

  return nudges.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2, positive: 3 };
    return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
  });
}
