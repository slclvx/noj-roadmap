import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE — paste your keys here
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL  = "https://zikzjouumufjndzeifnz.supabase.co";
const SUPABASE_ANON = "sb_publishable_S0MqxHx-Njdkl194-4pDrQ_1MdRRRBC";

// The username that owns this dashboard — only this account gets edit controls
const OWNER_USERNAME = "sebastianosky";

async function sbFetch(path, opts = {}, token = null) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${token || SUPABASE_ANON}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...opts.headers,
    },
    ...opts,
  });
  if (!res.ok) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function sbRpc(fn, body, token) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${fn}`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// FONTS — iiSU uses rounded bubbly type
// ─────────────────────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=Fredoka+One&family=JetBrains+Mono:wght@400;600;700&display=swap');`;

// ─────────────────────────────────────────────────────────────────────────────
// PALETTE — iiSU: white cards, vivid pill accents, soft pastel backgrounds
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  red:    "#FF5C75", orange: "#FF8C42", yellow: "#FFC844",
  green:  "#3DD68C", teal:   "#00C8A8", blue:   "#3B8CFF",
  sky:    "#5CD3FF", purple: "#9B6BFF", pink:   "#FF6BB5",
  // Light
  bg:       "#F2F5FF", bgCard: "#FFFFFF", bgSoft: "#E8EEFF",
  border:   "rgba(100,120,220,0.11)", borderM: "rgba(100,120,220,0.22)",
  text:     "#1A1F3C", textSub: "#4A5280", textMute: "#9AA0C4",
  // Dark
  dBg:      "#0D1120", dBgCard: "#161B2E", dBgSoft: "#1C2340",
  dBorder:  "rgba(140,160,255,0.1)", dBorderM: "rgba(140,160,255,0.2)",
  dText:    "#EEF0FF", dTextSub: "#8890C4", dTextMute: "#38405E",
};

