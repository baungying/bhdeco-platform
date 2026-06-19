"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CompanySettings {
  id:            string;
  company_name:  string;
  phone:         string;
  email:         string;
  address:       string;
  whatsapp:      string;
  facebook_url:  string;
  tiktok_url:    string;
  youtube_url:   string;
  instagram_url: string;
  about:         string;
  updated_at:    string;
}

const EMPTY: Omit<CompanySettings, "id" | "updated_at"> = {
  company_name: "", phone: "", email: "", address: "",
  whatsapp: "", facebook_url: "", tiktok_url: "", youtube_url: "", instagram_url: "",
  about: "",
};

// ─── Field definitions ────────────────────────────────────────────────────────
const FIELDS: { key: keyof Omit<CompanySettings,"id"|"updated_at">; label: string; placeholder: string; wide?: boolean; textarea?: boolean }[] = [
  { key: "company_name",  label: "Company Name",  placeholder: "Blessing Home Construction & Interior Design", wide: true },
  { key: "phone",         label: "Phone",         placeholder: "+95 9 000 000 000" },
  { key: "email",         label: "Email",         placeholder: "hello@bhdeco.ai" },
  { key: "address",       label: "Address",       placeholder: "Mandalay, Myanmar", wide: true },
  { key: "whatsapp",      label: "WhatsApp",      placeholder: "+95 9 000 000 000" },
  { key: "facebook_url",  label: "Facebook URL",  placeholder: "https://facebook.com/bhdecai" },
  { key: "tiktok_url",    label: "TikTok URL",    placeholder: "https://tiktok.com/@bhdecai" },
  { key: "youtube_url",   label: "YouTube URL",   placeholder: "https://youtube.com/@bhdecai" },
  { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/bhdecai" },
  { key: "about",         label: "About (short paragraph)", placeholder: "Blessing Home is Myanmar's premier...", wide: true, textarea: true },
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminCompanyPage() {
  const [secret,  setSecret]  = useState("");
  const [authed,  setAuthed]  = useState(false);
  const [authErr, setAuthErr] = useState("");

  const [data,      setData]      = useState({ ...EMPTY });
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [fetchErr,  setFetchErr]  = useState("");
  const [saveErr,   setSaveErr]   = useState("");

  // ── Fetch ──────────────────────────────────────────────────
  const fetchData = useCallback(async (s: string) => {
    setLoading(true); setFetchErr("");
    try {
      const res = await fetch("/api/admin/company", {
        headers: { "x-admin-secret": s },
      });
      if (res.status === 401) { setAuthed(false); setAuthErr("Incorrect admin secret."); return; }
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      if (json.data) {
        const { id: _id, updated_at, ...rest } = json.data as CompanySettings;
        // Ensure every field is a string — null from DB becomes ""
        const safe = Object.fromEntries(
          Object.entries({ ...EMPTY, ...rest }).map(([k, v]) => [k, v ?? ""])
        ) as Omit<CompanySettings, "id" | "updated_at">;
        setData(safe);
        setUpdatedAt(updated_at ?? null);
      }
      setAuthed(true);
    } catch (e) {
      setFetchErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Auth ───────────────────────────────────────────────────
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setAuthErr("");
    await fetchData(secret);
  };

  // ── Save ───────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setSaveErr(""); setSaved(false);
    try {
      const res = await fetch("/api/admin/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setSaveErr(json.error ?? "Save failed"); return; }
      if (json.data?.updated_at) setUpdatedAt(json.data.updated_at);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const inpStyle: React.CSSProperties = {
    width: "100%", padding: ".8rem 1rem",
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: "8px", color: "#EDE8DC", fontSize: ".88rem",
    outline: "none", fontFamily: "inherit", transition: "border-color .2s",
    boxSizing: "border-box",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "rgba(212,167,61,.4)");
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,.12)");

  // ═══════════════════════════════════════════════════════════
  // AUTH WALL — identical pattern to /admin/credits
  // ═══════════════════════════════════════════════════════════
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#010408", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "400px", background: "rgba(4,12,28,.8)", border: "1px solid rgba(212,167,61,.18)", borderRadius: "16px", padding: "2.5rem" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: ".65rem", marginBottom: "2rem" }}>
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg,#D4A73D,#8B6820)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", color: "#010408" }}>BH</div>
            <div>
              <div style={{ fontSize: ".7rem", fontWeight: "700", color: "#EDE8DC", letterSpacing: ".06em" }}>BH DECO AI</div>
              <div style={{ fontSize: ".58rem", color: "#2E4060", letterSpacing: ".1em" }}>ADMIN PANEL</div>
            </div>
          </div>

          <h1 style={{ fontSize: "1.4rem", fontWeight: "600", color: "#EDE8DC", marginBottom: ".4rem" }}>
            Company Settings
          </h1>
          <p style={{ fontSize: ".8rem", color: "#7A8FA8", marginBottom: "2rem", lineHeight: 1.6 }}>
            Enter your admin secret to edit company information.
          </p>

          <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: ".6rem", color: "#7A8FA8", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".5rem", fontFamily: "monospace" }}>
                Admin Secret
              </label>
              <input type="password" value={secret} onChange={e => setSecret(e.target.value)}
                placeholder="Enter ADMIN_SECRET" autoFocus style={inpStyle}
                onFocus={onFocus} onBlur={onBlur} />
            </div>

            {authErr && (
              <div style={{ padding: ".75rem 1rem", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: "8px", fontSize: ".82rem", color: "#f87171" }}>
                {authErr}
              </div>
            )}

            <button type="submit" disabled={!secret.trim() || loading}
              style={{ padding: ".9rem", borderRadius: "8px", border: "none", background: secret.trim() ? "linear-gradient(135deg,#D4A73D,#9A7020)" : "rgba(255,255,255,.06)", color: secret.trim() ? "#010408" : "#2E4060", fontWeight: "700", fontSize: ".8rem", letterSpacing: ".08em", textTransform: "uppercase", cursor: secret.trim() ? "pointer" : "not-allowed", transition: "all .2s" }}>
              {loading ? "Loading..." : "Enter Dashboard →"}
            </button>
          </form>

          <p style={{ marginTop: "1.5rem", fontSize: ".7rem", color: "#2E4060", textAlign: "center", lineHeight: 1.6 }}>
            Set <code style={{ color: "#4A9EFF" }}>ADMIN_SECRET</code> in <code style={{ color: "#4A9EFF" }}>.env.local</code>
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: "100vh", background: "#010408", color: "#EDE8DC" }}>

      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(1,4,8,.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,.06)", padding: ".9rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <div style={{ width: "30px", height: "30px", background: "linear-gradient(135deg,#D4A73D,#8B6820)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "800", color: "#010408" }}>BH</div>
          <Link href="/admin" style={{ fontSize: ".78rem", color: "#7A8FA8", textDecoration: "none" }}>Admin</Link>
          <span style={{ color: "#2E4060" }}>›</span>
          <span style={{ fontSize: ".78rem", color: "#EDE8DC", fontWeight: "500" }}>Company Settings</span>
        </div>
        <button onClick={() => { setAuthed(false); setSecret(""); }}
          style={{ fontSize: ".7rem", color: "#7A8FA8", background: "none", border: "1px solid rgba(255,255,255,.08)", borderRadius: "6px", padding: ".4rem .9rem", cursor: "pointer" }}>
          Sign Out
        </button>
      </div>

      {/* Page body */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "3rem 2rem 6rem" }}>
        <p style={{ fontFamily: "monospace", fontSize: ".58rem", color: "#D4A73D", letterSpacing: ".2em", marginBottom: ".6rem" }}>ADMIN · COMPANY</p>
        <h1 style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: "300", marginBottom: ".5rem", fontFamily: "'Cormorant Garant',serif" }}>
          Company <span style={{ fontStyle: "italic", color: "#D4A73D" }}>Settings</span>
        </h1>
        {updatedAt && (
          <p style={{ fontSize: ".7rem", color: "#2E4060", marginBottom: "2.5rem" }}>
            Last saved: {formatDate(updatedAt)}
          </p>
        )}

        {fetchErr && (
          <div style={{ padding: "1rem", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: "8px", fontSize: ".85rem", color: "#f87171", marginBottom: "1.5rem" }}>
            {fetchErr}
          </div>
        )}

        {loading ? (
          <p style={{ fontFamily: "monospace", fontSize: ".7rem", color: "#7A8FA8", letterSpacing: ".1em" }}>Loading…</p>
        ) : (
          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {FIELDS.map(f => (
                <div key={f.key} style={{ gridColumn: f.wide ? "1 / -1" : "auto" }}>
                  <label style={{ display: "block", fontFamily: "monospace", fontSize: ".58rem", color: "#7A8FA8", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: ".45rem" }}>
                    {f.label}
                  </label>
                  {f.textarea ? (
                    <textarea
                      value={data[f.key] ?? ""}
                      onChange={e => setData(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      rows={4}
                      style={{ ...inpStyle, resize: "vertical" } as React.CSSProperties}
                      onFocus={onFocus as never} onBlur={onBlur as never}
                    />
                  ) : (
                    <input
                      type="text"
                      value={data[f.key] ?? ""}
                      onChange={e => setData(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={inpStyle}
                      onFocus={onFocus} onBlur={onBlur}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Errors */}
            {saveErr && (
              <div style={{ marginTop: "1.25rem", padding: ".75rem 1rem", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: "8px", fontSize: ".82rem", color: "#f87171" }}>
                {saveErr}
              </div>
            )}

            {/* Save button */}
            <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <button type="submit" disabled={saving}
                style={{ padding: ".75rem 2rem", borderRadius: "8px", border: saved ? "1px solid rgba(16,185,129,.3)" : "none", background: saved ? "rgba(16,185,129,.15)" : "linear-gradient(135deg,#D4A73D,#9A7020)", color: saved ? "#10B981" : "#010408", fontWeight: "700", fontSize: ".8rem", letterSpacing: ".08em", textTransform: "uppercase", cursor: saving ? "wait" : "pointer", transition: "all .2s" } as React.CSSProperties}>
                {saving ? "Saving…" : saved ? "✓ Saved" : "Save Settings"}
              </button>
              <Link href="/admin" style={{ fontSize: ".78rem", color: "#7A8FA8", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#D4A73D")}
                onMouseLeave={e => (e.currentTarget.style.color = "#7A8FA8")}>
                ← Back to Admin
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
