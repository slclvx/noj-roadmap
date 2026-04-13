import { useState, useEffect } from "react";

// ─── FONTS ────────────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&family=Fredoka+One&display=swap');`;

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const N = {
  red:    "#E8294A",
  blue:   "#0066CC",
  sky:    "#00AAFF",
  teal:   "#00C8A0",
  green:  "#39C254",
  yellow: "#FFB800",
  orange: "#FF7828",
  purple: "#8844EE",
  pink:   "#FF4488",
  wiiu:   "#009AC7",
};

// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:       "#0f1923",
    bgCard:   "#1a2840",
    border:   "rgba(255,255,255,0.08)",
    text:     "#e8f0fe",
    textSub:  "#8ba3c7",
    textMute: "#3a5070",
    navBg:    "rgba(15,25,35,0.96)",
    shadow:   "0 4px 24px rgba(0,0,0,0.4)",
    shadowSm: "0 2px 8px rgba(0,0,0,0.3)",
    pill:     "rgba(255,255,255,0.06)",
    scroll:   "#2a3a50",
  },
  light: {
    bg:       "#eef3ff",
    bgCard:   "#ffffff",
    border:   "rgba(0,0,0,0.08)",
    text:     "#1a2840",
    textSub:  "#3a5070",
    textMute: "#9ab0cc",
    navBg:    "rgba(238,243,255,0.96)",
    shadow:   "0 4px 24px rgba(100,140,220,0.15)",
    shadowSm: "0 2px 8px rgba(100,140,220,0.1)",
    pill:     "rgba(0,0,0,0.05)",
    scroll:   "#c0d0e8",
  },
};