function T(dark) {
  return {
    bg:      dark ? C.dBg      : C.bg,
    card:    dark ? C.dBgCard  : C.bgCard,
    soft:    dark ? C.dBgSoft  : C.bgSoft,
    border:  dark ? C.dBorder  : C.border,
    borderM: dark ? C.dBorderM : C.borderM,
    text:    dark ? C.dText    : C.text,
    sub:     dark ? C.dTextSub : C.textSub,
    mute:    dark ? C.dTextMute: C.textMute,
    nav:     dark ? "rgba(13,17,32,0.96)"  : "rgba(242,245,255,0.96)",
    shadow:  dark ? "0 4px 24px rgba(0,0,0,0.5)" : "0 4px 24px rgba(100,120,220,0.12)",
    shadowS: dark ? "0 2px 10px rgba(0,0,0,0.35)": "0 2px 10px rgba(100,120,220,0.09)",
    pill:    dark ? "rgba(255,255,255,0.07)" : "rgba(100,120,220,0.08)",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const PHASES = [
  { id:1, num:"01", emoji:"🌱", label:"PHASE 1", title:"ROOTS", age:"14–15", where:"Las Vegas → ATECH",
    tagline:"Become someone worth following before anyone is watching.", accent:C.green,
    summary:"This is my foundation year. Nothing flashy happens here — but everything depends on it. I'm building the internal architecture that the rest of my life runs on.",
    milestones:["Get into ATECH and lock in Advanced Computer Science","Start Genki I and do it every single day — no gaps","Write my first real program — not a tutorial, something I thought of","Read Ask Iwata cover to cover. Then read it again.","Build one habit system and keep it for 6 months straight"],
    actions:["Study Japanese 30 min daily minimum — immersion counts (anime, games in JP)","Start a coding journal: what I built, what broke, what I learned","Follow Nintendo news actively — understand the business, not just the games","Find one person smarter than me in CS and learn from them"],
    build_toward:"Consistency. The ability to show up when it's boring. This phase has no audience — that's the point.",
    iwata_note:"Iwata taught himself to program at 12 on a calculator. He didn't wait for school to give him permission.",
    honest:"Most people with big goals fail here — not from lack of talent, but lack of follow-through on small things. I won't be most people." },
  { id:2, num:"02", emoji:"⚙️", label:"PHASE 2", title:"CONSTRUCTION", age:"15–17", where:"ATECH — Deep",
    tagline:"Build things. Break things. Understand things.", accent:C.sky,
    summary:"ATECH is my first real arena. This is where I stop being someone who wants to code and become someone who does. I'm stacking reps — Japanese, programming, creative thinking.",
    milestones:["Complete Genki II — no shortcuts, no skipping grammar","Build at least 3 real projects and put them on GitHub","Take on a leadership role at school — club, group, anything","Read deeply into Nintendo's history and internal culture","Get my first programming win that genuinely impresses someone"],
    actions:["Start consuming Japanese media without subtitles — even 10 min/day","Enter at least one CS competition or hackathon","Study Iwata's GDC talks and Nintendo Directs — analyze his communication style","Read Game Over like a business case study, not entertainment","Begin understanding what 'fun' means as a design philosophy, not just a feeling"],
    build_toward:"A portfolio of real work. The beginning of a reputation, even locally. Proof I can lead something small.",
    iwata_note:"At HAL, Iwata was the person people went to when something was impossible. Not because he had the title — because he had the results.",
    honest:"ATECH is my springboard to Stanford, but only if I treat it that way. I do more than is required. Always." },
  { id:3, num:"03", emoji:"🎓", label:"PHASE 3", title:"STANFORD", age:"18–22", where:"Stanford University",
    tagline:"CS undergrad → CS + MBA joint degree. Four years that reshape how I think.", accent:C.red,
    summary:"Stanford is not just a degree — it's a network, a credibility marker, and a place where I'll meet the people who shape the industry I want to lead. The CS + MBA joint program is rare. I use every part of it.",
    milestones:["Get into Stanford CS — my application revolves around Nintendo, Japan, and building","Begin working toward the CS + MBA joint program early","Achieve N2 Japanese by sophomore year — N1 before graduation","Complete at least 2 Apple internships (aiming for 3)","Build one project that gets real users or real attention","Graduate with both CS and MBA components complete"],
    actions:["Take every course that touches product, design, and human behavior","Join Stanford's Japanese language and culture community","Study business Japanese alongside academic Japanese","Start reading Nikkei even when it's hard","Network intentionally — people connected to Nintendo, Sony, the game industry","Write. Publish things. Build a voice. Iwata was known for how he communicated.","Understand P&L, operating margins, platform economics — the business of gaming"],
    build_toward:"A degree that signals elite technical AND business capability. Japanese at near-professional level. A network that opens doors.",
    iwata_note:"Iwata became president of Nintendo not because he climbed a ladder — because he solved problems nobody else could, and did it with integrity.",
    honest:"The CS + MBA joint is hard to get into — I talk to the program office early, not late. Apple internships don't just happen. I need to be exceptional, not just good." },
  { id:4, num:"04", emoji:"🍎", label:"PHASE 4", title:"APPLE", age:"20–24", where:"Apple — Cupertino",
    tagline:"Learn what world-class product culture feels like from the inside.", accent:C.purple,
    summary:"Apple is one of the few companies that matches Nintendo in product obsession and design philosophy. Working here teaches me what it means to build at scale without losing quality. This is my finishing school before the game industry.",
    milestones:["Convert internships into a full-time offer post-graduation","Work in a role touching product, platform, or developer experience","Interface with cross-functional teams","Build a reputation as someone who improves whatever room I'm in","Hit Japanese fluency that lets me run full meetings without strain"],
    actions:["Study Apple's internal review process — the attention to detail is the lesson","Observe how senior leaders communicate: precision, conviction, simplicity","Continue keigo and business Japanese study — executive-level register now","Consume Japanese business news and Nintendo investor reports in Japanese","Build relationships with anyone connected to Japan, gaming, or consumer hardware","Understand platform strategy — Nintendo's moat is its platform, not just its games"],
    build_toward:"Real industry credibility. Executive communication skills. A résumé that makes Nintendo of America pay attention.",
    iwata_note:"Iwata once said he didn't want to be a manager — he wanted to be a creator who happened to manage. I carry that into Apple. I stay close to the product.",
    honest:"I don't stay at Apple longer than I need to. 2–3 years post-grad is enough. The goal is NOA, not Apple lifer. I know when to move." },
  { id:5, num:"05", emoji:"🎮", label:"PHASE 5", title:"NINTENDO OF AMERICA", age:"24–30", where:"Nintendo of America — Redmond, WA",
    tagline:"Get inside the company. Learn how it breathes. Make myself impossible to ignore.", accent:C.orange,
    summary:"This is the most critical phase. Getting to NOA is one thing. What I do inside it determines whether I ever get the call from Japan. Nintendo's culture is deeply relationship-based — I'm being observed, trusted, and evaluated over years.",
    milestones:["Land a senior role at NOA — product, platform, or business development","Within 2 years, become known as someone who understands both the technical AND cultural side","Complete at least one project with direct NOJ collaboration","Get a sponsor — a senior person who actively advocates for me","Begin traveling to Japan regularly on Nintendo business","Demonstrate Japanese fluency in professional settings with NOJ counterparts"],
    actions:["Learn Nintendo's internal decision-making — nemawashi, ringi, consensus culture","Be patient. Japanese corporate culture rewards long-term trust over short-term performance.","Do work so good that people can't stop noticing","Study Nintendo Directs, Iwata Asks, and shareholder letters deeply","Read every Nintendo shareholder Q&A in Japanese","Build genuine relationships with NOJ counterparts — not networking, real relationships","Understand Nintendo's strategy well enough to brief the CEO"],
    build_toward:"A reputation inside Nintendo that crosses the Pacific. The trust of Japanese colleagues. An invitation to Japan.",
    iwata_note:"Iwata built trust through decades of doing exactly what he said he would do, exactly when he said he would do it. At Nintendo, your word is your currency.",
    honest:"This phase might take longer than I expect. That's okay. The people who make it stayed consistent for 10 years, not the ones who pushed hardest for 2." },
  { id:6, num:"06", emoji:"🗾", label:"PHASE 6", title:"NINTENDO OF JAPAN", age:"30–38", where:"Kyoto, Japan — Nintendo HQ",
    tagline:"I'm no longer visiting. I'm here.", accent:C.pink,
    summary:"The transition to Japan is the hardest and most important move of my career. My language, cultural fluency, technical depth, and track record all have to be unimpeachable. But if I've done everything before this right — I belong here.",
    milestones:["Secure a formal transfer or senior appointment at NOJ","Operate fully in Japanese — all meetings, all documents, all relationships","Lead a product or platform initiative touching the global business","Build trust with the Nintendo board and senior leadership in Kyoto","Be recognized as someone who thinks like Nintendo, not just works at Nintendo","Position myself for executive appointment — Managing Director, then higher"],
    actions:["Absorb everything. Observe how decisions are made at HQ level.","Master the social fabric — who defers to whom, who the real influencers are","Contribute to creative direction — not just business execution","Become fluent in Nintendo's history, lore, and design philosophy at a level few outsiders reach","Become the person who bridges East and West — the one both sides trust equally","Stay humble. In Japan, the leader who listens is respected more than the one who talks."],
    build_toward:"Executive appointment. The trust of the Kyoto inner circle. A reputation as someone who makes Nintendo more Nintendo, not less.",
    iwata_note:"Iwata took a 50% pay cut before laying off a single employee. That act alone defined his leadership more than any product launch. I need to find my version of that moment.",
    honest:"I will be tested here in ways I cannot fully prepare for. The foreignness will never fully disappear. The question is whether I've built enough trust, skill, and love for this company that it stops mattering." },
  { id:7, num:"07", emoji:"👑", label:"PHASE 7", title:"CEO", age:"38–50+", where:"Nintendo of Japan — The Chair",
    tagline:"I didn't just get here. I earned here.", accent:C.yellow,
    summary:"This is the destination — but not the point. The point was always to build something worth leading. My job is to carry Nintendo's soul forward while opening it to the world.",
    milestones:["Appointment as CEO / Representative Director of Nintendo Co., Ltd.","First Nintendo Direct as CEO — set the tone for my era","Define my philosophy publicly, the way Iwata defined his","Build a team that reflects Nintendo's values and a global future","Make a decision that is hard and right — the moment that defines my leadership"],
    actions:["Lead with fun. Iwata: 'The opposite of fun is not serious — it's boring.'","Be a player first. Never let the business make me forget why any of this matters.","Communicate directly with fans — Nintendo's audience is its most important asset","Make Nintendo more Nintendo, not more like everyone else","Mentor the next generation — someone is watching me the way I watched Iwata"],
    build_toward:"A legacy. Not a résumé.",
    iwata_note:"On my business card I am a corporate president. In my mind I am a game developer. But in my heart I am a gamer.",
    honest:"I will have made it. I won't forget the 14-year-old who made the list." },
];

const BOOK_PHASES = [
  { id:1, label:"PHASE 1", title:"FOUNDATION IDENTITY", age:"14–15", accent:C.green,
    focus:["Become like Satoru Iwata internally","Start Japanese basics","Build programming mindset"],
    books:[
      {num:1,  title:"Ask Iwata",                              sub:"Satoru Iwata",              type:"🎯 Core",       note:"Sets the 'why' before everything else. I read this first. Then again."},
      {num:2,  title:"Atomic Habits",                          sub:"James Clear",               type:"🧠 Mindset",    note:"My system for every other habit on this list. The foundation under the foundation."},
      {num:3,  title:"Genki I + Workbook",                     sub:"Eri Banno et al.",          type:"🇯🇵 Japanese",  note:"The gold standard starting point. I do every exercise. No skipping."},
      {num:4,  title:"Hello World",                            sub:"Hannah Fry",                type:"💻 Tech",       note:"Builds CS intuition before I need deep coding experience.", isNew:true},
      {num:5,  title:"The Pragmatic Programmer",               sub:"Hunt & Thomas",             type:"💻 Tech",       note:"How to think like a craftsman, not just a coder."},
    ]},
  { id:2, label:"PHASE 2", title:"FOUNDATION STRENGTH", age:"15–16", accent:C.sky,
    focus:["Strengthen mindset","Complete beginner Japanese","Build cultural awareness"],
    books:[
      {num:6,  title:"Genki II + Workbook",                    sub:"Eri Banno et al.",          type:"🇯🇵 Japanese",  note:"Finishing what I started. No skipping."},
      {num:7,  title:"The Courage to Be Disliked",             sub:"Kishimi & Koga",            type:"🧠 Mindset",    note:"Adlerian psychology written as a Japanese dialogue. Deeply relevant to my path."},
      {num:8,  title:"The Japanese Mind",                      sub:"Roger Davies & Osamu Ikeno",type:"🇯🇵 Culture",   note:"Essays on Japanese concepts — nemawashi, wa, amae. I need these words."},
      {num:9,  title:"A Dictionary of Basic Japanese Grammar", sub:"Seiichi Makino",            type:"🇯🇵 Japanese",  note:"Not a book I read — a reference I use constantly.", isNew:true},
    ]},
  { id:3, label:"PHASE 3", title:"NINTENDO THINKING + LEADERSHIP", age:"16–18", accent:C.orange,
    focus:["Think like Nintendo","Understand game design philosophy","Develop leadership mindset"],
    books:[
      {num:10, title:"The Art of Game Design: A Book of Lenses",sub:"Jesse Schell",            type:"🎮 Design",     note:"The best book on what 'fun' actually means. Iwata lived this."},
      {num:11, title:"A Theory of Fun for Game Design",         sub:"Raph Koster",              type:"🎮 Design",     note:"Short, essential. Pairs perfectly with Schell."},
      {num:12, title:"Game Over: How Nintendo Conquered the World",sub:"David Sheff",           type:"🎯 Core",       note:"The definitive Nintendo history. I read it like a business case study."},
      {num:13, title:"Disrupting the Game",                     sub:"Reggie Fils-Aimé",         type:"🎯 Core",       note:"Reggie's path from outsider to Nintendo's face is my blueprint."},
      {num:14, title:"The Anatomy of Japanese Business",        sub:"Kae Chaudhuri",            type:"🇯🇵 Culture",   note:"How Japanese companies actually operate internally.", isNew:true},
      {num:15, title:"Multipliers",                             sub:"Liz Wiseman",              type:"👑 Leadership", note:"Iwata made everyone around him smarter. This book explains how.", isNew:true},
    ]},
  { id:4, label:"PHASE 4", title:"REAL JAPANESE", age:"17–20", accent:C.purple,
    focus:["Transition to real Japanese","Close the intermediate gap","Build reading + comprehension"],
    books:[
      {num:16, title:"Tobira: Gateway to Advanced Japanese",    sub:"Mayumi Oka et al.",        type:"🇯🇵 Japanese",  note:"The bridge most learners skip. I don't. This is where real fluency begins."},
      {num:17, title:"Shin Kanzen Master N2 Series",            sub:"Various",                  type:"🇯🇵 Japanese",  note:"Grammar, reading, listening, vocab. Working through all volumes."},
      {num:18, title:"Japanese for Busy People III",            sub:"AJALT",                    type:"🇯🇵 Japanese",  note:"Bridges conversational Japanese toward professional registers.", isNew:true},
      {num:19, title:"Japan's Software Factories",              sub:"Michael Cusumano",         type:"🇯🇵 Culture",   note:"How Japanese tech companies build software differently.", isNew:true},
    ]},
  { id:5, label:"PHASE 5", title:"IWATA-LEVEL PROGRAMMER", age:"18–22", accent:C.red,
    focus:["Deep technical mastery","Become a problem solver under pressure","Build serious credibility"],
    books:[
      {num:20, title:"Grokking Algorithms",                     sub:"Aditya Bhargava",          type:"💻 Tech",       note:"Starting here — visual, builds mental models for everything above it."},
      {num:21, title:"Clean Code",                              sub:"Robert C. Martin",         type:"💻 Tech",       note:"Practical foundation first. I'll feel every page after writing real messy code."},
      {num:22, title:"Refactoring",                             sub:"Martin Fowler",            type:"💻 Tech",       note:"The Iwata skill — making broken systems better without breaking them further."},
      {num:23, title:"Design Patterns",                         sub:"Gang of Four",             type:"💻 Tech",       note:"Architecture thinking. Need Clean Code and Refactoring first or this won't land."},
      {num:24, title:"A Philosophy of Software Design",         sub:"John Ousterhout",          type:"💻 Tech",       note:"Bridges everything into SICP.", isNew:true},
      {num:25, title:"Structure and Interpretation of Computer Programs",sub:"Abelson & Sussman",type:"💻 Tech",     note:"Last for a reason. SICP too early = brain shutdown. This is the summit."},
    ]},
  { id:6, label:"PHASE 6", title:"EXECUTIVE LEVEL", age:"22+", accent:C.yellow,
    focus:["Executive communication","Cultural mastery — deep, not surface","Leadership at scale"],
    books:[
      {num:26, title:"Shin Kanzen Master N1 Series",            sub:"Various",                  type:"🇯🇵 Japanese",  note:"The summit of formal Japanese study."},
      {num:27, title:"Business Japanese",                       sub:"Mitsubishi Corporation",   type:"🇯🇵 Japanese",  note:"Real corporate Japanese from people who live it."},
      {num:28, title:"Keigo Training Workbook",                 sub:"Various",                  type:"🇯🇵 Japanese",  note:"Honorific language is not optional in Japanese executive culture. I drill it."},
      {num:29, title:"The Culture Map",                         sub:"Erin Meyer",               type:"🌏 Culture",    note:"Essential for navigating Japan ↔ America."},
      {num:30, title:"Never Split the Difference",              sub:"Chris Voss",               type:"👑 Leadership", note:"I will negotiate budgets, teams, and direction as an executive.", isNew:true},
      {num:31, title:"The Ride of a Lifetime",                  sub:"Robert Iger",              type:"👑 Leadership", note:"The closest real-world path to mine.", isNew:true},
      {num:32, title:"An Introduction to Japanese Society",     sub:"Yoshio Sugimoto",          type:"🇯🇵 Culture",   note:"Understanding the social structure I'm operating inside.", isNew:true},
    ]},
];

const QUEST_STATUSES = ["Not Started", "In Progress", "Complete"];

const DEFAULT_QUESTS = [
  { id:"sq1", emoji:"💍", title:"Marry Ariana", category:"Life", color:C.pink,
    description:"My most important side quest. We're 2 months in as of April 2026 — aiming for early 20s. She deserves a proposal as thoughtful as everything else on this list.",
    status:"In Progress", startDate:"February 2026", targetDate:"Early 20s",
    milestones:["2 months together ✓","Keep showing up every day","Build a life worth sharing","Ask the question"] },
  { id:"sq2", emoji:"🇯🇵", title:"Pass JLPT N1", category:"Japanese", color:C.teal,
    description:"The highest level of the Japanese Language Proficiency Test. Non-negotiable before I'm a serious NOJ candidate. Passing before 22.",
    status:"Not Started", targetDate:"Before age 22",
    milestones:["Pass N5","Pass N4","Pass N3","Pass N2","Pass N1"] },
  { id:"sq3", emoji:"🎮", title:"Ship a Real Game", category:"Tech", color:C.purple,
    description:"Iwata shipped games. I need to ship a game. Doesn't have to be big — has to be real. Something people can download and play.",
    status:"Not Started", targetDate:"Before age 18",
    milestones:["Learn a game engine (Unity or Godot)","Build a prototype","Get 10 people to playtest","Ship it publicly"] },
  { id:"sq4", emoji:"🏆", title:"Win a Hackathon", category:"Tech", color:C.blue,
    description:"Not just participate — win. The competitive pressure of a hackathon is unlike anything else, and it's exactly the credibility that shows up on a Stanford application.",
    status:"Not Started", targetDate:"Before age 17",
    milestones:["Enter first hackathon","Build something in 24 hours","Place in top 3","Win one"] },
  { id:"sq5", emoji:"📢", title:"Give a Public Talk", category:"Leadership", color:C.orange,
    description:"Iwata was one of the greatest communicators in the industry. I need to find my voice in public. Start small — school, local events — and build up.",
    status:"Not Started", targetDate:"Before age 20",
    milestones:["Present at school","Speak at a local event","Give a talk at a conference or competition"] },
  { id:"sq6", emoji:"🌸", title:"Live in Japan for a Year", category:"Japan", color:C.red,
    description:"Not visit. Live. Before I join NOJ, I need to have actually lived in Japan — experienced the seasons, the social rhythms, the daily culture. This cannot be skipped.",
    status:"Not Started", targetDate:"Age 25–30",
    milestones:["Visit Japan for the first time","Complete a study or work exchange","Live independently in Japan for 12+ months"] },
  { id:"sq7", emoji:"📱", title:"Build & Launch an App", category:"Tech", color:C.green,
    description:"A real app with real users. Not a class project — something I made because I saw a problem and decided to fix it.",
    status:"Not Started", targetDate:"Before age 19",
    milestones:["Identify a real problem","Build an MVP","Get 100 users","Maintain and improve it"] },
];

const TYPE_META = {
  "🎯 Core":       {lBg:"#ffe0e5",lBd:"#ffb3be",lTx:"#b80018",dBg:"rgba(255,92,117,0.18)",dTx:"#ff8899"},
  "🧠 Mindset":    {lBg:"#ede0ff",lBd:"#c9a8ff",lTx:"#5500bb",dBg:"rgba(155,107,255,0.18)",dTx:"#bb88ff"},
  "🇯🇵 Japanese":  {lBg:"#ffe0f2",lBd:"#ffb3da",lTx:"#aa0050",dBg:"rgba(255,107,181,0.18)",dTx:"#ff88bb"},
  "🇯🇵 Culture":   {lBg:"#ffe0f2",lBd:"#ffb3da",lTx:"#aa0050",dBg:"rgba(255,107,181,0.18)",dTx:"#ff88bb"},
  "🌏 Culture":    {lBg:"#ffe0f2",lBd:"#ffb3da",lTx:"#aa0050",dBg:"rgba(255,107,181,0.18)",dTx:"#ff88bb"},
  "💻 Tech":       {lBg:"#ddf0ff",lBd:"#88ccff",lTx:"#004da0",dBg:"rgba(59,140,255,0.18)",dTx:"#66ccff"},
  "🎮 Design":     {lBg:"#fff0dd",lBd:"#ffd088",lTx:"#884400",dBg:"rgba(255,140,66,0.18)",dTx:"#ffaa66"},
  "👑 Leadership": {lBg:"#fff8dd",lBd:"#ffdd88",lTx:"#775500",dBg:"rgba(255,200,68,0.18)",dTx:"#ffdd66"},
};

const STATUS_META = {
  "Not Started": { color: C.textMute, bg: "rgba(150,160,200,0.12)" },
  "In Progress": { color: C.green,    bg: "rgba(61,214,140,0.12)"  },
  "Complete":    { color: C.yellow,   bg: "rgba(255,200,68,0.12)"  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function TypeBadge({ type, dark }) {
  const m = TYPE_META[type] || TYPE_META["💻 Tech"];
  return (
    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, padding:"3px 9px", borderRadius:99, background:dark?m.dBg:m.lBg, color:dark?m.dTx:m.lTx, border:dark?"none":`1.5px solid ${m.lBd}` }}>
      {type}
    </span>
  );
}

function NewBadge() {
  return (
    <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:9, fontWeight:900, padding:"2px 9px", borderRadius:99, background:"linear-gradient(135deg,#FFB800,#FF7828)", color:"#fff", boxShadow:"0 2px 8px rgba(255,120,0,0.35)" }}>
      ✦ NEW
    </span>
  );
}

