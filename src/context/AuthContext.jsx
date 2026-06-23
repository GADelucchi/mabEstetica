// Imports
import { createContext, useState, useContext, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../config/apiConfig";

// Exports
export const AuthContext = createContext();

const INACTIVITY_LIMIT_MS = 6 * 60 * 60 * 1000; // 6 horas
const LAST_ACTIVITY_KEY = "mab_last_activity";

const loadUser = () => {
  try {
    const raw = localStorage.getItem("mab_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [loguedIn, setLoguedInState] = useState(() => {
    if (localStorage.getItem("loguedIn") !== "true") return false;
    const last = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || 0);
    return Date.now() - last < INACTIVITY_LIMIT_MS;
  });
  const [user, setUserState] = useState(() => (loguedIn ? loadUser() : null));
  const inactivityTimer = useRef(null);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/session/logout`, { method: "POST", credentials: "include" });
    } catch {
      // ignorar errores de red al cerrar sesión
    }
    localStorage.removeItem("loguedIn");
    localStorage.removeItem("mab_user");
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    setLoguedInState(false);
    setUserState(null);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(logout, INACTIVITY_LIMIT_MS);
  }, [logout]);

  const setLogedIn = useCallback((value, userData = null) => {
    if (value) {
      localStorage.setItem("loguedIn", "true");
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
      if (userData) {
        localStorage.setItem("mab_user", JSON.stringify(userData));
        setUserState(userData);
      }
      setLoguedInState(true);
    } else {
      logout();
    }
  }, [logout]);

  // Iniciar/limpiar timer de inactividad según estado de login
  useEffect(() => {
    if (!loguedIn) {
      clearTimeout(inactivityTimer.current);
      return;
    }

    const last = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || 0);
    const remaining = INACTIVITY_LIMIT_MS - (Date.now() - last);
    if (remaining <= 0) {
      logout();
      return;
    }

    inactivityTimer.current = setTimeout(logout, remaining);

    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer, { passive: true }));

    return () => {
      clearTimeout(inactivityTimer.current);
      events.forEach((e) => window.removeEventListener(e, resetInactivityTimer));
    };
  }, [loguedIn, logout, resetInactivityTimer]);

  return (
    <AuthContext.Provider value={{ loguedIn, user, setLogedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
