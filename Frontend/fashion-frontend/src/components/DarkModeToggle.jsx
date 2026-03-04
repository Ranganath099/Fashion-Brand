"use client";

import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";

const THEME_LABELS = {
  light: { label: "Light", icon: <Sun size={16} /> },
  dark: { label: "Dark", icon: <Moon size={16} /> },
  system: { label: "Device", icon: <Monitor size={16} /> },
};

export default function ThemeMenu() {
  const [theme, setTheme] = useState("system");
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

 const applyTheme = (mode) => {
  const root = document.documentElement;

  root.setAttribute("data-theme", mode);

  if (mode === "dark") {
    root.classList.add("dark");
  } else if (mode === "light") {
    root.classList.remove("dark");
  } else {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", isDark);
  }
};


  useEffect(() => {
    const saved = localStorage.getItem("theme") || "system";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const Current = THEME_LABELS[theme];

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2
          px-3 py-2 rounded-md
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-900
          text-gray-900 dark:text-gray-100
          hover:bg-gray-100 dark:hover:bg-gray-800
          cursor-pointer
        "
      >
        {Current.icon}
        <span>{Current.label}</span>
        <ChevronDown size={14} />
      </button>

      {/* Menu */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 w-44
            rounded-md shadow-lg
            border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900
            z-50
            cursor-pointer
            
          "
        >
          {Object.entries(THEME_LABELS).map(([key, item]) => (
            <MenuItem
              key={key}
              active={theme === key}
              onClick={() => {
                setTheme(key);
                setOpen(false);
              }}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================
   Menu Item
========================= */
function MenuItem({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full
        px-4 py-2 text-sm
        transition-colors
        cursor-pointer
        
        ${
          active
            ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-black"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