function StatCard({ value, label, color, dark }) {
  const th = T(dark);
  return (
    <div style={{ padding:"14px 22px", borderRadius:20, textAlign:"center", background:`${color}15`, border:`2.5px solid ${color}44`, boxShadow:`0 4px 18px ${color}22` }}>
      <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:30, color, lineHeight:1 }}>{value}</div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:th.mute, letterSpacing:2, textTransform:"uppercase", marginTop:4 }}>{label}</div>
    </div>
  );
}

// iiSU-style pill button
function Pill({ label, active, color, onClick, dark, small }) {
  const th = T(dark);
  return (
    <button onClick={onClick} style={{
      fontFamily:"'Nunito',sans-serif", fontSize:small?11:12, fontWeight:800,
      padding:small?"5px 12px":"7px 16px", borderRadius:99, border:"none", cursor:"pointer",
      background: active ? `linear-gradient(135deg,${color},${color}cc)` : th.pill,
      color: active ? "#fff" : th.sub,
      boxShadow: active ? `0 3px 14px ${color}44` : "none",
      transition:"all 0.2s cubic-bezier(0.34,1.2,0.64,1)",
      transform: active ? "scale(1.05)" : "scale(1)",
      whiteSpace:"nowrap",
    }}>{label}</button>
  );
}

