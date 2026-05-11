import { useState } from "react";
import { C, T, STATUS_META } from "../lib/theme.js";
import { TYPE_META } from "../data/books.js";

// Card with hover, gradient border, soft shadow
export function Card({ children, style = {}, accent, dark, onClick, noHover }) {
  const t = T(dark);
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => !noHover && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: t.card,
        borderRadius: 24,
        border: `2.5px solid ${
          hov && accent ? accent : dark ? "rgba(140,160,255,0.08)" : "rgba(255,255,255,0.9)"
        }`,
        boxShadow: hov
          ? `0 16px 44px ${(accent || C.blue) + "28"}, 0 4px 12px rgba(0,0,0,0.06)`
          : dark
          ? "0 8px 28px rgba(0,0,0,0.42), 0 2px 6px rgba(0,0,0,0.3)"
          : "0 8px 28px rgba(140,150,240,0.14), 0 2px 6px rgba(120,130,255,0.06)",
        transition: "all 0.28s cubic-bezier(0.34,1.2,0.64,1)",
        transform: hov && onClick ? "translateY(-3px)" : "none",
        cursor: onClick ? "pointer" : "default",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Pill button (filter chip)
export function Pill({ label, active, color, onClick, dark, small }) {
  const t = T(dark);
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Nunito',sans-serif",
        fontSize: small ? 11 : 12,
        fontWeight: 800,
        padding: small ? "5px 12px" : "7px 16px",
        borderRadius: 99,
        border: "none",
        cursor: "pointer",
        background: active ? `linear-gradient(135deg,${color},${color}cc)` : t.pill,
        color: active ? "#fff" : t.sub,
        boxShadow: active ? `0 3px 14px ${color}44` : "none",
        transition: "all 0.2s cubic-bezier(0.34,1.2,0.64,1)",
        transform: active ? "scale(1.04)" : "scale(1)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

// Stat card with gradient
export function StatCard({ value, label, color, dark, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "16px 20px",
        borderRadius: 22,
        textAlign: "center",
        background: dark
          ? `linear-gradient(145deg,${color}20,${color}0a)`
          : `linear-gradient(145deg,#fff,${color}0e)`,
        border: `2.5px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)"}`,
        boxShadow: `0 8px 24px ${color}22`,
        minWidth: 90,
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s",
      }}
    >
      <div
        style={{
          fontFamily: "'Fredoka One',cursive",
          fontSize: 30,
          color,
          lineHeight: 1,
          textShadow: `0 2px 8px ${color}33`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 9,
          color: T(dark).mute,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginTop: 5,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
    </div>
  );
}

// Progress bar
export function ProgressBar({ value, total, color, dark, height = 8 }) {
  const pct = total ? Math.min(100, (value / total) * 100) : 0;
  const t = T(dark);
  return (
    <div style={{ height, borderRadius: 99, background: t.soft, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg,${color},${color}cc)`,
          borderRadius: 99,
          transition: "width 0.6s cubic-bezier(0.34,1.2,0.64,1)",
          boxShadow: pct > 0 ? `0 0 10px ${color}55` : "none",
        }}
      />
    </div>
  );
}

// Type badge
export function TypeBadge({ type, dark }) {
  const m = TYPE_META[type] || TYPE_META["💻 Tech"];
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 9,
        fontWeight: 700,
        padding: "3px 9px",
        borderRadius: 99,
        background: dark ? m.dBg : m.lBg,
        color: dark ? m.dTx : m.lTx,
        whiteSpace: "nowrap",
      }}
    >
      {type}
    </span>
  );
}

// Level badge for JLPT
export function LevelBadge({ level, dark }) {
  if (!level) return null;
  const colors = {
    "Pre-N5": C.mute, "N5": C.green, "N4": C.teal, "N3": C.orange, "N2": C.red, "N1": C.purple,
    "N5-N4": C.teal, "N5→N3": C.orange, "N3→N2": C.red, "N5→N1": C.purple, "N3-N2": C.orange, "N4-N3": C.teal, "Ref": C.mute,
  };
  const col = colors[level] || C.blue;
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 9,
        fontWeight: 800,
        padding: "3px 9px",
        borderRadius: 99,
        background: dark ? `${col}22` : `${col}14`,
        color: col,
        border: `1.5px solid ${col}55`,
        whiteSpace: "nowrap",
        letterSpacing: 0.5,
      }}
    >
      JLPT {level}
    </span>
  );
}

export function NewBadge() {
  return (
    <span
      style={{
        fontFamily: "'Nunito',sans-serif",
        fontSize: 9,
        fontWeight: 900,
        padding: "2px 9px",
        borderRadius: 99,
        background: "linear-gradient(135deg,#FFB800,#FF7828)",
        color: "#fff",
        boxShadow: "0 2px 6px rgba(255,120,0,0.4)",
      }}
    >
      ✦ NEW
    </span>
  );
}

// Animated checkbox
export function Check({ done, accent, disabled, onClick, size = 26 }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        flexShrink: 0,
        marginTop: 2,
        cursor: disabled ? "default" : "pointer",
        outline: "none",
        border: `2.5px solid ${done ? accent : "rgba(140,150,240,0.3)"}`,
        background: done ? `linear-gradient(135deg,${accent},${accent}cc)` : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: done ? `0 2px 10px ${accent}55` : "none",
        transform: done ? "scale(1.05)" : "scale(1)",
      }}
    >
      {done && <span style={{ color: "#fff", fontWeight: 900, fontSize: size * 0.5 }}>✓</span>}
    </button>
  );
}

// Toast container
export function Toast({ toasts, dark }) {
  const t = T(dark);
  return (
    <div
      style={{
        position: "fixed",
        bottom: "calc(80px + env(safe-area-inset-bottom))",
        right: 12,
        left: 12,
        zIndex: 800,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
        alignItems: "center",
      }}
    >
      {toasts.map((toast) => {
        const colors = {
          success: { bg: `linear-gradient(135deg,${C.green},${C.teal})`, color: "#fff" },
          info: { bg: `linear-gradient(135deg,${C.blue},${C.sky})`, color: "#fff" },
          error: { bg: `linear-gradient(135deg,${C.red},${C.pink})`, color: "#fff" },
        };
        const cfg = colors[toast.type] || colors.info;
        return (
          <div
            key={toast.id}
            style={{
              padding: "11px 18px",
              borderRadius: 14,
              background: cfg.bg,
              color: cfg.color,
              fontFamily: "'Nunito',sans-serif",
              fontSize: 13,
              fontWeight: 800,
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              animation: "slideInUp 0.3s cubic-bezier(0.34,1.2,0.64,1)",
              maxWidth: 360,
              textAlign: "center",
            }}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}

// Confetti
export function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    color: [C.red, C.orange, C.yellow, C.green, C.teal, C.blue, C.purple, C.pink][i % 8],
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1.5,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9000, overflow: "hidden" }}>
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            width: 10,
            height: 14,
            background: p.color,
            borderRadius: 2,
            animation: `confettiDrop ${p.duration}s linear forwards`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