// ─── ROADMAP DATA (first person) ──────────────────────────────────────────────
const PHASES = [
  {
    id: 1, num: "01", emoji: "🌱", label: "PHASE 1", title: "ROOTS",
    age: "14–15", where: "Las Vegas → ATECH",
    tagline: "Become someone worth following before anyone is watching.",
    accent: N.green, accentLight: "#e8fdf0",
    summary: "This is my foundation year. Nothing flashy happens here — but everything depends on it. I'm building the internal architecture that the rest of my life runs on.",
    milestones: [
      "Get into ATECH and lock in Advanced Computer Science",
      "Start Genki I and do it every single day — no gaps",
      "Write my first real program — not a tutorial, something I thought of",
      "Read Ask Iwata cover to cover. Then read it again.",
      "Build one habit system and keep it for 6 months straight",
    ],
    actions: [
      "Study Japanese 30 min daily minimum — immersion counts (anime, games in JP)",
      "Start a coding journal: what I built, what broke, what I learned",
      "Follow Nintendo news actively — understand the business, not just the games",
      "Find one person smarter than me in CS and learn from them",
    ],
    build_toward: "Consistency. The ability to show up when it's boring. This phase has no audience — that's the point.",
    iwata_note: "Iwata taught himself to program at 12 on a calculator. He didn't wait for school to give him permission.",
    honest: "Most people with big goals fail here — not from lack of talent, but lack of follow-through on small things. I won't be most people.",
  },
  {
    id: 2, num: "02", emoji: "⚙️", label: "PHASE 2", title: "CONSTRUCTION",
    age: "15–17", where: "ATECH — Deep",
    tagline: "Build things. Break things. Understand things.",
    accent: N.sky, accentLight: "#e0f5ff",
    summary: "ATECH is my first real arena. This is where I stop being someone who wants to code and become someone who does. I'm stacking reps here — Japanese, programming, creative thinking.",
    milestones: [
      "Complete Genki II — no shortcuts, no skipping grammar",
      "Build at least 3 real projects (not tutorials) and put them on GitHub",
      "Take on a leadership role at school — club, group, anything",
      "Read deeply into Nintendo's history and internal culture",
      "Get my first programming win that genuinely impresses someone",
    ],
    actions: [
      "Start consuming Japanese media without subtitles — even 10 min/day",
      "Enter at least one CS competition or hackathon",
      "Study Iwata's GDC talks and Nintendo Direct presentations — analyze his communication style",
      "Read Game Over (Nintendo history) like a business case study, not entertainment",
      "Begin understanding what 'fun' means as a design philosophy, not just a feeling",
    ],
    build_toward: "A portfolio of real work. The beginning of a reputation, even locally. Proof I can lead something small.",
    iwata_note: "At HAL, Iwata was the person people went to when something was impossible. Not because he had the title — because he had the results.",
    honest: "ATECH is my springboard to Stanford, but only if I treat it that way. I do more than is required. Always.",
  },
  {
    id: 3, num: "03", emoji: "🎓", label: "PHASE 3", title: "STANFORD",
    age: "18–22", where: "Stanford University",
    tagline: "CS undergrad → CS + MBA joint degree. Four years that reshape how I think.",
    accent: N.red, accentLight: "#fff0f3",
    summary: "Stanford is not just a degree — it's a network, a credibility marker, and a place where I'll meet the people who shape the industry I want to lead. The CS + MBA joint program is rare. I use every part of it.",
    milestones: [
      "Get into Stanford CS — my application story revolves around Nintendo, Japan, and building",
      "Declare CS and begin working toward the CS + MBA joint program early",
      "Achieve N2 Japanese by sophomore year — N1 before graduation",
      "Complete at least 2 Apple internships during summers (aiming for 3)",
      "Build one project that gets real users or real attention",
      "Graduate with both CS and MBA components complete or in progress",
    ],
    actions: [
      "Take every course that touches product, design, and human behavior — not just pure CS",
      "Join Stanford's Japanese language and culture community actively",
      "Study business Japanese formally alongside academic Japanese",
      "Start reading Nikkei (Japanese business newspaper) even when it's hard",
      "Network intentionally — find people connected to Nintendo, Sony, the game industry",
      "Write. Publish things. Build a voice. Iwata was known for how he communicated.",
      "Start understanding P&L, operating margins, platform economics — the business of gaming",
    ],
    build_toward: "A degree that signals elite technical AND business capability. Japanese at near-professional level. A network that opens doors. A clear narrative about who I am and where I'm going.",
    iwata_note: "Iwata became president of Nintendo not because he climbed a ladder — because he solved problems nobody else could, and did it with integrity. Stanford gives me credibility. What I do with it gives me the rest.",
    honest: "The CS + MBA joint is hard to get into — I talk to the program office early, not late. Apple internships don't just happen: I need to be exceptional, not just good. I start that preparation now.",
  },
  {
    id: 4, num: "04", emoji: "🍎", label: "PHASE 4", title: "APPLE",
    age: "20–24", where: "Apple — Cupertino",
    tagline: "Learn what world-class product culture feels like from the inside.",
    accent: N.purple, accentLight: "#f5f0ff",
    summary: "Apple is one of the few companies that matches Nintendo in product obsession and design philosophy. Working here teaches me what it means to build at scale without losing quality. This is my finishing school before the game industry.",
    milestones: [
      "Convert internship(s) into a full-time offer post-graduation",
      "Work in a role that touches product, platform, or developer experience",
      "Get into a position where I'm interfacing with cross-functional teams",
      "Build a reputation as someone who improves whatever room I'm in",
      "Hit Japanese fluency that lets me conduct full meetings without strain",
    ],
    actions: [
      "Study how Apple's internal review process works — the attention to detail is the lesson",
      "Observe how senior leaders communicate: precision, conviction, simplicity",
      "Continue keigo and business Japanese study — I need executive-level register now",
      "Start consuming Japanese business news and Nintendo investor reports in Japanese",
      "Build relationships with anyone connected to Japan, gaming, or consumer hardware",
      "Understand platform strategy deeply — Nintendo's moat is its platform, not just its games",
    ],
    build_toward: "Real industry credibility. Executive communication skills. A résumé that makes Nintendo of America pay attention. Japanese at N1 / business level.",
    iwata_note: "Iwata once said he didn't want to be a manager — he wanted to be a creator who happened to manage. I carry that into Apple. I stay close to the product.",
    honest: "I don't stay at Apple longer than I need to. 2–3 years post-grad is enough. The goal is NOA, not Apple lifer. I know when to move.",
  },
  {
    id: 5, num: "05", emoji: "🎮", label: "PHASE 5", title: "NINTENDO OF AMERICA",
    age: "24–30", where: "Nintendo of America — Redmond, WA",
    tagline: "Get inside the company. Learn how it breathes. Make myself impossible to ignore.",
    accent: N.orange, accentLight: "#fff5ed",
    summary: "This is the most critical phase for my actual goal. Getting to NOA is one thing. What I do inside it determines whether I ever get the call from Japan. Nintendo's culture is deeply relationship-based — I'm being observed, trusted, and evaluated over years.",
    milestones: [
      "Land a senior-level role at NOA — aiming for product, platform, or business development",
      "Within 2 years, become known as someone who understands both the technical AND cultural side of Nintendo",
      "Initiate and complete at least one project that involves direct collaboration with NOJ",
      "Get a sponsor — a senior person at Nintendo who actively advocates for me",
      "Begin traveling to Japan regularly on Nintendo business",
      "Demonstrate Japanese fluency in professional settings with NOJ counterparts",
    ],
    actions: [
      "Learn everything about Nintendo's internal decision-making — nemawashi, ringi, consensus culture",
      "Be patient. Japanese corporate culture rewards long-term trust over short-term performance.",
      "Don't push to be noticed — do work so good that people can't stop noticing",
      "Study how Nintendo communicates externally: Nintendo Direct, Iwata Asks, shareholder letters",
      "Read every Nintendo shareholder Q&A in Japanese — understand how leadership thinks",
      "Build genuine relationships with NOJ counterparts — not networking, real relationships",
      "Understand Nintendo's IP philosophy, platform strategy, and global market position well enough to brief the CEO",
    ],
    build_toward: "A reputation inside Nintendo that crosses the Pacific. The trust of Japanese colleagues. A track record of meaningful contribution. An invitation to Japan.",
    iwata_note: "Iwata built trust through decades of doing exactly what he said he would do, exactly when he said he would do it. At Nintendo, your word is your currency.",
    honest: "This phase might take longer than I expect. That's okay. The path to NOJ CEO is not a sprint. The people who make it are the ones who stayed consistent for 10 years, not the ones who pushed hardest for 2.",
  },
  {
    id: 6, num: "06", emoji: "🗾", label: "PHASE 6", title: "NINTENDO OF JAPAN",
    age: "30–38", where: "Kyoto, Japan — Nintendo HQ",
    tagline: "I'm no longer visiting. I'm here.",
    accent: N.pink, accentLight: "#fff0f6",
    summary: "The transition to Japan is the hardest and most important move of my career. I'm entering a headquarters that has operated on Japanese corporate culture for decades, as a foreigner. My language, cultural fluency, technical depth, and track record all have to be unimpeachable.",
    milestones: [
      "Secure a formal transfer or senior appointment at NOJ",
      "Operate fully in Japanese — all meetings, all documents, all relationships",
      "Lead a product or platform initiative that touches the global business",
      "Build trust with the Nintendo board and senior leadership in Kyoto",
      "Be recognized internally as someone who thinks like Nintendo, not just works at Nintendo",
      "Position myself for an executive appointment — Managing Director, then higher",
    ],
    actions: [
      "Absorb everything. Observe how decisions are made at HQ level.",
      "Master the social fabric — who defers to whom, who the real influencers are",
      "Contribute to Nintendo's creative direction — not just business execution",
      "Become fluent in Nintendo's history, lore, and design philosophy at a level few outsiders reach",
      "Become the person who bridges East and West — the one both sides trust equally",
      "Stay humble. In Japan, the leader who listens is respected more than the one who talks.",
    ],
    build_toward: "Executive appointment. The trust of the Kyoto inner circle. A reputation as someone who makes Nintendo more Nintendo, not less.",
    iwata_note: "Iwata took a 50% pay cut before laying off a single employee. That act alone defined his leadership more than any product launch. I need to find my version of that moment.",
    honest: "I will be tested here in ways I cannot fully prepare for. The foreignness will never fully disappear. The question is whether I've built enough trust, skill, and genuine love for this company that it stops mattering.",
  },
  {
    id: 7, num: "07", emoji: "👑", label: "PHASE 7", title: "CEO",
    age: "38–50+", where: "Nintendo of Japan — The Chair",
    tagline: "I didn't just get here. I earned here.",
    accent: N.yellow, accentLight: "#fffbe0",
    summary: "This is the destination — but not the point. The point was always to build something worth leading. A CEO of Nintendo who is foreign, fluent, technically deep, and culturally trusted is genuinely unprecedented. My job is to carry Nintendo's soul forward while opening it to the world.",
    milestones: [
      "Appointment as CEO / Representative Director of Nintendo Co., Ltd.",
      "First Nintendo Direct as CEO — set the tone for my era",
      "Define my philosophy publicly, the way Iwata defined his",
      "Build a team that reflects both Nintendo's values and a global future",
      "Make a decision that is hard and right — the moment that defines my leadership",
    ],
    actions: [
      "Lead with fun. Iwata's definition: 'The opposite of fun is not serious — it's boring.'",
      "Be a player first. Never let the business make me forget why any of this matters.",
      "Communicate directly with fans — Nintendo's audience is its most important asset",
      "Make Nintendo more Nintendo, not more like everyone else",
      "Mentor the next generation — someone is watching me the way I watched Iwata",
    ],
    build_toward: "A legacy. Not a résumé.",
    iwata_note: "On my business card I am a corporate president. In my mind I am a game developer. But in my heart I am a gamer.",
    honest: "I will have made it. I won't forget the 14-year-old who made the list.",
  },
];

