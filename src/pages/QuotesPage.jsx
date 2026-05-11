import { C, T } from "../lib/theme.js";
import { Card } from "../components/UI.jsx";
import { QUOTES } from "../data/quests.js";
import { feedback } from "../lib/utils.js";

export default function QuotesPage({ dark, showToast }) {
  const t = T(dark);

  const copy = (q) => {
    feedback("click", 8);
    try {
      navigator.clipboard?.writeText(`"${q.text}" — ${q.author}`);
      showToast?.("Quote copied!", "success");
    } catch {}
  };

  return (
    <div className="fade-slide" style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", marginBottom: 14, padding: "6px 18px", background: dark ? `${C.yellow}22` : "#fff", borderRadius: 99, border: `2px solid ${dark ? `${C.yellow}44` : "rgba(255,255,255,0.9)"}`, boxShadow: `0 4px 16px ${C.yellow}22` }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.yellow, textTransform: "uppercase", fontWeight: 700 }}>✦ Wisdom ✦</span>
        </div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(30px,7vw,52px)", lineHeight: 1.05, marginBottom: 12, background: `linear-gradient(135deg,${C.yellow},${C.orange},${C.red})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Quotes</h1>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 600, fontStyle: "italic" }}>Words to come back to. Tap any to copy.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {QUOTES.map((q, i) => (
          <Card key={i} dark={dark} accent={q.color} onClick={() => copy(q)} style={{ padding: 22, position: "relative" }}>
            <div style={{ position: "absolute", top: 10, left: 16, fontFamily: "'Fredoka One',cursive", fontSize: 52, color: `${q.color}28`, lineHeight: 1 }}>"</div>
            <div style={{ paddingLeft: 32 }}>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 15, color: t.text, fontWeight: 700, fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>{q.text}</p>
              <div style={{ marginTop: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: q.color, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>— {q.author}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
