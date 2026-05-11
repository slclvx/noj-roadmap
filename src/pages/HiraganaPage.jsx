import { useState } from "react";
import { C, T } from "../lib/theme.js";
import { Card, Pill } from "../components/UI.jsx";
import { HIRAGANA } from "../data/quests.js";
import { useLiveState } from "../hooks/useLiveState.js";
import { feedback, playSound } from "../lib/utils.js";

const GROUPS = {
  vowels: { emoji: "あ", color: C.red },
  k: { emoji: "か", color: C.orange },
  s: { emoji: "さ", color: C.yellow },
  t: { emoji: "た", color: C.green },
  n: { emoji: "な", color: C.teal },
  h: { emoji: "は", color: C.blue },
  m: { emoji: "ま", color: C.sky },
  y: { emoji: "や", color: C.purple },
  r: { emoji: "ら", color: C.pink },
  w: { emoji: "わ", color: C.red },
};

export default function HiraganaPage({ dark, isOwner, showToast }) {
  const t = T(dark);
  const { state: learned, save: saveLearned } = useLiveState("hiragana_learned", {}, isOwner);
  const [filter, setFilter] = useState("all");
  const [showRomaji, setShowRomaji] = useState(true);

  const learnedCount = Object.values(learned).filter(Boolean).length;
  const pct = Math.round((learnedCount / HIRAGANA.length) * 100);

  const toggle = (char) => {
    if (!isOwner) return;
    const next = { ...learned, [char]: !learned[char] };
    feedback(next[char] ? "check" : "uncheck", next[char] ? 15 : 10);
    saveLearned(next);
    if (Object.values(next).filter(Boolean).length === HIRAGANA.length) {
      playSound("complete");
      showToast("🎉 All 46 hiragana mastered!", "success");
    }
  };

  const filtered = filter === "all" ? HIRAGANA : HIRAGANA.filter(([, , g]) => g === filter);

  return (
    <div className="fade-slide" style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "inline-flex", marginBottom: 14, padding: "6px 18px", background: dark ? `${C.red}22` : "#fff", borderRadius: 99, border: `2px solid ${dark ? `${C.red}44` : "rgba(255,255,255,0.9)"}`, boxShadow: `0 4px 16px ${C.red}22` }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.red, textTransform: "uppercase", fontWeight: 700 }}>✦ ひらがな ✦</span>
        </div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(30px,7vw,52px)", lineHeight: 1.05, marginBottom: 10, background: `linear-gradient(135deg,${C.red},${C.pink},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Hiragana</h1>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 600, fontStyle: "italic", maxWidth: 400, margin: "0 auto", lineHeight: 1.5 }}>
          The 46 characters that unlock everything. Learning via{" "}
          <a href="https://www.tofugu.com/japanese/learn-hiragana/" target="_blank" rel="noopener" style={{ color: C.red, fontWeight: 800, textDecoration: "none", borderBottom: `1.5px solid ${C.red}55` }}>Tofugu's free guide</a>.
        </p>
      </div>

      <Card dark={dark} accent={C.red} style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.red, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>Progress</div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: t.text }}>{learnedCount}<span style={{ color: t.mute, fontSize: 18 }}>/{HIRAGANA.length}</span></div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 32, color: C.red, lineHeight: 1 }}>{pct}%</div>
          </div>
        </div>
        <div style={{ height: 8, borderRadius: 99, background: t.soft, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${C.red},${C.pink},${C.purple})`, borderRadius: 99, transition: "width 0.5s ease" }} />
        </div>
        {pct === 100 && <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 12, background: `linear-gradient(135deg,${C.green}22,${C.teal}22)`, border: `1.5px solid ${C.green}55`, fontFamily: "'Nunito',sans-serif", fontSize: 13, color: C.green, fontWeight: 800, textAlign: "center" }}>🎉 All 46 mastered! On to katakana →</div>}
      </Card>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, justifyContent: "center" }}>
        <button onClick={() => { feedback("click", 5); setShowRomaji(!showRomaji); }} style={{ padding: "7px 14px", borderRadius: 99, border: `2px solid ${showRomaji ? C.blue : t.border}`, cursor: "pointer", background: showRomaji ? `${C.blue}15` : "transparent", color: showRomaji ? C.blue : t.sub, fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 800 }}>{showRomaji ? "🔤 Romaji on" : "👁 Romaji off"}</button>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
        <Pill label="All" active={filter === "all"} color={C.red} onClick={() => setFilter("all")} dark={dark} small />
        {Object.entries(GROUPS).map(([k, g]) => (
          <Pill key={k} label={g.emoji} active={filter === k} color={g.color} onClick={() => setFilter(k)} dark={dark} small />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(68px, 1fr))", gap: 8 }}>
        {filtered.map(([char, romaji, group]) => {
          const known = !!learned[char];
          const groupColor = GROUPS[group]?.color || C.blue;
          return (
            <button
              key={char}
              onClick={() => toggle(char)}
              disabled={!isOwner}
              style={{
                aspectRatio: "1",
                padding: 6,
                borderRadius: 16,
                border: `2.5px solid ${known ? C.green : t.border}`,
                cursor: isOwner ? "pointer" : "default",
                background: known ? `linear-gradient(135deg,${C.green}25,${C.teal}15)` : dark ? t.card : `linear-gradient(145deg,#fff,${groupColor}08)`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow: known ? `0 4px 14px ${C.green}33` : t.shadowS,
                position: "relative",
                transform: known ? "scale(1.02)" : "scale(1)",
              }}
            >
              {known && <div style={{ position: "absolute", top: 3, right: 5, fontSize: 10, color: C.green, fontWeight: 900 }}>✓</div>}
              <div style={{ fontFamily: "'Hiragino Sans','Yu Gothic',sans-serif", fontSize: 30, color: known ? C.green : t.text, lineHeight: 1, fontWeight: 500 }}>{char}</div>
              {showRomaji && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: t.mute, marginTop: 3, fontWeight: 700, textTransform: "lowercase" }}>{romaji}</div>}
            </button>
          );
        })}
      </div>

      <a href="https://www.tofugu.com/japanese/learn-hiragana/" target="_blank" rel="noopener" onClick={() => feedback("navigate", 8)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 22, padding: 14, borderRadius: 16, background: `linear-gradient(135deg,${C.red},${C.pink})`, color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 15, boxShadow: `0 4px 18px ${C.red}44`, textDecoration: "none" }}>📖 Open Tofugu Lesson →</a>
    </div>
  );
}
