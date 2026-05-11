import { useState, useEffect } from "react";
import { C } from "../lib/theme.js";
import { playSound } from "../lib/utils.js";

export default function SplashScreen({ onDone }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Play startup chord
    playSound("startup");
    const timers = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 800),
      setTimeout(() => setStage(3), 1400),
      setTimeout(() => setStage(4), 2400),
      setTimeout(() => onDone(), 2900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      onClick={onDone}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: `radial-gradient(ellipse at center, ${C.purple} 0%, ${C.red} 40%, ${C.dBg} 110%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer",
        opacity: stage >= 4 ? 0 : 1,
        transition: "opacity 0.5s ease",
        overflow: "hidden",
      }}
    >
      {/* Animated stars */}
      {Array.from({ length: 18 }).map((_, i) => {
        const emojis = ["⭐", "✨", "💫", "🌟", "✦", "✧"];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${10 + (i * 11) % 80}%`,
              left: `${5 + (i * 19) % 90}%`,
              fontSize: `${16 + (i % 4) * 8}px`,
              opacity: stage >= 1 ? 0.6 : 0,
              transition: `opacity 0.6s ease ${i * 0.06}s`,
              animation: stage >= 1 ? `floatDot ${3 + (i % 3)}s ease-in-out infinite` : "none",
              animationDelay: `${i * 0.2}s`,
              pointerEvents: "none",
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
            }}
          >
            {emojis[i % emojis.length]}
          </div>
        );
      })}

      {/* Pulsing ring behind logo */}
      <div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: `3px solid rgba(255,255,255,0.3)`,
          opacity: stage >= 1 && stage < 4 ? 1 : 0,
          transition: "opacity 0.4s",
          animation: "pulseRing 2s ease-in-out infinite",
        }}
      />

      {/* Main logo */}
      <div
        style={{
          fontSize: 96,
          marginBottom: 18,
          transform:
            stage === 0
              ? "scale(0.2) rotate(-180deg)"
              : stage >= 1
              ? "scale(1) rotate(0deg)"
              : "scale(0.7)",
          opacity: stage === 0 ? 0 : 1,
          transition: "transform 0.85s cubic-bezier(0.34,1.6,0.64,1), opacity 0.5s",
          filter: `drop-shadow(0 14px 32px rgba(0,0,0,0.5))`,
          zIndex: 1,
        }}
      >
        🎮
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "'Fredoka One',cursive",
          fontSize: "clamp(40px,9vw,72px)",
          color: "#fff",
          opacity: stage >= 2 ? 1 : 0,
          transform: stage >= 2 ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          transition: "all 0.7s cubic-bezier(0.34,1.4,0.64,1)",
          textShadow: "0 4px 24px rgba(0,0,0,0.5)",
          letterSpacing: 1,
          marginBottom: 10,
          textAlign: "center",
          zIndex: 1,
        }}
      >
        NOJ Path
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontFamily: "'Nunito',sans-serif",
          fontSize: 13,
          color: "rgba(255,255,255,0.9)",
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.5s cubic-bezier(0.34,1.2,0.64,1)",
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
          textAlign: "center",
          textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          zIndex: 1,
        }}
      >
        the road to nintendo
      </div>

      {/* Skip hint */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(36px + env(safe-area-inset-bottom))",
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 10,
          color: "rgba(255,255,255,0.5)",
          opacity: stage >= 2 ? 1 : 0,
          transition: "opacity 0.4s",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        tap to skip
      </div>
    </div>
  );
}
