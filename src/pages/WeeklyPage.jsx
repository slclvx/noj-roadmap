import { useState, useEffect } from "react";
import { C, T } from "../lib/theme.js";
import { Card } from "../components/UI.jsx";
import { useLiveState } from "../hooks/useLiveState.js";
import { feedback } from "../lib/utils.js";

const getWeekKey = (d = new Date()) => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
};

const QUESTIONS = [
  { key: "did", label: "What did I do this week?", emoji: "✅", color: C.green, placeholder: "Concrete things — not feelings." },
  { key: "slipped", label: "What slipped?", emoji: "📉", color: C.orange, placeholder: "What I planned but didn't do. Honest, not self-flagellating." },
  { key: "next", label: "What am I committing to next week?", emoji: "🎯", color: C.blue, placeholder: "Specific. Time-boxed. Realistic." },
  { key: "learned", label: "What did I learn?", emoji: "💡", color: C.purple, placeholder: "About myself, the work, the world." },
];

export default function WeeklyPage({ dark, isOwner, showToast, fireConfetti }) {
  const t = T(dark);
  const { state: reviews, save: saveReviews } = useLiveState("weekly_reviews", [], isOwner);
  const list = Array.isArray(reviews) ? reviews : [];
  const thisWeek = getWeekKey();
  const existing = list.find((r) => r.week === thisWeek);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(existing || { week: thisWeek, did: "", slipped: "", next: "", learned: "" });

  useEffect(() => {
    setDraft(existing || { week: thisWeek, did: "", slipped: "", next: "", learned: "" });
  }, [existing?.week]);

  const save = () => {
    if (!draft.did.trim() && !draft.next.trim()) return showToast("Add at least one answer", "info");
    const next = existing
      ? list.map((r) => (r.week === thisWeek ? { ...draft, savedAt: new Date().toISOString() } : r))
      : [{ ...draft, savedAt: new Date().toISOString() }, ...list];
    saveReviews(next);
    feedback("complete", 20);
    fireConfetti?.();
    showToast("Review saved ✓", "success");
    setEditing(false);
  };

  const isSunday = new Date().getDay() === 0;

  return (
    <div className="fade-slide" style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", marginBottom: 14, padding: "6px 18px", background: dark ? `${C.teal}22` : "#fff", borderRadius: 99, border: `2px solid ${dark ? `${C.teal}44` : "rgba(255,255,255,0.9)"}`, boxShadow: `0 4px 16px ${C.teal}22` }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.teal, textTransform: "uppercase", fontWeight: 700 }}>✦ Sunday Review ✦</span>
        </div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(30px,7vw,56px)", lineHeight: 1.05, marginBottom: 12, background: `linear-gradient(135deg,${C.green},${C.teal},${C.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Weekly Review</h1>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 600, fontStyle: "italic" }}>Iwata kept logs. So do I.</p>
        {isSunday && isOwner && !existing && (
          <div style={{ marginTop: 12, display: "inline-block", padding: "8px 16px", borderRadius: 99, background: `linear-gradient(135deg,${C.orange},${C.yellow})`, color: "#fff", fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 800, boxShadow: `0 4px 14px ${C.orange}44` }}>📋 It's Sunday — time for this week's review</div>
        )}
      </div>

      <Card dark={dark} accent={existing ? C.green : C.teal} style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: existing ? C.green : C.teal, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 3 }}>{thisWeek}</div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: t.text }}>This Week</div>
          </div>
          {existing && !editing && <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 99, background: `${C.green}15`, color: C.green, border: `1.5px solid ${C.green}44` }}>✓ Submitted</div>}
        </div>

        {!editing && existing && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {QUESTIONS.map((q) => existing[q.key] && (
              <div key={q.key}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <span style={{ fontSize: 14 }}>{q.emoji}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: q.color, letterSpacing: 2, textTransform: "uppercase", fontWeight: 800 }}>{q.label}</span>
                </div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.text, fontWeight: 600, lineHeight: 1.65, padding: "10px 14px", borderRadius: 12, background: dark ? `${q.color}10` : `${q.color}06`, border: `1.5px solid ${q.color}22`, whiteSpace: "pre-wrap" }}>{existing[q.key]}</div>
              </div>
            ))}
            {isOwner && <button onClick={() => { feedback("click", 8); setEditing(true); }} style={{ alignSelf: "flex-start", marginTop: 6, padding: "7px 14px", borderRadius: 99, border: `1.5px solid ${t.border}`, cursor: "pointer", background: "transparent", color: t.sub, fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 800 }}>✏️ Edit</button>}
          </div>
        )}

        {!editing && !existing && isOwner && (
          <button onClick={() => { feedback("click", 8); setEditing(true); }} style={{ display: "block", width: "100%", padding: "14px", borderRadius: 14, border: `2px dashed ${C.teal}55`, cursor: "pointer", background: "transparent", color: C.teal, fontFamily: "'Fredoka One',cursive", fontSize: 15 }}>+ Start this week's review</button>
        )}

        {editing && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {QUESTIONS.map((q) => (
              <div key={q.key}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <span style={{ fontSize: 14 }}>{q.emoji}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: q.color, letterSpacing: 2, textTransform: "uppercase", fontWeight: 800 }}>{q.label}</span>
                </div>
                <textarea value={draft[q.key] || ""} onChange={(e) => setDraft({ ...draft, [q.key]: e.target.value })} placeholder={q.placeholder} style={{ width: "100%", minHeight: 70, padding: 12, borderRadius: 12, border: `2px solid ${q.color}33`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 600, outline: "none", resize: "vertical", lineHeight: 1.6 }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setEditing(false)} style={{ padding: "10px 18px", borderRadius: 12, border: `1.5px solid ${t.border}`, cursor: "pointer", background: "transparent", color: t.sub, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800 }}>Cancel</button>
              <button onClick={save} style={{ padding: "10px 22px", borderRadius: 12, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${C.teal},${C.blue})`, color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 14 }}>Save</button>
            </div>
          </div>
        )}
      </Card>

      {list.filter((r) => r.week !== thisWeek).length > 0 && (
        <>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 2, color: t.mute, textTransform: "uppercase", fontWeight: 800, margin: "20px 4px 10px" }}>📚 Past · {list.filter((r) => r.week !== thisWeek).length}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {list.filter((r) => r.week !== thisWeek).slice(0, 12).map((r) => (
              <details key={r.week} style={{ borderRadius: 14, border: `1.5px solid ${t.border}`, background: t.card, overflow: "hidden" }}>
                <summary style={{ padding: "12px 16px", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800, color: t.text }}>{r.week}</summary>
                <div style={{ padding: "0 16px 14px" }}>
                  {QUESTIONS.map((q) => r[q.key] && (
                    <div key={q.key} style={{ marginTop: 10 }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: q.color, letterSpacing: 1, textTransform: "uppercase", fontWeight: 800, marginBottom: 4 }}>{q.emoji} {q.label}</div>
                      <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: t.sub, lineHeight: 1.6, fontWeight: 600, whiteSpace: "pre-wrap" }}>{r[q.key]}</div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
