import { C } from "../lib/theme.js";

export const DEFAULT_QUESTS = [
  // Pinned
  { id: "sq1", emoji: "💍", title: "Marry Ariana", category: "Life", color: C.pink, pinned: true, sortAge: 0,
    description: "My most important side quest. Two months in as of April 2026 — aiming for early 20s. She deserves a proposal as thoughtful as everything else on this list.",
    status: "In Progress", startDate: "2026-02-13", targetDate: "Early 20s", liveCounter: true,
    milestones: ["Keep showing up every single day", "Build a life worth sharing", "Plan something unforgettable", "Ask the question"] },

  // Post-college
  { id: "sq19", emoji: "🏰", title: "Disney World With Friends", category: "Life", color: C.sky, sortAge: 23,
    description: "A full Disney World trip with my closest friends after college graduation. The reward for the four-year Stanford grind. Not a vacation — a celebration.",
    status: "Not Started", targetDate: "Right after Stanford graduation",
    milestones: ["Lock in the friend group throughout high school + college", "Save up so I can pay for myself + chip in if needed", "Plan it 6+ months ahead", "Park hopper passes — all four parks", "Take the cheesy group photos", "Ride Space Mountain at least three times"] },

  // Age 14-15
  { id: "sq17", emoji: "🏫", title: "Excel at ATECH", category: "Academic", color: C.green, sortAge: 14,
    description: "ATECH is the first door I have to open. My record here — GPA, AP scores, projects, leadership — is the raw material of the Stanford application. Every grade, every project, every extra thing I do here is a brick.",
    status: "Not Started", targetDate: "Age 14-18",
    milestones: ["Get accepted into ATECH's Advanced Computer Science pathway", "Maintain 4.0+ GPA every semester without exception", "Pass AP Computer Science Principles with a 5", "Pass AP Computer Science A with a 5", "Take AP Japanese Language & Culture and perform at the top of the class", "Take on a visible leadership role: officer of a club, project lead, or club founder", "Win at least one academic award or recognition at school level or above", "Graduate as one of the top students in the CS and/or Japanese track"] },
  { id: "sq15", emoji: "🌐", title: "Build My Network Early", category: "Leadership", color: C.teal, sortAge: 16,
    description: "Career is people. The earlier I start building genuine relationships, the more compounding I get over 25 years.",
    status: "Not Started", targetDate: "Age 16+",
    milestones: ["Connect with 3 people who work in gaming", "Attend a conference or event", "Get on LinkedIn with a real, thoughtful profile"] },

  // Age 17
  { id: "sq4", emoji: "🏆", title: "Win a Hackathon", category: "Tech", color: C.blue, sortAge: 17,
    description: "Not just participate — win. The competitive pressure of a hackathon is unlike anything else.",
    status: "Not Started", targetDate: "Before age 17",
    milestones: ["Enter first hackathon", "Build something in 24 hours", "Place in top 3", "Win one"] },

  // Age 18
  { id: "sq3", emoji: "🎮", title: "Ship a Real Game", category: "Tech", color: C.purple, sortAge: 18,
    description: "Iwata shipped games. I need to ship a game. Doesn't have to be big — has to be real.",
    status: "Not Started", targetDate: "Before age 18",
    milestones: ["Learn a game engine (Unity or Godot)", "Build a prototype", "Get 10 people to playtest", "Ship it publicly"] },
  { id: "sq14", emoji: "🔬", title: "Get Research Experience", category: "Academic", color: C.purple, sortAge: 18,
    description: "Stanford loves research. Even one project with a professor signals 'serious student'.",
    status: "Not Started", targetDate: "Before age 18",
    milestones: ["Find a professor or grad student doing relevant work", "Volunteer or apply to assist", "Contribute meaningfully", "Get a recommendation letter"] },
  { id: "sq16", emoji: "🎓", title: "Get Into Stanford", category: "Academic", color: C.red, sortAge: 18,
    description: "The application that determines the next 4 years. CS major. Essays revolve around the actual goal — Nintendo, Japan, building.",
    status: "Not Started", targetDate: "Senior year of high school",
    milestones: ["Build a unique application narrative", "Crush SAT/ACT", "Get strong recommendation letters", "Write essays that sound like me, not like everyone", "Apply early action"] },

  // Age 19-20
  { id: "sq7", emoji: "📱", title: "Build & Launch an App", category: "Tech", color: C.green, sortAge: 19,
    description: "A real app with real users. Not a class project — something I made because I saw a problem.",
    status: "Not Started", targetDate: "Before age 19",
    milestones: ["Identify a real problem", "Build an MVP", "Get 100 users", "Maintain and improve it"] },
  { id: "sq5", emoji: "📢", title: "Give a Public Talk", category: "Leadership", color: C.orange, sortAge: 20,
    description: "Iwata was one of the greatest communicators in the industry. I need to find my voice in public.",
    status: "Not Started", targetDate: "Before age 20",
    milestones: ["Present at school", "Speak at a local event", "Give a talk at a conference"] },
  { id: "sq18", emoji: "📚", title: "Master Nintendo's History", category: "Nintendo", color: C.red, sortAge: 20,
    description: "Know Nintendo's history better than most Nintendo employees. The hardware, the people, the inflection points, the cultural shifts.",
    status: "Not Started", targetDate: "Age 20",
    milestones: ["Read all the Nintendo books on my list", "Watch every Nintendo Direct from Iwata era", "Study every console launch — what worked, what didn't", "Understand the Yamauchi → Iwata → Furukawa lineage"] },

  // Age 22+
  { id: "sq2", emoji: "🇯🇵", title: "Pass JLPT N1", category: "Japanese", color: C.teal, sortAge: 22,
    description: "The highest level of the Japanese Language Proficiency Test. Non-negotiable before I'm a serious NOJ candidate.",
    status: "Not Started", targetDate: "Before age 22",
    milestones: ["Pass N5", "Pass N4", "Pass N3", "Pass N2", "Pass N1"] },
  { id: "sq9", emoji: "🙇", title: "Master Keigo", category: "Japanese", color: C.purple, sortAge: 22,
    description: "Honorific Japanese isn't optional at the executive level. Sonkeigo, kenjougo, teineigo — all of it, fluent.",
    status: "Not Started", targetDate: "Age 22+",
    milestones: ["Complete a keigo workbook", "Practice in real Japanese conversations", "Use it correctly in a business setting"] },
  { id: "sq11", emoji: "🍵", title: "Master Japanese Business Etiquette", category: "Japan", color: C.pink, sortAge: 22,
    description: "Bowing, business cards, drinking culture, meeting protocol, hierarchy — everything that's invisible to foreigners.",
    status: "Not Started", targetDate: "Age 22+",
    milestones: ["Read all the Japanese business culture books", "Practice with a real mentor", "Get feedback from Japanese colleagues"] },
  { id: "sq10", emoji: "📰", title: "Read Nintendo IR Reports in Japanese", category: "Japanese", color: C.blue, sortAge: 22,
    description: "Quarterly reports, shareholder Q&As, Iwata Asks — all in Japanese, fluently.",
    status: "Not Started", targetDate: "Age 22+",
    milestones: ["Read one Nintendo press release in Japanese", "Read a full earnings report", "Read shareholder Q&A in Japanese"] },

  // Age 24+
  { id: "sq8", emoji: "💼", title: "Pass BJT at J2+", category: "Japanese", color: C.orange, sortAge: 24,
    description: "Business Japanese Test at J2 level — proves I can operate in Japanese corporate environments.",
    status: "Not Started", targetDate: "Age 24+",
    milestones: ["Study business Japanese formally", "Practice with native speakers", "Pass BJT at J2 or higher"] },
  { id: "sq13", emoji: "🏢", title: "Understand Nintendo's Corporate Structure", category: "Nintendo", color: C.green, sortAge: 24,
    description: "Inside-out understanding of how Nintendo Co., Ltd. is organized — divisions, reporting lines, decision-making.",
    status: "Not Started", targetDate: "Age 24+",
    milestones: ["Map the org chart", "Understand the board structure", "Know who really makes decisions"] },

  // Age 25-30
  { id: "sq12", emoji: "🌸", title: "Live in Japan for a Year", category: "Japan", color: C.red, sortAge: 25,
    description: "Not visit. Live. Before I join NOJ I need to have actually lived in Japan — the seasons, the social rhythms, the daily culture.",
    status: "Not Started", targetDate: "Age 25-30",
    milestones: ["Visit Japan for the first time", "Complete a study or work exchange", "Live independently in Japan for 12+ months"] },
];

