import { useState } from "react";
import { C, T } from "../lib/theme.js";
import { Card } from "../components/UI.jsx";
import { useLiveState } from "../hooks/useLiveState.js";
import { feedback } from "../lib/utils.js";

const DEFAULT_WHY = `Because Satoru Iwata existed.

He proved that a kid who taught himself to code on a calculator could grow up to lead one of the most beloved companies in the world — not by abandoning who he was, but by sharpening it. He led with curiosity. He cut his own pay before laying off a single person. He stayed a player even as president. He died a programmer in his heart.

I want to do for someone, somewhere, what Iwata did for me.

But here's the harder truth: this isn't just about Iwata. This is about the kind of person I'm becoming on the way there. The discipline. The Japanese practice no one sees. The kanji at 6am before school. The code I'll write when no one is watching. The relationships I'll build because I genuinely care, not because they're useful. The version of Sebastian that exists in 2050 is being built right now, in 2026, by a 14-year-old in Las Vegas with a list.

If I never become CEO of Nintendo, this plan still wins. Because the man I become by chasing it is the man I want to be regardless.

But I'm not going to "not become CEO." I'm going to become CEO.`;

export default function WhyPage({ dark, isOwner, showToast }) {
  const t = T(dark);
  const { state: whyText, save: saveWhy } = useLiveState("why_text", DEFAULT_WHY, isOwner);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(whyText);

  const save = () => {
    saveWhy(draft);
    feedback("complete", 20);
    showToast("Your why is saved ✓", "success");
    setEditing(false);
  };

  return (
    <div className="fade-slide" style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", marginBottom: 14, padding: "6px 18px", background: dark ? `${C.purple}22` : "#fff", borderRadius: 99, border: `2px solid ${dark ? `${C.purple}44` : "rgba(255,255,255,0.9)"}`, boxShadow: `0 4px 16px ${C.purple}22` }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.purple, textTransform: "uppercase", fontWeight: 700 }}>✦ The Why ✦</span>
        </div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(30px,7vw,56px)", lineHeight: 1.05, marginBottom: 14, background: `linear-gradient(135deg,${C.purple},${C.pink},${C.red})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Why I'm Doing This</h1>
      </div>
      <Card dark={dark} accent={C.purple} style={{ padding: 24 }}>
        {!editing ? (
          <>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 15, color: t.text, lineHeight: 1.85, fontWeight: 600, whiteSpace: "pre-wrap" }}>{whyText}</div>
            {isOwner && (
              <button onClick={() => { feedback("click", 8); setDraft(whyText); setEditing(true); }} style={{ marginTop: 18, padding: "9px 18px", borderRadius: 99, border: `1.5px solid ${t.border}`, cursor: "pointer", background: "transparent", color: t.sub, fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 800 }}>✏️ Edit</button>
            )}
          </>
        ) : (
          <>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} style={{ width: "100%", minHeight: 360, padding: 14, borderRadius: 14, border: `2px solid ${C.purple}44`, background: t.soft, color: t.text, fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 600, outline: "none", resize: "vertical", lineHeight: 1.7 }} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
              <button onClick={() => setEditing(false)} style={{ padding: "10px 18px", borderRadius: 12, border: `1.5px solid ${t.border}`, cursor: "pointer", background: "transparent", color: t.sub, fontFamily: "'Nunito',sans-serif", fontSize: 13, fontWeight: 800 }}>Cancel</button>
              <button onClick={save} style={{ padding: "10px 22px", borderRadius: 12, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${C.purple},${C.pink})`, color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 14, boxShadow: `0 3px 14px ${C.purple}44` }}>Save</button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
