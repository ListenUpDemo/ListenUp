import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Attempt, Profile } from "../../types";
import { useLocalStorage } from "../../hooks/useLocalStorage";
function useAppState() {
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>(
    "listenup.bookmarks",
    [],
  );
  const [attempts, setAttempts] = useLocalStorage<Attempt[]>(
    "listenup.attempts",
    [],
  );
  const [profile, setProfile] = useLocalStorage<Profile>("listenup.profile", {
    name: "Bạn",
    email: "",
    goal: 15,
  });
  const [preferences, setPreferences] = useLocalStorage(
    "listenup.preferences",
    { speed: 1, volume: 0.8, largeTranscript: false },
  );
  const [toast, setToast] = useState("");
  const notify = (message: string) => setToast(message);
  const toggleBookmark = (id: string) =>
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  const addAttempt = (attempt: Attempt) =>
    setAttempts((prev) => [...prev, attempt]);
  return {
    bookmarks,
    toggleBookmark,
    attempts,
    addAttempt,
    profile,
    setProfile,
    preferences,
    setPreferences,
    toast,
    setToast,
    notify,
  };
}
type AppState = ReturnType<typeof useAppState>;
const AppContext = createContext<AppState | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const state = useAppState();
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("AppProvider is required");
  return context;
}
