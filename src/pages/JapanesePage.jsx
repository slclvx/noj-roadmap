import { useState, useEffect } from "react";
import { C, T } from "../lib/theme.js";
import { Card, StatCard } from "../components/UI.jsx";
import { useLiveState } from "../hooks/useLiveState.js";
import { feedback } from "../lib/utils.js";

const LEVELS = [
  { id: "Pre-N5", color: C.mute, desc: "Just starting — hiragana, katakana" },
  { id: "N5", color: C.green, desc: "Basic — ~800 vocab, 100 kanji" },
  { id: "N4", color: C.teal, desc: "Elementary — ~1,500 vocab, 300 kanji" },
  { id: "N3", color: C.orange, desc: "Intermediate — ~3,750 vocab, 650 kanji" },
  { id: "N2", color: C.red, desc: "Upper-intermediate — ~6,000 vocab, 1,000 kanji" },
  { id: "N1", color: C.purple, desc: "Advanced — ~10,000 vocab, 2,000+ kanji" },
];

export default function JapanesePage({ dark, isOwner, showToast }) {
  const t = T(dark);
  const { state: jp, save: saveJp } = useLiveState("japanese_tracker", {
    currentLevel: "Pre-N5", currentResource: "Tofugu Hiragana", kanjiKnown: 0, vocabKnown: 0,
    studyMinutesToday: 0, streak: 0, lastStudied: "", notes: "",
  }, isOwner);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(jp);

  useEffect(() => setDraft(jp), [jp.currentLevel, jp.kanjiKnown]);

  const currentLevelIdx = LEVELS.findIndex((l) => l.id === jp.currentLevel);
  const currentLevel = LEVELS[currentLevelIdx] || LEVELS[0];

  const save = () => {
    saveJp({ ...draft, kanjiKnown: Number(draft.kanjiKnown) || 0, vocabKnown: Number(draft.vocabKnown) || 0 });
    feedback("complete", 20);
    showToast("Updated ✓", "success");
    setEditing(false);
  };

  const logSession = () => {
    if (!isOwner) return;
    const todayKey = new Date().toISOString().slice(0, 10);
    const wasYesterday = jp.lastStudied === new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const newStreak = jp.lastStudied === todayKey ? jp.streak : wasYesterday ? jp.streak + 1 : 1;
    saveJp({ ...jp, lastStudied: todayKey, streak: newStreak, studyMinutesToday: (jp.lastStudied === todayKey ? jp.studyMinutesToday : 0) + 30 });
    feedback("complete", 20);
    showToast(`+30 min · ${newStreak} day streak 🔥`, "success");
  };

  return (
    <div className="fade-slide" style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", marginBottom: 14, padding: "6px 18px", background: dark ? `${C.red}22` : "#fff", borderRadius: 99, border: `2px solid ${dark ? `${C.red}44` : "rgba(255,255,255,0.9)"}`, boxShadow: `0 4px 16px ${C.red}22` }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.red, textTransform: "uppercase", fontWeight: 700 }}>✦ 日本語 ✦</span>
        </div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(30px,7vw,52px)", lineHeight: 1.05, marginBottom: 12, background: `linear-gradient(135deg,${C.red},${C.pink},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Japanese</h1>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 600, fontStyle: "italic" }}>N5 → N1 by Stanford graduation.</p>
      </div>

      <Card dark={dark} accent={currentLevel.color} style={{ padding: 22, marginBottom: 14 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: currentLevel.color, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>📍 Current Level</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, overflowX: "auto", paddingBottom: 8 }}>
          {LEVELS.map((l, i) => {
            const isPast = i < currentLevelIdx;
            const isCurrent = l.id === jp.currentLevel;
            return (
              <div key={l.id} style={{ display: "flex", alignItems: "center", flex: i < LEVELS.length - 1 ? "1 0 auto" : "0 0 auto" }}>
                <div onClick={() => { if (isOwner) { feedback("click", 8); saveJp({ ...jp, currentLevel: l.id }); showToast(`Level set to ${l.id}`, "success"); } }} style={{ minWidth: 56, padding: "10px 14px", borderRadius: 14, background: isCurrent ? `linear-gradient(135deg,${l.color},${l.color}cc)` : isPast ? `${l.color}25` : t.pill, color: isCurrent ? "#fff" : isPast ? l.color : t.mute, fontFamily: "'Fredoka One',cursive", fontSize: 14, textAlign: "center", border: `2px solid ${isCurrent ? l.color : isPast ? l.color + "55" : "transparent"}`, boxShadow: isCurrent ? `0 4px 14px ${l.color}55` : "none", cursor: isOwner ? "pointer" : "default" }}>{l.id}</div>
                {i < LEVELS.length - 1 && <div style={{ flex: 1, minWidth: 8, height: 3, background: isPast ? l.color : t.border, borderRadius: 99 }} />}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 12, background: dark ? `${currentLevel.color}14` : `${currentLevel.color}08`, border: `1.5px solid ${currentLevel.color}33`, fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 600, fontStyle: "italic" }}><span style={{ fontWeight: 800, color: currentLevel.color }}>{currentLevel.id}:</span> {currentLevel.desc}</div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 14 }}>
        <StatCard value={jp.streak || 0} label="🔥 Streak" color={C.orange} dark={dark} />
        <StatCard value={jp.kanjiKnown || 0} label="漢 Kanji" color={C.purple} dark={dark} />
        <StatCard value={jp.vocabKnown || 0} label="📖 Vocab" color={C.blue} dark={dark} />
        <StatCard value={jp.studyMinutesToday || 0} label="⏱ Mins Today" color={C.green} dark={dark} />
      </div>

      <Card dark={dark} accent={C.teal} style={{ padding: 20, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.teal, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>📚 Currently Studying</div>
          {isOwner && <button onClick={() => { feedback("click", 8); setEditing(true); }} style={{ padding: "5px 12px", borderRadius: 99, border: `1.5px solid ${C.teal}55`, cursor: "pointer", background: "transparent", color: C.teal, fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 800 }}>✏️ Update</button>}
        </div>
        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: t.text }}>{jp.currentResource || "Not set"}</div>
        {jp.notes && <div style={{ marginTop: 10, fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 600, lineHeight: 1.6, fontStyle: "italic" }}>{jp.notes}</div>}
      </Card>

      {editing && (
        <Card dark={dark} accent={C.teal} style={{ padding: 22, marginBottom: 14 }}>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: C.teal, marginBottom: 14 }}>Update tracker</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input value={draft.currentResource || ""} onChange={(e) => setDraft({ ...draft, currentResource: e.target.value })} placeholder="What you're studying" style={{ padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 600 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input type="number" value={draft.kanjiKnown || 0} onChange={(e) => setDraft({ ...draft, kanjiKnown: e.target.value })} placeholder="Kanji known" style={{ padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 600 }} />
              <input type="number" value={draft.vocabKnown || 0} onChange={(e) => setDraft({ ...draft, vocabKnown: e.target.value })} placeholder="Vocab known" style={{ padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 600 }} />
            </div>
            <textarea value={draft.notes || ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="Notes / current focus" style={{ minHeight: 60, padding: "10px 14px", borderRadius: 12, border: `2px solid ${t.border}`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 600, resize: "vertical" }} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setEditing(false)} style={{ padding: "9px 16px", borderRadius: 12, border: `1.5px solid ${t.border}`, cursor: "pointer", background: "transparent", color: t.sub, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800 }}>Cancel</button>
              <button onClick={save} style={{ padding: "9px 20px", borderRadius: 12, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${C.teal},${C.blue})`, color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 14 }}>Save</button>
            </div>
          </div>
        </Card>
      )}

      {isOwner && (
        <button onClick={logSession} style={{ display: "block", width: "100%", padding: "14px", borderRadius: 16, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${C.red},${C.orange})`, color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 16, boxShadow: `0 4px 18px ${C.red}44` }}>+ Log study session (+30 min)</button>
      )}
    </div>
  );
}
