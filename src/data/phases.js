import { C } from "../lib/theme.js";

export const PHASES = [
  {
    id: 0, num: "00", emoji: "🌰", label: "PHASE 0", title: "PRE-ROOTS",
    age: "13–14", where: "Las Vegas — Middle School", accent: C.mute,
    tagline: "Before anyone called this a plan, the seed was already in the ground.",
    summary:
      "This is the year I figured out what I wanted to do with my life. Most people don't have a goal at 14 — I do. This phase isn't on the public roadmap because nothing dramatic happened here. But everything that comes next started because of decisions I made in this year.",
    milestones: [
      "Realized I wanted to work at Nintendo — specifically, lead Nintendo",
      "Discovered Satoru Iwata and what kind of leader I wanted to be",
      "Applied to ATECH for high school",
      "Started thinking about Japanese seriously, not just as a hobby",
      "Built this roadmap — the document you're reading right now",
      "Started learning hiragana via Tofugu",
    ],
    actions: [
      "Watch every Iwata Asks I can find",
      "Watch every Nintendo Direct from the Iwata era",
      "Read about Reggie, Miyamoto, Sakurai — the Nintendo cast",
      "Talk to Ariana about all of this — the people you love should know your plan",
      "Tell my parents the actual goal, not a softer version",
    ],
    build_toward: "Clarity. The plan exists. Everything from here is execution.",
    iwata_note:
      "Iwata didn't decide to lead Nintendo at 14. But he did decide at some point that he was going to build games, and from there everything compounded.",
    honest:
      "Most 14-year-olds with a 'goal' don't actually have one — they have a fantasy. The difference is writing it down and starting to work on it. I did that. That's the only reason this list exists.",
    failure_modes: [
      "Treating this as a phase to skip past — it's the foundation of everything",
      "Keeping the plan secret and never telling anyone",
      "Letting the size of the plan scare me into doing nothing",
    ],
  },
  {
    id: 1, num: "01", emoji: "🌱", label: "PHASE 1", title: "ROOTS",
    age: "14–15", where: "Las Vegas → ATECH High School", accent: C.green,
    tagline: "Become someone worth following before anyone is watching.",
    summary:
      "This is my foundation year. Nothing flashy happens here — but everything depends on it. I'm building the internal architecture that the rest of my life runs on.",
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
    failure_modes: [
      "Letting Japanese slide for a week, then a month, then giving up",
      "Treating coding like homework instead of practice",
      "Trying to do too much instead of doing one thing every day",
      "Hiding the goal because it sounds too big to say out loud",
    ],
  },
  {
    id: 2, num: "02", emoji: "⚙️", label: "PHASE 2", title: "CONSTRUCTION",
    age: "15–17", where: "ATECH — Deep", accent: C.sky,
    tagline: "Build things. Break things. Understand things.",
    summary:
      "ATECH is my first real arena. This is where I stop being someone who wants to code and become someone who does. I'm stacking reps — Japanese, programming, creative thinking.",
    milestones: [
      "Complete Genki II — no shortcuts, no skipping grammar",
      "Build at least 3 real projects and put them on GitHub",
      "Take on a leadership role at school — club, group, anything",
      "Read deeply into Nintendo's history and internal culture",
      "Get my first programming win that genuinely impresses someone",
    ],
    actions: [
      "Start consuming Japanese media without subtitles — even 10 min/day",
      "Enter at least one CS competition or hackathon",
      "Study Iwata's GDC talks and Nintendo Directs — analyze his communication style",
      "Read Game Over like a business case study, not entertainment",
    ],
    build_toward: "A portfolio of real work. The beginning of a reputation, even locally. Proof I can lead something small.",
    iwata_note: "At HAL, Iwata was the person people went to when something was impossible. Not because he had the title — because he had the results.",
    honest: "ATECH is my springboard to Stanford, but only if I treat it that way. I do more than is required. Always.",
    failure_modes: [
      "Settling for the minimum at ATECH because I'm already ahead of peers",
      "Building 'projects' that are really tutorials with my name on them",
      "Not putting work on GitHub because it isn't perfect — perfect is the enemy of evidence",
      "Failing to lead anything because leadership feels uncomfortable at this age",
    ],
  },
  {
    id: 3, num: "03", emoji: "🎓", label: "PHASE 3", title: "STANFORD",
    age: "18–22", where: "Stanford University", accent: C.red,
    tagline: "CS undergrad → CS + MBA joint degree. Four years that reshape how I think.",
    summary:
      "Stanford is not just a degree — it's a network, a credibility marker, and a place where I'll meet the people who shape the industry I want to lead.",
    milestones: [
      "Get into Stanford CS — my application revolves around Nintendo, Japan, and building",
      "Begin working toward the CS + MBA joint program early",
      "Achieve N2 Japanese by sophomore year — N1 before graduation",
      "Complete at least 2 Apple internships (aiming for 3)",
      "Build one project that gets real users or real attention",
      "Graduate with both CS and MBA components complete",
    ],
    actions: [
      "Take every course that touches product, design, and human behavior",
      "Join Stanford's Japanese language and culture community",
      "Study business Japanese alongside academic Japanese",
      "Network intentionally — people connected to Nintendo, Sony, the game industry",
      "Write. Publish things. Build a voice.",
    ],
    build_toward: "A degree that signals elite technical AND business capability. Japanese at near-professional level. A network that opens doors.",
    iwata_note: "Iwata became president of Nintendo not because he climbed a ladder — because he solved problems nobody else could, and did it with integrity.",
    honest: "The CS + MBA joint is hard to get into — I talk to the program office early, not late. Apple internships don't just happen. I need to be exceptional.",
    failure_modes: [
      "Not getting into Stanford at all — backup is a strong CS school + a real CS job, then re-evaluate",
      "Getting in but not getting MBA acceptance — pivot to MS in CS or pursue MBA later",
      "Burning out chasing prestige instead of mastery",
      "Letting Japanese plateau because school feels more urgent",
    ],
  },
  {
    id: 4, num: "04", emoji: "🍎", label: "PHASE 4", title: "APPLE",
    age: "20–24", where: "Apple — Cupertino", accent: C.purple,
    tagline: "Learn what world-class product culture feels like from the inside.",
    summary: "Apple is one of the few companies that matches Nintendo in product obsession and design philosophy. This is my finishing school before the game industry.",
    milestones: [
      "Convert internships into a full-time offer post-graduation",
      "Work in a role touching product, platform, or developer experience",
      "Interface with cross-functional teams",
      "Build a reputation as someone who improves whatever room I'm in",
      "Hit Japanese fluency that lets me run full meetings without strain",
    ],
    actions: [
      "Study Apple's internal review process — the attention to detail is the lesson",
      "Observe how senior leaders communicate: precision, conviction, simplicity",
      "Continue keigo and business Japanese — executive-level register now",
      "Build relationships with anyone connected to Japan, gaming, or consumer hardware",
    ],
    build_toward: "Real industry credibility. Executive communication skills. A résumé that makes Nintendo of America pay attention.",
    iwata_note: "Iwata once said he didn't want to be a manager — he wanted to be a creator who happened to manage.",
    honest: "I don't stay at Apple longer than I need to. 2–3 years post-grad is enough. The goal is NOA, not Apple lifer.",
    failure_modes: [
      "No Apple offer post-internship — pivot to Google, Microsoft Xbox, or a top games studio",
      "Getting comfortable in Apple money and forgetting the actual mission",
      "Underestimating how long the NOA transition actually takes",
    ],
  },
  {
    id: 5, num: "05", emoji: "🎮", label: "PHASE 5", title: "NINTENDO OF AMERICA",
    age: "24–30", where: "Nintendo of America — Redmond, WA", accent: C.orange,
    tagline: "Get inside the company. Learn how it breathes. Make myself impossible to ignore.",
    summary: "This is the most critical phase. Getting to NOA is one thing. What I do inside it determines whether I ever get the call from Japan.",
    milestones: [
      "Land a senior role at NOA — product, platform, or business development",
      "Within 2 years, become known for understanding both the technical AND cultural side",
      "Complete at least one project with direct NOJ collaboration",
      "Get a sponsor — a senior person who actively advocates for me",
      "Begin traveling to Japan regularly on Nintendo business",
      "Demonstrate Japanese fluency in professional settings with NOJ counterparts",
    ],
    actions: [
      "Learn Nintendo's internal decision-making — nemawashi, ringi, consensus culture",
      "Be patient. Japanese corporate culture rewards long-term trust.",
      "Do work so good that people can't stop noticing",
      "Build genuine relationships with NOJ counterparts — not networking, real relationships",
    ],
    build_toward: "A reputation inside Nintendo that crosses the Pacific. The trust of Japanese colleagues. An invitation to Japan.",
    iwata_note: "Iwata built trust through decades of doing exactly what he said he would do, exactly when he said he would do it.",
    honest: "This phase might take longer than I expect. That's okay. The people who make it stayed consistent for 10 years, not the ones who pushed hardest for 2.",
    failure_modes: [
      "Hitting a ceiling at NOA — pivot to a senior role at PlayStation, Xbox, or a Japanese studio",
      "Never being invited to Japan — focus on building independent reputation",
      "Cultural friction with NOJ counterparts that I can't smooth over",
    ],
  },
  {
    id: 6, num: "06", emoji: "🗾", label: "PHASE 6", title: "NINTENDO OF JAPAN",
    age: "30–38", where: "Kyoto, Japan — Nintendo HQ", accent: C.pink,
    tagline: "I'm no longer visiting. I'm here.",
    summary: "The transition to Japan is the hardest and most important move of my career. My language, cultural fluency, technical depth, and track record all have to be unimpeachable.",
    milestones: [
      "Secure a formal transfer or senior appointment at NOJ",
      "Operate fully in Japanese — all meetings, all documents, all relationships",
      "Lead a product or platform initiative touching the global business",
      "Build trust with the Nintendo board and senior leadership in Kyoto",
      "Be recognized as someone who thinks like Nintendo, not just works at Nintendo",
      "Position myself for executive appointment — Managing Director, then higher",
    ],
    actions: [
      "Absorb everything. Observe how decisions are made at HQ level.",
      "Master the social fabric — who defers to whom, who the real influencers are",
      "Contribute to creative direction — not just business execution",
      "Become the person who bridges East and West — the one both sides trust equally",
    ],
    build_toward: "Executive appointment. The trust of the Kyoto inner circle. A reputation as someone who makes Nintendo more Nintendo, not less.",
    iwata_note: "Iwata took a 50% pay cut before laying off a single employee. That act alone defined his leadership more than any product launch.",
    honest: "I will be tested here in ways I cannot fully prepare for. The question is whether I've built enough trust and love for this company that the foreignness stops mattering.",
    failure_modes: [
      "Cultural rejection — being technically capable but not 'one of us' enough",
      "Family or personal reasons that pull me back to the US",
      "Burning out at 35 from 20 years of grinding — protect health and Ariana relentlessly",
    ],
  },
  {
    id: 7, num: "07", emoji: "👑", label: "PHASE 7", title: "CEO",
    age: "38–50+", where: "Nintendo of Japan — The Chair", accent: C.yellow,
    tagline: "I didn't just get here. I earned here.",
    summary: "This is the destination — but not the point. The point was always to build something worth leading. My job is to carry Nintendo's soul forward while opening it to the world.",
    milestones: [
      "Appointment as CEO / Representative Director of Nintendo Co., Ltd.",
      "First Nintendo Direct as CEO — set the tone for my era",
      "Define my philosophy publicly, the way Iwata defined his",
      "Build a team that reflects Nintendo's values and a global future",
      "Make a decision that is hard and right — the moment that defines my leadership",
    ],
    actions: [
      "Lead with fun. Iwata: 'The opposite of fun is not serious — it's boring.'",
      "Be a player first. Never let the business make me forget why any of this matters.",
      "Communicate directly with fans — Nintendo's audience is its most important asset",
      "Make Nintendo more Nintendo, not more like everyone else",
    ],
    build_toward: "A legacy. Not a résumé.",
    iwata_note: "On my business card I am a corporate president. In my mind I am a game developer. But in my heart I am a gamer.",
    honest: "I will have made it. I won't forget the 14-year-old who made the list.",
    failure_modes: [
      "Letting the role change me — Iwata stayed Iwata. I stay Sebastian.",
      "Forgetting the player. The minute I stop being a gamer, I stop being effective.",
      "Making safe decisions because I don't want to lose the role",
      "Not training a successor — the goal isn't to be CEO forever, it's to leave Nintendo stronger",
    ],
  },
];

