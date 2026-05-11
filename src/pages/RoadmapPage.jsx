import { useState, useEffect } from "react";
import { C, T, STATUS_META } from "../lib/theme.js";
import { Card, Pill, Check } from "../components/UI.jsx";
import { PHASES, isPhaseComplete, isPhaseInProgress, isPhaseLocked, getCurrentPhaseId } from "../data/phases.js";
import { useLiveState } from "../hooks/useLiveState.js";
import { feedback, playSound } from "../lib/utils.js";

export default function RoadmapPage({ dark, isOwner, showToast, fireConfetti }) {
  const t = T(dark);
  const { state: checks, save: saveChecks } = useLiveState("phase_checks", {}, isOwner);
  const { state: actionChecks, save: saveActionChecks } = useLiveState("action_checks", {}, isOwner);

  const currentPhaseId = getCurrentPhaseId(checks, actionChecks);
  const [open, setOpen] = useState(currentPhaseId);
  const [tab, setTab] = useState("milestones");

  // Auto-open current phase
  useEffect(() => { setOpen(currentPhaseId); }, []);

  const toggle = (id) => {
    const phase = PHASES.find((p) => p.id === id);
    if (isPhaseLocked(phase, checks, actionChecks)) {
      feedback("error", [50, 30, 50]);
      showToast("Complete the previous phase first 🔒", "info");
      return;
    }
    feedback("click", 8);
    setOpen((p) => (p !== id ? id : null));
    setTab("milestones");
    setTimeout(() => {
      const el = document.getElementById(`p${id}`);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 74, behavior: "smooth" });
    }, 50);
  };

  const toggleCheck = (phaseId, mIdx) => {
    if (!isOwner) return;
    const phase = PHASES.find((p) => p.id === phaseId);
    if (isPhaseLocked(phase, checks, actionChecks)) {
      feedback("error", [50, 30, 50]);
      showToast("Complete the previous phase first 🔒", "info");
      return;
    }
    const key = `${phaseId}-${mIdx}`;
    const next = { ...checks, [key]: !checks[key] };
    feedback(next[key] ? "check" : "uncheck", next[key] ? 15 : 10);
    saveChecks(next);
    if (phase && isPhaseComplete(phase, next, actionChecks)) {
      playSound("complete");
      fireConfetti();
      showToast(`🎉 ${phase.title} complete!`, "success");
      const nextPhase = PHASES[PHASES.findIndex((p) => p.id === phaseId) + 1];
      if (nextPhase) setTimeout(() => { playSound("unlock"); showToast(`🔓 ${nextPhase.title} unlocked!`, "success"); }, 700);
    }
  };

  const toggleAction = (phaseId, aIdx) => {
    if (!isOwner) return;
    const phase = PHASES.find((p) => p.id === phaseId);
    if (isPhaseLocked(phase, checks, actionChecks)) {
      feedback("error", [50, 30, 50]);
      showToast("Complete the previous phase first 🔒", "info");
      return;
    }
    const key = `${phaseId}-a${aIdx}`;
    const next = { ...actionChecks, [key]: !actionChecks[key] };
    feedback(next[key] ? "check" : "uncheck", next[key] ? 15 : 10);
    saveActionChecks(next);
    if (phase && isPhaseComplete(phase, checks, next)) {
      playSound("complete");
      fireConfetti();
      showToast(`🎉 ${phase.title} complete!`, "success");
      const nextPhase = PHASES[PHASES.findIndex((p) => p.id === phaseId) + 1];
      if (nextPhase) setTimeout(() => { playSound("unlock"); showToast(`🔓 ${nextPhase.title} unlocked!`, "success"); }, 700);
    }
  };

  const totalMilestones = PHASES.reduce((s, p) => s + p.milestones.length, 0);
  const doneCount = Object.values(checks).filter(Boolean).length;

  return (
    <div className="fade-slide">
      {/* Hero */}
      <div style={{ padding: "32px 16px 28px", maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
        {["🎮", "🗾", "⭐", "👑"].map((e, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${20 + (i * 17) % 60}%`,
              left: i % 2 ? `${85 - (i * 7)}%` : `${5 + (i * 9)}%`,
              fontSize: 38,
              opacity: dark ? 0.08 : 0.12,
              animation: `floatDot ${5 + (i % 2)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              pointerEvents: "none",
            }}
          >
            {e}
          </div>
        ))}
        <div
          style={{
            display: "inline-flex",
            marginBottom: 18,
            padding: "6px 18px",
            background: dark ? `${C.blue}22` : "#fff",
            borderRadius: 99,
            border: `2px solid ${dark ? `${C.blue}44` : "rgba(255,255,255,0.9)"}`,
            boxShadow: `0 4px 16px ${C.blue}22`,
          }}
        >
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.blue, textTransform: "uppercase", fontWeight: 700 }}>
            ✦ The Roadmap ✦
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Fredoka One',cursive",
            fontSize: "clamp(28px,7vw,52px)",
            lineHeight: 1.05,
            marginBottom: 14,
            background: `linear-gradient(135deg,${C.red},${C.purple},${C.blue},${C.sky})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          First Foreign CEO<br />of Nintendo of Japan
        </h1>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, color: t.sub, fontWeight: 600, lineHeight: 1.7, maxWidth: 460, margin: "0 auto 14px" }}>
          {doneCount} / {totalMilestones} milestones complete
        </p>
      </div>

      {/* Phase list */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px 80px" }}>
        {PHASES.map((phase) => {
          const isOpen = open === phase.id;
          const locked = isPhaseLocked(phase, checks, actionChecks);
          const phaseDone = isPhaseComplete(phase, checks, actionChecks);
          const phaseInProgress = isPhaseInProgress(phase, checks, actionChecks);
          const status = locked ? "Locked" : phaseDone ? "Complete" : phaseInProgress ? "In Progress" : "Not Started";
          const sm = STATUS_META[status];
          const milestoneCount = phase.milestones.filter((_, i) => checks[`${phase.id}-${i}`]).length;
          const isCurrent = phase.id === currentPhaseId;

          return (
            <div key={phase.id} id={`p${phase.id}`} style={{ marginBottom: 12, opacity: locked ? 0.6 : 1, transition: "opacity 0.3s" }}>
              <button
                onClick={() => toggle(phase.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  cursor: locked ? "not-allowed" : "pointer",
                  outline: "none",
                  background: isOpen ? (dark ? `${phase.accent}14` : `${phase.accent}09`) : t.card,
                  border: `2.5px solid ${isOpen ? phase.accent + "66" : isCurrent ? phase.accent + "44" : t.border}`,
                  borderRadius: isOpen ? "22px 22px 0 0" : "22px",
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "all 0.25s ease",
                  boxShadow: isOpen ? `0 8px 32px ${phase.accent}28` : isCurrent ? `0 4px 18px ${phase.accent}30` : t.shadowS,
                  position: "relative",
                }}
              >
                {isCurrent && !isOpen && (
                  <div style={{ position: "absolute", top: -6, right: 12, padding: "2px 8px", borderRadius: 99, background: phase.accent, fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 900, color: "#fff", letterSpacing: 1, textTransform: "uppercase", boxShadow: `0 2px 8px ${phase.accent}66` }}>
                    ● You
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "'Fredoka One',cursive",
                    fontSize: 24,
                    color: isOpen ? phase.accent : t.mute,
                    minWidth: 42,
                    lineHeight: 1,
                    transition: "color 0.25s",
                  }}
                >
                  {locked ? "🔒" : phaseDone ? "✓" : phase.num}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                    <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: t.text }}>
                      {phase.emoji} {phase.title}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 9,
                      color: t.mute,
                      letterSpacing: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Age {phase.age}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "'Nunito',sans-serif",
                    fontSize: 10,
                    fontWeight: 800,
                    flexShrink: 0,
                    padding: "3px 10px",
                    borderRadius: 99,
                    background: phaseDone ? `linear-gradient(135deg,${C.green},${C.teal})` : `${phase.accent}18`,
                    color: phaseDone ? "#fff" : phase.accent,
                    border: `1.5px solid ${phase.accent}44`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {milestoneCount}/{phase.milestones.length}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: isOpen ? phase.accent : t.mute,
                    transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.3s",
                  }}
                >
                  ▾
                </div>
              </button>
              {isOpen && (
                <div
                  style={{
                    background: dark ? `${phase.accent}07` : `${phase.accent}05`,
                    border: `2.5px solid ${phase.accent}44`,
                    borderTop: "none",
                    borderRadius: "0 0 22px 22px",
                    padding: "0 18px 22px",
                    animation: "fadeSlide 0.25s ease",
                  }}
                >
                  <p style={{ padding: "16px 0 14px", borderBottom: `1.5px solid ${phase.accent}20`, fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, lineHeight: 1.7, fontWeight: 600, margin: 0, fontStyle: "italic" }}>
                    "{phase.tagline}" — {phase.summary}
                  </p>
                  <div style={{ display: "flex", gap: 6, padding: "14px 0 12px", flexWrap: "wrap" }}>
                    {[
                      ["milestones", "🏁 Milestones"],
                      ["actions", "⚡ Actions"],
                      ["honest", "💬 Real Talk"],
                      ["risk", "⚠️ Risk"],
                    ].map(([tt, label]) => (
                      <Pill key={tt} label={label} active={tab === tt} color={phase.accent} onClick={() => { feedback("click", 5); setTab(tt); }} dark={dark} small />
                    ))}
                  </div>
                  {tab === "milestones" && (
                    <div>
                      {phase.milestones.map((m, i) => {
                        const done = !!checks[`${phase.id}-${i}`];
                        return (
                          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < phase.milestones.length - 1 ? `1px solid ${t.border}` : "none" }}>
                            <Check done={done} accent={phase.accent} disabled={!isOwner || locked} onClick={() => toggleCheck(phase.id, i)} />
                            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.text, lineHeight: 1.65, fontWeight: 600, flex: 1, textDecoration: done ? "line-through" : "none", opacity: done ? 0.55 : 1 }}>
                              {m}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {tab === "actions" && (
                    <div>
                      {phase.actions.map((a, i) => {
                        const done = !!actionChecks[`${phase.id}-a${i}`];
                        return (
                          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < phase.actions.length - 1 ? `1px solid ${t.border}` : "none" }}>
                            <Check done={done} accent={phase.accent} disabled={!isOwner || locked} onClick={() => toggleAction(phase.id, i)} />
                            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.text, lineHeight: 1.65, fontWeight: 600, flex: 1, textDecoration: done ? "line-through" : "none", opacity: done ? 0.55 : 1 }}>
                              {a}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {tab === "honest" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
                      <div style={{ padding: "14px 16px", background: t.card, border: `2px solid ${t.border}`, borderRadius: 14, boxShadow: t.shadowS }}>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: 2, color: t.mute, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>
                          🎮 The Iwata Lesson
                        </div>
                        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.text, lineHeight: 1.7, fontWeight: 700, fontStyle: "italic" }}>
                          "{phase.iwata_note}"
                        </div>
                      </div>
                      <div style={{ padding: "14px 16px", background: dark ? `${phase.accent}14` : `${phase.accent}08`, border: `2px solid ${phase.accent}44`, borderRadius: 14 }}>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: 2, color: phase.accent, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>
                          💬 Real Talk
                        </div>
                        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, lineHeight: 1.75, fontWeight: 600 }}>
                          {phase.honest}
                        </div>
                      </div>
                    </div>
                  )}
                  {tab === "risk" && (
                    <div style={{ paddingTop: 4 }}>
                      <div style={{ padding: "12px 16px", background: dark ? "rgba(255,92,117,0.08)" : "rgba(255,92,117,0.06)", border: `2px solid ${C.red}44`, borderRadius: 14, marginBottom: 10 }}>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: 2, color: C.red, textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>
                          ⚠️ Failure Modes
                        </div>
                        <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: t.sub, lineHeight: 1.5, fontWeight: 600, fontStyle: "italic" }}>
                          Plan B doesn't weaken Plan A.
                        </div>
                      </div>
                      {(phase.failure_modes || []).map((fm, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                            padding: "10px 14px",
                            margin: "6px 0",
                            borderRadius: 12,
                            background: dark ? "rgba(255,92,117,0.05)" : "rgba(255,92,117,0.04)",
                            border: `1.5px solid ${C.red}22`,
                          }}
                        >
                          <div style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>⚠️</div>
                          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.text, lineHeight: 1.6, fontWeight: 600 }}>
                            {fm}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
