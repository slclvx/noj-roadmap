// Color palette and theme tokens
export const C = {
  red: "#FF5C75", orange: "#FF8C42", yellow: "#FFC844",
  green: "#3DD68C", teal: "#00C8A8", blue: "#3B8CFF",
  sky: "#5CD3FF", purple: "#9B6BFF", pink: "#FF6BB5",

  // Light theme
  bg: "#EEF1FF", bg2: "#F5F0FF", bg3: "#EEF9FF",
  card: "#FFFFFF", soft: "#F2F4FF",
  border: "rgba(140,150,240,0.12)",
  borderM: "rgba(140,150,240,0.22)",
  text: "#1A1D3A", sub: "#4A4E80", mute: "#9A9EC8",

  // Dark theme
  dBg: "#0A0D1A", dBg2: "#0D101E", dBg3: "#0B0F22",
  dCard: "#161A2C", dSoft: "#1A1F35",
  dBorder: "rgba(140,160,255,0.08)",
  dBorderM: "rgba(140,160,255,0.18)",
  dText: "#EEEEFF", dSub: "#8890C8", dMute: "#353A60",
};

export function T(dark) {
  return {
    bg: dark ? C.dBg : C.bg,
    card: dark ? C.dCard : C.card,
    soft: dark ? C.dSoft : C.soft,
    border: dark ? C.dBorder : C.border,
    borderM: dark ? C.dBorderM : C.borderM,
    text: dark ? C.dText : C.text,
    sub: dark ? C.dSub : C.sub,
    mute: dark ? C.dMute : C.mute,
    nav: dark ? "rgba(10,13,26,0.85)" : "rgba(255,255,255,0.85)",
    pill: dark ? "rgba(255,255,255,0.06)" : "rgba(120,130,240,0.07)",
    shadow: dark
      ? "0 10px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)"
      : "0 10px 40px rgba(140,150,240,0.18), 0 2px 8px rgba(120,130,255,0.08)",
    shadowS: dark
      ? "0 4px 16px rgba(0,0,0,0.4)"
      : "0 4px 16px rgba(140,150,240,0.12)",
    shadowL: dark
      ? "0 20px 60px rgba(0,0,0,0.6)"
      : "0 20px 60px rgba(140,150,240,0.25)",
    bodyBg: dark
      ? `radial-gradient(ellipse at top left, ${C.dBg2} 0%, ${C.dBg} 50%, ${C.dBg3} 100%)`
      : `radial-gradient(ellipse at top left, ${C.bg2} 0%, ${C.bg} 50%, ${C.bg3} 100%)`,
  };
}

export const STATUS_META = {
  "Not Started": { color: "#9A9EC8", bg: "rgba(154,158,200,0.12)" },
  "Locked":      { color: "#9A9EC8", bg: "rgba(154,158,200,0.18)" },
  "In Progress": { color: C.yellow,  bg: "rgba(255,200,68,0.12)" },
  "Complete":    { color: C.green,   bg: "rgba(61,214,140,0.12)" },
};

export const QUEST_STATUSES = ["Not Started", "In Progress", "Complete"];
