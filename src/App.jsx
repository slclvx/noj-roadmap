import { useState, useEffect, useCallback } from "react";
import { T } from "./lib/theme.js";
import { LS, feedback, playSound } from "./lib/utils.js";
import { useToast } from "./hooks/useToast.js";
import { useReminders } from "./hooks/useReminders.js";
import { Toast, Confetti } from "./components/UI.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import { TopNav, Sidebar, BottomNav, NAV_TABS } from "./components/Nav.jsx";
import CommandPalette from "./components/CommandPalette.jsx";

import TodayPage from "./pages/TodayPage.jsx";
import RoadmapPage from "./pages/RoadmapPage.jsx";
import WhyPage from "./pages/WhyPage.jsx";
import TimelinePage from "./pages/TimelinePage.jsx";
import WeeklyPage from "./pages/WeeklyPage.jsx";
import LettersPage from "./pages/LettersPage.jsx";
import QuotesPage from "./pages/QuotesPage.jsx";
import ResourcesPage from "./pages/ResourcesPage.jsx";
import SideQuestsPage from "./pages/SideQuestsPage.jsx";
import JapanesePage from "./pages/JapanesePage.jsx";
import HiraganaPage from "./pages/HiraganaPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import StreaksPage from "./pages/StreaksPage.jsx";
import NetworkPage from "./pages/NetworkPage.jsx";
import PeoplePage from "./pages/PeoplePage.jsx";

export default function App() {
  const [page, setPage] = useState(() => {
    const hash = window.location.hash.slice(1);
    return NAV_TABS.find((tab) => tab.id === hash) ? hash : "today";
  });
  const [dark, setDark] = useState(() => LS.get("noj_theme", true)); // dark default for night reading
  const [sound, setSound] = useState(() => LS.get("noj_sound_enabled", true)); // ON by default
  const [haptics, setHaptics] = useState(() => LS.get("noj_haptics_enabled", true)); // ON by default
  const [sidebar, setSidebar] = useState(false);
  const [isOwner, setIsOwner] = useState(() => LS.get("noj_owner", true)); // own device = owner
  const [confetti, setConfetti] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    try {
      const isStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone;
      const lastSplash = sessionStorage.getItem("noj_splash_seen");
      return isStandalone || !lastSplash;
    } catch {
      return true;
    }
  });

  const { toasts, show: showToast } = useToast();
  const t = T(dark);

  // Persist settings
  useEffect(() => LS.set("noj_theme", dark), [dark]);
  useEffect(() => LS.set("noj_sound_enabled", sound), [sound]);
  useEffect(() => LS.set("noj_haptics_enabled", haptics), [haptics]);

  useEffect(() => {
    if (!showSplash) {
      try { sessionStorage.setItem("noj_splash_seen", "1"); } catch {}
    }
  }, [showSplash]);

  // Update hash on navigate
  useEffect(() => {
    window.location.hash = page;
  }, [page]);

  // Request notification permission after splash
  useEffect(() => {
    if (showSplash) return;
    if (!("Notification" in window)) return;
    if (Notification.permission === "default" && !LS.get("noj_notif_asked", false)) {
      setTimeout(() => {
        if (confirm("Want reminders for your daily streaks and weekly review?")) {
          Notification.requestPermission();
        }
        LS.set("noj_notif_asked", true);
      }, 2200);
    }
  }, [showSplash]);

  useReminders(isOwner);

  const navigate = useCallback((id) => {
    feedback("navigate", 8);
    setPage(id);
    setSidebar(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const fireConfetti = useCallback(() => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3500);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPaletteOpen(true); return; }
      if (e.key === "Escape" && paletteOpen) { setPaletteOpen(false); return; }
      if (e.key === "t" || e.key === "T") navigate("today");
      if (e.key === "r" || e.key === "R") navigate("roadmap");
      if (e.key === "w" || e.key === "W") navigate("why");
      if (e.key === "j" || e.key === "J") navigate("japanese");
      if (e.key === "b" || e.key === "B") navigate("resources");
      if (e.key === "q" || e.key === "Q") navigate("quests");
      if (e.key === "p" || e.key === "P") navigate("people");
      if (e.key === "s" || e.key === "S") navigate("stats");
      if (e.key === "n" || e.key === "N") navigate("network");
      if (e.key === "d" || e.key === "D") setDark((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, paletteOpen]);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    if (next) playSound("click");
    showToast(next ? "🔊 Sounds on" : "🔇 Sounds off", "info");
  };

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  const pageProps = { dark, isOwner, showToast, fireConfetti, navigate };

  return (
    <div
      style={{
        fontFamily: "'Nunito',sans-serif",
        background: t.bodyBg,
        minHeight: "100dvh",
        color: t.text,
        position: "relative",
      }}
    >
      <TopNav
        dark={dark}
        page={page}
        sound={sound}
        onMenu={() => setSidebar(true)}
        onPalette={() => setPaletteOpen(true)}
        onToggleDark={() => setDark((d) => !d)}
        onToggleSound={toggleSound}
      />

      <Sidebar dark={dark} open={sidebar} onClose={() => setSidebar(false)} page={page} navigate={navigate} />

      {paletteOpen && (
        <CommandPalette
          dark={dark}
          onClose={() => setPaletteOpen(false)}
          onNavigate={(id) => { setPaletteOpen(false); navigate(id); }}
        />
      )}

      <main key={page}>
        {page === "today"     && <TodayPage     {...pageProps} />}
        {page === "roadmap"   && <RoadmapPage   {...pageProps} />}
        {page === "why"       && <WhyPage       {...pageProps} />}
        {page === "timeline"  && <TimelinePage  {...pageProps} />}
        {page === "weekly"    && <WeeklyPage    {...pageProps} />}
        {page === "letters"   && <LettersPage   {...pageProps} />}
        {page === "quotes"    && <QuotesPage    {...pageProps} />}
        {page === "resources" && <ResourcesPage {...pageProps} />}
        {page === "quests"    && <SideQuestsPage {...pageProps} />}
        {page === "japanese"  && <JapanesePage  {...pageProps} />}
        {page === "hiragana"  && <HiraganaPage  {...pageProps} />}
        {page === "stats"     && <StatsPage     {...pageProps} />}
        {page === "streaks"   && <StreaksPage   {...pageProps} />}
        {page === "network"   && <NetworkPage   {...pageProps} />}
        {page === "people"    && <PeoplePage    {...pageProps} />}
      </main>

      <BottomNav dark={dark} page={page} navigate={navigate} onMenu={() => setSidebar(true)} />

      <Toast toasts={toasts} dark={dark} />
      <Confetti active={confetti} />
    </div>
  );
}
