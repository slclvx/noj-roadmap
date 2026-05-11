import { C, T } from "../lib/theme.js";
import { Card } from "../components/UI.jsx";
import { useLiveState } from "../hooks/useLiveState.js";
import { feedback, playSound } from "../lib/utils.js";

const STREAK_TYPES = [
  { id: "japanese", label: "Japanese Study", emoji: "🎌", color: C.red, desc: "Studied Japanese for 30+ minutes" },
  { id: "code", label: "Coding", emoji: "💻", color: C.blue, desc: "Wrote or shipped any code" },
  { id: "reading", label: "Reading", emoji: "📖", color: C.orange, desc: "Read at least 20 pages of a book" },
  { id: "journal", label: "Journaling", emoji: "📝", color: C.teal, desc: "Logged something to my journal" },
];

export default function StreaksPage({ dark, isOwner, showToast }) {
  const t = T(dark);
  const { state: streaks, save: saveStreaks } = useLiveState("streak_board", {
    japanese: { count: 0, lastDay: "", best: 0 },
    code: { count: 0, lastDay: "", best: 0 },
    reading: { count: 0, lastDay: "", best: 0 },
    journal: { count: 0, lastDay: "", best: 0 },
  }, isOwner);

  const todayKey = new Date().toISOString().slice(0, 10);
  const yesterdayKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const checkIn = (id) => {
    if (!isOwner) return;
    const s = streaks[id] || { count: 0, lastDay: "", best: 0 };
    if (s.lastDay === todayKey) {
      feedback("click", 5);
      showToast("Already checked in today ✓", "info");
      return;
    }
    const wasYesterday = s.lastDay === yesterdayKey;
    const newCount = wasYesterday ? s.count + 1 : 1;
    const newBest = Math.max(newCount, s.best || 0);
    feedback("check", 20);
    saveStreaks({ ...streaks, [id]: { count: newCount, lastDay: todayKey, best: newBest } });
    const milestone = [3, 7, 14, 30, 60, 100, 365].includes(newCount);
    if (milestone) playSound("achievement");
    showToast(milestone ? `🔥 ${newCount} day milestone!` : `+1 · ${newCount} day streak`, "success");
  };

  const breakStreak = (id) => {
    if (!isOwner) return;
    if (!confirm("Reset this streak? (Keeps your best record)")) return;
    const s = streaks[id] || { count: 0, lastDay: "", best: 0 };
    feedback("uncheck", 10);
    saveStreaks({ ...streaks, [id]: { count: 0, lastDay: "", best: s.best || 0 } });
    showToast("Streak reset", "info");
  };

  return (
    <div className="fade-slide" style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", marginBottom: 14, padding: "6px 18px", background: dark ? `${C.orange}22` : "#fff", borderRadius: 99, border: `2px solid ${dark ? `${C.orange}44` : "rgba(255,255,255,0.9)"}`, boxShadow: `0 4px 16px ${C.orange}22` }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontWeight: 700 }}>✦ Daily Discipline ✦</span>
        </div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(30px,7vw,52px)", lineHeight: 1.05, marginBottom: 12, background: `linear-gradient(135deg,${C.red},${C.orange},${C.yellow})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Streaks</h1>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 600, fontStyle: "italic" }}>The four daily things that compound into a career.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {STREAK_TYPES.map((st) => {
          const s = streaks[st.id] || { count: 0, lastDay: "", best: 0 };
          const checkedToday = s.lastDay === todayKey;
          const broken = s.lastDay && s.lastDay !== todayKey && s.lastDay !== yesterdayKey;
          return (
            <Card key={st.id} dark={dark} accent={st.color} style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div className="breathe" style={{ width: 54, height: 54, borderRadius: 18, background: `linear-gradient(135deg,${st.color},${st.color}cc)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: `0 4px 14px ${st.color}55`, flexShrink: 0 }}>{st.emoji}</div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: t.text, marginBottom: 2 }}>{st.label}</div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: t.mute, fontWeight: 600, fontStyle: "italic" }}>{st.desc}</div>
                </div>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 30, color: st.color, lineHeight: 1, display: "flex", alignItems: "baseline", gap: 4 }}>{broken ? "0" : s.count}<span style={{ fontSize: 16 }}>🔥</span></div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: t.mute, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", marginTop: 2 }}>days</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: `1.5px solid ${t.border}`, gap: 8, flexWrap: "wrap" }}>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: t.mute, fontWeight: 700 }}>Best: <span style={{ color: st.color, fontWeight: 800 }}>{s.best || 0} days</span></div>
                {isOwner && (
                  <div style={{ display: "flex", gap: 6 }}>
                    {s.count > 0 && !broken && <button onClick={() => breakStreak(st.id)} title="Reset" style={{ background: "transparent", border: `1.5px solid ${t.border}`, borderRadius: 99, padding: "6px 12px", cursor: "pointer", color: t.mute, fontFamily: "'Nunito',sans-serif", fontSize: 10, fontWeight: 800 }}>↻</button>}
                    <button onClick={() => checkIn(st.id)} disabled={checkedToday} style={{ padding: "7px 18px", borderRadius: 99, border: "none", cursor: checkedToday ? "default" : "pointer", background: checkedToday ? t.pill : `linear-gradient(135deg,${st.color},${st.color}cc)`, color: checkedToday ? t.mute : "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 13, boxShadow: checkedToday ? "none" : `0 3px 12px ${st.color}55`, opacity: checkedToday ? 0.7 : 1 }}>{checkedToday ? "✓ Done today" : "+ Check in"}</button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div style={{ marginTop: 22, padding: "14px 18px", borderRadius: 18, background: dark ? `${C.orange}10` : `${C.orange}08`, border: `1.5px solid ${C.orange}33`, fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontStyle: "italic", lineHeight: 1.7, fontWeight: 600, textAlign: "center" }}>
        🔥 Milestones at <strong>3, 7, 14, 30, 60, 100, 365</strong> days. Don't break the chain.
      </div>
    </div>
  );
}
