import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Attempt, Profile } from "../../types";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  campaignTopics,
  getJourneyProgress,
} from "../../data/mock/expeditions";
import {
  applyAdventureAction,
  initialAdventure,
} from "../../features/adventure/engine";
import type { AdventureAction } from "../../features/adventure/engine";
import type { AdventureState } from "../../types/adventure";
function useAppState() {
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>(
    "listenup.bookmarks",
    [],
  );
  const [legacyAttempts] = useLocalStorage<Attempt[]>("listenup.attempts", []);
  const [adventure, setAdventure] = useLocalStorage<AdventureState>(
    "listenup.adventure.v1",
    initialAdventure,
  );
  const journey = getJourneyProgress(adventure, legacyAttempts);
  const masteredTopics = Object.entries(campaignTopics)
    .filter(
      ([, ids]) => ids.length && ids.every((id) => journey.completed.has(id)),
    )
    .map(([topic]) => topic);
  const act = (action: AdventureAction) => {
    const now = Date.now();
    setAdventure((previous) => {
      if (action.type === "start") {
        const progress = getJourneyProgress(previous, legacyAttempts);
        if (
          progress.lockedCampaigns.has(action.expedition.id) ||
          (action.expedition.kind === "lesson" &&
            progress.lockedLessons.has(action.expedition.id))
        ) {
          return previous;
        }
      }
      return applyAdventureAction(previous, action, now);
    });
  };
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
  return {
    bookmarks,
    toggleBookmark,
    attempts: [...legacyAttempts, ...adventure.attempts],
    adventure,
    journey,
    masteredTopics,
    act,
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