// ─── BOOK DATA (first person notes) ──────────────────────────────────────────
const BOOK_PHASES = [
  {
    id: 1, label: "PHASE 1", title: "FOUNDATION IDENTITY", age: "14–15",
    accent: N.green, accentLight: "#e8fdf0",
    focus: ["Become like Satoru Iwata internally", "Start Japanese basics", "Build programming mindset"],
    books: [
      { num: 1,  title: "Ask Iwata",                        sub: "Satoru Iwata",          type: "🎯 Core",       note: "This sets the 'why' before everything else. I read this first. Then I read it again." },
      { num: 2,  title: "Atomic Habits",                    sub: "James Clear",            type: "🧠 Mindset",    note: "My system for every other habit on this list. The foundation under the foundation." },
      { num: 3,  title: "Genki I + Workbook",               sub: "Eri Banno et al.",       type: "🇯🇵 Japanese",  note: "The gold standard starting point. I do every exercise. No skipping." },
      { num: 4,  title: "Hello World",                      sub: "Hannah Fry",             type: "💻 Tech",       note: "Builds CS intuition before I need deep coding experience. Replaces Clean Code here.", isNew: true },
      { num: 5,  title: "The Pragmatic Programmer",         sub: "Hunt & Thomas",          type: "💻 Tech",       note: "How to think like a craftsman, not just a coder." },
    ],
  },
  {
    id: 2, label: "PHASE 2", title: "FOUNDATION STRENGTH", age: "15–16",
    accent: N.sky, accentLight: "#e0f5ff",
    focus: ["Strengthen mindset", "Complete beginner Japanese", "Build cultural awareness"],
    books: [
      { num: 6,  title: "Genki II + Workbook",                     sub: "Eri Banno et al.",          type: "🇯🇵 Japanese",  note: "Finishing what I started. No skipping." },
      { num: 7,  title: "The Courage to Be Disliked",              sub: "Kishimi & Koga",            type: "🧠 Mindset",    note: "Adlerian psychology written as a Japanese dialogue. Deeply relevant to my path." },
      { num: 8,  title: "The Japanese Mind",                       sub: "Roger Davies & Osamu Ikeno", type: "🇯🇵 Culture",   note: "Essays on Japanese concepts — nemawashi, wa, amae. I need these words." },
      { num: 9,  title: "A Dictionary of Basic Japanese Grammar",  sub: "Seiichi Makino",            type: "🇯🇵 Japanese",  note: "Not a book I read — a reference I use constantly. Starting it here.", isNew: true },
    ],
  },
  {
    id: 3, label: "PHASE 3", title: "NINTENDO THINKING + LEADERSHIP", age: "16–18",
    accent: N.orange, accentLight: "#fff5ed",
    focus: ["Think like Nintendo", "Understand game design philosophy", "Develop leadership mindset"],
    books: [
      { num: 10, title: "The Art of Game Design: A Book of Lenses", sub: "Jesse Schell",    type: "🎮 Design",     note: "The best book on what 'fun' actually means. Iwata lived this." },
      { num: 11, title: "A Theory of Fun for Game Design",          sub: "Raph Koster",     type: "🎮 Design",     note: "Short, essential. Pairs perfectly with Schell." },
      { num: 12, title: "Game Over: How Nintendo Conquered the World", sub: "David Sheff",  type: "🎯 Core",       note: "The definitive Nintendo history. I read it like a business case study." },
      { num: 13, title: "Disrupting the Game",                      sub: "Reggie Fils-Aimé", type: "🎯 Core",      note: "More memoir than strategy — but Reggie's path from outsider to Nintendo's face is my blueprint." },
      { num: 14, title: "The Anatomy of Japanese Business",         sub: "Kae Chaudhuri",   type: "🇯🇵 Culture",   note: "How Japanese companies actually operate internally — not etiquette, but structure. Understanding the system I'm entering.", isNew: true },
      { num: 15, title: "Multipliers",                              sub: "Liz Wiseman",     type: "👑 Leadership", note: "Iwata was a multiplier — he made everyone around him smarter. This book explains exactly what that means and how to become one.", isNew: true },
    ],
  },
  {
    id: 4, label: "PHASE 4", title: "REAL JAPANESE", age: "17–20",
    accent: N.purple, accentLight: "#f5f0ff",
    focus: ["Transition to real Japanese", "Close the intermediate gap", "Build reading + comprehension"],
    books: [
      { num: 16, title: "Tobira: Gateway to Advanced Japanese", sub: "Mayumi Oka et al.", type: "🇯🇵 Japanese",  note: "The bridge most learners skip. I don't. This is where real fluency begins." },
      { num: 17, title: "Shin Kanzen Master N2 Series",         sub: "Various",           type: "🇯🇵 Japanese",  note: "Grammar, reading, listening, vocab. Working through all volumes." },
      { num: 18, title: "Japanese for Busy People III",         sub: "AJALT",             type: "🇯🇵 Japanese",  note: "Bridges conversational Japanese toward professional registers before I hit keigo.", isNew: true },
      { num: 19, title: "Japan's Software Factories",           sub: "Michael Cusumano",  type: "🇯🇵 Culture",   note: "How Japanese tech companies build software differently. Understanding the environment before I walk into it.", isNew: true },
    ],
  },
  {
    id: 5, label: "PHASE 5", title: "IWATA-LEVEL PROGRAMMER", age: "18–22",
    accent: N.red, accentLight: "#fff0f3",
    focus: ["Deep technical mastery", "Become a problem solver under pressure", "Build serious credibility"],
    books: [
      { num: 20, title: "Grokking Algorithms",                          sub: "Aditya Bhargava",  type: "💻 Tech", note: "Starting here — visual, intuitive, builds the mental models for everything above it." },
      { num: 21, title: "Clean Code",                                   sub: "Robert C. Martin", type: "💻 Tech", note: "Practical foundation first. I'll feel every page after writing real, messy code." },
      { num: 22, title: "Refactoring",                                  sub: "Martin Fowler",    type: "💻 Tech", note: "The Iwata skill — making broken systems better without breaking them further." },
      { num: 23, title: "Design Patterns",                              sub: "Gang of Four",     type: "💻 Tech", note: "Architecture thinking. I need Clean Code and Refactoring first or this won't land." },
      { num: 24, title: "A Philosophy of Software Design",              sub: "John Ousterhout",  type: "💻 Tech", note: "Bridges everything into SICP. More opinionated than Clean Code, more grounded than SICP.", isNew: true },
      { num: 25, title: "Structure and Interpretation of Computer Programs", sub: "Abelson & Sussman", type: "💻 Tech", note: "Last for a reason. SICP too early = brain shutdown. SICP after real experience = deep mastery. This is the summit." },
    ],
  },
  {
    id: 6, label: "PHASE 6", title: "EXECUTIVE LEVEL", age: "22+",
    accent: N.yellow, accentLight: "#fffbe0",
    focus: ["Executive communication", "Cultural mastery — deep, not surface", "Leadership at scale"],
    books: [
      { num: 26, title: "Shin Kanzen Master N1 Series",      sub: "Various",                  type: "🇯🇵 Japanese",  note: "The summit of formal Japanese study. By this point it feels like finishing, not starting." },
      { num: 27, title: "Business Japanese",                 sub: "Mitsubishi Corporation",   type: "🇯🇵 Japanese",  note: "Real corporate Japanese from people who live it." },
      { num: 28, title: "Keigo Training Workbook",           sub: "Various",                  type: "🇯🇵 Japanese",  note: "Honorific language is not optional in Japanese executive culture. I drill it." },
      { num: 29, title: "The Culture Map",                   sub: "Erin Meyer",               type: "🌏 Culture",    note: "How to read the invisible rules of cross-cultural business. Essential for navigating Japan ↔ America." },
      { num: 30, title: "Never Split the Difference",        sub: "Chris Voss",               type: "👑 Leadership", note: "I will negotiate budgets, teams, and direction as an executive. Learning this early.", isNew: true },
      { num: 31, title: "The Ride of a Lifetime",            sub: "Robert Iger",              type: "👑 Leadership", note: "A biography of a foreign executive who climbed inside a major creative company — not a founder. The path most relevant to mine.", isNew: true },
      { num: 32, title: "An Introduction to Japanese Society", sub: "Yoshio Sugimoto",        type: "🇯🇵 Culture",   note: "Understanding the social structure I'm operating inside — not just the business layer.", isNew: true },
    ],
  },
];

