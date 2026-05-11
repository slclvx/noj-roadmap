import { useState, useEffect, useRef, useCallback } from "react";
import { sb } from "../lib/supabase.js";
import { LS } from "../lib/utils.js";

// State that auto-syncs to Supabase + cache to localStorage
export function useLiveState(key, defaultValue, isOwner) {
  const cacheKey = `supabase_cache_${key}`;
  const [state, setState] = useState(() => LS.get(cacheKey, defaultValue));
  const [updatedAt, setUpdatedAt] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const saveTimeoutRef = useRef(null);

  // Initial load from Supabase
  useEffect(() => {
    let mounted = true;
    sb.load(key).then((res) => {
      if (mounted && res) {
        setState(res.value);
        setUpdatedAt(res.updatedAt);
        LS.set(cacheKey, res.value);
      }
    });

    // Poll for updates (visitors see owner's changes)
    const interval = setInterval(async () => {
      const res = await sb.load(key);
      if (mounted && res && res.updatedAt !== updatedAt) {
        setState(res.value);
        setUpdatedAt(res.updatedAt);
        LS.set(cacheKey, res.value);
      }
    }, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [key]);

  const save = useCallback(
    (newValue) => {
      setState(newValue);
      LS.set(cacheKey, newValue);
      if (!isOwner) return;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      setSyncing(true);
      saveTimeoutRef.current = setTimeout(async () => {
        await sb.upsert(key, newValue);
        setSyncing(false);
        setUpdatedAt(new Date().toISOString());
      }, 400);
    },
    [key, isOwner]
  );

  return { state, save, updatedAt, syncing };
}
