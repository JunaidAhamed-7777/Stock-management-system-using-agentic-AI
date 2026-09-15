export const TOKEN_KEY = "stockflow.token";
export const USER_KEY = "stockflow.user";
export const CART_KEY = "stockflow.cart";

function readStore(store, key) {
  try {
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function readStorage(key, fallback = null) {
  const fromLocal = readStore(localStorage, key);
  if (fromLocal !== null && fromLocal !== undefined) return fromLocal;
  const fromSession = readStore(sessionStorage, key);
  if (fromSession !== null && fromSession !== undefined) return fromSession;
  return fallback;
}

export function writeStorage(key, value, options = {}) {
  const session = Boolean(options.session);
  const primary = session ? sessionStorage : localStorage;
  const secondary = session ? localStorage : sessionStorage;
  primary.setItem(key, JSON.stringify(value));
  secondary.removeItem(key);
}

export function isSessionKey(key) {
  return !localStorage.getItem(key) && Boolean(sessionStorage.getItem(key));
}

export function removeStorage(key) {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}
