import { useEffect } from "react";
import { C, T } from "../lib/theme.js";
import { feedback } from "../lib/utils.js";

export const NAV_TABS = [
  { id: "today",     emoji: "☀️", label: "Today",        group: "Plan" },
  { id: "why",       emoji: "💭", label: "Why",          group: "Plan" },
  { id: "roadmap",   emoji: "🗺",  label: "Roadmap",      group: "Plan" },
  { id: "quests",    emoji: "⚔️", label: "Side Quests",  group: "Plan" },
  { id: "japanese",  emoji: "🎌", label: "Japanese",     group: "Track" },
  { id: "hiragana",  emoji: "あ",  label: "Hiragana",     group: "Track" },
  { id: "streaks",   emoji: "🔥", label: "Streaks",      group: "Track" },
  { id: "resources", emoji: "📚", label: "Resources",    group: "Track" },
  { id: "stats",     emoji: "📊", label: "Stats",        group: "Track" },
  { id: "timeline",  emoji: "📅", label: "Journal",      group: "Reflect" },
  { id: "weekly",    emoji: "📋", label: "Weekly",       group: "Reflect" },
  { id: "letters",   emoji: "✉️", label: "Letters",      group: "Reflect" },
  { id: "quotes",    emoji: "💬", label: "Quotes",       group: "Inspire" },
  { id: "network",   emoji: "🤝", label: "Network",      group: "Inspire" },
  { id: "people",    emoji: "👥", label: "Predecessors", group: "Inspire" },
];

const MOBILE_BOTTOM_TABS = ["today", "roadmap", "japanese", "quests"];

// Top nav (sticky)
export function TopNav({ dark, page, onMenu, onPalette, onToggleDark, onToggleSound, sound }) {
  const t = T(dark);
  const currentLabel = NAV_TABS.find((tab) => tab.id === page)?.label || "";

  return (
    <nav
      className="safe-top"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: t.nav,
        backdropFilter: "blur(20px) saturate(1.6)",
        WebkitBackdropFilter: "blur(20px) saturate(1.6)",
        borderBottom: `1px solid ${t.border}`,
        padding: "0 12px",
        paddingTop: "calc(env(safe-area-inset-top) + 0px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "calc(56px + env(safe-area-inset-top))",
        gap: 8,
      }}
    >
      <button
        onClick={() => { feedback("click", 5); onMenu(); }}
        style={{
          width: 40, height: 40, borderRadius: 12,
          border: `1.5px solid ${t.border}`,
          background: t.card, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: t.shadowS,
        }}
      >
        ☰
      </button>

      <div
        style={{
          fontFamily: "'Fredoka One',cursive",
          fontSize: 17,
          background: `linear-gradient(135deg,${C.red},${C.purple},${C.blue})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          flex: 1,
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {currentLabel}
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => { feedback("click", 5); onPalette(); }}
          title="Search (⌘K)"
          style={{
            width: 40, height: 40, borderRadius: 12,
            border: `1.5px solid ${t.border}`,
            background: t.card, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, boxShadow: t.shadowS,
          }}
        >
          🔍
        </button>
        <button
          onClick={() => { feedback("click", 5); onToggleSound(); }}
          title={sound ? "Sounds on" : "Sounds off"}
          style={{
            width: 40, height: 40, borderRadius: 12,
            border: `1.5px solid ${t.border}`,
            background: t.card, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, boxShadow: t.shadowS,
            opacity: sound ? 1 : 0.5,
          }}
        >
          {sound ? "🔊" : "🔇"}
        </button>
        <button
          onClick={() => { feedback("click", 5); onToggleDark(); }}
          style={{
            width: 40, height: 40, borderRadius: 12,
            border: `1.5px solid ${t.border}`,
            background: t.card, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, boxShadow: t.shadowS,
          }}
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

// Sidebar drawer
export function Sidebar({ dark, open, onClose, page, navigate }) {
  const t = T(dark);
  const groups = Array.from(new Set(NAV_TABS.map((tab) => tab.group)));

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(10,15,40,0.5)",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.2s",
          }}
        />
      )}
      <div
        className="safe-top"
        style={{
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          width: "min(280px, 80vw)",
          zIndex: 210,
          background: t.card,
          borderRight: `1px solid ${t.border}`,
          boxShadow: open ? t.shadowL : "none",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.34,1.1,0.64,1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              fontFamily: "'Fredoka One',cursive",
              fontSize: 22,
              background: `linear-gradient(135deg,${C.red},${C.blue})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            🎮 NOJ Path
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 10,
              border: "none", background: "transparent",
              cursor: "pointer", color: t.mute, fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, padding: "0 8px 24px" }}>
          {groups.map((group) => (
            <div key={group} style={{ marginBottom: 8 }}>
              <div
                style={{
                  padding: "10px 12px 6px",
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 9,
                  fontWeight: 800,
                  color: t.mute,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {group}
              </div>
              {NAV_TABS.filter((tab) => tab.group === group).map((tab) => {
                const active = page === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigate(tab.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 14,
                      border: "none",
                      cursor: "pointer",
                      background: active
                        ? `linear-gradient(135deg,${C.blue},${C.sky})`
                        : "transparent",
                      color: active ? "#fff" : t.sub,
                      fontFamily: "'Nunito',sans-serif",
                      fontSize: 14,
                      fontWeight: active ? 800 : 700,
                      textAlign: "left",
                      transition: "all 0.15s",
                      marginBottom: 2,
                      boxShadow: active ? `0 4px 14px ${C.blue}44` : "none",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{tab.emoji}</span>
                    <span style={{ flex: 1 }}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Bottom nav (mobile)
export function BottomNav({ dark, page, navigate, onMenu }) {
  const t = T(dark);
  return (
    <nav
      className="safe-bottom"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        background: t.nav,
        backdropFilter: "blur(20px) saturate(1.6)",
        WebkitBackdropFilter: "blur(20px) saturate(1.6)",
        borderTop: `1px solid ${t.border}`,
        display: "flex",
        padding: "6px 4px calc(6px + env(safe-area-inset-bottom)) 4px",
        gap: 2,
      }}
    >
      {NAV_TABS.filter((tab) => MOBILE_BOTTOM_TABS.includes(tab.id)).map((tab) => {
        const active = page === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              padding: "8px 4px",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              background: active ? `${C.blue}18` : "transparent",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1, transform: active ? "scale(1.1)" : "scale(1)", transition: "transform 0.2s" }}>
              {tab.emoji}
            </span>
            <span
              style={{
                fontFamily: "'Nunito',sans-serif",
                fontSize: 10,
                fontWeight: 800,
                color: active ? C.blue : t.mute,
              }}
            >
              {tab.label}
            </span>
            {active && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(2px + env(safe-area-inset-bottom))",
                  width: 22,
                  height: 3,
                  borderRadius: 99,
                  background: `linear-gradient(90deg,${C.blue},${C.sky})`,
                }}
              />
            )}
          </button>
        );
      })}
      <button
        onClick={() => { feedback("click", 5); onMenu(); }}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          padding: "8px 4px",
          borderRadius: 14,
          border: "none",
          cursor: "pointer",
          background: "transparent",
        }}
      >
        <span style={{ fontSize: 22, lineHeight: 1 }}>☰</span>
        <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, fontWeight: 800, color: t.mute }}>More</span>
      </button>
    </nav>
  );
}
