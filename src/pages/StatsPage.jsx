import { C, T } from "../lib/theme.js";
import { Card, StatCard } from "../components/UI.jsx";
import { PHASES } from "../data/phases.js";
import { BOOK_PHASES } from "../data/books.js";
import { DEFAULT_QUESTS } from "../data/quests.js";
import { useLiveState } from "../hooks/useLiveState.js";

export default function StatsPage({ dark, isOwner }) {
  const t = T(dark);
  const { state: checks } = useLiveState("phase_checks", {}, isOwner);
  const { state: read } = useLiveState("book_reads", {}, isOwner);
  const { state: questStatus } = useLiveState("quest_statuses", {}, isOwner);
  const { state: entries } = useLiveState("journal_entries", [], isOwner);
  const { state: reviews } = useLiveState("weekly_reviews", [], isOwner);

  const phaseProgress = PHASES.map((p) => {
    const done = p.milestones.filter((_, i) => checks[`${p.id}-${i}`]).length;
    return { phase: p, done, total: p.milestones.length, pct: p.milestones.length ? (done / p.milestones.length) * 100 : 0 };
  });

  const bookProgress = BOOK_PHASES.map((p) => {
    const doneCount = p.books.filter((b) => read[b.num]).length;
    return { phase: p, done: doneCount, total: p.books.length, pct: p.books.length ? (doneCount / p.books.length) * 100 : 0 };
  });

  const questBreakdown = { notStarted: 0, inProgress: 0, complete: 0 };
  DEFAULT_QUESTS.forEach((q) => {
    const status = questStatus[q.id] || q.status;
    if (status === "Complete") questBreakdown.complete++;
    else if (status === "In Progress") questBreakdown.inProgress++;
    else questBreakdown.notStarted++;
  });

  const journalList = Array.isArray(entries) ? entries : [];
  const last12 = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const k = d.toLocaleDateString("en-US", { month: "short" });
    last12[k] = 0;
  }
  journalList.forEach((e) => {
    const d = new Date(e.date);
    const monthsAgo = (new Date().getFullYear() - d.getFullYear()) * 12 + (new Date().getMonth() - d.getMonth());
    if (monthsAgo >= 0 && monthsAgo < 12) {
      const k = d.toLocaleDateString("en-US", { month: "short" });
      if (last12[k] !== undefined) last12[k]++;
    }
  });
  const maxJournalMonth = Math.max(1, ...Object.values(last12));

  const totalMilestones = phaseProgress.reduce((s, p) => s + p.total, 0);
  const totalDone = phaseProgress.reduce((s, p) => s + p.done, 0);
  const totalBooks = bookProgress.reduce((s, p) => s + p.total, 0);
  const totalRead = bookProgress.reduce((s, p) => s + p.done, 0);

  return (
    <div className="fade-slide" style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", marginBottom: 14, padding: "6px 18px", background: dark ? `${C.green}22` : "#fff", borderRadius: 99, border: `2px solid ${dark ? `${C.green}44` : "rgba(255,255,255,0.9)"}`, boxShadow: `0 4px 16px ${C.green}22` }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 3, color: C.green, textTransform: "uppercase", fontWeight: 700 }}>✦ The Trajectory ✦</span>
        </div>
        <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: "clamp(30px,7vw,52px)", lineHeight: 1.05, marginBottom: 12, background: `linear-gradient(135deg,${C.green},${C.teal},${C.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Stats</h1>
        <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: t.sub, fontWeight: 600, fontStyle: "italic" }}>Iwata loved data. So do I.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 22 }}>
        <StatCard value={`${totalDone}/${totalMilestones}`} label="Milestones" color={C.blue} dark={dark} />
        <StatCard value={`${totalRead}/${totalBooks}`} label="Books Read" color={C.orange} dark={dark} />
        <StatCard value={questBreakdown.complete} label="Quests Done" color={C.yellow} dark={dark} />
        <StatCard value={journalList.length} label="Journal Entries" color={C.teal} dark={dark} />
        <StatCard value={Array.isArray(reviews) ? reviews.length : 0} label="Weeks Reviewed" color={C.purple} dark={dark} />
      </div>

      <Card dark={dark} accent={C.blue} style={{ padding: 22, marginBottom: 14 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.blue, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>📊 Milestones per Phase</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {phaseProgress.map(({ phase, done, total, pct }) => (
            <div key={phase.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 800, color: phase.accent }}>{phase.emoji} {phase.title}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: t.mute }}>{done}/{total}</span>
              </div>
              <div style={{ height: 10, borderRadius: 99, background: t.soft, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${phase.accent},${phase.accent}cc)`, borderRadius: 99, transition: "width 0.6s ease", boxShadow: pct > 0 ? `0 0 8px ${phase.accent}55` : "none" }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card dark={dark} accent={C.orange} style={{ padding: 22, marginBottom: 14 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.orange, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>📚 Books per Phase</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bookProgress.map(({ phase, done, total, pct }) => (
            <div key={phase.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 800, color: phase.accent }}>{phase.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: t.mute }}>{done}/{total}</span>
              </div>
              <div style={{ height: 10, borderRadius: 99, background: t.soft, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${phase.accent},${phase.accent}cc)`, borderRadius: 99, transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card dark={dark} accent={C.red} style={{ padding: 22, marginBottom: 14 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.red, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>⚔️ Side Quests Status</div>
        <div style={{ display: "flex", height: 36, borderRadius: 18, overflow: "hidden", background: t.soft }}>
          {questBreakdown.complete > 0 && <div style={{ flex: questBreakdown.complete, background: `linear-gradient(90deg,${C.green},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 13 }}>{questBreakdown.complete}</div>}
          {questBreakdown.inProgress > 0 && <div style={{ flex: questBreakdown.inProgress, background: `linear-gradient(90deg,${C.yellow},${C.orange})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Fredoka One',cursive", fontSize: 13 }}>{questBreakdown.inProgress}</div>}
          {questBreakdown.notStarted > 0 && <div style={{ flex: questBreakdown.notStarted, background: t.pill, display: "flex", alignItems: "center", justifyContent: "center", color: t.mute, fontFamily: "'Fredoka One',cursive", fontSize: 13 }}>{questBreakdown.notStarted}</div>}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: C.green }} /><span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 700, color: t.sub }}>Complete · {questBreakdown.complete}</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: C.yellow }} /><span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 700, color: t.sub }}>In Progress · {questBreakdown.inProgress}</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: t.mute }} /><span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 700, color: t.sub }}>Not Started · {questBreakdown.notStarted}</span></div>
        </div>
      </Card>

      <Card dark={dark} accent={C.teal} style={{ padding: 22 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.teal, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>📅 Journal · 12 Months</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 110, paddingTop: 10 }}>
          {Object.entries(last12).map(([month, count]) => (
            <div key={month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, color: count > 0 ? C.teal : t.mute }}>{count || ""}</div>
              <div style={{ width: "100%", height: `${(count / maxJournalMonth) * 80 + (count > 0 ? 6 : 2)}px`, minHeight: 4, background: count > 0 ? `linear-gradient(to top,${C.teal},${C.blue})` : t.pill, borderRadius: "6px 6px 2px 2px", transition: "height 0.6s ease", boxShadow: count > 0 ? `0 -2px 8px ${C.teal}33` : "none" }} />
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: t.mute, letterSpacing: 0.5 }}>{month}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
