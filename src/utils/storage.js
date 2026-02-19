const STORAGE_KEYS = {
  EVENTS: 'nrn_events',
  NEIGHBORHOOD: 'nrn_neighborhood',
  EMERGENCY_MODE: 'nrn_emergency_mode',
  EMERGENCY_POSTS: 'nrn_emergency_posts',
  ONBOARDED: 'nrn_onboarded',
  SKILLS: 'nrn_skills',
  RESOURCES: 'nrn_resources',
  GRATITUDE: 'nrn_gratitude',
  TIMEBANK: 'nrn_timebank',
  PULSE: 'nrn_pulse',
  EVENTS_CAL: 'nrn_events_cal',
  SAFETY: 'nrn_safety',
  CHALLENGES: 'nrn_challenges',
  GARDEN: 'nrn_garden',
};

export function getStoredEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function storeEvent(event) {
  const events = getStoredEvents();
  events.push(event);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  return events;
}

export function getSelectedNeighborhood() {
  return localStorage.getItem(STORAGE_KEYS.NEIGHBORHOOD) || null;
}

export function setSelectedNeighborhood(id) {
  localStorage.setItem(STORAGE_KEYS.NEIGHBORHOOD, id);
}

export function getEmergencyMode() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMERGENCY_MODE);
    return raw ? JSON.parse(raw) : { active: false, since: null };
  } catch {
    return { active: false, since: null };
  }
}

export function setEmergencyMode(active) {
  const data = { active, since: active ? new Date().toISOString() : null };
  localStorage.setItem(STORAGE_KEYS.EMERGENCY_MODE, JSON.stringify(data));
  return data;
}

export function getEmergencyPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMERGENCY_POSTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function storeEmergencyPost(post) {
  const posts = getEmergencyPosts();
  posts.push(post);
  localStorage.setItem(STORAGE_KEYS.EMERGENCY_POSTS, JSON.stringify(posts));
  return posts;
}

export function clearEmergencyPosts() {
  localStorage.setItem(STORAGE_KEYS.EMERGENCY_POSTS, JSON.stringify([]));
}

export function getOnboarded() {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
}

export function setOnboarded(val) {
  localStorage.setItem(STORAGE_KEYS.ONBOARDED, val ? 'true' : 'false');
}

// Seed demo data for first-time visitors
export function seedDemoData(neighborhoodId) {
  const existing = getStoredEvents();
  if (existing.length > 0) return existing;

  const now = Date.now();
  const DAY = 86400000;
  const categories = ['tools', 'groceries', 'food', 'garden', 'childcare', 'pets', 'emotional', 'help', 'community', 'knowledge', 'transport', 'supplies'];

  const demoEvents = [];
  // Generate 60 events spread over the last 30 days
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const cat = categories[Math.floor(Math.random() * categories.length)];
    demoEvents.push({
      id: `demo-${i}`,
      category: cat,
      neighborhood: neighborhoodId,
      timestamp: new Date(now - daysAgo * DAY + Math.random() * DAY).toISOString(),
      note: '',
    });
  }

  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(demoEvents));
  return demoEvents;
}