// iiSU card — white, rounded, soft shadow, colored hover border
function ICard({ children, style={}, accent, dark, onClick, noHover }) {
  const th = T(dark);
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={()=>!noHover&&setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background: th.card, borderRadius:22,
        border:`2px solid ${hov&&accent?`${accent}66`:th.border}`,
        boxShadow: hov ? `0 10px 36px ${accent||C.blue}22, 0 2px 8px rgba(0,0,0,0.06)` : th.shadowS,
        transition:"all 0.22s ease",
        transform: hov&&!noHover ? "translateY(-3px)" : "none",
        cursor: onClick ? "pointer" : "default",
        overflow:"hidden",
        ...style,
      }}
    >{children}</div>
  );
}

// Input field with iiSU style
function Input({ style={}, ...props }) {
  const [foc, setFoc] = useState(false);
  return (
    <input
      {...props}
      onFocus={()=>setFoc(true)}
      onBlur={()=>setFoc(false)}
      style={{
        width:"100%", padding:"12px 16px", borderRadius:14,
        border:`2px solid ${foc?C.blue:"rgba(100,120,220,0.18)"}`,
        background:"#f5f7ff", color:C.text,
        fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:600,
        outline:"none", transition:"border 0.2s",
        ...style,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODAL
// ─────────────────────────────────────────────────────────────────────────────
function AuthModal({ onClose, onAuth, dark }) {
  const th = T(dark);
  const [mode,     setMode]     = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err,      setErr]      = useState("");
  const [loading,  setLoading]  = useState(false);

  // We use username@nojpath.app as the synthetic email so users never see email
  const toEmail = (u) => `${u.toLowerCase().trim()}@nojpath.app`;

  const submit = async () => {
    setErr("");
    if (!username.trim() || !password.trim()) { setErr("Fill in all fields."); return; }
    if (username.includes(" ")) { setErr("Username can't have spaces."); return; }
    setLoading(true);

    if (mode === "signup") {
      // Check username not taken
      const existing = await sbFetch(`profiles?username=eq.${username.trim()}`);
      if (existing && existing.length > 0) { setErr("Username already taken."); setLoading(false); return; }
      const data = await sbRpc("signup", { email: toEmail(username), password });
      if (data.error) { setErr(data.error.message || "Signup failed."); setLoading(false); return; }
      // Insert profile
      await sbFetch("profiles", { method:"POST", body:JSON.stringify({ id:data.user.id, username:username.trim(), email:toEmail(username) }) }, data.access_token);
      onAuth({ ...data.user, access_token:data.access_token, username:username.trim() });
    } else {
      const data = await sbRpc("token?grant_type=password", { email: toEmail(username), password });
      if (data.error) { setErr("Wrong username or password."); setLoading(false); return; }
      // Fetch profile for username confirmation
      const profile = await sbFetch(`profiles?id=eq.${data.user.id}`, {}, data.access_token);
      const uname = profile?.[0]?.username || username.trim();
      onAuth({ ...data.user, access_token:data.access_token, username:uname });
    }
    setLoading(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(10,15,40,0.55)", backdropFilter:"blur(10px)", padding:20 }}>
      <ICard dark={dark} accent={C.blue} noHover style={{ width:"100%", maxWidth:380, padding:32 }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <div>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:24, color:C.blue }}>{mode==="login"?"Welcome Back 👋":"Join NOJ Path ✨"}</div>
            <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:th.sub, fontWeight:600, marginTop:2 }}>
              {mode==="login"?"Log in with your username":"Create your account"}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, color:th.mute, lineHeight:1 }}>✕</button>
        </div>

        {/* Mode toggle */}
        <div style={{ display:"flex", gap:8, marginBottom:22 }}>
          <Pill label="Log In"   active={mode==="login"}  color={C.blue} onClick={()=>setMode("login")}  dark={dark}/>
          <Pill label="Sign Up"  active={mode==="signup"} color={C.blue} onClick={()=>setMode("signup")} dark={dark}/>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div>
            <label style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:800, color:th.sub, display:"block", marginBottom:6 }}>Username</label>
            <Input placeholder="e.g. sebastianosky" value={username} onChange={e=>setUsername(e.target.value)} autoCapitalize="none"/>
          </div>
          <div>
            <label style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:800, color:th.sub, display:"block", marginBottom:6 }}>Password</label>
            <Input placeholder="••••••••" type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>

          {err && (
            <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:C.red, fontWeight:700, padding:"8px 12px", background:"rgba(255,92,117,0.1)", borderRadius:10 }}>
              {err}
            </div>
          )}

          <button onClick={submit} disabled={loading} style={{
            padding:"13px", borderRadius:14, border:"none", cursor:"pointer", marginTop:4,
            background:`linear-gradient(135deg,${C.blue},${C.sky})`,
            color:"#fff", fontFamily:"'Fredoka One',cursive", fontSize:18,
            boxShadow:`0 4px 18px ${C.blue}44`,
            opacity:loading?0.7:1, transition:"opacity 0.2s",
          }}>{loading?"..." : mode==="login"?"Log In →":"Create Account →"}</button>

          <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, color:th.mute, textAlign:"center", fontWeight:600 }}>
            No email needed — just a username and password.
          </div>
        </div>
      </ICard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DM PANEL
