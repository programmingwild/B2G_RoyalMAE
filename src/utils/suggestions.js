/**
 * Context-aware suggestions based on score, trend, and missing categories.
 */

const ALL_CATEGORY_IDS = [
  'tools', 'groceries', 'childcare', 'pets', 'garden', 'transport',
  'knowledge', 'food', 'supplies', 'emotional', 'help', 'community',
];

const SUGGESTIONS_POOL = [
  {
    condition: (ctx) => ctx.score < 30,
    suggestions: [
      { title: 'Start a "Meet Your Neighbor" Walk', description: 'Organize a casual 30-minute walk around the block this weekend. No agenda — just faces and names.' },
      { title: 'Post a "Free to Borrow" List', description: 'Share a simple list of items you\'re happy to lend (ladder, drill, books) on your door or community board.' },
      { title: 'Welcome a New Resident', description: 'If someone recently moved in, drop off a handwritten note with your name and a small treat.' },
    ],
  },
  {
    condition: (ctx) => ctx.score >= 30 && ctx.score < 60,
    suggestions: [
      { title: 'Host a Tool-Sharing Saturday', description: 'Set up a table in a common area where neighbors can bring and borrow tools. Even 1 hour builds trust.' },
      { title: 'Weekly Help Hour', description: 'Pick a regular time window (e.g., Saturday 10–11am) when you\'re available for small favors. Invite others to join.' },
      { title: 'Community Skill Swap', description: 'Pair neighbors who have complementary skills — one teaches cooking, another helps with tech.' },
    ],
  },
  {
    condition: (ctx) => ctx.score >= 60,
    suggestions: [
      { title: 'Celebrate Your Street', description: 'Your reciprocity is strong! Host a small block celebration to acknowledge the mutual aid happening naturally.' },
      { title: 'Create an Emergency Contact Tree', description: 'With high trust already built, organize a simple phone tree so neighbors can quickly support each other in crises.' },
      { title: 'Mentor Another Block', description: 'Share what worked in your neighborhood with an adjacent block that\'s just getting started.' },
    ],
  },
  {
    condition: (ctx) => ctx.trend === 'down',
    suggestions: [
      { title: 'Re-activate with a Small Gesture', description: 'Reciprocity dipped this week. A single act — baking cookies, offering a ride — can restart momentum.' },
    ],
  },
  {
    condition: (ctx) => !ctx.activeCats.has('community'),
    suggestions: [
      { title: 'Plan a Micro-Event', description: 'No community events logged recently. Even a 15-minute coffee on the stoop counts.' },
    ],
  },
  {
    condition: (ctx) => !ctx.activeCats.has('emotional'),
    suggestions: [
      { title: 'Check On a Neighbor', description: 'A quick "How are you doing?" can make someone\'s day and strengthens invisible bonds.' },
    ],
  },
];

export function getSuggestions(score, trendDir, recentCategories, max = 3) {
  const activeCats = new Set(recentCategories);
  const ctx = { score, trend: trendDir, activeCats };

  const matched = [];
  for (const group of SUGGESTIONS_POOL) {
    if (group.condition(ctx)) {
      matched.push(...group.suggestions);
    }
  }

  // Deduplicate and limit
  const seen = new Set();
  const result = [];
  for (const s of matched) {
    if (!seen.has(s.title) && result.length < max) {
      seen.add(s.title);
      result.push(s);
    }
  }

  return result;
}
