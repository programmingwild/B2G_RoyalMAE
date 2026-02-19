import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getStoredEvents,
  storeEvent,
  getSelectedNeighborhood,
  setSelectedNeighborhood as persistNeighborhood,
  getEmergencyMode,
  setEmergencyMode as persistEmergencyMode,
  getEmergencyPosts,
  storeEmergencyPost,
  clearEmergencyPosts,
  seedDemoData,
  seedAllDemoData,
  getOnboarded,
  setOnboarded as persistOnboarded,
  getSkills, addSkill as storeSkill, updateSkill as persistUpdateSkill, removeSkill as persistRemoveSkill,
  getResources, addResource as storeResource, updateResource as persistUpdateResource, removeResource as persistRemoveResource,
  getGratitude, addGratitude as storeGratitude, toggleHeartGratitude as persistToggleHeart,
  getTimeBankEntries, addTimeBankEntry as storeTimeBankEntry,
  getPulseEntries, addPulseEntry as storePulseEntry,
  getCalEvents, addCalEvent as storeCalEvent, updateCalEvent as persistUpdateCalEvent,
  getSafetyCheckins, addSafetyCheckin as storeSafetyCheckin, updateSafetyCheckin as persistUpdateSafetyCheckin,
  getChallenges, addChallenge as storeChallenge, updateChallenge as persistUpdateChallenge,
  getGardenItems, addGardenItem as storeGardenItem, updateGardenItem as persistUpdateGardenItem, removeGardenItem as persistRemoveGardenItem,
} from '../utils/storage';
import { computeScore, dailyCounts, categoryBreakdown, trend, scoreLabel } from '../utils/scoring';
import { getSuggestions } from '../utils/suggestions';
import { getCurrentUser, logoutUser, updateUserProfile, getOnlineMembers } from '../utils/auth';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [neighborhood, setNeighborhoodState] = useState(() => {
    const user = getCurrentUser();
    return user ? user.neighborhood : getSelectedNeighborhood();
  });
  const [events, setEvents] = useState([]);
  const [emergencyMode, setEmergencyModeState] = useState(getEmergencyMode);
  const [emergencyPosts, setEmergencyPostsState] = useState(getEmergencyPosts);
  const [onboarded, setOnboardedState] = useState(() => {
    const user = getCurrentUser();
    return user ? true : getOnboarded();
  });
  const [toastMessage, setToastMessage] = useState(null);

  // New feature state
  const [skills, setSkills] = useState([]);
  const [resources, setResources] = useState([]);
  const [gratitude, setGratitude] = useState([]);
  const [timeBankEntries, setTimeBankEntries] = useState([]);
  const [pulseEntries, setPulseEntries] = useState([]);
  const [calEvents, setCalEvents] = useState([]);
  const [safetyCheckins, setSafetyCheckins] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [gardenItems, setGardenItems] = useState([]);

  // Community members
  const [communityMembers, setCommunityMembers] = useState([]);

  // Load all data when neighborhood is set
  useEffect(() => {
    if (neighborhood) {
      let loaded = getStoredEvents();
      if (loaded.length === 0) loaded = seedDemoData(neighborhood);
      setEvents(loaded);
      seedAllDemoData(neighborhood);
      setSkills(getSkills());
      setResources(getResources());
      setGratitude(getGratitude());
      setTimeBankEntries(getTimeBankEntries());
      setPulseEntries(getPulseEntries());
      setCalEvents(getCalEvents());
      setSafetyCheckins(getSafetyCheckins());
      setChallenges(getChallenges());
      setGardenItems(getGardenItems());
      setCommunityMembers(getOnlineMembers(neighborhood));
    }
  }, [neighborhood]);

  // Refresh community members periodically (simulated real-time)
  useEffect(() => {
    if (!neighborhood) return;
    const interval = setInterval(() => {
      setCommunityMembers(getOnlineMembers(neighborhood));
    }, 15000);
    return () => clearInterval(interval);
  }, [neighborhood]);

  // ─── AUTH ACTIONS ────────────────────────────────────────
  const login = useCallback((user) => {
    setCurrentUser(user);
    setNeighborhoodState(user.neighborhood);
    persistNeighborhood(user.neighborhood);
    setOnboardedState(true);
    persistOnboarded(true);
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setCurrentUser(null);
    setOnboardedState(false);
  }, []);

  const updateProfile = useCallback((updates) => {
    if (!currentUser) return;
    const updated = updateUserProfile(currentUser.id, updates);
    if (updated) setCurrentUser(updated);
  }, [currentUser]);

  const setNeighborhood = useCallback((id) => { persistNeighborhood(id); setNeighborhoodState(id); }, []);
  const completeOnboarding = useCallback(() => { persistOnboarded(true); setOnboardedState(true); }, []);
  const showToast = useCallback((msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 2500); }, []);

  // ─── RECIPROCITY EVENTS ──────────────────────────────────
  const logEvent = useCallback((eventData) => {
    const newEvent = { id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, neighborhood, timestamp: new Date().toISOString(), userId: currentUser?.id, userName: currentUser?.name, userAvatar: currentUser?.avatar, ...eventData };
    const updated = storeEvent(newEvent);
    setEvents([...updated]);
    _incrementChallenge();
    showToast('Act of reciprocity logged 🌿');
  }, [neighborhood, currentUser]);

  // ─── EMERGENCY ───────────────────────────────────────────
  const toggleEmergencyMode = useCallback(() => {
    const next = !emergencyMode.active;
    const data = persistEmergencyMode(next);
    setEmergencyModeState(data);
    if (!next) { clearEmergencyPosts(); setEmergencyPostsState([]); }
  }, [emergencyMode]);

  const addEmergencyPost = useCallback((post) => {
    const newPost = { id: `emer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, timestamp: new Date().toISOString(), userId: currentUser?.id, userName: currentUser?.name, userAvatar: currentUser?.avatar, ...post };
    const updated = storeEmergencyPost(newPost);
    setEmergencyPostsState([...updated]);
    showToast(post.type === 'need' ? 'Need posted' : 'Offer posted — thank you!');
  }, [currentUser]);

  // ─── SKILLS ──────────────────────────────────────────────
  const addSkill = useCallback((d) => {
    const s = { id: `sk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, neighborhood, timestamp: new Date().toISOString(), status: 'active', userId: currentUser?.id, userName: currentUser?.name, userAvatar: currentUser?.avatar, ...d };
    setSkills([...storeSkill(s)]); showToast(d.type === 'offer' ? 'Skill offered!' : 'Skill request posted!');
  }, [neighborhood, currentUser]);
  const updateSkill = useCallback((id, p) => { setSkills([...persistUpdateSkill(id, p)]); }, []);
  const removeSkill = useCallback((id) => { setSkills([...persistRemoveSkill(id)]); showToast('Skill listing removed'); }, []);

  // ─── RESOURCES ───────────────────────────────────────────
  const addResource = useCallback((d) => {
    const r = { id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, neighborhood, timestamp: new Date().toISOString(), status: 'available', userId: currentUser?.id, userName: currentUser?.name, userAvatar: currentUser?.avatar, ...d };
    setResources([...storeResource(r)]); showToast('Item added to library 📚');
  }, [neighborhood, currentUser]);
  const updateResource = useCallback((id, p) => { setResources([...persistUpdateResource(id, p)]); }, []);
  const removeResource = useCallback((id) => { setResources([...persistRemoveResource(id)]); showToast('Item removed'); }, []);

  // ─── GRATITUDE ───────────────────────────────────────────
  const addGratitudePost = useCallback((d) => {
    const g = { id: `gr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, neighborhood, timestamp: new Date().toISOString(), hearts: 0, userId: currentUser?.id, userName: currentUser?.name, userAvatar: currentUser?.avatar, ...d };
    setGratitude([...storeGratitude(g)]); showToast('Gratitude shared 💛');
  }, [neighborhood, currentUser]);
  const toggleHeart = useCallback((id) => { setGratitude([...persistToggleHeart(id)]); }, []);

  // ─── TIME BANK ───────────────────────────────────────────
  const addTimeBankLog = useCallback((d) => {
    const e = { id: `tb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, neighborhood, timestamp: new Date().toISOString(), userId: currentUser?.id, userName: currentUser?.name, userAvatar: currentUser?.avatar, ...d };
    setTimeBankEntries([...storeTimeBankEntry(e)]); showToast(d.type === 'given' ? `${d.hours}h logged — thank you!` : `${d.hours}h received — noted!`);
  }, [neighborhood, currentUser]);

  // ─── PULSE ───────────────────────────────────────────────
  const addPulseResponse = useCallback((d) => {
    const e = { id: `pulse-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, neighborhood, timestamp: new Date().toISOString(), userId: currentUser?.id, userName: currentUser?.name, ...d };
    setPulseEntries([...storePulseEntry(e)]); showToast('Pulse recorded 💓');
  }, [neighborhood, currentUser]);

  // ─── CALENDAR EVENTS ─────────────────────────────────────
  const addEvent = useCallback((d) => {
    const e = { id: `ce-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, neighborhood, timestamp: new Date().toISOString(), interested: 0, userId: currentUser?.id, userName: currentUser?.name, userAvatar: currentUser?.avatar, ...d };
    setCalEvents([...storeCalEvent(e)]); showToast('Event created 📅');
  }, [neighborhood, currentUser]);
  const markInterested = useCallback((id) => {
    const list = [...calEvents];
    const idx = list.findIndex((e) => e.id === id);
    if (idx !== -1) { list[idx].interested = (list[idx].interested || 0) + 1; persistUpdateCalEvent(id, { interested: list[idx].interested }); setCalEvents(list); }
  }, [calEvents]);

  // ─── SAFETY NET ──────────────────────────────────────────
  const addSafetyPost = useCallback((d) => {
    const p = { id: `sf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, neighborhood, timestamp: new Date().toISOString(), status: d.type === 'checkin' ? 'completed' : 'open', userId: currentUser?.id, userName: currentUser?.name, userAvatar: currentUser?.avatar, ...d };
    setSafetyCheckins([...storeSafetyCheckin(p)]); showToast(d.type === 'checkin' ? 'Check-in logged 🛡️' : 'Request posted');
  }, [neighborhood, currentUser]);
  const resolveSafetyPost = useCallback((id) => { setSafetyCheckins([...persistUpdateSafetyCheckin(id, { status: 'resolved' })]); showToast('Resolved ✓'); }, []);

  // ─── CHALLENGES ──────────────────────────────────────────
  const _incrementChallenge = useCallback(() => {
    const cur = getChallenges(); const a = cur.find((c) => c.active && c.type === 'acts');
    if (a) setChallenges([...persistUpdateChallenge(a.id, { current: a.current + 1 })]);
  }, []);
  const addNewChallenge = useCallback((d) => {
    const c = { id: `ch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, neighborhood, current: 0, active: true, userId: currentUser?.id, userName: currentUser?.name, ...d };
    setChallenges([...storeChallenge(c)]); showToast('Challenge created! 🎯');
  }, [neighborhood, currentUser]);
  const incrementChallenge = useCallback((id) => {
    const list = getChallenges(); const item = list.find((c) => c.id === id);
    if (item) setChallenges([...persistUpdateChallenge(id, { current: item.current + 1 })]);
  }, []);

  // ─── GARDEN ──────────────────────────────────────────────
  const addGardenEntry = useCallback((d) => {
    const g = { id: `gd-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, neighborhood, timestamp: new Date().toISOString(), userId: currentUser?.id, userName: currentUser?.name, userAvatar: currentUser?.avatar, ...d };
    setGardenItems([...storeGardenItem(g)]); showToast('Garden entry added 🌱');
  }, [neighborhood, currentUser]);
  const updateGardenEntry = useCallback((id, p) => { setGardenItems([...persistUpdateGardenItem(id, p)]); }, []);
  const removeGardenEntry = useCallback((id) => { setGardenItems([...persistRemoveGardenItem(id)]); showToast('Entry removed'); }, []);

  // ─── DERIVED ─────────────────────────────────────────────
  const score = neighborhood ? computeScore(events, neighborhood) : 0;
  const daily = neighborhood ? dailyCounts(events, neighborhood) : [];
  const catBreakdown = neighborhood ? categoryBreakdown(events, neighborhood) : [];
  const trendDir = neighborhood ? trend(events, neighborhood) : 'stable';
  const health = scoreLabel(score);
  const suggestions = getSuggestions(score, trendDir, catBreakdown.map((c) => c.category));

  const hoodTimeBank = timeBankEntries.filter((e) => e.neighborhood === neighborhood);
  const timeBankBalance = {
    given: hoodTimeBank.filter((e) => e.type === 'given').reduce((s, e) => s + e.hours, 0),
    received: hoodTimeBank.filter((e) => e.type === 'received').reduce((s, e) => s + e.hours, 0),
  };
  timeBankBalance.net = timeBankBalance.given - timeBankBalance.received;

  const hoodPulse = pulseEntries.filter((e) => e.neighborhood === neighborhood);
  const pulseAvg = hoodPulse.length > 0 ? +(hoodPulse.reduce((s, e) => s + e.rating, 0) / hoodPulse.length).toFixed(1) : 0;
  const activeChallenges = challenges.filter((c) => c.neighborhood === neighborhood && c.active);

  const value = {
    currentUser, login, logout, updateProfile, communityMembers,
    neighborhood, setNeighborhood, onboarded, completeOnboarding, events, logEvent,
    score, daily, catBreakdown, trendDir, health, suggestions, toastMessage,
    emergencyMode, toggleEmergencyMode, emergencyPosts, addEmergencyPost,
    skills, addSkill, updateSkill, removeSkill,
    resources, addResource, updateResource, removeResource,
    gratitude, addGratitudePost, toggleHeart,
    timeBankEntries, addTimeBankLog, timeBankBalance,
    pulseEntries, addPulseResponse, pulseAvg,
    calEvents, addEvent, markInterested,
    safetyCheckins, addSafetyPost, resolveSafetyPost,
    challenges: activeChallenges, addNewChallenge, incrementChallenge,
    gardenItems, addGardenEntry, updateGardenEntry, removeGardenEntry,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
