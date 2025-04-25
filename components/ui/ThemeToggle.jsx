// components/ui/ThemeToggle.jsx
"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-sm"
    >
      Toggle {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
}
