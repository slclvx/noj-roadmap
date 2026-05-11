import { useEffect } from "react";
import { LS, notify } from "../lib/utils.js";

export function useReminders(isOwner) {
  useEffect(() => {
    if (!isOwner) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const checkReminders = () => {
      const now = new Date();
      const todayKey = now.toISOString().slice(0, 10);
      const lastCheck = LS.get("noj_reminder_last", "");
      if (lastCheck === todayKey) return;

      const streaks = LS.get("supabase_cache_streak_board", null);
      if (now.getHours() >= 18 && streaks) {
        let fired = false;
        Object.entries(streaks).forEach(([k, s]) => {
          if (s && s.lastDay !== todayKey && s.count > 0) {
            notify(`🔥 Don't break your ${k} streak!`, `You're ${s.count} days in. One quick check-in keeps it alive.`, { tag: `streak-${k}` });
            fired = true;
          }
        });
        if (fired) LS.set("noj_reminder_last", todayKey);
      }

      if (now.getDay() === 0 && now.getHours() >= 10 && now.getHours() < 22) {
        notify("📋 Sunday Review", "Time for this week's review.", { tag: "weekly" });
        LS.set("noj_reminder_last", todayKey);
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isOwner]);
}
