import { useState } from "react";
import { C, T } from "../lib/theme.js";
import { Card } from "../components/UI.jsx";
import { PREDECESSORS } from "../data/quests.js";
import { feedback } from "../lib/utils.js";

export default function PeoplePage({ dark }) {
  const t = T(dark);
  const [open, setOpen] = useState(null);

  return (
    <div className="fade-slide" style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", marginBottom: 14, padding: "6px 18px", background: dark ? `${C.blue}22` : "#fff", borderRadius: 99, border: `2px solid ${dark ? `${C.blue}44` : "rgba(255,255,255,0.9)"}`, boxShadow: `0 4px 16px ${C.blue}22` }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.blue, textTransform: "uppercase", fontWeight: 700 }}>✦ Predecessors ✦</span>
        </div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(30px,7vw,52px)", lineHeight: 1.05, marginBottom: 12, background: `linear-gradient(135deg,${C.blue},${C.purple},${C.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>The Blueprints</h1>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 600, fontStyle: "italic" }}>The people whose paths inform mine.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {PREDECESSORS.map((p) => {
          const isOpen = open === p.name;
          return (
            <Card key={p.name} dark={dark} accent={p.color} onClick={() => { feedback("click", 8); setOpen(isOpen ? null : p.name); }} style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ fontSize: 38, lineHeight: 1, filter: `drop-shadow(0 3px 8px ${p.color}44)` }}>{p.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: t.text, lineHeight: 1.2 }}>{p.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: p.color, letterSpacing: 1, fontWeight: 700, marginTop: 4 }}>{p.role}</div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, color: t.mute, fontWeight: 700, marginTop: 4 }}>{p.nationality}</div>
                </div>
              </div>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: t.sub, fontWeight: 600, lineHeight: 1.55, fontStyle: "italic" }}>{p.why}</p>
              {isOpen && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1.5px solid ${t.border}`, animation: "fadeSlide 0.25s" }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: p.color, letterSpacing: 2, textTransform: "uppercase", fontWeight: 800, marginBottom: 6 }}>The Path</div>
                    {p.path.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                        <span style={{ color: p.color, fontWeight: 800, fontSize: 11 }}>{i + 1}.</span>
                        <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: t.sub, fontWeight: 600, lineHeight: 1.5 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: p.color, letterSpacing: 2, textTransform: "uppercase", fontWeight: 800, marginBottom: 6 }}>What I Take</div>
                    {p.lessons.map((l, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                        <span style={{ color: p.color }}>✦</span>
                        <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: t.sub, fontWeight: 600, lineHeight: 1.5 }}>{l}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "10px 14px", borderRadius: 12, background: dark ? `${p.color}14` : `${p.color}08`, border: `1.5px solid ${p.color}33`, fontFamily: "'Nunito',sans-serif", fontSize: 12, color: t.text, fontWeight: 600, lineHeight: 1.6, fontStyle: "italic" }}>
                    {p.relevance}
                  </div>
                </div>
              )}
              <div style={{ marginTop: 10, fontFamily: "'Nunito',sans-serif", fontSize: 11, color: p.color, fontWeight: 800, textAlign: "right" }}>{isOpen ? "▴ Less" : "▾ More"}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
