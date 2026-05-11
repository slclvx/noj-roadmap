import { useMemo } from "react";
import { C, T } from "../lib/theme.js";
import { Card, StatCard, ProgressBar } from "../components/UI.jsx";
import { PHASES, getCurrentPhaseId, isPhaseInProgress, isPhaseComplete } from "../data/phases.js";
import { BOOK_PHASES } from "../data/books.js";
import { DEFAULT_QUESTS, QUOTES } from "../data/quests.js";
import { useLiveState } from "../hooks/useLiveState.js";
import { feedback } from "../lib/utils.js";

const BIRTHDAY = new Date(2011, 9, 7);

export default function TodayPage({ dark, isOwner, navigate }) {
  const t = T(dark);
  const today = new Date();
  const ageYears = today.getFullYear() - BIRTHDAY.getFullYear() -
    (today.getMonth() < 9 || (today.getMonth() === 9 && today.getDate() < 7) ? 1 : 0);

  const { state: phaseChecks } = useLiveState("phase_checks", {}, isOwner);
  const { state: actionChecks } = useLiveState("action_checks", {}, isOwner);
  const { state: reading } = useLiveState("currently_reading", {}, isOwner);
  const { state: questStatus } = useLiveState("quest_statuses", {}, isOwner);
  const { state: streaks } = useLiveState("streak_board", {}, isOwner);

  const currentPhaseId = getCurrentPhaseId(phaseChecks, actionChecks);
  const currentPhase = PHASES.find((p) => p.id === currentPhaseId) || PHASES[0];
  const hasStarted = PHASES.some((p) => isPhaseInProgress(p, phaseChecks, actionChecks) || isPhaseComplete(p, phaseChecks, actionChecks));
  const allDone = PHASES.every((p) => isPhaseComplete(p, phaseChecks, actionChecks));
  const inProgressPhase = PHASES.find((p) => isPhaseInProgress(p, phaseChecks, actionChecks));

  const readingBooks = useMemo(() => {
    const out = [];
    BOOK_PHASES.forEach((p) =>
      p.books.forEach((b) => {
        if (reading[b.num]) out.push({ ...b, phaseAccent: p.accent, phaseLabel: p.label });
      })
    );
    return out;
  }, [reading]);

  const activeQuests = DEFAULT_QUESTS.filter(
    (q) => (questStatus[q.id] || q.status) === "In Progress"
  ).slice(0, 4);

  const phaseTotal = currentPhase.milestones.length;
  const phaseDone = currentPhase.milestones.filter(
    (_, i) => phaseChecks[`${currentPhase.id}-${i}`]
  ).length;

  // Total streak count (max of all streaks)
  const maxStreak = Math.max(0, ...Object.values(streaks).map((s) => (s?.count || 0)));

  const greeting = () => {
    const h = today.getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const statusBanner = !hasStarted
    ? { emoji: "🌱", title: "Haven't started yet", color: t.mute }
    : allDone
    ? { emoji: "👑", title: "You did it.", color: C.yellow }
    : inProgressPhase
    ? { emoji: currentPhase.emoji, title: `In ${currentPhase.title}`, color: currentPhase.accent }
    : { emoji: "⏭", title: `Next: ${currentPhase.title}`, color: currentPhase.accent };

  // Quote of the day (deterministic per day)
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const todaysQuote = QUOTES[dayOfYear % QUOTES.length];

  const copyQuote = () => {
    feedback("click", 8);
    try {
      navigator.clipboard?.writeText(`"${todaysQuote.text}" — ${todaysQuote.author}`);
    } catch {}
  };

  return (
    <div className="fade-slide" style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 100px" }}>
      {/* Hero greeting */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 11,
            color: t.mute,
            letterSpacing: 3,
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {dateStr}
        </div>
        <h1
          style={{
            fontFamily: "'Fredoka One',cursive",
            fontSize: "clamp(28px,7vw,42px)",
            lineHeight: 1.05,
            marginBottom: 10,
            background: `linear-gradient(135deg,${C.blue},${C.purple},${C.pink})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {greeting()}, sebastian.
        </h1>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, color: t.sub, fontWeight: 600 }}>
          You're {ageYears} —{" "}
          <span style={{ color: statusBanner.color, fontWeight: 800 }}>
            {statusBanner.emoji} {statusBanner.title}
          </span>
        </p>
      </div>

      {/* Current phase card */}
      <Card
        dark={dark}
        accent={currentPhase.accent}
        onClick={() => navigate("roadmap")}
        style={{ marginBottom: 14, padding: 22 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div
            className="breathe"
            style={{
              fontSize: 40,
              lineHeight: 1,
              filter: `drop-shadow(0 4px 12px ${currentPhase.accent}66)`,
            }}
          >
            {currentPhase.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 9,
                color: currentPhase.accent,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 2,
              }}
            >
              {currentPhase.label} · Age {currentPhase.age}
            </div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: t.text }}>
              {currentPhase.title}
            </div>
          </div>
          <div
            style={{
              fontFamily: "'Fredoka One',cursive",
              fontSize: 18,
              color: currentPhase.accent,
            }}
          >
            {phaseDone}/{phaseTotal}
          </div>
        </div>
        <p
          style={{
            fontFamily: "'Nunito',sans-serif",
            fontSize: 13,
            color: t.sub,
            fontWeight: 600,
            fontStyle: "italic",
            marginBottom: 14,
            lineHeight: 1.6,
          }}
        >
          "{currentPhase.tagline}"
        </p>
        <ProgressBar value={phaseDone} total={phaseTotal} color={currentPhase.accent} dark={dark} />
      </Card>

      {/* Streak + reading row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 14 }}>
        <Card dark={dark} accent={C.orange} onClick={() => navigate("streaks")} style={{ padding: 20, textAlign: "center" }}>
          <div className="breathe" style={{ fontSize: 44, lineHeight: 1, marginBottom: 6 }}>🔥</div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 36, color: C.orange, lineHeight: 1 }}>
            {maxStreak}
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 9,
              color: t.mute,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginTop: 6,
              fontWeight: 700,
            }}
          >
            Day Streak
          </div>
        </Card>
        <Card dark={dark} accent={C.purple} onClick={() => navigate("resources")} style={{ padding: 20 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 9,
              color: C.purple,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            📖 Currently Reading
          </div>
          {readingBooks.length === 0 ? (
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.mute, fontWeight: 600, fontStyle: "italic", padding: "8px 0" }}>
              No books in progress. Tap to pick one →
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {readingBooks.slice(0, 3).map((b) => (
                <div
                  key={b.num}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    background: dark ? `${b.phaseAccent}10` : `${b.phaseAccent}08`,
                    border: `1.5px solid ${b.phaseAccent}33`,
                  }}
                >
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800, color: t.text }}>
                    {b.title}
                  </div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, color: t.mute, fontWeight: 700 }}>
                    {b.sub}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Active quests */}
      <Card dark={dark} accent={C.red} style={{ padding: 20, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 9,
              color: C.red,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            ⚔️ Active Quests
          </div>
          <button
            onClick={() => navigate("quests")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Nunito',sans-serif",
              fontSize: 11,
              color: C.red,
              fontWeight: 800,
            }}
          >
            See all →
          </button>
        </div>
        {activeQuests.length === 0 ? (
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.mute, fontWeight: 600, fontStyle: "italic" }}>
            No active quests right now. Time to start one.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {activeQuests.map((q) => (
              <button
                key={q.id}
                onClick={() => navigate("quests")}
                style={{
                  padding: "10px 14px",
                  borderRadius: 14,
                  background: dark ? `${q.color}12` : `${q.color}08`,
                  border: `1.5px solid ${q.color}33`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: 22 }}>{q.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Nunito',sans-serif",
                      fontSize: 12,
                      fontWeight: 800,
                      color: t.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {q.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 9,
                      color: q.color,
                      letterSpacing: 1,
                      fontWeight: 700,
                    }}
                  >
                    {q.category}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Quote of the day */}
      <Card dark={dark} accent={C.yellow} style={{ padding: 20, marginBottom: 14, position: "relative", overflow: "hidden" }} onClick={copyQuote}>
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 12,
            fontFamily: "'Fredoka One',cursive",
            fontSize: 60,
            color: `${todaysQuote.color}28`,
            lineHeight: 1,
          }}
        >
          "
        </div>
        <div style={{ paddingLeft: 32, paddingTop: 4 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 9,
              color: todaysQuote.color,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            ✦ Quote of the day
          </div>
          <p
            style={{
              fontFamily: "'Nunito',sans-serif",
              fontSize: 14,
              color: t.text,
              fontWeight: 700,
              fontStyle: "italic",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {todaysQuote.text}
          </p>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 10,
                color: todaysQuote.color,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              — {todaysQuote.author}
            </span>
            <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, color: t.mute, fontWeight: 700 }}>
              tap to copy
            </span>
          </div>
        </div>
      </Card>

      {/* Quick nav grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
        {[
          { id: "why", emoji: "💭", label: "Why", color: C.purple },
          { id: "japanese", emoji: "🎌", label: "Japanese", color: C.red },
          { id: "hiragana", emoji: "あ", label: "Hiragana", color: C.pink },
          { id: "timeline", emoji: "📅", label: "Journal", color: C.teal },
          { id: "weekly", emoji: "📋", label: "Weekly", color: C.green },
          { id: "letters", emoji: "✉️", label: "Letters", color: C.purple },
          { id: "stats", emoji: "📊", label: "Stats", color: C.blue },
          { id: "people", emoji: "👥", label: "Predecessors", color: C.orange },
        ].map((b) => (
          <button
            key={b.id}
            onClick={() => navigate(b.id)}
            style={{
              padding: "14px 8px",
              borderRadius: 18,
              border: `2px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)"}`,
              background: dark ? `${b.color}15` : `linear-gradient(145deg,#fff,${b.color}10)`,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              boxShadow: `0 6px 20px ${b.color}20`,
              transition: "transform 0.15s",
            }}
          >
            <div style={{ fontSize: 24 }}>{b.emoji}</div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 800, color: b.color }}>
              {b.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
