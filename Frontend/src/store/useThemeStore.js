import { create } from "zustand";

export const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem("chat-theme") || "light",
  setTheme: () => {
    const currentTheme = get().theme;
    const setTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("chat-theme", setTheme);
    set({ theme: setTheme });
  },
}));
