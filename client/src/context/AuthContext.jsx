import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe, login as loginRequest, register as registerRequest } from "../services/auth.service";
import { getSuppliers } from "../services/discovery.service";
import { TOKEN_KEY, USER_KEY, isSessionKey, readStorage, removeStorage, writeStorage } from "../utils/storage";
import { normalizeRole, portalHome } from "../utils/roles";
import { getErrorMessage } from "../utils/errors";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStorage(TOKEN_KEY));
  const [user, setUser] = useState(() => readStorage(USER_KEY));
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(Boolean(readStorage(TOKEN_KEY)));

  const persist = useCallback((nextToken, nextUser, remember = true) => {
    setToken(nextToken);
    setUser(nextUser);
    const options = { session: !remember };
    if (nextToken) writeStorage(TOKEN_KEY, nextToken, options);
    else removeStorage(TOKEN_KEY);
    if (nextUser) writeStorage(USER_KEY, nextUser, options);
    else removeStorage(USER_KEY);
  }, []);

  const resolveSupplier = useCallback(async (nextUser) => {
    if (normalizeRole(nextUser?.role) !== "SUPPLIER") {
      setSupplier(null);
      return null;
    }
    try {
      const suppliers = await getSuppliers();
      const userId = Number(nextUser.id);
      const match = (suppliers || []).find(
        (item) => Number(item.userId) === userId || Number(item.user?.id) === userId
      );
      setSupplier(match || null);
      return match || null;
    } catch {
      setSupplier(null);
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const current = await getMe();
    persist(readStorage(TOKEN_KEY), current, !isSessionKey(TOKEN_KEY));
    await resolveSupplier(current);
    return current;
  }, [persist, resolveSupplier]);

  useEffect(() => {
    let cancelled = false;
    async function restore() {
      if (!readStorage(TOKEN_KEY)) {
        setLoading(false);
        return;
      }
      try {
        const current = await getMe();
        if (cancelled) return;
        persist(readStorage(TOKEN_KEY), current, !isSessionKey(TOKEN_KEY));
        await resolveSupplier(current);
      } catch {
        if (!cancelled) {
          persist(null, null);
          setSupplier(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    restore();
    return () => {
      cancelled = true;
    };
  }, [persist, resolveSupplier]);

  const login = useCallback(async (email, password, remember = true) => {
    const result = await loginRequest(email, password);
    persist(result.token, result.user, remember);
    await resolveSupplier(result.user);
    return result.user;
  }, [persist, resolveSupplier]);

  const register = useCallback(async (payload) => {
    return registerRequest(payload);
  }, []);

  const logout = useCallback(() => {
    persist(null, null);
    setSupplier(null);
  }, [persist]);

  const value = useMemo(
    () => ({
      token,
      user,
      supplier,
      loading,
      isAuthenticated: Boolean(token && user),
      role: normalizeRole(user?.role),
      login,
      register,
      logout,
      refreshUser,
      homePath: portalHome(user?.role),
      errorMessage: getErrorMessage,
    }),
    [token, user, supplier, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
