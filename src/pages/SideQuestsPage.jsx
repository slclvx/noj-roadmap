import { useState, useEffect } from "react";
import { C, T, QUEST_STATUSES } from "../lib/theme.js";
import { Card, Pill, Check, ProgressBar } from "../components/UI.jsx";
import { DEFAULT_QUESTS } from "../data/quests.js";
import { useLiveState } from "../hooks/useLiveState.js";
import { feedback, playSound } from "../lib/utils.js";

export default function SideQuestsPage({ dark, isOwner, showToast, fireConfetti }) {
  const t = T(dark);
  const { state: statuses, save: saveStatuses } = useLiveState("quest_statuses", {}, isOwner);
  const { state: questChecks, save: saveQuestChecks } = useLiveState("quest_checks", {}, isOwner);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  const categories = ["all", ...Array.from(new Set(DEFAULT_QUESTS.map((q) => q.category)))];
  const filtered = filter === "all" ? DEFAULT_QUESTS : DEFAULT_QUESTS.filter((q) => q.category === filter);
  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (a.sortAge || 99) - (b.sortAge || 99);
  });

  const cycleStatus = (id) => {
    if (!isOwner) return;
    const quest = DEFAULT_QUESTS.find((q) => q.id === id);
    const cur = statuses[id] || quest.status;
    const idx = QUEST_STATUSES.indexOf(cur);
    const newStatus = QUEST_STATUSES[(idx + 1) % QUEST_STATUSES.length];
    feedback(newStatus === "Complete" ? "complete" : "click", 12);
    saveStatuses({ ...statuses, [id]: newStatus });
    if (newStatus === "Complete") {
      fireConfetti?.();
      showToast(`🎉 ${quest.title} complete!`, "success");
    }
  };

  const toggleQuestCheck = (questId, mIdx) => {
    if (!isOwner) return;
    const key = `${questId}-${mIdx}`;
    const next = { ...questChecks, [key]: !questChecks[key] };
    feedback(next[key] ? "check" : "uncheck", next[key] ? 15 : 10);
    saveQuestChecks(next);
  };

  const liveCounter = (start) => {
    const ms = now - new Date(start).getTime();
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30.44);
    const remDays = Math.floor(days - months * 30.44);
    const weeks = Math.floor(remDays / 7);
    const finalDays = remDays - weeks * 7;
    const parts = [];
    if (months) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
    if (weeks) parts.push(`${weeks} week${weeks !== 1 ? "s" : ""}`);
    if (finalDays || (!months && !weeks)) parts.push(`${finalDays} day${finalDays !== 1 ? "s" : ""}`);
    return { display: parts.join(", "), days };
  };

  return (
    <div className="fade-slide" style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", marginBottom: 14, padding: "6px 18px", background: dark ? `${C.red}22` : "#fff", borderRadius: 99, border: `2px solid ${dark ? `${C.red}44` : "rgba(255,255,255,0.9)"}`, boxShadow: `0 4px 16px ${C.red}22` }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.red, textTransform: "uppercase", fontWeight: 700 }}>✦ Side Quests ✦</span>
        </div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(30px,7vw,52px)", lineHeight: 1.05, marginBottom: 12, background: `linear-gradient(135deg,${C.red},${C.pink},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Side Quests</h1>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 18 }}>
        {categories.map((cat) => {
          const count = cat === "all" ? DEFAULT_QUESTS.length : DEFAULT_QUESTS.filter((q) => q.category === cat).length;
          return <Pill key={cat} label={`${cat === "all" ? "All" : cat} · ${count}`} active={filter === cat} color={C.red} onClick={() => setFilter(cat)} dark={dark} small />;
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {sorted.map((q) => {
          const status = statuses[q.id] || q.status;
          const isOpen = open === q.id;
          const milestones = q.milestones || [];
          const doneCount = milestones.filter((_, i) => questChecks[`${q.id}-${i}`]).length;
          const counter = q.liveCounter && q.startDate ? liveCounter(q.startDate) : null;
          const statusColors = {
            "Not Started": { color: t.mute, bg: t.pill },
            "In Progress": { color: C.yellow, bg: `${C.yellow}15` },
            "Complete": { color: C.green, bg: `${C.green}15` },
          };
          const sc = statusColors[status];

          return (
            <Card key={q.id} dark={dark} accent={q.color} style={{ padding: 18, ...(q.pinned ? { borderColor: q.color, boxShadow: `0 8px 28px ${q.color}33` } : {}) }}>
              {q.pinned && (
                <div style={{ display: "inline-block", padding: "2px 8px", borderRadius: 99, background: `linear-gradient(135deg,${q.color},${q.color}cc)`, color: "#fff", fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>📌 Pinned</div>
              )}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                <div style={{ fontSize: 32, lineHeight: 1, filter: `drop-shadow(0 3px 8px ${q.color}44)` }}>{q.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: t.text, lineHeight: 1.2 }}>{q.title}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: q.color, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginTop: 2 }}>{q.category}</div>
                </div>
                <button
                  onClick={() => cycleStatus(q.id)}
                  disabled={!isOwner}
                  style={{ padding: "3px 8px", borderRadius: 99, background: sc.bg, color: sc.color, fontFamily: "'Nunito',sans-serif", fontSize: 9, fontWeight: 800, border: `1.5px solid ${sc.color}44`, cursor: isOwner ? "pointer" : "default", whiteSpace: "nowrap" }}
                >
                  {isOwner ? "⟳ " : ""}{status}
                </button>
              </div>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: t.sub, fontWeight: 600, lineHeight: 1.55, marginBottom: 10 }}>{q.description}</p>
              {counter && (
                <div style={{ padding: "10px 14px", borderRadius: 12, background: `linear-gradient(135deg,${q.color}15,${q.color}08)`, border: `1.5px solid ${q.color}33`, marginBottom: 10, textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: q.color, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>♡ Together</div>
                  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: q.color }}>{counter.display}</div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, color: t.mute, fontWeight: 700, marginTop: 2 }}>{counter.days} days and counting ✨</div>
                </div>
              )}
              {milestones.length > 0 && (
                <>
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, fontSize: 10 }}>
                      <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: q.color }}>{doneCount}/{milestones.length} complete</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", color: t.mute, fontWeight: 700 }}>{Math.round((doneCount / milestones.length) * 100)}%</span>
                    </div>
                    <ProgressBar value={doneCount} total={milestones.length} color={q.color} dark={dark} height={6} />
                  </div>
                  {isOpen && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1.5px solid ${t.border}` }}>
                      {milestones.map((m, i) => {
                        const done = !!questChecks[`${q.id}-${i}`];
                        return (
                          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "7px 0" }}>
                            <Check done={done} accent={q.color} disabled={!isOwner} onClick={() => toggleQuestCheck(q.id, i)} size={20} />
                            <div style={{ flex: 1, fontFamily: "'Nunito',sans-serif", fontSize: 12, color: t.text, lineHeight: 1.5, fontWeight: 600, textDecoration: done ? "line-through" : "none", opacity: done ? 0.55 : 1 }}>{m}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <button onClick={() => { feedback("click", 5); setOpen(isOpen ? null : q.id); }} style={{ marginTop: 8, width: "100%", padding: 6, borderRadius: 10, border: "none", background: "transparent", color: q.color, fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>{isOpen ? "▴ Less" : "▾ More"}</button>
                </>
              )}
              {q.targetDate && <div style={{ marginTop: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: t.mute, letterSpacing: 1, fontWeight: 700, textAlign: "right" }}>🎯 {q.targetDate}</div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