// ─── TYPE BADGE STYLES ────────────────────────────────────────────────────────
const TYPE_META = {
  "🎯 Core":       { lBg: "#ffe0e5", lBd: "#ffb3be", lTx: "#b80018", dBg: "rgba(232,41,74,0.2)",   dTx: "#ff8899" },
  "🧠 Mindset":    { lBg: "#ede0ff", lBd: "#c9a8ff", lTx: "#5500bb", dBg: "rgba(136,68,238,0.2)",  dTx: "#bb88ff" },
  "🇯🇵 Japanese":  { lBg: "#ffe0f2", lBd: "#ffb3da", lTx: "#aa0050", dBg: "rgba(255,68,136,0.2)",  dTx: "#ff88bb" },
  "🇯🇵 Culture":   { lBg: "#ffe0f2", lBd: "#ffb3da", lTx: "#aa0050", dBg: "rgba(255,68,136,0.2)",  dTx: "#ff88bb" },
  "🌏 Culture":    { lBg: "#ffe0f2", lBd: "#ffb3da", lTx: "#aa0050", dBg: "rgba(255,68,136,0.2)",  dTx: "#ff88bb" },
  "💻 Tech":       { lBg: "#ddf0ff", lBd: "#88ccff", lTx: "#004da0", dBg: "rgba(0,170,255,0.2)",   dTx: "#66ccff" },
  "🎮 Design":     { lBg: "#fff0dd", lBd: "#ffd088", lTx: "#884400", dBg: "rgba(255,120,40,0.2)",  dTx: "#ffaa66" },
  "👑 Leadership": { lBg: "#fff8dd", lBd: "#ffdd88", lTx: "#775500", dBg: "rgba(255,184,0,0.2)",   dTx: "#ffdd66" },
};

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function TypeBadge({ type, dark }) {
  const m = TYPE_META[type] || TYPE_META["💻 Tech"];
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
      padding: "3px 9px", borderRadius: 99,
      background: dark ? m.dBg : m.lBg,
      color: dark ? m.dTx : m.lTx,
      border: dark ? "none" : `1.5px solid ${m.lBd}`,
    }}>{type}</span>
  );
}

