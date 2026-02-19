/**
 * Privacy-First Reciprocity Verification
 *
 * Dual-confirmation system: both parties lightly confirm an exchange happened
 * without revealing full identities. Uses anonymous tokens + proximity hashes.
 * Zero-knowledge approach: system verifies a reciprocity act occurred without
 * storing WHO or WHERE — only THAT it happened.
 */

const STORAGE_KEY = 'nrn_verifications';
const TOKEN_KEY = 'nrn_verification_tokens';

function _get(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function _set(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

/**
 * Generate a short, anonymous verification token.
 * In production this would be a cryptographic commitment scheme.
 */
export function generateVerificationToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = '';
  for (let i = 0; i < 6; i++) token += chars[Math.floor(Math.random() * chars.length)];
  return token;
}

/**
 * Create a pending verification request (initiator side).
 */
export function createVerification(eventId, neighborhoodId) {
  const token = generateVerificationToken();
  const entry = {
    id: `vrf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    eventId,
    neighborhood: neighborhoodId,
    token,
    status: 'pending',        // pending | confirmed | expired
    initiatedAt: new Date().toISOString(),
    confirmedAt: null,
    method: 'token',           // token | proximity
    // ZK proof placeholder: hash of (event_type + date + token) — no identity
    proofHash: _simpleHash(`${eventId}:${token}:${Date.now()}`),
  };
  const list = _get(STORAGE_KEY);
  list.push(entry);
  _set(STORAGE_KEY, list);
  return entry;
}

/**
 * Confirm a verification using the shared token.
 */
export function confirmVerification(token, neighborhoodId) {
  const list = _get(STORAGE_KEY);
  const idx = list.findIndex((v) => v.token === token && v.neighborhood === neighborhoodId && v.status === 'pending');
  if (idx === -1) return { success: false, reason: 'Token not found or already used' };
  list[idx].status = 'confirmed';
  list[idx].confirmedAt = new Date().toISOString();
  list[idx].confirmProofHash = _simpleHash(`${token}:confirmed:${Date.now()}`);
  _set(STORAGE_KEY, list);
  return { success: true, verification: list[idx] };
}

/**
 * Simulate a Bluetooth proximity handshake verification.
 * In production: BLE beacon exchange, no GPS, no location stored.
 */
export function proximityVerification(eventId, neighborhoodId) {
  const entry = {
    id: `vrf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    eventId,
    neighborhood: neighborhoodId,
    token: null,
    status: 'confirmed',
    initiatedAt: new Date().toISOString(),
    confirmedAt: new Date().toISOString(),
    method: 'proximity',
    proofHash: _simpleHash(`proximity:${eventId}:${Date.now()}`),
  };
  const list = _get(STORAGE_KEY);
  list.push(entry);
  _set(STORAGE_KEY, list);
  return entry;
}

/**
 * Get all verifications for a neighborhood.
 */
export function getVerifications(neighborhoodId) {
  return _get(STORAGE_KEY).filter((v) => v.neighborhood === neighborhoodId);
}

/**
 * Get verification stats.
 */
export function getVerificationStats(neighborhoodId) {
  const all = getVerifications(neighborhoodId);
  const confirmed = all.filter((v) => v.status === 'confirmed');
  const pending = all.filter((v) => v.status === 'pending');
  const byToken = confirmed.filter((v) => v.method === 'token');
  const byProximity = confirmed.filter((v) => v.method === 'proximity');
  return {
    total: all.length,
    confirmed: confirmed.length,
    pending: pending.length,
    trustRate: all.length > 0 ? +(confirmed.length / all.length * 100).toFixed(0) : 100,
    byToken: byToken.length,
    byProximity: byProximity.length,
  };
}

/**
 * Expire old pending verifications (older than 48 hours).
 */
export function expirePendingVerifications() {
  const list = _get(STORAGE_KEY);
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  let changed = false;
  list.forEach((v) => {
    if (v.status === 'pending' && new Date(v.initiatedAt).getTime() < cutoff) {
      v.status = 'expired';
      changed = true;
    }
  });
  if (changed) _set(STORAGE_KEY, list);
  return list;
}

/**
 * Simple non-cryptographic hash for demo purposes.
 * In production: SHA-256 or similar.
 */
function _simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0;
  }
  return 'zk_' + Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Seed demo verification data.
 */
export function seedVerificationData(neighborhoodId) {
  if (_get(STORAGE_KEY).length > 0) return;
  const now = Date.now();
  const DAY = 86400000;
  const demo = [
    { id: 'vrf-d1', eventId: 'demo-1', neighborhood: neighborhoodId, token: 'ABC123', status: 'confirmed', initiatedAt: new Date(now - 2 * DAY).toISOString(), confirmedAt: new Date(now - 2 * DAY + 3600000).toISOString(), method: 'token', proofHash: 'zk_0a1b2c3d' },
    { id: 'vrf-d2', eventId: 'demo-5', neighborhood: neighborhoodId, token: null, status: 'confirmed', initiatedAt: new Date(now - 3 * DAY).toISOString(), confirmedAt: new Date(now - 3 * DAY).toISOString(), method: 'proximity', proofHash: 'zk_4e5f6a7b' },
    { id: 'vrf-d3', eventId: 'demo-8', neighborhood: neighborhoodId, token: 'XYZ789', status: 'confirmed', initiatedAt: new Date(now - 1 * DAY).toISOString(), confirmedAt: new Date(now - 1 * DAY + 7200000).toISOString(), method: 'token', proofHash: 'zk_8c9d0e1f' },
    { id: 'vrf-d4', eventId: 'demo-12', neighborhood: neighborhoodId, token: 'QWE456', status: 'pending', initiatedAt: new Date(now - 0.5 * DAY).toISOString(), confirmedAt: null, method: 'token', proofHash: 'zk_2a3b4c5d' },
    { id: 'vrf-d5', eventId: 'demo-20', neighborhood: neighborhoodId, token: null, status: 'confirmed', initiatedAt: new Date(now - 5 * DAY).toISOString(), confirmedAt: new Date(now - 5 * DAY).toISOString(), method: 'proximity', proofHash: 'zk_6e7f8a9b' },
  ];
  _set(STORAGE_KEY, demo);
}
