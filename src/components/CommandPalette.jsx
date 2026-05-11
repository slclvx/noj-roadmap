import { useState, useEffect, useRef } from "react";
import { C, T } from "../lib/theme.js";
import { NAV_TABS } from "./Nav.jsx";
import { PHASES } from "../data/phases.js";
import { DEFAULT_QUESTS } from "../data/quests.js";
import { feedback } from "../lib/utils.js";

export default function CommandPalette({ dark, onClose, onNavigate }) {
  const t = T(dark);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);

  const items = [
    ...NAV_TABS.map((tab) => ({
      type: "page", id: tab.id, label: tab.label, emoji: tab.emoji,
      group: tab.group, keywords: `${tab.label} ${tab.group}`,
    })),
    ...PHASES.map((p) => ({
      type: "phase", id: "roadmap", phaseId: p.id, label: p.title,
      emoji: p.emoji, group: "Phase", keywords: `${p.title} ${p.label} ${p.where} phase`, sub: p.where,
    })),
    ...DEFAULT_QUESTS.map((quest) => ({
      type: "quest", id: "quests", label: quest.title, emoji: quest.emoji,
      group: "Quest", keywords: `${quest.title} ${quest.category} quest`, sub: quest.category,
    })),
  ];

  const filtered = q.trim()
    ? items.filter((i) => i.keywords.toLowerCase().includes(q.toLowerCase())).slice(0, 12)
    : items.slice(0, 10);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setIdx(0);
  }, [q]);

  const select = (item) => {
    feedback("navigate", 8);
    if (item.type === "phase") {
      onNavigate(item.id);
      setTimeout(() => {
        const el = document.getElementById(`p${item.phaseId}`);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 74, behavior: "smooth" });
      }, 150);
    } else {
      onNavigate(item.id);
    }
  };

  const handleKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(filtered.length - 1, i + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    if (e.key === "Enter" && filtered[idx]) { e.preventDefault(); select(filtered[idx]); }
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,15,40,0.65)",
        backdropFilter: "blur(8px)",
        zIndex: 600,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "10vh 16px",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 520,
          background: t.card,
          borderRadius: 22,
          boxShadow: dark ? "0 20px 80px rgba(0,0,0,0.6)" : "0 20px 80px rgba(140,150,240,0.3)",
          overflow: "hidden",
          border: `1px solid ${t.border}`,
          animation: "scaleIn 0.2s cubic-bezier(0.34,1.4,0.64,1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 18px",
            borderBottom: `1.5px solid ${t.border}`,
          }}
        >
          <span style={{ fontSize: 18 }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Jump to anything..."
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontFamily: "'Nunito',sans-serif", fontSize: 16, color: t.text, fontWeight: 600,
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 10,
              color: t.mute,
              padding: "3px 8px",
              borderRadius: 6,
              background: t.soft,
              fontWeight: 700,
            }}
          >
            ESC
          </span>
        </div>
        <div style={{ maxHeight: "50vh", overflowY: "auto", padding: 8 }}>
          {filtered.length === 0 && (
            <div
              style={{
                padding: "24px 16px", textAlign: "center",
                fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.mute, fontWeight: 600,
              }}
            >
              No results — try a different search.
            </div>
          )}
          {filtered.map((item, i) => (
            <button
              key={`${item.type}-${item.id}-${item.phaseId || item.label}`}
              onClick={() => select(item)}
              onMouseEnter={() => setIdx(i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: idx === i ? (dark ? `${C.blue}20` : `${C.blue}10`) : "transparent",
                color: idx === i ? C.blue : t.text,
                textAlign: "left",
                fontFamily: "'Nunito',sans-serif",
                fontWeight: 700,
                fontSize: 14,
                transition: "background 0.1s",
              }}
            >
              <span style={{ fontSize: 18 }}>{item.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.label}
                </div>
                {item.sub && (
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 10,
                      color: t.mute,
                      fontWeight: 600,
                      marginTop: 1,
                      letterSpacing: 0.5,
                    }}
                  >
                    {item.sub}
                  </div>
                )}
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 9,
                  color: t.mute,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                {item.group?.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
        <div
          style={{
            padding: "10px 18px",
            borderTop: `1.5px solid ${t.border}`,
            display: "flex",
            gap: 14,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 9,
            color: t.mute,
            fontWeight: 600,
          }}
        >
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
