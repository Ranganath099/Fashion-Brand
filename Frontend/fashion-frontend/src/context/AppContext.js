"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchCart } from "@/lib/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  /* =====================
     LOAD CART
  ===================== */
  const loadCart = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const data = await fetchCart();
      const count = (data.items || []).reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(count);
    } catch (err) {
      console.error("Cart load failed", err);
      setCartCount(0);
    }
  };

  /* =====================
     AUTH + CART SYNC
  ===================== */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLoggedIn(false);
      loadCart(); // 👈 load guest cart
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    loadCart().finally(() => setLoading(false));
  }, [pathname]);

  /* =====================
     🔥 CART UPDATED LISTENER
  ===================== */
  useEffect(() => {
    const onCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cartUpdated", onCartUpdate);
    return () =>
      window.removeEventListener("cartUpdated", onCartUpdate);
  }, []);

  /* =====================
     AUTH ACTIONS
  ===================== */
  const login = async (tokens) => {
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);

    setIsLoggedIn(true);
    await loadCart(); // 👈 immediately load backend cart
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setIsLoggedIn(false);
    setCartCount(0);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        cartCount,
        loadCart,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return ctx;
}
