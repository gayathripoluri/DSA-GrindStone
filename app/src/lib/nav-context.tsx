"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface NavVisibilityContextValue {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
}

const NavVisibilityContext = createContext<NavVisibilityContextValue | null>(null);

export function NavVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [hidden, setHiddenState] = useState(false);
  const setHidden = useCallback((v: boolean) => setHiddenState(v), []);
  return (
    <NavVisibilityContext.Provider value={{ hidden, setHidden }}>
      {children}
    </NavVisibilityContext.Provider>
  );
}

export function useNavVisibility() {
  const ctx = useContext(NavVisibilityContext);
  if (!ctx) throw new Error("useNavVisibility must be used within NavVisibilityProvider");
  return ctx;
}
