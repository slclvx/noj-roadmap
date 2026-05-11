import { useState } from "react";
import { C, T } from "../lib/theme.js";
import { Card, Pill } from "../components/UI.jsx";
import { useLiveState } from "../hooks/useLiveState.js";
import { feedback } from "../lib/utils.js";

const CATEGORIES = [
  { id: "milestone", label: "Milestone", emoji: "🏁", color: C.green },
  { id: "japanese",  label: "Japanese",  emoji: "🎌", color: C.red },
  { id: "code",      label: "Code",      emoji: "💻", color: C.blue },
  { id: "life",      label: "Life",      emoji: "💖", color: C.pink },
  { id: "lesson",    label: "Lesson",    emoji: "💡", color: C.yellow },
  { id: "reading",   label: "Reading",   emoji: "📖", color: C.orange },
];

export default function TimelinePage({ dark, isOwner, showToast, fireConfetti }) {
  const t = T(dark);
  const { state: entries, save: saveEntries } = useLiveState("journal_entries", [], isOwner);
  const list = Array.isArray(entries) ? entries : [];

  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState({ category: "milestone", title: "", body: "", date: new Date().toISOString().slice(0, 10) });

  const add = () => {
    if (!draft.title.trim()) return showToast("Add a title", "info");
    saveEntries([{ ...draft, id: Date.now() }, ...list]);
    feedback("complete", 20);
    fireConfetti?.();
    showToast("Entry saved ✓", "success");
    setAdding(false);
    setDraft({ category: "milestone", title: "", body: "", date: new Date().toISOString().slice(0, 10) });
  };

  const remove = (id) => {
    if (!confirm("Delete this entry?")) return;
    saveEntries(list.filter((e) => e.id !== id));
    feedback("uncheck", 10);
  };

  const filtered = filter === "all" ? list : list.filter((e) => e.category === filter);
  const sorted = [...filtered].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  // Group by year
  const grouped = {};
  sorted.forEach((e) => {
    const year = (e.date || "").slice(0, 4) || "Undated";
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(e);
  });

  return (
    <div className="fade-slide" style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", marginBottom: 14, padding: "6px 18px", background: dark ? `${C.teal}22` : "#fff", borderRadius: 99, border: `2px solid ${dark ? `${C.teal}44` : "rgba(255,255,255,0.9)"}`, boxShadow: `0 4px 16px ${C.teal}22` }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.teal, textTransform: "uppercase", fontWeight: 700 }}>✦ The Journal ✦</span>
        </div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(30px,7vw,52px)", lineHeight: 1.05, marginBottom: 12, background: `linear-gradient(135deg,${C.teal},${C.blue},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Timeline</h1>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 600, fontStyle: "italic" }}>{list.length} {list.length === 1 ? "entry" : "entries"} so far.</p>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
        <Pill label={`All · ${list.length}`} active={filter === "all"} color={C.blue} onClick={() => setFilter("all")} dark={dark} small />
        {CATEGORIES.map((c) => {
          const count = list.filter((e) => e.category === c.id).length;
          return <Pill key={c.id} label={`${c.emoji} ${c.label} · ${count}`} active={filter === c.id} color={c.color} onClick={() => setFilter(c.id)} dark={dark} small />;
        })}
      </div>

      {isOwner && !adding && (
        <button onClick={() => { feedback("click", 8); setAdding(true); }} style={{ display: "block", margin: "0 auto 18px", padding: "11px 22px", borderRadius: 99, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${C.teal},${C.blue})`, color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 14, boxShadow: `0 4px 18px ${C.teal}44` }}>+ Add entry</button>
      )}

      {adding && (
        <Card dark={dark} accent={C.teal} style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <Pill key={c.id} label={`${c.emoji} ${c.label}`} active={draft.category === c.id} color={c.color} onClick={() => setDraft({ ...draft, category: c.id })} dark={dark} small />
            ))}
          </div>
          <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 600, marginBottom: 10 }} />
          <input placeholder="Title (one line)" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 10 }} />
          <textarea placeholder="What happened? What did you learn?" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} style={{ width: "100%", minHeight: 100, padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 600, resize: "vertical", lineHeight: 1.6, marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setAdding(false)} style={{ padding: "9px 18px", borderRadius: 12, border: `1.5px solid ${t.border}`, cursor: "pointer", background: "transparent", color: t.sub, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800 }}>Cancel</button>
            <button onClick={add} style={{ padding: "9px 22px", borderRadius: 12, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${C.teal},${C.blue})`, color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 14 }}>Save</button>
          </div>
        </Card>
      )}

      {list.length === 0 && !adding && (
        <div style={{ textAlign: "center", padding: "32px 20px", fontFamily: "'Nunito',sans-serif", color: t.mute, fontSize: 13, fontWeight: 600, fontStyle: "italic" }}>No entries yet. Document something you'll want to remember.</div>
      )}

      {Object.entries(grouped).map(([year, items]) => (
        <div key={year} style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: t.sub, marginBottom: 10, paddingLeft: 4 }}>{year}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((e) => {
              const cat = CATEGORIES.find((c) => c.id === e.category) || CATEGORIES[0];
              return (
                <Card key={e.id} dark={dark} accent={cat.color} style={{ padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: cat.color, letterSpacing: 2, textTransform: "uppercase", fontWeight: 800 }}>{cat.label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: t.mute, fontWeight: 600 }}>{new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                    {isOwner && <button onClick={() => remove(e.id)} style={{ background: "none", border: "none", cursor: "pointer", color: t.mute, fontSize: 12, padding: 2 }}>🗑</button>}
                  </div>
                  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: t.text, marginBottom: 6 }}>{e.title}</div>
                  {e.body && <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, lineHeight: 1.6, fontWeight: 600, whiteSpace: "pre-wrap" }}>{e.body}</div>}
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