function NewBadge() {
  return (
    <span style={{
      fontFamily: "'Nunito', sans-serif", fontSize: 9, fontWeight: 900,
      padding: "2px 9px", borderRadius: 99,
      background: "linear-gradient(135deg, #FFB800, #FF7828)",
      color: "#fff", boxShadow: "0 2px 8px rgba(255,120,0,0.35)",
    }}>✦ NEW</span>
  );
}

// Stat card used in both hero sections
function StatCard({ value, label, color }) {
  return (
    <div style={{
      padding: "14px 28px", borderRadius: 20, textAlign: "center",
      background: `${color}18`, border: `2.5px solid ${color}55`,
      boxShadow: `0 4px 18px ${color}28`,
    }}>
      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ─── ROADMAP PAGE ─────────────────────────────────────────────────────────────
function RoadmapPage({ dark, T }) {
  const [open, setOpen] = useState(1);
  const [tab,  setTab]  = useState("milestones");

  const toggle = (id) => {
    setOpen(prev => prev === id ? null : id);
    setTab("milestones");
    // Smooth scroll to the phase card, offset by nav height
    setTimeout(() => {
      const el = document.getElementById(`phase-${id}`);
      if (el) {
        const navH = 58;
        const top = el.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: "56px 24px 48px", maxWidth: 880, margin: "0 auto", textAlign: "center", borderBottom: `2px solid ${T.border}` }}>
        <div style={{ display: "inline-flex", marginBottom: 20, padding: "6px 18px", background: dark ? "rgba(0,170,255,0.12)" : "rgba(0,102,204,0.08)", borderRadius: 99, border: `1.5px solid ${dark ? "rgba(0,170,255,0.25)" : "rgba(0,102,204,0.15)"}` }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: dark ? N.sky : N.blue, textTransform: "uppercase" }}>
            Personal Life Roadmap · The NOJ Path
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: "clamp(36px, 6vw, 68px)", lineHeight: 1.1, marginBottom: 18,
          color: dark ? N.sky : N.blue,
        }}>
          First Foreign CEO<br />of Nintendo of Japan
        </h1>

        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: T.textSub, fontWeight: 600, lineHeight: 1.8, maxWidth: 460, margin: "0 auto 32px" }}>
          My roadmap to becoming the first foreign CEO of Nintendo.<br />
          Inspired by Satoru Iwata. Built by sebastianosky.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <StatCard value="7"   label="Phases" color={N.sky}    />
          <StatCard value="~25" label="Years"  color={N.teal}   />
          <StatCard value="1"   label="Goal"   color={N.yellow} />
        </div>
      </div>

      {/* Timeline */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "28px 24px 0", overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", minWidth: 560 }}>
          {PHASES.map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", flex: i < PHASES.length - 1 ? 1 : 0 }}>
              <button onClick={() => toggle(p.id)} style={{
                width: open === p.id ? 46 : 32, height: open === p.id ? 46 : 32,
                borderRadius: "50%", border: `3px solid ${open === p.id ? p.accent : T.border}`,
                background: open === p.id ? p.accent : T.bgCard,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0, outline: "none",
                transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow: open === p.id ? `0 4px 20px ${p.accent}55` : T.shadowSm,
                fontSize: open === p.id ? 20 : 14,
              }}>{p.emoji}</button>
              {i < PHASES.length - 1 && (
                <div style={{
                  flex: 1, height: 3, minWidth: 12, borderRadius: 99,
                  background: i < PHASES.findIndex(x => x.id === open)
                    ? `linear-gradient(to right, ${PHASES[i].accent}, ${PHASES[i + 1].accent})`
                    : T.border,
                  transition: "background 0.4s",
                }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", minWidth: 560, paddingTop: 8, paddingBottom: 4 }}>
          {PHASES.map((p, i) => (
            <div key={p.id} style={{
              flex: i < PHASES.length - 1 ? 1 : 0,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
              color: open === p.id ? p.accent : T.textMute,
              letterSpacing: 0.3, transition: "color 0.25s", paddingLeft: 2,
              fontWeight: open === p.id ? 700 : 400,
            }}>{p.age}</div>
          ))}
        </div>
      </div>

      {/* Phase accordion */}
      <div style={{ maxWidth: 880, margin: "20px auto 0", padding: "0 24px 64px" }}>
        {PHASES.map(phase => {
          const isOpen = open === phase.id;
          return (
            <div key={phase.id} id={`phase-${phase.id}`} style={{ marginBottom: 10 }}>
              <button onClick={() => toggle(phase.id)} style={{
                width: "100%", textAlign: "left", cursor: "pointer", outline: "none",
                background: isOpen ? (dark ? `${phase.accent}16` : phase.accentLight) : T.bgCard,
                border: `2.5px solid ${isOpen ? phase.accent + "55" : T.border}`,
                borderRadius: isOpen ? "18px 18px 0 0" : "18px",
                padding: "18px 22px", display: "flex", alignItems: "center", gap: 16,
                transition: "all 0.2s ease",
                boxShadow: isOpen ? `0 6px 24px ${phase.accent}22` : T.shadowSm,
              }}>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: isOpen ? phase.accent : T.textMute, minWidth: 52, lineHeight: 1, transition: "color 0.25s" }}>
                  {phase.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 3 }}>
                    <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: T.text }}>{phase.emoji} {phase.title}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.textMute, letterSpacing: 1 }}>{phase.where}</span>
                  </div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: T.textSub, fontWeight: 600, fontStyle: "italic" }}>{phase.tagline}</div>
                </div>
                <div style={{
                  fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, flexShrink: 0,
                  padding: "5px 14px", borderRadius: 99,
                  background: isOpen ? `linear-gradient(135deg, ${phase.accent}, ${phase.accent}cc)` : T.pill,
                  color: isOpen ? "#fff" : T.textSub,
                  boxShadow: isOpen ? `0 3px 12px ${phase.accent}44` : "none",
                  transition: "all 0.25s",
                }}>Age {phase.age}</div>
                <div style={{ fontSize: 20, color: isOpen ? phase.accent : T.textMute, transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s cubic-bezier(0.34,1.2,0.64,1)", flexShrink: 0 }}>▾</div>
              </button>

              {isOpen && (
                <div style={{
                  background: dark ? `${phase.accent}08` : `${phase.accentLight}cc`,
                  border: `2.5px solid ${phase.accent}44`, borderTop: "none",
                  borderRadius: "0 0 18px 18px", padding: "0 22px 26px",
                  boxShadow: `0 10px 36px ${phase.accent}18`,
                }}>
                  <p style={{ padding: "18px 0 16px", borderBottom: `1.5px solid ${phase.accent}22`, fontFamily: "'Nunito', sans-serif", fontSize: 14, color: T.textSub, lineHeight: 1.8, fontWeight: 600, margin: 0 }}>
                    {phase.summary}
                  </p>

                  {/* Tab buttons */}
                  <div style={{ display: "flex", gap: 8, padding: "16px 0 14px", flexWrap: "wrap" }}>
                    {[["milestones", "🏁 Milestones"], ["actions", "⚡ Actions"], ["honest", "💬 Real Talk"]].map(([t, label]) => (
                      <button key={t} onClick={e => { e.stopPropagation(); setTab(t); }} style={{
                        fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 800,
                        padding: "7px 16px", borderRadius: 99, border: "none", cursor: "pointer",
                        background: tab === t ? `linear-gradient(135deg, ${phase.accent}, ${phase.accent}cc)` : T.pill,
                        color: tab === t ? "#fff" : T.textSub,
                        boxShadow: tab === t ? `0 3px 12px ${phase.accent}44` : "none",
                        transition: "all 0.2s cubic-bezier(0.34,1.2,0.64,1)",
                        transform: tab === t ? "scale(1.05)" : "scale(1)",
                      }}>{label}</button>
                    ))}
                  </div>

                  {/* Milestones tab */}
                  {tab === "milestones" && (
                    <div>
                      {phase.milestones.map((m, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
                          <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 2, background: `linear-gradient(135deg, ${phase.accent}, ${phase.accent}99)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 8px ${phase.accent}44` }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
                          </div>
                          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: T.text, lineHeight: 1.7, fontWeight: 600 }}>{m}</div>
                        </div>
                      ))}
                      <div style={{ marginTop: 18, padding: "16px 18px", background: dark ? `${phase.accent}18` : phase.accentLight, border: `2px solid ${phase.accent}44`, borderRadius: 14, boxShadow: `0 3px 14px ${phase.accent}18` }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: 2, color: phase.accent, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>🔥 Building toward</div>
                        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: T.textSub, lineHeight: 1.7, fontWeight: 600, fontStyle: "italic" }}>{phase.build_toward}</div>
                      </div>
                    </div>
                  )}

                  {/* Actions tab */}
                  {tab === "actions" && (
                    <div>
                      {phase.actions.map((a, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
                          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 17, color: phase.accent, minWidth: 22, marginTop: 1, lineHeight: 1.3 }}>→</div>
                          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: T.text, lineHeight: 1.7, fontWeight: 600 }}>{a}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Real Talk tab */}
                  {tab === "honest" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 4 }}>
                      <div style={{ padding: "18px 20px", background: T.bgCard, border: `2px solid ${T.border}`, borderRadius: 14, boxShadow: T.shadowSm }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: 2, color: T.textMute, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>🎮 The Iwata Lesson</div>
                        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: T.text, lineHeight: 1.8, fontWeight: 700, fontStyle: "italic" }}>"{phase.iwata_note}"</div>
                      </div>
                      <div style={{ padding: "18px 20px", background: dark ? `${phase.accent}15` : phase.accentLight, border: `2px solid ${phase.accent}44`, borderRadius: 14, boxShadow: `0 3px 14px ${phase.accent}18` }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: 2, color: phase.accent, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>💬 Real Talk</div>
                        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: T.textSub, lineHeight: 1.8, fontWeight: 600 }}>{phase.honest}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer quote */}
      <div style={{ borderTop: `2px solid ${T.border}`, padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: T.textMute, fontStyle: "italic", fontWeight: 700, maxWidth: 560, margin: "0 auto 10px" }}>
          "On my business card I am a corporate president. In my mind I am a game developer. But in my heart I am a gamer."
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.textMute, letterSpacing: 2, opacity: 0.5 }}>— SATORU IWATA</div>
      </div>
    </div>
  );
}

