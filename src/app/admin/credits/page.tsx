"use client";
import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CreditSetting {
  id: number;
  key: string;
  label: string;
  category: string;
  credits: number;
  enabled: boolean;
  description: string | null;
  updated_at: string;
}

type RowState = {
  credits: number;
  enabled: boolean;
  description: string;
  saving: boolean;
  saved: boolean;       // show ✓ briefly after save
  error: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  ai:       "AI Features",
  download: "Downloads",
  model:    "3D Models",
  future:   "Future",
};

const CATEGORY_COLORS: Record<string, string> = {
  ai:       "#4A9EFF",
  download: "#10B981",
  model:    "#8B5CF6",
  future:   "#D4A73D",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

// ─── Admin secret input ───────────────────────────────────────────────────────
// NOTE: In production, replace this with a proper Supabase JWT session check.
// The admin secret is entered once per session and stored in component state only.
// It is sent as a request header, never stored in localStorage or cookies.

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminCreditsPage() {
  const [secret,   setSecret]   = useState("");
  const [authed,   setAuthed]   = useState(false);
  const [authErr,  setAuthErr]  = useState("");
  const [settings, setSettings] = useState<CreditSetting[]>([]);
  const [rows,     setRows]     = useState<Record<number, RowState>>({});
  const [loading,  setLoading]  = useState(false);
  const [fetchErr, setFetchErr] = useState("");

  // ── Fetch all settings from internal API ──────────────────
  const fetchSettings = useCallback(async (adminSecret: string) => {
    setLoading(true);
    setFetchErr("");
    try {
      const res = await fetch("/api/admin/credit-settings", {
        headers: { "x-admin-secret": adminSecret },
      });
      if (res.status === 401) {
        setAuthed(false);
        setAuthErr("Incorrect admin secret.");
        return;
      }
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      const data: CreditSetting[] = json.data ?? [];
      setSettings(data);
      // Initialise editable row state
      const initial: Record<number, RowState> = {};
      data.forEach(s => {
        initial[s.id] = {
          credits:     s.credits,
          enabled:     s.enabled,
          description: s.description ?? "",
          saving: false, saved: false, error: "",
        };
      });
      setRows(initial);
      setAuthed(true);
    } catch (e) {
      setFetchErr(e instanceof Error ? e.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Auth form submit ──────────────────────────────────────
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErr("");
    await fetchSettings(secret);
  };

  // ── Update a row field locally ────────────────────────────
  function updateRow(id: number, patch: Partial<RowState>) {
    setRows(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  // ── Save one row via PATCH ────────────────────────────────
  async function saveRow(s: CreditSetting) {
    const row = rows[s.id];
    if (!row) return;

    // Validate credits
    if (!Number.isInteger(row.credits) || row.credits < 0) {
      updateRow(s.id, { error: "Credits must be a whole number ≥ 0" });
      return;
    }

    updateRow(s.id, { saving: true, error: "", saved: false });

    try {
      const res = await fetch(`/api/admin/credit-settings/by-key/${s.key}`, {
        method:  "PATCH",
        headers: {
          "Content-Type":    "application/json",
          "x-admin-secret":  secret,
        },
        body: JSON.stringify({
          credits:     row.credits,
          enabled:     row.enabled,
          description: row.description,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        updateRow(s.id, { saving: false, error: json.error ?? "Save failed" });
        return;
      }

      // Update local settings list with returned data
      setSettings(prev =>
        prev.map(x => x.id === s.id ? { ...x, ...json.data } : x)
      );
      updateRow(s.id, { saving: false, saved: true, error: "" });

      // Clear ✓ after 2.5s
      setTimeout(() => updateRow(s.id, { saved: false }), 2500);

    } catch (e) {
      updateRow(s.id, {
        saving: false,
        error: e instanceof Error ? e.message : "Save failed",
      });
    }
  }

  // ── Group settings by category for display ────────────────
  const byCategory = settings.reduce<Record<string, CreditSetting[]>>((acc, s) => {
    const cat = s.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  // ─────────────────────────────────────────────────────────────────────────────
  // AUTH WALL
  // ─────────────────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: "#010408", display: "flex",
        alignItems: "center", justifyContent: "center", padding: "2rem",
      }}>
        <div style={{
          width: "100%", maxWidth: "400px",
          background: "rgba(4,12,28,.8)", border: "1px solid rgba(212,167,61,.18)",
          borderRadius: "16px", padding: "2.5rem",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: ".65rem", marginBottom: "2rem" }}>
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg,#D4A73D,#8B6820)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", color: "#010408" }}>BH</div>
            <div>
              <div style={{ fontSize: ".7rem", fontWeight: "700", color: "#EDE8DC", letterSpacing: ".06em" }}>BH DECO AI</div>
              <div style={{ fontSize: ".58rem", color: "#2E4060", letterSpacing: ".1em" }}>ADMIN PANEL</div>
            </div>
          </div>

          <h1 style={{ fontSize: "1.4rem", fontWeight: "600", color: "#EDE8DC", marginBottom: ".4rem" }}>
            Credits Management
          </h1>
          <p style={{ fontSize: ".8rem", color: "#7A8FA8", marginBottom: "2rem", lineHeight: 1.6 }}>
            Enter your admin secret to access credit settings.
          </p>

          <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: ".6rem", color: "#7A8FA8", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".5rem", fontFamily: "monospace" }}>
                Admin Secret
              </label>
              <input
                type="password"
                value={secret}
                onChange={e => setSecret(e.target.value)}
                placeholder="Enter ADMIN_SECRET"
                autoFocus
                style={{
                  width: "100%", padding: ".8rem 1rem",
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: "8px", color: "#EDE8DC", fontSize: ".9rem",
                  outline: "none", fontFamily: "monospace",
                  transition: "border-color .2s",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(212,167,61,.4)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.12)")}
              />
            </div>

            {authErr && (
              <div style={{ padding: ".75rem 1rem", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: "8px", fontSize: ".82rem", color: "#f87171" }}>
                {authErr}
              </div>
            )}

            <button
              type="submit"
              disabled={!secret.trim() || loading}
              style={{
                padding: ".9rem", borderRadius: "8px", border: "none",
                background: secret.trim() ? "linear-gradient(135deg,#D4A73D,#9A7020)" : "rgba(255,255,255,.06)",
                color: secret.trim() ? "#010408" : "#2E4060",
                fontWeight: "700", fontSize: ".8rem", letterSpacing: ".08em",
                textTransform: "uppercase", cursor: secret.trim() ? "pointer" : "not-allowed",
                transition: "all .2s",
              }}
            >
              {loading ? "Verifying..." : "Enter Dashboard →"}
            </button>
          </form>

          <p style={{ marginTop: "1.5rem", fontSize: ".7rem", color: "#2E4060", textAlign: "center", lineHeight: 1.6 }}>
            {/* TODO: Replace with Supabase JWT admin session check */}
            Set <code style={{ color: "#4A9EFF" }}>ADMIN_SECRET</code> in your <code style={{ color: "#4A9EFF" }}>.env.local</code>
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#010408", color: "#EDE8DC" }}>

      {/* ── Top bar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(1,4,8,.95)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        padding: ".9rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <div style={{ width: "30px", height: "30px", background: "linear-gradient(135deg,#D4A73D,#8B6820)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: "#010408" }}>BH</div>
          <span style={{ fontSize: ".78rem", color: "#7A8FA8", letterSpacing: ".06em" }}>Admin</span>
          <span style={{ color: "#2E4060" }}>›</span>
          <span style={{ fontSize: ".78rem", color: "#EDE8DC", fontWeight: "500" }}>Credits Management</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => fetchSettings(secret)}
            style={{ fontSize: ".7rem", color: "#7A8FA8", background: "none", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", padding: ".4rem .9rem", cursor: "pointer", transition: "border-color .2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,167,61,.3)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,.08)")}
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => { setAuthed(false); setSecret(""); setSettings([]); }}
            style={{ fontSize: ".7rem", color: "#7A8FA8", background: "none", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", padding: ".4rem .9rem", cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Page header ── */}
      <div style={{ padding: "3rem 2rem 2rem", maxWidth: "960px", margin: "0 auto" }}>
        <p style={{ fontFamily: "monospace", fontSize: ".58rem", color: "#D4A73D", letterSpacing: ".2em", marginBottom: ".6rem" }}>
          ADMIN · CREDITS
        </p>
        <h1 style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: "300", marginBottom: ".6rem", fontFamily: "'Cormorant Garant',serif" }}>
          Credits{" "}
          <span style={{ fontStyle: "italic", background: "linear-gradient(135deg,#F0C040,#D4A73D,#9A7020)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Management
          </span>
        </h1>
        <p style={{ color: "#7A8FA8", fontSize: ".9rem", lineHeight: 1.7 }}>
          Manage BH Credits pricing across AI, downloads, 3D models and future features.
          Changes apply immediately — no deploy required.
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginTop: "2rem" }}>
          {[
            { label: "Total Settings", value: settings.length },
            { label: "Enabled",        value: settings.filter(s => s.enabled).length },
            { label: "Disabled",       value: settings.filter(s => !s.enabled).length },
            { label: "Categories",     value: Object.keys(byCategory).length },
          ].map(stat => (
            <div key={stat.label} style={{ padding: ".8rem 1.25rem", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "10px" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: "600", color: "#D4A73D", lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: ".6rem", color: "#2E4060", letterSpacing: ".1em", textTransform: "uppercase", marginTop: ".3rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Error / loading ── */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 2rem" }}>
        {loading && (
          <div style={{ padding: "1rem", fontFamily: "monospace", fontSize: ".7rem", color: "#7A8FA8", letterSpacing: ".1em" }}>
            Loading credit settings…
          </div>
        )}
        {fetchErr && (
          <div style={{ padding: "1rem", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: "8px", fontSize: ".85rem", color: "#f87171" }}>
            {fetchErr}
          </div>
        )}
      </div>

      {/* ── Settings by category ── */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "1rem 2rem 6rem" }}>
        {Object.entries(byCategory).map(([cat, catSettings]) => (
          <div key={cat} style={{ marginBottom: "2.5rem" }}>

            {/* Category header */}
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
              <span style={{
                fontFamily: "monospace", fontSize: ".58rem", letterSpacing: ".14em",
                color: CATEGORY_COLORS[cat] ?? "#EDE8DC",
                background: `${CATEGORY_COLORS[cat] ?? "#EDE8DC"}14`,
                border: `1px solid ${CATEGORY_COLORS[cat] ?? "#EDE8DC"}28`,
                borderRadius: "100px", padding: ".2rem .7rem",
              }}>
                {(CATEGORY_LABELS[cat] ?? cat).toUpperCase()}
              </span>
              <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg,${CATEGORY_COLORS[cat] ?? "#EDE8DC"}30,transparent)` }} />
            </div>

            {/* Setting cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
              {catSettings.map(s => {
                const row = rows[s.id];
                if (!row) return null;
                const isDirty =
                  row.credits     !== s.credits     ||
                  row.enabled     !== s.enabled     ||
                  row.description !== (s.description ?? "");

                return (
                  <div
                    key={s.id}
                    style={{
                      background: "rgba(255,255,255,.02)",
                      border: `1px solid ${isDirty ? "rgba(212,167,61,.28)" : "rgba(255,255,255,.07)"}`,
                      borderRadius: "12px", padding: "1.5rem",
                      transition: "border-color .2s",
                    }}
                  >
                    {/* Card top row */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".65rem", marginBottom: ".3rem" }}>
                          <h3 style={{ fontSize: ".95rem", fontWeight: "600", color: "#EDE8DC" }}>{s.label}</h3>
                          {isDirty && (
                            <span style={{ fontFamily: "monospace", fontSize: ".52rem", color: "#D4A73D", background: "rgba(212,167,61,.1)", border: "1px solid rgba(212,167,61,.22)", borderRadius: "100px", padding: ".12rem .5rem", letterSpacing: ".08em" }}>
                              UNSAVED
                            </span>
                          )}
                        </div>
                        <code style={{ fontSize: ".7rem", color: "#4A9EFF", background: "rgba(74,158,255,.08)", padding: ".15rem .5rem", borderRadius: "4px" }}>
                          {s.key}
                        </code>
                        <div style={{ marginTop: ".4rem", fontSize: ".72rem", color: "#2E4060" }}>
                          Last saved: {formatDate(s.updated_at)}
                        </div>
                      </div>

                      {/* Enabled toggle */}
                      <div style={{ display: "flex", alignItems: "center", gap: ".6rem", flexShrink: 0 }}>
                        <span style={{ fontSize: ".7rem", color: "#7A8FA8" }}>
                          {row.enabled ? "Enabled" : "Disabled"}
                        </span>
                        <button
                          onClick={() => updateRow(s.id, { enabled: !row.enabled })}
                          title={row.enabled ? "Click to disable" : "Click to enable"}
                          style={{
                            width: "42px", height: "24px", borderRadius: "12px", border: "none",
                            background: row.enabled ? "#10B981" : "rgba(255,255,255,.1)",
                            cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0,
                          }}
                        >
                          <span style={{
                            position: "absolute", top: "3px",
                            left: row.enabled ? "21px" : "3px",
                            width: "18px", height: "18px", borderRadius: "50%",
                            background: "#fff", transition: "left .2s",
                          }} />
                        </button>
                      </div>
                    </div>

                    {/* Credits input + description */}
                    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "1rem", alignItems: "end" }}>
                      <div>
                        <label style={{ display: "block", fontFamily: "monospace", fontSize: ".58rem", color: "#7A8FA8", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".45rem" }}>
                          Credits Cost
                        </label>
                        <div style={{ position: "relative" }}>
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={row.credits}
                            onChange={e => {
                              const v = parseInt(e.target.value, 10);
                              updateRow(s.id, { credits: isNaN(v) ? 0 : v });
                            }}
                            style={{
                              width: "100%", padding: ".65rem .9rem",
                              background: "rgba(255,255,255,.04)",
                              border: "1px solid rgba(255,255,255,.1)",
                              borderRadius: "8px", color: "#EDE8DC",
                              fontSize: ".95rem", fontWeight: "600",
                              outline: "none", fontFamily: "monospace",
                              transition: "border-color .2s",
                            }}
                            onFocus={e => (e.target.style.borderColor = "rgba(212,167,61,.4)")}
                            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.1)")}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontFamily: "monospace", fontSize: ".58rem", color: "#7A8FA8", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".45rem" }}>
                          Description
                        </label>
                        <input
                          type="text"
                          value={row.description}
                          onChange={e => updateRow(s.id, { description: e.target.value })}
                          placeholder="Short description for admin reference"
                          style={{
                            width: "100%", padding: ".65rem .9rem",
                            background: "rgba(255,255,255,.04)",
                            border: "1px solid rgba(255,255,255,.1)",
                            borderRadius: "8px", color: "#EDE8DC",
                            fontSize: ".85rem", outline: "none", fontFamily: "inherit",
                            transition: "border-color .2s",
                          }}
                          onFocus={e => (e.target.style.borderColor = "rgba(212,167,61,.4)")}
                          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.1)")}
                        />
                      </div>
                    </div>

                    {/* Error */}
                    {row.error && (
                      <div style={{ marginTop: ".75rem", padding: ".6rem .9rem", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: "6px", fontSize: ".8rem", color: "#f87171" }}>
                        {row.error}
                      </div>
                    )}

                    {/* Save row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: ".75rem", marginTop: "1rem" }}>
                      {isDirty && (
                        <button
                          onClick={() => updateRow(s.id, {
                            credits:     s.credits,
                            enabled:     s.enabled,
                            description: s.description ?? "",
                            error: "",
                          })}
                          style={{ fontSize: ".72rem", color: "#7A8FA8", background: "none", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", padding: ".5rem 1rem", cursor: "pointer" }}
                        >
                          Discard
                        </button>
                      )}
                      <button
                        onClick={() => saveRow(s)}
                        disabled={row.saving || !isDirty}
                        style={{
                          padding: ".55rem 1.4rem", borderRadius: "7px", border: "none",
                          background: row.saved
                            ? "rgba(16,185,129,.15)"
                            : isDirty
                            ? "linear-gradient(135deg,#D4A73D,#9A7020)"
                            : "rgba(255,255,255,.05)",
                          color: row.saved ? "#10B981" : isDirty ? "#010408" : "#2E4060",
                          fontWeight: "700", fontSize: ".72rem", letterSpacing: ".08em",
                          textTransform: "uppercase",
                          cursor: isDirty && !row.saving ? "pointer" : "not-allowed",
                          transition: "all .2s", 
                        } as React.CSSProperties}
                      >
                        {row.saving ? "Saving…" : row.saved ? "✓ Saved" : "Save Changes"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── TODO notice ── */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 2rem 4rem" }}>
        <div style={{ padding: "1.25rem 1.5rem", background: "rgba(74,158,255,.05)", border: "1px solid rgba(74,158,255,.15)", borderRadius: "10px" }}>
          <p style={{ fontFamily: "monospace", fontSize: ".6rem", color: "#4A9EFF", letterSpacing: ".12em", marginBottom: ".4rem" }}>TODO — PHASE 3</p>
          <p style={{ fontSize: ".82rem", color: "#7A8FA8", lineHeight: 1.65 }}>
            Currently authenticated with <code style={{ color: "#4A9EFF" }}>ADMIN_SECRET</code> header.
            In Phase 3, replace with Supabase JWT session check — verify <code>profiles.role = 'admin'</code>
            from the user's session token, so any admin can log in with their account rather than a shared secret.
          </p>
        </div>
      </div>

      <style>{`
        input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }
        @media (max-width: 640px) {
          .credits-input-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