// ─────────────────────────────────────────────────────────────────────────────
function DMPanel({ user, dark, onClose }) {
  const th = T(dark);
  const [messages,     setMessages]     = useState([]);
  const [friends,      setFriends]      = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [text,         setText]         = useState("");
  const [friendInput,  setFriendInput]  = useState("");
  const [addErr,       setAddErr]       = useState("");
  const bottomRef = useRef(null);

  useEffect(()=>{ loadFriends(); }, []);
  useEffect(()=>{ if (activeFriend) { loadMessages(); const t = setInterval(loadMessages,4000); return ()=>clearInterval(t); } }, [activeFriend]);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);

  const loadFriends = async () => {
    const data = await sbFetch(`friends?or=(user_id.eq.${user.id},friend_id.eq.${user.id})&select=*,sender:profiles!friends_user_id_fkey(id,username),receiver:profiles!friends_friend_id_fkey(id,username)`, {}, user.access_token);
    setFriends(data||[]);
  };

  const addFriend = async () => {
    setAddErr("");
    const profiles = await sbFetch(`profiles?username=eq.${friendInput.trim().toLowerCase()}`);
    if (!profiles?.length) { setAddErr("Username not found."); return; }
    const fid = profiles[0].id;
    if (fid === user.id) { setAddErr("That's you!"); return; }
    await sbFetch("friends", { method:"POST", body:JSON.stringify({user_id:user.id,friend_id:fid}) }, user.access_token);
    setFriendInput(""); loadFriends();
  };

  const loadMessages = async () => {
    if (!activeFriend) return;
    const data = await sbFetch(`messages?or=(and(sender_id.eq.${user.id},receiver_id.eq.${activeFriend.id}),and(sender_id.eq.${activeFriend.id},receiver_id.eq.${user.id}))&order=created_at.asc`, {}, user.access_token);
    setMessages(data||[]);
  };

  const send = async () => {
    if (!text.trim()||!activeFriend) return;
    const t = text; setText("");
    await sbFetch("messages", { method:"POST", body:JSON.stringify({sender_id:user.id,receiver_id:activeFriend.id,content:t}) }, user.access_token);
    loadMessages();
  };

  const getFriendProfile = (f) => {
    if (f.sender?.id === user.id) return f.receiver;
    return f.sender;
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:998, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(10,15,40,0.55)", backdropFilter:"blur(10px)", padding:16 }}>
      <ICard dark={dark} accent={C.teal} noHover style={{ width:"100%", maxWidth:680, height:"min(80vh,560px)", display:"flex", flexDirection:"column" }}>
        {/* Header */}
        <div style={{ padding:"16px 22px", borderBottom:`2px solid ${th.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:20, color:C.teal }}>💬 Messages</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:th.mute }}>✕</button>
        </div>

        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
          {/* Friends sidebar */}
          <div style={{ width:190, borderRight:`2px solid ${th.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
            <div style={{ padding:10, borderBottom:`1px solid ${th.border}` }}>
              <div style={{ display:"flex", gap:6 }}>
                <input
                  placeholder="Add by username"
                  value={friendInput}
                  onChange={e=>setFriendInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&addFriend()}
                  style={{ flex:1, padding:"7px 10px", borderRadius:10, border:`1.5px solid ${th.border}`, background:th.soft, color:th.text, fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:600, outline:"none" }}
                />
                <button onClick={addFriend} style={{ padding:"7px 10px", borderRadius:10, border:"none", cursor:"pointer", background:C.teal, color:"#fff", fontFamily:"'Fredoka One',cursive", fontSize:15, flexShrink:0 }}>+</button>
              </div>
              {addErr&&<div style={{ fontFamily:"'Nunito',sans-serif", fontSize:10, color:C.red, fontWeight:700, marginTop:4 }}>{addErr}</div>}
            </div>
            <div style={{ flex:1, overflowY:"auto" }}>
              {friends.length===0 && <div style={{ padding:16, fontFamily:"'Nunito',sans-serif", fontSize:11, color:th.mute, textAlign:"center" }}>Add a friend above</div>}
              {friends.map(f=>{
                const fp = getFriendProfile(f);
                if (!fp) return null;
                const isActive = activeFriend?.id===fp.id;
                return (
                  <div key={f.id} onClick={()=>setActiveFriend(fp)} style={{ padding:"11px 14px", cursor:"pointer", background:isActive?`${C.teal}14`:"transparent", borderLeft:isActive?`3px solid ${C.teal}`:"3px solid transparent", transition:"all 0.15s" }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${C.teal},${C.sky})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Fredoka One',cursive", fontSize:13, color:"#fff", marginBottom:4 }}>
                      {fp.username?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:800, color:th.text }}>{fp.username}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat area */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            {!activeFriend ? (
              <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8 }}>
                <div style={{ fontSize:32 }}>💬</div>
                <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:th.mute, fontWeight:600 }}>Select a friend to start chatting</div>
              </div>
            ) : (
              <>
                <div style={{ padding:"10px 16px", borderBottom:`1px solid ${th.border}`, display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.teal},${C.sky})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Fredoka One',cursive", fontSize:14, color:"#fff" }}>
                    {activeFriend.username?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:16, color:th.text }}>{activeFriend.username}</div>
                </div>
                <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:8 }}>
                  {messages.length===0&&<div style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:th.mute, textAlign:"center", marginTop:20 }}>No messages yet — say hi!</div>}
                  {messages.map(m=>{
                    const mine = m.sender_id===user.id;
                    return (
                      <div key={m.id} style={{ display:"flex", justifyContent:mine?"flex-end":"flex-start" }}>
                        <div style={{ maxWidth:"72%", padding:"9px 14px", borderRadius:mine?"18px 18px 4px 18px":"18px 18px 18px 4px", background:mine?`linear-gradient(135deg,${C.blue},${C.sky})`:th.soft, color:mine?"#fff":th.text, fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:600, boxShadow:mine?`0 3px 12px ${C.blue}33`:th.shadowS }}>
                          {m.content}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef}/>
                </div>
                <div style={{ padding:"10px 14px", borderTop:`1px solid ${th.border}`, display:"flex", gap:8, flexShrink:0 }}>
                  <input
                    placeholder="Message..." value={text}
                    onChange={e=>setText(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&send()}
                    style={{ flex:1, padding:"10px 14px", borderRadius:12, border:`1.5px solid ${th.border}`, background:th.soft, color:th.text, fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:600, outline:"none" }}
                  />
                  <button onClick={send} style={{ padding:"10px 18px", borderRadius:12, border:"none", cursor:"pointer", background:`linear-gradient(135deg,${C.blue},${C.sky})`, color:"#fff", fontFamily:"'Fredoka One',cursive", fontSize:16, boxShadow:`0 3px 12px ${C.blue}44` }}>Send</button>
                </div>
              </>
            )}
          </div>
        </div>
      </ICard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROADMAP PAGE
// ─────────────────────────────────────────────────────────────────────────────
const LS_PHASE_STATUS = "noj_phase_status";

function RoadmapPage({ dark, isOwner }) {
  const th = T(dark);
  const [open,        setOpen]       = useState(1);
  const [tab,         setTab]        = useState("milestones");
  const [phaseStatus, setPhaseStatus]= useState(()=>{ try{return JSON.parse(localStorage.getItem(LS_PHASE_STATUS))||{};}catch{return {};} });

  useEffect(()=>{ try{localStorage.setItem(LS_PHASE_STATUS,JSON.stringify(phaseStatus));}catch{} },[phaseStatus]);

  const toggle = (id) => {
    setOpen(prev => prev===id ? null : id);
    setTab("milestones");
    setTimeout(()=>{
      const el = document.getElementById(`phase-${id}`);
      if (el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-74,behavior:"smooth"});
    },50);
  };

  const cycleStatus = (e, id) => {
    e.stopPropagation();
    setPhaseStatus(prev=>{
      const cur = prev[id] || "Not Started";
      const idx = QUEST_STATUSES.indexOf(cur);
      return {...prev, [id]: QUEST_STATUSES[(idx+1)%QUEST_STATUSES.length]};
    });
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ padding:"52px 20px 44px", maxWidth:900, margin:"0 auto", textAlign:"center", borderBottom:`2px solid ${th.border}` }}>
        <div style={{ display:"inline-flex", marginBottom:18, padding:"6px 18px", background:`${C.blue}12`, borderRadius:99, border:`1.5px solid ${C.blue}28` }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:3, color:C.blue, textTransform:"uppercase" }}>Personal Life Roadmap · The NOJ Path</span>
        </div>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"clamp(30px,6vw,62px)", lineHeight:1.1, marginBottom:16, color:dark?C.sky:C.blue }}>
          First Foreign CEO<br/>of Nintendo of Japan
        </h1>
        <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:15, color:th.sub, fontWeight:600, lineHeight:1.8, maxWidth:460, margin:"0 auto 28px" }}>
          My roadmap to becoming the first foreign CEO of Nintendo.<br/>
          Inspired by Satoru Iwata. Built by sebastianosky.
        </p>
        <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
          <StatCard value="7"   label="Phases" color={C.blue}   dark={dark}/>
          <StatCard value="~25" label="Years"  color={C.teal}   dark={dark}/>
          <StatCard value="1"   label="Goal"   color={C.yellow} dark={dark}/>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"24px 20px 0", overflowX:"auto" }}>
        <div style={{ display:"flex", alignItems:"center", minWidth:520 }}>
          {PHASES.map((p,i)=>(
            <div key={p.id} style={{ display:"flex", alignItems:"center", flex:i<PHASES.length-1?1:0 }}>
              <button onClick={()=>toggle(p.id)} style={{ width:open===p.id?46:32, height:open===p.id?46:32, borderRadius:"50%", border:`3px solid ${open===p.id?p.accent:th.border}`, background:open===p.id?p.accent:th.card, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, outline:"none", transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:open===p.id?`0 4px 20px ${p.accent}55`:th.shadowS, fontSize:open===p.id?20:14 }}>{p.emoji}</button>
              {i<PHASES.length-1&&<div style={{ flex:1, height:3, minWidth:8, borderRadius:99, background:i<PHASES.findIndex(x=>x.id===open)?`linear-gradient(to right,${PHASES[i].accent},${PHASES[i+1].accent})`:th.border, transition:"background 0.4s" }}/>}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", minWidth:520, paddingTop:8, paddingBottom:4 }}>
          {PHASES.map((p,i)=>(
            <div key={p.id} style={{ flex:i<PHASES.length-1?1:0, fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:open===p.id?p.accent:th.mute, letterSpacing:0.3, transition:"color 0.25s", paddingLeft:2, fontWeight:open===p.id?700:400 }}>{p.age}</div>
          ))}
        </div>
      </div>

      {/* Phases */}
      <div style={{ maxWidth:900, margin:"16px auto 0", padding:"0 20px 64px" }}>
        {PHASES.map(phase=>{
          const isOpen=open===phase.id;
          const status = phaseStatus[phase.id] || "Not Started";
          const sm = STATUS_META[status];
          return (
            <div key={phase.id} id={`phase-${phase.id}`} style={{ marginBottom:10 }}>
              <button onClick={()=>toggle(phase.id)} style={{ width:"100%", textAlign:"left", cursor:"pointer", outline:"none", background:isOpen?(dark?`${phase.accent}14`:`${phase.accent}08`):th.card, border:`2px solid ${isOpen?phase.accent+"55":th.border}`, borderRadius:isOpen?"20px 20px 0 0":"20px", padding:"16px 20px", display:"flex", alignItems:"center", gap:14, transition:"all 0.2s ease", boxShadow:isOpen?`0 6px 28px ${phase.accent}20`:th.shadowS }}>
                <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:26, color:isOpen?phase.accent:th.mute, minWidth:46, lineHeight:1, transition:"color 0.25s" }}>{phase.num}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:3 }}>
                    <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:18, color:th.text }}>{phase.emoji} {phase.title}</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:th.mute, letterSpacing:1 }}>{phase.where}</span>
                  </div>
                  <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:th.sub, fontWeight:600, fontStyle:"italic", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{phase.tagline}</div>
                </div>
                {/* Status badge — owner can click to cycle */}
                <div onClick={isOwner?e=>cycleStatus(e,phase.id):undefined} style={{ fontFamily:"'Nunito',sans-serif", fontSize:10, fontWeight:800, flexShrink:0, padding:"4px 12px", borderRadius:99, background:sm.bg, color:sm.color, border:`1.5px solid ${sm.color}44`, cursor:isOwner?"pointer":"default", transition:"all 0.2s", whiteSpace:"nowrap", userSelect:"none" }} title={isOwner?"Click to change status":status}>
                  {isOwner?"⟳ ":""}{status}
                </div>
                <div style={{ fontSize:18, color:isOpen?phase.accent:th.mute, transform:isOpen?"rotate(180deg)":"rotate(0)", transition:"transform 0.3s", flexShrink:0 }}>▾</div>
              </button>

              {isOpen&&(
                <div style={{ background:dark?`${phase.accent}07`:`${phase.accent}05`, border:`2px solid ${phase.accent}44`, borderTop:"none", borderRadius:"0 0 20px 20px", padding:"0 20px 24px", boxShadow:`0 10px 36px ${phase.accent}12` }}>
                  <p style={{ padding:"16px 0 14px", borderBottom:`1.5px solid ${phase.accent}20`, fontFamily:"'Nunito',sans-serif", fontSize:14, color:th.sub, lineHeight:1.8, fontWeight:600, margin:0 }}>{phase.summary}</p>
                  <div style={{ display:"flex", gap:8, padding:"14px 0 12px", flexWrap:"wrap" }}>
                    {[["milestones","🏁 Milestones"],["actions","⚡ Actions"],["honest","💬 Real Talk"]].map(([t,label])=>(
                      <button key={t} onClick={e=>{e.stopPropagation();setTab(t);}} style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:800, padding:"6px 14px", borderRadius:99, border:"none", cursor:"pointer", background:tab===t?`linear-gradient(135deg,${phase.accent},${phase.accent}cc)`:th.pill, color:tab===t?"#fff":th.sub, boxShadow:tab===t?`0 3px 12px ${phase.accent}44`:"none", transition:"all 0.2s", transform:tab===t?"scale(1.05)":"scale(1)" }}>{label}</button>
                    ))}
                  </div>

                  {tab==="milestones"&&<div>
                    {phase.milestones.map((m,i)=>(
                      <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"8px 0", borderBottom:`1px solid ${th.border}` }}>
                        <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0, marginTop:2, background:`linear-gradient(135deg,${phase.accent},${phase.accent}88)`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 2px 8px ${phase.accent}44` }}><div style={{ width:5, height:5, borderRadius:"50%", background:"#fff" }}/></div>
                        <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:th.text, lineHeight:1.7, fontWeight:600 }}>{m}</div>
                      </div>
                    ))}
                    <div style={{ marginTop:16, padding:"14px 16px", background:dark?`${phase.accent}16`:`${phase.accent}09`, border:`2px solid ${phase.accent}44`, borderRadius:14 }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:2, color:phase.accent, textTransform:"uppercase", marginBottom:6, fontWeight:700 }}>🔥 Building toward</div>
                      <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:th.sub, lineHeight:1.7, fontWeight:600, fontStyle:"italic" }}>{phase.build_toward}</div>
                    </div>
                  </div>}

                  {tab==="actions"&&<div>
                    {phase.actions.map((a,i)=>(
                      <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"8px 0", borderBottom:`1px solid ${th.border}` }}>
                        <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:16, color:phase.accent, minWidth:20, marginTop:1, lineHeight:1.3 }}>→</div>
                        <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:th.text, lineHeight:1.7, fontWeight:600 }}>{a}</div>
                      </div>
                    ))}
                  </div>}

                  {tab==="honest"&&<div style={{ display:"flex", flexDirection:"column", gap:12, paddingTop:4 }}>
                    <div style={{ padding:"16px 18px", background:th.card, border:`2px solid ${th.border}`, borderRadius:14, boxShadow:th.shadowS }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:2, color:th.mute, textTransform:"uppercase", marginBottom:8, fontWeight:700 }}>🎮 The Iwata Lesson</div>
                      <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:14, color:th.text, lineHeight:1.8, fontWeight:700, fontStyle:"italic" }}>"{phase.iwata_note}"</div>
                    </div>
                    <div style={{ padding:"16px 18px", background:dark?`${phase.accent}14`:`${phase.accent}08`, border:`2px solid ${phase.accent}44`, borderRadius:14 }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:2, color:phase.accent, textTransform:"uppercase", marginBottom:8, fontWeight:700 }}>💬 Real Talk</div>
                      <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:th.sub, lineHeight:1.8, fontWeight:600 }}>{phase.honest}</div>
                    </div>
                  </div>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ borderTop:`2px solid ${th.border}`, padding:"28px 20px", textAlign:"center" }}>
        <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:15, color:th.mute, fontStyle:"italic", fontWeight:700, maxWidth:540, margin:"0 auto 8px" }}>"On my business card I am a corporate president. In my mind I am a game developer. But in my heart I am a gamer."</div>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:th.mute, letterSpacing:2, opacity:0.5 }}>— SATORU IWATA</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCES PAGE
// ─────────────────────────────────────────────────────────────────────────────
const LS_BOOKS = "noj_read_books";

function ResourcesPage({ dark, isOwner }) {
  const th = T(dark);
  const [openPhase, setOpenPhase] = useState(null);
  const [filter,    setFilter]    = useState("All");
  const [read,      setRead]      = useState(()=>{ try{return JSON.parse(localStorage.getItem(LS_BOOKS))||{};}catch{return {};} });

  useEffect(()=>{ try{localStorage.setItem(LS_BOOKS,JSON.stringify(read));}catch{} },[read]);

  const toggleRead = (num,e) => {
    if (!isOwner) return;
    e.stopPropagation();
    setRead(prev=>({...prev,[num]:!prev[num]}));
  };

  const allTypes = ["All","🎯 Core","🧠 Mindset","🇯🇵 Japanese","🇯🇵 Culture","💻 Tech","🎮 Design","👑 Leadership"];
  const totalBooks = BOOK_PHASES.reduce((s,p)=>s+p.books.length,0);
  const newBooks   = BOOK_PHASES.reduce((s,p)=>s+p.books.filter(b=>b.isNew).length,0);
  const readCount  = Object.values(read).filter(Boolean).length;

  const filtered = BOOK_PHASES
    .map(p=>({...p,books:filter==="All"?p.books:p.books.filter(b=>b.type===filter||(filter==="🇯🇵 Culture"&&b.type==="🌏 Culture"))}))
    .filter(p=>p.books.length>0);

  return (
    <div>
      <div style={{ padding:"52px 20px 44px", maxWidth:900, margin:"0 auto", textAlign:"center", borderBottom:`2px solid ${th.border}` }}>
        <div style={{ display:"inline-flex", marginBottom:16, padding:"6px 18px", background:`${C.orange}14`, borderRadius:99, border:`1.5px solid ${C.orange}30` }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:3, color:C.orange, textTransform:"uppercase" }}>Resource Library</span>
        </div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"clamp(26px,5vw,50px)", marginBottom:12, lineHeight:1.1, color:C.orange }}>My Reading Roadmap</h2>
        <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:14, color:th.sub, fontWeight:600, lineHeight:1.7, maxWidth:420, margin:"0 auto 24px" }}>32 books across 6 phases. Every book has a specific reason.</p>
        <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
          <StatCard value={totalBooks} label="Books"    color={C.blue}   dark={dark}/>
          <StatCard value={6}          label="Phases"   color={C.teal}   dark={dark}/>
          <StatCard value={newBooks}   label="New Adds" color={C.yellow} dark={dark}/>
          <StatCard value={`${readCount}/${totalBooks}`} label="Read" color={C.green} dark={dark}/>
        </div>
        {!isOwner&&<div style={{ marginTop:16, fontFamily:"'Nunito',sans-serif", fontSize:12, color:th.mute, fontWeight:700 }}>👀 Viewing sebastianosky's reading list</div>}
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"20px 20px 8px", display:"flex", flexWrap:"wrap", gap:7 }}>
        {allTypes.map(t=><Pill key={t} label={t} active={filter===t} color={C.blue} onClick={()=>{setFilter(t);setOpenPhase(null);}} dark={dark}/>)}
      </div>

      <div style={{ maxWidth:900, margin:"12px auto 0", padding:"0 20px 64px" }}>
        {filtered.map(phase=>{
          const isOpen=openPhase===phase.id||filter!=="All";
          const phaseRead=phase.books.filter(b=>read[b.num]).length;
          return (
            <div key={phase.id} style={{ marginBottom:12 }}>
              <div onClick={()=>filter==="All"&&setOpenPhase(isOpen&&openPhase===phase.id?null:phase.id)} style={{ background:isOpen?(dark?`${phase.accent}14`:`${phase.accent}08`):th.card, border:`2px solid ${isOpen?phase.accent+"55":th.border}`, borderRadius:isOpen&&filter==="All"?"20px 20px 0 0":"20px", padding:"16px 20px", display:"flex", alignItems:"center", gap:14, cursor:filter==="All"?"pointer":"default", transition:"all 0.2s", boxShadow:isOpen?`0 6px 28px ${phase.accent}18`:th.shadowS }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:6 }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:phase.accent, letterSpacing:2, textTransform:"uppercase", fontWeight:700 }}>{phase.label}</span>
                    <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:17, color:th.text }}>{phase.title}</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:th.mute }}>Age {phase.age}</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {phase.focus.map(f=><span key={f} style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:99, background:dark?`${phase.accent}16`:`${phase.accent}10`, border:`1.5px solid ${phase.accent}44`, color:phase.accent }}>{f}</span>)}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                  <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:800, padding:"4px 12px", borderRadius:99, background:phaseRead===phase.books.length?`linear-gradient(135deg,${C.green},${C.teal})`:th.pill, color:phaseRead===phase.books.length?"#fff":th.mute, transition:"all 0.3s" }}>{phaseRead}/{phase.books.length} read</span>
                  {filter==="All"&&<div style={{ fontSize:18, color:isOpen?phase.accent:th.mute, transform:isOpen?"rotate(180deg)":"rotate(0)", transition:"transform 0.3s" }}>▾</div>}
                </div>
              </div>

              {isOpen&&(
                <div style={{ background:dark?`${phase.accent}05`:`${phase.accent}03`, border:`2px solid ${phase.accent}44`, borderTop:"none", borderRadius:"0 0 20px 20px", padding:"4px 20px 20px" }}>
                  {phase.books.map((book,i)=>{
                    const done=!!read[book.num];
                    return (
                      <div key={book.num} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"14px 0", borderBottom:i<phase.books.length-1?`1.5px solid ${th.border}`:"none", opacity:done?0.5:1, transition:"opacity 0.2s" }}>
                        {/* Checkmark — owner only */}
                        <button
                          onClick={e=>toggleRead(book.num,e)}
                          disabled={!isOwner}
                          title={isOwner?(done?"Mark unread":"Mark read"):"Only sebastianosky can check books"}
                          style={{ width:26, height:26, borderRadius:8, flexShrink:0, marginTop:2, cursor:isOwner?"pointer":"default", outline:"none", border:`2.5px solid ${done?phase.accent:th.borderM}`, background:done?`linear-gradient(135deg,${phase.accent},${phase.accent}cc)`:"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:done?`0 2px 10px ${phase.accent}55`:"none", transform:done?"scale(1.08)":"scale(1)" }}>
                          {done&&<span style={{ color:"#fff", fontWeight:900, fontSize:12 }}>✓</span>}
                        </button>
                        <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:13, color:phase.accent, minWidth:30, padding:"3px 7px", borderRadius:9, textAlign:"center", background:dark?`${phase.accent}16`:`${phase.accent}10`, border:`2px solid ${phase.accent}44`, flexShrink:0 }}>{String(book.num).padStart(2,"0")}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:7, marginBottom:4 }}>
                            <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:16, color:th.text, textDecoration:done?"line-through":"none" }}>{book.title}</span>
                            {book.isNew&&<NewBadge/>}
                            <TypeBadge type={book.type} dark={dark}/>
                          </div>
                          <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, color:th.mute, marginBottom:4, fontWeight:700 }}>{book.sub}</div>
                          <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:th.sub, lineHeight:1.6, fontWeight:600, fontStyle:"italic" }}>{book.note}</div>
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

// ─────────────────────────────────────────────────────────────────────────────
// SIDE QUESTS PAGE
// ─────────────────────────────────────────────────────────────────────────────
const LS_QUESTS = "noj_quest_status";

function SideQuestsPage({ dark, isOwner }) {
  const th = T(dark);
  const [open,    setOpen]   = useState(null);
  const [filter,  setFilter] = useState("All");
  const [quests,  setQuests] = useState(()=>{
    try {
      const saved = JSON.parse(localStorage.getItem(LS_QUESTS));
      if (saved) return DEFAULT_QUESTS.map(q=>({...q, status: saved[q.id] || q.status}));
    } catch {}
    return DEFAULT_QUESTS;
  });

  const saveStatuses = (updated) => {
    const map = {};
    updated.forEach(q=>{ map[q.id]=q.status; });
    try { localStorage.setItem(LS_QUESTS,JSON.stringify(map)); } catch {}
  };

  const cycleStatus = (e, id) => {
    e.stopPropagation();
    if (!isOwner) return;
    setQuests(prev=>{
      const updated = prev.map(q=>{
        if (q.id!==id) return q;
        const idx = QUEST_STATUSES.indexOf(q.status);
        return {...q, status:QUEST_STATUSES[(idx+1)%QUEST_STATUSES.length]};
      });
      saveStatuses(updated);
      return updated;
    });
  };

  const categories = ["All","Life","Japanese","Tech","Leadership","Japan"];
  const filtered = quests.filter(q=>filter==="All"||q.category===filter);

  return (
    <div>
      <div style={{ padding:"52px 20px 44px", maxWidth:900, margin:"0 auto", textAlign:"center", borderBottom:`2px solid ${th.border}` }}>
        <div style={{ display:"inline-flex", marginBottom:16, padding:"6px 18px", background:`${C.red}12`, borderRadius:99, border:`1.5px solid ${C.red}28` }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:3, color:C.red, textTransform:"uppercase" }}>Side Quests</span>
        </div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"clamp(26px,5vw,50px)", marginBottom:12, lineHeight:1.1, color:C.red }}>Life Beyond the Main Story</h2>
        <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:14, color:th.sub, fontWeight:600, lineHeight:1.7, maxWidth:420, margin:"0 auto 24px" }}>The goals that live between the phases. Not optional — just parallel.</p>
        <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
          <StatCard value={quests.length}                                    label="Quests"   color={C.red}    dark={dark}/>
          <StatCard value={quests.filter(q=>q.status==="In Progress").length} label="Active"  color={C.green}  dark={dark}/>
          <StatCard value={quests.filter(q=>q.status==="Complete").length}    label="Done"    color={C.yellow} dark={dark}/>
        </div>
        {isOwner&&<div style={{ marginTop:16, fontFamily:"'Nunito',sans-serif", fontSize:12, color:th.mute, fontWeight:700 }}>✏️ Click a status badge on any quest to update it</div>}
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"20px 20px 8px", display:"flex", flexWrap:"wrap", gap:7 }}>
        {categories.map(c=><Pill key={c} label={c} active={filter===c} color={C.red} onClick={()=>setFilter(c)} dark={dark}/>)}
      </div>

      <div style={{ maxWidth:900, margin:"12px auto 0", padding:"0 20px 64px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:14 }}>
        {filtered.map(quest=>{
          const isOpen=open===quest.id;
          const sm = STATUS_META[quest.status] || STATUS_META["Not Started"];
          return (
            <ICard key={quest.id} dark={dark} accent={quest.color} onClick={()=>setOpen(isOpen?null:quest.id)}>
              {/* Colored top stripe */}
              <div style={{ height:7, background:`linear-gradient(135deg,${quest.color},${quest.color}88)`, borderRadius:"20px 20px 0 0" }}/>
              <div style={{ padding:"18px 20px 20px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:12 }}>
                  <div style={{ width:46, height:46, borderRadius:15, background:`${quest.color}18`, border:`2px solid ${quest.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{quest.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:17, color:th.text, marginBottom:5 }}>{quest.title}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                      {/* Status badge — clickable by owner */}
                      <span
                        onClick={isOwner?e=>cycleStatus(e,quest.id):undefined}
                        title={isOwner?"Click to change status":quest.status}
                        style={{ fontFamily:"'Nunito',sans-serif", fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:99, background:sm.bg, color:sm.color, border:`1.5px solid ${sm.color}44`, cursor:isOwner?"pointer":"default", userSelect:"none" }}>
                        {isOwner?"⟳ ":""}{quest.status}
                      </span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:th.mute, letterSpacing:1 }}>{quest.category}</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:th.sub, lineHeight:1.65, fontWeight:600, margin:0 }}>{quest.description}</p>

                {isOpen&&(
                  <div style={{ marginTop:16, paddingTop:16, borderTop:`1.5px solid ${th.border}` }}>
                    {quest.targetDate&&<div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:quest.color, letterSpacing:2, textTransform:"uppercase", marginBottom:8, fontWeight:700 }}>🎯 Target: {quest.targetDate}</div>}
                    {quest.startDate&&<div style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, color:th.mute, fontWeight:700, marginBottom:10 }}>Started: {quest.startDate}</div>}
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:th.mute, letterSpacing:2, textTransform:"uppercase", marginBottom:8, fontWeight:700 }}>Milestones</div>
                    {quest.milestones.map((m,i)=>(
                      <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", padding:"5px 0" }}>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:quest.color, flexShrink:0, marginTop:4, boxShadow:`0 0 6px ${quest.color}66` }}/>
                        <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:th.sub, lineHeight:1.6, fontWeight:600 }}>{m}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop:12, fontFamily:"'Nunito',sans-serif", fontSize:11, color:quest.color, fontWeight:800, textAlign:"right" }}>{isOpen?"▴ Less":"▾ More"}</div>
              </div>
            </ICard>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