export const PREDECESSORS = [
  {
    name: "Satoru Iwata", role: "President & CEO of Nintendo (2002–2015)",
    emoji: "🎮", color: C.red, nationality: "🇯🇵 Japan",
    why: "The blueprint. He started as a programmer, became a leader, never stopped being a player.",
    path: [
      "Self-taught programmer at 12 on a calculator",
      "Joined HAL Laboratory as part-time student, made it full-time after college",
      "Became HAL's president at 32 to save the company from bankruptcy",
      "Joined Nintendo as head of corporate planning",
      "Promoted to president of Nintendo at 42",
    ],
    lessons: [
      "Lead from the technical side, never lose touch with the craft",
      "Take a 50% pay cut before laying off employees",
      "Tell players directly through Nintendo Direct — own the message",
      "Iwata Asks: humility and curiosity in public",
      "Stay a player. Always.",
    ],
    relevance: "Direct precedent for the kind of CEO I want to be.",
  },
  {
    name: "Reggie Fils-Aimé", role: "President of Nintendo of America (2006–2019)",
    emoji: "💪", color: C.orange, nationality: "🇺🇸 United States",
    why: "The closest real path to mine — a foreigner who became an executive at Nintendo and earned the respect of NOJ.",
    path: [
      "Cornell undergrad — Applied Economics & Business Mgmt",
      "Procter & Gamble, Pizza Hut, VH1 — built consumer marketing chops",
      "Joined NOA in 2003 as Executive VP of Sales & Marketing",
      "Famous E3 2004 'My name is Reggie' moment — became NOA's face",
      "Promoted to NOA President in 2006, served 13 years",
    ],
    lessons: [
      "Brand yourself with conviction — Reggie was unforgettable from day one",
      "Earn trust with NOJ by delivering, not by asking",
      "You don't need to be Japanese to be welcomed at Nintendo",
      "Communicate directly with fans the way Iwata did",
    ],
    relevance: "Lives in his book Disrupting the Game. Read it twice.",
  },
  {
    name: "Bill Trinen", role: "Director of Product Marketing & Localization, NOA",
    emoji: "🎤", color: C.blue, nationality: "🇺🇸 United States",
    why: "The American who became Nintendo's Japanese-to-English translator on stage, the bridge between Iwata and the Western audience.",
    path: [
      "Studied Japanese in college, lived in Japan",
      "Joined Nintendo in localization",
      "Became Iwata's on-stage translator and Miyamoto's voice in English",
      "Now leads major product marketing across multiple Nintendo franchises",
    ],
    lessons: [
      "Japanese fluency is the unlock that opens every door",
      "Becoming the bridge between cultures is its own job",
      "You can build a legendary career inside Nintendo without ever being CEO",
      "Years in role > rapid title changes",
    ],
    relevance: "My short-term path looks more like Bill's than Reggie's.",
  },
  {
    name: "Howard Lincoln", role: "Chairman of Nintendo of America (1994–2000)",
    emoji: "⚖️", color: C.purple, nationality: "🇺🇸 United States",
    why: "An American chairman of NOA — the original proof a non-Japanese person could lead the American arm.",
    path: [
      "UC Berkeley + Boalt Hall law school",
      "Joined Nintendo as outside counsel, then SVP",
      "Defended Nintendo through Universal Studios v. Nintendo (1984) — saved Donkey Kong",
      "Promoted to NOA Chairman, served until 2000",
    ],
    lessons: [
      "Sometimes the highest-leverage role isn't the most visible one",
      "Legal and business expertise can be more valuable than charisma",
      "Long tenure builds trust the way nothing else does",
    ],
    relevance: "Historical reminder that NOA leadership has been American before.",
  },
  {
    name: "Doug Bowser", role: "Current President of Nintendo of America",
    emoji: "🎯", color: C.green, nationality: "🇺🇸 United States",
    why: "The current example. American, came from EA, succeeded Reggie.",
    path: [
      "20+ years at PepsiCo and Procter & Gamble",
      "Senior leadership at Electronic Arts",
      "Joined NOA in 2015 as VP of Sales",
      "Promoted to President in 2019 when Reggie retired",
    ],
    lessons: [
      "Industry-adjacent experience can be valuable",
      "Don't underestimate the consumer goods playbook",
      "Smooth handoff from a beloved predecessor is its own art",
    ],
    relevance: "Proof the NOA path is still open.",
  },
  {
    name: "Hideo Kojima", role: "Founder of Kojima Productions",
    emoji: "🎬", color: C.pink, nationality: "🇯🇵 Japan",
    why: "Different path — Japanese creative auteur — but his independence and obsession with craft are what I want to absorb.",
    path: [
      "Joined Konami in 1986 — wanted to make movies, made games instead",
      "Created the Metal Gear series",
      "Built one of the most distinct creative voices in the industry",
      "Left Konami in 2015 to found Kojima Productions",
    ],
    lessons: [
      "Creative conviction is non-negotiable — your work has to look like you",
      "You can leave a corporate giant and survive if your brand is bigger",
      "Cinema, music, food, science — feed creative work with everything else",
      "Don't be afraid of being weird if the weirdness is yours",
    ],
    relevance: "Reminder that there's more than one way to win in the Japanese game industry.",
  },
];