// ─── SKILLS ────────────────────────────────────────────────
function _getList(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function _addItem(key, item) {
  const list = _getList(key);
  list.push(item);
  localStorage.setItem(key, JSON.stringify(list));
  return list;
}
function _updateItem(key, id, patch) {
  const list = _getList(key);
  const idx = list.findIndex((i) => i.id === id);
  if (idx !== -1) list[idx] = { ...list[idx], ...patch };
  localStorage.setItem(key, JSON.stringify(list));
  return list;
}
function _removeItem(key, id) {
  const list = _getList(key).filter((i) => i.id !== id);
  localStorage.setItem(key, JSON.stringify(list));
  return list;
}

export const getSkills = () => _getList(STORAGE_KEYS.SKILLS);
export const addSkill = (s) => _addItem(STORAGE_KEYS.SKILLS, s);
export const updateSkill = (id, patch) => _updateItem(STORAGE_KEYS.SKILLS, id, patch);
export const removeSkill = (id) => _removeItem(STORAGE_KEYS.SKILLS, id);

// ─── RESOURCES ─────────────────────────────────────────────
export const getResources = () => _getList(STORAGE_KEYS.RESOURCES);
export const addResource = (r) => _addItem(STORAGE_KEYS.RESOURCES, r);
export const updateResource = (id, patch) => _updateItem(STORAGE_KEYS.RESOURCES, id, patch);
export const removeResource = (id) => _removeItem(STORAGE_KEYS.RESOURCES, id);

// ─── GRATITUDE ─────────────────────────────────────────────
export const getGratitude = () => _getList(STORAGE_KEYS.GRATITUDE);
export const addGratitude = (g) => _addItem(STORAGE_KEYS.GRATITUDE, g);
export function heartGratitude(id) {
  return _updateItem(STORAGE_KEYS.GRATITUDE, id, {});
}
export function toggleHeartGratitude(id) {
  const list = _getList(STORAGE_KEYS.GRATITUDE);
  const idx = list.findIndex((i) => i.id === id);
  if (idx !== -1) list[idx].hearts = (list[idx].hearts || 0) + 1;
  localStorage.setItem(STORAGE_KEYS.GRATITUDE, JSON.stringify(list));
  return list;
}

// ─── TIME BANK ─────────────────────────────────────────────
export const getTimeBankEntries = () => _getList(STORAGE_KEYS.TIMEBANK);
export const addTimeBankEntry = (e) => _addItem(STORAGE_KEYS.TIMEBANK, e);

// ─── PULSE ─────────────────────────────────────────────────
export const getPulseEntries = () => _getList(STORAGE_KEYS.PULSE);
export const addPulseEntry = (e) => _addItem(STORAGE_KEYS.PULSE, e);

// ─── EVENTS CALENDAR ───────────────────────────────────────
export const getCalEvents = () => _getList(STORAGE_KEYS.EVENTS_CAL);
export const addCalEvent = (e) => _addItem(STORAGE_KEYS.EVENTS_CAL, e);
export const updateCalEvent = (id, patch) => _updateItem(STORAGE_KEYS.EVENTS_CAL, id, patch);

// ─── SAFETY NET ────────────────────────────────────────────
export const getSafetyCheckins = () => _getList(STORAGE_KEYS.SAFETY);
export const addSafetyCheckin = (c) => _addItem(STORAGE_KEYS.SAFETY, c);
export const updateSafetyCheckin = (id, patch) => _updateItem(STORAGE_KEYS.SAFETY, id, patch);

// ─── CHALLENGES ────────────────────────────────────────────
export const getChallenges = () => _getList(STORAGE_KEYS.CHALLENGES);
export const addChallenge = (c) => _addItem(STORAGE_KEYS.CHALLENGES, c);
export const updateChallenge = (id, patch) => _updateItem(STORAGE_KEYS.CHALLENGES, id, patch);

// ─── COMMUNITY GARDEN ──────────────────────────────────────
export const getGardenItems = () => _getList(STORAGE_KEYS.GARDEN);
export const addGardenItem = (g) => _addItem(STORAGE_KEYS.GARDEN, g);
export const updateGardenItem = (id, patch) => _updateItem(STORAGE_KEYS.GARDEN, id, patch);
export const removeGardenItem = (id) => _removeItem(STORAGE_KEYS.GARDEN, id);

// ─── SEED DEMO DATA FOR NEW FEATURES ──────────────────────
export function seedAllDemoData(neighborhoodId) {
  const now = Date.now();
  const DAY = 86400000;

  // Demo skills
  if (getSkills().length === 0) {
    const demoSkills = [
      { id: 'sk-1', type: 'offer', skill: 'tech', title: 'Basic computer help', description: 'Can help with email, video calls, and phone setup', neighborhood: neighborhoodId, timestamp: new Date(now - 5 * DAY).toISOString(), status: 'active' },
      { id: 'sk-2', type: 'offer', skill: 'cooking', title: 'Baking bread', description: 'Happy to teach sourdough basics to anyone interested', neighborhood: neighborhoodId, timestamp: new Date(now - 3 * DAY).toISOString(), status: 'active' },
      { id: 'sk-3', type: 'request', skill: 'gardening', title: 'Help starting a balcony garden', description: 'Would love tips on container gardening for small spaces', neighborhood: neighborhoodId, timestamp: new Date(now - 7 * DAY).toISOString(), status: 'active' },
      { id: 'sk-4', type: 'offer', skill: 'language', title: 'Spanish conversation practice', description: 'Native speaker, happy to chat over coffee', neighborhood: neighborhoodId, timestamp: new Date(now - 2 * DAY).toISOString(), status: 'active' },
      { id: 'sk-5', type: 'request', skill: 'repair', title: 'Need help fixing a leaky faucet', description: 'Basic plumbing repair needed, willing to learn', neighborhood: neighborhoodId, timestamp: new Date(now - 1 * DAY).toISOString(), status: 'active' },
      { id: 'sk-6', type: 'offer', skill: 'fitness', title: 'Morning yoga in the park', description: 'Leading casual yoga sessions, all levels welcome', neighborhood: neighborhoodId, timestamp: new Date(now - 4 * DAY).toISOString(), status: 'active' },
    ];
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(demoSkills));
  }

  // Demo resources
  if (getResources().length === 0) {
    const demoResources = [
      { id: 'res-1', name: 'Extension Ladder', category: 'tools-res', description: '24ft aluminum ladder, great condition', neighborhood: neighborhoodId, status: 'available', timestamp: new Date(now - 10 * DAY).toISOString() },
      { id: 'res-2', name: 'Instant Pot', category: 'kitchen', description: '6-quart, barely used', neighborhood: neighborhoodId, status: 'available', timestamp: new Date(now - 8 * DAY).toISOString() },
      { id: 'res-3', name: 'Camping Tent (4-person)', category: 'outdoor', description: 'Easy setup dome tent', neighborhood: neighborhoodId, status: 'borrowed', timestamp: new Date(now - 6 * DAY).toISOString() },
      { id: 'res-4', name: 'Board Game Collection', category: 'games', description: 'Catan, Ticket to Ride, Codenames', neighborhood: neighborhoodId, status: 'available', timestamp: new Date(now - 3 * DAY).toISOString() },
      { id: 'res-5', name: 'Power Drill + Bits', category: 'tools-res', description: 'Cordless drill with full bit set', neighborhood: neighborhoodId, status: 'available', timestamp: new Date(now - 5 * DAY).toISOString() },
      { id: 'res-6', name: 'Baby Stroller', category: 'baby', description: 'Jogging stroller, clean and working', neighborhood: neighborhoodId, status: 'available', timestamp: new Date(now - 12 * DAY).toISOString() },
    ];
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(demoResources));
  }

  // Demo gratitude
  if (getGratitude().length === 0) {
    const demoGratitude = [
      { id: 'gr-1', message: 'Thank you to whoever shoveled my walkway this morning. You made my week!', neighborhood: neighborhoodId, timestamp: new Date(now - 1 * DAY).toISOString(), hearts: 12, category: 'help' },
      { id: 'gr-2', message: 'The person who left fresh tomatoes on our doorstep — they were delicious. Community gardens are magic.', neighborhood: neighborhoodId, timestamp: new Date(now - 2 * DAY).toISOString(), hearts: 8, category: 'food' },
      { id: 'gr-3', message: 'Grateful for the neighbor who helped carry my groceries up 3 flights of stairs. Small acts matter.', neighborhood: neighborhoodId, timestamp: new Date(now - 3 * DAY).toISOString(), hearts: 15, category: 'groceries' },
      { id: 'gr-4', message: 'Someone noticed I was having a tough day and just sat with me on the stoop. No words needed.', neighborhood: neighborhoodId, timestamp: new Date(now - 4 * DAY).toISOString(), hearts: 23, category: 'emotional' },
      { id: 'gr-5', message: 'The weekend tool-sharing meetup saved me $200 on a saw rental. Love this neighborhood!', neighborhood: neighborhoodId, timestamp: new Date(now - 5 * DAY).toISOString(), hearts: 6, category: 'tools' },
    ];
    localStorage.setItem(STORAGE_KEYS.GRATITUDE, JSON.stringify(demoGratitude));
  }

  // Demo time bank
  if (getTimeBankEntries().length === 0) {
    const demoTimeBank = [
      { id: 'tb-1', hours: 2, type: 'given', category: 'tech', description: 'Set up Wi-Fi for elderly neighbor', neighborhood: neighborhoodId, timestamp: new Date(now - 3 * DAY).toISOString() },
      { id: 'tb-2', hours: 1, type: 'received', category: 'cooking', description: 'Received a cooking lesson', neighborhood: neighborhoodId, timestamp: new Date(now - 5 * DAY).toISOString() },
      { id: 'tb-3', hours: 3, type: 'given', category: 'gardening', description: 'Helped plant community flower bed', neighborhood: neighborhoodId, timestamp: new Date(now - 7 * DAY).toISOString() },
      { id: 'tb-4', hours: 1.5, type: 'given', category: 'repair', description: 'Fixed a broken shelf', neighborhood: neighborhoodId, timestamp: new Date(now - 2 * DAY).toISOString() },
      { id: 'tb-5', hours: 2, type: 'received', category: 'language', description: 'Spanish practice session', neighborhood: neighborhoodId, timestamp: new Date(now - 1 * DAY).toISOString() },
    ];
    localStorage.setItem(STORAGE_KEYS.TIMEBANK, JSON.stringify(demoTimeBank));
  }

  // Demo pulse
  if (getPulseEntries().length === 0) {
    const demoPulse = [];
    for (let i = 0; i < 20; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      demoPulse.push({
        id: `pulse-${i}`,
        questionId: ['connected', 'safe', 'belonging'][Math.floor(Math.random() * 3)],
        rating: Math.floor(Math.random() * 3) + 3, // 3-5 range
        neighborhood: neighborhoodId,
        timestamp: new Date(now - daysAgo * DAY).toISOString(),
      });
    }
    localStorage.setItem(STORAGE_KEYS.PULSE, JSON.stringify(demoPulse));
  }

  // Demo calendar events
  if (getCalEvents().length === 0) {
    const demoCalEvents = [
      { id: 'ce-1', title: 'Saturday Tool Share', description: 'Bring tools you can lend, borrow what you need!', category: 'tool-share', date: new Date(now + 3 * DAY).toISOString().slice(0, 10), time: '10:00 AM', location: 'Community parking lot', neighborhood: neighborhoodId, timestamp: new Date(now - 2 * DAY).toISOString(), interested: 8 },
      { id: 'ce-2', title: 'Neighborhood Potluck', description: 'Bring a dish to share. All dietary needs welcome.', category: 'potluck', date: new Date(now + 7 * DAY).toISOString().slice(0, 10), time: '6:00 PM', location: 'Block B courtyard', neighborhood: neighborhoodId, timestamp: new Date(now - 1 * DAY).toISOString(), interested: 14 },
      { id: 'ce-3', title: 'Morning Walk & Coffee', description: 'Casual 30-min walk then coffee. Meet new faces!', category: 'walk', date: new Date(now + 1 * DAY).toISOString().slice(0, 10), time: '8:00 AM', location: 'Main gate entrance', neighborhood: neighborhoodId, timestamp: new Date(now - 5 * DAY).toISOString(), interested: 5 },
    ];
    localStorage.setItem(STORAGE_KEYS.EVENTS_CAL, JSON.stringify(demoCalEvents));
  }

  // Demo safety checkins
  if (getSafetyCheckins().length === 0) {
    const demoSafety = [
      { id: 'sf-1', type: 'checkin', message: 'Checked on the elderly couple in unit 4B — all good!', neighborhood: neighborhoodId, timestamp: new Date(now - 1 * DAY).toISOString(), status: 'completed' },
      { id: 'sf-2', type: 'request', message: 'Haven\'t seen the person in apt 12 for a few days. Can someone check?', neighborhood: neighborhoodId, timestamp: new Date(now - 2 * DAY).toISOString(), status: 'open' },
      { id: 'sf-3', type: 'checkin', message: 'Brought medication to a neighbor who couldn\'t get out today.', neighborhood: neighborhoodId, timestamp: new Date(now - 3 * DAY).toISOString(), status: 'completed' },
    ];
    localStorage.setItem(STORAGE_KEYS.SAFETY, JSON.stringify(demoSafety));
  }

  // Demo challenges
  if (getChallenges().length === 0) {
    const demoChallenges = [
      {
        id: 'ch-1',
        title: '100 Acts of Kindness',
        description: 'Can our neighborhood log 100 reciprocity events this month?',
        target: 100,
        current: 67,
        startDate: new Date(now - 15 * DAY).toISOString(),
        endDate: new Date(now + 15 * DAY).toISOString(),
        neighborhood: neighborhoodId,
        type: 'acts',
        active: true,
      },
      {
        id: 'ch-2',
        title: 'Meet 5 New Neighbors',
        description: 'Introduce yourself to 5 people you haven\'t met yet.',
        target: 5,
        current: 3,
        startDate: new Date(now - 7 * DAY).toISOString(),
        endDate: new Date(now + 7 * DAY).toISOString(),
        neighborhood: neighborhoodId,
        type: 'personal',
        active: true,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(demoChallenges));
  }

  // Demo garden items
  if (getGardenItems().length === 0) {
    const demoGarden = [
      { id: 'gd-1', type: 'vegetable', name: 'Tomato Plot A', description: 'Cherry tomatoes, ready in 2 weeks', status: 'growing', neighborhood: neighborhoodId, timestamp: new Date(now - 20 * DAY).toISOString() },
      { id: 'gd-2', type: 'herbs', name: 'Herb Spiral', description: 'Basil, rosemary, thyme — take what you need!', status: 'harvestable', neighborhood: neighborhoodId, timestamp: new Date(now - 30 * DAY).toISOString() },
      { id: 'gd-3', type: 'compost', name: 'Community Compost Bin', description: 'Drop off food scraps anytime', status: 'active', neighborhood: neighborhoodId, timestamp: new Date(now - 60 * DAY).toISOString() },
      { id: 'gd-4', type: 'seeds', name: 'Seed Library Box', description: 'Take seeds, leave seeds. Sunflower, lettuce, beans available.', status: 'available', neighborhood: neighborhoodId, timestamp: new Date(now - 10 * DAY).toISOString() },
      { id: 'gd-5', type: 'flowers', name: 'Pollinator Garden', description: 'Native wildflowers attracting bees and butterflies', status: 'growing', neighborhood: neighborhoodId, timestamp: new Date(now - 40 * DAY).toISOString() },
    ];
    localStorage.setItem(STORAGE_KEYS.GARDEN, JSON.stringify(demoGarden));
  }
}