// ─── RESOURCES PAGE ───────────────────────────────────────────────────────────
const LS_KEY = "noj_read_books";

function ResourcesPage({ dark, T }) {
  const [openPhase, setOpenPhase] = useState(null);
  const [filter,    setFilter]    = useState("All");
  const [read,      setRead]      = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
  });

  // Persist checkmarks to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(read)); }
    catch { /* storage unavailable */ }
  }, [read]);

  const toggleRead = (num, e) => {
    e.stopPropagation();
    setRead(prev => ({ ...prev, [num]: !prev[num] }));
  };

  const allTypes = ["All", "🎯 Core", "🧠 Mindset", "🇯🇵 Japanese", "🇯🇵 Culture", "💻 Tech", "🎮 Design", "👑 Leadership"];
  const totalBooks = BOOK_PHASES.reduce((s, p) => s + p.books.length, 0);
  const newBooks   = BOOK_PHASES.reduce((s, p) => s + p.books.filter(b => b.isNew).length, 0);
  const readCount  = Object.values(read).filter(Boolean).length;

  const filtered = BOOK_PHASES
    .map(p => ({
      ...p,
      books: filter === "All"
        ? p.books
        : p.books.filter(b => b.type === filter || (filter === "🇯🇵 Culture" && b.type === "🌏 Culture")),
    }))
    .filter(p => p.books.length > 0);

  return (
    <div>
      {/* Header */}
      <div style={{ padding: "56px 24px 40px", maxWidth: 880, margin: "0 auto", textAlign: "center", borderBottom: `2px solid ${T.border}` }}>
        <div style={{ display: "inline-flex", marginBottom: 18, padding: "6px 18px", background: dark ? "rgba(255,184,0,0.12)" : "rgba(255,184,0,0.1)", borderRadius: 99, border: "1.5px solid rgba(255,184,0,0.3)" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: N.yellow, textTransform: "uppercase" }}>Resource Library</span>
        </div>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(28px,5vw,54px)", marginBottom: 14, lineHeight: 1.1, color: N.orange }}>
          My Reading Roadmap
        </h2>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: T.textSub, fontWeight: 600, lineHeight: 1.7, maxWidth: 440, margin: "0 auto 28px" }}>
          32 books across 6 phases. Every book has a specific reason. Nothing was added just to add more.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <StatCard value={totalBooks} label="Books"    color={N.sky}    />
          <StatCard value={6}          label="Phases"   color={N.teal}   />
          <StatCard value={newBooks}   label="New Adds" color={N.yellow} />
          <StatCard value={`${readCount}/${totalBooks}`} label="Read" color={N.green} />
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "22px 24px 8px", display: "flex", flexWrap: "wrap", gap: 7 }}>
        {allTypes.map(t => {
          const active = filter === t;
          return (
            <button key={t} onClick={() => { setFilter(t); setOpenPhase(null); }} style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 800,
              padding: "6px 16px", borderRadius: 99, border: "none", cursor: "pointer",
              background: active ? `linear-gradient(135deg, ${N.wiiu}, ${N.sky})` : T.pill,
              color: active ? "#fff" : T.textSub,
              boxShadow: active ? `0 3px 14px ${N.sky}44` : "none",
              transition: "all 0.2s cubic-bezier(0.34,1.2,0.64,1)",
              transform: active ? "scale(1.06)" : "scale(1)",
            }}>{t}</button>
          );
        })}
      </div>

      {/* Book phase accordions */}
      <div style={{ maxWidth: 880, margin: "14px auto 0", padding: "0 24px 64px" }}>
        {filtered.map(phase => {
          const isOpen = openPhase === phase.id || filter !== "All";
          const phaseRead = phase.books.filter(b => read[b.num]).length;
          return (
            <div key={phase.id} style={{ marginBottom: 12 }}>
              <div onClick={() => filter === "All" && setOpenPhase(isOpen && openPhase === phase.id ? null : phase.id)} style={{
                background: isOpen ? (dark ? `${phase.accent}16` : phase.accentLight) : T.bgCard,
                border: `2.5px solid ${isOpen ? phase.accent + "55" : T.border}`,
                borderRadius: isOpen && filter === "All" ? "18px 18px 0 0" : "18px",
                padding: "18px 22px", display: "flex", alignItems: "center", gap: 16,
                cursor: filter === "All" ? "pointer" : "default",
                transition: "all 0.2s ease",
                boxShadow: isOpen ? `0 6px 24px ${phase.accent}22` : T.shadowSm,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: phase.accent, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>{phase.label}</span>
                    <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: T.text }}>{phase.title}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.textMute }}>Age {phase.age}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {phase.focus.map(f => (
                      <span key={f} style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700, padding: "3px 11px", borderRadius: 99, background: dark ? `${phase.accent}18` : phase.accentLight, border: `1.5px solid ${phase.accent}44`, color: phase.accent }}>{f}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {/* Progress pill */}
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 99, background: phaseRead === phase.books.length ? `linear-gradient(135deg, ${N.green}, ${N.teal})` : T.pill, color: phaseRead === phase.books.length ? "#fff" : T.textMute, transition: "all 0.3s" }}>
                    {phaseRead}/{phase.books.length} read
                  </span>
                  {filter === "All" && (
                    <div style={{ fontSize: 18, color: isOpen ? phase.accent : T.textMute, transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}>▾</div>
                  )}
                </div>
              </div>

              {isOpen && (
                <div style={{ background: dark ? `${phase.accent}06` : `${phase.accentLight}aa`, border: `2.5px solid ${phase.accent}44`, borderTop: "none", borderRadius: "0 0 18px 18px", padding: "6px 22px 24px", boxShadow: `0 10px 36px ${phase.accent}14` }}>
                  {phase.books.map((book, i) => {
                    const done = !!read[book.num];
                    return (
                      <div key={book.num} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 0", borderBottom: i < phase.books.length - 1 ? `1.5px solid ${T.border}` : "none", opacity: done ? 0.55 : 1, transition: "opacity 0.2s" }}>

                        {/* Checkmark */}
                        <button onClick={e => toggleRead(book.num, e)} title={done ? "Mark as unread" : "Mark as read"} style={{
                          width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginTop: 2, cursor: "pointer", outline: "none",
                          border: `2.5px solid ${done ? phase.accent : T.border}`,
                          background: done ? `linear-gradient(135deg, ${phase.accent}, ${phase.accent}cc)` : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                          boxShadow: done ? `0 2px 10px ${phase.accent}55` : "none",
                          transform: done ? "scale(1.08)" : "scale(1)",
                        }}>
                          {done && <span style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>✓</span>}
                        </button>

                        {/* Book number chip */}
                        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 14, color: phase.accent, minWidth: 34, padding: "4px 7px", borderRadius: 10, textAlign: "center", background: dark ? `${phase.accent}18` : phase.accentLight, border: `2px solid ${phase.accent}44`, boxShadow: `0 2px 8px ${phase.accent}22`, flexShrink: 0 }}>
                          {String(book.num).padStart(2, "0")}
                        </div>

                        {/* Book info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 5 }}>
                            <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 17, color: T.text, textDecoration: done ? "line-through" : "none" }}>{book.title}</span>
                            {book.isNew && <NewBadge />}
                            <TypeBadge type={book.type} dark={dark} />
                          </div>
                          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: T.textMute, marginBottom: 6, fontWeight: 700 }}>{book.sub}</div>
                          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: T.textSub, lineHeight: 1.65, fontWeight: 600, fontStyle: "italic" }}>{book.note}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
const BG_DOTS = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 137.508) % 100,
  y: (i * 98.618)  % 100,
  size: 4 + (i % 4) * 4,
  color: Object.values(N)[i % Object.keys(N).length],
  dur: 3 + (i % 4),
  delay: (i * 0.28) % 2.5,
}));

export default function App() {
  const [page, setPage] = useState("roadmap");
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("noj_theme") === "dark"; }
    catch { return false; }
  });

  const T = THEMES[dark ? "dark" : "light"];

  useEffect(() => {
    try { localStorage.setItem("noj_theme", dark ? "dark" : "light"); }
    catch { /* storage unavailable */ }
  }, [dark]);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: T.bg, minHeight: "100vh", color: T.text, position: "relative" }}>
      <style>{`
        ${FONTS}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: ${T.bg}; margin: 0; padding: 0; }
        @keyframes fadeSlide { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatDot { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        button { font-family: inherit; outline: none; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.scroll}; border-radius: 99px; }
      `}</style>

      {/* Wii U menu floating dots */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {BG_DOTS.map((d, i) => (
          <div key={i} style={{ position: "absolute", left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, borderRadius: "50%", background: d.color, opacity: dark ? 0.045 : 0.065, animation: `floatDot ${d.dur}s ease-in-out infinite`, animationDelay: `${d.delay}s` }} />
        ))}
      </div>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: T.navBg, backdropFilter: "blur(20px) saturate(1.6)", borderBottom: `2px solid ${T.border}`, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, boxShadow: T.shadow }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 12, background: `linear-gradient(135deg, ${N.red}, ${N.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 3px 12px rgba(0,0,0,0.25)" }}>🎮</div>
          <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: N.red }}>NOJ Path</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[["roadmap", "🗺 Roadmap"], ["resources", "📚 Resources"]].map(([id, label]) => (
            <button key={id} onClick={() => setPage(id)} style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 800,
              padding: "7px 18px", borderRadius: 99, border: "none", cursor: "pointer",
              background: page === id ? `linear-gradient(135deg, ${N.blue}, ${N.sky})` : T.pill,
              color: page === id ? "#fff" : T.textSub,
              boxShadow: page === id ? `0 3px 16px ${N.sky}55` : "none",
              transition: "all 0.2s cubic-bezier(0.34,1.2,0.64,1)",
              transform: page === id ? "scale(1.05)" : "scale(1)",
            }}>{label}</button>
          ))}

          <button onClick={() => setDark(d => !d)} title="Toggle theme" style={{ width: 40, height: 40, borderRadius: 12, border: `2px solid ${T.border}`, background: T.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "all 0.2s ease", boxShadow: T.shadowSm }}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* Page content */}
      <div key={page} style={{ position: "relative", zIndex: 1, animation: "fadeSlide 0.3s ease" }}>
        {page === "roadmap"
          ? <RoadmapPage dark={dark} T={T} />
          : <ResourcesPage dark={dark} T={T} />
        }
      </div>
    </div>
  );
}