export const QUOTES = [
  { text: "On my business card I am a corporate president. In my mind I am a game developer. But in my heart I am a gamer.", author: "Satoru Iwata", color: C.red },
  { text: "The opposite of fun is not seriousness. The opposite of fun is boredom.", author: "Satoru Iwata", color: C.red },
  { text: "A delayed game is eventually good, but a rushed game is forever bad.", author: "Shigeru Miyamoto", color: C.green },
  { text: "Video games are bad for you? That's what they said about rock and roll.", author: "Shigeru Miyamoto", color: C.green },
  { text: "You should never make decisions out of fear.", author: "Satoru Iwata", color: C.red },
  { text: "Above all, video games are meant to be just one thing: fun for everyone.", author: "Satoru Iwata", color: C.red },
  { text: "It's the things we don't expect that make life worth living.", author: "Satoru Iwata", color: C.red },
  { text: "Whatever you do — do it with passion. If you don't love what you do, you'll never be great at it.", author: "Reggie Fils-Aimé", color: C.orange },
  { text: "My name is Reggie. I'm about kicking ass, I'm about taking names, and we're about making games.", author: "Reggie Fils-Aimé", color: C.orange },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", color: C.blue },
  { text: "Don't break the chain.", author: "Jerry Seinfeld", color: C.yellow },
  { text: "You can do anything, but not everything.", author: "David Allen", color: C.purple },
  { text: "Compound interest is the eighth wonder of the world.", author: "Albert Einstein (probably)", color: C.teal },
  { text: "Most people overestimate what they can do in a year and underestimate what they can do in a decade.", author: "Bill Gates", color: C.sky },
  { text: "The 14-year-old who made the list deserves to see it through.", author: "Sebastian Lozano", color: C.pink },
];

export const HIRAGANA = [
  ["あ","a","vowels"],["い","i","vowels"],["う","u","vowels"],["え","e","vowels"],["お","o","vowels"],
  ["か","ka","k"],["き","ki","k"],["く","ku","k"],["け","ke","k"],["こ","ko","k"],
  ["さ","sa","s"],["し","shi","s"],["す","su","s"],["せ","se","s"],["そ","so","s"],
  ["た","ta","t"],["ち","chi","t"],["つ","tsu","t"],["て","te","t"],["と","to","t"],
  ["な","na","n"],["に","ni","n"],["ぬ","nu","n"],["ね","ne","n"],["の","no","n"],
  ["は","ha","h"],["ひ","hi","h"],["ふ","fu","h"],["へ","he","h"],["ほ","ho","h"],
  ["ま","ma","m"],["み","mi","m"],["む","mu","m"],["め","me","m"],["も","mo","m"],
  ["や","ya","y"],["ゆ","yu","y"],["よ","yo","y"],
  ["ら","ra","r"],["り","ri","r"],["る","ru","r"],["れ","re","r"],["ろ","ro","r"],
  ["わ","wa","w"],["を","wo","w"],["ん","n","w"],
];