const BG_DOTS = Array.from({length:16},(_,i)=>({
  x:(i*137.508)%100, y:(i*98.618)%100,
  size:8+(i%4)*6,
  color:[C.red,C.orange,C.yellow,C.green,C.teal,C.blue,C.purple,C.pink][i%8],
  dur:3+(i%4), delay:(i*0.3)%3,
}));

export default function App() {
  const [page,     setPage]    = useState("roadmap");
  const [dark,     setDark]    = useState(()=>{ try{return localStorage.getItem("noj_theme")==="dark";}catch{return false;} });
  const [user,     setUser]    = useState(null);
  const [showAuth, setShowAuth]= useState(false);
  const [showDMs,  setShowDMs] = useState(false);

  const th = T(dark);
  const isOwner = user?.username === OWNER_USERNAME;

  useEffect(()=>{ try{localStorage.setItem("noj_theme",dark?"dark":"light");}catch{} },[dark]);

  const handleAuth = (data) => {
    setUser(data);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method:"POST",
      headers:{ apikey:SUPABASE_ANON, Authorization:`Bearer ${user.access_token}` },
    });
    setUser(null);
  };

  const TABS = [["roadmap","🗺 Roadmap"],["resources","📚 Resources"],["quests","⚔️ Side Quests"]];

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", background:th.bg, minHeight:"100vh", color:th.text, position:"relative" }}>
      <style>{`
        ${FONTS}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:${th.bg};margin:0;padding:0;}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes floatDot{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
        button{font-family:inherit;outline:none;}
        input{outline:none;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${dark?"#2a3550":"#c8d4f0"};border-radius:99px;}
        @media(max-width:600px){
          .nav-label{display:none;}
          .nav-emoji{display:inline!important;}
        }
      `}</style>

      {/* Floating background dots */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        {BG_DOTS.map((d,i)=><div key={i} style={{ position:"absolute", left:`${d.x}%`, top:`${d.y}%`, width:d.size, height:d.size, borderRadius:"50%", background:d.color, opacity:dark?0.04:0.055, animation:`floatDot ${d.dur}s ease-in-out infinite`, animationDelay:`${d.delay}s` }}/>)}
      </div>

      {/* Nav */}
      <nav style={{ position:"sticky", top:0, zIndex:100, background:th.nav, backdropFilter:"blur(20px) saturate(1.8)", borderBottom:`2px solid ${th.border}`, padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", height:58, boxShadow:th.shadow, gap:8 }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <div style={{ width:34, height:34, borderRadius:11, background:`linear-gradient(135deg,${C.red},${C.blue})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:`0 3px 14px rgba(0,0,0,0.2)` }}>🎮</div>
          <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:20, color:C.red }}>NOJ Path</span>
        </div>

        {/* Page tabs */}
        <div style={{ display:"flex", gap:4, flex:1, justifyContent:"center" }}>
          {TABS.map(([id,label])=>(
            <button key={id} onClick={()=>setPage(id)} style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:800, padding:"6px 14px", borderRadius:99, border:"none", cursor:"pointer", background:page===id?`linear-gradient(135deg,${C.blue},${C.sky})`:th.pill, color:page===id?"#fff":th.sub, boxShadow:page===id?`0 3px 14px ${C.sky}44`:"none", transition:"all 0.2s cubic-bezier(0.34,1.2,0.64,1)", transform:page===id?"scale(1.05)":"scale(1)", whiteSpace:"nowrap" }}>
              <span className="nav-emoji" style={{ display:"none" }}>{label.split(" ")[0]}</span>
              <span className="nav-label">{label}</span>
            </button>
          ))}
        </div>

        {/* Right side controls */}
        <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
          {user ? (
            <>
              <button onClick={()=>setShowDMs(true)} title="Messages" style={{ width:36, height:36, borderRadius:10, border:`2px solid ${th.border}`, background:th.card, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow:th.shadowS }}>💬</button>
              {/* Username chip */}
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:99, background:isOwner?`${C.yellow}18`:th.pill, border:isOwner?`1.5px solid ${C.yellow}44`:th.border }}>
                <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:800, color:isOwner?C.yellow:th.sub }}>
                  {isOwner?"👑 ":""}{user.username}
                </span>
              </div>
              <button onClick={handleLogout} title="Log out" style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:800, padding:"5px 12px", borderRadius:99, border:`1.5px solid ${th.border}`, background:"transparent", color:th.mute, cursor:"pointer" }}>Log out</button>
            </>
          ) : (
            <button onClick={()=>setShowAuth(true)} style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:800, padding:"7px 16px", borderRadius:99, border:"none", cursor:"pointer", background:`linear-gradient(135deg,${C.blue},${C.sky})`, color:"#fff", boxShadow:`0 3px 12px ${C.blue}44` }}>Log In</button>
          )}
          <button onClick={()=>setDark(d=>!d)} title="Toggle theme" style={{ width:36, height:36, borderRadius:10, border:`2px solid ${th.border}`, background:th.card, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow:th.shadowS }}>
            {dark?"☀️":"🌙"}
          </button>
        </div>
      </nav>

      {/* Modals */}
      {showAuth&&<AuthModal dark={dark} onClose={()=>setShowAuth(false)} onAuth={handleAuth}/>}
      {showDMs&&user&&<DMPanel dark={dark} user={user} onClose={()=>setShowDMs(false)}/>}

      {/* Page content */}
      <div key={page} style={{ position:"relative", zIndex:1, animation:"fadeSlide 0.3s ease" }}>
        {page==="roadmap"   &&<RoadmapPage    dark={dark} isOwner={isOwner}/>}
        {page==="resources" &&<ResourcesPage  dark={dark} isOwner={isOwner}/>}
        {page==="quests"    &&<SideQuestsPage dark={dark} isOwner={isOwner}/>}
      </div>
    </div>
  );
}
