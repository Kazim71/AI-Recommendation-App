// Simple TTL cache (O(1) lookups)
const cache = new Map();

export function setCache(key, value, ttl = 3600) {
  const expireAt = Date.now() + ttl * 1000;
  cache.set(key, { value, expireAt });
}

export function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expireAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

export function clearCache() {
  cache.clear();
}
