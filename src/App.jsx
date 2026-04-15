import { useState, useEffect, useCallback, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — fill these in
// ─────────────────────────────────────────────────────────────────────────────
const SB_URL  = "https://pfqlemdimzbpvxkrdddu.supabase.co";
const SB_ANON = "sb_publishable_9J_wjiyy0EDH78cQmD1Yng__JONyJvn";

// Change this to whatever PIN you want — only you will know it
const OWNER_PIN = "nintend0";

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE — simple fetch wrapper, no auth needed (public read, anon write)
// ─────────────────────────────────────────────────────────────────────────────
const sb = {
  async get(key) {
    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/owner_state?key=eq.${key}&select=value,updated_at`,
        { headers: { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` } }
      );
      const data = await res.json();
      if (data?.[0]) return { value: JSON.parse(data[0].value), updatedAt: data[0].updated_at };
      return null;
    } catch { return null; }
  },

  async set(key, value) {
    try {
      await fetch(`${SB_URL}/rest/v1/owner_state`, {
        method: "POST",
        headers: {
          apikey: SB_ANON,
          Authorization: `Bearer ${SB_ANON}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() }),
      });
      return true;
    } catch { return false; }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// FONTS & PALETTE
// ─────────────────────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=Fredoka+One&family=JetBrains+Mono:wght@400;600;700&display=swap');`;

const C = {
  red:"#FF5C75", orange:"#FF8C42", yellow:"#FFC844",
  green:"#3DD68C", teal:"#00C8A8", blue:"#3B8CFF",
  sky:"#5CD3FF", purple:"#9B6BFF", pink:"#FF6BB5",
  bg:"#F0F2FF", card:"#FFFFFF", soft:"#E8ECFF",
  border:"rgba(140,150,240,0.15)", borderM:"rgba(140,150,240,0.28)",
  text:"#1A1D3A", sub:"#4A4E80", mute:"#9A9EC8",
  dBg:"#0C0F1E", dCard:"#141828", dSoft:"#1A1F35",
  dBorder:"rgba(140,160,255,0.1)", dBorderM:"rgba(140,160,255,0.22)",
  dText:"#EEEEFF", dSub:"#8890C8", dMute:"#353A60",
};

function T(dark) {
  return {
    bg:     dark?C.dBg:C.bg,      card:   dark?C.dCard:C.card,
    soft:   dark?C.dSoft:C.soft,  border: dark?C.dBorder:C.border,
    borderM:dark?C.dBorderM:C.borderM, text:dark?C.dText:C.text,
    sub:    dark?C.dSub:C.sub,    mute:   dark?C.dMute:C.mute,
    nav:    dark?"rgba(12,15,30,0.97)":"rgba(240,242,255,0.97)",
    shadow: dark?"0 6px 32px rgba(0,0,0,0.55)":"0 6px 32px rgba(120,130,255,0.13)",
    shadowS:dark?"0 2px 12px rgba(0,0,0,0.4)":"0 2px 12px rgba(120,130,255,0.1)",
    pill:   dark?"rgba(255,255,255,0.07)":"rgba(120,130,240,0.09)",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const PHASES = [
  {id:1,num:"01",emoji:"🌱",label:"PHASE 1",title:"ROOTS",age:"14–15",where:"Las Vegas → ATECH High School",
   tagline:"Become someone worth following before anyone is watching.",accent:C.green,
   summary:"This is my foundation year at ATECH (Advanced Technologies Academy), a public magnet high school in Las Vegas focused on technology and engineering. Nothing flashy happens here — but everything depends on it. I'm building the internal architecture that the rest of my life runs on.",
   milestones:[
     "Get accepted into ATECH and lock in the Advanced Computer Science pathway",
     "Start Genki I Japanese and do it every single day — no gaps",
     "Write my first real program — not a tutorial, something I thought of",
     "Read Ask Iwata cover to cover. Then read it again.",
     "Build one habit system and keep it for 6 months straight",
     "Enroll in and pass AP Computer Science Principles",
     "Start a GitHub account and push my first project",
   ],
   actions:["Study Japanese 30 min daily minimum — immersion counts (anime, games in JP)","Start a coding journal: what I built, what broke, what I learned","Follow Nintendo news actively — understand the business, not just the games","Find one person smarter than me in CS and learn from them","Join any coding club or extracurricular at ATECH","Research what Stanford CS looks for in applicants — start building toward it now"],
   build_toward:"Consistency. The ability to show up when it's boring. This phase has no audience — that's the point.",
   iwata_note:"Iwata taught himself to program at 12 on a calculator. He didn't wait for school to give him permission.",
   honest:"Most people with big goals fail here — not from lack of talent, but lack of follow-through on small things. I won't be most people.",
   school:{name:"ATECH — Advanced Technologies Academy",type:"Public Magnet High School",location:"Las Vegas, NV",focus:"Technology, Engineering & Computer Science",ap:["AP Computer Science Principles","AP Computer Science A","AP Calculus AB"],note:"One of Nevada's top STEM high schools. Acceptance is competitive. The AP CS track is my foundation before Stanford."}},

  {id:2,num:"02",emoji:"⚙️",label:"PHASE 2",title:"CONSTRUCTION",age:"15–17",where:"ATECH High School — Deep",
   tagline:"Build things. Break things. Understand things.",accent:C.sky,
   summary:"ATECH is my first real arena. This is where I stop being someone who wants to code and become someone who does. I'm stacking reps — Japanese, AP classes, programming projects, and creative thinking. Every AP I take here is a brick in the Stanford application.",
   milestones:[
     "Complete Genki II — no shortcuts, no skipping grammar",
     "Build at least 3 real projects and put them on GitHub",
     "Take on a leadership role at ATECH — club, group, anything",
     "Read deeply into Nintendo's history and internal culture",
     "Get my first programming win that genuinely impresses someone",
     "Pass AP Computer Science A with a 5",
     "Pass AP Calculus AB",
     {text:"Excel at ATECH — graduate top of the CS track", linkedQuestId:"sq17"},
     "Start preparing for AP Japanese Language if offered",
   ],
   actions:["Start consuming Japanese media without subtitles — even 10 min/day","Enter at least one CS competition or hackathon (Nevada FBLA, ACSL, or similar)","Study Iwata's GDC talks and Nintendo Directs — analyze his communication style","Read Game Over like a business case study, not entertainment","Begin understanding what 'fun' means as a design philosophy, not just a feeling","Maintain a 4.0+ GPA — ATECH's workload is real, don't slip","Build relationships with teachers who can write strong Stanford rec letters"],
   build_toward:"A portfolio of real work. Strong AP scores. The beginning of a reputation, even locally. Proof I can lead something small.",
   iwata_note:"At HAL, Iwata was the person people went to when something was impossible. Not because he had the title — because he had the results.",
   honest:"ATECH is my springboard to Stanford, but only if I treat it that way. I do more than is required. Always.",
   school:{name:"ATECH — Advanced Technologies Academy",type:"Public Magnet High School",location:"Las Vegas, NV",focus:"Technology, Engineering & Computer Science",ap:["AP Computer Science A","AP Calculus AB","AP Statistics","AP Physics","AP English Language","AP Japanese Language & Culture (if available)"],note:"Junior and senior years at ATECH are where the Stanford application is really built. AP scores, projects, leadership, and research matter here."}},

  {id:3,num:"03",emoji:"🎓",label:"PHASE 3",title:"STANFORD",age:"18–22",where:"Stanford University",
   tagline:"CS undergrad → CS + MBA joint degree. Four years that reshape how I think.",accent:C.red,
   summary:"Stanford is not just a degree — it's a network, a credibility marker, and a place where I'll meet the people who shape the industry I want to lead.",
   milestones:[
     {text:"Get into Stanford CS — my application revolves around Nintendo, Japan, and building", linkedQuestId:"sq16"},
     "Begin working toward the CS + MBA joint program early",
     "Achieve N2 Japanese by sophomore year",
     {text:"Pass JLPT N1 before graduation", linkedQuestId:"sq2"},
     "Complete at least 2 Apple internships (aiming for 3)",
     "Build one project that gets real users or real attention",
     "Graduate with both CS and MBA components complete",
   ],
   actions:["Take every course that touches product, design, and human behavior","Join Stanford's Japanese language and culture community","Study business Japanese alongside academic Japanese","Start reading Nikkei even when it's hard","Network intentionally — people connected to Nintendo, Sony, the game industry","Write. Publish things. Build a voice.","Understand P&L, operating margins, platform economics — the business of gaming"],
   build_toward:"A degree that signals elite technical AND business capability. Japanese at near-professional level. A network that opens doors.",
   iwata_note:"Iwata became president of Nintendo not because he climbed a ladder — because he solved problems nobody else could, and did it with integrity.",
   honest:"The CS + MBA joint is hard to get into — I talk to the program office early, not late. Apple internships don't just happen. I need to be exceptional."},

  {id:4,num:"04",emoji:"🍎",label:"PHASE 4",title:"APPLE",age:"20–24",where:"Apple — Cupertino",
   tagline:"Learn what world-class product culture feels like from the inside.",accent:C.purple,
   summary:"Apple is one of the few companies that matches Nintendo in product obsession and design philosophy. This is my finishing school before the game industry.",
   milestones:[
     "Convert internships into a full-time offer post-graduation",
     "Work in a role touching product, platform, or developer experience",
     "Interface with cross-functional teams",
     "Build a reputation as someone who improves whatever room I'm in",
     {text:"Read Nintendo IR reports fluently in Japanese", linkedQuestId:"sq10"},
     "Hit full Japanese business fluency before leaving Apple",
   ],
   actions:["Study Apple's internal review process — the attention to detail is the lesson","Observe how senior leaders communicate: precision, conviction, simplicity","Continue keigo and business Japanese — executive-level register now","Consume Japanese business news and Nintendo investor reports in Japanese","Build relationships with anyone connected to Japan, gaming, or consumer hardware"],
   build_toward:"Real industry credibility. Executive communication skills. A résumé that makes Nintendo of America pay attention.",
   iwata_note:"Iwata once said he didn't want to be a manager — he wanted to be a creator who happened to manage. I carry that into Apple. I stay close to the product.",
   honest:"I don't stay at Apple longer than I need to. 2–3 years post-grad is enough. The goal is NOA, not Apple lifer."},

  {id:5,num:"05",emoji:"🎮",label:"PHASE 5",title:"NINTENDO OF AMERICA",age:"24–30",where:"Nintendo of America — Redmond, WA",
   tagline:"Get inside the company. Learn how it breathes. Make myself impossible to ignore.",accent:C.orange,
   summary:"This is the most critical phase. Getting to NOA is one thing. What I do inside it determines whether I ever get the call from Japan.",
   milestones:[
     "Land a senior role at NOA — product, platform, or business development",
     "Within 2 years, become known for understanding both the technical AND cultural side",
     "Complete at least one project with direct NOJ collaboration",
     "Get a sponsor — a senior person who actively advocates for me",
     "Begin traveling to Japan regularly on Nintendo business",
     {text:"Pass BJT at J2 or higher", linkedQuestId:"sq8"},
     {text:"Master keigo at executive level — Sonkeigo and Kenjougo automatic", linkedQuestId:"sq9"},
     {text:"Master Japanese business etiquette — meishi, kamiza, nemawashi", linkedQuestId:"sq11"},
   ],
   actions:["Learn Nintendo's internal decision-making — nemawashi, ringi, consensus culture","Be patient. Japanese corporate culture rewards long-term trust.","Do work so good that people can't stop noticing","Study Nintendo Directs, Iwata Asks, and shareholder letters deeply","Read every Nintendo shareholder Q&A in Japanese","Build genuine relationships with NOJ counterparts — not networking, real relationships"],
   build_toward:"A reputation inside Nintendo that crosses the Pacific. The trust of Japanese colleagues. An invitation to Japan.",
   iwata_note:"Iwata built trust through decades of doing exactly what he said he would do, exactly when he said he would do it. At Nintendo, your word is your currency.",
   honest:"This phase might take longer than I expect. That's okay. The people who make it stayed consistent for 10 years, not the ones who pushed hardest for 2."},

  {id:6,num:"06",emoji:"🗾",label:"PHASE 6",title:"NINTENDO OF JAPAN",age:"30–38",where:"Kyoto, Japan — Nintendo HQ",
   tagline:"I'm no longer visiting. I'm here.",accent:C.pink,
   summary:"The transition to Japan is the hardest and most important move of my career. My language, cultural fluency, technical depth, and track record all have to be unimpeachable.",
   milestones:[
     "Secure a formal transfer or senior appointment at NOJ",
     "Operate fully in Japanese — all meetings, all documents, all relationships",
     {text:"Live in Japan for at least one full year", linkedQuestId:"sq12"},
     "Lead a product or platform initiative touching the global business",
     "Build trust with the Nintendo board and senior leadership in Kyoto",
     "Be recognized as someone who thinks like Nintendo, not just works at Nintendo",
     "Position myself for executive appointment — Managing Director, then higher",
   ],
   actions:["Absorb everything. Observe how decisions are made at HQ level.","Master the social fabric — who defers to whom, who the real influencers are","Contribute to creative direction — not just business execution","Become fluent in Nintendo's history and design philosophy at a level few outsiders reach","Become the person who bridges East and West — the one both sides trust equally","Stay humble. The leader who listens is respected more than the one who talks."],
   build_toward:"Executive appointment. The trust of the Kyoto inner circle. A reputation as someone who makes Nintendo more Nintendo, not less.",
   iwata_note:"Iwata took a 50% pay cut before laying off a single employee. That act alone defined his leadership more than any product launch.",
   honest:"I will be tested here in ways I cannot fully prepare for. The question is whether I've built enough trust and love for this company that the foreignness stops mattering."},

  {id:7,num:"07",emoji:"👑",label:"PHASE 7",title:"CEO",age:"38–50+",where:"Nintendo of Japan — The Chair",
   tagline:"I didn't just get here. I earned here.",accent:C.yellow,
   summary:"This is the destination — but not the point. The point was always to build something worth leading. My job is to carry Nintendo's soul forward while opening it to the world.",
   milestones:[
     "Appointment as CEO / Representative Director of Nintendo Co., Ltd.",
     "First Nintendo Direct as CEO — set the tone for my era",
     "Define my philosophy publicly, the way Iwata defined his",
     "Build a team that reflects Nintendo's values and a global future",
     "Make a decision that is hard and right — the moment that defines my leadership",
   ],
   actions:["Lead with fun. Iwata: 'The opposite of fun is not serious — it's boring.'","Be a player first. Never let the business make me forget why any of this matters.","Communicate directly with fans — Nintendo's audience is its most important asset","Make Nintendo more Nintendo, not more like everyone else","Mentor the next generation — someone is watching me the way I watched Iwata"],
   build_toward:"A legacy. Not a résumé.",
   iwata_note:"On my business card I am a corporate president. In my mind I am a game developer. But in my heart I am a gamer.",
   honest:"I will have made it. I won't forget the 14-year-old who made the list."},
];

// Helper — milestones can be a string or {text, linkedQuestId}
const mText = (m) => typeof m === "string" ? m : m.text;
const mLink  = (m) => typeof m === "string" ? null : m.linkedQuestId;

// Map: questId → which phase+milestoneIndex it links to (for reverse sync)
const QUEST_PHASE_LINKS = {};
PHASES.forEach(phase => {
  phase.milestones.forEach((m, i) => {
    const qid = mLink(m);
    if (qid) QUEST_PHASE_LINKS[qid] = { phaseId: phase.id, mIdx: i };
  });
});


const BOOK_PHASES = [
  {id:1,label:"PHASE 1",title:"FOUNDATION IDENTITY",age:"14–15",accent:C.green,focus:["Become like Satoru Iwata internally","Start Japanese basics","Build programming mindset"],books:[
    {num:1,title:"Ask Iwata",sub:"Satoru Iwata",type:"🎯 Core",note:"Sets the 'why' before everything else. I read this first. Then again."},
    {num:2,title:"Atomic Habits",sub:"James Clear",type:"🧠 Mindset",note:"My system for every other habit on this list."},
    {num:3,title:"Genki I + Workbook",sub:"Eri Banno et al.",type:"🇯🇵 Japanese",note:"The gold standard starting point. No skipping."},
    {num:4,title:"Hello World",sub:"Hannah Fry",type:"💻 Tech",note:"Builds CS intuition before I need deep coding experience.",isNew:true},
    {num:5,title:"The Pragmatic Programmer",sub:"Hunt & Thomas",type:"💻 Tech",note:"How to think like a craftsman, not just a coder."},
  ]},
  {id:2,label:"PHASE 2",title:"FOUNDATION STRENGTH",age:"15–16",accent:C.sky,focus:["Strengthen mindset","Complete beginner Japanese","Build cultural awareness"],books:[
    {num:6,title:"Genki II + Workbook",sub:"Eri Banno et al.",type:"🇯🇵 Japanese",note:"Finishing what I started. No skipping."},
    {num:7,title:"The Courage to Be Disliked",sub:"Kishimi & Koga",type:"🧠 Mindset",note:"Adlerian psychology written as a Japanese dialogue."},
    {num:8,title:"The Japanese Mind",sub:"Roger Davies & Osamu Ikeno",type:"🇯🇵 Culture",note:"Essays on Japanese concepts — nemawashi, wa, amae."},
    {num:9,title:"A Dictionary of Basic Japanese Grammar",sub:"Seiichi Makino",type:"🇯🇵 Japanese",note:"Not a book I read — a reference I use constantly.",isNew:true},
  ]},
  {id:3,label:"PHASE 3",title:"NINTENDO THINKING + LEADERSHIP",age:"16–18",accent:C.orange,focus:["Think like Nintendo","Understand game design philosophy","Develop leadership mindset"],books:[
    {num:10,title:"The Art of Game Design: A Book of Lenses",sub:"Jesse Schell",type:"🎮 Design",note:"The best book on what 'fun' actually means. Iwata lived this."},
    {num:11,title:"A Theory of Fun for Game Design",sub:"Raph Koster",type:"🎮 Design",note:"Short, essential. Pairs perfectly with Schell."},
    {num:12,title:"Game Over: How Nintendo Conquered the World",sub:"David Sheff",type:"🎯 Core",note:"The definitive Nintendo history. Read it like a business case study."},
    {num:13,title:"Disrupting the Game",sub:"Reggie Fils-Aimé",type:"🎯 Core",note:"Reggie's path from outsider to Nintendo's face is my blueprint."},
    {num:14,title:"The Anatomy of Japanese Business",sub:"Kae Chaudhuri",type:"🇯🇵 Culture",note:"How Japanese companies actually operate internally.",isNew:true},
    {num:15,title:"Multipliers",sub:"Liz Wiseman",type:"👑 Leadership",note:"Iwata made everyone around him smarter. This book explains how.",isNew:true},
  ]},
  {id:4,label:"PHASE 4",title:"REAL JAPANESE",age:"17–20",accent:C.purple,focus:["Transition to real Japanese","Close the intermediate gap","Build reading + comprehension"],books:[
    {num:16,title:"Tobira: Gateway to Advanced Japanese",sub:"Mayumi Oka et al.",type:"🇯🇵 Japanese",note:"The bridge most learners skip. I don't."},
    {num:17,title:"Shin Kanzen Master N2 Series",sub:"Various",type:"🇯🇵 Japanese",note:"Grammar, reading, listening, vocab. All volumes."},
    {num:18,title:"Japanese for Busy People III",sub:"AJALT",type:"🇯🇵 Japanese",note:"Bridges conversational Japanese toward professional registers.",isNew:true},
    {num:19,title:"Japan's Software Factories",sub:"Michael Cusumano",type:"🇯🇵 Culture",note:"How Japanese tech companies build software differently.",isNew:true},
  ]},
  {id:5,label:"PHASE 5",title:"IWATA-LEVEL PROGRAMMER",age:"18–22",accent:C.red,focus:["Deep technical mastery","Become a problem solver under pressure","Build serious credibility"],books:[
    {num:20,title:"Grokking Algorithms",sub:"Aditya Bhargava",type:"💻 Tech",note:"Starting here — visual, builds mental models for everything above it."},
    {num:21,title:"Clean Code",sub:"Robert C. Martin",type:"💻 Tech",note:"Practical foundation first. I'll feel every page after real messy code."},
    {num:22,title:"Refactoring",sub:"Martin Fowler",type:"💻 Tech",note:"The Iwata skill — making broken systems better without breaking them."},
    {num:23,title:"Design Patterns",sub:"Gang of Four",type:"💻 Tech",note:"Architecture thinking. Need Clean Code and Refactoring first."},
    {num:24,title:"A Philosophy of Software Design",sub:"John Ousterhout",type:"💻 Tech",note:"Bridges everything into SICP.",isNew:true},
    {num:25,title:"Structure and Interpretation of Computer Programs",sub:"Abelson & Sussman",type:"💻 Tech",note:"Last for a reason. SICP too early = brain shutdown. This is the summit."},
  ]},
  {id:6,label:"PHASE 6",title:"EXECUTIVE LEVEL",age:"22+",accent:C.yellow,focus:["Executive communication","Cultural mastery — deep, not surface","Leadership at scale"],books:[
    {num:26,title:"Shin Kanzen Master N1 Series",sub:"Various",type:"🇯🇵 Japanese",note:"The summit of formal Japanese study."},
    {num:27,title:"Business Japanese",sub:"Mitsubishi Corporation",type:"🇯🇵 Japanese",note:"Real corporate Japanese from people who live it."},
    {num:28,title:"Keigo Training Workbook",sub:"Various",type:"🇯🇵 Japanese",note:"Honorific language is not optional in Japanese executive culture."},
    {num:29,title:"The Culture Map",sub:"Erin Meyer",type:"🌏 Culture",note:"Essential for navigating Japan ↔ America."},
    {num:30,title:"Never Split the Difference",sub:"Chris Voss",type:"👑 Leadership",note:"I will negotiate budgets, teams, and direction as an executive.",isNew:true},
    {num:31,title:"The Ride of a Lifetime",sub:"Robert Iger",type:"👑 Leadership",note:"The closest real-world path to mine.",isNew:true},
    {num:32,title:"An Introduction to Japanese Society",sub:"Yoshio Sugimoto",type:"🇯🇵 Culture",note:"Understanding the social structure I'm operating inside.",isNew:true},
  ]},
];

const QUEST_STATUSES = ["Not Started","In Progress","Complete"];
const DEFAULT_QUESTS = [

  // ── PINNED — always first ──────────────────────────────────────────────────
  {id:"sq1", emoji:"💍", title:"Marry Ariana", category:"Life", color:C.pink,
   pinned:true, sortAge:0,
   description:"My most important side quest. Two months in as of April 2026 — aiming for early 20s. She deserves a proposal as thoughtful as everything else on this list. This one isn't on a schedule. It's on a feeling.",
   status:"In Progress", startDate:"2026-02-13", targetDate:"Early 20s", liveCounter:true,
   milestones:["Keep showing up every single day","Build a life worth sharing","Plan something unforgettable","Ask the question"]},

  // ── AGE 14–15 ─────────────────────────────────────────────────────────────
  {id:"sq17", emoji:"🏫", title:"Excel at ATECH", category:"Academic", color:C.green,
   linkedPhase:"Phase 2 · Construction", sortAge:15,
   description:"ATECH is the first door I have to open. My record here — GPA, AP scores, projects, leadership — is the raw material of the Stanford application. Every grade, every project, every extra thing I do here is a brick. I treat ATECH like a job, not just school, because for me it is one.",
   status:"Not Started", targetDate:"Age 14–18",
   milestones:["Get accepted into ATECH's Advanced Computer Science pathway","Maintain 4.0+ GPA every semester without exception","Pass AP Computer Science Principles with a 5","Pass AP Computer Science A with a 5","Take AP Japanese Language & Culture and perform at the top of the class","Take on a visible leadership role: officer of a club, project lead, or club founder","Win at least one academic award or recognition at school level or above","Graduate as one of the top students in the CS and/or Japanese track"]},

  // ── AGE 15–17 ─────────────────────────────────────────────────────────────
  {id:"sq15", emoji:"🤝", title:"Build a Real Industry Network", category:"Leadership", color:C.teal,
   linkedPhase:"Phase 5 · Nintendo of America", sortAge:16,
   description:"Iwata didn't get to Nintendo through a cold application. He got there through a decade of relationships, reputation, and trust built person by person. I need to start building real connections in the CS, game, and Japan-adjacent spaces now — not when I need them.",
   status:"Not Started", targetDate:"Ongoing from age 16",
   milestones:["Connect meaningfully with 3 people working in the game industry","Find a mentor in CS or tech outside of school","Attend at least one game industry event in person (GDC, PAX, a local game dev meetup)","Build a LinkedIn profile that accurately represents my work and goals","Get a genuine introduction to someone at a Japanese company through a mutual contact","Build a relationship with a Japanese speaker at a professional level","Have at least 2 people in the industry who know my name, know my work, and would give me a reference unprompted"]},

  {id:"sq4", emoji:"🏆", title:"Win a Hackathon", category:"Tech", color:C.blue,
   linkedPhase:"Phase 2 · Construction", sortAge:17,
   description:"Not just participate — win, or at minimum place. Hackathons under real time pressure, with real judges, against real competition are unlike anything else. They test speed, judgment, communication, and the ability to ship under stress.",
   status:"Not Started", targetDate:"Before age 17",
   milestones:["Enter a first hackathon — focus on showing up, not winning","Build a working demo within 24 hours regardless of quality","Submit and present to judges — practice articulating what you built and why it matters","Place in the top 3 of a competitive hackathon","Win a hackathon outright","Target Nevada or national CS competitions: FBLA, ACSL, USACO, Congressional App Challenge"]},

  // ── AGE 18–22 ─────────────────────────────────────────────────────────────
  {id:"sq3", emoji:"🎮", title:"Ship a Real Game", category:"Tech", color:C.purple,
   linkedPhase:"Phase 2 · Construction", sortAge:18,
   description:"Iwata shipped games. Before becoming president of Nintendo, he personally rewrote Pokémon Stadium's battle code from scratch in a few weeks to save E3. I need to ship a game — not for the portfolio, but for the understanding. You cannot lead a game company without knowing what it feels like to put something real into the world.",
   status:"Not Started", targetDate:"Before age 18",
   milestones:["Learn a game engine — Unity (C#) or Godot (GDScript) — well enough to build something real","Complete a game jam project (48–72 hours) to understand scoped development","Build a standalone game prototype with a complete game loop","Get at least 10 people outside my circle to playtest and give honest feedback","Iterate based on feedback — this is the step most people skip","Ship it publicly on itch.io, the App Store, or similar","Write a postmortem: what worked, what didn't, what I'd do differently"]},

  {id:"sq14", emoji:"🔬", title:"Do Independent CS Research", category:"Tech", color:C.sky,
   linkedPhase:"Phase 3 · Stanford", sortAge:18,
   description:"Stanford and top companies look for people who don't just learn — they discover. Independent research before college signals intellectual initiative that almost no applicant has.",
   status:"Not Started", targetDate:"Before age 18",
   milestones:["Identify a genuine question in CS, game design, or human-computer interaction","Read at least 5 academic papers related to the question","Design and execute a small study or experiment","Document findings in a written paper or detailed report","Submit to a high school research program (Regeneron, ISEF, local university programs)","Post findings publicly — GitHub, a personal blog, or an academic pre-print","Cite the research experience in the Stanford application"]},

  {id:"sq16", emoji:"🎓", title:"Get Into Stanford", category:"Academic", color:C.red,
   linkedPhase:"Phase 3 · Stanford", sortAge:18,
   description:"Stanford CS is the single credential that makes Nintendo of America take the résumé seriously before I've built a track record there. Acceptance rate is ~4%. My application cannot be generic — it has to tell a story no other applicant can tell.",
   status:"Not Started", targetDate:"Age 17–18",
   milestones:["Maintain a 4.0+ GPA through all four years at ATECH","Score 1500+ on the SAT or 34+ on the ACT","Pass at least 4 AP exams with 4s or 5s — especially AP CS A, AP Calculus, AP Japanese","Build a GitHub portfolio with 5+ real, documented, non-tutorial projects","Win or place in at least one competitive CS event at a regional or national level","Draft and refine a Stanford personal statement centered specifically on the NOJ goal","Secure strong recommendation letters from ATECH CS and Japanese teachers","Submit a polished, story-driven application and get accepted"]},

  {id:"sq7", emoji:"📱", title:"Build & Launch an App", category:"Tech", color:C.green,
   sortAge:19,
   description:"A real app with real users. Not a class project built for a grade — something I made because I saw a problem in the world and decided to fix it myself.",
   status:"Not Started", targetDate:"Before age 19",
   milestones:["Identify a real problem worth solving","Build an MVP that solves the core problem only","Get feedback from 10 strangers — not friends or family","Iterate and improve based on that feedback","Reach 100 users organically, without paid advertising","Maintain and update the app based on user needs for at least 6 months"]},

  {id:"sq5", emoji:"📢", title:"Give a Public Talk", category:"Leadership", color:C.orange,
   linkedPhase:"Phase 3 · Stanford", sortAge:20,
   description:"Iwata was one of the greatest communicators in the industry. Nintendo Directs, shareholder meetings, GDC talks — he spoke with clarity, warmth, and precision in front of millions. I need to develop my voice publicly.",
   status:"Not Started", targetDate:"Before age 20",
   milestones:["Present a project or idea to my class at ATECH","Speak at a school-wide event, science fair, or club presentation","Give a prepared talk at a community or local tech event","Apply to speak at a student hackathon, conference, or competition","Give a talk to an audience of 50+ people who didn't know me beforehand","Speak in Japanese in front of an audience of any size"]},

  {id:"sq18", emoji:"🕹️", title:"Deep Nintendo Knowledge", category:"Nintendo", color:C.purple,
   linkedPhase:"Phase 5 · Nintendo of America", sortAge:20,
   description:"I cannot lead Nintendo without knowing Nintendo at a level deeper than any fan. I need to understand the full history — every console, every pivot, every failure, every genius decision — and speak to all of it fluently in both English and Japanese.",
   status:"Not Started", targetDate:"Before age 20",
   milestones:["Read Game Over by David Sheff (complete Nintendo history through the 90s)","Read and study all available Iwata Asks interview series in full","Watch every Nintendo Direct from 2011 to present — note the messaging evolution","Study each hardware generation: what worked, what failed, and why (Virtual Boy, Wii U, DS, Switch)","Read Nintendo's IR reports and shareholder Q&As for the past 10 years","Understand Nintendo's IP portfolio: what they own, how they protect it, how they license it","Be able to explain Nintendo's platform strategy, first-party advantage, and global market position in depth","Read Nintendo's IR materials in Japanese and be able to discuss them in Japanese without notes"]},

  {id:"sq2", emoji:"🇯🇵", title:"Pass JLPT N1", category:"Japanese", color:C.teal,
   linkedPhase:"Phase 3 · Stanford", sortAge:22,
   description:"The highest level of the Japanese Language Proficiency Test. N1 means I can read newspapers, follow native-speed conversations, and operate in any Japanese professional environment without assistance. Non-negotiable before I'm a serious NOJ candidate.",
   status:"Not Started", targetDate:"Before age 22",
   milestones:["Pass N5 — basic hiragana, katakana, ~800 words","Pass N4 — basic grammar, ~1,500 words","Pass N3 — intermediate, bridge level","Pass N2 — business-adjacent, read most newspapers with effort","Pass N1 — native-level reading, complex listening, full professional use"]},

  {id:"sq9", emoji:"🎩", title:"Master Keigo — Honorific Speech", category:"Japanese", color:C.purple,
   linkedPhase:"Phase 5 · Nintendo of America", sortAge:22,
   description:"Keigo is not optional for a Japanese executive. It is the baseline of credibility in every boardroom, every meeting, every relationship. Three layers: Teineigo (polite), Sonkeigo (respectful — for superiors), and Kenjougo (humble — for yourself). Executives must switch between all three fluidly.",
   status:"Not Started", targetDate:"Before age 22",
   milestones:["Master Teineigo — polite daily speech (です/ます forms)","Learn Sonkeigo forms: いらっしゃる (to be/go/come), おっしゃる (to say), なさる (to do), ご覧になる (to see)","Learn Kenjougo forms: 参る・伺う (to go/visit), 申す (to say), いたす (to do), 拝見する (to see)","Study how to introduce yourself and others using correct levels in a meeting context","Practice switching registers in simulated business conversations","Drill phone call and email keigo — the most common professional contexts","Have a native Japanese business speaker evaluate my keigo for natural use","Use keigo correctly and automatically in a real Japanese professional setting"]},

  {id:"sq11", emoji:"🃏", title:"Master Japanese Business Etiquette", category:"Japan", color:C.orange,
   linkedPhase:"Phase 5 · Nintendo of America", sortAge:22,
   description:"Language alone is not enough. Japanese corporate culture has precise physical and social protocols that signal whether you belong. These need to be automatic, not things I have to think about.",
   status:"Not Started", targetDate:"Before age 22",
   milestones:["Learn meishi kōkan (名刺交換) — present with both hands and a bow, receive with both hands, read it carefully, never write on it or pocket it carelessly","Learn kamiza/shimoza (上座/下座) — the seat farthest from the door is for the most senior person; never sit before being directed","Study nemawashi (根回し) — building consensus privately before formal meetings","Study ringi-sho (稟議書) — how formal decisions move up the approval chain","Learn aisatsu (挨拶) — formal greetings and self-introductions in business contexts","Study nomi-kai (飲み会) etiquette: pour drinks for others before yourself, wait for kanpai","Understand tatemae (建前) and honne (本音) — the gap between what is said and what is meant","Practice receiving constructive silence — in Japan, silence often signals disagreement","Participate in or simulate at least one full Japanese business meeting using all protocols correctly"]},

  {id:"sq10", emoji:"📊", title:"Read Nintendo IR Reports in Japanese", category:"Japanese", color:C.green,
   linkedPhase:"Phase 4 · Apple", sortAge:22,
   description:"Nintendo publishes full Investor Relations (IR) reports, shareholder Q&As, and earnings presentations in Japanese. Reading these is how I understand exactly how Nintendo's leadership thinks about the business. Start after completing Tobira.",
   status:"Not Started", targetDate:"Age 18–22",
   milestones:["Complete Tobira as the reading foundation","Download Nintendo's most recent annual IR report (任天堂株式会社 有価証券報告書) in Japanese","Read the president's message (社長メッセージ) without a dictionary","Read the full financial summary with a dictionary, understanding all key metrics","Understand hardware unit sales, software attach rate, operating income, and net income in context","Read the shareholder Q&A transcript in Japanese and summarize key themes","Read IR reports from the past 5 years to understand strategic trajectory","Follow quarterly earnings releases in Japanese as they publish","Discuss Nintendo's financial position fluently in Japanese from memory"]},

  // ── AGE 24–30 ─────────────────────────────────────────────────────────────
  {id:"sq8", emoji:"💼", title:"Pass the BJT (Business Japanese Test)", category:"Japanese", color:C.sky,
   linkedPhase:"Phase 5 · Nintendo of America", sortAge:24,
   description:"JLPT tests language competency — BJT tests professional readiness. Japanese corporations actually use BJT scores when evaluating non-native candidates. A J2 score tells Nintendo of America and Nintendo of Japan that I'm professionally operational in Japanese.",
   status:"Not Started", targetDate:"Before age 24",
   milestones:["Study the BJT format: J1 (highest) to J5 scale, tests listening comprehension, reading, and business judgment","Reach JLPT N2 as the prerequisite foundation before attempting BJT","Study business vocabulary: 会議 (meetings), 交渉 (negotiations), 報告書 (reports), business email formats","Take official BJT practice tests and score J3 or above","Pass the official BJT at J2 level or higher","Add BJT score to LinkedIn profile, résumé, and Nintendo of America application"]},

  {id:"sq13", emoji:"🏢", title:"Understand Japanese Corporate Structure", category:"Japan", color:C.teal,
   linkedPhase:"Phase 5 · Nintendo of America", sortAge:24,
   description:"Nintendo is a Japanese corporation — not an American one with Japanese branding. The decision-making structure, loyalty dynamics, pace of change, and internal hierarchy are fundamentally different. I need to understand this system deeply enough to operate inside it and eventually lead it.",
   status:"Not Started", targetDate:"Before age 24",
   milestones:["Study the kaisha (会社) structure: who holds real decision-making power vs. titular authority","Learn the ringi approval system: how proposals move through the organization for sign-off","Study seniority culture (年功序列, nenkō joretsu) and how it's evolving","Learn about the keiretsu system and how long-term business relationships work in Japan","Study how foreign executives have historically been received in Japanese companies","Read 'Japan's Software Factories' by Michael Cusumano for tech-specific context","Study Nintendo's specific organizational history: Yamauchi's leadership, Iwata's restructuring","Be able to explain Nintendo's internal decision-making process in a job interview — in Japanese"]},

  // ── AGE 25–30 ─────────────────────────────────────────────────────────────
  {id:"sq12", emoji:"🌸", title:"Live in Japan for a Year", category:"Japan", color:C.red,
   linkedPhase:"Phase 6 · Nintendo of Japan", sortAge:25,
   description:"Not visit — live. There is no substitute for this. I can study Japan endlessly, but living there reveals the gap between what I know and what I understand. The commute etiquette, the neighborhood rhythms, the unspoken social rules — I need all of that before I ask NOJ to trust me with the company.",
   status:"Not Started", targetDate:"Age 25–30",
   milestones:["Visit Japan for the first time as a tourist to get initial orientation","Spend at least 2 weeks navigating Japan independently and exclusively in Japanese","Apply for and complete a work exchange or study abroad program in Japan","Open a Japanese bank account and handle all finances without English assistance","Live in a Japanese neighborhood, not an expat apartment complex","Maintain all daily life — grocery shopping, doctor visits, landlord, neighbors — fully in Japanese for 12+ consecutive months","Build at least one genuine friendship with a Japanese person conducted entirely in Japanese","Reflect on what changed in my understanding of Japan that I couldn't have learned from books"]},
];

const TYPE_META = {
  "🎯 Core":      {lBg:"#ffe0e5",lBd:"#ffb3be",lTx:"#b80018",dBg:"rgba(255,92,117,0.18)",dTx:"#ff8899"},
  "🧠 Mindset":   {lBg:"#ede0ff",lBd:"#c9a8ff",lTx:"#5500bb",dBg:"rgba(155,107,255,0.18)",dTx:"#bb88ff"},
  "🇯🇵 Japanese": {lBg:"#ffe0f2",lBd:"#ffb3da",lTx:"#aa0050",dBg:"rgba(255,107,181,0.18)",dTx:"#ff88bb"},
  "🇯🇵 Culture":  {lBg:"#ffe0f2",lBd:"#ffb3da",lTx:"#aa0050",dBg:"rgba(255,107,181,0.18)",dTx:"#ff88bb"},
  "🌏 Culture":   {lBg:"#ffe0f2",lBd:"#ffb3da",lTx:"#aa0050",dBg:"rgba(255,107,181,0.18)",dTx:"#ff88bb"},
  "💻 Tech":      {lBg:"#ddf0ff",lBd:"#88ccff",lTx:"#004da0",dBg:"rgba(59,140,255,0.18)",dTx:"#66ccff"},
  "🎮 Design":    {lBg:"#fff0dd",lBd:"#ffd088",lTx:"#884400",dBg:"rgba(255,140,66,0.18)",dTx:"#ffaa66"},
  "👑 Leadership":{lBg:"#fff8dd",lBd:"#ffdd88",lTx:"#775500",dBg:"rgba(255,200,68,0.18)",dTx:"#ffdd66"},
};
const STATUS_META = {
  "Not Started":{color:"#9A9EC8",bg:"rgba(154,158,200,0.12)"},
  "In Progress":{color:C.yellow,bg:"rgba(255,200,68,0.12)"},
  "Complete":   {color:C.green, bg:"rgba(61,214,140,0.12)"},
};

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL STORAGE HELPER
// ─────────────────────────────────────────────────────────────────────────────
const LS = {
  get:(k,fb)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch{return fb;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
};

// ─────────────────────────────────────────────────────────────────────────────
// TOAST NOTIFICATION
// ─────────────────────────────────────────────────────────────────────────────
function Toast({toasts}) {
  return (
    <div style={{position:"fixed",bottom:80,right:16,zIndex:500,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
      {toasts.map(t=>(
        <div key={t.id} style={{padding:"10px 16px",borderRadius:14,background:t.type==="success"?`linear-gradient(135deg,${C.green},${C.teal})`:t.type==="error"?`linear-gradient(135deg,${C.red},${C.orange})`:`linear-gradient(135deg,${C.blue},${C.sky})`,color:"#fff",fontFamily:"'Nunito',sans-serif",fontSize:13,fontWeight:800,boxShadow:"0 4px 20px rgba(0,0,0,0.2)",animation:"slideUp 0.3s ease",whiteSpace:"nowrap"}}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts,setToasts]=useState([]);
  const show=useCallback((msg,type="info")=>{
    const id=Date.now();
    setToasts(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3000);
  },[]);
  return {toasts,show};
}

// ─────────────────────────────────────────────────────────────────────────────
// OWNER PIN MODAL
// ─────────────────────────────────────────────────────────────────────────────
function PinModal({onSuccess,onClose,dark}) {
  const t=T(dark);
  const [pin,setPin]=useState("");
  const [err,setErr]=useState("");
  const [shake,setShake]=useState(false);

  const attempt=()=>{
    if(pin===OWNER_PIN){
      LS.set("noj_owner",true);
      onSuccess();
    } else {
      setErr("Wrong PIN.");
      setShake(true);
      setTimeout(()=>setShake(false),500);
      setPin("");
    }
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.5)",backdropFilter:"blur(10px)",padding:20}}>
      <div style={{background:t.card,borderRadius:24,padding:32,width:"100%",maxWidth:340,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",animation:shake?"shake 0.4s ease":"popIn 0.25s ease",border:`2px solid ${t.border}`}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:8}}>🔐</div>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:C.blue,marginBottom:4}}>Owner Mode</div>
          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:13,color:t.sub,fontWeight:600}}>Enter your PIN to unlock edit controls</div>
        </div>
        <input
          type="password" placeholder="••••••••" value={pin}
          onChange={e=>setPin(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&attempt()}
          autoFocus
          style={{width:"100%",padding:"13px 16px",borderRadius:14,border:`2px solid ${err?C.red:t.border}`,background:t.soft,color:t.text,fontFamily:"'Nunito',sans-serif",fontSize:16,fontWeight:700,textAlign:"center",letterSpacing:4,marginBottom:err?8:16,outline:"none",transition:"border 0.2s"}}
        />
        {err&&<div style={{fontFamily:"'Nunito',sans-serif",fontSize:12,color:C.red,fontWeight:700,textAlign:"center",marginBottom:12}}>{err}</div>}
        <div style={{display:"flex",gap:8}}>
          <button onClick={attempt} style={{flex:1,padding:"12px",borderRadius:14,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.blue},${C.sky})`,color:"#fff",fontFamily:"'Fredoka One',cursive",fontSize:17,boxShadow:`0 4px 16px ${C.blue}44`}}>Unlock</button>
          <button onClick={onClose} style={{padding:"12px 16px",borderRadius:14,border:`1.5px solid ${t.border}`,cursor:"pointer",background:"transparent",color:t.sub,fontFamily:"'Nunito',sans-serif",fontSize:13,fontWeight:800}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function TypeBadge({type,dark}) {
  const m=TYPE_META[type]||TYPE_META["💻 Tech"];
  return <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,padding:"3px 9px",borderRadius:99,background:dark?m.dBg:m.lBg,color:dark?m.dTx:m.lTx,border:dark?"none":`1.5px solid ${m.lBd}`,whiteSpace:"nowrap"}}>{type}</span>;
}
function NewBadge(){return <span style={{fontFamily:"'Nunito',sans-serif",fontSize:9,fontWeight:900,padding:"2px 9px",borderRadius:99,background:"linear-gradient(135deg,#FFB800,#FF7828)",color:"#fff",boxShadow:"0 2px 6px rgba(255,120,0,0.4)"}}>✦ NEW</span>;}

function StatCard({value,label,color,dark}){
  return(
    <div className="noj-stat-card" style={{padding:"14px 22px",borderRadius:22,textAlign:"center",background:dark?`${color}18`:`${color}14`,border:`2.5px solid ${color}50`,boxShadow:`0 4px 20px ${color}25`,minWidth:90}}>
      <div className="val" style={{fontFamily:"'Fredoka One',cursive",fontSize:30,color,lineHeight:1}}>{value}</div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:`${color}99`,letterSpacing:2,textTransform:"uppercase",marginTop:5}}>{label}</div>
    </div>
  );
}

function Pill({label,active,color,onClick,dark,small}){
  const t=T(dark);
  return <button onClick={onClick} style={{fontFamily:"'Nunito',sans-serif",fontSize:small?11:12,fontWeight:800,padding:small?"5px 12px":"7px 16px",borderRadius:99,border:"none",cursor:"pointer",background:active?`linear-gradient(135deg,${color},${color}cc)`:t.pill,color:active?"#fff":t.sub,boxShadow:active?`0 3px 14px ${color}44`:"none",transition:"all 0.2s cubic-bezier(0.34,1.2,0.64,1)",transform:active?"scale(1.05)":"scale(1)",whiteSpace:"nowrap"}}>{label}</button>;
}

function Card({children,style={},accent,dark,onClick}){
  const t=T(dark);const[hov,setHov]=useState(false);
  return <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:t.card,borderRadius:24,border:`2.5px solid ${hov&&accent?`${accent}88`:t.border}`,boxShadow:hov?`0 12px 40px ${accent||C.blue}28,0 2px 8px rgba(0,0,0,0.06)`:t.shadowS,transition:"all 0.22s ease",transform:hov&&onClick?"translateY(-3px)":"none",cursor:onClick?"pointer":"default",overflow:"hidden",...style}}>{children}</div>;
}

function Check({done,onClick,accent,size=26,disabled=false}){
  return(
    <button onClick={onClick} disabled={disabled} style={{width:size,height:size,borderRadius:size*0.32,flexShrink:0,cursor:disabled?"default":"pointer",outline:"none",border:`2.5px solid ${done?accent:"rgba(140,150,240,0.3)"}`,background:done?`linear-gradient(135deg,${accent},${accent}cc)`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",boxShadow:done?`0 2px 12px ${accent}55`:"none",transform:done?"scale(1.08)":"scale(1)",opacity:disabled?0.6:1}}>
      {done&&<span style={{color:"#fff",fontWeight:900,fontSize:size*0.52,lineHeight:1}}>✓</span>}
    </button>
  );
}

function ProgressBar({value,total,color}){
  const pct=total>0?Math.round((value/total)*100):0;
  return(
    <div style={{marginTop:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
        <span style={{fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:800,color:`${color}cc`}}>{value}/{total} complete</span>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color}}>{pct}%</span>
      </div>
      <div style={{height:6,borderRadius:99,background:`${color}18`,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,borderRadius:99,background:`linear-gradient(90deg,${color},${color}cc)`,transition:"width 0.5s ease",boxShadow:`0 0 8px ${color}66`}}/>
      </div>
    </div>
  );
}

// Last updated display
function LastUpdated({ts,dark}){
  const t=T(dark);
  if(!ts)return null;
  const d=new Date(ts);
  const fmt=d.toLocaleDateString("en-US",{month:"short",day:"numeric"})+" at "+d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
  return <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:t.mute,letterSpacing:1}}>Updated {fmt}</span>;
}

// Live relationship counter — counts calendar days, ticks at midnight
function RelationshipCounter({startDate,color}) {
  const calcDays = () => {
    // Parse as local date (YYYY-MM-DD) to avoid UTC offset issues
    const [y,m,d] = startDate.split("-").map(Number);
    const start = new Date(y, m-1, d, 0, 0, 0, 0); // local midnight on start date
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    return Math.floor((todayMidnight - start) / (1000 * 60 * 60 * 24));
  };

  const [days, setDays] = useState(calcDays);

  useEffect(()=>{
    // Update immediately, then schedule next tick at the next local midnight
    const scheduleNextTick = () => {
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 0, 0);
      const msUntilMidnight = nextMidnight - now;
      return setTimeout(()=>{
        setDays(calcDays());
        scheduleNextTick(); // reschedule
      }, msUntilMidnight);
    };
    const t = scheduleNextTick();
    return () => clearTimeout(t);
  },[startDate]);

  const months = Math.floor(days / 30);
  const weeks  = Math.floor((days % 30) / 7);
  const rem    = days % 7;
  const parts  = [];
  if (months > 0) parts.push(`${months} month${months!==1?"s":""}`);
  if (weeks  > 0) parts.push(`${weeks} week${weeks!==1?"s":""}`);
  parts.push(`${rem} day${rem!==1?"s":""}`);

  return(
    <div style={{marginTop:14,padding:"14px 18px",borderRadius:16,background:`${color}12`,border:`2px solid ${color}44`,textAlign:"center"}}>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:`${color}99`,letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>💍 Together</div>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color,lineHeight:1.2}}>{parts.join(", ")}</div>
      <div style={{fontFamily:"'Nunito',sans-serif",fontSize:11,color:`${color}88`,fontWeight:700,marginTop:4}}>{days} days and counting ✨</div>
    </div>
  );
}

// School info card shown in phase details
function SchoolInfoCard({school,dark}) {
  const t=T(dark);
  if(!school)return null;
  return(
    <div style={{marginTop:14,padding:"16px 18px",borderRadius:16,background:dark?"rgba(59,140,255,0.08)":"rgba(59,140,255,0.06)",border:`2px solid ${C.blue}33`}}>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.blue,letterSpacing:2,textTransform:"uppercase",marginBottom:10,fontWeight:700}}>🏫 School Info</div>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:15,color:t.text,marginBottom:4}}>{school.name}</div>
      <div style={{fontFamily:"'Nunito',sans-serif",fontSize:12,color:t.sub,fontWeight:700,marginBottom:8}}>{school.location} · {school.focus}</div>
      {school.ap&&school.ap.length>0&&(
        <div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:t.mute,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>AP Classes</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {school.ap.map(ap=>(
              <span key={ap} style={{fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:99,background:`${C.blue}14`,border:`1.5px solid ${C.blue}33`,color:C.blue}}>{ap}</span>
            ))}
          </div>
        </div>
      )}
      {school.note&&<div style={{fontFamily:"'Nunito',sans-serif",fontSize:12,color:t.sub,fontWeight:600,fontStyle:"italic",marginTop:10,lineHeight:1.6}}>{school.note}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE SYNC HOOK — loads from Supabase, auto-refreshes every 30s for viewers
// ─────────────────────────────────────────────────────────────────────────────
function useLiveState(key, defaultVal, isOwner) {
  const [state,setState]=useState(defaultVal);
  const [updatedAt,setUpdatedAt]=useState(null);
  const [syncing,setSyncing]=useState(false);

  const load=useCallback(async()=>{
    const data=await sb.get(key);
    if(data){setState(data.value);setUpdatedAt(data.updatedAt);}
  },[key]);

  // Load on mount
  useEffect(()=>{load();},[load]);

  // Poll every 30s for non-owners (live view)
  useEffect(()=>{
    if(isOwner)return;
    const interval=setInterval(load,30000);
    return()=>clearInterval(interval);
  },[isOwner,load]);

  const save=useCallback(async(newState,changeMsg="Progress updated")=>{
    setState(newState);
    setSyncing(true);
    await sb.set(key,newState);
    setUpdatedAt(new Date().toISOString());
    // Broadcast to all visitors that something changed
    if(isOwner){
      await sb.set("last_change",{ts:Date.now().toString(),msg:changeMsg});
    }
    setSyncing(false);
  },[key,isOwner]);

  return {state,setState,save,updatedAt,syncing,reload:load};
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL UPDATE BANNER — polls for changes, shows reload prompt to visitors
// ─────────────────────────────────────────────────────────────────────────────
function useUpdateBanner(isOwner) {
  const [showBanner,setShowBanner]=useState(false);
  const [bannerMsg,setBannerMsg]=useState("");
  const lastSeenRef=useRef(null);

  useEffect(()=>{
    if(isOwner)return; // owner doesn't need the banner

    // Check for updates every 10 seconds
    const check=async()=>{
      const data=await sb.get("last_change");
      if(!data)return;
      const ts=data.value?.ts;
      const msg=data.value?.msg||"sebastianosky made a change";
      if(!ts)return;
      if(lastSeenRef.current===null){
        // First load — just record the timestamp, don't show banner
        lastSeenRef.current=ts;
        return;
      }
      if(ts!==lastSeenRef.current){
        lastSeenRef.current=ts;
        setBannerMsg(msg);
        setShowBanner(true);
      }
    };

    check();
    const interval=setInterval(check,10000);
    return()=>clearInterval(interval);
  },[isOwner]);

  return {showBanner,bannerMsg,dismiss:()=>setShowBanner(false)};
}

// Banner component
function UpdateBanner({msg,onReload,onDismiss,dark}) {
  const t=T(dark);
  return(
    <div style={{position:"fixed",top:58,left:0,right:0,zIndex:300,padding:"0 16px",pointerEvents:"none",animation:"slideDown 0.4s cubic-bezier(0.34,1.2,0.64,1)"}}>
      <div style={{maxWidth:600,margin:"8px auto 0",background:`linear-gradient(135deg,${C.blue},${C.purple})`,borderRadius:16,padding:"12px 18px",display:"flex",alignItems:"center",gap:12,boxShadow:`0 8px 32px ${C.blue}44`,pointerEvents:"all"}}>
        <span style={{fontSize:20}}>🎮</span>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:14,color:"#fff"}}>sebastianosky updated the roadmap!</div>
          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:11,color:"rgba(255,255,255,0.8)",fontWeight:600}}>{msg}</div>
        </div>
        <button onClick={onReload} style={{padding:"7px 14px",borderRadius:10,border:"none",cursor:"pointer",background:"rgba(255,255,255,0.25)",color:"#fff",fontFamily:"'Nunito',sans-serif",fontSize:12,fontWeight:800,backdropFilter:"blur(8px)"}}>↻ Refresh</button>
        <button onClick={onDismiss} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.7)",fontSize:18,padding:"0 4px",lineHeight:1}}>✕</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFETTI — fires when a phase or quest is completed
// ─────────────────────────────────────────────────────────────────────────────
function Confetti({active,onDone}) {
  const [particles,setParticles]=useState([]);
  const colors=[C.red,C.orange,C.yellow,C.green,C.teal,C.blue,C.purple,C.pink];

  useEffect(()=>{
    if(!active)return;
    const p=Array.from({length:40},(_,i)=>({
      id:i,
      x:40+Math.random()*20,
      color:colors[i%colors.length],
      size:6+Math.random()*8,
      dx:(Math.random()-0.5)*200,
      dy:-(80+Math.random()*120),
      rot:Math.random()*360,
    }));
    setParticles(p);
    const t=setTimeout(()=>{setParticles([]);onDone&&onDone();},1200);
    return()=>clearTimeout(t);
  },[active]);

  if(!particles.length)return null;
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:1000,overflow:"hidden"}}>
      {particles.map(p=>(
        <div key={p.id} style={{position:"absolute",left:`${p.x}%`,bottom:"20%",width:p.size,height:p.size,borderRadius:p.id%3===0?"50%":3,background:p.color,animation:`confettiPop 1.1s ease forwards`,animationDelay:`${p.id*0.015}s`,transform:`translateX(${p.dx}px) translateY(${p.dy}px) rotate(${p.rot}deg)`}}/>
      ))}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// STREAK & DAILY ACTION HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const STREAK_MILESTONES = [
  {days:3,   label:"3 Day Streak",   emoji:"🔥"},
  {days:7,   label:"1 Week",         emoji:"⚡"},
  {days:14,  label:"2 Weeks",        emoji:"💪"},
  {days:30,  label:"1 Month",        emoji:"🏆"},
  {days:60,  label:"2 Months",       emoji:"🌟"},
  {days:100, label:"100 Days",       emoji:"💯"},
  {days:365, label:"1 Year",         emoji:"👑"},
];

function isDaily(text) {
  return /daily|every day|each day|per day|30 min/i.test(text);
}

function todayStr() {
  return new Date().toISOString().slice(0,10); // YYYY-MM-DD
}

// Streak tracker component with fire animation
function StreakCard({streak, lastChecked, milestone, dark, onFire}) {
  const t=T(dark);
  const [flames, setFlames] = useState([]);
  const isToday = lastChecked === todayStr();

  useEffect(()=>{
    if(onFire){
      const f=Array.from({length:12},(_,i)=>({
        id:i, x:30+Math.random()*40,
        size:14+Math.random()*14,
        dur:0.6+Math.random()*0.5,
        delay:i*0.06,
      }));
      setFlames(f);
      setTimeout(()=>setFlames([]),1400);
    }
  },[onFire]);

  const reachedMilestone = STREAK_MILESTONES.filter(m=>streak>=m.days);
  const nextMilestone = STREAK_MILESTONES.find(m=>streak<m.days);

  return(
    <div style={{position:"relative",overflow:"hidden",marginBottom:16,padding:"16px 18px",background:dark?`rgba(255,140,40,0.1)`:`rgba(255,140,40,0.07)`,border:`2px solid rgba(255,140,40,0.3)`,borderRadius:16}}>
      {/* Fire particles */}
      {flames.map(f=>(
        <div key={f.id} style={{position:"absolute",left:`${f.x}%`,bottom:0,fontSize:f.size,animation:`flamePop ${f.dur}s ease forwards`,animationDelay:`${f.delay}s`,pointerEvents:"none",zIndex:10}}>🔥</div>
      ))}
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{textAlign:"center",minWidth:60}}>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:36,color:C.orange,lineHeight:1}}>{streak}</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:t.mute,letterSpacing:2,textTransform:"uppercase"}}>day streak</div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:13,fontWeight:800,color:t.text,marginBottom:6}}>
            {streak===0?"Start your streak today! Check off a daily action."
             :isToday?"✅ Daily actions completed today — keep it up!"
             :"⚠️ Check off a daily action to keep your streak alive!"}
          </div>
          {nextMilestone&&(
            <div style={{fontFamily:"'Nunito',sans-serif",fontSize:11,color:t.sub,fontWeight:600}}>
              Next milestone: <span style={{color:C.orange,fontWeight:800}}>{nextMilestone.emoji} {nextMilestone.label}</span> — {nextMilestone.days-streak} days away
            </div>
          )}
          {/* Milestone badges */}
          {reachedMilestone.length>0&&(
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:8}}>
              {reachedMilestone.map(m=>(
                <span key={m.days} style={{fontFamily:"'Nunito',sans-serif",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99,background:`linear-gradient(135deg,${C.orange},${C.yellow})`,color:"#fff",boxShadow:`0 2px 8px rgba(255,140,0,0.35)`}}>{m.emoji} {m.label}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Age guidance component
function AgeGuidance({phase, dark}) {
  const t=T(dark);
  const today = new Date();
  // Born October 7, 2011
  const born = new Date(2011, 9, 7);
  const currentAge = Math.floor((today - born) / (365.25 * 24 * 60 * 60 * 1000));

  const ageStr = phase.age; // e.g. "14–15", "38–50+", "22+"
  const parts = ageStr.replace("+","").split("–").map(Number);
  const startAge = parts[0];
  const endAge = parts[1] || parts[0] + 12; // phases with "+" get a long window

  const isOnTrack = currentAge >= startAge && currentAge <= endAge;
  const isFuture  = currentAge < startAge;  // haven't reached this phase yet
  const isBehind  = currentAge > endAge;    // past the target window

  const label = isFuture
    ? `This phase starts at age ${startAge} — ${startAge - currentAge} year${startAge-currentAge!==1?"s":""} from now`
    : isOnTrack
    ? "You're right on track for this phase"
    : "This phase was meant for an earlier age — reflect on where you are";

  const icon   = isFuture ? "🔮" : isOnTrack ? "✅" : "⏰";
  const color  = isFuture ? C.blue : isOnTrack ? C.green : C.orange;

  return(
    <div style={{padding:"10px 16px",borderRadius:12,marginBottom:14,display:"flex",alignItems:"center",gap:10,
      background:`${color}10`, border:`1.5px solid ${color}33`
    }}>
      <span style={{fontSize:18}}>{icon}</span>
      <div>
        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:12,fontWeight:800,color}}>{label}</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:t.mute,letterSpacing:1,marginTop:2}}>
          Target age: {phase.age} · Current age: {currentAge}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BIRTHDAY COUNTER
// ─────────────────────────────────────────────────────────────────────────────
const BIRTHDAY = { month: 10, day: 7, year: 2011 }; // October 7, 2011

function BirthdayCounter({ dark, isOwner, showToast }) {
  const t = T(dark);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptAnswer, setPromptAnswer] = useState("");
  const [savedAnswer, setSavedAnswer] = useState(() => {
    try { return localStorage.getItem("noj_birthday_note") || ""; } catch { return ""; }
  });

  const today = new Date();
  const age = today.getFullYear() - BIRTHDAY.year
    - (today.getMonth() + 1 < BIRTHDAY.month || (today.getMonth() + 1 === BIRTHDAY.month && today.getDate() < BIRTHDAY.day) ? 1 : 0);

  const nextBirthday = new Date(today.getFullYear(), BIRTHDAY.month - 1, BIRTHDAY.day);
  if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
  const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
  const isBirthday = today.getMonth() + 1 === BIRTHDAY.month && today.getDate() === BIRTHDAY.day;

  useEffect(() => {
    if (isBirthday && isOwner) {
      const lastPrompt = localStorage.getItem("noj_birthday_prompted");
      const thisYear = today.getFullYear().toString();
      if (lastPrompt !== thisYear) setShowPrompt(true);
    }
  }, []);

  const saveAnswer = () => {
    localStorage.setItem("noj_birthday_note", promptAnswer);
    localStorage.setItem("noj_birthday_prompted", today.getFullYear().toString());
    setSavedAnswer(promptAnswer);
    setShowPrompt(false);
    showToast("Birthday note saved 🎂", "success");
  };

  return (
    <>
      {/* Birthday prompt modal */}
      {showPrompt && isOwner && (
        <div style={{ position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(10,15,40,0.7)",backdropFilter:"blur(12px)",padding:20 }}>
          <div style={{ background:t.card,borderRadius:24,padding:32,maxWidth:480,width:"100%",border:`2px solid ${C.pink}44`,boxShadow:`0 20px 60px ${C.pink}33` }}>
            <div style={{ fontSize:48,textAlign:"center",marginBottom:12 }}>🎂</div>
            <div style={{ fontFamily:"'Fredoka One',cursive",fontSize:26,color:C.pink,textAlign:"center",marginBottom:8 }}>Happy Birthday, Sebastian!</div>
            <div style={{ fontFamily:"'Nunito',sans-serif",fontSize:15,color:t.sub,fontWeight:700,textAlign:"center",marginBottom:20 }}>
              You're {age} today. How far have you gotten on the NOJ path?
            </div>
            <textarea
              value={promptAnswer}
              onChange={e => setPromptAnswer(e.target.value)}
              placeholder="Write a note to your future self about where you are on the path..."
              style={{ width:"100%",padding:"12px 16px",borderRadius:14,border:`2px solid ${t.border}`,background:t.soft,color:t.text,fontFamily:"'Nunito',sans-serif",fontSize:14,fontWeight:600,outline:"none",resize:"vertical",minHeight:100,marginBottom:14 }}
            />
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={saveAnswer} style={{ flex:1,padding:"12px",borderRadius:14,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.pink},${C.purple})`,color:"#fff",fontFamily:"'Fredoka One',cursive",fontSize:18,boxShadow:`0 4px 18px ${C.pink}44` }}>
                Save Note 🎉
              </button>
              <button onClick={() => setShowPrompt(false)} style={{ padding:"12px 18px",borderRadius:14,border:`1.5px solid ${t.border}`,cursor:"pointer",background:"transparent",color:t.mute,fontFamily:"'Nunito',sans-serif",fontSize:13,fontWeight:800 }}>
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Birthday card in hero */}
      <div style={{ display:"inline-flex",alignItems:"center",gap:10,padding:"12px 20px",borderRadius:20,marginBottom:20,
        background: isBirthday ? `linear-gradient(135deg,${C.pink}22,${C.purple}22)` : dark?`rgba(255,107,181,0.08)`:`rgba(255,107,181,0.06)`,
        border: `2px solid ${isBirthday?C.pink:C.pink+"33"}`,
        boxShadow: isBirthday ? `0 4px 20px ${C.pink}44` : "none",
        flexWrap:"wrap", justifyContent:"center",
      }}>
        <span style={{ fontSize:22 }}>{isBirthday ? "🎂" : "🎮"}</span>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"'Fredoka One',cursive",fontSize:18,color:C.pink,lineHeight:1 }}>
            {isBirthday ? `Happy ${age}th Birthday!` : `Age ${age}`}
          </div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:t.mute,letterSpacing:1,marginTop:3 }}>
            {isBirthday ? "🎉 It's your birthday!" : `${daysUntil} days until age ${age + 1} · Oct 7`}
          </div>
        </div>
        {isBirthday && isOwner && (
          <button onClick={() => setShowPrompt(true)} style={{ padding:"6px 14px",borderRadius:99,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.pink},${C.purple})`,color:"#fff",fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:800,boxShadow:`0 2px 10px ${C.pink}44` }}>
            Write a note
          </button>
        )}
        {savedAnswer && (
          <div style={{ width:"100%",marginTop:8,fontFamily:"'Nunito',sans-serif",fontSize:12,color:t.sub,fontWeight:600,fontStyle:"italic",textAlign:"center" }}>
            Last note: "{savedAnswer.slice(0,80)}{savedAnswer.length>80?"...":""}"
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function RoadmapPage({dark,isOwner,showToast,fireConfetti}) {
  const t=T(dark);
  const [open,setOpen]=useState(1);
  const [tab,setTab]=useState("milestones");

  const {state:phaseStatus,save:saveStatus,updatedAt:statusTs} = useLiveState("phase_status",{},isOwner);
  const {state:checks,save:saveChecks,updatedAt:checksTs,syncing} = useLiveState("phase_checks",{},isOwner);
  const {state:actionChecks,save:saveActionChecks} = useLiveState("action_checks",{},isOwner);
  const {state:streakData,save:saveStreakData} = useLiveState("streak_data",{streak:0,lastChecked:"",lastFireDay:""},isOwner);

  const [fireTrigger, setFireTrigger] = useState(false);

  const totalMilestones=PHASES.reduce((s,p)=>s+p.milestones.length,0);
  const doneCount=Object.values(checks).filter(Boolean).length;

  // Check daily action — updates streak
  const checkDailyAction = (nextActionChecks) => {
    if(!isOwner) return;
    const today = todayStr();
    if(streakData.lastChecked === today) return; // already counted today
    // Count if any daily action was just checked today
    const hasDailyChecked = Object.entries(nextActionChecks).some(([k,v])=>{
      if(!v) return false;
      const [phaseId,aIdx] = k.split("-a");
      const phase = PHASES.find(p=>p.id===parseInt(phaseId));
      return phase && isDaily(phase.actions[parseInt(aIdx)]);
    });
    if(!hasDailyChecked) return;
    const yesterday = new Date();yesterday.setDate(yesterday.getDate()-1);
    const yesterdayStr = yesterday.toISOString().slice(0,10);
    const newStreak = streakData.lastChecked===yesterdayStr ? streakData.streak+1 : 1;
    const hitMilestone = STREAK_MILESTONES.some(m=>newStreak===m.days);
    const newData = {...streakData, streak:newStreak, lastChecked:today};
    saveStreakData(newData);
    if(hitMilestone) { setFireTrigger(t=>!t); showToast(`🔥 ${newStreak} day streak milestone!`,"success"); }
    else if(newStreak > 1) showToast(`🔥 Day ${newStreak} streak!`,"success");
  };

  // Reset daily actions at midnight
  useEffect(()=>{
    if(!isOwner) return;
    const today = todayStr();
    const lastReset = localStorage.getItem("noj_daily_reset");
    if(lastReset !== today) {
      // Reset only daily action keys
      const next = {};
      Object.entries(actionChecks).forEach(([k,v])=>{
        const [phaseId,aIdx] = k.split("-a");
        const phase = PHASES.find(p=>p.id===parseInt(phaseId));
        const isD = phase && isDaily(phase.actions[parseInt(aIdx)]);
        if(!isD) next[k] = v; // keep non-daily checks
      });
      saveActionChecks(next);
      localStorage.setItem("noj_daily_reset", today);
    }
  },[]);

  const toggleAction = (phaseId, aIdx) => {
    if(!isOwner) return;
    const key = `${phaseId}-a${aIdx}`;
    const next = {...actionChecks, [key]:!actionChecks[key]};
    saveActionChecks(next, "Action checked off");
    if(next[key]) checkDailyAction(next);
    showToast(next[key]?"Action done ✓":"Unchecked","success");
  };

  const toggle=(id,forceOpen=false)=>{
    setOpen(p=>(forceOpen||p!==id)?id:null);
    setTab("milestones");
    setTimeout(()=>{const el=document.getElementById(`p${id}`);if(el)window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-74,behavior:"smooth"});},50);
  };

  const cycleStatus=(e,id)=>{
    e.stopPropagation();if(!isOwner)return;
    const cur=phaseStatus[id]||"Not Started";
    const idx=QUEST_STATUSES.indexOf(cur);
    const next={...phaseStatus,[id]:QUEST_STATUSES[(idx+1)%QUEST_STATUSES.length]};
    saveStatus(next);showToast("Status updated ✓","success");
  };

  const toggleCheck=(phaseId,mIdx,questChecksRef,saveQuestChecksRef)=>{
    if(!isOwner)return;
    const key=`${phaseId}-${mIdx}`;
    const next={...checks,[key]:!checks[key]};
    saveChecks(next,"Milestone checked off");
    // Auto-update phase status
    const phase=PHASES.find(p=>p.id===phaseId);
    if(phase){
      const nowDone=phase.milestones.filter((_,i)=>next[`${phaseId}-${i}`]).length;
      const total=phase.milestones.length;
      const autoStatus=nowDone===0?"Not Started":nowDone===total?"Complete":"In Progress";
      if(autoStatus!==(phaseStatus[phaseId]||"Not Started")) saveStatus({...phaseStatus,[phaseId]:autoStatus});
      if(nowDone===total){fireConfetti();showToast("🎉 Phase complete!","success");}
    }
    // Sync linked quest — if this milestone has a linkedQuestId, mark quest as complete/incomplete
    const milestone = phase?.milestones[mIdx];
    const linkedQid = mLink(milestone);
    if(linkedQid && saveQuestChecksRef){
      showToast(next[key]?"🔗 Linked quest updated!":"🔗 Quest unlinked","success");
    }
  };

  return(
    <div>
      <div className="noj-hero" style={{padding:"52px 20px 44px",maxWidth:900,margin:"0 auto",textAlign:"center",borderBottom:`2px solid ${t.border}`}}>
        <div style={{display:"inline-flex",marginBottom:18,padding:"6px 20px",background:`${C.blue}12`,borderRadius:99,border:`1.5px solid ${C.blue}28`}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:3,color:C.blue,textTransform:"uppercase"}}>Personal Life Roadmap · The NOJ Path</span>
        </div>
        <h1 style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(28px,6vw,64px)",lineHeight:1.1,marginBottom:16,color:dark?C.sky:C.blue}}>
          First Foreign CEO<br/>of Nintendo of Japan
        </h1>
        <p style={{fontFamily:"'Nunito',sans-serif",fontSize:15,color:t.sub,fontWeight:600,lineHeight:1.8,maxWidth:460,margin:"0 auto 24px"}}>
          My roadmap to becoming the first foreign CEO of Nintendo.<br/>Inspired by Satoru Iwata. Built by sebastianosky.
        </p>
        <BirthdayCounter dark={dark} isOwner={isOwner} showToast={showToast}/>
        <div className="noj-stat-cards" style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap",marginBottom:20}}>
          <StatCard value="7"   label="Phases" color={C.blue}   dark={dark}/>
          <StatCard value="~25" label="Years"  color={C.teal}   dark={dark}/>
          <StatCard value="1"   label="Goal"   color={C.yellow} dark={dark}/>
          <StatCard value={`${doneCount}/${totalMilestones}`} label="Done" color={C.green} dark={dark}/>
        </div>
        <ProgressBar value={doneCount} total={totalMilestones} color={C.blue}/>
        <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
          <LastUpdated ts={checksTs||statusTs} dark={dark}/>
          {syncing&&<span style={{fontFamily:"'Nunito',sans-serif",fontSize:10,color:C.teal,fontWeight:800}}>● Saving...</span>}
          {!isOwner&&<span style={{fontFamily:"'Nunito',sans-serif",fontSize:10,color:t.mute,fontWeight:700}}>👁 Live view — auto-refreshes every 30s</span>}
        </div>
      </div>

      {/* Timeline */}
      <div className="noj-timeline" style={{maxWidth:900,margin:"0 auto",padding:"24px 20px 0",overflowX:"auto"}}>
        <div style={{display:"flex",alignItems:"center",minWidth:520}}>
          {PHASES.map((p,i)=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",flex:i<PHASES.length-1?1:0}}>
              <button onClick={()=>toggle(p.id,true)} style={{width:open===p.id?48:34,height:open===p.id?48:34,borderRadius:"50%",border:`3px solid ${open===p.id?p.accent:t.border}`,background:open===p.id?`linear-gradient(135deg,${p.accent},${p.accent}cc)`:t.card,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,outline:"none",transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",boxShadow:open===p.id?`0 4px 20px ${p.accent}55`:t.shadowS,fontSize:open===p.id?21:15}}>
                {p.emoji}
              </button>
              {i<PHASES.length-1&&<div style={{flex:1,height:3,minWidth:8,borderRadius:99,background:i<PHASES.findIndex(x=>x.id===open)?`linear-gradient(to right,${PHASES[i].accent},${PHASES[i+1].accent})`:t.border,transition:"background 0.4s"}}/>}
            </div>
          ))}
        </div>
        <div style={{display:"flex",minWidth:520,paddingTop:8,paddingBottom:4}}>
          {PHASES.map((p,i)=><div key={p.id} style={{flex:i<PHASES.length-1?1:0,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:open===p.id?p.accent:t.mute,letterSpacing:0.3,transition:"color 0.25s",paddingLeft:2,fontWeight:open===p.id?700:400}}>{p.age}</div>)}
        </div>
      </div>

      {/* QOL toolbar */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"10px 20px 0",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <button onClick={()=>setOpen(null)} style={{fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:800,padding:"5px 12px",borderRadius:99,border:`1.5px solid ${t.border}`,background:t.pill,color:t.sub,cursor:"pointer"}}>⊖ Collapse All</button>
        {isOwner&&(
          <button onClick={()=>{if(window.confirm("Reset all milestone checkmarks?"))saveChecks({});}} style={{fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:800,padding:"5px 12px",borderRadius:99,border:"1.5px solid rgba(255,92,117,0.3)",background:"rgba(255,92,117,0.08)",color:C.red,cursor:"pointer"}}>↺ Reset</button>
        )}
        {!isOwner&&<span style={{fontFamily:"'Nunito',sans-serif",fontSize:11,color:t.mute,fontWeight:700}}>👁 Read-only view</span>}
      </div>

      {/* Phases */}
      <div style={{maxWidth:900,margin:"8px auto 0",padding:"0 20px 64px"}}>
        {PHASES.map(phase=>{
          const isOpen=open===phase.id;
          const status=phaseStatus[phase.id]||"Not Started";
          const sm=STATUS_META[status];
          const phaseChecks=phase.milestones.filter((_,i)=>checks[`${phase.id}-${i}`]).length;
          return(
            <div key={phase.id} id={`p${phase.id}`} style={{marginBottom:10}}>
              <button onClick={()=>toggle(phase.id)} style={{width:"100%",textAlign:"left",cursor:"pointer",outline:"none",background:isOpen?(dark?`${phase.accent}14`:`${phase.accent}09`):t.card,border:`2.5px solid ${isOpen?phase.accent+"66":t.border}`,borderRadius:isOpen?"22px 22px 0 0":"22px",padding:"16px 20px",display:"flex",alignItems:"center",gap:14,transition:"all 0.2s ease",boxShadow:isOpen?`0 8px 32px ${phase.accent}22`:t.shadowS}}>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:26,color:isOpen?phase.accent:t.mute,minWidth:46,lineHeight:1,transition:"color 0.25s"}}>{phase.num}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
                    <span style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:t.text}}>{phase.emoji} {phase.title}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:t.mute,letterSpacing:1}}>{phase.where}</span>
                  </div>
                  <div style={{fontFamily:"'Nunito',sans-serif",fontSize:12,color:t.sub,fontWeight:600,fontStyle:"italic",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{phase.tagline}</div>
                </div>
                <div style={{fontFamily:"'Nunito',sans-serif",fontSize:10,fontWeight:800,flexShrink:0,padding:"3px 10px",borderRadius:99,background:phaseChecks===phase.milestones.length&&phaseChecks>0?`linear-gradient(135deg,${C.green},${C.teal})`:`${phase.accent}18`,color:phaseChecks===phase.milestones.length&&phaseChecks>0?"#fff":phase.accent,border:`1.5px solid ${phase.accent}44`,whiteSpace:"nowrap"}}>
                  {phaseChecks}/{phase.milestones.length}
                </div>
                <div onClick={isOwner?e=>cycleStatus(e,phase.id):e=>e.stopPropagation()} title={isOwner?"Click to change status":status} style={{fontFamily:"'Nunito',sans-serif",fontSize:10,fontWeight:800,flexShrink:0,padding:"4px 11px",borderRadius:99,background:sm.bg,color:sm.color,border:`1.5px solid ${sm.color}44`,cursor:isOwner?"pointer":"default",transition:"all 0.2s",whiteSpace:"nowrap",userSelect:"none"}}>
                  {isOwner?"⟳ ":""}{status}
                </div>
                <div style={{fontSize:18,color:isOpen?phase.accent:t.mute,transform:isOpen?"rotate(180deg)":"rotate(0)",transition:"transform 0.3s cubic-bezier(0.34,1.2,0.64,1)",flexShrink:0}}>▾</div>
              </button>

              {isOpen&&(
                <div style={{background:dark?`${phase.accent}07`:`${phase.accent}04`,border:`2.5px solid ${phase.accent}44`,borderTop:"none",borderRadius:"0 0 22px 22px",padding:"0 20px 24px",boxShadow:`0 12px 40px ${phase.accent}12`}}>
                  <p style={{padding:"16px 0 14px",borderBottom:`1.5px solid ${phase.accent}20`,fontFamily:"'Nunito',sans-serif",fontSize:14,color:t.sub,lineHeight:1.8,fontWeight:600,margin:0}}>{phase.summary}</p>
                  <div style={{display:"flex",gap:8,padding:"14px 0 12px",flexWrap:"wrap"}}>
                    {[["milestones","🏁 Milestones"],["actions","⚡ Actions"],["honest","💬 Real Talk"]].map(([tt,label])=>(
                      <button key={tt} onClick={e=>{e.stopPropagation();setTab(tt);}} style={{fontFamily:"'Nunito',sans-serif",fontSize:12,fontWeight:800,padding:"6px 14px",borderRadius:99,border:"none",cursor:"pointer",background:tab===tt?`linear-gradient(135deg,${phase.accent},${phase.accent}cc)`:t.pill,color:tab===tt?"#fff":t.sub,boxShadow:tab===tt?`0 3px 12px ${phase.accent}44`:"none",transition:"all 0.2s",transform:tab===tt?"scale(1.05)":"scale(1)"}}>{label}</button>
                    ))}
                  </div>

                  {tab==="milestones"&&(
                    <div>
                      <AgeGuidance phase={phase} dark={dark}/>
                      {phase.milestones.map((m,i)=>{
                        const done=!!checks[`${phase.id}-${i}`];
                        const text=mText(m);
                        const linkedQid=mLink(m);
                        return(
                          <div key={i} onClick={isOwner?()=>toggleCheck(phase.id,i):undefined} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"9px 0",borderBottom:`1px solid ${t.border}`,cursor:isOwner?"pointer":"default",opacity:done?0.55:1,transition:"opacity 0.2s"}}>
                            <Check done={done} accent={phase.accent} disabled={!isOwner} onClick={e=>{e.stopPropagation();if(isOwner)toggleCheck(phase.id,i);}}/>
                            <div style={{flex:1}}>
                              <div style={{fontFamily:"'Nunito',sans-serif",fontSize:13,color:t.text,lineHeight:1.7,fontWeight:600,textDecoration:done?"line-through":"none"}}>{text}</div>
                              {linkedQid&&(
                                <span style={{fontFamily:"'Nunito',sans-serif",fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:99,background:`${phase.accent}18`,color:phase.accent,border:`1px solid ${phase.accent}33`,display:"inline-block",marginTop:2}}>
                                  🔗 Also a Side Quest
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <div style={{marginTop:12}}><ProgressBar value={phaseChecks} total={phase.milestones.length} color={phase.accent}/></div>
                      <div style={{marginTop:16,padding:"14px 16px",background:dark?`${phase.accent}16`:`${phase.accent}09`,border:`2px solid ${phase.accent}44`,borderRadius:16}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:2,color:phase.accent,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>🔥 Building toward</div>
                        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:13,color:t.sub,lineHeight:1.7,fontWeight:600,fontStyle:"italic"}}>{phase.build_toward}</div>
                      </div>
                      <SchoolInfoCard school={phase.school} dark={dark}/>
                    </div>
                  )}
                  {tab==="actions"&&(
                    <div>
                      {/* Streak card — only show on phases with daily actions */}
                      {phase.actions.some(a=>isDaily(a))&&isOwner&&(
                        <StreakCard
                          streak={streakData.streak||0}
                          lastChecked={streakData.lastChecked}
                          dark={dark}
                          onFire={fireTrigger}
                        />
                      )}
                      {phase.actions.map((a,i)=>{
                        const key=`${phase.id}-a${i}`;
                        const done=!!actionChecks[key];
                        const daily=isDaily(a);
                        return(
                          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"9px 0",borderBottom:`1px solid ${t.border}`,opacity:done?0.5:1,transition:"opacity 0.2s"}}>
                            <Check
                              done={done}
                              accent={daily?C.orange:phase.accent}
                              disabled={!isOwner}
                              onClick={e=>{e.stopPropagation();toggleAction(phase.id,i);}}
                            />
                            <div style={{flex:1}}>
                              <div style={{fontFamily:"'Nunito',sans-serif",fontSize:13,color:t.text,lineHeight:1.7,fontWeight:600,textDecoration:done?"line-through":"none"}}>{a}</div>
                              {daily&&(
                                <span style={{fontFamily:"'Nunito',sans-serif",fontSize:9,fontWeight:800,padding:"1px 8px",borderRadius:99,background:`${C.orange}18`,color:C.orange,border:`1px solid ${C.orange}44`,display:"inline-block",marginTop:3}}>🔄 Resets daily</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <div style={{marginTop:12}}>
                        <ProgressBar
                          value={phase.actions.filter((_,i)=>actionChecks[`${phase.id}-a${i}`]).length}
                          total={phase.actions.length}
                          color={phase.accent}
                        />
                      </div>
                    </div>
                  )}
                  {tab==="honest"&&(
                    <div style={{display:"flex",flexDirection:"column",gap:12,paddingTop:4}}>
                      <div style={{padding:"16px 18px",background:t.card,border:`2px solid ${t.border}`,borderRadius:16,boxShadow:t.shadowS}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:2,color:t.mute,textTransform:"uppercase",marginBottom:8,fontWeight:700}}>🎮 The Iwata Lesson</div>
                        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:14,color:t.text,lineHeight:1.8,fontWeight:700,fontStyle:"italic"}}>"{phase.iwata_note}"</div>
                      </div>
                      <div style={{padding:"16px 18px",background:dark?`${phase.accent}14`:`${phase.accent}08`,border:`2px solid ${phase.accent}44`,borderRadius:16}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:2,color:phase.accent,textTransform:"uppercase",marginBottom:8,fontWeight:700}}>💬 Real Talk</div>
                        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:13,color:t.sub,lineHeight:1.8,fontWeight:600}}>{phase.honest}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{borderTop:`2px solid ${t.border}`,padding:"28px 20px",textAlign:"center"}}>
        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:15,color:t.mute,fontStyle:"italic",fontWeight:700,maxWidth:540,margin:"0 auto 8px"}}>"On my business card I am a corporate president. In my mind I am a game developer. But in my heart I am a gamer."</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:t.mute,letterSpacing:2,opacity:0.5}}>— SATORU IWATA</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCES PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ResourcesPage({dark,isOwner,showToast,fireConfetti}) {
  const t=T(dark);
  const [openPhase,setOpenPhase]=useState(null);
  const [filter,setFilter]=useState("All");
  const {state:read,save:saveRead,updatedAt,syncing} = useLiveState("book_reads",{},isOwner);

  const toggleRead=(num,e,phase)=>{
    e.stopPropagation();if(!isOwner)return;
    const next={...read,[num]:!read[num]};
    saveRead(next,"Book marked as read");
    showToast(next[num]?"Marked as read ✓":"Unmarked","success");
    // Confetti if entire phase is now read
    if(phase){
      const allRead=phase.books.every(b=>b.num===num?next[num]:next[b.num]);
      if(allRead)fireConfetti();
    }
  };

  const allTypes=["All","🎯 Core","🧠 Mindset","🇯🇵 Japanese","🇯🇵 Culture","💻 Tech","🎮 Design","👑 Leadership"];
  const totalBooks=BOOK_PHASES.reduce((s,p)=>s+p.books.length,0);
  const newBooks=BOOK_PHASES.reduce((s,p)=>s+p.books.filter(b=>b.isNew).length,0);
  const readCount=Object.values(read).filter(Boolean).length;
  const filtered=BOOK_PHASES.map(p=>({...p,books:filter==="All"?p.books:p.books.filter(b=>b.type===filter||(filter==="🇯🇵 Culture"&&b.type==="🌏 Culture"))})).filter(p=>p.books.length>0);

  return(
    <div>
      <div className="noj-hero" style={{padding:"52px 20px 44px",maxWidth:900,margin:"0 auto",textAlign:"center",borderBottom:`2px solid ${t.border}`}}>
        <div style={{display:"inline-flex",marginBottom:16,padding:"6px 20px",background:`${C.orange}14`,borderRadius:99,border:`1.5px solid ${C.orange}30`}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:3,color:C.orange,textTransform:"uppercase"}}>Resource Library</span>
        </div>
        <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(24px,5vw,52px)",marginBottom:12,lineHeight:1.1,color:C.orange}}>My Reading Roadmap</h2>
        <p style={{fontFamily:"'Nunito',sans-serif",fontSize:14,color:t.sub,fontWeight:600,lineHeight:1.7,maxWidth:420,margin:"0 auto 24px"}}>32 books across 6 phases. Every book has a specific reason.</p>
        <div className="noj-stat-cards" style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap",marginBottom:20}}>
          <StatCard value={totalBooks} label="Books"    color={C.blue}   dark={dark}/>
          <StatCard value={6}          label="Phases"   color={C.teal}   dark={dark}/>
          <StatCard value={newBooks}   label="New Adds" color={C.yellow} dark={dark}/>
          <StatCard value={`${readCount}/${totalBooks}`} label="Read" color={C.green} dark={dark}/>
        </div>
        <ProgressBar value={readCount} total={totalBooks} color={C.orange}/>
        <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
          <LastUpdated ts={updatedAt} dark={dark}/>
          {syncing&&<span style={{fontFamily:"'Nunito',sans-serif",fontSize:10,color:C.teal,fontWeight:800}}>● Saving...</span>}
          {!isOwner&&<span style={{fontFamily:"'Nunito',sans-serif",fontSize:10,color:t.mute,fontWeight:700}}>👁 Live view</span>}
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"20px 20px 8px",display:"flex",flexWrap:"wrap",gap:7}}>
        {allTypes.map(type=><Pill key={type} label={type} active={filter===type} color={C.blue} onClick={()=>{setFilter(type);setOpenPhase(null);}} dark={dark}/>)}
      </div>

      <div style={{maxWidth:900,margin:"12px auto 0",padding:"0 20px 64px"}}>
        {filtered.map(phase=>{
          const isOpen=openPhase===phase.id||filter!=="All";
          const phaseRead=phase.books.filter(b=>read[b.num]).length;
          return(
            <div key={phase.id} style={{marginBottom:12}}>
              <div onClick={()=>filter==="All"&&setOpenPhase(isOpen&&openPhase===phase.id?null:phase.id)} style={{background:isOpen?(dark?`${phase.accent}14`:`${phase.accent}09`):t.card,border:`2.5px solid ${isOpen?phase.accent+"66":t.border}`,borderRadius:isOpen&&filter==="All"?"22px 22px 0 0":"22px",padding:"16px 20px",display:"flex",alignItems:"center",gap:14,cursor:filter==="All"?"pointer":"default",transition:"all 0.2s",boxShadow:isOpen?`0 8px 32px ${phase.accent}20`:t.shadowS}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:6}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:phase.accent,letterSpacing:2,textTransform:"uppercase",fontWeight:700}}>{phase.label}</span>
                    <span style={{fontFamily:"'Fredoka One',cursive",fontSize:17,color:t.text}}>{phase.title}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:t.mute}}>Age {phase.age}</span>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {phase.focus.map(f=><span key={f} style={{fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:99,background:dark?`${phase.accent}16`:`${phase.accent}10`,border:`1.5px solid ${phase.accent}44`,color:phase.accent}}>{f}</span>)}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                  <span style={{fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:800,padding:"4px 12px",borderRadius:99,background:phaseRead===phase.books.length&&phase.books.length>0?`linear-gradient(135deg,${C.green},${C.teal})`:t.pill,color:phaseRead===phase.books.length&&phase.books.length>0?"#fff":t.mute,transition:"all 0.3s"}}>{phaseRead}/{phase.books.length} read</span>
                  {filter==="All"&&<div style={{fontSize:18,color:isOpen?phase.accent:t.mute,transform:isOpen?"rotate(180deg)":"rotate(0)",transition:"transform 0.3s"}}>▾</div>}
                </div>
              </div>
              {isOpen&&(
                <div style={{background:dark?`${phase.accent}05`:`${phase.accent}03`,border:`2.5px solid ${phase.accent}44`,borderTop:"none",borderRadius:"0 0 22px 22px",padding:"4px 20px 20px"}}>
                  <div style={{padding:"10px 0 4px"}}><ProgressBar value={phaseRead} total={phase.books.length} color={phase.accent}/></div>
                  {phase.books.map((book,i)=>{
                    const done=!!read[book.num];
                    return(
                      <div key={book.num} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"14px 0",borderBottom:i<phase.books.length-1?`1.5px solid ${t.border}`:"none",opacity:done?0.5:1,transition:"opacity 0.2s"}}>
                        <Check done={done} accent={phase.accent} disabled={!isOwner} onClick={e=>toggleRead(book.num,e,phase)}/>
                        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:13,color:phase.accent,minWidth:30,padding:"3px 7px",borderRadius:9,textAlign:"center",background:dark?`${phase.accent}16`:`${phase.accent}10`,border:`2px solid ${phase.accent}44`,flexShrink:0}}>{String(book.num).padStart(2,"0")}</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:7,marginBottom:4}}>
                            <span style={{fontFamily:"'Fredoka One',cursive",fontSize:16,color:t.text,textDecoration:done?"line-through":"none"}}>{book.title}</span>
                            {book.isNew&&<NewBadge/>}
                            <TypeBadge type={book.type} dark={dark}/>
                          </div>
                          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:11,color:t.mute,marginBottom:4,fontWeight:700}}>{book.sub}</div>
                          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:12,color:t.sub,lineHeight:1.6,fontWeight:600,fontStyle:"italic"}}>{book.note}</div>
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
function SideQuestsPage({dark,isOwner,showToast,fireConfetti}) {
  const t=T(dark);
  const [open,setOpen]=useState(null);
  const [filter,setFilter]=useState("All");

  const {state:questStatuses,save:saveStatuses,updatedAt} = useLiveState("quest_statuses",{},isOwner);
  const {state:questChecks,save:saveQuestChecks} = useLiveState("quest_checks",{},isOwner);

  const quests=DEFAULT_QUESTS.map(q=>({...q,status:questStatuses[q.id]||q.status}));

  const cycleStatus=(e,id)=>{
    e.stopPropagation();if(!isOwner)return;
    const cur=questStatuses[id]||DEFAULT_QUESTS.find(q=>q.id===id).status;
    const idx=QUEST_STATUSES.indexOf(cur);
    const nextStatus=QUEST_STATUSES[(idx+1)%QUEST_STATUSES.length];
    const next={...questStatuses,[id]:nextStatus};
    saveStatuses(next,"Quest status updated");
    showToast("Quest updated ✓","success");
    if(nextStatus==="Complete")fireConfetti();
  };

  const toggleCheck=(questId,mIdx)=>{
    if(!isOwner)return;
    const key=`${questId}-${mIdx}`;
    const next={...questChecks,[key]:!questChecks[key]};
    saveQuestChecks(next,"Quest milestone checked");
    // Auto-update quest status based on completion
    const quest=DEFAULT_QUESTS.find(q=>q.id===questId);
    if(quest){
      const nowDone=quest.milestones.filter((_,i)=>next[`${questId}-${i}`]).length;
      const total=quest.milestones.length;
      const autoStatus=nowDone===0?"Not Started":nowDone===total?"Complete":"In Progress";
      const curStatus=quests.find(q=>q.id===questId)?.status||"Not Started";
      if(autoStatus!==curStatus){
        const newStatuses = {...questStatuses, [questId]: autoStatus};
        saveStatuses(newStatuses,"Quest status auto-updated");
      }
      if(nowDone===total){fireConfetti();showToast("⚔️ Quest complete!","success");}
    }
  };

  const categories=["All","Life","Japanese","Japan","Tech","Leadership","Academic","Nintendo"];

  // Sort: pinned first, then by sortAge ascending
  const sortedQuests = [...quests].sort((a,b)=>{
    if(a.pinned) return -1;
    if(b.pinned) return 1;
    return (a.sortAge||99)-(b.sortAge||99);
  });

  const filtered=sortedQuests.filter(q=>filter==="All"||q.category===filter);
  const totalMilestones=quests.reduce((s,q)=>s+q.milestones.length,0);
  const doneCount=Object.values(questChecks).filter(Boolean).length;

  return(
    <div>
      <div className="noj-hero" style={{padding:"52px 20px 44px",maxWidth:900,margin:"0 auto",textAlign:"center",borderBottom:`2px solid ${t.border}`}}>
        <div style={{display:"inline-flex",marginBottom:16,padding:"6px 20px",background:`${C.red}12`,borderRadius:99,border:`1.5px solid ${C.red}28`}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:3,color:C.red,textTransform:"uppercase"}}>Side Quests</span>
        </div>
        <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(24px,5vw,52px)",marginBottom:12,lineHeight:1.1,color:C.red}}>Life Beyond the Main Story</h2>
        <p style={{fontFamily:"'Nunito',sans-serif",fontSize:14,color:t.sub,fontWeight:600,lineHeight:1.7,maxWidth:420,margin:"0 auto 24px"}}>The goals that live between the phases. Not optional — just parallel.</p>
        <div className="noj-stat-cards" style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap",marginBottom:20}}>
          <StatCard value={quests.length} label="Quests" color={C.red} dark={dark}/>
          <StatCard value={quests.filter(q=>q.status==="In Progress").length} label="Active" color={C.yellow} dark={dark}/>
          <StatCard value={quests.filter(q=>q.status==="Complete").length}    label="Done"   color={C.green}  dark={dark}/>
          <StatCard value={`${doneCount}/${totalMilestones}`} label="Steps" color={C.purple} dark={dark}/>
        </div>
        <ProgressBar value={doneCount} total={totalMilestones} color={C.red}/>
        <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
          <LastUpdated ts={updatedAt} dark={dark}/>
          {!isOwner&&<span style={{fontFamily:"'Nunito',sans-serif",fontSize:10,color:t.mute,fontWeight:700}}>👁 Live view</span>}
        </div>
        {isOwner&&<div style={{marginTop:10,fontFamily:"'Nunito',sans-serif",fontSize:12,color:t.mute,fontWeight:700}}>✏️ Click a status badge to update · Click milestones to check them off</div>}
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"20px 20px 8px",display:"flex",flexWrap:"wrap",gap:7}}>
        {categories.map(c=><Pill key={c} label={c} active={filter===c} color={C.red} onClick={()=>setFilter(c)} dark={dark}/>)}
      </div>

      <div className="noj-quest-grid" style={{maxWidth:900,margin:"12px auto 0",padding:"0 20px 64px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:16}}>
        {filtered.map(quest=>{
          const isOpen=open===quest.id;
          const sm=STATUS_META[quest.status]||STATUS_META["Not Started"];
          const qDone=quest.milestones.filter((_,i)=>questChecks[`${quest.id}-${i}`]).length;
          return(
            <Card key={quest.id} dark={dark} accent={quest.color} onClick={()=>setOpen(isOpen?null:quest.id)}>
              <div style={{height:7,background:`linear-gradient(135deg,${quest.color},${quest.color}88)`}}/>
              <div style={{padding:"18px 20px 20px"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
                  <div style={{width:48,height:48,borderRadius:16,background:`${quest.color}18`,border:`2.5px solid ${quest.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,boxShadow:`0 3px 12px ${quest.color}28`}}>{quest.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Fredoka One',cursive",fontSize:17,color:t.text,marginBottom:6}}>{quest.title}</div>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span onClick={isOwner?e=>cycleStatus(e,quest.id):e=>e.stopPropagation()} style={{fontFamily:"'Nunito',sans-serif",fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:99,background:sm.bg,color:sm.color,border:`1.5px solid ${sm.color}44`,cursor:isOwner?"pointer":"default",userSelect:"none"}}>
                        {isOwner?"⟳ ":""}{quest.status}
                      </span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:t.mute,letterSpacing:1}}>{quest.category}</span>
                      {quest.linkedPhase&&(
                        <span style={{fontFamily:"'Nunito',sans-serif",fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:99,background:`${quest.color}18`,color:quest.color,border:`1px solid ${quest.color}44`}}>
                          🔗 {quest.linkedPhase}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p style={{fontFamily:"'Nunito',sans-serif",fontSize:13,color:t.sub,lineHeight:1.65,fontWeight:600,margin:"0 0 10px"}}>{quest.description}</p>
                {quest.liveCounter&&quest.startDate&&<RelationshipCounter startDate={quest.startDate} color={quest.color}/>}
                <ProgressBar value={qDone} total={quest.milestones.length} color={quest.color}/>
                {isOpen&&(
                  <div style={{marginTop:16,paddingTop:16,borderTop:`1.5px solid ${t.border}`}}>
                    {quest.targetDate&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:quest.color,letterSpacing:2,textTransform:"uppercase",marginBottom:8,fontWeight:700}}>🎯 Target: {quest.targetDate}</div>}
                    {quest.startDate&&<div style={{fontFamily:"'Nunito',sans-serif",fontSize:11,color:t.mute,fontWeight:700,marginBottom:12}}>Started: {quest.startDate}</div>}
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:t.mute,letterSpacing:2,textTransform:"uppercase",marginBottom:8,fontWeight:700}}>Milestones</div>
                    {quest.milestones.map((m,i)=>{
                      const done=!!questChecks[`${quest.id}-${i}`];
                      return(
                        <div key={i} onClick={e=>{e.stopPropagation();toggleCheck(quest.id,i);}} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"6px 0",cursor:isOwner?"pointer":"default",opacity:done?0.5:1,transition:"opacity 0.2s"}}>
                          <Check done={done} accent={quest.color} size={20} disabled={!isOwner} onClick={e=>{e.stopPropagation();toggleCheck(quest.id,i);}}/>
                          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:12,color:t.sub,lineHeight:1.6,fontWeight:600,textDecoration:done?"line-through":"none",paddingTop:1}}>{m}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div style={{marginTop:12,fontFamily:"'Nunito',sans-serif",fontSize:11,color:quest.color,fontWeight:800,textAlign:"right"}}>{isOpen?"▴ Less":"▾ More"}</div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
const BG_DOTS=Array.from({length:14},(_,i)=>({x:(i*137.508)%100,y:(i*98.618)%100,size:10+(i%4)*8,color:[C.red,C.orange,C.yellow,C.green,C.teal,C.blue,C.purple,C.pink][i%8],dur:3+(i%4),delay:(i*0.3)%3}));
const NAV_TABS=[{id:"roadmap",emoji:"🗺",label:"Roadmap"},{id:"resources",emoji:"📚",label:"Resources"},{id:"quests",emoji:"⚔️",label:"Side Quests"}];

export default function App() {
  const [page,setPage]=useState("roadmap");
  const [dark,setDark]=useState(()=>LS.get("noj_theme",false));
  const [sidebar,setSidebar]=useState(false);
  const [showTop,setShowTop]=useState(false);
  const [isOwner,setIsOwner]=useState(()=>LS.get("noj_owner",false));
  const [showPin,setShowPin]=useState(false);
  const [confetti,setConfetti]=useState(false);
  const {toasts,show:showToast}=useToast();
  const {showBanner,bannerMsg,dismiss:dismissBanner}=useUpdateBanner(isOwner);
  const t=T(dark);

  useEffect(()=>LS.set("noj_theme",dark),[dark]);

  // Scroll to top listener
  useEffect(()=>{
    const onScroll=()=>setShowTop(window.scrollY>400);
    window.addEventListener("scroll",onScroll,{passive:true});
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  // Keyboard shortcuts
  useEffect(()=>{
    const onKey=(e)=>{
      if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")return;
      if(e.key==="r"||e.key==="R")navigate("roadmap");
      if(e.key==="b"||e.key==="B")navigate("resources");
      if(e.key==="q"||e.key==="Q")navigate("quests");
      if(e.key==="d"||e.key==="D")setDark(v=>!v);
      if(e.key==="ArrowUp"&&window.scrollY>200)window.scrollTo({top:0,behavior:"smooth"});
      // 1-7 jumps to phase on roadmap page
      const num=parseInt(e.key);
      if(num>=1&&num<=7){
        navigate("roadmap");
        setTimeout(()=>{
          const el=document.getElementById(`p${num}`);
          if(el)window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-74,behavior:"smooth"});
        },100);
      }
    };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[]);

  const navigate=(id)=>{setPage(id);setSidebar(false);window.scrollTo({top:0,behavior:"smooth"});};
  const lockOwner=()=>{setIsOwner(false);LS.set("noj_owner",false);showToast("Locked 🔒","info");setSidebar(false);};
  const fireConfetti=()=>{setConfetti(true);};

  return(
    <div style={{fontFamily:"'Nunito',sans-serif",background:t.bg,minHeight:"100vh",color:t.text,position:"relative"}}>
      <style>{`
        ${FONTS}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:${t.bg};margin:0;padding:0;}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes floatDot{0%,100%{transform:translateY(0);}50%{transform:translateY(-14px);}}
        @keyframes popIn{from{opacity:0;transform:scale(0.9);}to{opacity:1;transform:scale(1);}}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        @keyframes confettiPop{0%{opacity:1;transform:translateX(0) translateY(0) rotate(0deg);}100%{opacity:0;transform:translateX(var(--dx,80px)) translateY(var(--dy,-100px)) rotate(360deg);}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes flamePop{0%{opacity:1;transform:translateY(0) scale(1);}100%{opacity:0;transform:translateY(-70px) scale(0.2);}}
        button{font-family:inherit;outline:none;-webkit-tap-highlight-color:transparent;}
        input,textarea{outline:none;font-family:inherit;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${dark?"#2a3060":"#c0c8f0"};border-radius:99px;}
        .noj-bottom-nav{display:none;}
        @media(max-width:640px){
          .noj-bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;z-index:200;background:${t.nav};backdrop-filter:blur(24px) saturate(1.8);border-top:2px solid ${t.border};height:64px;align-items:center;justify-content:space-around;padding:0 4px;box-shadow:0 -4px 24px rgba(0,0,0,0.12);}
          .noj-page-wrap{padding-bottom:76px!important;}
          .noj-hero{padding:28px 16px 20px!important;}
          .noj-stat-cards{gap:6px!important;}
          .noj-stat-card{padding:9px 12px!important;min-width:64px!important;border-radius:14px!important;}
          .noj-stat-card .val{font-size:22px!important;}
          .noj-quest-grid{grid-template-columns:1fr!important;gap:12px!important;}
          .noj-timeline{padding:14px 14px 0!important;}
          .noj-filter{padding:12px 14px 4px!important;gap:6px!important;}
          .phase-row{padding:13px 14px!important;gap:10px!important;}
          .phase-num{font-size:20px!important;min-width:36px!important;}
          .phase-title{font-size:15px!important;}
          .phase-tag{display:none!important;}
          .book-row{gap:8px!important;}
          .book-num{min-width:26px!important;font-size:11px!important;}
        }
        @media(max-width:380px){
          .noj-stat-card{padding:7px 8px!important;min-width:54px!important;}
          .noj-stat-card .val{font-size:18px!important;}
        }
      `}</style>

      {/* BG dots */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        {BG_DOTS.map((d,i)=><div key={i} style={{position:"absolute",left:`${d.x}%`,top:`${d.y}%`,width:d.size,height:d.size,borderRadius:"50%",background:d.color,opacity:dark?0.04:0.06,animation:`floatDot ${d.dur}s ease-in-out infinite`,animationDelay:`${d.delay}s`,filter:"blur(1px)"}}/>)}
      </div>

      {/* PIN modal */}
      {showPin&&<PinModal dark={dark} onClose={()=>setShowPin(false)} onSuccess={()=>{setIsOwner(true);setShowPin(false);showToast("Owner mode unlocked 👑","success");}}/>}

      {/* Confetti */}
      <Confetti active={confetti} onDone={()=>setConfetti(false)}/>

      {/* Global update banner for visitors */}
      {showBanner&&<UpdateBanner msg={bannerMsg} dark={dark} onReload={()=>window.location.reload()} onDismiss={dismissBanner}/>}

      {/* Toast notifications */}
      <Toast toasts={toasts}/>

      {/* Sidebar overlay */}
      {sidebar&&<div onClick={()=>setSidebar(false)} style={{position:"fixed",inset:0,zIndex:150,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(4px)"}}/>}

      {/* Sidebar */}
      <div style={{position:"fixed",top:0,left:0,bottom:0,width:256,zIndex:160,background:t.nav,backdropFilter:"blur(24px) saturate(1.8)",borderRight:`2px solid ${t.border}`,boxShadow:t.shadow,transform:sidebar?"translateX(0)":"translateX(-100%)",transition:"transform 0.28s cubic-bezier(0.34,1.1,0.64,1)",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"22px 20px 16px",borderBottom:`1.5px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:12,background:`linear-gradient(135deg,${C.red},${C.blue})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🎮</div>
            <span style={{fontFamily:"'Fredoka One',cursive",fontSize:20,color:C.red}}>NOJ Path</span>
          </div>
          <button onClick={()=>setSidebar(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:t.mute}}>✕</button>
        </div>
        <div style={{flex:1,padding:"14px 12px",display:"flex",flexDirection:"column",gap:4}}>
          {NAV_TABS.map(tab=>{
            const active=page===tab.id;
            const shortcuts={"roadmap":"R","resources":"B","quests":"Q"};
            return(
              <button key={tab.id} onClick={()=>navigate(tab.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:16,border:"none",cursor:"pointer",background:active?`linear-gradient(135deg,${C.blue},${C.sky})`:t.pill,color:active?"#fff":t.sub,fontFamily:"'Nunito',sans-serif",fontSize:14,fontWeight:800,textAlign:"left",transition:"all 0.2s",boxShadow:active?`0 4px 16px ${C.blue}44`:"none"}}>
                <span style={{fontSize:20}}>{tab.emoji}</span>
                <span style={{flex:1}}>{tab.label}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,opacity:0.4,fontWeight:400}}>{shortcuts[tab.id]}</span>
              </button>
            );
          })}
          <div style={{margin:"8px 0",height:1,background:t.border}}/>
          {/* Owner controls in sidebar */}
          {isOwner?(
            <div>
              <div style={{padding:"8px 14px",marginBottom:4,fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:800,color:C.yellow,display:"flex",alignItems:"center",gap:6}}>
                <span>👑 Owner Mode Active</span>
              </div>
              <button onClick={lockOwner} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:14,border:`1.5px solid rgba(255,92,117,0.3)`,background:"rgba(255,92,117,0.08)",color:C.red,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontSize:13,fontWeight:800}}>
                🔒 Lock Owner Mode
              </button>
            </div>
          ):(
            <button onClick={()=>{setShowPin(true);setSidebar(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:14,border:`1.5px solid ${t.border}`,background:t.pill,color:t.sub,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontSize:13,fontWeight:800}}>
              🔐 Owner Login
            </button>
          )}
        </div>
        <div style={{padding:"16px 12px",borderTop:`1.5px solid ${t.border}`}}>
          <button onClick={()=>setDark(d=>!d)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"11px 16px",borderRadius:16,border:`1.5px solid ${t.border}`,background:"transparent",color:t.sub,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontSize:13,fontWeight:800,marginBottom:10}}>
            {dark?"☀️ Light Mode":"🌙 Dark Mode"}
          </button>
          {/* Keyboard shortcuts */}
          <div style={{padding:"10px 12px",borderRadius:12,background:t.pill}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:t.mute,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Shortcuts</div>
            {[["R","Roadmap"],["B","Resources"],["Q","Side Quests"],["D","Dark/Light"],["1–7","Jump to Phase"],["↑","Scroll to top"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0"}}>
                <span style={{fontFamily:"'Nunito',sans-serif",fontSize:11,color:t.sub,fontWeight:600}}>{v}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:t.mute,background:t.border,padding:"1px 7px",borderRadius:6}}>{k}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top nav */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:t.nav,backdropFilter:"blur(24px) saturate(1.8)",borderBottom:`2px solid ${t.border}`,padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,boxShadow:t.shadow,gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setSidebar(true)} style={{width:36,height:36,borderRadius:10,border:`1.5px solid ${t.border}`,background:t.card,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,boxShadow:t.shadowS}}>
            {[0,1,2].map(i=><div key={i} style={{width:15,height:2,borderRadius:99,background:t.sub}}/>)}
          </button>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${C.red},${C.blue})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>🎮</div>
            <span style={{fontFamily:"'Fredoka One',cursive",fontSize:19,color:C.red}}>NOJ Path</span>
          </div>
        </div>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:15,color:t.sub,flex:1,textAlign:"center"}}>
          {NAV_TABS.find(tab=>tab.id===page)?.label}
          {isOwner&&<span style={{marginLeft:8,fontSize:11,color:C.yellow}}>👑</span>}
        </div>
        <button onClick={()=>setDark(d=>!d)} style={{width:36,height:36,borderRadius:10,border:`1.5px solid ${t.border}`,background:t.card,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,boxShadow:t.shadowS}}>
          {dark?"☀️":"🌙"}
        </button>
      </nav>

      {/* Page */}
      <div className="noj-page-wrap" key={page} style={{position:"relative",zIndex:1,animation:"fadeSlide 0.3s ease"}}>
        {page==="roadmap"   &&<RoadmapPage    dark={dark} isOwner={isOwner} showToast={showToast} fireConfetti={fireConfetti}/>}
        {page==="resources" &&<ResourcesPage  dark={dark} isOwner={isOwner} showToast={showToast} fireConfetti={fireConfetti}/>}
        {page==="quests"    &&<SideQuestsPage dark={dark} isOwner={isOwner} showToast={showToast} fireConfetti={fireConfetti}/>}
      </div>

      {/* Scroll to top */}
      {showTop&&(
        <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{position:"fixed",bottom:isOwner?90:90,right:20,zIndex:190,width:44,height:44,borderRadius:"50%",border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.blue},${C.sky})`,color:"#fff",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 20px ${C.blue}55`,animation:"popIn 0.2s ease"}}>↑</button>
      )}

      {/* Mobile bottom nav */}
      <nav className="noj-bottom-nav">
        {NAV_TABS.map(tab=>{
          const active=page===tab.id;
          return(
            <button key={tab.id} onClick={()=>navigate(tab.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"6px 4px",borderRadius:14,border:"none",cursor:"pointer",background:active?`${C.blue}18`:"transparent",transition:"all 0.2s"}}>
              <span style={{fontSize:22,lineHeight:1}}>{tab.emoji}</span>
              <span style={{fontFamily:"'Nunito',sans-serif",fontSize:10,fontWeight:800,color:active?C.blue:t.mute}}>{tab.label}</span>
              {active&&<div style={{width:20,height:3,borderRadius:99,background:`linear-gradient(90deg,${C.blue},${C.sky})`,marginTop:1}}/>}
            </button>
          );
        })}
        <button onClick={()=>setDark(d=>!d)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"6px 4px",borderRadius:14,border:"none",cursor:"pointer",background:"transparent"}}>
          <span style={{fontSize:22,lineHeight:1}}>{dark?"☀️":"🌙"}</span>
          <span style={{fontFamily:"'Nunito',sans-serif",fontSize:10,fontWeight:800,color:t.mute}}>{dark?"Light":"Dark"}</span>
        </button>
      </nav>
    </div>
  );
}
