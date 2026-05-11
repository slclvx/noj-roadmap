import { useState } from "react";
import { C, T } from "../lib/theme.js";
import { Card } from "../components/UI.jsx";
import { useLiveState } from "../hooks/useLiveState.js";
import { feedback } from "../lib/utils.js";

const TARGETS = [
  { label: "Sebastian at 16", emoji: "🎯", date: "2027-10-07", color: C.green },
  { label: "Sebastian at 18 (Stanford starts)", emoji: "🎓", date: "2029-10-07", color: C.orange },
  { label: "Sebastian at 22 (Stanford ends)", emoji: "📜", date: "2033-10-07", color: C.red },
  { label: "Sebastian at 30 (NOA era)", emoji: "🎮", date: "2041-10-07", color: C.purple },
  { label: "Sebastian at 38 (Japan move)", emoji: "🗾", date: "2049-10-07", color: C.pink },
  { label: "Sebastian as CEO", emoji: "👑", date: "2055-10-07", color: C.yellow },
];

export default function LettersPage({ dark, isOwner, showToast }) {
  const t = T(dark);
  const { state: letters, save: saveLetters } = useLiveState("future_letters", [], isOwner);
  const list = Array.isArray(letters) ? letters : [];
  const today = new Date().toISOString().slice(0, 10);

  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ to: "", unlockDate: "", subject: "", body: "" });

  const add = () => {
    if (!draft.to.trim() || !draft.body.trim() || !draft.unlockDate) return showToast("Fill in everything", "info");
    saveLetters([{ ...draft, id: Date.now(), writtenAt: today }, ...list]);
    feedback("complete", 25);
    showToast("Letter sealed 🔐", "success");
    setAdding(false);
    setDraft({ to: "", unlockDate: "", subject: "", body: "" });
  };

  const remove = (id) => {
    if (!confirm("Delete this letter? It will be lost forever.")) return;
    saveLetters(list.filter((l) => l.id !== id));
  };

  const isUnlocked = (l) => l.unlockDate <= today;
  const sorted = [...list].sort((a, b) => (a.unlockDate || "9999").localeCompare(b.unlockDate || "9999"));

  return (
    <div className="fade-slide" style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", marginBottom: 14, padding: "6px 18px", background: dark ? `${C.purple}22` : "#fff", borderRadius: 99, border: `2px solid ${dark ? `${C.purple}44` : "rgba(255,255,255,0.9)"}`, boxShadow: `0 4px 16px ${C.purple}22` }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.purple, textTransform: "uppercase", fontWeight: 700 }}>✦ Time Capsule ✦</span>
        </div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(28px,7vw,52px)", lineHeight: 1.05, marginBottom: 12, background: `linear-gradient(135deg,${C.purple},${C.pink},${C.red})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Letters to Future Me</h1>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 600, fontStyle: "italic" }}>Write now. Read later.</p>
      </div>

      {isOwner && !adding && (
        <button onClick={() => { feedback("click", 8); setAdding(true); }} style={{ display: "block", margin: "0 auto 20px", padding: "12px 22px", borderRadius: 99, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${C.purple},${C.pink})`, color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 15, boxShadow: `0 4px 18px ${C.purple}44` }}>✉️ Write a letter</button>
      )}

      {adding && (
        <Card dark={dark} accent={C.purple} style={{ padding: 22, marginBottom: 24 }}>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: C.purple, marginBottom: 14 }}>New letter</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 800, color: t.sub, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, display: "block" }}>Quick targets</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {TARGETS.map((s) => (
                  <button key={s.label} onClick={() => setDraft({ ...draft, to: s.label, unlockDate: s.date })} style={{ padding: "6px 12px", borderRadius: 99, border: `2px solid ${draft.to === s.label ? s.color : t.border}`, cursor: "pointer", background: draft.to === s.label ? `${s.color}15` : "transparent", color: draft.to === s.label ? s.color : t.sub, fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 800 }}>{s.emoji} {s.label}</button>
                ))}
              </div>
            </div>
            <input placeholder="To: (e.g. Sebastian at 22)" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} style={{ padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 700 }} />
            <input type="date" value={draft.unlockDate} min={today} onChange={(e) => setDraft({ ...draft, unlockDate: e.target.value })} style={{ padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 600 }} />
            <input placeholder="Subject (optional)" value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} style={{ padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 600 }} />
            <textarea placeholder="Dear future me..." value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} style={{ padding: "12px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 600, resize: "vertical", minHeight: 200, lineHeight: 1.7 }} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setAdding(false)} style={{ padding: "10px 18px", borderRadius: 12, border: `1.5px solid ${t.border}`, cursor: "pointer", background: "transparent", color: t.sub, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800 }}>Cancel</button>
              <button onClick={add} style={{ padding: "10px 22px", borderRadius: 12, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${C.purple},${C.pink})`, color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 15 }}>🔐 Seal</button>
            </div>
          </div>
        </Card>
      )}

      {list.length === 0 && !adding && (
        <div style={{ textAlign: "center", padding: "32px 20px", fontFamily: "'Nunito',sans-serif", color: t.mute, fontSize: 13, fontWeight: 600, fontStyle: "italic" }}>
          No letters yet.<br />Write one to your 16-year-old self. Or your future CEO self.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sorted.map((letter) => {
          const unlocked = isUnlocked(letter);
          const daysLeft = Math.ceil((new Date(letter.unlockDate) - new Date()) / 86400000);
          return (
            <Card key={letter.id} dark={dark} accent={unlocked ? C.green : C.purple} style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: unlocked ? C.green : C.purple, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{unlocked ? "✓ Unlocked" : `🔒 Locked · ${daysLeft} days`}</div>
                  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: t.text }}>To: {letter.to}</div>
                  {letter.subject && <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 700, marginTop: 2 }}>{letter.subject}</div>}
                </div>
                {isOwner && <button onClick={() => remove(letter.id)} style={{ background: "none", border: "none", cursor: "pointer", color: t.mute, fontSize: 14 }}>🗑</button>}
              </div>
              {unlocked ? (
                <div style={{ marginTop: 10, padding: "14px 18px", borderRadius: 14, background: dark ? `${C.green}10` : `${C.green}06`, border: `1.5px solid ${C.green}33`, fontFamily: "'Nunito',sans-serif", fontSize: 14, color: t.text, fontWeight: 600, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{letter.body}</div>
              ) : (
                <div style={{ marginTop: 10, padding: "20px 14px", borderRadius: 14, background: dark ? `${C.purple}10` : `${C.purple}06`, border: `2px dashed ${C.purple}55`, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔐</div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: t.mute, fontStyle: "italic", fontWeight: 700 }}>Sealed until {new Date(letter.unlockDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
