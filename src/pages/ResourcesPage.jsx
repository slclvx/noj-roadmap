import { useState } from "react";
import { C, T } from "../lib/theme.js";
import { Card, Pill, TypeBadge, LevelBadge, NewBadge } from "../components/UI.jsx";
import { BOOK_PHASES, TYPE_META } from "../data/books.js";
import { useLiveState } from "../hooks/useLiveState.js";
import { feedback } from "../lib/utils.js";

export default function ResourcesPage({ dark, isOwner, showToast }) {
  const t = T(dark);
  const { state: read, save: saveRead } = useLiveState("book_reads", {}, isOwner);
  const { state: reading, save: saveReading } = useLiveState("currently_reading", {}, isOwner);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const allBooks = BOOK_PHASES.flatMap((p) => p.books.map((b) => ({ ...b, phaseAccent: p.accent, phaseLabel: p.label, phaseId: p.id })));
  const types = Object.keys(TYPE_META);
  const totalBooks = allBooks.length;
  const readCount = Object.values(read).filter(Boolean).length;
  const readingCount = Object.values(reading).filter(Boolean).length;

  const toggleRead = (num) => {
    if (!isOwner) return;
    const next = { ...read, [num]: !read[num] };
    feedback(next[num] ? "check" : "uncheck", next[num] ? 15 : 10);
    saveRead(next);
    showToast(next[num] ? "Marked as read ✓" : "Unmarked", "success");
  };

  const toggleReading = (num) => {
    if (!isOwner) return;
    const next = { ...reading, [num]: !reading[num] };
    feedback(next[num] ? "check" : "click", next[num] ? 15 : 8);
    saveReading(next);
    showToast(next[num] ? "Added to currently reading ⭐" : "Removed", "success");
  };

  const filtered = allBooks.filter((b) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!b.title.toLowerCase().includes(q) && !b.sub.toLowerCase().includes(q) && !(b.note || "").toLowerCase().includes(q)) return false;
    }
    if (filter === "all") return true;
    if (filter === "reading") return reading[b.num];
    if (filter === "unread") return !read[b.num];
    if (filter === "new") return b.isNew;
    return b.type === filter;
  });

  return (
    <div className="fade-slide" style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", marginBottom: 14, padding: "6px 18px", background: dark ? `${C.orange}22` : "#fff", borderRadius: 99, border: `2px solid ${dark ? `${C.orange}44` : "rgba(255,255,255,0.9)"}`, boxShadow: `0 4px 16px ${C.orange}22` }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.orange, textTransform: "uppercase", fontWeight: 700 }}>✦ The Library ✦</span>
        </div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(30px,7vw,52px)", lineHeight: 1.05, marginBottom: 12, background: `linear-gradient(135deg,${C.orange},${C.yellow},${C.red})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Resources</h1>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 600, fontStyle: "italic" }}>{readCount} of {totalBooks} read · {readingCount} in progress</p>
      </div>

      <input
        type="text"
        placeholder="🔍 Search books, notes, authors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: `2px solid ${t.border}`, background: t.card, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 14, outline: "none" }}
      />

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 18 }}>
        <Pill label={`All · ${allBooks.length}`} active={filter === "all"} color={C.blue} onClick={() => setFilter("all")} dark={dark} small />
        <Pill label={`⭐ Reading · ${readingCount}`} active={filter === "reading"} color={C.yellow} onClick={() => setFilter("reading")} dark={dark} small />
        <Pill label={`📖 Unread · ${totalBooks - readCount}`} active={filter === "unread"} color={C.purple} onClick={() => setFilter("unread")} dark={dark} small />
        <Pill label={`✦ New`} active={filter === "new"} color={C.orange} onClick={() => setFilter("new")} dark={dark} small />
        {types.map((tt) => {
          const count = allBooks.filter((b) => b.type === tt).length;
          if (!count) return null;
          return <Pill key={tt} label={`${tt} · ${count}`} active={filter === tt} color={C.teal} onClick={() => setFilter(tt)} dark={dark} small />;
        })}
      </div>

      {BOOK_PHASES.map((phase) => {
        const phaseBooks = filtered.filter((b) => b.phaseId === phase.id);
        if (phaseBooks.length === 0) return null;
        return (
          <div key={phase.id} style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: phase.accent, letterSpacing: 2, fontWeight: 800, padding: "3px 10px", borderRadius: 99, background: `${phase.accent}15`, border: `1.5px solid ${phase.accent}44` }}>{phase.label}</span>
              <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: t.text }}>{phase.title}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: t.mute, fontWeight: 700 }}>· {phase.age}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {phaseBooks.map((b) => {
                const isRead = !!read[b.num];
                const isReading = !!reading[b.num];
                return (
                  <Card key={b.num} dark={dark} accent={b.phaseAccent} style={{ padding: 16, opacity: isRead ? 0.75 : 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                          <TypeBadge type={b.type} dark={dark} />
                          {b.level && <LevelBadge level={b.level} dark={dark} />}
                          {b.isNew && <NewBadge />}
                        </div>
                        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 15, color: t.text, lineHeight: 1.2, textDecoration: isRead ? "line-through" : "none" }}>{b.title}</div>
                        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: t.mute, fontWeight: 700, marginTop: 3 }}>{b.sub}</div>
                      </div>
                    </div>
                    {b.note && <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: t.sub, fontWeight: 600, lineHeight: 1.55, fontStyle: "italic", marginBottom: 10 }}>{b.note}</div>}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {b.link && (
                        <a href={b.link} target="_blank" rel="noopener" style={{ padding: "5px 10px", borderRadius: 99, background: `${b.phaseAccent}15`, color: b.phaseAccent, fontFamily: "'Nunito',sans-serif", fontSize: 10, fontWeight: 800, textDecoration: "none", border: `1.5px solid ${b.phaseAccent}44` }} onClick={() => feedback("navigate", 5)}>🔗 Open</a>
                      )}
                      {isOwner && (
                        <>
                          <button onClick={() => toggleReading(b.num)} style={{ padding: "5px 10px", borderRadius: 99, background: isReading ? `linear-gradient(135deg,${C.yellow},${C.orange})` : t.pill, color: isReading ? "#fff" : t.sub, fontFamily: "'Nunito',sans-serif", fontSize: 10, fontWeight: 800, border: "none", cursor: "pointer", boxShadow: isReading ? `0 2px 8px ${C.yellow}44` : "none" }}>⭐ {isReading ? "Reading" : "Mark Reading"}</button>
                          <button onClick={() => toggleRead(b.num)} style={{ padding: "5px 10px", borderRadius: 99, background: isRead ? `linear-gradient(135deg,${C.green},${C.teal})` : t.pill, color: isRead ? "#fff" : t.sub, fontFamily: "'Nunito',sans-serif", fontSize: 10, fontWeight: 800, border: "none", cursor: "pointer", boxShadow: isRead ? `0 2px 8px ${C.green}44` : "none" }}>{isRead ? "✓ Read" : "Mark Read"}</button>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
