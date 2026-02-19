/* ── Auth & User Management (localStorage-based) ─────────── */

const KEYS = {
  USERS: 'nrn_users',
  SESSION: 'nrn_current_user',
};

const AVATAR_COLORS = [
  '#0d9488', '#e28320', '#7c3aed', '#2563eb', '#dc2626',
  '#059669', '#d946ef', '#ea580c', '#0284c7', '#4f46e5',
  '#be123c', '#15803d', '#c026d3', '#b45309', '#0369a1',
];

const AVATAR_EMOJIS = [
  '🌿', '🌻', '🏡', '🤝', '🌳', '⭐', '🎨', '🌊',
  '🦋', '🌺', '🍀', '🔥', '🎵', '☀️', '🌈',
];

/* ── Demo community members (seed data) ──────────────────── */
const DEMO_MEMBERS = [
  { id: 'demo-alice', name: 'Alice Chen', avatar: { color: '#0d9488', emoji: '🌿' }, neighborhood: 'maple-grove', joinedAt: '2024-11-01T08:00:00Z', isDemo: true },
  { id: 'demo-raj', name: 'Raj Patel', avatar: { color: '#e28320', emoji: '🌻' }, neighborhood: 'maple-grove', joinedAt: '2024-11-02T10:00:00Z', isDemo: true },
  { id: 'demo-maria', name: 'Maria Santos', avatar: { color: '#7c3aed', emoji: '🏡' }, neighborhood: 'cedar-heights', joinedAt: '2024-11-03T09:00:00Z', isDemo: true },
  { id: 'demo-kenji', name: 'Kenji Tanaka', avatar: { color: '#2563eb', emoji: '🤝' }, neighborhood: 'cedar-heights', joinedAt: '2024-11-04T11:00:00Z', isDemo: true },
  { id: 'demo-sarah', name: 'Sarah Johnson', avatar: { color: '#dc2626', emoji: '🌳' }, neighborhood: 'riverside-commons', joinedAt: '2024-11-05T07:00:00Z', isDemo: true },
  { id: 'demo-omar', name: 'Omar Hassan', avatar: { color: '#059669', emoji: '⭐' }, neighborhood: 'riverside-commons', joinedAt: '2024-11-06T14:00:00Z', isDemo: true },
  { id: 'demo-lily', name: 'Lily Wong', avatar: { color: '#d946ef', emoji: '🎨' }, neighborhood: 'oak-park-west', joinedAt: '2024-11-07T16:00:00Z', isDemo: true },
  { id: 'demo-carlos', name: 'Carlos Rivera', avatar: { color: '#ea580c', emoji: '🌊' }, neighborhood: 'oak-park-west', joinedAt: '2024-11-08T12:00:00Z', isDemo: true },
  { id: 'demo-nina', name: 'Nina Kowalski', avatar: { color: '#0284c7', emoji: '🦋' }, neighborhood: 'sunflower-lane', joinedAt: '2024-11-09T15:00:00Z', isDemo: true },
  { id: 'demo-james', name: 'James Wright', avatar: { color: '#4f46e5', emoji: '🌺' }, neighborhood: 'sunflower-lane', joinedAt: '2024-11-10T13:00:00Z', isDemo: true },
];

/* ── Helpers ─────────────────────────────────────────────── */
function getAllUsers() {
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    const users = raw ? JSON.parse(raw) : [];
    // Ensure demo members always exist
    const existing = new Set(users.map((u) => u.id));
    for (const dm of DEMO_MEMBERS) {
      if (!existing.has(dm.id)) users.push(dm);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return users;
  } catch {
    localStorage.setItem(KEYS.USERS, JSON.stringify([...DEMO_MEMBERS]));
    return [...DEMO_MEMBERS];
  }
}

function saveUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

/* ── Public API ──────────────────────────────────────────── */
export function getUsers() {
  return getAllUsers();
}

export function getUserById(id) {
  return getAllUsers().find((u) => u.id === id) || null;
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(KEYS.SESSION);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Verify user still exists
    const user = getUserById(session.id);
    return user || null;
  } catch {
    return null;
  }
}

export function registerUser({ name, neighborhood, avatarColor, avatarEmoji }) {
  const users = getAllUsers();
  const nameLower = name.trim().toLowerCase();

  // Check if name already taken
  const exists = users.find((u) => u.name.toLowerCase() === nameLower);
  if (exists) return { success: false, error: 'This name is already taken. Try logging in or pick another name.' };

  const user = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    avatar: { color: avatarColor || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)], emoji: avatarEmoji || AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)] },
    neighborhood,
    joinedAt: new Date().toISOString(),
    isDemo: false,
  };

  users.push(user);
  saveUsers(users);
  localStorage.setItem(KEYS.SESSION, JSON.stringify({ id: user.id }));
  return { success: true, user };
}

export function loginUser(name) {
  const users = getAllUsers();
  const nameLower = name.trim().toLowerCase();
  const user = users.find((u) => u.name.toLowerCase() === nameLower && !u.isDemo);
  if (!user) return { success: false, error: 'No account found with that name. Try signing up!' };
  localStorage.setItem(KEYS.SESSION, JSON.stringify({ id: user.id }));
  return { success: true, user };
}

export function logoutUser() {
  localStorage.removeItem(KEYS.SESSION);
}

export function updateUserProfile(id, updates) {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return users[idx];
}

export function getCommunityMembers(neighborhood) {
  return getAllUsers().filter((u) => u.neighborhood === neighborhood);
}

export function getOnlineMembers(neighborhood) {
  // Simulated "online" status — demo members randomly online, current user always online
  const members = getCommunityMembers(neighborhood);
  const current = getCurrentUser();
  return members.map((m) => ({
    ...m,
    online: m.id === current?.id || (m.isDemo && Math.random() > 0.4),
  }));
}

export { AVATAR_COLORS, AVATAR_EMOJIS };
