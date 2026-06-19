"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase, BHProfile } from "@/lib/supabase";
import en from "@/i18n/en.json";
import zh from "@/i18n/zh.json";
import my from "@/i18n/my.json";
import th from "@/i18n/th.json";

type Lang = "en" | "zh" | "my" | "th";
const LANGS = { en, zh, my, th };
const FLAGS: Record<Lang, [string, string]> = {
  en: ["🇺🇸", "EN"], zh: ["🇨🇳", "中文"], my: ["🇲🇲", "မြန်မာ"], th: ["🇹🇭", "ไทย"],
};

// ─── Language picker (unchanged from original) ────────────────────────────────
function LangPicker({ accent }: { accent: string }) {
  const [lang, setLang] = useState<Lang>("en");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { const s = localStorage.getItem("bh_lang") as Lang; if (s && LANGS[s]) setLang(s); } catch {}
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const change = (l: Lang) => {
    setLang(l);
    try { localStorage.setItem("bh_lang", l); } catch {}
    setOpen(false);
    window.dispatchEvent(new CustomEvent("bh_lang", { detail: l }));
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ display:"flex",alignItems:"center",gap:".4rem",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"6px",padding:".35rem .75rem",cursor:"pointer",color:"inherit",transition:"border-color .2s" }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}55`)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,.1)")}>
        <span style={{ fontSize: ".9rem" }}>{FLAGS[lang][0]}</span>
        <span className="mono" style={{ fontSize: ".6rem", color: "#7A8FA8" }}>{FLAGS[lang][1]}</span>
        <span style={{ fontSize: ".5rem", color: "#2E4060" }}>▾</span>
      </button>
      {open && (
        <div style={{ position:"absolute",top:"calc(100% + .5rem)",right:0,zIndex:999,background:"rgba(4,10,22,.97)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,.08)",borderRadius:"10px",overflow:"hidden",minWidth:"128px",boxShadow:"0 20px 60px rgba(0,0,0,.7)" }}>
          {(Object.entries(FLAGS) as [Lang, [string, string]][]).map(([l, [flag, name]]) => (
            <button key={l} onClick={() => change(l)} style={{ width:"100%",display:"flex",alignItems:"center",gap:".6rem",padding:".6rem 1rem",background:lang===l?`${accent}12`:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,.05)",cursor:"pointer",color:lang===l?accent:"#7A8FA8",fontFamily:"monospace",fontSize:".66rem",letterSpacing:".04em",transition:"background .15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = `${accent}12`)}
              onMouseLeave={e => (e.currentTarget.style.background = lang === l ? `${accent}12` : "transparent")}>
              <span style={{ fontSize: "1rem" }}>{flag}</span>{name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Credits badge ────────────────────────────────────────────────────────────
function CreditsBadge({ credits, accent }: { credits: number; accent: string }) {
  return (
    <Link href="/dashboard" style={{ display:"flex",alignItems:"center",gap:".4rem",background:`${accent}12`,border:`1px solid ${accent}30`,borderRadius:"6px",padding:".35rem .8rem",textDecoration:"none",transition:"all .2s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${accent}20`; (e.currentTarget as HTMLElement).style.borderColor = `${accent}55`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${accent}12`; (e.currentTarget as HTMLElement).style.borderColor = `${accent}30`; }}>
      <span style={{ fontSize: ".7rem" }}>⬡</span>
      <span className="mono" style={{ fontSize: ".62rem", color: accent, fontWeight: "600" }}>
        {credits.toLocaleString()}
      </span>
    </Link>
  );
}

// ─── User menu ────────────────────────────────────────────────────────────────
function UserMenu({ profile, accent, onSignOut }: { profile: BHProfile; accent: string; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const initial = (profile.full_name || profile.email || "U")[0].toUpperCase();

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ display:"flex",alignItems:"center",gap:".5rem",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"6px",padding:".3rem .6rem .3rem .3rem",cursor:"pointer",transition:"border-color .2s" }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}55`)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,.1)")}>
        <div style={{ width:"26px",height:"26px",borderRadius:"50%",background:`linear-gradient(135deg,${accent},#8B6820)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".65rem",fontWeight:"800",color:"#010408" }}>
          {initial}
        </div>
        <span style={{ fontSize: ".68rem", color: "#EDE8DC", maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {profile.full_name || profile.email?.split("@")[0]}
        </span>
        <span style={{ fontSize: ".5rem", color: "#2E4060" }}>▾</span>
      </button>

      {open && (
        <div style={{ position:"absolute",top:"calc(100% + .5rem)",right:0,zIndex:999,background:"rgba(4,10,22,.97)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,.08)",borderRadius:"10px",overflow:"hidden",minWidth:"200px",boxShadow:"0 20px 60px rgba(0,0,0,.7)" }}>
          {/* User info header */}
          <div style={{ padding:".9rem 1rem",borderBottom:"1px solid rgba(255,255,255,.06)" }}>
            <p style={{ fontSize:".78rem",color:"#EDE8DC",fontWeight:"500",marginBottom:".2rem" }}>
              {profile.full_name || "Account"}
            </p>
            <p style={{ fontSize:".65rem",color:"#2E4060" }}>{profile.email}</p>
          </div>
          {/* Menu items */}
          {[
            ["/dashboard",  "📊", "Dashboard"],
            ["/account",    "👤", "Account"],
            ["/dashboard/transactions", "📋", "Transactions"],
            ["/pricing",    "⬡",  "Buy Credits"],
          ].map(([href, icon, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              style={{ display:"flex",alignItems:"center",gap:".6rem",padding:".65rem 1rem",color:"#7A8FA8",textDecoration:"none",fontSize:".78rem",borderBottom:"1px solid rgba(255,255,255,.04)",transition:"all .15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#EDE8DC"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#7A8FA8"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <span style={{ fontSize: ".8rem" }}>{icon}</span>{label}
            </Link>
          ))}
          <button onClick={() => { setOpen(false); onSignOut(); }}
            style={{ width:"100%",display:"flex",alignItems:"center",gap:".6rem",padding:".65rem 1rem",color:"#7A8FA8",background:"none",border:"none",cursor:"pointer",fontSize:".78rem",transition:"all .15s",textAlign:"left" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ef4444"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,.06)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#7A8FA8"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <span style={{ fontSize: ".8rem" }}>↩</span> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar({ accent = "#D4A73D" }: { accent?: string }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [open,      setOpen]      = useState(false);
  const [t,         setT]         = useState(en);
  const [profile,   setProfile]   = useState<BHProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const path   = usePathname();
  const router = useRouter();

  // ── Scroll + language ──────────────────────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    const langFn = (e: Event) => { const l = (e as CustomEvent).detail as Lang; setT(LANGS[l]); };
    window.addEventListener("bh_lang", langFn);
    try { const s = localStorage.getItem("bh_lang") as Lang; if (s && LANGS[s]) setT(LANGS[s]); } catch {}
    return () => { window.removeEventListener("scroll", fn); window.removeEventListener("bh_lang", langFn); };
  }, []);

  // ── Auth state ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email ?? "");
      }
      setAuthReady(true);
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email ?? "");
      } else {
        setProfile(null);
      }
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (id: string, email: string) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, email, credits, is_paid, full_name, avatar_url")
        .eq("id", id)
        .single();
      setProfile(data ? { ...data, email: data.email || email } : {
        id, email, credits: 0, is_paid: false,
      });
    } catch {
      setProfile({ id, email, credits: 0, is_paid: false });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    router.push("/");
  };

  // ── Nav links (same as before, minus /recharge) ────────────────────────────
  const links: [string, string][] = [
    ["/", t.nav_home],
    ["/ai-design", t.nav_ai],
    ["/furniture", t.nav_furniture],
    ["/projects",  t.nav_projects],
    ["/products",  t.nav_products],
    ["/courses", t.nav_courses],
    ["/pricing", t.nav_pricing],
    ["/about", t.nav_about],
    ["/contact", t.nav_contact],
  ];

  const isActive = (href: string) => href === "/" ? path === "/" : path?.startsWith(href);

  // ── Right side: guest vs logged-in ────────────────────────────────────────
  const GuestActions = () => (
    <>
      <Link href="/login" style={{ fontSize:".72rem",color:"#7A8FA8",textDecoration:"none",padding:".38rem .72rem",borderRadius:"5px",transition:"color .2s",whiteSpace:"nowrap" }}
        onMouseEnter={e => (e.currentTarget.style.color = accent)}
        onMouseLeave={e => (e.currentTarget.style.color = "#7A8FA8")}>
        {t.nav_login}
      </Link>
      <a href="https://bh-deco-ai.vercel.app" target="_blank" rel="noopener noreferrer"
        className="btn-gold" style={{ padding:".52rem 1.2rem", fontSize:".7rem" }}>
        {t.nav_start}
      </a>
    </>
  );

  const LoggedInActions = () => (
    <>
      <CreditsBadge credits={profile!.credits} accent={accent} />
      <Link href="/dashboard" className="btn-gold" style={{ padding:".52rem 1.2rem", fontSize:".7rem" }}>
        Dashboard
      </Link>
      <UserMenu profile={profile!} accent={accent} onSignOut={handleSignOut} />
    </>
  );

  return (
    <>
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:300,height:"64px",transition:"all .4s",background:scrolled?"rgba(1,4,8,.95)":"transparent",backdropFilter:scrolled?"blur(28px)":"none",WebkitBackdropFilter:scrolled?"blur(28px)":"none",borderBottom:scrolled?`1px solid ${accent}15`:"1px solid transparent" }}>
        <div style={{ maxWidth:"1440px",margin:"0 auto",padding:"0 1.5rem",height:"100%",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration:"none",display:"flex",alignItems:"center",gap:".65rem",flexShrink:0 }}>
            <div style={{ width:"34px",height:"34px",background:`linear-gradient(135deg,${accent},#8B6820)`,borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:"800",color:"#010408",boxShadow:`0 4px 16px ${accent}44`,flexShrink:0 }}>BH</div>
            <div className="fd" style={{ fontSize:"1.15rem",fontWeight:"600",letterSpacing:".04em",color:"#EDE8DC" }}>DECO<span className="gt"> AI</span></div>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display:"flex",alignItems:"center",gap:"0",overflowX:"auto" }} className="bh-desk">
            {links.map(([href, label]) => (
              <Link key={href} href={href} style={{ padding:".38rem .72rem",fontSize:".72rem",color:isActive(href)?accent:"#7A8FA8",textDecoration:"none",borderRadius:"5px",transition:"all .2s",whiteSpace:"nowrap",fontWeight:isActive(href)?"500":"400" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = accent; (e.currentTarget as HTMLElement).style.background = `${accent}10`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isActive(href) ? accent : "#7A8FA8"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display:"flex",alignItems:"center",gap:".5rem",flexShrink:0 }}>
            <LangPicker accent={accent} />
            {/* Only render auth UI after session check to avoid flash */}
            {authReady && (profile ? <LoggedInActions /> : <GuestActions />)}
            {/* Mobile hamburger */}
            <button onClick={() => setOpen(!open)} className="bh-mob" aria-label="menu"
              style={{ background:"none",border:"none",cursor:"pointer",padding:".4rem",display:"none",flexDirection:"column",gap:"4px" }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display:"block",width:"20px",height:"1.5px",background:"#EDE8DC",borderRadius:"2px",transition:"all .3s",transform:open?i===0?"rotate(45deg) translate(4px,4px)":i===1?"scaleX(0)":"rotate(-45deg) translate(4px,-4px)":"none",opacity:open&&i===1?0:1 }} />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div style={{ position:"fixed",top:"64px",left:0,right:0,zIndex:299,background:"rgba(1,4,8,.97)",backdropFilter:"blur(24px)",borderBottom:`1px solid ${accent}12`,padding:open?"1.25rem 1.5rem 1.75rem":"0 1.5rem",maxHeight:open?"600px":"0",overflow:"hidden",transition:"all .35s cubic-bezier(.4,0,.2,1)" }}>
        <div style={{ display:"flex",flexDirection:"column",gap:".3rem" }}>
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              style={{ padding:".7rem .75rem",fontSize:".88rem",color:isActive(href)?accent:"#7A8FA8",textDecoration:"none",borderBottom:"1px solid rgba(255,255,255,.04)" }}>
              {label}
            </Link>
          ))}
          <div style={{ paddingTop:".75rem",display:"flex",flexDirection:"column",gap:".5rem" }}>
            {authReady && profile ? (
              <>
                <div style={{ padding:".7rem .75rem",fontSize:".78rem",color:"#7A8FA8",borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                  {profile.email} · <span style={{ color: accent }}>⬡ {profile.credits.toLocaleString()}</span>
                </div>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="btn-gold" style={{ width:"100%",justifyContent:"center" }}>
                  Dashboard →
                </Link>
                <button onClick={() => { setOpen(false); handleSignOut(); }}
                  style={{ width:"100%",padding:".7rem",fontSize:".75rem",color:"#7A8FA8",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:"4px",cursor:"pointer",letterSpacing:".06em",textTransform:"uppercase" }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}
                  style={{ width:"100%",padding:".7rem",fontSize:".75rem",color:"#7A8FA8",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:"4px",textAlign:"center",textDecoration:"none",letterSpacing:".06em",textTransform:"uppercase" }}>
                  {t.nav_login}
                </Link>
                <a href="https://bh-deco-ai.vercel.app" target="_blank" rel="noopener noreferrer"
                  onClick={() => setOpen(false)} className="btn-gold" style={{ width:"100%",justifyContent:"center" }}>
                  {t.nav_start} →
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:1100px){.bh-desk{display:none!important}.bh-mob{display:flex!important}}
        @media(min-width:1101px){.bh-mob{display:none!important}}
      `}</style>
    </>
  );
}
