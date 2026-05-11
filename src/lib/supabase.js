// Supabase configuration — replace these with your real values
export const SB_URL = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
export const SB_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

export const sb = {
  async fetch(path, opts = {}, token = null) {
    if (SB_URL.startsWith("YOUR_")) return null;
    try {
      const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
        headers: {
          apikey: SB_ANON,
          Authorization: `Bearer ${token || SB_ANON}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
          ...opts.headers,
        },
        ...opts,
      });
      if (!res.ok) return null;
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  },

  async upsert(key, value) {
    return this.fetch("owner_state", {
      method: "POST",
      body: JSON.stringify({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() }),
      headers: { Prefer: "resolution=merge-duplicates" },
    });
  },

  async load(key) {
    const data = await this.fetch(`owner_state?key=eq.${key}`);
    if (data?.[0]?.value) {
      try {
        return { value: JSON.parse(data[0].value), updatedAt: data[0].updated_at };
      } catch {
        return null;
      }
    }
    return null;
  },
};
