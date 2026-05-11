// Local storage with safe parsing
export const LS = {
  get: (k, fb) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : fb;
    } catch {
      return fb;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
  remove: (k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  },
};

// Haptic feedback wrapper
export function haptic(pattern = 15) {
  if (!LS.get("noj_haptics_enabled", true)) return;
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {}
}

// Sound system — Web Audio API tones
let _ctx = null;
const getCtx = () => {
  if (!_ctx) {
    try {
      _ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {}
  }
  return _ctx;
};

const SOUND_DEFS = {
  // [freq, duration_ms, type, volume]
  check:    [880, 80, "sine", 0.12],
  uncheck:  [440, 60, "sine", 0.08],
  click:    [600, 30, "square", 0.05],
  navigate: [700, 40, "sine", 0.05],
  error:    [220, 150, "sawtooth", 0.08],
  hover:    [1000, 20, "sine", 0.03],
  // Chord arpeggios: [array of freqs, total duration, type, volume]
  complete: [[523, 659, 784], 280, "sine", 0.15],
  unlock:   [[392, 523, 659, 784], 380, "sine", 0.15],
  level_up: [[523, 659, 784, 1047], 480, "triangle", 0.15],
  startup:  [[392, 494, 587, 784, 1047], 800, "triangle", 0.15],
  achievement: [[659, 784, 988, 1319], 500, "sine", 0.16],
};

export function playSound(name) {
  if (!LS.get("noj_sound_enabled", true)) return;
  const ctx = getCtx();
  if (!ctx) return;
  // Resume context if suspended (iOS)
  if (ctx.state === "suspended") ctx.resume();

  const def = SOUND_DEFS[name];
  if (!def) return;
  const [freq, dur, type, vol] = def;

  if (Array.isArray(freq)) {
    freq.forEach((f, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = f;
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur / freq.length / 1000);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur / freq.length / 1000);
      }, i * (dur / freq.length));
    });
  } else {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur / 1000);
  }
}

// Combined feedback — sound + haptic
export function feedback(soundName, hapticPattern) {
  playSound(soundName);
  haptic(hapticPattern);
}

// Notifications
export const notify = (title, body, options = {}) => {
  if (!("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;
  try {
    const opts = {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [100, 40, 100],
      tag: options.tag || "noj-default",
      ...options,
    };
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => reg.showNotification(title, opts));
    } else {
      new Notification(title, opts);
    }
    return true;
  } catch {
    return false;
  }
};
