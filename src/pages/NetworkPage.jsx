import { useState } from "react";
import { C, T } from "../lib/theme.js";
import { Card, Pill } from "../components/UI.jsx";
import { useLiveState } from "../hooks/useLiveState.js";
import { feedback } from "../lib/utils.js";

const RELATIONS = [
  { id: "want_to_meet", label: "Want to meet", emoji: "🎯", color: C.blue },
  { id: "connected", label: "Connected", emoji: "🤝", color: C.teal },
  { id: "mentor", label: "Mentor", emoji: "🌟", color: C.yellow },
  { id: "close", label: "Close contact", emoji: "💖", color: C.pink },
];

export default function NetworkPage({ dark, isOwner, showToast }) {
  const t = T(dark);
  const { state: people, save: savePeople } = useLiveState("network_people", [], isOwner);
  const list = Array.isArray(people) ? people : [];

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ name: "", role: "", company: "", relation: "want_to_meet", how: "", notes: "" });
  const [filter, setFilter] = useState("all");

  const reset = () => { setDraft({ name: "", role: "", company: "", relation: "want_to_meet", how: "", notes: "" }); setAdding(false); setEditingId(null); };

  const add = () => {
    if (!draft.name.trim()) return showToast("Add a name", "info");
    if (editingId) {
      savePeople(list.map((p) => p.id === editingId ? { ...draft, id: editingId } : p));
      showToast("Updated ✓", "success");
    } else {
      savePeople([{ ...draft, id: Date.now(), addedAt: new Date().toISOString() }, ...list]);
      feedback("check", 15);
      showToast("Added ✓", "success");
    }
    reset();
  };

  const edit = (p) => { setDraft({ name: p.name, role: p.role || "", company: p.company || "", relation: p.relation || "want_to_meet", how: p.how || "", notes: p.notes || "" }); setEditingId(p.id); setAdding(true); };

  const remove = (id) => { if (!confirm("Remove?")) return; savePeople(list.filter((p) => p.id !== id)); };

  const filtered = filter === "all" ? list : list.filter((p) => p.relation === filter);
  const grouped = {};
  filtered.forEach((p) => { const r = p.relation || "want_to_meet"; if (!grouped[r]) grouped[r] = []; grouped[r].push(p); });

  return (
    <div className="fade-slide" style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", marginBottom: 14, padding: "6px 18px", background: dark ? `${C.pink}22` : "#fff", borderRadius: 99, border: `2px solid ${dark ? `${C.pink}44` : "rgba(255,255,255,0.9)"}`, boxShadow: `0 4px 16px ${C.pink}22` }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.pink, textTransform: "uppercase", fontWeight: 700 }}>✦ The People ✦</span>
        </div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(30px,7vw,52px)", lineHeight: 1.05, marginBottom: 12, background: `linear-gradient(135deg,${C.pink},${C.purple},${C.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Network</h1>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 600, fontStyle: "italic" }}>Career is people. Track them like quests.</p>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
        <Pill label={`All · ${list.length}`} active={filter === "all"} color={C.blue} onClick={() => setFilter("all")} dark={dark} small />
        {RELATIONS.map((r) => {
          const count = list.filter((p) => p.relation === r.id).length;
          return <Pill key={r.id} label={`${r.emoji} ${r.label} · ${count}`} active={filter === r.id} color={r.color} onClick={() => setFilter(r.id)} dark={dark} small />;
        })}
      </div>

      {isOwner && !adding && (
        <button onClick={() => { feedback("click", 8); setAdding(true); }} style={{ display: "block", margin: "0 auto 18px", padding: "12px 22px", borderRadius: 99, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${C.pink},${C.purple})`, color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 15, boxShadow: `0 4px 18px ${C.pink}44` }}>+ Add a person</button>
      )}

      {adding && (
        <Card dark={dark} accent={C.pink} style={{ padding: 22, marginBottom: 20 }}>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: C.pink, marginBottom: 14 }}>{editingId ? "Edit person" : "Add to network"}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input placeholder="Name *" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} style={{ padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 700 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input placeholder="Role" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} style={{ padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 600 }} />
              <input placeholder="Company" value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} style={{ padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 600 }} />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {RELATIONS.map((r) => (
                <button key={r.id} onClick={() => setDraft({ ...draft, relation: r.id })} style={{ padding: "6px 12px", borderRadius: 99, border: `2px solid ${draft.relation === r.id ? r.color : t.border}`, cursor: "pointer", background: draft.relation === r.id ? `${r.color}15` : "transparent", color: draft.relation === r.id ? r.color : t.sub, fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 800 }}>{r.emoji} {r.label}</button>
              ))}
            </div>
            <input placeholder="How I might meet them / connection" value={draft.how} onChange={(e) => setDraft({ ...draft, how: e.target.value })} style={{ padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 600 }} />
            <textarea placeholder="Notes..." value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} style={{ padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 600, resize: "vertical", minHeight: 60 }} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={reset} style={{ padding: "9px 16px", borderRadius: 12, border: `1.5px solid ${t.border}`, cursor: "pointer", background: "transparent", color: t.sub, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800 }}>Cancel</button>
              <button onClick={add} style={{ padding: "9px 22px", borderRadius: 12, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${C.pink},${C.purple})`, color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 14 }}>{editingId ? "Save" : "Add"}</button>
            </div>
          </div>
        </Card>
      )}

      {list.length === 0 && !adding && (
        <div style={{ textAlign: "center", padding: "32px 20px", fontFamily: "'Nunito',sans-serif", color: t.mute, fontSize: 13, fontWeight: 600, fontStyle: "italic" }}>
          No one added yet.<br />Start with someone simple — a teacher, mentor, anyone you've learned from.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {RELATIONS.map((r) => {
          const peopleHere = grouped[r.id] || [];
          if (peopleHere.length === 0) return null;
          return (
            <div key={r.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{r.emoji}</span>
                <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: r.color }}>{r.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: t.mute, fontWeight: 700 }}>· {peopleHere.length}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
                {peopleHere.map((p) => (
                  <Card key={p.id} dark={dark} accent={r.color} style={{ padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: t.text, lineHeight: 1.2 }}>{p.name}</div>
                      {isOwner && (
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => edit(p)} style={{ background: "none", border: "none", cursor: "pointer", color: t.mute, fontSize: 12 }}>✏️</button>
                          <button onClick={() => remove(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: t.mute, fontSize: 12 }}>🗑</button>
                        </div>
                      )}
                    </div>
                    {(p.role || p.company) && <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: r.color, fontWeight: 800, marginBottom: 6 }}>{[p.role, p.company].filter(Boolean).join(" · ")}</div>}
                    {p.how && <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: t.sub, fontWeight: 600, lineHeight: 1.55, fontStyle: "italic", marginBottom: 6 }}>{p.how}</div>}
                    {p.notes && <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: t.mute, fontWeight: 600, lineHeight: 1.5, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${t.border}`, whiteSpace: "pre-wrap" }}>{p.notes}</div>}
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