// Phase progress helpers
export function isPhaseComplete(phase, checks, actionChecks) {
  if (!phase) return false;
  const milestonesDone = phase.milestones.every((_, i) => checks[`${phase.id}-${i}`]);
  const actionsDone = (phase.actions || []).every((_, i) => actionChecks[`${phase.id}-a${i}`]);
  return milestonesDone && actionsDone;
}

export function isPhaseInProgress(phase, checks, actionChecks) {
  if (!phase || isPhaseComplete(phase, checks, actionChecks)) return false;
  const anyMilestone = phase.milestones.some((_, i) => checks[`${phase.id}-${i}`]);
  const anyAction = (phase.actions || []).some((_, i) => actionChecks[`${phase.id}-a${i}`]);
  return anyMilestone || anyAction;
}

export function getCurrentPhaseId(checks, actionChecks) {
  const inProgress = PHASES.find((p) => isPhaseInProgress(p, checks, actionChecks));
  if (inProgress) return inProgress.id;
  const next = PHASES.find((p) => !isPhaseComplete(p, checks, actionChecks));
  return next ? next.id : PHASES[PHASES.length - 1].id;
}

export function isPhaseLocked(phase, checks, actionChecks) {
  if (!phase) return false;
  const idx = PHASES.findIndex((p) => p.id === phase.id);
  if (idx <= 0) return false;
  const prev = PHASES[idx - 1];
  return !isPhaseComplete(prev, checks, actionChecks);
}
