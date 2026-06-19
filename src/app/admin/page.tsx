"use client";
import { useState } from "react";
import Link from "next/link";

const G = "#D4A73D";

const SECTIONS = [
  { href:"/admin/company",  icon:"🏢", label:"Company Settings",   desc:"Name, phone, email, address, social links" },
  { href:"/admin/models",   icon:"📦", label:"3D Models",          desc:"Upload and manage downloadable 3D model assets" },
  { href:"/admin/projects", icon:"🏡", label:"Projects",           desc:"Before/after project showcase management" },
  { href:"/admin/products", icon:"🔩", label:"Products",           desc:"C Channel, boards, flooring, wall materials" },
  { href:"/admin/credits",  icon:"⬡",  label:"Credits Settings",   desc:"AI render costs and feature pricing" },
];

export default function AdminHub() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [err,    setErr]    = useState("");

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/admin/credit-settings", {
      headers: { "x-admin-secret": secret },
    });
    if (res.status === 401) { setErr("Incorrect admin secret."); return; }
    if (res.ok) {
      sessionStorage.setItem("bh_admin_secret", secret);
      setAuthed(true);
    }
  };

  // Re-use stored secret across tab navigation
  if (!authed) {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("bh_admin_secret") : null;
    if (stored) { setSecret(stored); setAuthed(true); }
  }

  if (!authed) return (
    <div style={{ minHeight:"100vh",background:"#010408",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem" }}>
      <div style={{ width:"100%",maxWidth:"400px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(212,167,61,.18)",borderRadius:"16px",padding:"2.5rem" }}>
        <div style={{ display:"flex",alignItems:"center",gap:".65rem",marginBottom:"2rem" }}>
          <div style={{ width:"36px",height:"36px",background:`linear-gradient(135deg,${G},#8B6820)`,borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:"800",color:"#010408" }}>BH</div>
          <div>
            <div style={{ fontSize:".72rem",fontWeight:"700",color:"#EDE8DC",letterSpacing:".06em" }}>BH DECO AI</div>
            <div style={{ fontSize:".58rem",color:"#2E4060",letterSpacing:".1em" }}>ADMIN CMS</div>
          </div>
        </div>
        <h1 style={{ fontSize:"1.4rem",fontWeight:"600",color:"#EDE8DC",marginBottom:"1.5rem" }}>Admin Login</h1>
        <form onSubmit={verify} style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
          <input type="password" value={secret} onChange={e=>setSecret(e.target.value)}
            placeholder="Enter ADMIN_SECRET" autoFocus
            style={{ padding:".8rem 1rem",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"8px",color:"#EDE8DC",fontSize:".9rem",outline:"none",fontFamily:"monospace" }}
            onFocus={e=>(e.target.style.borderColor="rgba(212,167,61,.4)")}
            onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,.1)")}/>
          {err && <p style={{ fontSize:".8rem",color:"#f87171",padding:".6rem 1rem",background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"8px" }}>{err}</p>}
          <button type="submit" disabled={!secret}
            style={{ padding:".9rem",borderRadius:"8px",border:"none",background:secret?`linear-gradient(135deg,${G},#9A7020)`:"rgba(255,255,255,.06)",color:secret?"#010408":"#2E4060",fontWeight:"700",fontSize:".8rem",letterSpacing:".08em",textTransform:"uppercase",cursor:secret?"pointer":"not-allowed" }}>
            Enter CMS →
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:"#010408",color:"#EDE8DC",padding:"4rem 2rem" }}>
      <div style={{ maxWidth:"960px",margin:"0 auto" }}>
        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"3rem",flexWrap:"wrap",gap:"1rem" }}>
          <div>
            <p style={{ fontFamily:"monospace",fontSize:".58rem",color:G,letterSpacing:".18em",marginBottom:".4rem" }}>ADMIN · CMS</p>
            <h1 style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)",fontWeight:"300",fontFamily:"'Cormorant Garant',serif" }}>
              Content <span style={{ fontStyle:"italic",color:G }}>Management</span>
            </h1>
          </div>
          <button onClick={()=>{ sessionStorage.removeItem("bh_admin_secret"); setAuthed(false); setSecret(""); }}
            style={{ fontSize:".72rem",color:"#7A8FA8",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:"6px",padding:".5rem 1rem",cursor:"pointer" }}>
            Sign Out
          </button>
        </div>

        {/* Section grid */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"1rem" }}>
          {SECTIONS.map(s=>(
            <Link key={s.href} href={s.href}
              style={{ display:"block",padding:"1.75rem",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"12px",textDecoration:"none",transition:"all .25s" }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor="rgba(212,167,61,.3)"; (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.07)"; (e.currentTarget as HTMLElement).style.transform="none"; }}>
              <div style={{ fontSize:"2rem",marginBottom:"1rem" }}>{s.icon}</div>
              <h3 style={{ fontSize:"1rem",fontWeight:"600",color:"#EDE8DC",marginBottom:".4rem" }}>{s.label}</h3>
              <p style={{ fontSize:".78rem",color:"#7A8FA8",lineHeight:1.6 }}>{s.desc}</p>
              <p style={{ marginTop:"1rem",fontSize:".68rem",color:G }}>Open →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
